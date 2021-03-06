'use strict';

const ApiVersion = require('../config/api-version');
const ReferralController = require('../controllers/referral-controller');
const log = require('../utils/logger').child({
  module: 'referral-routes'
});

class ReferralRoutes {

  static setup(app) {

    app.get({
      path: '/referral/url', version: ApiVersion.v1
    }, ReferralRoutes.getReferUrl);

    app.post({
      path: '/referral/from/:socialId',
      version: ApiVersion.v1
    }, ReferralRoutes.referralFrom);

  }

  static getReferUrl(req, res) {
    /** @type {{utm_campaign}} */
    const params = req.params;
    const utmCampaign = params.utm_campaign;

    const socialId = req.username;

    return ReferralController.getReferUrl(socialId, utmCampaign)
      .then(url => {
        res.cache('private', {maxAge: 43200}); // 12 hrs
        res.json({success: true, url});
      })
      .catch(err => res.json({success: false, error: err.message}));
  }

  static referralFrom(req, res) {
    /** @type {{socialId}} */
    const params = req.params;
    const referrerSocialId = params.socialId;
    const newUserSocialId = req.username;
    if (!referrerSocialId) return res.send({success: false, error: 'socialId is empty'});

    return ReferralController.referralInstalled(referrerSocialId, newUserSocialId)
      .then(() => res.send({success: true}))
      .catch(err => {
        log.error(err);
        res.send({success: false, error: err.message});
      });
  }

}

module.exports = ReferralRoutes;

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

    app.post({
      path: '/referral/pushReferral',
      version: ApiVersion.v1
    }, ReferralRoutes.pushReferNotif);

    app.get({path: '/referral/t&c', version: ApiVersion.v1}, ReferralRoutes.termsAndConditions);

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
    if (!referrerSocialId) {
      log.error(new Error('socialId is empty'));
      return res.json({success: false, error: 'socialId is empty'});
    }

    return ReferralController.referralInstalled(referrerSocialId, newUserSocialId)
      .then(() => res.json({success: true}))
      .catch(err => {
        log.error(err);
        res.json({success: false, error: err.message});
      });
  }

  /**
   * Sends a notif back to the same user explaining the new Referral program
   */
  static pushReferNotif(req, res) {
    const userToken = req.authorization.basic.password;
    return ReferralController.pushReferAndEarnNotif(userToken)
      .then(() => res.json({success: true}))
      .catch(err => {
        log.error(err);
        res.json({success: false, error: err.message});
      });
  }

  static termsAndConditions(req, res) {
    return ReferralController.termsAndConditions()
      .then(tc => {
        res.cache('private', {maxAge: 43200}); // 12 hrs
        res.json(tc);
      })
      .catch(err => {
        log.error(err);
        res.send(err);
      });
  }

  static getLogger() {
    return log;
  }
}

module.exports = ReferralRoutes;

'use strict';

const Promise = require('bluebird');
const PushController = require('./push-controller');
var UserDao = require('../dao/user-dao.js');

class ReferralController {

  /**
   * Get the URL that the user will share with his friends
   * @param socialId Social Id of the user
   * @param utmCampaign The current campaign running
   * @return {Promise.<string>}
   */
  static getReferUrl(/*string*/ socialId, /*string*/ utmCampaign) {
    const yolobotsUrl = `https://www.yolobots.com/refer/${socialId}`;
    const androidPackageName = 'com.stayyolo.app.dev';
    const androidMinVersionCode = '150000205';

    // UTM params
    const utmSource = socialId;
    const utmMedium = 'referral';

    // it's encoded to cover the edge cases where there's a space in the campaign name
    utmCampaign = encodeURIComponent(utmCampaign);

    const url = `https://tj3b4.app.goo.gl/?link=${yolobotsUrl}&apn=${androidPackageName}`
      + `&amv=${androidMinVersionCode}`
      + `&utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    return Promise.resolve(url);
  }

  /**
   * Whenever user B installs app with user A's referral, B sends a request to let the server know
   * This method sends a notification to user A, saying that this guy has installed the app using your referral
   * @param referrerSocialId Social Id of user A
   * @param newUserSocialId Social Id of user B
   */
  static referralInstalled(/*string*/ referrerSocialId, /*string*/ newUserSocialId) {
    return Promise.props({
      referrer: UserDao.findUserWithSocialId(referrerSocialId),
      newUser: UserDao.findUserWithSocialId(newUserSocialId)
    }).then((/*{referrer, newUser}*/ users) => {
      if (!users.referrer) throw new Error(`Referrer is empty, socialId: ${referrerSocialId}`);
      if (!users.newUser) throw new Error(`newUser is empty, socialId: ${newUserSocialId}`);
      PushController.pushReferralInstalled(users.referrer._id.toString(), users.newUser.name);
    });
  }

}

module.exports = ReferralController;

'use strict';

const Promise = require('bluebird');
const Bitly = require('bitly');
const PushController = require('./push-controller');
const UserDao = require('../dao/user-dao');
const OneSignalDao = require('../dao/onesignal-dao');

const bitly = new Bitly('4f6170004f03bed5ed5e05c7240f88e6ce5038ab');

class ReferralController {

  /**
   * Get the URL that the user will share with his friends
   * @param socialId Social Id of the user
   * @param utmCampaign The current campaign running
   * @return {Promise.<string>}
   */
  static getReferUrl(/*string*/ socialId, /*string*/ utmCampaign) {
    const yolobotsUrl = `https://www.yolobots.com/refer/${socialId}`;
    let androidPackageName = 'com.stayyolo.app';
    if (process.env.NODE_ENV === 'development') androidPackageName += '.dev';
    const androidMinVersionCode = '150000205';

    // UTM params
    const utmSource = socialId;
    const utmMedium = 'referral';
    const fullUtm = `utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;

    // it's encoded to cover the edge cases where there's a space in the campaign name
    utmCampaign = encodeURIComponent(utmCampaign);

    const desktopUrl = encodeURIComponent(`${yolobotsUrl}?${fullUtm}`);
    const url = `https://tj3b4.app.goo.gl/?link=${desktopUrl}&apn=${androidPackageName}`
      + `&amv=${androidMinVersionCode}&al=${yolobotsUrl}`
      + `&${fullUtm}`;
    console.log(url);

    //noinspection JSUnresolvedFunction
    return bitly.shorten(url).then(result => result.data.url);
  }

  /**
   * Whenever user B installs app with user A's referral, B sends a request to let the server know
   * This method sends a notification to user A, saying that this guy has installed the app using your referral
   * @param referrerSocialId Social Id of user A
   * @param newUserSocialId Social Id of user B
   */
  static referralInstalled(/*string*/ referrerSocialId, /*string*/ newUserSocialId) {
    if (referrerSocialId === newUserSocialId) return Promise.resolve();
    return Promise.props({
      referrer: UserDao.findUserWithSocialId(referrerSocialId),
      newUser: UserDao.findUserWithSocialId(newUserSocialId)
    }).then((/*{referrer, newUser}*/ users) => {
      if (!users.referrer) throw new Error(`Referrer is empty, socialId: ${referrerSocialId}`);
      if (!users.newUser) throw new Error(`newUser is empty, socialId: ${newUserSocialId}`);
      PushController.pushReferralInstalled(users.referrer._id.toString(), users.newUser.name);
    });
  }

  /**
   * Push a notif to user which explains the new Referral Program
   * @param userToken The user token to whom the notif should be sent
   * @return {Promise<>}
   */
  static pushReferAndEarnNotif(/*string*/ userToken) {
    return OneSignalDao.getPlayerIds([userToken])
      .then(oneSignalIds => {
        return PushController.pushDynamicNotif({
          botHandle: '@refer',
          title: 'Win movie tickets!',
          content: 'Refer your friends and win movie tickets',
          bigPicture: 'https://s3-ap-southeast-1.amazonaws.com/promo-assets-yolobots/refer/refer-info-notif.png'
        }, oneSignalIds);
      });
  }

  /**
   * Returns the points of the Terms & Conditions of the referral
   * @return {Promise<Array<string>>}
   */
  static termsAndConditions() {
    //noinspection Eslint
    return Promise.resolve([
      'BookMyShow voucher worth Rs. 250 will be given away as winning Prize',
      'Your friend must download the app and install using referral link given to you',
      'Only after your friend logs in, the referral would be considered successful',
      'With each referral your chance of winning increases',
      'This is a weekly contest, the winner will be announced every Sunday',
      'Yolobots reserves the right to, without liability or prejudice to any of its other ' +
      'rights, at any time, without previous notice and from time to time, withdraw/suspend/amend/cancel this Offer, with or without any reason',
      'Yolobots reserves the right to, without liability or prejudice to any of its other rights, at any time, without previous notice and from time to time, cancel referral credit/prize, with or without any reason',
      'Yolobots has the sole discretion to change, suspend or modify the Offer or these terms and conditions at any time without prior notice, at its sole discretion'
    ]);
  }
}

module.exports = ReferralController;

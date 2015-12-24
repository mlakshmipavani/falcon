'use strict';

/**
 * A helper class that helps to send notifications through parse
 */

var Parse = require('parse/node').Parse;
var log = require('../utils/logger').child({
  module: 'parsepush'
});

// these are the keys for development version
// do replace them in production
Parse.initialize(
  'fgB84Ys3NFBnkAAQB9C0AU5NSOzaT0efswXW8qrd', // applicationId
  'PeQzYq2UOustwR5TwHkIPyCcLXnU3uUBH8vAJgRJ' // javaScriptKey
);

let pushCallbacks = {
  success: () => log.debug('parse success'),
  error: (error) => log.error('parse error', error)
};

class ParseController {

  /**
   * Sends a notification to a device
   *
   * <b>NOTE : </b> This notification is visible in the notification drawer
   *
   * <b>NOTE : </b> This function should <b>ONLY</b> be used for testing purposes
   * @param {string} msg - the message in plain text to send to the user
   *
   * @example
   * parsepush.sendNotif('hey!');
   */
  static sendNotif(msg) {
    if (!msg) return;
    Parse.Push.send({
      where: new Parse.Query(Parse.Installation),
      data: {alert: msg}
    }, pushCallbacks);
  }

  /**
   * Sends a test message that doesn't show up on the notification drawer, but calls some code
   * inside the BroadCastReceiver
   */
  static sendTestJson() {
    Parse.Push.send({
      //channels: ['user_' + token],
      where: new Parse.Query(Parse.Installation),
      data: {action: 'com.stayyolo.PUSH.TEST'}
    }, pushCallbacks);
  }

  /**
   * Sends some json to the user
   * @param userToken User's Token (the id generated by mongo _id)
   * @param response Whatever json that you want to send the user
   */
  static sendBotResponse(/* String */ userToken, response) {
    Parse.Push.send({
      channels: [`user_${userToken}`],
      data: Object.assign({action: 'com.stayyolo.PUSH.BOT_REPLY'}, response),
    }, pushCallbacks);
  }

  /**
   * @param userTokens Array of userids to whom bot wants to send
   * @param msg message to be sent
   * @returns {Parse.Promise}
   */
  static sendBotPushtoUsers(userTokens , msg) {
    let channels = userTokens.map(token =>  `user_${token}`);
    return Parse.Push.send({
      channels: channels,
      data: Object.assign({action:'com.stayyolo.PUSH.BOT_PUSH'},msg)
    });
  }

}

module.exports = ParseController;

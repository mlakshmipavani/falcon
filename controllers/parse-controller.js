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

  static sendBotResponse(/* string */ userToken, /* string */ botHandle, /* string */ body, /* string */ msgId) {
    Parse.Push.send({
      channels: [`user_${userToken}`],
      data: {action: 'com.stayyolo.PUSH.BOT_REPLY', botHandle, body, msgId}
    }, pushCallbacks);
  }
}

module.exports = ParseController;

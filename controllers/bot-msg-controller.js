'use strict';

const request = require('request-promise');

const config = require('../config/config.js');
const HelloController = require('./hello-controller.js');

/**
 * A controller that stores the msg sent by a user
 * and forwards it to the Bot Server
 */
class BotMsgController {

  /**
   * Sends a msg to the bot in BotServer and gets the response
   * @param mobNumber Mobile number of the user sending this request
   * @param botHandle Handle of the bot to send the msg to
   * @param body Actual msg content
   * @returns {Promise.<string>}
   */
  static msg(/*String*/ mobNumber, /* string */ botHandle, /* string */ body) {
    switch (botHandle) {
      case HelloController.handle:
        return HelloController.reply(mobNumber, body);
      default:
        return Promise.reject(new Error('Unknown bot handle'));
    }
  }
}

module.exports = BotMsgController;

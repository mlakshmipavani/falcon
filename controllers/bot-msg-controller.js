'use strict';

var request = require('request-promise');

var config = require('../config/config.js');
var UserMsgDao = require('../dao/user-msg-dao.js');
var ParseController = require('./parse-controller.js');

/**
 * A controller that stores the msg sent by a user
 * and forwards it to the Bot Server
 */
class BotMsgController {

  /**
   * Sends a msg to the bot in BotServer and gets the response
   * @param userToken Token of the user to whom this msg should go
   * @param botHandle Handle of the bot to send the msg to
   * @param body Actual msg content
   * @returns {*}
   */
  static msg(/* string */ userToken, /* string */ botHandle, /* string */ body) {
    var requestOptions = {url: `${config.botServerUrl}${botHandle}`, form: {body}, json: true};

    // send the response back to the client
    return request.post(requestOptions).then(response => {
      ParseController.sendBotResponse(userToken, botHandle, response, Math.random().toString(36).substring(7));
    });
  }
}

module.exports = BotMsgController;

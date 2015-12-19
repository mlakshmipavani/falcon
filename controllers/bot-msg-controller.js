'use strict';

var request = require('request-promise');

var config = require('../config/config.js');
var UserMsgDao = require('../dao/user-msg-dao.js');

/**
 * A controller that stores the msg sent by a user
 * and forwards it to the Bot Server
 */
class BotMsgController {

  static msg(/* string */ mobNumber, /* string */ botHandle, /* string */ body) {

    return UserMsgDao.insert(mobNumber, botHandle, body)
      .then(/* UserMsg */ userMsgObj => {
        return {_id: userMsgObj._id.toString()};
        // TODO : send a request to the bot server and get the result
      });

    //var requestOptions = {url: `${config.botServerUrl}${botHandle}`, form: {body}, json: true};
    //
    //// send the response back to the client
    //return request.post(requestOptions).then(response => {
    //  return {_id: Math.random().toString(36).substring(7), body: response, type: 0};
    //});
  }
}

module.exports = BotMsgController;

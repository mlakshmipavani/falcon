'use strict';

var request = require('request-promise');
var apiVersion = require('../config/api-version.js');
var config = require('../config/config.js');
var ErrorController = require('../controllers/error-controller.js');
var BotMsgController = require('../controllers/bot-msg-controller.js');
var UserMsgDao = require('../dao/user-msg-dao.js');
var BotMsgDao = require('../dao/bot-msg-dao.js');

/**
 * A route that forwards a message to the respective bot
 */
class BotMsgRoutes {

  static setup(app) {

    app.post({path: '/msg/:botHandle', version: apiVersion.v1}, (req, res) => {

      // error checking
      req.assert('botHandle', 'botHandle is a required param').notEmpty();
      req.assert('body', 'body is a required param').notEmpty();
      let errors = req.validationErrors();
      if (errors) return ErrorController.paramError(req, res, errors);

      //noinspection JSUnresolvedVariable
      let botHandle = req.params.botHandle;
      let body = req.params.body;
      let mobNumber = req.username;

      return UserMsgDao.insert(mobNumber, botHandle, body)
        .then(/* UserMsg */ userMsgObj => res.json({_id: userMsgObj._id.toString()}));
    });

    app.get({path: '/botReply/:msgId', version: apiVersion.v1}, (req, res) => {

      // error checking
      req.assert('msgId', 'msgId is a required param').notEmpty();

      //noinspection JSUnresolvedVariable
      let msgId = req.params.msgId;
      let mobNumber = req.username;
      let botHandle;

      return UserMsgDao.getMsg(msgId)
        .then(/* UserMsg */ userMsg => {
          if (userMsg.mobNumber !== mobNumber)
            throw ErrorController.logAndReturnError(
              `${mobNumber} is asking reply for msg[${msgId}] sent by ${userMsg.mobNumber}`);
          botHandle = userMsg.botHandle;
          return BotMsgController.msg(userMsg.botHandle, userMsg.body);
        })
        .then((/* string */ botResponse) =>
          BotMsgDao.insert(mobNumber, botHandle, botResponse, msgId))
        .then(/* BotMsg */ doc => {
          let response = {_id: doc._id, body: doc.body, createdAt: doc.createdAt.getTime()};
          res.json(response);
        });
    });
  }
}

module.exports = BotMsgRoutes;

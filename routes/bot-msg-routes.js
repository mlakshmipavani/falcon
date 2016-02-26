'use strict';

const request = require('request-promise');
const apiVersion = require('../config/api-version');
const config = require('../config/config');
const ErrorController = require('../controllers/error-controller');
const BotMsgController = require('../controllers/bot-msg-controller');
const UserMsgDao = require('../dao/user-msg-dao');
const BotMsgDao = require('../dao/bot-msg-dao');

/**
 * A route that forwards a message to the respective bot
 */
class BotMsgRoutes {

  static setup(app) {

    app.post({path: '/msg/:botHandle', version: apiVersion.v1}, (req, res) => {

      // error checking
      req.assert('botHandle', 'botHandle is a required param').notEmpty();
      req.assert('body', 'body is a required param').notEmpty();
      const errors = req.validationErrors();
      if (errors) return ErrorController.paramError(req, res, errors);

      //noinspection JSUnresolvedVariable
      const botHandle = req.params.botHandle;
      const body = req.params.body;
      const socialId = req.username;

      return UserMsgDao.insert(socialId, botHandle, body)
        .then(/* UserMsg */ userMsgObj => res.json({_id: userMsgObj._id.toString()}));
    });

    app.get({path: '/botReply/:msgId', version: apiVersion.v1}, (req, res) => {

      // error checking
      req.assert('msgId', 'msgId is a required param').notEmpty();

      //noinspection JSUnresolvedVariable
      const msgId = req.params.msgId;
      const socialId = req.username;
      let botHandle;

      return UserMsgDao.getMsg(msgId)
        .then(/* UserMsg */ userMsg => {
          if (userMsg.socialId !== socialId)
            throw ErrorController.logAndReturnError(
              `${socialId} is asking reply for msg[${msgId}] sent by ${userMsg.socialId}`);
          botHandle = userMsg.botHandle;
          return BotMsgController.msg(socialId, userMsg.botHandle, userMsg.body);
        })
        .tap((/* string */ botResponse) => {
          if (!botResponse) throw new Error('no bot response');
        })
        .then((/* string */ botResponse) =>
          BotMsgDao.insert(socialId, botHandle, botResponse, msgId))
        .then(/* BotMsg */ doc => {
          const response = {_id: doc._id, body: doc.body, createdAt: doc.createdAt.getTime()};
          res.json(response);
        }).catch(err => {
          if (err.message !== 'no bot response') throw err;
        });
    });

  }
}

module.exports = BotMsgRoutes;

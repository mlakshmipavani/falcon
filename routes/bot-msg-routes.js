'use strict';

var request = require('request-promise');
var apiVersion = require('../config/api-version.js');
var config = require('../config/config.js');
var ErrorController = require('../controllers/error-controller.js');
var BotMsgController = require('../controllers/bot-msg-controller.js');
var UserMsgDao = require('../dao/user-msg-dao.js');
var BotMsgDao = require('../dao/bot-msg-dao.js');
var UserDao = require('../dao/user-dao.js');
var ParseController = require('../controllers/parse-controller.js');

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
          return BotMsgController.msg(mobNumber, userMsg.botHandle, userMsg.body);
        })
        .tap((/* string */ botResponse) => {
          if (!botResponse) throw new Error('no bot response');
        })
        .then((/* string */ botResponse) =>
          BotMsgDao.insert(mobNumber, botHandle, botResponse, msgId))
        .then(/* BotMsg */ doc => {
          let response = {_id: doc._id, body: doc.body, createdAt: doc.createdAt.getTime()};
          res.json(response);
        }).catch(err => {
          if (err.message !== 'no bot response') throw err;
        });
    });

    //for bot pushing messages to user
    app.post({path: '/botPush', version: apiVersion.v1}, (req, res) => {

      let hashOfIds = JSON.parse(req.body.hashOfIds);

      UserDao.getUserIdsFromHashIds(hashOfIds).then(userIds => {
        ParseController.sendBotPushtoUsers(userIds, 'helelo')
          .then(parseResponse =>res.json(parseResponse),
            error => res.send('error !!!')
          );
      });
    });

  }
}

module.exports = BotMsgRoutes;

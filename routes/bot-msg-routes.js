'use strict';

var request = require('request-promise');
var apiVersion = require('../config/api-version.js');
var config = require('../config/config.js');
var ErrorController = require('../controllers/error-controller.js');
var BotMsgController = require('../controllers/bot-msg-controller.js');
var UserMsgDao = require('../dao/user-msg-dao.js');

/**
 * A route that forwards a message to the respective bot
 */
class BotMsgRoutes {

  static setup(app) {

    app.post({path: '/msg/:botHandle', version: apiVersion.v1}, (req, res) => {

      // error checking
      req.assert('botHandle', 'botHandle is a required param').notEmpty();
      req.assert('body', 'body is a required param').notEmpty();
      var errors = req.validationErrors();
      if (errors) {
        return ErrorController.paramError(req, res, errors);
      }

      //noinspection JSUnresolvedVariable
      let botHandle = req.params.botHandle;
      let body = req.params.body;
      let mobNumber = req.username;
      let userToken = req.password;

      return UserMsgDao.insert(mobNumber, botHandle, body)
        .then(/* UserMsg */ userMsgObj => res.json({_id: userMsgObj._id.toString()}))
        .then(() => BotMsgController.msg(userToken, botHandle, body));
    });
  }
}

module.exports = BotMsgRoutes;

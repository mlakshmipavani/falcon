'use strict';

var request = require('request-promise');
var apiVersion = require('../config/api-version.js');
var config = require('../config/config.js');
var ErrorController = require('../controllers/error-controller.js');
var BotMsgController = require('../controllers/bot-msg-controller.js');

/**
 * A route that forwards a message to the respective bot
 */
class BotMsgRoutes {

  static setup(app) {

    app.post({path: '/msg/:botHandle', version: apiVersion.v1}, (req, res) => {

      // error checking
      req.assert('botHandle', 'botHandle is a required param').notEmpty();
      req.assert('body', 'body is a required param').notEmpty();
      req.assert('localId', 'localId is a required param').notEmpty();
      var errors = req.validationErrors();
      if (errors) {
        return ErrorController.paramError(req, res, errors);
      }

      //noinspection JSUnresolvedVariable
      let botHandle = req.params.botHandle;
      let body = req.params.body;
      let localId = req.params.localId;
      let mobNumber = req.username;

      BotMsgController.msg(mobNumber, botHandle, body).then((/*{_id}*/ hash) => {
        var response = Object.assign(hash, {localId});
        res.json(response);
      });
    });
  }
}

module.exports = BotMsgRoutes;

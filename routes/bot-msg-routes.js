'use strict';

var request = require('request-promise');
var apiVersion = require('../config/api-version.js');
var ErrorController = require('../controllers/error-controller.js');
var config = require('../config/config.js');

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
      var botHandle = req.params.botHandle;
      var body = req.params.body;

      var requestOptions = {url: `${config.botServerUrl}${botHandle}`, form: {body}, json: true};

      // send the response back to the client
      request.post(requestOptions).then(response => {
        var fullResponse = {_id: Math.random().toString(36).substring(7), body: response, type: 0};
        res.json(fullResponse);
      });
    });
  }
}

module.exports = BotMsgRoutes;

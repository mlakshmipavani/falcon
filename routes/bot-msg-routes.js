'use strict';

var request = require('request-promise');
var apiVersion = require('../config/api-version.js');

/**
 * A route that forwards a message to the respective bot
 */
class BotMsgRoutes {

  static setup(app) {

    app.post({path: '/msg/:botHandle', version: apiVersion.v1}, (req, res) => {

      // get the handle
      var handle = req.params.botHandle;

      // remove the handle from params
      delete req.params.botHandle;
      var requestOptions = {url: `http://localhost:5000/${handle}`, form: req.params, json: true};

      // send the response back to the client
      request.post(requestOptions).then(response => res.send(response));
    });
  }
}

module.exports = BotMsgRoutes;

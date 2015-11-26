'use strict';

var ApiVersion = require('../config/api-version');
var BotDiscoveryController = require('../controllers/bot-discovery-controller');
var ErrorController = require('../controllers/error-controller');

/**
 * Sets up all the routes required for bot discovery
 */
class BotDiscoveryRoutes {

  static setup(app) {
    app.get({path: '/newbots', version: ApiVersion.v1}, newBots);
  }
}

/**
 * Gives you the latest bots added to the store
 */
function newBots(req, res) {
  // error checking
  req.assert('count', 'count is a required param').notEmpty();
  req.assert('count', 'count should be an integer').isInt();

  var errors = req.validationErrors();
  if (errors) {
    return ErrorController.paramError(req, res, errors);
  }

  BotDiscoveryController.getNew(parseInt(req.params.count))
    .then((/* Array<Bot> */ bots) => res.json(bots));
}

module.exports = BotDiscoveryRoutes;

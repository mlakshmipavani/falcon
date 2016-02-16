'use strict';

const ApiVersion = require('../config/api-version');
const BotDiscoveryController = require('../controllers/bot-discovery-controller');
const ErrorController = require('../controllers/error-controller');

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

  const errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  BotDiscoveryController.getNew(parseInt(req.params.count))
    .then((/* Array<Bot> */ bots) => res.json(bots));
}

module.exports = BotDiscoveryRoutes;

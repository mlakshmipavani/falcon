'use strict';

var apiVersion = require('../config/api-version');
var UserDao = require('../dao/user-dao');
var RegistrationRoutes = require('./registration-routes');
var BotDiscoveryRoutes = require('./bot-discovery-routes');
var BotMsgRoutes = require('./bot-msg-routes.js');
var UberBotRoutes = require('./uber-bot-routes.js');
var RailPnrRoutes = require('./railpnr-bot-routes.js');

/**
 * A single point entry to all the routes in this server
 */
class Routes {

  /**
   * Sets up all the routes
   *
   * @param {Server} app
   */
  static setup(app) {

    // a simple routes to test server working
    //app.get({path: '/', version: apiVersion.v1}, (req, res) => res.send({text: 'hello'}));
    //app.get({path: '/', version: apiVersion.v2}, (req, res) => res.send({text: 'hello v2'}));

    //noinspection JSUnresolvedFunction
    app.get('/', (req, res)=> {
      res.json({hi: 'hello'});
    });

    RegistrationRoutes.setup(app);
    BotDiscoveryRoutes.setup(app);
    BotMsgRoutes.setup(app);
    UberBotRoutes.setup(app);
    RailPnrRoutes.setup(app);
  }
}

module.exports = Routes;

'use strict';

const apiVersion = require('../config/api-version');
const UserDao = require('../dao/user-dao');
const RegistrationRoutes = require('./registration-routes');
const BotDiscoveryRoutes = require('./bot-discovery-routes');
const BotMsgRoutes = require('./bot-msg-routes');
const CabBotRoutes = require('./cab-bot-routes');
const RailPnrRoutes = require('./railpnr-bot-routes');
const BotMovieRoutes = require('./bot-movie-routes');
const NotificationRoutes = require('./notification-routes.js');
const SeriesNotifierRoutes = require('./series-notifier-bot-routes');
const InternalRoutes = require('./internal');
const ReferralRoutes = require('./referral-routes');
const CouponDuniaRoutes = require('./coupon-routes');

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
    CabBotRoutes.setup(app);
    RailPnrRoutes.setup(app);
    BotMovieRoutes.setup(app);
    NotificationRoutes.setup(app);
    SeriesNotifierRoutes.setup(app);
    InternalRoutes.setup(app);
    ReferralRoutes.setup(app);
    CouponDuniaRoutes.setup(app);

  }
}

module.exports = Routes;

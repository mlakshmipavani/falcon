'use strict';

var apiVersion = require('../config/api-version');
var UserDao = require('../dao/user-dao');
var RegistrationRoutes = require('./registration-routes');

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
      UserDao.newUser('9033819605', 'Jaydeep', '91').then(()=> res.send('done created!'));
    });

    RegistrationRoutes.setup(app);
  }
}

module.exports = Routes;

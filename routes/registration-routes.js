'use strict';

var ApiVersion = require('../config/api-version.js');
var RegisterationController = require('../controllers/registration-controller');

/**
 * Sets up all the routes required for registration
 *
 * @param {Server} app
 */
class RegistrationRoutes {

  static setup(app) {
    app.post({path: '/register', version: ApiVersion.v1}, register);
  }

}

/**
 * A user can register using this route
 */
function register(req, res) {
  var url = req.params['X-Auth-Service-Provider'];
  var headers = req.params['X-Verify-Credentials-Authorization'];
  var name = req.params.name;
  var countryISO = req.params.countryISO;
  var contacts = JSON.parse(req.params.contacts);
  var requestOptions = {url: url, headers: {Authorization: headers}, json: true};

  RegisterationController.register(name, countryISO, contacts, requestOptions)
    .then((token) => res.json({token: token, registered: [], unRegistered: []}))
    .catch((err) => console.log(err));
}

module.exports = RegistrationRoutes;

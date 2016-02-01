'use strict';

var ApiVersion = require('../config/api-version.js');
var RegistrationController = require('../controllers/registration-controller');

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
 * [Note] : if it's a development environment send the mobile number in header
 * `X-Verify-Credentials-Authorization`
 */
function register(req, res) {
  var url = req.header('X-Auth-Service-Provider');
  var headers = req.header('X-Verify-Credentials-Authorization');
  var name = req.params.name;
  var requestOptions = {url: url, headers: {Authorization: headers}, json: true};

  RegistrationController.register(name, requestOptions)
    .then((response) => res.json(response))
    .catch((err) => console.log(err));
}

module.exports = RegistrationRoutes;

'use strict';

const ApiVersion = require('../config/api-version');
const RegistrationController = require('../controllers/registration-controller');

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
  const url = req.header('X-Auth-Service-Provider');
  const headers = req.header('X-Verify-Credentials-Authorization');
  const name = req.params.name;

  //noinspection JSUnresolvedVariable
  const oneSignalUserId = req.params.oneSignalUserId;
  const requestOptions = {url: url, headers: {Authorization: headers}, json: true};

  RegistrationController.register(name, requestOptions, oneSignalUserId)
    .then((response) => res.json(response))
    .catch((err) => console.log(err));
}

module.exports = RegistrationRoutes;

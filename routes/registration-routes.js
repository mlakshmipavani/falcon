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
    app.post({path: '/login', version: ApiVersion.v1}, login);
  }

}

function login(req, res) {
  /** @type {{google_id_token, one_signal_user_id}} */
  const params = req.params;
  const googleIdToken = params.google_id_token;
  const oneSignalUserId = params.one_signal_user_id;

  return RegistrationController.login(googleIdToken, oneSignalUserId)
    .then(response => res.json(response))
    .catch(err => res.send(err));
}

module.exports = RegistrationRoutes;

'use strict';

const ApiVersion = require('../config/api-version');
const UserDao = require('../dao/user-dao');

/**
 * Internal routes contain routes that shouldn't be exposed to the outside world (i.e. shouldn't be called from the app)
 * These are the APIs that other (StayYolo) servers (for example the yolobots site) can call
 */
class InternalRoutes {

  static setup(app) {
    app.post({
      path: 'internal/email-confirmed/:id',
      version: ApiVersion.v1
    }, this._emailConfirmed);
  }

  static _emailConfirmed(req, res) {
    /** @type {{id}} */
    const params = req.params;
    const socialId = params.id;

    if (!socialId) return res.end();
    return UserDao.setEmailConfirmed(socialId)
      .then(() => res.end());
  }

}

module.exports = InternalRoutes;

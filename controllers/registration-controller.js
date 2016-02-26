'use strict';

const request = require('request-promise');
const UserDao = require('../dao/user-dao.js');
const OneSignalDao = require('../dao/onesignal-dao');

class RegistrationController {

  static login(/*string*/ googleIdToken, /*string*/ oneSignalUserId) {
    return this._login(googleIdToken)
      .then((/*{aud, sub, email, given_name, name}*/ result) => {
        const socialId = result.sub;
        const name = result.given_name || result.name;
        return UserDao.newUser(socialId, name, result.email);
      })
      .then((/*User*/ userObj) => userObj._id.toString())
      .then((/*string*/ token) => OneSignalDao.map(token, oneSignalUserId).thenReturn({token}));
  }

  /**
   * Queries Google servers for user details in exchange for googleIdToken
   * @param googleIdToken
   * @returns {Promise}
   * @private
   */
  static _login(/*string*/ googleIdToken) {
    const options = this._getOptionsToLogin(googleIdToken);
    return request(options);
  }

  static _getOptionsToLogin(/*string*/ googleIdToken) {
    return {
      url: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
      qs: {id_token: googleIdToken},
      json: true
    };
  }
}

module.exports = RegistrationController;

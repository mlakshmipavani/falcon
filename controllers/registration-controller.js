'use strict';

const request = require('request-promise');
const UserDao = require('../dao/user-dao.js');
const OneSignalDao = require('../dao/onesignal-dao');
const ContactDao = require('../dao/contacts-dao');

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
   * Stores contacts of the registered user so that they can later be used for marketing
   * @param userToken Token of the user
   * @param contacts Contacts that the user has sent
   * @returns {Promise}
     */
  static saveContacts(/*string*/ userToken, /*Array<{email, name}>*/ contacts) {
    return ContactDao.saveContacts(userToken, contacts);
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

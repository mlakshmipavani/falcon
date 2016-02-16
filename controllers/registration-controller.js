'use strict';

const request = require('request-promise');
const libPhoneNumber = require('google-libphonenumber');

//noinspection JSUnresolvedVariable
const phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance();

const UserDao = require('../dao/user-dao.js');
const OneSignalDao = require('../dao/onesignal-dao');

class RegistrationController {

  /**
   * Registers and syncs contacts
   * @param {string} name
   * @param {object} requestOptions
   * @param oneSignalUserId UserId provided by the OneSignal SDK on the device
   * [NOTE] : if it's a development environment, send the mobile number in
   * `requestOptions.headers.Authorization`
   * @returns {Promise<{token, registered, unRegistered}>}
   */
  static register(/*string*/ name, requestOptions, /*string*/ oneSignalUserId) {

    if (process.env.NODE_ENV === 'development')
      return _register(requestOptions.headers.Authorization, name, oneSignalUserId);

    //noinspection JSUnresolvedFunction
    return request(requestOptions).then((oAuthRes) => {
      const mobNumber = oAuthRes.phone_number;
      return _register(mobNumber, name, oneSignalUserId);
    });

  }
}

/**
 * An internal method that puts the user in the db
 * @param {string} mobNumber Mobile number of the user registering (with +91)
 * @param {string} name Name of the user
 * @param oneSignalUserId UserId provided by the OneSignal SDK on the device
 * @returns {Promise<{token, registered, unRegistered}>}
 * @private
 */
function _register(mobNumber, name, /*string*/ oneSignalUserId) {
  const phoneNumber = phoneUtil.parse(mobNumber, '');
  const countryISO = phoneUtil.getRegionCodeForNumber(phoneNumber);

  // remove the leading +
  mobNumber = mobNumber.substr(1);

  return UserDao.newUser(mobNumber, name, countryISO)
    .then((/* User */ user) => {
      if (user.name !== name) UserDao.updateName(user._id.toString(), name);
      return user._id.toString();
    })
    .then((/*string*/token) => OneSignalDao.map(token, oneSignalUserId).thenReturn({token}));
}

module.exports = RegistrationController;

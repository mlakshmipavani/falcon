'use strict';

var request = require('request-promise');
var libPhoneNumber = require('google-libphonenumber');

//noinspection JSUnresolvedVariable
var phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance();

//noinspection JSUnresolvedVariable
var PhoneNumberType = libPhoneNumber.PhoneNumberType;

//noinspection JSUnresolvedVariable
var PhoneNumberFormat = libPhoneNumber.PhoneNumberFormat;

var UserDao = require('../dao/user-dao.js');
var ContactSyncController = require('./contact-sync-controller.js');

class RegistrationController {

  /**
   * Registers and syncs contacts
   * @param {string} name
   * @param {object} contacts Example : { '917405484154': 'Parth', '919108648284': 'Airtel jaydp' }
   * @param {object} requestOptions
   * [NOTE] : if it's a development environment, send the mobile number in
   * `requestOptions.headers.Authorization`
   * @returns {Promise<{token, registered, unRegistered}>}
   */
  static register(name, contacts, requestOptions) {

    if (process.env.NODE_ENV === 'development')
      return _register(requestOptions.headers.Authorization, name, contacts);

    //noinspection JSUnresolvedFunction
    return request(requestOptions).then((oAuthRes) => {
      let mobNumber = oAuthRes.phone_number; // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
      return _register(mobNumber, name, contacts);
    });

  }
}

/**
 * An internal method that puts the user in the db
 * @param {string} mobNumber Mobile number of the user registering (with +91)
 * @param {string} name Name of the user
 * @param {object} contacts Example : { '917405484154': 'Parth', '919108648284': 'Airtel jaydp' }
 * @returns {Promise<{token, registered, unRegistered}>}
 * @private
 */
function _register(mobNumber, name, contacts) {
  var phoneNumber = phoneUtil.parse(mobNumber, '');
  var countryISO = phoneUtil.getRegionCodeForNumber(phoneNumber);

  // remove the leading +
  mobNumber = mobNumber.substr(1);

  return UserDao.newUser(mobNumber, name, countryISO)
    .then(( /* User */ user) => {
      if (user.name !== name) UserDao.updateName(user._id.toString(), name);
      return user._id.toString();
    })
    .then((token) => {
      return ContactSyncController.sync(mobNumber, contacts, countryISO)
        .then(result => Object.assign({
          token
        }, result));
    });
}

module.exports = RegistrationController;
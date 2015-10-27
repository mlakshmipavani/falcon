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
   * @param {string} countryISO
   * @param {object} contacts Example : { '917405484154': 'Parth', '919108648284': 'Airtel jaydp' }
   * @param {object} requestOptions
   * @returns {Promise<{token, registered, unRegistered}>}
   */
  static register(name, countryISO, contacts, requestOptions) {

    //noinspection JSUnresolvedFunction
    return request(requestOptions).then((oAuthRes) => {
      let mobNumber = oAuthRes.phone_number;// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers

      if (!countryISO) {
        let phoneNumber = phoneUtil.parse(mobNumber, '');
        countryISO = phoneUtil.getRegionCodeForNumber(phoneNumber);
      }

      // remove the leading +
      mobNumber = mobNumber.substr(1);

      return UserDao.newUser(mobNumber, name, countryISO)
        .then((/* User */ user) => {
          if (user.name !== name) UserDao.updateName(user._id.toString(), name);
          return user._id.toString();
        })
        .then((token) => {
          return ContactSyncController.sync(mobNumber, contacts, countryISO)
            .then(result => Object.assign({token}, result));
        });

    });
  }
}

module.exports = RegistrationController;

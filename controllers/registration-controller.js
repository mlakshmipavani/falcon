'use strict';

var request = require('request-promise');
var libPhoneNumber = require('google-libphonenumber');
var phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance();
var PhoneNumberType = libPhoneNumber.PhoneNumberType;
var PhoneNumberFormat = libPhoneNumber.PhoneNumberFormat;

var UserDao = require('../dao/user-dao.js');
var ContactSyncController = require('./contact-sync-controller.js');

class RegistrationController {

  /**
   * Registers and syncs contacts
   * @param {string} name
   * @param {string} countryISO
   * @param contacts
   * @param {object} requestOptions
   * @returns {Promise<string>} token is returned
   */
  static register(name, countryISO, contacts, requestOptions) {

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
          ContactSyncController.sync();
          return {token: token, registered: {}, unRegistered: {}};
        });

    });
  }
}

module.exports = RegistrationController;

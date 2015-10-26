'use strict';

var _obj = require('lodash/object');
var libPhoneNumber = require('google-libphonenumber');
var phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance();
var PhoneNumberType = libPhoneNumber.PhoneNumberType;
var PhoneNumberFormat = libPhoneNumber.PhoneNumberFormat;

var UserDao = require('../dao/user-dao.js');
var UnRegisteredDao = require('../dao/unregistered-dao.js');

/**
 * Takes care of syncing contacts
 */
class ContactSyncController {

  /**
   * Syncs contacts
   * @param {string} mobNumber
   * @param {object} contacts Example : { '917405484154': 'Parth', '919108648284': 'Airtel jaydp' }
   * @param {string} countryISO
   * @returns {Promise.<{registered: {}, unRegistered: {}}>}
   */
  static sync(mobNumber, contacts, countryISO) {
    // <number, name> map with normalized numbers
    var contactsNormalized = {};

    // normalize the numbers
    _obj.forIn(contacts, (name, number)=> { // value, key
      try {
        let phoneNumber = phoneUtil.parse(number, countryISO);
        let numberType = phoneUtil.getNumberType(phoneNumber);
        if (numberType === PhoneNumberType.MOBILE
          || numberType === PhoneNumberType.FIXED_LINE_OR_MOBILE) {
          let formatted = phoneUtil.format(phoneNumber, PhoneNumberFormat.E164);

          // remove the leading +
          formatted = formatted.substr(1);
          contactsNormalized[formatted] = name;
        }
      } catch (err) {
        // this catch block is required coz phoneUtil.parse() throws error on invalid number
      }
    });

    // an array of only normalized numbers no names
    let normalizedNumbers = Object.keys(contactsNormalized);
    return UserDao.findRegistered(normalizedNumbers).then((registeredNumbers) => {

      // <number, name> map
      let contactsRegistered = _obj.pick(contactsNormalized, registeredNumbers);
      let contactsUnRegistered = _obj.omit(contactsNormalized, registeredNumbers);

      // write those registeredNumbers to db
      UserDao.friendsAddHim(mobNumber, registeredNumbers);

      // all the contacts that the user sees in recent chat
      UserDao.addContacts(mobNumber, registeredNumbers);

      let unregistered = Object.keys(contactsUnRegistered);
      if (unregistered.length !== 0) UnRegisteredDao.addAll(unregistered, mobNumber);

      return {registered: contactsRegistered, unRegistered: contactsUnRegistered};
    });

  }
}

module.exports = ContactSyncController;

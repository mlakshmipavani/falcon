'use strict';

var DaoHelper = require('./dao-helper');
var User = require('../models/user');
var log = require('../utils/logger');

class UserDao {

  /**
   * Creates a new user in db
   * If a user with that mobile number already exists then it returns the same
   * @flow
   * @param {string} mobNumber
   * @param {string} name
   * @param {string} countryCode
   * @returns {Promise}
   */
  static newUser(mobNumber, name, countryCode) {
    var newUserObj = User.getUserHash(mobNumber, name, countryCode);
    var query = {mobNumber};
    var update = {$setOnInsert: newUserObj};
    var options = {upsert: true, returnOriginal: false};
    return DaoHelper.user.findOneAndUpdate(query, update, options)
      .then((resultObj) => {
        if (!resultObj.value)
          throw new Error(`value is undefined while creating new user,
            resultObj : ${JSON.stringify(resultObj)}`);
        return resultObj.value;
      });
  }

  /**
   * Given a list of mobile numbers, return the ones who are registered with Yolo Messenger
   *
   * @param {Array<string>} numbers - mobile numbers
   * @returns {Promise} - Promise Object
   *
   * @example
   * UserDao.findRegistered(['919033819605', '919898020383', '919033309720']).then((result)=> {
   *   // result is an array of mobile numbers who are registered with Yolo Messenger
   *   // result = ['919033819605', '919898020383']
   * });
   */
  static findRegistered(numbers) {
    var query = {mobNumber: {$in: numbers}};
    var projection = {mobNumber: 1};
    return DaoHelper.user.find(query, projection).toArray()

      // the above query gives [ { _id: 562d18eeea79079cdf2295ec, mobNumber: '919033819605' }, .. ]
      // and we transform it to [ '919033819605', . . . ]
      .map((obj) => {
        return obj.mobNumber;
      });
  }

  /**
   * This method adds `him` as a friend to each user in `friends`
   *
   * @param {string} him - mob_number of the person who is to be added
   * @param {Array<string>} friends - list of mobNumbers who should add him in their friend list
   * @returns {Promise}
   *
   * @example
   *
   * // Consider A, B, and C are already registered
   * // Now when D registers they should add D in their friend list
   * // Here @param him = D
   * // And @param friends = [A, B, C]
   *
   * UserDao.friendsAddHim('919033819605', ['919898020383', '919033309720']);
   */
  static friendsAddHim(him, friends) {
    var query = {mobNumber: {$in: friends}};
    var update = {$addToSet: {friends: him}};
    return DaoHelper.user.updateMany(query, update);
  }

  /**
   * Add contacts to a user
   *
   * Contacts are the people who are registered to Yolo Messenger and
   * are on the user's contact list (the people that a user sees in RecentChatList)
   *
   * This list is used when the user requests for all his online friends
   *
   * @param {string} mobNumber - mobile number of the person
   * @param {Array<string>} contacts - a few mobile numbers of his contacts
   * @returns {Promise}
   *
   * @example
   * UserDao.addContacts('919033819605', ['919898020383']).then(function () {
   *   // done adding contacts
   * });
   */
  static addContacts(mobNumber, contacts) {
    var query = {mobNumber};
    var update = {$addToSet: {contacts: {$each: contacts}}};
    return DaoHelper.user.updateOne(query, update);
  }

  /**
   * Updates the name of a user
   * @param {string} _id
   * @param {string} newName
   */
  static updateName(_id, newName) {
    // TODO : implement method
  }
}

module.exports = UserDao;

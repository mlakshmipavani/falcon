'use strict';

var ObjectID = require('mongodb').ObjectID;

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
   * @returns {Promise<User>}
   */
  static newUser(mobNumber, name, countryCode) {

    // first try updating the name of the user
    return UserDao.updateName(mobNumber, name)

      // if the user exists then the nModified count will be 1}
      .then(updatedUser => {
        if (!updatedUser)
          return _newUser(mobNumber, name, countryCode)
            .then(result => result.ops[0]);
        else
          return updatedUser;
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
   * @param {string} mobNumber
   * @param {string} newName
   */
  static updateName(mobNumber, newName) {
    var query = {mobNumber};
    var update = {name: newName};
    var options = {returnOriginal: false};
    return DaoHelper.user.findOneAndUpdate(query, {$set: update}, options)
      .then(op => op.value);
  }
}

/**
 * This function without checking anything just inserts a new user object in db
 * @param {string} mobNumber
 * @param {string} name
 * @param {string} countryCode
 * @returns {Promise}
 * @private
 */
function _newUser(mobNumber, name, countryCode) {
  var newUserObj = User.getUserHash(mobNumber, name, countryCode);
  return DaoHelper.user.insertOne(newUserObj);
}

module.exports = UserDao;

'use strict';

const ObjectID = require('mongodb').ObjectID;

const DaoHelper = require('./dao-helper');
const User = require('../models/user');
const ErrorController = require('../controllers/error-controller');
const crypto = require('crypto');

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
            .then(result => result.ops[0])
            .then(newUser => UserDao.updatehashId(newUser._id));
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
    const query = {mobNumber: {$in: numbers}};
    const projection = {mobNumber: 1};
    return DaoHelper.user.find(query, projection).toArray()

      // the above query gives [ { _id: 562d18ea7a79079cdf2295ec, mobNumber: '919033819605' }, .. ]
      // and we transform it to [ '919033819605', . . . ]
      .map((obj) => {
        return obj.mobNumber;
      });
  }

  /**
   * Finds a user with the given mobNumber and token
   * @param mobNumber Mobile Number of the user
   * @param token Private token of the user
   * @returns {Promise.<{_id, mobNumber}>}
   */
  static findUserWithToken(/* string */ mobNumber, /* string */ token) {
    const query = {_id: ObjectID(token), mobNumber};
    const projection = {mobNumber: 1}; // _id is included by default
    return DaoHelper.user.find(query).project(projection).toArray()
      .then(userList => {
        if (!userList || userList.length === 0)
          throw ErrorController.logAndReturnError(`User not found with token : ${token}`);
        if (userList.length === 1) return userList[0];
        if (userList.length > 1)
          throw ErrorController.logAndReturnError(
            `Multiple users found with the same token :${token}`);
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
    const query = {mobNumber: {$in: friends}};
    const update = {$addToSet: {friends: him}};
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
    const query = {mobNumber};
    const update = {$addToSet: {contacts: {$each: contacts}}};
    return DaoHelper.user.updateOne(query, update);
  }

  /**
   * Updates the name of a user
   * @param {string} mobNumber
   * @param {string} newName
   */
  static updateName(mobNumber, newName) {
    const query = {mobNumber};
    const update = {name: newName};
    const options = {returnOriginal: false};
    return DaoHelper.user.findOneAndUpdate(query, {$set: update}, options)
      .then(op => op.value);
  }

  /**
   * Update hashOfId of the user
   * @param {ObjectID} userId
   * @returns {Promise}
   */
  static updatehashId(userId) {
    const hashOfId = crypto.createHash('sha512').update('' + userId).digest('base64').toString();
    const query = {_id: userId};
    const update = {hashOfId: hashOfId};
    const options = {returnOriginal: false};
    return DaoHelper.user.findOneAndUpdate(query, {$set: update}, options)
      .then(result => result.value);
  }

  /**
   *  Returns _Ids of respective hashOfIds
   *  @params {Array} hashOfIds
   *  @returns {Promise}
   */
  static getUserIdsFromHashIds(hashOfIds) {
    const query = {hashOfId: {$in: hashOfIds}};
    const projection = {_id: 1};
    return DaoHelper.user.find(query, projection)
      .toArray()
      .map(obj => obj._id);
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
  const newUserObj = User.getUserHash(mobNumber, name, countryCode);
  return DaoHelper.user.insertOne(newUserObj);
}

module.exports = UserDao;

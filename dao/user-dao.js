'use strict';

const ObjectID = require('mongodb').ObjectID;

const DaoHelper = require('./dao-helper');
const User = require('../models/user');
const ErrorController = require('../controllers/error-controller');
const log = require('../utils/logger').child({
  module: 'user-dao'
});

class UserDao {

  /**
   * Creates a new user in db
   * If a user with that socialId already exists then it returns the same
   * @flow
   * @param socialId The unique Id from Google/Facebook to identify the user
   * @param name The name of the use
   * @param email If available, the email of the user
   * @returns {Promise<User>}
   */
  static newUser(/*string*/ socialId, /*string*/ name, /*string=*/ email) {
    const newUserObj = {socialId, name, email};
    return DaoHelper.user.findOneAndUpdate({socialId}, {$set: newUserObj}, {
      upsert: true,
      returnOriginal: false
    }).then((/*{value, lastErrorObject, ok}*/ result) => {
      if (result.ok === 1) return result.value;
      const error = new Error('new user insertion not OK');
      log.error(error, {data: result});
      throw error;
    });
  }

  /**
   * Finds a user with the given socialId and token
   * @param socialId Social Id of the user
   * @param token Private token of the user
   * @returns {Promise.<{User}>}
   */
  static findUserWithToken(/* string */ socialId, /* string */ token) {
    const query = {_id: ObjectID(token), socialId};
    return DaoHelper.user.find(query).toArray()
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
   * Finds a user with the given socialId only
   * @param socialId Social Id of the user
   * @return {Promise<User>}
   */
  static findUserWithSocialId(/*string*/ socialId) {
    const query = {socialId};
    return DaoHelper.user.find(query).next()
      .tap(doc => {
        if (!doc)
          throw ErrorController.logAndReturnError(`User not found socialId : ${socialId}`);
      });
  }

  /**
   * Updates the name of a user
   * @param socialId
   * @param newName
   */
  static updateName(/*string*/ socialId, /*string*/ newName) {
    const query = {socialId};
    const update = {name: newName};
    const options = {returnOriginal: false};
    return DaoHelper.user.findOneAndUpdate(query, {$set: update}, options)
      .then(op => op.value);
  }

  /**
   * Sets email confirmed for a user
   * @param socialId Social id of the user
   * @return {Promise}
   */
  static setEmailConfirmed(/*string*/ socialId) {
    const query = {socialId};
    const update = {isEmailConfirmed: true};
    return DaoHelper.user.updateOne(query, {$set: update});
  }

  /**
   * Store the ola Access token given after user logged in to Ola A/c
   * @param userToken The User token (_id) in our db
   * @param olaAccessToken
   * @returns {Promise}
   */
  static storeOlaAccessToken(/*string*/ userToken, /*string*/ olaAccessToken) {
    const query = {_id: ObjectID(userToken)};
    const update = {olaAccessToken};
    return DaoHelper.user.updateOne(query, {$set: update});
  }

  /**
   * Returns OlaAccess token associated with a user
   * @param userToken The User token (_id) in our db
   * @returns {Promise.<string>}
   */
  static getOlaAccessToken(/*string*/ userToken) {
    const query = {_id: ObjectID(userToken)};
    const projection = {olaAccessToken: 1};
    return DaoHelper.user.find(query, projection).next().then(userObj => userObj.olaAccessToken);
  }

  static logger() {
    return log;
  }
}

module.exports = UserDao;

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
    let newUserObj = User.getUserHash(mobNumber, name, countryCode);
    let findUserObj = {mobNumber: mobNumber};
    let options = {upsert: true, returnOriginal: false};
    return DaoHelper.user.findOneAndUpdate(findUserObj, {$setOnInsert: newUserObj}, options)
      .then((resultObj) => {
        if (resultObj.value)
          throw new Error(`value is undefined while creating new user,
            resultObj : ${JSON.stringify(resultObj)}`);
        return resultObj.value;
      });
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

'use strict';

const DaoHelper = require('./dao-helper');

/**
 * A collection that stores userToken and OneSignalUserId mapping
 */
class OneSignalDao {

  /**
   * Associates a userToken with oneSignalUserId and stores it in db
   * @param userToken _id of a user
   * @param oneSignalUserId User id obtained from the device using OneSignal SDK
   * @returns {Promise<T>}
   */
  static map(/*string*/ userToken, /*string*/ oneSignalUserId) {
    const updateObj = {userToken, oneSignalUserId};
    return DaoHelper.oneSignal.findOneAndUpdate({userToken}, {$set: updateObj}, {upsert: true});
  }

  /**
   * Returns OneSignalUserIds from userTokens
   * @param userTokens An array of _id of users
   * @returns {Promise<Array<string>>}
   */
  static getPlayerIds(/*Array<string>*/ userTokens) {
    return DaoHelper.oneSignal.find({userToken: {$in: userTokens}}).toArray()
      .filter((/*{userToken, oneSignalUserId}*/ eachObj) => eachObj.oneSignalUserId !== null)
      .map((/*{userToken, oneSignalUserId}*/ eachObj) => eachObj.oneSignalUserId);
  }

  /**
   * Returns all the OneSignalUserIds from the db
   * @returns {Promise<T>}
   */
  static getAllPlayerIds() {
    return DaoHelper.oneSignal.find().toArray()
      .filter((/*{userToken, oneSignalUserId}*/ eachObj) => eachObj.oneSignalUserId !== null)
      .map((/*{userToken, oneSignalUserId}*/ eachObj) => eachObj.oneSignalUserId);
  }
}

module.exports = OneSignalDao;

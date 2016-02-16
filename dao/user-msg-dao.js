'use strict';

const ObjectID = require('mongodb').ObjectID;

const DaoHelper = require('./dao-helper');
const ErrorController = require('../controllers/error-controller');

class UserMsgDao {

  /**
   * Inserts a user sent msg into db
   * @param mobNumber Mobile number of the user who sent the msg
   * @param botHandle Handle of the bot to whom the msg is sent
   * @param body Actual msg body
   * @returns {Promise.<UserMsg>}
   */
  static insert(/* string */ mobNumber, /* string */ botHandle, /* string */ body) {
    const obj = {mobNumber, botHandle, body, createdAt: new Date()};
    return DaoHelper.userMsg.insertOne(obj)
      .then(result => {
        if (result.insertedCount === 1) return result.ops[0];
        return undefined;
      });
  }

  /**
   * Finds a msg using its _id
   * @param msgId _id of the msg
   * @returns {Promise.<UserMsg>}
   */
  static getMsg(/* string */ msgId) {
    //noinspection Eslint
    var query = {_id: ObjectID(msgId)};
    return DaoHelper.userMsg.find(query).toArray()
      .then(msgList => {
        if (!msgList || msgList.length === 0)
          throw ErrorController.logAndReturnError(`msg not found with _id : ${msgId}`);
        if (msgList.length === 1) return msgList[0];
        if (msgList.length > 1)
          throw ErrorController.logAndReturnError(
            `Multiple msgs found with the same _id : ${msgId}`);
      });
  }

}

module.exports = UserMsgDao;

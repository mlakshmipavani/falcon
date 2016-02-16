'use strict';

const ObjectID = require('mongodb').ObjectID;

const DaoHelper = require('./dao-helper');
const ErrorController = require('../controllers/error-controller');

/**
 * For all the msgs sent by bots
 */
class BotMsgDao {

  /**
   * Inserts a bot sent msg into db
   * @param mobNumber Mobile number of the user to whom the msg is sent
   * @param botHandle Handle of the bot from whom the msg is sent
   * @param body Actual msg body
   * @param msgId user msg id
   * @returns {Promise.<BotMsg>}
   */
  static insert(/* string */ mobNumber, /* string */ botHandle, /* string */ body,
                /* string */ msgId) {
    const obj = {mobNumber, botHandle, body, createdAt: new Date(), userMsgId: msgId};
    return DaoHelper.botMsg.insertOne(obj)
      .then(result => {
        if (result.insertedCount === 1) return result.ops[0];
        return undefined;
      });
  }

  /**
   * Finds a msg using its _id
   * @param msgId _id of the msg
   * @returns {Promise.<BotMsg>}
   */
  static getMsg(/* string */ msgId) {
    //noinspection Eslint
    var query = {_id: ObjectID(msgId)};
    return DaoHelper.botMsg.find(query).toArray()
      .then(msgList => {
        if (!msgList || msgList.length === 0)
          throw ErrorController.logAndReturnError(`msg not found with _id : ${msgId}`);
        if (msgList.length === 1) return msgList[0];
        if (msgList.length > 1)
          throw ErrorController.logAndReturnError(`Multiple msgs found with the same _id :
          ${msgId}`);
      });
  }

  static getLastMsg(/*String*/ mobNumber) {
    return DaoHelper.botMsg.find({mobNumber})
      .limit(1)
      .sort({$natural: -1})
      .toArray()
      .spread(arr => arr);
  }

}

module.exports = BotMsgDao;

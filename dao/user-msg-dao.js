'use strict';

var DaoHelper = require('./dao-helper.js');

class UserMsgDao {

  /**
   * Inserts a user sent msg into db
   * @param mobNumber Mobile number of the user who sent the msg
   * @param botHandle Handle of the bot to whom the msg is sent
   * @param body Actual msg body
   * @returns {Promise.<UserMsg>}
   */
  static insert(/* string */ mobNumber, /* string */ botHandle, /* string */ body) {
    var obj = {mobNumber, botHandle, body, createdAt: new Date()};
    return DaoHelper.userMsg.insertOne(obj)
      .then(result => {
        if (result.insertedCount === 1) return result.ops[0];
        return undefined;
      });
  }

}

module.exports = UserMsgDao;

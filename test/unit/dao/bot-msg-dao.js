'use strict';

var Promise = require('bluebird');
var mongodb = require('mongodb');
var DaoHelper = require('../../../dao/dao-helper');
var BotMsgDao = require('../../../dao/bot-msg-dao.js');
var UserMsgDao = require('../../../dao/user-msg-dao.js');

describe('BotMsgDao', () => {

  const botMsg = {mobNumber: '919663938598', botHandle: '@bot1', body: 'hi'};
  const userMsg = {mobNumber: '919663938598', botHandle: '@bot1', body: 'hi bot'};

  before(() => {
    return Promise.delay(300).then(() => DaoHelper.db.dropDatabase());
  });

  it('Inserts a bot sent msg into db', () => {
    var userMsgId;
    UserMsgDao.insert(userMsg.mobNumber, userMsg.botHandle, userMsg.body)
      .then((/* UserMsg */ msg) => {
        userMsgId = msg._id.toString();
        return BotMsgDao.insert(botMsg.mobNumber, botMsg.botHandle, botMsg.body, userMsgId);
      })
      .then((/* BotMsg */ msg) => {
        return msg.userMsgId.toString().should.equal(userMsgId);
      });
  });

  it('Finds a msg using its _id', () => {
    var botMsgId;
    return UserMsgDao.insert(userMsg.mobNumber, userMsg.botHandle, userMsg.body)
      .then((/* UserMsg */ msg) => {
        return BotMsgDao.insert(botMsg.mobNumber, botMsg.botHandle, botMsg.body,
          msg._id.toString());
      })
      .then((/* BotMsg */ botMsg) => {
        botMsgId = botMsg._id.toString();
        return BotMsgDao.getMsg(botMsgId);
      })
      .then((/* UserMsg */ msg) => {
        return msg._id.toString().should.equal(botMsgId);
      });
  });

});

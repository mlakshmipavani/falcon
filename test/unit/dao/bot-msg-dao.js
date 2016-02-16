'use strict';

const Promise = require('bluebird');
const mongodb = require('mongodb');
const DaoHelper = require('../../../dao/dao-helper');
const BotMsgDao = require('../../../dao/bot-msg-dao');
const UserMsgDao = require('../../../dao/user-msg-dao');

describe('BotMsgDao', () => {

  const botMsg = {mobNumber: '919663938598', botHandle: '@bot1', body: 'hi'};
  const userMsg = {mobNumber: '919663938598', botHandle: '@bot1', body: 'hi bot'};

  before(() => {
    return Promise.delay(300).then(() => DaoHelper.db.dropDatabase());
  });

  it('Inserts a bot sent msg into db', () => {
    let userMsgId;
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
    let botMsgId;
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

  it('Gets the last msg from MsgDao', () => {
    const userMsgId = 'abcxyz';
    return BotMsgDao.insert(botMsg.mobNumber, botMsg.botHandle, 'some random msg', userMsgId)
      .then(() => BotMsgDao.insert(botMsg.mobNumber, botMsg.botHandle, botMsg.body, userMsgId))
      .then(() => BotMsgDao.getLastMsg(botMsg.mobNumber))
      .then((/*BotMsg*/ msg) => msg.body.should.equal(botMsg.body));
  });

});

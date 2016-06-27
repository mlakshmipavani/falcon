'use strict';
const Promise = require('bluebird');
const mongodb = require('mongodb');

const DaoHelper = require('../../../dao/dao-helper');
const UserMsgDao = require('../../../dao/user-msg-dao');

describe('UserMsgDao', () => {
  const msg = 'Hi, How r u';
  const user1 = {socialId: '919033819605', botHandle: '123'};
  const user2 = {socialId: '919033819609', botHandle: '999'};

  before(() => {
    return Promise.delay(300).then(() => DaoHelper.db.dropDatabase());
  });

  it('inserts new msg details', () => {
    return UserMsgDao.insert(user1.socialId, user2.botHandle, msg) //msg sent from user1 to user2
      .then(()=> DaoHelper.userMsg.find({socialId: user1.socialId}).toArray())
      .then(data => {
        data[0].botHandle.should.equal(user2.botHandle);
        data[0].body.should.equal(msg);
      });
  });

  it('checks undefined during insertion', () => {
    const originalCode = DaoHelper.userMsg.insertOne;
    DaoHelper.userMsg.insertOne = () => Promise.resolve({insertedCount: 0});

    return UserMsgDao.insert()
      .then(data => should.equal(data, undefined))
      .then(() => DaoHelper.botMsg.insertOne = originalCode);

  });

  it('gives mgs using _id', ()=> {
    return DaoHelper.userMsg.find({socialId: user1.socialId}).limit(1).next()
      .then(user => user._id.toString())
      .then(id => UserMsgDao.getMsg(id))
      .then(data => {
        data.socialId.should.equal(user1.socialId);
      });
  });

  it('mgs with no _id', ()=> {
    let error;
    return UserMsgDao.getMsg()
      .catch((err) => error = err)
      .then(() => {
        if (!error) throw new Error('this should fail');
      });
  });
});

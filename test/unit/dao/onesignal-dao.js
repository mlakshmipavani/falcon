'use strict';
const Promise = require('bluebird');
const mongodb = require('mongodb');

const DaoHelper = require('../../../dao/dao-helper');
const OneSignalDao = require('../../../dao/onesignal-dao');

describe('OneSignalDao', () => {

  const user1 = {userToken: '4444', oneSignalUserId: '6666'};
  const user2 = {userToken: '5555', oneSignalUserId: '7777'};

  before(() => {
    return Promise.delay(300).then(() => DaoHelper.db.dropDatabase());
  });

  it('stores userToken and oneSignalUserId', () => {
    return OneSignalDao.map(user1.userToken, user1.oneSignalUserId)
      .then(() => DaoHelper.oneSignal.find({userToken: user1.userToken}).toArray())
      .then(user => user[0].userToken.should.equal(user1.userToken));
  });

  it('gives oneSignalUserIds by Tokens', ()=> {
    const userTokens = [user1.userToken, user2.userToken];
    return OneSignalDao.getPlayerIds(userTokens)
      .then(ids => ids[0].should.equal(user1.oneSignalUserId));
  });

  it('tests for getAllPlayerIds', ()=> {
    return OneSignalDao.getAllPlayerIds()
      .then(arr => arr[0].should.equal(user1.oneSignalUserId));
  });
});

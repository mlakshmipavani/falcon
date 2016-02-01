'use strict';

var Promise = require('bluebird');
var mongodb = require('mongodb');

var DaoHelper = require('../../../dao/dao-helper');
var UserDao = require('../../../dao/user-dao');
var UnRegisteredDao = require('../../../dao/unregistered-dao.js');

describe('unregisteredDao', () => {

  const countryIso = 'IN';
  const user1 = {mobNumber: '919033819605', name: 'Jaydeep'};
  const user2 = {mobNumber: '917405484154', name: 'Parth'};
  const user3 = {mobNumber: '919108648284', name: 'Airtel jaydp'};

  before(() => {
    return Promise.delay(300).then(() => DaoHelper.db.dropDatabase());
  });

  it('registered guy is notified when unregistered guy registers', () => {

    return UserDao.newUser(user1.mobNumber, user1.name, countryIso)
      .then(() => {
        var unRegList = [user2.mobNumber, user3.mobNumber];
        return UnRegisteredDao.addAll(unRegList, user1.mobNumber);
      })
      .then(() => {
        return DaoHelper.unRegistered.find({mobNumber: user2.mobNumber}).limit(1).next();
      })
      .then((/* UnRegistered */ user) => {
        user.notifyList.should.deep.equal([user1.mobNumber]);
      });
  });

  it('users to be notified when unregistered contact registers', () => {
    var unRegNum = user2.mobNumber;
    return UnRegisteredDao.getNotificationList(unRegNum)
      .then(() => {
        let query = {mobNumber: unRegNum};
        return DaoHelper.unRegistered.find(query).limit(1).next()
          .then(doc => doc ? doc.notifyList : undefined)
          .should.eventually.deep.equal([user1.mobNumber]);
      });
  });

});
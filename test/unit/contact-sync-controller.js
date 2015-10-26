'use strict';

var Promise = require('bluebird');
var mongodb = require('mongodb');
var _obj = require('lodash/object');

var config = require('../../config/config.js');
var User = require('../../models/user');
var DaoHelper = require('../../dao/dao-helper.js');
var ContactSyncController = require('../../controllers/contact-sync-controller');
var UserDao = require('../../dao/user-dao.js');
var UnRegisteredDao = require('../../dao/unregistered-dao.js');

describe('ContactSyncController', () => {

  const countryIso = 'IN';

  const user1 = {mobNumber: '919033819605', name: 'Jaydeep'};
  const user2 = {mobNumber: '917405484154', name: 'Parth'};
  const user3 = {mobNumber: '919108648284', name: 'Airtel jaydp'};

  before(() => {
    return Promise.delay(100).then(() => DaoHelper.db.dropDatabase());
  });

  it('should return only unRegistered', () => {
    var contacts = {};
    for (let user of [user2, user3]) {
      contacts[user.mobNumber] = user.name;
    } // contacts = { '917405484154': 'Parth', '919108648284': 'Airtel jaydp' }

    return ContactSyncController.sync(user1.mobNumber, contacts, countryIso)
      .should.eventually.deep.equal({registered: {}, unRegistered: contacts});
  });

  it('should return only registered', () => {
    // register user1
    return UserDao.newUser(user1.mobNumber, user1.name, countryIso)
      .then(() => {
        return UserDao.newUser(user2.mobNumber, user2.name, countryIso);
      })
      .then(() => {
        let contacts = {};
        contacts[user1.mobNumber] = user1.name;
        return ContactSyncController.sync(user2.mobNumber, contacts, countryIso)
          .should.eventually.deep.equal({registered: contacts, unRegistered: {}});
      });
  });

  it('should return both', () => {
    var contacts = {};
    for (let user of [user1, user3]) {
      contacts[user.mobNumber] = user.name;
    } // contacts = { '917405484154': 'Parth', '919108648284': 'Airtel jaydp' }

    let expectReg = _obj.pick(contacts, user1.mobNumber);
    let expectUnReg = _obj.pick(contacts, user3.mobNumber);
    return ContactSyncController.sync(user2.mobNumber, contacts, countryIso)
      .should.eventually.deep.equal({registered: expectReg, unRegistered: expectUnReg});
  });

  /**
   * This test verifies that the below tests
   * - should return only unRegistered
   * - should return both
   * added the unRegistered people to the unregistered collection,
   * associating them with a list to notify (registered) people when they (unRegistered people)
   * register
   */
  it('should have added unRegistered to notifyList', () => {
    return UnRegisteredDao.getNotificationList(user2.mobNumber)
      .should.eventually.deep.equal([user1.mobNumber])
      .then(() => {
        return UnRegisteredDao.getNotificationList(user3.mobNumber)
          .should.eventually.deep.equal([user1.mobNumber, user2.mobNumber]);
      });
  });

  /**
   * User2 synced with user1 in his contacts, in the following test
   * - should return only registered
   * Thus user1 should have user2 in friends
   */
  it('friends should have added him', () => {
    var query = {mobNumber: user1.mobNumber};
    return DaoHelper.user.find(query).limit(1).next()
      .then((/* User */ user) => user.friends.should.deep.equal([user2.mobNumber]));
  });

  /**
   * User2 synced with user1 in his contacts, in the following test
   * - should return only registered
   * Thus user2 should have user1 in his contacts
   */
  it('should have contacts', () => {
    var query = {mobNumber: user2.mobNumber};
    return DaoHelper.user.find(query).limit(1).next()
      .then((/* User */ user) => user.contacts.should.deep.equal([user1.mobNumber]));
  });

});

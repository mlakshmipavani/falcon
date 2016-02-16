'use strict';

const Promise = require('bluebird');
const mongodb = require('mongodb');
const _obj = require('lodash/object');

const config = require('../../../config/config');
const DaoHelper = require('../../../dao/dao-helper');
const ContactSyncController = require('../../../controllers/contact-sync-controller');
const UserDao = require('../../../dao/user-dao');
const UnRegisteredDao = require('../../../dao/unregistered-dao');

describe('ContactSyncController', () => {

  const countryIso = 'IN';

  const user1 = {mobNumber: '919033819605', name: 'Jaydeep'};
  const user2 = {mobNumber: '917405484154', name: 'Parth'};
  const user3 = {mobNumber: '919108648284', name: 'Airtel jaydp'};

  before(() => {
    return Promise.delay(100).then(() => DaoHelper.db.dropDatabase());
  });

  it('should return only unRegistered', () => {
    const contacts = {};
    for (const user of [user2, user3]) contacts[user.mobNumber] = user.name;

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
        const contacts = {};
        contacts[user1.mobNumber] = user1.name;
        return ContactSyncController.sync(user2.mobNumber, contacts, countryIso)
          .should.eventually.deep.equal({registered: contacts, unRegistered: {}});
      });
  });

  it('should return both', () => {
    const contacts = {};
    for (const user of [user1, user3]) contacts[user.mobNumber] = user.name;

    const expectReg = _obj.pick(contacts, user1.mobNumber);
    const expectUnReg = _obj.pick(contacts, user3.mobNumber);
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
    const query = {mobNumber: user1.mobNumber};
    return DaoHelper.user.find(query).limit(1).next()
      .then((/* User */ user) => user.friends.should.deep.equal([user2.mobNumber]));
  });

  /**
   * User2 synced with user1 in his contacts, in the following test
   * - should return only registered
   * Thus user2 should have user1 in his contacts
   */
  it('should have contacts', () => {
    const query = {mobNumber: user2.mobNumber};
    return DaoHelper.user.find(query).limit(1).next()
      .then((/* User */ user) => user.contacts.should.deep.equal([user1.mobNumber]));
  });

});

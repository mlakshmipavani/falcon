'use strict';

var Promise = require('bluebird');
var mongodb = require('mongodb');

var DaoHelper = require('../../../dao/dao-helper');
var UserDao = require('../../../dao/user-dao');

describe('UserDao', () => {

  const countryIso = 'IN';

  const user1 = {mobNumber: '919033819605', name: 'Jaydeep'};
  const user2 = {mobNumber: '917405484154', name: 'Parth'};
  const user3 = {mobNumber: '919108648284', name: 'Airtel jaydp'};

  before(() => {
    return Promise.delay(100).then(() => DaoHelper.db.dropDatabase());
  });

  it('creates a new user', () => {
    return UserDao.newUser(user1.mobNumber, user1.name, countryIso)
      .then(() => {
        let query = {mobNumber: user1.mobNumber};
        return DaoHelper.user.find(query).toArray()
          .then((/* Array<User> */ docs) => {
            docs.should.have.length(1);
            let user = docs[0];
            user.mobNumber.should.equal(user1.mobNumber);
            user.name.should.equal(user1.name);
          });
      });
  });

  it('creates an existing user', () => {
    var newName = 'New Jaydeep';
    return UserDao.newUser(user1.mobNumber, newName, countryIso)
      .then(() => {
        let query = {mobNumber: user1.mobNumber};
        return DaoHelper.user.find(query).toArray()
          .then((/* Array<User> */ docs) => {
            docs.should.have.length(1);
            let user = docs[0];
            user.mobNumber.should.equal(user1.mobNumber);
            user.name.should.equal(newName);
          });
      });
  });

  it('finds registered users from a list', () => {
    var numbers = [user1, user2, user3].map((/* User */ user) => user.mobNumber);
    return UserDao.findRegistered(numbers).should.eventually.deep.equal([user1.mobNumber]);
  });

  it('should add him as friend', () => {
    // first create a new user
    return UserDao.newUser(user2.mobNumber, user2.name, countryIso)
      .then(() => {
        // actual test
        let numbers = [user1.mobNumber, user2.mobNumber];
        return UserDao.friendsAddHim(user3.mobNumber, numbers)
          .then(() => {
            let query = {mobNumber: {$in: numbers}};
            return DaoHelper.user.find(query).toArray()
              .then((/* Array<User> */ docs) => {
                for (let user of docs) {
                  user.friends.should.have.length(1);
                  user.friends[0].should.equal(user3.mobNumber);
                }
              });
          });
      });
  });

  it('should add contacts', () => {
    var numbers = [user2.mobNumber, user3.mobNumber];
    return UserDao.addContacts(user1.mobNumber, numbers)
      .then(() => {
        return DaoHelper.user.find({mobNumber: user1.mobNumber}).limit(1).next()
          .then((/* User */ user) => user.contacts.should.deep.equal(numbers));
      });
  });

  it('updates name', () => {
    var latestName = 'Latest Jaydeep';
    return UserDao.updateName(user1.mobNumber, latestName)
      .then(() => {
        return DaoHelper.user.find({mobNumber: user1.mobNumber}).limit(1).next()
          .then((/* User */ user) => user.name.should.equal(latestName));
      });
  });

});

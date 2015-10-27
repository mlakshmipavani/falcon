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

  it('finds registered users from a list');

  it('should add him as friend');

  it('should add contacts');

  it('updates name');

});

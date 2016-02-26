'use strict';

const Promise = require('bluebird');
const mongodb = require('mongodb');

const DaoHelper = require('../../../dao/dao-helper');
const UserDao = require('../../../dao/user-dao');

describe('UserDao', () => {

  const countryIso = 'IN';

  const user1 = {socialId: '919033819605', name: 'Jaydeep'};

  before(() => {
    return Promise.delay(100).then(() => DaoHelper.db.dropDatabase());
  });

  it('creates a new user', () => {
    return UserDao.newUser(user1.socialId, user1.name, countryIso)
      .then(() => {
        const query = {socialId: user1.socialId};
        return DaoHelper.user.find(query).toArray()
          .then((/* Array<User> */ docs) => {
            docs.should.have.length(1);
            const user = docs[0];
            user.socialId.should.equal(user1.socialId);
            user.name.should.equal(user1.name);
          });
      });
  });

  it('creates an existing user', () => {
    const newName = 'New Jaydeep';
    return UserDao.newUser(user1.socialId, newName, countryIso)
      .then(() => {
        const query = {socialId: user1.socialId};
        return DaoHelper.user.find(query).toArray()
          .then((/* Array<User> */ docs) => {
            docs.should.have.length(1);
            const user = docs[0];
            user.socialId.should.equal(user1.socialId);
            user.name.should.equal(newName);
          });
      });
  });

  it('updates name', () => {
    const latestName = 'Latest Jaydeep';
    return UserDao.updateName(user1.socialId, latestName)
      .then(() => {
        return DaoHelper.user.find({socialId: user1.socialId}).limit(1).next()
          .then((/* User */ user) => user.name.should.equal(latestName));
      });
  });
});

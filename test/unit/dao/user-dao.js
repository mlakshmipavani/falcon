'use strict';
const Promise = require('bluebird');
const mongodb = require('mongodb');

const DaoHelper = require('../../../dao/dao-helper');
const UserDao = require('../../../dao/user-dao');

describe('UserDao', () => {

  const countryIso = 'IN';

  const user1 = {socialId: '919033819605', name: 'Jaydeep', olaAccessToken: '123'};

  before(() => {
    return Promise.delay(300).then(() => DaoHelper.db.dropDatabase());
  });

  it('creates a new user', () => {
    return UserDao.newUser(user1.socialId, user1.name, countryIso, user1.olaAccessToken)
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
    return UserDao.newUser(user1.socialId, newName, countryIso, user1.olaAccessToken)
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

  it('finds user with socialId', () => {
    return UserDao.findUserWithSocialId(user1.socialId)
      .then((res) => {
        res.name.should.equal('Latest Jaydeep');
      });
  });

  it('finds user with no socialId', () => {
    let error;
    return UserDao.findUserWithSocialId()
      .catch(err => error = err)
      .then(() => {
        if (!error) throw new Error('this should fail');
      });
  });

  it('sets emailConfirmed', () => {
    return UserDao.setEmailConfirmed(user1.socialId)
      .then(() => {
        return DaoHelper.user.find({socialId: user1.socialId}).limit(1).next()
          .then((user)=> user.isEmailConfirmed.should.equal(true));
      });
  });

  it('updates Token', () => {
    const latestToken = '789';
    return UserDao.findUserWithSocialId(user1.socialId)
      .then(user => user._id.toString())
      .then(userToken => UserDao.storeOlaAccessToken(userToken, latestToken))
      .then(() => DaoHelper.user.find({socialId: user1.socialId}).limit(1).next())
      .then((/* User */ user) => {
        user.olaAccessToken.should.equal(latestToken);
      });
  });

  it('finds users olaAccessToken', () => {
    return UserDao.findUserWithSocialId(user1.socialId)
      .then(user => user._id.toString())
      .then(Token => UserDao.getOlaAccessToken(Token))
      .then(AccessToken => AccessToken.should.equal('789'));
  });

  it('finds user with token', () => {
    return UserDao.findUserWithSocialId(user1.socialId)
      .then(user => user._id.toString())
      .then(Token => UserDao.findUserWithToken(user1.socialId, Token))
      .then(user => user.socialId.should.equal(user1.socialId));
  });

  it('finds user with no token', () => {
    let error;
    return UserDao.findUserWithToken()
      .catch((err) => error = err)
      .then(() => {
        if (!error) throw new Error('this should fail');
      });
  });

  it('newUser err', () => {
    const originalCode = DaoHelper.user.findOneAndUpdate;
    DaoHelper.user.findOneAndUpdate = () => Promise.resolve({ok: 0});
    const logger = UserDao.logger();
    const originalLoggerError = logger.error;
    logger.error = () => undefined;

    let error;
    return UserDao.newUser()
      .catch(err => error = err)
      .then(() => {
        if (!error) throw new Error('this should fail');
      })
      .then(() => DaoHelper.user.findOneAndUpdate = originalCode)
      .then(() => logger.error = originalLoggerError);
  });
});

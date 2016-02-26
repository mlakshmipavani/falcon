'use strict';

const mongodb = require('mongodb');
const Promise = require('bluebird');

const Auth = require('../../../middlewares/auth-middleware');
const config = require('../../../config/config');
const UserDao = require('../../../dao/user-dao');

describe('Auth Middleware', () => {

  //noinspection Eslint
  var authMiddleware = Auth();

  const socialId = '919033819605';
  const name = 'Jaydeep';
  let token;
  let dbObj;

  before(() => {
    return mongodb.MongoClient.connect(config.mongoUrl, {promiseLibrary: Promise})
      .then(db => dbObj = db)
      .then((db) => db.dropDatabase())
      .then(() => { // insert new user
        return UserDao.newUser(socialId, name, 'IN');
      })
      .then(userObj => token = userObj._id.toString())
      .catch((err) => console.log(`Error mongodb : ${err}`));
  });

  it('should allow /login to pass', done => {
    authMiddleware({url: '/login'}, undefined, (err) => {
      if (!err) return done();
      throw err;
    });
  });

  it('should not allow anonymous', done => {
    authMiddleware({url: '/newbots', username: 'anonymous', authorization: {}}, undefined, err => {
      if (err) return done();
      throw new Error('Anonymous user should not be allowed');
    });
  });

  it('registered user should be able to access', done => {
    const req = {url: '/newbots', username: socialId, authorization: {basic: {password: token}}};
    authMiddleware(req, undefined, err => {
      if (err) throw err;
      done();
    });
  });

  after(() => dbObj.dropDatabase());

});

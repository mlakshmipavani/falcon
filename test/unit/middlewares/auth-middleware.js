'use strict';

var mongodb = require('mongodb');
var Promise = require('bluebird');

var Auth = require('../../../middlewares/auth-middleware');
var config = require('../../../config/config.js');
var UserDao = require('../../../dao/user-dao.js');

describe('Auth Middleware', () => {

  var authMiddleware = Auth();

  const mobNumber = '919033819605';
  const name = 'Jaydeep';
  var token;
  var dbObj;

  before(() => {
    return mongodb.MongoClient.connect(config.mongoUrl, {promiseLibrary: Promise})
      .then(db => dbObj = db)
      .then((db) => db.dropDatabase())
      .then(() => { // insert new user
        return UserDao.newUser(mobNumber, name, 'IN');
      })
      .then(userObj => token = userObj._id.toString())
      .catch((err) => console.log(`Error mongodb : ${err}`));
  });

  it('should allow /register to pass', done => {
    authMiddleware({url: '/register'}, undefined, (err) => {
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
    var req = {url: '/newbots', username: mobNumber, authorization: {basic: {password: token}}};
    authMiddleware(req, undefined, err => {
      if (err) throw err;
      done();
    });
  });

  after(() => dbObj.dropDatabase());

});

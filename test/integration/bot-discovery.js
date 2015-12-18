'use strict';

var request = require('supertest-as-promised');
var Promise = require('bluebird');

var app = require('../../app');
var mongodb = require('mongodb');
var config = require('../../config/config.js');
var UserDao = require('../../dao/user-dao.js');
var BotDao = require('../../dao/bot-dao.js');

describe('Bot Discovery', () => {

  const PORT = 3050;
  const mobNumber = '919033819605';
  const name = 'Jaydeep';
  var token;

  const botHandles = ['@yo', '@copyCat', '@hello'];
  const botNames = ['Yo!', 'Copy Cat', 'Hello'];

  var dbObj;

  before(() => {
    return mongodb.MongoClient.connect(config.mongoUrl, {promiseLibrary: Promise})
      .then(db => dbObj = db)
      .then((db) => db.dropDatabase())
      .then(() => { // insert new user
        return UserDao.newUser(mobNumber, name, 'IN');
      })
      .then(userObj => token = userObj._id.toString())
      .then(() => { // insert a few bots
        let i = 0;
        return Promise.join(
          BotDao.newBot(botHandles[i], botNames[i]),
          BotDao.newBot(botHandles[++i], botNames[i]),
          BotDao.newBot(botHandles[++i], botNames[i])
        );
      })
      .then(() => app.listen(PORT))

      // delay is to allow mongodb to kick in
      .delay(100)
      .catch((err) => console.log(`Error mongodb : ${err}`));
  });

  after(() => app.close());

  it('gets the latest bots', () => {
    return request(`http://localhost:${PORT}`)
      .get('/newbots')
      .auth(mobNumber, token)
      .query({count: 3})
      .expect('Content-Type', /json/)
      .then((res) => {
        var body = res.body;
        body.should.have.length(3);
      });
  });

  after(() => dbObj.dropDatabase());
});

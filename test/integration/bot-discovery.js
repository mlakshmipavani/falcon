'use strict';

const request = require('supertest-as-promised');
const Promise = require('bluebird');

const app = require('../../app');
const mongodb = require('mongodb');
const config = require('../../config/config');
const UserDao = require('../../dao/user-dao');
const BotDao = require('../../dao/bot-dao');

describe('Bot Discovery', () => {

  const PORT = 3050;
  const mobNumber = '919033819605';
  const name = 'Jaydeep';
  let token;

  const botHandles = ['@yo', '@copyCat', '@hello'];
  const botNames = ['Yo!', 'Copy Cat', 'Hello'];

  let dbObj;

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
        const body = res.body;
        body.should.have.length(3);
      });
  });

  after(() => dbObj.dropDatabase());
});

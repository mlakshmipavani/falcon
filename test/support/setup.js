'use strict';

process.env.NODE_ENV = 'test';

const Promise = require('bluebird');
const mongodb = require('mongodb');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const config = require('../../config/config');

// configure chai
global.should = chai.should();
chai.use(chaiAsPromised);
chai.use(require('chai-joi'));

mongodb.MongoClient.connect(config.mongoUrl, {promiseLibrary: Promise})
  .then((db) => db.dropDatabase())
  .catch((err) => console.log(`Error connecting to mongodb : ${err}`));

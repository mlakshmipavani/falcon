'use strict';

var Promise = require('bluebird');
var mongodb = require('mongodb');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var config = require('../../config/config.js');

process.env.NODE_ENV = 'test';

// configure chai
global.should = chai.should();
chai.use(chaiAsPromised);
chai.use(require('chai-joi'));

mongodb.MongoClient.connect(config.mongoUrl, {promiseLibrary: Promise})
  .then((db) => db.dropDatabase())
  .catch((err) => console.log(`Error connecting to mongodb : ${err}`));

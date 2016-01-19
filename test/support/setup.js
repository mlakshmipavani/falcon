'use strict';

process.env.NODE_ENV = 'test';

let Promise = require('bluebird');
let mongodb = require('mongodb');
let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
let config = require('../../config/config.js');

// configure chai
global.should = chai.should();
chai.use(chaiAsPromised);
chai.use(require('chai-joi'));

mongodb.MongoClient.connect(config.mongoUrl, {promiseLibrary: Promise})
  .then((db) => db.dropDatabase())
  .catch((err) => console.log(`Error connecting to mongodb : ${err}`));

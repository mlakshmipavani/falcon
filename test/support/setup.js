'use strict';

var Promise = require('bluebird');
var mongodb = require('mongodb');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

var config = require('../../config/config.js');

process.env.NODE_ENV = 'test';

/**
 * Blanket is a code coverage tool
 */

//require('blanket')({
//  // covers all the code whose path matches the below regex
//  pattern: [''],
//
//  // excludes the below folders
//  'data-cover-never': ['node_modules', 'test'],
//  'data-cover-reporter-options': {
//    // makes sure each file is refered from project root in the report
//    basepath: process.cwd() + '/lib'
//  }
//});
// FIXME : code coverage

// configure chai
global.should = chai.should();
chai.use(chaiAsPromised);
chai.use(require('chai-joi'));

mongodb.MongoClient.connect(config.mongoUrl, {promiseLibrary: Promise})
  .then((db) => db.dropDatabase())
  .catch((err) => console.log(`Error connecting to mongodb : ${err}`));

'use strict';

var Promise = require('bluebird');
var mongodb = require('mongodb');

var config = require('../config/config');
var log = require('../utils/logger');

mongodb.MongoClient.connect(config.mongoUrl, {promiseLibrary: Promise})
  .then((db) => connected(db))
  .catch((err) => log.fatal(`Error connecting to mongodb : ${err}`));

/**
 * @param {Db} db
 */
function connected(db) {
  // initialize the global db object
  exports.db = db;

  //noinspection JSCheckFunctionSignatures
  /** @type {Collection} */
  exports.user = db.collection('user');
}


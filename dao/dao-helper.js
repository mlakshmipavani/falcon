'use strict';

var promise = require('bluebird');
var mongodb = require('mongodb');

var config = require('../config/config');
var logger = require('../utils/logger');

mongodb.MongoClient.connect(config.mongoUrl, {promiseLibrary: promise})
  .then((db) => connected(db))
  .catch((err) => logger.fatal(`Error connecting to mongodb : ${err}`));

/**
 * @param {Db} db
 */
function connected(db) {
  // initialize the global db object
  exports.db = db;

  /** @type {Collection} */
  exports.user = db.collection('user');
}


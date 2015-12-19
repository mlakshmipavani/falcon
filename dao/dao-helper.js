'use strict';

var Promise = require('bluebird');
var mongodb = require('mongodb');

var config = require('../config/config');
var log = require('../utils/logger');

mongodb.MongoClient.connect(config.mongoUrl, {promiseLibrary: Promise})
  .then((db) => DaoHelper.connected(db))
  .catch((err) => log.fatal(`Error connecting to mongodb : ${err}`));

/**
 * Helper that wraps the collections and MongoDb object
 */
class DaoHelper {

  /**
   * @param {Db} db
   */
  static connected(db) {
    // initialize the global db object
    exports.db = db;

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.user = db.collection('user');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.bot = db.collection('bot');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.unRegistered = db.collection('unregistered');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.userMsg = db.collection('userMsg');
  }
}

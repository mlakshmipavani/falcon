'use strict';

const Promise = require('bluebird');
const mongodb = require('mongodb');

const config = require('../config/config');
const log = require('../utils/logger');

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
    exports.contacts = db.collection('contacts');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.bot = db.collection('bot');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.userMsg = db.collection('userMsg');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.botMsg = db.collection('botMsg');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.pnrStatus = db.collection('pnrStatus');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.agendaJobs = db.collection('agendaJobs');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.oneSignal = db.collection('oneSignal');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.bmsCities = db.collection('bmsCities');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.movies = db.collection('movies');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.trendingSeries = db.collection('trendingSeries');

    //noinspection JSCheckFunctionSignatures
    /** @type {Collection} */
    exports.nextEpisodeCache = db.collection('nextEpisodeCache');
  }
}

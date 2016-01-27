'use strict';

var config = {};

config.appName = 'FalconV2';

//noinspection JSUnresolvedVariable
/**
 * MongoDb
 */
config.mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/yolobots';

/**
 * Bunyan
 */
config.bunyan = {};
config.bunyan.name = config.appName;

//noinspection JSUnresolvedVariable
config.bunyan.level = process.env.BUNYAN_LEVEL || 'debug';

config.botServerUrl = process.env.BOT_SERVER_URL || 'http://localhost:5000/';

/**
 * Uber Api
 */
config.uber = {};
config.uber.baseUrl = process.env.NODE_ENV === 'test' ? 'http://localhost:5001'
  : 'https://api.uber.com/v1';

/**
 * Export
 */
module.exports = config;

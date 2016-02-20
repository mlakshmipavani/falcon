'use strict';

const config = {};

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
 * Ola Api
 */
config.ola = {};
config.ola.baseUrl = process.env.NODE_ENV === 'test' ? 'http://sandbox-t.olacabs.com/v1' :
  'https://devapi.olacabs.com/v1';
config.ola.token = process.env.NODE_ENV === 'test' ? '3fc98f5c4e5343f4adfe28bd8a75d51f' :
  'fc3de0a97c3a4937aca2b9f9f2f52ed7';

/**
 * Pnr Api
 */
config.railway = {};
config.railway.pnrUrl = process.env.NODE_ENV === 'test' ? 'http://localhost:5001'
  : 'http://www.indianrail.gov.in/cgi_bin/inet_pnstat_cgi_2484.cgi';

/**
 * Wit.AI
 */
config.wit = {};
config.wit.apiKey = process.env.WIT_API_KEY || 'UUA2F5RZ4W4CGX2P7EQWM2RIVXSTDEIA';

/**
 * One Signal
 */
config.oneSignal = {};
config.oneSignal.appId = process.env.ONESIGNAL_APP_ID || '782fdeab-89df-4cbf-b875-2422ae3b276f';

/**
 * Export
 */
module.exports = config;

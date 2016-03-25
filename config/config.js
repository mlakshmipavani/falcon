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
config.ola.sandboxUrl = 'http://sandbox-t.olacabs.com/v1';
config.ola.sandboxToken = '3fc98f5c4e5343f4adfe28bd8a75d51f';
config.ola.baseUrl = process.env.NODE_ENV === 'test' ? config.ola.sandboxUrl :
  'https://devapi.olacabs.com/v1';
config.ola.token = process.env.NODE_ENV === 'test' ? config.ola.sandboxToken :
  'fc3de0a97c3a4937aca2b9f9f2f52ed7';

/**
 * Pnr Api
 */
config.railway = {};
config.railway.confirmtktApiUrl = 'http://api.confirmtkt.com/api/pnr/status/';
config.railway.chkPnrStsIrctcApiUrl = 'http://checkpnrstatusirctc.in/pnrajax/pnr.php?pnrno=';

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
 * BookMyShow
 */
config.bookMyShow = {};
config.bookMyShow.url = process.env.BOOK_MY_SHOW_URL || 'http://data-in.bookmyshow.com';
config.bookMyShow.ratingsUrl = 'https://sa-in.bookmyshow.com/v3/multiGet.bms';

/**
 * AWS Lambda
 */
config.awsLambda = {};
config.awsLambda.apiKey = process.env.AWS_LAMBDA_API_KEY ||
  'nBWVBXBOPV6AYcdC8reQR8Z0twOwu0e9aYsrSlvJ';
config.awsLambda.closestMaterialColorUrl = process.env.CLOSEST_MATERIAL_COLOR_URL ||
  'https://iwwfzsbdy8.execute-api.us-east-1.amazonaws.com/prod/closest-material-color';

/**
 * Export
 */
module.exports = config;

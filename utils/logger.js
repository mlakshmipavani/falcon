'use strict';

const bunyan = require('bunyan');
const config = require('../config/config');
const Bunyan2Loggly = require('bunyan-loggly');

/**
 * Exposes Bunyan Logger to the application
 * @module  utils/logger
 *
 * @see {@link https://github.com/trentm/node-bunyan|bunyan}
 */

const bunyanConfig = config.bunyan;
bunyanConfig.streams = bunyanConfig.streams || [];
bunyanConfig.streams.push({level: bunyanConfig.level, stream: process.stdout});

if (process.env.NODE_ENV === 'development') {
  const logglyConfig = {
    token: 'fc510f5a-38d2-4ebd-8aac-e7f35fee4f93',
    subdomain: 'stayyolo'
  };
  const bufferLength = 5; // sends the logs to loggly on every 5th log
  const bufferTimeout = 1000; // sends the logs to loggly every 1second even if it doesn't hv 5 logs
  const logglyStream = new Bunyan2Loggly(logglyConfig, bufferLength, bufferTimeout);
  bunyanConfig.streams.push({type: 'raw', stream: logglyStream});
}

/**
 * @type {Logger}
 */
const logger = bunyan.createLogger(bunyanConfig);

module.exports = logger;

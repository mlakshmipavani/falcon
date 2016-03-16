'use strict';

const bunyan = require('bunyan');
const config = require('../config/config');

/**
 * Exposes Bunyan Logger to the application
 * @module  utils/logger
 *
 * @see {@link https://github.com/trentm/node-bunyan|bunyan}
 */

/**
 * @type {Logger}
 */
const logger = bunyan.createLogger(config.bunyan);

module.exports = logger;

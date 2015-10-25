'use strict';

var bunyan = require('bunyan');
var config = require('../config/config');

/**
 * Exposes Bunyan Logger to the application
 * @module  utils/logger
 *
 * @see {@link https://github.com/trentm/node-bunyan|bunyan}
 */

/**
 * @type {Logger}
 */
var logger = bunyan.createLogger(config.bunyan);

module.exports = logger;

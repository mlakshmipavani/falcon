'use strict';

var restify = require('restify');
var Promise = require('bluebird');

var mockDigits = restify.createServer({});

mockDigits.use(restify.bodyParser({
  mapParams: true
}));

//noinspection Eslint
mockDigits.get('/', (req, res) => res.json({phone_number: '+919033819605'}));// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers

// promisify the listen function
mockDigits.listen = Promise.promisify(mockDigits.listen);
mockDigits.close = Promise.promisify(mockDigits.close);

/**
 * @type {Server}
 */
module.exports = mockDigits;

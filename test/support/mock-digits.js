'use strict';

const restify = require('restify');
const Promise = require('bluebird');

const mockDigits = restify.createServer({});

mockDigits.use(restify.bodyParser({
  mapParams: true
}));

mockDigits.get('/', (req, res) => res.json({phone_number: '+919033819605'}));

// promisify the listen function
mockDigits.listen = Promise.promisify(mockDigits.listen);
mockDigits.close = Promise.promisify(mockDigits.close);

/**
 * @type {Server}
 */
module.exports = mockDigits;

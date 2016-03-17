'use strict';

const restify = require('restify');
const Promise = require('bluebird');

const regionResponse = require('./region-list.json');
const moviesResponse = require('./movies-list.json');

const mockBookMyShow = restify.createServer({});

mockBookMyShow.use(restify.queryParser());
mockBookMyShow.use(restify.bodyParser({
  mapParams: true
}));

mockBookMyShow.get('/', (req, res) => {
  const cmd = req.params.cmd;
  if (cmd === 'REGIONLIST') return res.json(regionResponse);
  else if (cmd === 'GETEVENTLIST') return res.json(moviesResponse);
});

// promisify the listen function
mockBookMyShow.listen = Promise.promisify(mockBookMyShow.listen);
mockBookMyShow.close = Promise.promisify(mockBookMyShow.close);

mockBookMyShow.listen(5000);

/**
 * @type {Server}
 */
module.exports = mockBookMyShow;

'use strict';

const Agenda = require('agenda');
const config = require('../config/config');

const url = config.mongoUrl;
module.exports = new Agenda({db: {address: url}});

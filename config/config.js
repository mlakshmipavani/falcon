'use strict';

var config = {};

config.appName = 'FalconV2';
config.mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/stayyolo';

config.bunyan = {};
config.bunyan.name = config.appName;
config.bunyan.level = process.env.BUNYAN_LEVEL || 'debug';

module.exports = config;

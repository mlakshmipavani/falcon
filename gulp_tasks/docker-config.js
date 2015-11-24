'use strict';

var dockerConfig = {};

dockerConfig.tags = {
  mongo: 'mongodb'
};

dockerConfig.mongoCreateOptions = {
  Image: 'mongo:3.0',
  name: dockerConfig.tags.mongo,
  ExposedPorts: {'27017/tcp': {}},
  HostConfig: {
    // this directory should exist, mongodb stores the data here
    Binds: [`${process.env.HOME}/Documents/mongodb/db:/data/db`],
    PortBindings: {
      '27017/tcp': [{HostPort: '27017'}]
    }
  }
};

/**
 * Export
 */
module.exports = dockerConfig;

'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var Docker = require('dockerode');

var dockerConfig = require('./docker-config');

var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

gulp.task('docker.runMongo', () => {
  removeContainer(dockerConfig.tags.mongo, () => {
    docker.createContainer(dockerConfig.mongoCreateOptions, (err1, container) => {
      if (err1) gutil.log(gutil.colors.red('create container error:', err1));
      container.start((err2, data) => {
        if (err2) gutil.log(gutil.colors.red('start container error:', err2));
        if (data) console.log(data);
      });
    });
  });
});

/**
 * Removes a container with the given name
 */
function removeContainer(name, cb) {
  docker.listContainers({all: 1}, (err, containers) => {
    for (let containerInfo of containers) {
      if (containerInfo.Names[0] === `/${name}`) {
        docker.getContainer(containerInfo.Id).remove(cb);
        return;
      }
    }

    cb();
  });
}

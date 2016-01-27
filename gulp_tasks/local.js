'use strict';

var gulp = require('gulp-help')(require('gulp'));
var stream = require('stream');

var ENV = require('./env.js');
var dockerUtils = require('./docker-utils');

// TODO : crate a separate file for deploying server to tutum

gulp.task('docker.build', 'Builds a Dev container from the current dir', () => {
  let dockerConfig = require('./docker-config')(ENV.DEV_ENV);
  return dockerUtils.build(dockerConfig.tag);
}, {aliases: ['d.build']});

gulp.task('docker.build.prod', 'Builds a Prod container from the current dir', () => {
  let dockerConfig = require('./docker-config')(ENV.PROD_ENV);
  return dockerUtils.build(dockerConfig.tag);
}, {aliases: ['d.build.prod']});

gulp.task('docker.run', 'Runs the container locally', () => {
  let dockerConfig = require('./docker-config')(ENV.DEV_ENV);
  return dockerUtils.run(dockerConfig.dockerodeCreateConfig);
}, {aliases: ['d.run']});

gulp.task('docker.run.prod', 'Runs the Prod container locally', () => {
  let dockerConfig = require('./docker-config')(ENV.PROD_ENV);
  return dockerUtils.run(dockerConfig.dockerodeCreateConfig);
}, {aliases: ['d.run.prod']});

gulp.task('docker.logs', 'Gets the real time logs from local mongodb', () => {
  let dockerConfig = require('./docker-config')(ENV.DEV_ENV);
  return dockerUtils.realTimeLogs(dockerConfig.tag);
}, {aliases: ['d.logs']});

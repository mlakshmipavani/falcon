'use strict';

const gulp = require('gulp-help')(require('gulp'));
const Tutum = require('tutum');
const Promise = require('bluebird');
const WebSocket = require('ws');
const spawn = require('child_process').spawn;
const ENV = require('./gulp_utils/env');
const dockerUtils = require('./docker-utils');
const dockerConfig = require('./docker-config')(ENV.PROD_ENV);
require('dotenv').config();

/**
 * Creates a service on tutum
 * [Note] : before creating this service you should hv pushed the image
 */
gulp.task('tutum.create', 'Creates a service on tutum [It doesn\'t start the service]', () => {
  const tutum = getTutum();
  const username = assertEnvVar(process.env.TUTUM_USERNAME);
  console.log('creating container . . .');
  return tutum.post('/service', dockerConfig.tutumConfig(username))
    .then(console.log);
}, {aliases: ['t.create']});

/**
 * Update the configuration on the Tutum container
 * Let's see you hv added a new env variable, this task will add that env var to the container
 */
gulp.task('tutum.updateConfig', 'Update the container configuration on tutum & redeploy', () => {
  const tutum = getTutum();
  const username = assertEnvVar(process.env.TUTUM_USERNAME);
  return getUuid()
    .then((/*string*/ uuid) =>
      tutum.patch(`/service/${uuid}`, dockerConfig.tutumUpdateConfig(username)))
    .then((/*{uuid}*/ service) => service.uuid)
    .then((/*string*/ uuid) => tutum.post(`/service/${uuid}/redeploy`))
    .tap(console.log);
}, {aliases: ['t.updateConfig']});

/**
 * Starts the service created in `tutum.create`
 */
gulp.task('tutum.start',
  'Starts the service on tutum [A service needs to be created first]', () => {
    const tutum = getTutum();
    return getUuid()
      .then((/*string*/ uuid) => tutum.post(`/service/${uuid}/start`))
      .then(console.log);
  }, {aliases: ['t.start']});

/**
 * Redeploys the container
 */
gulp.task('tutum.redeploy', 'Redeploys the container on tutum', () => {
  const tutum = getTutum();
  return getUuid()
    .then((/*string*/ uuid) => tutum.post(`/service/${uuid}/redeploy`))
    .then(console.log);
}, {aliases: ['t.redeploy']});

/**
 * Pushes the image to Tutum private Repository
 */
gulp.task('tutum.push', 'Pushes the image falcon:production to tutum', () => {
  const tutumUsername = assertEnvVar(process.env.TUTUM_USERNAME);
  const image = dockerConfig.getTutumImage(tutumUsername);
  const splits = image.split(':');
  const imageName = splits[0];
  const tag = splits[1];
  return dockerUtils.tag(dockerConfig.tag, imageName, tag)
    .then((imageName) => {
      const cmd = spawn('bash', ['-c', `docker push ${imageName}`]);
      cmd.stdout.setEncoding('utf8');
      cmd.stdout.on('data', (data) => process.stdout.write(data));
      cmd.stderr.on('data', (data) => process.stderr.write(data));
      cmd.on('close', () => console.log('!!@@PUSHED@@!!'));
    });
}, {aliases: ['t.push']});

gulp.task('tutum.logs', 'Realtime logs directly from tutum', () => {
  getUuid()
    .then((/*string*/ uuid) => {
      const user = assertEnvVar(process.env.TUTUM_USERNAME);
      const token = assertEnvVar(process.env.TUTUM_USER_PUBLIC_TOKEN);
      const url = `wss://stream.tutum.co/v1/service/${uuid}/logs?sid=${token}&user=${user}`;
      const ws = new WebSocket(url);
      ws.on('open', () => console.log('Connected'));
      ws.on('error', (message) => console.error('Error: %s', message));
      ws.on('message', (message) => {
        message = JSON.parse(message);
        if (message.type !== 'log') return;
        console.log(`[${message.source}] : ${message.log.trim()}`);
      });
      ws.on('close', () => console.log('Socket closed', arguments));
    });
}, {aliases: ['t.logs']});

/**
 * Gets the UUID if the service
 * @returns {Promise<string>}
 */
function getUuid() {
  const tutum = getTutum();
  return tutum.get('/service', {name: dockerConfig.name})
    .then((/*{meta, objects}*/ res) => res.objects)
    .filter((/*{state}*/ service) => {
      return service.state !== 'Terminating' && service.state !== 'Terminated';
    })
    .then((/*[]*/ services) => {
      if (services.length === 0) throw new Error('No running mongo containers');
      if (services.length > 1) throw new Error('Multiple containers found');
      return services[0];
    })
    .then((/*{uuid}*/ service) => service.uuid)
    .tap(console.log);
}

/**
 * Get Tutum client object
 * @returns {Tutum}
 */
function getTutum() {
  const username = assertEnvVar(process.env.TUTUM_USERNAME);
  const apiKey = assertEnvVar(process.env.TUTUM_API_KEY);
  const tutum = new Tutum({username, apiKey});
  tutum.get = Promise.promisify(tutum.get);
  tutum.post = Promise.promisify(tutum.post);
  tutum.patch = Promise.promisify(tutum.patch);
  return tutum;
}

function assertEnvVar(envVar) {
  if (!envVar) throw new Error('UnDefined environment variable');
  return envVar;
}

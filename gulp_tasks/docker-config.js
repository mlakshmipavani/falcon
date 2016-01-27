'use strict';
var EnvVar = require('./gulp_utils/envvar');
var Port = require('./gulp_utils/port');
var config; // lazy load this module

class DockerConfig {

  constructor(env) {
    this.env = env;
    this._isDev = env !== 'production';
    if (!this._isDev) require('dotenv').config();

    // lazy load config coz it has a few vars that depend of env-vars
    config = require('../config/config');
  }

  get tag() {
    let t = this.name;
    if (!this._isDev) t += ':production';
    return t;
  }

  get name() {
    return 'falcon';
  }

  get ports() {
    return [
      new Port(3000, this._isDev ? 3000 : 80),
      new Port(3001, this._isDev ? 3001 : 443)
    ];
  }

  get envVars() {
    let vars = [];
    let mongoUrl = config.mongoUrl;
    mongoUrl = mongoUrl.replace('localhost', 'mongodb');
    vars.push(new EnvVar('NODE_ENV', this.env));
    vars.push(new EnvVar('MONGO_URL', mongoUrl));
    vars.push(new EnvVar('BUNYAN_LEVEL', config.bunyan.level));
    return vars;
  }

  /**
   * Returns the Config required by dockerode to create a container
   * @returns {{Image, name, Env, ExposedPorts, HostConfig}}
   */
  get dockerodeCreateConfig() {
    let specs = {
      Image: this.tag,
      name: this.name,
      Env: this.envVars.map(element => element.toString()),
      ExposedPorts: {
        '3000/tcp': {},
        '3001/tcp': {}
      },
      HostConfig: {
        PortBindings: {
          '3000/tcp': [{HostPort: this._isDev ? '3000' : '80'}],
          '3001/tcp': [{HostPort: this._isDev ? '3001' : '443'}]
        }
      }
    };
    if (this._isDev) {
      // link to mongo container
      specs.HostConfig.Links = ['mongodb:mongodb'];

      // add source to a volume so that we don't hv to rebuild the image every time we make a change
      specs.HostConfig.Binds = [`${process.cwd()}:/src:ro`];
    }

    return specs;
  }

  tutumConfig(/*string*/ username) {
    var ports = this.ports.map(port => {
      //noinspection Eslint
      return {
        protocol: port.protocol,
        inner_port: port.innerPort,// jscs:ignore
        outer_port: port.outerPort// jscs:ignore
      };
    });
    var envVars = this.envVars.map(envVar => {
      return {key: envVar.key, value: envVar.value};
    });

    //noinspection Eslint
    return {
      image: this.getTutumImage(username),
      name: this.name,
      container_ports: ports,// jscs:ignore
      container_envvars: envVars,// jscs:ignore
      autorestart: 'ALWAYS',
      tags: ['mainserver']
    };
  }

  tutumUpdateConfig(/*string*/ username) {
    var updateConfig = this.tutumConfig(username);
    delete updateConfig.name;
    return updateConfig;
  }

  getTutumImage(/*string*/ username) {
    return `tutum.co/${username}/${this.name}:production`;
  }
}

/**
 * @param env
 * @returns DockerConfig
 */
module.exports = (env) => new DockerConfig(env);

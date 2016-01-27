'use strict';
var EnvVar = require('./envvar');
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

}

/**
 * @param env
 * @returns DockerConfig
 */
module.exports = (env) => new DockerConfig(env);

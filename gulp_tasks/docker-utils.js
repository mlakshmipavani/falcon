'use strict';

var Docker = require('dockerode');
var stream = require('stream');
var tar = require('tar-fs');
var Promise = require('bluebird');

var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});
docker.buildImage = Promise.promisify(docker.buildImage);
docker.createContainer = Promise.promisify(docker.createContainer);
docker.listContainers = Promise.promisify(docker.listContainers);

class DockerUtils {

  /**
   * Returns the Dockerode object
   * @returns {Docker}
   */
  static getDocker() {
    return docker;
  }

  /**
   * Gets a container object from name
   * @param name name of the container
   * @returns {Promise}
   */
  static getContainer(name) {
    //noinspection JSCheckFunctionSignatures
    return docker.listContainers({all: 1})
      .filter((/*{Id, Names}*/containerInfo) => containerInfo.Names[0] === `/${name}`)
      .spread(containerInfo => {
        if (!containerInfo)
          return Promise.reject(this.getNoContainersError(name));
        return containerInfo;
      })
      .then((/*{Id}*/ containerInfo) => docker.getContainer(containerInfo.Id));
  }

  /**
   * Removes a container with the given name
   */
  static removeContainer(name) {
    return this.getContainer(name)
      .then(container => new Promise(resolve => container.remove(resolve)))
      .catch(err => {
        if (err.message !== this.getNoContainersError(name).message) throw err;
      });
  }

  /**
   * Kills a container with the given name
   * @param name Name of the container to kill
   * @returns {Promise.<T>}
   */
  static killContainer(name) {
    return this.getContainer(name)
      .then(container => {
        container.kill = Promise.promisify(container.kill);
        return container.kill();
      })
      .catch(ignore => {
        // ignore, coz if the container wasn't already running it throws an error
        // which is of no use in this situation
        console.log('The container wasn\'t already running');
      });
  }

  /**
   * Streams real time logs from the container
   * @param name Name of the container
   * @returns {Promise.<T>}
   */
  static realTimeLogs(/*string*/ name) {
    var logStream = new stream.PassThrough();
    logStream.on('data', (chunk) => console.log(chunk.toString().trim()));

    return this.getContainer(name)
      .then(container => {
        container.logs = Promise.promisify(container.logs);
        return container.logs({
          follow: true,
          stdout: true,
          stderr: true
        }).then(stream => {
          //noinspection JSUnresolvedFunction
          container.modem.demuxStream(stream, logStream, logStream);
          stream.on('end', () => logStream.end('!stop!'));
        });
      });
  }

  /**
   * This error is thrown when getContainer doesn't find the container with the given name
   * @returns {Error}
   */
  static getNoContainersError(name) {
    return new Error(`No containers matching  name(${name}) found`);
  }

  /**
   * Builds a docker image from the current directory
   * @param tag Tag to assign to the image (Eg. falcon OR falcon:production)
   * @returns {Promise}
   */
  static build(/*string*/ tag) {
    var tarStream = tar.pack(process.cwd());

    //noinspection JSCheckFunctionSignatures
    return docker.buildImage(tarStream, {t: tag})
      .then(output => {
        output.on('data', chunk => {
          let log = JSON.parse(chunk);
          process.stdout.write(log.stream);
        });
      });
  }

  /**
   * Runs a container
   * @returns {Promise}
   */
  static run(/*{Image, name, Env, ExposedPorts, HostConfig}*/ createConfig) {
    const name = createConfig.name;
    return this.killContainer(name)
      .then(() => this.removeContainer(name))
      .then(() => {
        //noinspection JSCheckFunctionSignatures
        return docker.createContainer(createConfig);
      })
      .then((/*Container*/ container) => {
        container.start = Promise.promisify(container.start);

        //noinspection JSCheckFunctionSignatures
        return container.start();
      })
      .then(() => this.realTimeLogs(name))
      .catch(console.error);
  }

  /**
   * Tag an image with a different tag
   * @param imageName Existing image with it's tag
   * @param newRepo New Image Repo (Eg. falcon)
   * @param newRepoTag New Image Tag (Eg. production)
   * @returns {Promise<string>}
   */
  static tag(imageName, newRepo, newRepoTag) {
    let image = docker.getImage(imageName);
    image.tag = Promise.promisify(image.tag);
    return image.tag({repo: newRepo, tag: newRepoTag, force: true})
      .thenReturn(`${newRepo}:${newRepoTag}`);
  }
}

module.exports = DockerUtils;

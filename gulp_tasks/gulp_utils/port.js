'use strict';

class Port {

  constructor(innerPort, outerPort) {
    this._protocol = 'tcp';
    this._innerPort = innerPort;
    this._outerPort = outerPort;
  }

  get innerPort() {
    return this._innerPort;
  }

  get outerPort() {
    return this._outerPort;
  }

  get protocol() {
    return this._protocol;
  }

  set protocol(protocol) {
    this._protocol = protocol;
  }
}

module.exports = Port;

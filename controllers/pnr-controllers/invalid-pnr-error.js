'use strict';

class InvalidPnrError extends Error {
  constructor(msg) {
    super(msg);

    //noinspection JSUnresolvedVariable
    this.name = this.constructor.name;
  }
}

module.exports = InvalidPnrError;

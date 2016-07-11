'use strict';

const request = require('request-promise');

class Request {

  static callOne(options) {
    return request(options);
  }

  static callTwo(options) {
    return request(options);
  }

}

module.exports = Request;


'use strict';

class EnvVar {

  constructor(key, value) {
    this._key = key;
    this._value = value;
  }

  get key() {
    return this._key;
  }

  get value() {
    return this._value;
  }

  toString() {
    return `${this._key}=${this._value}`;
  }
}

module.exports = EnvVar;

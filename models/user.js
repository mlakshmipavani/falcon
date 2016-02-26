'use strict';

/**
 * A class that holds the user properties
 */
class User {

  /**
   * @constructor
   * @param {Object} userHashObj  A hash containing the user properties
   */
  constructor(userHashObj) {
    this._socialId = userHashObj.socialId;
    this._name = userHashObj.name;
    this._email = userHashObj.email;

    if (!this._socialId || !this._name) throw new Error('socialId and name are required!');

    this.__id = userHashObj.__id;
  }

  get _id() {
    return this.__id;
  }

  get socialId() {
    return this._socialId;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }
}

module.exports = User;


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
    this._mobNumber = userHashObj.mobNumber;
    this._name = userHashObj.name;

    if (!this._mobNumber || !this._name) throw new Error('mobNumber and name are required!');

    this._countryCode = userHashObj.countryCode;
    this._hash_id = userHashObj.hash_id;
    this._lastSeen = userHashObj.lastSeen;
    this._online = userHashObj.online;
    this._live = userHashObj.live;
    this._status = userHashObj.status;
    this._statusDate = userHashObj.statusDate;
    this._friends = userHashObj.friends;
    this._contacts = userHashObj.contacts;
    this._onlineSubscribers = userHashObj.onlineSubscribers;
    this._createdAt = userHashObj.createdAt;

    this.__id = userHashObj.__id;
  }

  //noinspection Eslint
  /**
   * Gives you a hash of the user object
   * @param {string} mobNumber
   * @param {string} name
   * @param {string} countryCode
   * @returns {{mobNumber: string, name: string, countryCode: string, lastSeen: Date, online: boolean, live: boolean, status: string, statusDate: Date, friends: Array, contacts: Array, onlineSubscribers: Array, createdAt: Date}}
   */
  static getUserHash(mobNumber, name, countryCode) {
    return {
      mobNumber,
      name,
      countryCode,
      hash_id:'',
      lastSeen: new Date(),
      online: true,
      live: true,
      status: '',
      statusDate: new Date(),
      friends: [],
      contacts: [],
      onlineSubscribers: [],
      createdAt: new Date()
    };
  }

  get _id() {
    return this.__id;
  }

  get mobNumber() {
    return this._mobNumber;
  }

  get name() {
    return this._name;
  }

  get countryCode() {
    return this._countryCode;
  }

  get hashId() {
    return this._hash_id;
  }

  get lastSeen() {
    return this._lastSeen;
  }

  get online() {
    return this._online;
  }

  get live() {
    return this._live;
  }

  get status() {
    return this._status;
  }

  get statusDate() {
    return this._statusDate;
  }

  get friends() {
    return this._friends;
  }

  get contacts() {
    return this._contacts;
  }

  get onlineSubscribers() {
    return this._onlineSubscribers;
  }

  get createdAt() {
    return this._createdAt;
  }
}

module.exports = User;


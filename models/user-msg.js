'use strict';

class UserMsg {

  /**
   * @constructor
   * @param hash A hash containing UserMsg Properties
   */
  constructor(/* Object */ hash) {
    this.__id = hash._id;
    this._mobNumber = hash.mobNumber;
    this._botHandle = hash.botHandle;
    this._body = hash.body;
    this._createdAt = hash.createdAt;
  }

  get _id() {
    return this.__id;
  }

  get mobNumber() {
    return this._mobNumber;
  }

  get botHandle() {
    return this._botHandle;
  }

  get body() {
    return this._body;
  }

  get createdAt() {
    return this._createdAt;
  }

}

module.exports = UserMsg;

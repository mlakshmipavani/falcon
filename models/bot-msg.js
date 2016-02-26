'use strict';

class BotMsg {

  /**
   * @constructor
   * @param hash A hash containing BotMsg Properties
   */
  constructor(/* Object */ hash) {
    this.__id = hash._id;
    this._socialId = hash.socialId;
    this._botHandle = hash.botHandle;
    this._body = hash.body;
    this._userMsgId = hash.userMsgId;
    this._createdAt = hash.createdAt;
  }

  get _id() {
    return this.__id;
  }

  get socialId() {
    return this._socialId;
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

  get userMsgId() {
    return this._userMsgId;
  }

}

module.exports = BotMsg;

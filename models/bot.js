'use strict';

/**
 * A class that holds the Bot properties
 */
class Bot {

  /**
   * @constructor
   * @param handle Bot handle
   * @param name Name of the Bot
   */
  constructor(/* string */ handle, /* string */ name) {
    if (!handle || !name) throw new Error('handle or name is null!');
    this._handle = handle;
    this._name = name;
    this._likes = 0;
    this._createdAt = new Date();
  }

  /**
   * Gives you a hash to insert in mongodb
   * @param handle Bot handle
   * @param name Name of the bot
   */
  static getBotHash(/* string */ handle, /* string */ name) {
    return {
      handle,
      name,
      likes: 0,
      createdAt: new Date()
    };
  }

  get handle() {
    return this._handle;
  }

  get name() {
    return this._name;
  }

  get likes() {
    return this._likes;
  }

  get createdAt() {
    return this._createdAt;
  }
}

module.exports = Bot;

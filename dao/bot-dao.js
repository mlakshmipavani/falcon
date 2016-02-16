'use strict';

const Bot = require('../models/bot');
const DaoHelper = require('./dao-helper');

class BotDao {

  /**
   * Creates a new bot in db
   * @param handle Bot handle
   * @param name Name of the Bot
   * @returns {Promise<Bot>}
   */
  static newBot(/* string */ handle, /* string */ name) {
    const newBotObj = Bot.getBotHash(handle, name);
    return DaoHelper.bot.insertOne(newBotObj);
  }

  /**
   * Returns all the bots in an array
   * @returns {Promise< Array<Bot> >}
   */
  static getAllBots() {
    return DaoHelper.bot.find().toArray();
  }

  /**
   * Returns the latest added bots
   * @param count Number of bots to request
   * @returns {Promise< Array<Bot> >}
   */
  static getNew(/* int */ count) {
    return DaoHelper.bot.find()
      .project({_id: 0})  // suppress _id field
      .sort({createdAt: -1})  // sort desc by createdAt
      .limit(count) // limit the number of results
      .toArray()
      .map((/* Bot */ bot) => {
        bot.createdAt = bot.createdAt.getTime();
        return bot;
      });
  }
}

module.exports = BotDao;

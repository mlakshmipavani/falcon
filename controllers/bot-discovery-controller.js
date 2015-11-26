'use strict';

var BotDao = require('../dao/bot-dao.js');

/**
 * All operations related to Bot Discovery and finding new bots go here
 */
class BotDiscoveryController {

  /**
   * Returns all bots in db
   * @returns {Promise.<Array.<Bot>>}
   */
  static getAll() {
    return BotDao.getAllBots();
  }

  /**
   * Returns the latest added bots
   * @param count Nuumber of bots to request
   * @returns {Promise.<Array.<Bot>>}
   */
  static getNew(/* int */ count) {
    return BotDao.getNew(count);
  }
}

module.exports = BotDiscoveryController;

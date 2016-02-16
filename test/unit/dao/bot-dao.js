'use strict';

const Promise = require('bluebird');

const DaoHelper = require('../../../dao/dao-helper');
const BotDao = require('../../../dao/bot-dao');
const Bot = require('../../../models/bot');

describe('BotDao', () => {

  const bot1 = {handle: '@hello', name: 'Hello'};
  const bot2 = {handle: '@bot2', name: 'Bot 2'};
  const bot3 = {handle: '@bot3', name: 'Bot 3'};
  const bot4 = {handle: '@bot4', name: 'Bot 4'};

  before(() => {
    return Promise.delay(300).then(() => DaoHelper.db.dropDatabase());
  });

  it('creates a new bot', () => {
    return BotDao.newBot(bot1.handle, bot1.name)
      .then(() => {
        const query = {handle: bot1.handle};
        return DaoHelper.bot.find(query).toArray()
          .then((/* Array<Bot> */ bots) => {
            bots.should.have.length(1);
            const bot = bots[0];
            bot.handle.should.equal(bot1.handle);
            bot.name.should.equal(bot1.name);
          });
      });
  });

  it('returns all bots', () => {
    return BotDao.getAllBots()
      .then((/* Array<Bot> */ bots) => {
        bots.should.have.length(1);
      });
  });

  it('returns the latest bots', () => {
    const bt2 = Bot.getBotHash(bot2.handle, bot2.name);
    const bt3 = Bot.getBotHash(bot3.handle, bot3.name);
    const bt4 = Bot.getBotHash(bot4.handle, bot4.name);

    // change timestamps
    const now = new Date();
    bt2.createdAt = new Date(now.getTime());
    bt3.createdAt = new Date(now.getTime() + 10);
    bt4.createdAt = new Date(now.getTime() + 20);
    return DaoHelper.bot.insertMany([bt2, bt3, bt4])
      .then(() => {
        return BotDao.getNew(3).then((/* Array<Bot> */bots) => {
          bots.should.have.length(3);
          bots[0].handle.should.equal(bt4.handle);
          bots[1].handle.should.equal(bt3.handle);
          bots[2].handle.should.equal(bt2.handle);
        });
      });
  });

});

'use strict';

const WitController = require('./wit.ai/wit-controller.js');
const StaticResponses = require('./wit.ai/static-responses.js');
const WitIntents = require('./wit.ai/wit-intents.js');
const BotMsgDao = require('../dao/bot-msg-dao.js');
const Promise = require('bluebird');

/**
 * Controller for hello bot
 */
class HelloController {

  /**
   * Given an input, this bot responds to very simple queries
   * @param mobNumber Mobile number of the user sending this msg
   * @param text Msg body sent by the user
   * @returns {Promise.<string>}
   */
  static reply(/*String*/ mobNumber, /*String*/ text) {
    return Promise.all([WitController.getIntent(text), BotMsgDao.getLastMsg(mobNumber)])
      .spread((/*{intent, confidence, entities}*/ witResponse, /*{body}*/ lastMsg) => {

        if (lastMsg && lastMsg.body === this._intro) {
          let name = text;
          if (witResponse.intent === WitIntents.name) {
            //noinspection JSUnresolvedVariable
            let contactObj = witResponse.entities.contact;
            if (contactObj && contactObj.length > 0) name = contactObj[0].value;
          }

          return this._tryToBeHelpful(name);
        } else if (witResponse.intent === WitIntents.name) return this._helloName(witResponse);
        else if (witResponse.intent === WitIntents.hello && !lastMsg) return this._intro;
        else if (witResponse.intent === WitIntents.hello) return StaticResponses.hello;
        else if (witResponse.intent === WitIntents.howAreYou)
          return StaticResponses.howAreYouIntentReply;
        else if (witResponse.intent === WitIntents.thankYou)
          return StaticResponses.thankYouIntentReply;
        else throw new Error(`don't know what to reply`);
      })
      .catch(err => {
        if (err.message !== `don't know what to reply`) throw err;
      });
  }

  /**
   * Returns the handle of the Bot
   * @returns {string}
   */
  static get handle() {
    return '@hello';
  }

  /**
   * Self introduction text
   * @returns {string}
   * @private
   */
  static get _intro() {
    return `My name is HelloBot, I'm a built-in robot\nWhat's your name?`;
  }

  /**
   * I'll try to be helpful text
   * @param name Name of the user
   * @returns {string}
   * @private
   */
  static _tryToBeHelpful(/*string*/ name) {
    return `Okay ${name}, I'm not the smartest bot, but I'll try to be helpful`;
  }

  static _helloName(/*{entities: {contact: []}}*/ witResponse) {
    let contactObj = witResponse.entities.contact;
    if (contactObj && contactObj.length > 0) return `hello ${contactObj[0].value}`;
    throw new Error(`Name Intent without name entity`);
  }

}

module.exports = HelloController;

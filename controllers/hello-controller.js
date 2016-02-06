'use strict';

const WitController = require('./wit.ai/wit-controller.js');
const StaticResponses = require('./wit.ai/static-responses.js');
const WitIntents = require('./wit.ai/wit-intents.js');
const BotMsgDao = require('../dao/bot-msg-dao.js');
const Promise = require('bluebird');
const UserDao = require('../dao/user-dao.js');

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

        if (lastMsg && lastMsg.body === this._introPlusAskName) {
          let name = text;
          if (witResponse.intent === WitIntents.name)
            name = this._getNameFromWitResponse(witResponse, text);
          this.storeName(mobNumber, name);
          return this._tryToBeHelpful(name);
        } else if (lastMsg && lastMsg.body === this._askNameAgain) {
          const name = this._getNameFromWitResponse(witResponse, text);
          this.storeName(mobNumber, name);
          return `hello ${name}`;
        } else if (witResponse.intent === WitIntents.name) return this._helloName(witResponse);
        else if (witResponse.intent === WitIntents.hello && !lastMsg) return this._introPlusAskName;
        else if (witResponse.intent === WitIntents.hello) return StaticResponses.hello;
        else if (witResponse.intent === WitIntents.howAreYou)
          return StaticResponses.howAreYouIntentReply;
        else if (witResponse.intent === WitIntents.thankYou)
          return StaticResponses.thankYouIntentReply;
        else if (witResponse.intent === WitIntents.inCorrectName) return this._askNameAgain;
        else if (witResponse.intent === WitIntents.insult) return this._insultReply;
        else if (witResponse.intent === WitIntents.okay) return `k`;
        else if (witResponse.intent === WitIntents.introduction) return this._intro;
        else if (witResponse.intent === WitIntents.areYouThere) return this._yup;
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
    return `My name is HelloBot, I'm a built-in robot`;
  }

  static get _introPlusAskName() {
    return `${this._intro}\n${this._askName}`;
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

  /**
   * Ask the user's name
   * @returns {string}
   * @private
   */
  static get _askName() {
    return `What's your name?`;
  }

  /**
   * Ask the user's name again
   * This is when the user tells us that the name is wrong
   * @returns {string}
   * @private
   */
  static get _askNameAgain() {
    return `okay, then what's your name?`;
  }

  /**
   * A reply when the user uses curse words
   * @returns {string}
   * @private
   */
  static get _insultReply() {
    return `I'm a new born baby bot, you can't say that to me!`;
  }

  /**
   * Affirmative response
   * @returns {string}
   * @private
   */
  static get _yup() {
    return `yup!`;
  }

  /**
   * Extract name from WitResponse, else assume the written text is the name
   * @param witResponse Response from Wit.AI
   * @param text Text that the user sent
   * @returns {string}
   * @private
   */
  static _getNameFromWitResponse(witResponse, text) {
    if (witResponse.entities) {
      let contactObj = witResponse.entities.contact;
      if (contactObj && contactObj.length > 0) return contactObj[0].value;
    }

    return text;
  }

  /**
   * Stores the name provided by the user to hello bot
   * @param mobNumber Mobile number of the user
   * @param name Name of the user
   * @returns {Promise<T>}
   */
  static storeName(/*string*/ mobNumber, /*string*/ name) {
    return UserDao.updateName(mobNumber, name);
  }

}

module.exports = HelloController;

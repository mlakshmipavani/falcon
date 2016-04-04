'use strict';

const WitController = require('./wit.ai/wit-controller.js');
const StaticResponses = require('./wit.ai/static-responses.js');
const WitIntents = require('./wit.ai/wit-intents.js');
const BotMsgDao = require('../dao/bot-msg-dao.js');
const Promise = require('bluebird');
const UserDao = require('../dao/user-dao.js');
const Utils = require('../utils/Utils');

/**
 * Controller for hello bot
 */
class HelloController {

  /**
   * Given an input, this bot responds to very simple queries
   * @param socialId Social Id of the user sending this msg
   * @param text Msg body sent by the user
   * @returns {Promise.<string>}
   */
  static reply(/*String*/ socialId, /*String*/ text) {
    return Promise.all([WitController.getIntent(text), BotMsgDao.getLastMsg(socialId)])
      .spread((/*{intent, confidence, entities}*/ witResponse, /*{body}*/ lastMsg) => {

        if (lastMsg && lastMsg.body === this._introPlusAskName) {
          let name = text;
          if (witResponse.intent === WitIntents.name)
            name = this._getNameFromWitResponse(witResponse, text);
          this.storeName(socialId, name);
          return this._tryToBeHelpful(name);
        } else if (lastMsg && lastMsg.body === this._askNameAgain) {
          const name = this._getNameFromWitResponse(witResponse, text);
          this.storeName(socialId, name);
          return `hello ${name}`;
        } else if (witResponse.intent === WitIntents.goodMorning) return this._goodMorning;
        else if (witResponse.intent === WitIntents.goodAfternoon) return this._goodAfternoon;
        else if (witResponse.intent === WitIntents.goodNight) return this._goodNight;
        else if (witResponse.intent === WitIntents.name) return this._helloName(witResponse);
        else if (witResponse.intent === WitIntents.hello && !lastMsg) return this._introPlusAskName;
        else if (witResponse.intent === WitIntents.hello) return StaticResponses.hello;
        else if (witResponse.intent === WitIntents.howAreYou)
          return StaticResponses.howAreYouIntentReply;
        else if (witResponse.intent === WitIntents.thankYou)
          return StaticResponses.thankYouIntentReply;
        else if (witResponse.intent === WitIntents.inCorrectName) return this._askNameAgain;
        else if (witResponse.intent === WitIntents.insult) return this._insultReply;
        else if (witResponse.intent === WitIntents.okay) return 'k';
        else if (witResponse.intent === WitIntents.introduction) return this._intro;
        else if (witResponse.intent === WitIntents.areYouThere) return this._yup;
        else if (witResponse.intent === WitIntents.bye) return 'bye';
        else if (witResponse.intent === WitIntents.say_thank_you) return this._sayThankYou;
        else if (witResponse.intent === WitIntents.festival) return this._festival(witResponse);
        else if (witResponse.intent === WitIntents.help) return this._helpMsg;
        else if (witResponse.intent === WitIntents.laugh) return this._laugh;
        else if (witResponse.intent === WitIntents.love) return this._love;
        else if (witResponse.intent === WitIntents.sex) return this._sex;
        else if (witResponse.intent === WitIntents.urAge) return this._age;
        else if (witResponse.intent === WitIntents.urCreator) return this._creator;
        else if (witResponse.intent === WitIntents.whatYouDoing) return this._whatYouDoing;
        else if (witResponse.intent === WitIntents.gender) return this._gender;
        else return this._sorryNoIdea;
        //else throw new Error(`don't know what to reply`);
      });
  }

  /**
   * Returns the handle of the Bot
   * @returns {string}
   */
  static get handle() {
    return '@yobot';
  }

  /**
   * Self introduction text
   * @returns {string}
   * @private
   */
  static get _intro() {
    return 'My name is Yo, I\'m a built-in robot';
  }

  static get _goodMorning() {
    return 'Good morning!';
  }

  static get _goodAfternoon() {
    return 'Good afternoon!';
  }

  static get _goodNight() {
    return 'Good night!';
  }

  static get _sayThankYou() {
    return 'Thank you';
  }

  static get _helpMsg() {
    return 'Here\'s what all I can do:\n' +
      'I\'m (still) learning human language, ' +
      'but you can try having a normal conversation with me\n' +
      'Except that, I don\'t come with a manual';
  }

  static get _laugh() {
    const responses = ['hehe', 'haha', 'hehehe', 'hahaha'];
    const index = Utils.getRandomInt(0, responses.length);
    return responses[index];
  }

  static get _love() {
    const responses = ['I don\'t know', 'It\'s complicated'];
    const index = Utils.getRandomInt(0, responses.length);
    return responses[index];
  }

  static get _sex() {
    return 'Sounds interesting!';
  }

  static get _age() {
    return 'I\'m just a new born';
  }

  static get _creator() {
    return 'I was created by Team StayYolo';
  }

  static get _whatYouDoing() {
    return 'Currently nothing, except chatting with you';
  }

  static get _gender() {
    return 'I cannot disclose that, else you\'ll start hitting on me 😜';
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
    const contactObj = witResponse.entities.contact;
    if (contactObj && contactObj.length > 0) return `hello ${contactObj[0].value}`;
    throw new Error('Name Intent without name entity');
  }

  static _festival(/*{entities: {festival_name: Array<{type, value}>}}*/ witResponse) {
    const festivalObj = witResponse.entities.festival_name;
    if (festivalObj && festivalObj.length > 0) {
      const festivalName = festivalObj[0].value;
      const FESTIVAL_NAME = festivalName.toUpperCase();
      if (FESTIVAL_NAME === 'XMAS' || FESTIVAL_NAME === 'CHRISTMAS') return 'Merry Christmas!';
      return `Happy ${festivalName}!`;
    }
  }

  /**
   * Ask the user's name
   * @returns {string}
   * @private
   */
  static get _askName() {
    return 'What\'s your name?';
  }

  /**
   * Ask the user's name again
   * This is when the user tells us that the name is wrong
   * @returns {string}
   * @private
   */
  static get _askNameAgain() {
    return 'okay, then what\'s your name?';
  }

  /**
   * A reply when the user uses curse words
   * @returns {string}
   * @private
   */
  static get _insultReply() {
    return 'I\'m a new born baby bot, you can\'t say that to me!';
  }

  /**
   * Affirmative response
   * @returns {string}
   * @private
   */
  static get _yup() {
    return 'yup!';
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
      const contactObj = witResponse.entities.contact;
      if (contactObj && contactObj.length > 0) return contactObj[0].value;
    }

    return text;
  }

  /**
   * Stores the name provided by the user to hello bot
   * @param socialId Social Id of the user
   * @param name Name of the user
   * @returns {Promise<T>}
   */
  static storeName(/*string*/ socialId, /*string*/ name) {
    return UserDao.updateName(socialId, name);
  }

  /**
   * When the bot doesn't know what to respond, it can send this
   * @returns {string}
   * @private
   */
  static get _sorryNoIdea() {
    return `Sorry, but I don't know what you're talking about\n` +
      `I'm a really young bot, still learning to talk`;
  }

}

module.exports = HelloController;

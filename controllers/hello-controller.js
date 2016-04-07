'use strict';

const WitController = require('./wit.ai/wit-controller.js');
const StaticResponses = require('./wit.ai/static-responses.js');
const WitIntents = require('./wit.ai/wit-intents.js');
const BotMsgDao = require('../dao/bot-msg-dao.js');
const Promise = require('bluebird');
const apiVersion = require('../config/api-version');

/**
 * Controller for hello bot
 */
class HelloController {

  /**
   * Given an input, this bot responds to very simple queries
   * @param socialId Social Id of the user sending this msg
   * @param text Msg body sent by the user
   * @param version Version of the api call
   * @returns {Promise.<string>}
   */
  static reply(/*String*/ socialId, /*String*/ text, /*String*/ version) {
    return Promise.all([WitController.getIntent(text), BotMsgDao.getLastMsg(socialId)])
      .spread((/*{intent, confidence, entities}*/ witResponse, /*{body}*/ lastMsg) => {

        if (lastMsg && lastMsg.body === this._introPlusAskName) {
          let name = text;
          if (witResponse.intent === WitIntents.name)
            name = this._getNameFromWitResponse(witResponse, text);
          return this._tryToBeHelpful(name);
        } else if (lastMsg && lastMsg.body === StaticResponses._askNameAgain) {
          const name = this._getNameFromWitResponse(witResponse, text);
          return `hello ${name}`;
        } else if (witResponse.intent === WitIntents.goodMorning)
          return StaticResponses._goodMorning;
        else if (witResponse.intent === WitIntents.goodAfternoon)
          return StaticResponses._goodAfternoon;
        else if (witResponse.intent === WitIntents.goodNight) return StaticResponses._goodNight;
        else if (witResponse.intent === WitIntents.name) return this._helloName(witResponse);
        else if (witResponse.intent === WitIntents.hello && !lastMsg) return this._introPlusAskName;
        else if (witResponse.intent === WitIntents.hello) return StaticResponses.hello;
        else if (witResponse.intent === WitIntents.howAreYou)
          return StaticResponses.howAreYouIntentReply;
        else if (witResponse.intent === WitIntents.thankYou)
          return StaticResponses.thankYouIntentReply;
        else if (witResponse.intent === WitIntents.inCorrectName)
          return StaticResponses._askNameAgain;
        else if (witResponse.intent === WitIntents.insult) return StaticResponses._insultReply;
        else if (witResponse.intent === WitIntents.okay) return 'k';
        else if (witResponse.intent === WitIntents.introduction) return StaticResponses._intro;
        else if (witResponse.intent === WitIntents.areYouThere) return StaticResponses._yup;
        else if (witResponse.intent === WitIntents.bye) return 'bye';
        else if (witResponse.intent === WitIntents.say_thank_you)
          return StaticResponses._sayThankYou;
        else if (witResponse.intent === WitIntents.festival) return this._festival(witResponse);
        else if (witResponse.intent === WitIntents.help) return StaticResponses._helpMsg;
        else if (witResponse.intent === WitIntents.laugh) return StaticResponses._laugh;
        else if (witResponse.intent === WitIntents.love) return StaticResponses._love;
        else if (witResponse.intent === WitIntents.sex) return StaticResponses._sex;
        else if (witResponse.intent === WitIntents.urAge) return StaticResponses._age;
        else if (witResponse.intent === WitIntents.urCreator) return StaticResponses._creator;
        else if (witResponse.intent === WitIntents.whatYouDoing)
          return StaticResponses._whatYouDoing;
        else if (witResponse.intent === WitIntents.gender) return StaticResponses._gender;
        else if (version === apiVersion.v1_0_1) {
          if (witResponse.intent === WitIntents.cabBot)
            return StaticResponses._openCabsBot;
          else if (witResponse.intent === WitIntents.moviesBot)
            return StaticResponses._openMoviesBot;
          else if (witResponse.intent === WitIntents.pnrBot) return this._openPnrBot(witResponse);
        }
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

  static get _introPlusAskName() {
    return `${StaticResponses._intro}\n${StaticResponses._askName}`;
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

    throw new Error('Festival Intent without entity');
  }

  static _openPnrBot(/*{entities: {number: Array<{type, value}>}}*/ witResponse) {
    const pnrObj = witResponse.entities.number;
    if (pnrObj && pnrObj.length > 0) {
      const pnrNumber = pnrObj[0].value;
      return StaticResponses._openPnrBot(pnrNumber);
    }

    throw new Error('PnrBot Intent without entity');
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

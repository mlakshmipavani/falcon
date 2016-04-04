'use strict';

const Utils = require('../../utils/Utils');

class StaticResponses {

  static get hello() {
    return 'Hi, there';
  }

  /**
   * Reply to How Are you intent
   * @returns {string}
   */
  static get howAreYouIntentReply() {
    return 'I\'m good! What about you?';
  }

  /**
   * Reply to Thank you intent
   * @returns {string}
   */
  static get thankYouIntentReply() {
    return 'My pleasure!';
  }

  /**
   * Self introduction text
   * @returns {string}
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
   */
  static get _askNameAgain() {
    return 'okay, then what\'s your name?';
  }

  /**
   * A reply when the user uses curse words
   * @returns {string}s
   */
  static get _insultReply() {
    return 'I\'m a new born baby bot, you can\'t say that to me!';
  }

  /**
   * Affirmative response
   * @returns {string}
   */
  static get _yup() {
    return 'yup!';
  }

  static get _openCabsBot() {
    return '@cabs';
  }

  static _openPnrBot(/*string=*/ pnr) {
    let ret = '@railpnr';
    if (pnr) ret += ` ${pnr}`;
    return ret;
  }

  static get _openMoviesBot() {
    return '@moviesnow';
  }

}

module.exports = StaticResponses;

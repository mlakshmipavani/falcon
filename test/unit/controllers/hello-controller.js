'use strict';

const Promise = require('bluebird');
const DaoHelper = require('../../../dao/dao-helper.js');
const WitController = require('../../../controllers/wit.ai/wit-controller.js');
const HelloController = require('../../../controllers/hello-controller.js');
const BotMsgDao = require('../../../dao/bot-msg-dao.js');
const StaticResponses = require('../../../controllers/wit.ai/static-responses.js');

describe('Hello Controller', () => {

  const mobNumber = '919033819605';

  before(() => Promise.delay(100).then(() => DaoHelper.db.dropDatabase()));

  afterEach(() => DaoHelper.db.dropDatabase());

  it(`verifies response for first 'hi' msg`, () => {
    // mock
    const inputText = 'hi';
    const hiResponse = {_text: inputText, confidence: 0.675, intent: 'hello', entities: {}};
    const witResponse = {outcomes: [hiResponse]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // execute
    return HelloController.reply(mobNumber, inputText)
      .should.eventually.equal(HelloController._introPlusAskName);
  });

  it(`verifies response for first non 'hi' msg`, () => {
    // mock
    const witResponse = {outcomes: [{confidence: 0}]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // execute
    const inputText = 'asdfljasdf';
    return HelloController.reply(mobNumber, inputText).should.eventually.not.exist;
  });

  it(`verifies response for non first 'hi' msg`, () => {
    // mock
    const inputText = 'hi';
    const hiResponse = {_text: inputText, confidence: 0.675, intent: 'hello', entities: {}};
    const witResponse = {outcomes: [hiResponse]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // prepare
    return BotMsgDao.insert(mobNumber, HelloController.handle, 'some randommsg', 'abcxyz')

      // execute
      .then(() => HelloController.reply(mobNumber, inputText))
      .should.eventually.equal(StaticResponses.hello);
  });

  it(`verifies response for 'jaydp' after intro`, () => {
    // mock
    const inputText = 'jaydp';
    const hiResponse = {_text: inputText, confidence: 0.02, intent: 'hello', entities: {}};
    const witResponse = {outcomes: [hiResponse]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // prepare
    return BotMsgDao.insert(
      mobNumber, HelloController.handle, HelloController._introPlusAskName, 'abcxyz')

      // execute
      .then(() => HelloController.reply(mobNumber, inputText))
      .should.eventually.equal(HelloController._tryToBeHelpful(inputText));
  });

  it(`verifies response for 'i'm jaydp' after intro`, () => {
    // mock
    const name = 'jaydp';
    const inputText = `I'm ${name}`;
    const outcome = {
      _text: `I'm ${name}`,
      confidence: 0.726,
      intent: 'name',
      entities: {contact: [{type: 'value', value: name, suggested: true}]}
    };
    const witResponse = {outcomes: [outcome]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // execute
    return BotMsgDao.insert(
      mobNumber, HelloController.handle, HelloController._introPlusAskName, 'abcxyz')
      .then(() => HelloController.reply(mobNumber, inputText))
      .should.eventually.equal(HelloController._tryToBeHelpful(name));
  });

  it(`verifies response for 'i'm jaydp' after some random msg`, () => {
    // mock
    const name = 'jaydp';
    const inputText = `I'm ${name}`;
    const outcome = {
      _text: `I'm ${name}`,
      confidence: 0.726,
      intent: 'name',
      entities: {contact: [{type: 'value', value: name, suggested: true}]}
    };
    const witResponse = {outcomes: [outcome]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // execute
    return BotMsgDao.insert(mobNumber, HelloController.handle, 'some random msg', 'abcxyz')
      .then(() => HelloController.reply(mobNumber, inputText))
      .should.eventually.equal(`hello ${name}`);
  });

  it(`verifiers response for 'how are you'`, () => {
    // mock
    const inputText = 'how are you';
    const outcome = {_text: 'how are you', confidence: 0.723, intent: 'how_are_you', entities: {}};
    const witResponse = {outcomes: [outcome]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // execute
    return HelloController.reply(mobNumber, inputText)
      .should.eventually.equal(StaticResponses.howAreYouIntentReply);
  });

  it(`verifies response for 'thanks you'`, () => {
    // mock
    const inputText = 'thank you';
    const outcome = {_text: 'thank you', confidence: 0.729, intent: 'thank_you', entities: {}};
    const witResponse = {outcomes: [outcome]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // execute
    return HelloController.reply(mobNumber, inputText)
      .should.eventually.equal(StaticResponses.thankYouIntentReply);
  });

  it('verifies response for wrong name', () => {
    // mock
    const inputText = `that's not my name`;
    const outcome = {
      _text: inputText,
      confidence: 0.994,
      intent: 'incorrect_name',
      entities: {}
    };
    const witResponse = {outcomes: [outcome]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // execute
    return HelloController.reply(mobNumber, inputText)
      .should.eventually.equal(HelloController._askNameAgain);
  });

  it(`verifies response for 'name asked again' -> just name`, () => {
    // mock
    const inputText = `jaydeep`;
    const outcome = {confidence: 0};
    const witResponse = {outcomes: [outcome]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // prepare
    return BotMsgDao.insert(mobNumber, HelloController.handle, HelloController._askNameAgain, 'abc')

      // execute
      .then(() => HelloController.reply(mobNumber, inputText))
      .should.eventually.equal(`hello ${inputText}`);
  });

  it(`verifies response for 'name asked again' -> i'm <name>`, () => {
    // mock
    const name = 'jaydp';
    const inputText = `I'm ${name}`;
    const outcome = {
      _text: inputText,
      confidence: 0.977,
      intent: 'name',
      entities: {contact: [{type: 'value', value: 'jaydp'}]}
    };
    const witResponse = {outcomes: [outcome]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // prepare
    return BotMsgDao.insert(mobNumber, HelloController.handle, HelloController._askNameAgain, 'ab')

      // execute
      .then(() => HelloController.reply(mobNumber, inputText))
      .should.eventually.equal(`hello ${name}`);
  });

  it('verifies replies to insulting responses', () => {
    // mock
    const inputText = 'wtf!';
    const outcome = {_text: 'wtf', confidence: 0.913, intent: 'insult', entities: {}};
    const witResponse = {outcomes: [outcome]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // execute
    return HelloController.reply(mobNumber, inputText)
      .should.eventually.equal(HelloController._insultReply);
  });

  it('verifies response to Okay', () => {
    // mock
    const inputText = 'ok';
    const outcome = {_text: 'ok', confidence: 0.903, intent: 'okay', entities: {}};
    const witResponse = {outcomes: [outcome]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // execute
    return HelloController.reply(mobNumber, inputText)
      .should.eventually.equal('k');
  });

  it(`verifies response for 'who are you'`, () => {
    // mock
    const inputText = 'who are you';
    const outcome = {_text: 'who are you', confidence: 0.991, intent: 'introduction', entities: {}};
    const witResponse = {outcomes: [outcome]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // execute
    return HelloController.reply(mobNumber, inputText)
      .should.eventually.equal(HelloController._intro);
  });

  it(`verifies response to 'are you there'`, () => {
    // mock
    const inputText = 'are you there';
    const outcome = {_text: inputText, confidence: 0.991, intent: 'are_you_there', entities: {}};
    const witResponse = {outcomes: [outcome]};
    WitController._captureTextIntent = () => Promise.resolve(witResponse);

    // execute
    return HelloController.reply(mobNumber, inputText)
      .should.eventually.equal(HelloController._yup);
  });
});

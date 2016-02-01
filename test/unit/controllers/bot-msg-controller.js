'use strict';

const Promise = require('bluebird');
const DaoHelper = require('../../../dao/dao-helper.js');
const WitController = require('../../../controllers/wit.ai/wit-controller.js');
const BotMsgController = require('../../../controllers/bot-msg-controller.js');
const HelloController = require('../../../controllers/hello-controller.js');

describe('Bot Msg Controller', () => {

  const mobNumber = '919033819605';

  before(() => Promise.delay(100).then(() => DaoHelper.db.dropDatabase()));

  afterEach(() => DaoHelper.db.dropDatabase());

  it('sends msg to @hello bot', () => {
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
    return BotMsgController.msg(mobNumber, HelloController.handle, inputText)
      .should.eventually.equal(`hello ${name}`);
  });

  it('throws error on unknown bot handle', () => {
    return BotMsgController.msg(mobNumber, '@somerandombot', 'wat up!')
      .should.be.rejected;
  });

});

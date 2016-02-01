'use strict';

const Promise = require('bluebird');
const DaoHelper = require('../../../dao/dao-helper.js');
const WitController = require('../../../controllers/wit.ai/wit-controller.js');

describe('Wit.AI Controller', () => {

  const witResponse = {
    outcomes: [
      {_text: 'hi', confidence: 0.675, intent: 'hello', entities: {}},
      {_text: 'hi', confidence: 0.57, intent: 'greetings', entities: {}}
    ]
  };

  before(() => Promise.delay(100).then(() => DaoHelper.db.dropDatabase()));

  afterEach(() => DaoHelper.db.dropDatabase());

  it('Filters low confidence outcomes', () => {
    return WitController._filterLowConfidence(witResponse)
      .should.eventually.deep.equal(witResponse.outcomes[0]);
  });

  it('Gets intent and filters', () => {
    // mock
    WitController._captureTextIntent = (text) => Promise.resolve(witResponse);
    // execute
    return WitController.getIntent('hi')
      .should.eventually.deep.equal(witResponse.outcomes[0]);
  });

});

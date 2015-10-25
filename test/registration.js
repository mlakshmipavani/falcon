'use strict';

var request = require('supertest-as-promised');

var app = require('../app');
var mockDigits = require('./support/mock-digits');
var RegistrationController = require('../controllers/registration-controller.js');
var JoiValidate = require('./support/joi-validate.js');

describe('Registration', () => {

  before(() => {
    return app.listen(3000)
      .then(() => mockDigits.listen(3001))
      .delay(300);
  });

  after(() => app.close().then(() => mockDigits.close()));

  it('registers a user', ()=> {
    return request('http://localhost:3000')
      .post('/register')
      .set('X-Auth-Service-Provider', 'http://localhost:3001/')
      .send({name: 'jaydeep', contacts: {9033819605: 'parth'}, countryISO: 'IN'})
      .expect('Content-Type', /json/)
      .then((res) => JoiValidate.registerResponse(res.body));
  });
});

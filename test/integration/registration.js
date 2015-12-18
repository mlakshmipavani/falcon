'use strict';

var request = require('supertest-as-promised');

var app = require('../../app');
var mockDigits = require('./../support/mock-digits');
var RegistrationController = require('../../controllers/registration-controller.js');
var JoiValidate = require('./../support/joi-validate.js');

describe('Registration', () => {

  const PORT = 3050;

  const DIGITS_PORT = 3051;

  before(() => {
    return app.listen(PORT)
      .then(() => mockDigits.listen(DIGITS_PORT))

      // delay coz it takes some time to establish the connection with MongoDb
      // and expose all the collections from DaoHelper class
      .delay(100);
  });

  after(() => app.close().then(() => mockDigits.close()));

  it('registers a user', ()=> {
    return request(`http://localhost:${PORT}`)
      .post('/register')
      .set('X-Auth-Service-Provider', `http://localhost:${DIGITS_PORT}`)
      .send({name: 'jaydeep', contacts: {917405484154: 'parth'}, countryISO: 'IN'})
      .expect('Content-Type', /json/)
      .then((res) => JoiValidate.registerResponse(res.body));
  });
});

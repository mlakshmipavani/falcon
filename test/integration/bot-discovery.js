'use strict';

var request = require('supertest-as-promised');

var app = require('../../app');

describe('Bot Discovery', () => {

  const PORT = 3000;

  before(() => {
    return app.listen(PORT)

      // delay is to allow mongodb to kick in
      .delay(100);
  });

  after(() => app.close());

  it('gets the latest bots', () => {
    return request(`http://localhost:${PORT}`)
      .get('/newbots')
      .query({count: 3})
      .expect('Content-Type', /json/)
      .then((res) => {
        var body = res.body;
        body.should.have.length(3);
      });
  });
});

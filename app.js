'use strict';

var restify = require('restify');
var restifyValidator = require('restify-validator');
var Promise = require('bluebird');

var Routes = require('./routes/routes');
var ApiVersion = require('./config/api-version');
var config = require('./config/config.js');
var log = require('./utils/logger');
var authMiddleware = require('./middlewares/auth-middleware');

var app = restify.createServer({
  name: config.appName,
  version: ApiVersion.v1
});

app.use(restify.bodyParser({
  mapParams: true
}));
app.use(restify.queryParser());
app.use(restify.gzipResponse());
app.use(restify.authorizationParser());
app.use(authMiddleware());
app.use(restifyValidator);

Routes.setup(app);

if (process.env.NODE_ENV === 'test') {
  app.listen = Promise.promisify(app.listen);
  app.close = Promise.promisify(app.close);
} else
  app.listen(3000, () => log.info('server started @ port 3000'));

app.on('uncaughtException', (req, res, err) => {
  log.fatal(`error : ${JSON.stringify(err)}`);
});

module.exports = app;

'use strict';

const restify = require('restify');
const restifyValidator = require('restify-validator');
const Promise = require('bluebird');

const Routes = require('./routes/routes');
const ApiVersion = require('./config/api-version');
const config = require('./config/config.js');
const log = require('./utils/logger');
const agenda = require('./utils/agenda');

const authMiddleware = require('./middlewares/auth-middleware');
const requestIp = require('request-ip');

const app = restify.createServer({
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
app.use(requestIp.mw());

Routes.setup(app);

if (process.env.NODE_ENV === 'test') {
  app.listen = Promise.promisify(app.listen);
  app.close = Promise.promisify(app.close);
} else
  app.listen(3000, () => log.info('server started @ port 3000'));

app.on('uncaughtException', (req, res, err) => {
  log.fatal(`error : ${JSON.stringify(err)}`);
});

//noinspection JSUnresolvedFunction
agenda.on('ready', () => {
  agenda.cancel({nextRunAt: null});
  agenda.start();
});

// stop agenda before exiting
function gracefullyStop() {
  agenda.stop(() => process.exit(0));
}

process.on('SIGTERM', gracefullyStop);
process.on('SIGINT', gracefullyStop);

module.exports = app;

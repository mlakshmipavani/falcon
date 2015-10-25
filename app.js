'use strict';

var restify = require('restify');
var Routes = require('./routes/routes');
var ApiVersion = require('./config/api-version');

var User = require('./models/user');
var UserDao = require('./dao/user-dao');
var config = require('./config/config.js');

var app = restify.createServer({
  name: config.appName,
  version: ApiVersion.v1
});

app.use(restify.bodyParser({
  mapParams: true
}));

Routes.setup(app);

let user = new User({mobNumber: '919033819605', name: 'jaydeep'});
console.log(`My name is ${user.name} & here's my mobNumber ${user.mobNumber}`);
app.listen(3000, () => console.log('server started @ port 3000'));

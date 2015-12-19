'use strict';

var ErrorController = require('../controllers/error-controller.js');
var UserDao = require('../dao/user-dao.js');
var Url = require('url');

/**
 * Authenticates a given api request
 * @returns {Function}
 */
module.exports = () => {
  return (req, res, next) => {
    let pathname = Url.parse(req.url).pathname;

    // register doesn't require any auth
    if (pathname === '/register') return next();

    // if authorization.basic is undefined, return error
    if (!req.authorization || !req.authorization.basic || req.username === 'anonymous') {
      return ErrorController.notAuthorized(next);
    }

    let mobNumber = req.username;
    let token = req.authorization.basic.password;

    // if token is not available, return error
    if (!token) return ErrorController.notAuthorized(next);
    return UserDao.findUserWithToken(mobNumber, token)
      .then(userObj => {
        req.password = token;
        return next();
      })
      .catch(err => ErrorController.notAuthorized(next));
  };
};

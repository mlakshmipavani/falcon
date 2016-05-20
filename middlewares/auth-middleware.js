'use strict';

const ErrorController = require('../controllers/error-controller');
const UserDao = require('../dao/user-dao');
const Url = require('url');

/**
 * Authenticates a given api request
 * @returns {Function}
 */
module.exports = () => {
  return (req, res, next) => {
    const pathname = Url.parse(req.url).pathname;

    // register doesn't require any auth
    if (pathname === '/login') return next();
    if (pathname === '/@olacabs/authtoken') return next(); // used as a redirect uri in ola integration
    if (pathname.startsWith('/internal/email-confirmed/')) return next();

    // if authorization.basic is undefined, return error
    if (!req.authorization || !req.authorization.basic || req.username === 'anonymous') {
      return ErrorController.notAuthorized(next);
    }

    const socialId = req.username;
    const token = req.authorization.basic.password;

    // if token is not available, return error
    if (!token) return ErrorController.notAuthorized(next);
    return UserDao.findUserWithToken(socialId, token)
      .then(userObj => {
        req.password = token;
        return next();
      })
      .catch(err => ErrorController.notAuthorized(next));
  };
};

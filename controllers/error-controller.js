'use strict';

const util = require('util');
const Errors = require('restify-errors');

const log = require('../utils/logger').child({
  module: 'error-controller'
});

/**
 * Logs and returns errors to invalid api requests
 */
class ErrorController {

  /**
   * When there's an error in parameter parsing, this method should be called
   * It logs the error, and returns an error response
   * @param req Request Object
   * @param res Response Object
   * @param errors Errors (found using restify-validator)
   */
  static paramError(req, res, errors) {
    let errorStr;
    if (errors instanceof Array) {
      const error = errors[0];
      errorStr = `${error.param} : ${error.msg}`;
    } else if ((typeof errors) === 'string') errorStr = errors;
    else errorStr = util.inspect(errors);

    log.error(`[ParamError] Path[${req.route.version}]:${req.route.path} -> [${errorStr}]`);

    //noinspection JSUnresolvedFunction
    res.send(new Errors.InvalidArgumentError({message: errorStr}));
  }

  /**
   * Returns NotAuthorized Error to the client
   * @param next The next() param passed by restify
   * @returns {*}
   */
  static notAuthorized(next) {
    //noinspection JSUnresolvedFunction
    return next(new Errors.NotAuthorizedError());
  }

  /**
   * Logs an error into the logger and returns the Error object for that error
   * @param errMsg Error message used to generate the Error
   * @returns {Error}
   */
  static logAndReturnError(errMsg) {
    log.error(errMsg);
    return new Error(errMsg);
  }
}

module.exports = ErrorController;

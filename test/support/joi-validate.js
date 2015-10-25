'use strict';

var Joi = require('joi');

/**
 * This class validates the responses received from the server
 */
class JoiValidate {

  /**
   * Validates the response received from the server after registration
   * @param {object} res Response object
   */
  static registerResponse(res) {
    var schema = Joi.object().keys({
      token: Joi.string().length(24).required(),
      registered: Joi.object().pattern(/\d+/, Joi.string()),
      unRegistered: Joi.object().pattern(/\d+/, Joi.string())
    });
    _validate(res, schema);
  }

}

/**
 * An internal function to validate and assert that it works
 * @private
 */
function _validate(obj, schema) {
  var result = Joi.validate(obj, schema);

  //noinspection BadExpressionStatementJS
  result.should.validate;
}

module.exports = JoiValidate;

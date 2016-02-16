'use strict';

const apiVersion = require('../config/api-version');
const ErrorController = require('../controllers/error-controller');
const UberController = require('../controllers/cabs/uber-controller');
const OlaController = require('../controllers/cabs/ola-controller');
const CabController = require('../controllers/cabs/cab-controller');

class UberBotRoutes {

  static setup(app) {
    app.get({path: '/bot/@ubercabs/getcabs', version: apiVersion.v1}, getUberCabs);
    app.get({path: '/bot/@olacabs/getcabs', version: apiVersion.v1}, getOlaCabs);
    app.get({path: '/bot/@cabs/getcabs', version: apiVersion.v1}, getCabs);
  }
}

function getCabs(req, res) {
  const errors = validateRequest(req);
  if (errors) return ErrorController.paramError(req, res, errors);

  /** @type {{lat, lng}} */
  const params = req.params;
  const lat = params.lat;
  const lng = params.lng;

  return CabController.getCabs(lat, lng)
    .then(response => res.json(response))
    .catch(err => res.send(err));
}

function getOlaCabs(req, res) {
  const errors = validateRequest(req);
  if (errors) return ErrorController.paramError(req, res, errors);

  /** @type {{lat, lng}} */
  const params = req.params;
  const lat = params.lat;
  const lng = params.lng;

  return OlaController.getCabs(lat, lng)
    .then(response => res.json(response))
    .catch(err => res.send(err));
}

function getUberCabs(req, res) {
  const errors = validateRequest(req);
  if (errors) return ErrorController.paramError(req, res, errors);

  /** @type {{lat, lng}} */
  const params = req.params;
  const lat = params.lat;
  const lng = params.lng;

  return UberController.getCabs(lat, lng)
    .then(response => res.json(response))
    .catch(err => res.send(err));
}

function validateRequest(req) {
  // error checking
  req.assert('lat', 'latitude is a required param').notEmpty();
  req.assert('lng', 'longitude is a required param').notEmpty();

  //noinspection JSUnresolvedFunction
  req.sanitize('lat', 'latitude should be a float').toFloat();

  //noinspection JSUnresolvedFunction
  req.sanitize('lng', 'longitude should be a float').toFloat();

  return req.validationErrors();
}

module.exports = UberBotRoutes;

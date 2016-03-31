'use strict';

const apiVersion = require('../config/api-version');
const ErrorController = require('../controllers/error-controller');
const UberController = require('../controllers/cabs/uber-controller');
const OlaController = require('../controllers/cabs/ola-controller');
const CabController = require('../controllers/cabs/cab-controller');
const log = require('../utils/logger').child({
  module: 'cab-bot-routes'
});

class CabBotRoutes {

  static setup(app) {
    // uber
    app.get({path: '/bot/@ubercabs/getcabs', version: apiVersion.v1}, getUberCabs);

    // ola
    app.get({path: '/bot/@olacabs/getcabs', version: apiVersion.v1}, getOlaCabs);
    app.post({path: '/bot/@olacabs/authtoken', version: apiVersion.v1}, olaAccessToken);
    app.post({path: '/bot/@olacabs/book', version: apiVersion.v1}, bookOlaCab);
    app.post({path: '/bot/@olacabs/cancel', version: apiVersion.v1}, cancelOlaCab);
    app.get({path: '/bot/@olacabs/track_ride', version: apiVersion.v1}, trackOlaRide);

    // general
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

/**
 * It stores the Ola Access Token given by the ser
 */
function olaAccessToken(req, res) {
  req.assert('access_token', 'Ola Access Token should not be empty').notEmpty();
  const errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  const accessToken = req.params.access_token;
  const userToken = req.authorization.basic.password;
  return OlaController.storeOlaAccessToken(userToken, accessToken)
    .then(() => res.json({success: true}));
}

/**
 * Books an Ola Cab
 */
function bookOlaCab(req, res) {
  validateRequest(req);
  req.assert('cab_type', 'Cab Type is a required param').notEmpty();
  req.assert('cab_type', 'Cab Type should be one of [mini, sedan, prime]')
    .isIn(['micro', 'mini', 'sedan', 'prime']);
  const errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  /** @type {{lat, lng, cab_type}} */
  const params = req.params;
  const lat = params.lat;
  const lng = params.lng;
  const cabType = params.cab_type;
  const userToken = req.authorization.basic.password;

  return OlaController.book(userToken, lat, lng, cabType)
    .then(bookedResult => res.json(bookedResult))
    .catch(err => res.send(err));
}

/**
 * Cancels an Ola Booking
 */
function cancelOlaCab(req, res) {
  req.assert('crn', 'CRN is  required param').notEmpty();
  const errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  /** @type {{crn}} */
  const params = req.params;
  const crn = params.crn;
  const userToken = req.authorization.basic.password;

  return OlaController.cancel(userToken, crn)
    .then((/*{status, reason, text}*/ result) => {
      if (result.status === 'FAILURE' && result.reason !== 'BOOKING_ALREADY_CANCELLED') {
        log.warn({data: result}, 'Ola booking cancel failed');
        res.json({success: false, error: result.text});
      } else res.json({success: true});
    }).catch(err => res.send(err));
}

/**
 * Tracks an Ola Ride
 */
function trackOlaRide(req, res) {
  const userToken = req.authorization.basic.password;
  return OlaController.trackRide(userToken)
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

module.exports = CabBotRoutes;

'use strict';

var apiVersion = require('../config/api-version.js');
var ErrorController = require('../controllers/error-controller.js');
var UberController = require('../controllers/uber-controller.js');

class UberBotRoutes {

  static setup(app) {
    app.get({path: '/bot/@ubercabs/getcabs', version: apiVersion.v1}, getCabs);
  }

}

function getCabs(req, res, next) {

  // error checking
  req.assert('lat', 'latitude is a required param').notEmpty();
  req.assert('lng', 'longitude is a required param').notEmpty();

  //noinspection JSUnresolvedFunction
  req.sanitize('lat', 'latitude should be a float').toFloat();

  //noinspection JSUnresolvedFunction
  req.sanitize('lng', 'longitude should be a float').toFloat();

  let errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  //noinspection JSUnresolvedVariable
  let lat = req.params.lat;

  //noinspection JSUnresolvedVariable
  let lng = req.params.lng;

  return UberController.getCabs(lat, lng)
    .then(response => res.json(response))
    .catch(err => res.send(err));
}

module.exports = UberBotRoutes;

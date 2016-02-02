'use strict';

var apiVersion = require('../config/api-version.js');
var ErrorController = require('../controllers/error-controller.js');
var RailPnr = require('../controllers/pnr-controllers/rail-pnr-controller.js');
var TrackPnr = require('../controllers/pnr-controllers/track-pnr.js');

class RailPnrRoutes {

  static setup(app) {
    app.get({path: '/bot/@railpnr/getstatus', version: apiVersion.v1}, getStatus);

    app.post({path: '/bot/@railpnr/trackpnr', version: apiVersion.v1}, trackPnr);

    app.del({path: '/bot/@railpnr/trackpnr', version: apiVersion.v1}, stopTrackingPnr);
  }
}

function getStatus(req, res) {

  // error checking
  req.assert('pnr', 'PNR is a required param').notEmpty();
  req.assert('pnr', 'should contain only numbers').isNumeric();
  req.assert('pnr', 'should be of length 10').len(10, 10);

  let errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  //noinspection JSUnresolvedVariable
  const pnr = req.params.pnr;
  const userToken = req.authorization.basic.password;
  return TrackPnr.getStatusWithTrackingInfo(pnr, userToken)
    .then(response => res.json(response))
    .catch(err => res.send(err));
}

function trackPnr(req, res) {
  let userToken = req.authorization.basic.password;

  // error checking
  req.assert('pnr', 'PNR is a required param').notEmpty();
  req.assert('pnr', 'should contain only numbers').isNumeric();
  req.assert('pnr', 'should be of length 10').len(10, 10);

  let errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  let pnr = req.params.pnr;
  return TrackPnr.startTracking(userToken, pnr)
    .then(result => res.send(result));
}

function stopTrackingPnr(req, res) {
  let userToken = req.authorization.basic.password;

  // error checking
  req.assert('pnr', 'PNR is a required param').notEmpty();
  req.assert('pnr', 'should contain only numbers').isNumeric();
  req.assert('pnr', 'should be of length 10').len(10, 10);

  let errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  let pnr = req.params.pnr;
  return TrackPnr.stopTracking(userToken, pnr)
    .then(() => res.send('Tracking Stopped'));
}

module.exports = RailPnrRoutes;

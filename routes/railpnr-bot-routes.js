'use strict';

const apiVersion = require('../config/api-version');
const ErrorController = require('../controllers/error-controller');
const TrackPnr = require('../controllers/pnr-controllers/track-pnr');

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

  const errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  //noinspection JSUnresolvedVariable
  const pnr = req.params.pnr;
  const userToken = req.authorization.basic.password;
  return TrackPnr.getStatusWithTrackingInfo(pnr, userToken)
    .then(response => res.json(response))
    .catch(err => res.send(err));
}

function trackPnr(req, res) {
  const userToken = req.authorization.basic.password;

  // error checking
  req.assert('pnr', 'PNR is a required param').notEmpty();
  req.assert('pnr', 'should contain only numbers').isNumeric();
  req.assert('pnr', 'should be of length 10').len(10, 10);

  const errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  const pnr = req.params.pnr;
  return TrackPnr.startTracking(userToken, pnr)
    .then(result => res.send({success: true}))
    .catch(err => res.send(err));
}

function stopTrackingPnr(req, res) {
  const userToken = req.authorization.basic.password;

  // error checking
  req.assert('pnr', 'PNR is a required param').notEmpty();
  req.assert('pnr', 'should contain only numbers').isNumeric();
  req.assert('pnr', 'should be of length 10').len(10, 10);

  const errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  const pnr = req.params.pnr;
  return TrackPnr.stopTracking(userToken, pnr)
    .then(result => res.send({success: true}))
    .catch(err => res.send(err));
}

module.exports = RailPnrRoutes;

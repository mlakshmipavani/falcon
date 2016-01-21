'use strict';

var apiVersion = require('../config/api-version.js');
var ErrorController = require('../controllers/error-controller.js');
var RailPnr = require('../controllers/rail-pnr-controller.js');

class RailPnrRoutes {

  static setup(app) {
    app.get({path: '/bot/@railpnr/getstatus', version: apiVersion.v1}, getStatus);
  }
}

function getStatus(req, res, next) {

  // error checking
  req.assert('pnr', 'PNR is a required param').notEmpty();
  req.assert('pnr', 'should contain only numbers').isNumeric();
  req.assert('pnr', 'should be of length 10').len(10, 10);

  let errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  //noinspection JSUnresolvedVariable
  let pnr = req.params.pnr;
  return RailPnr.getStatus(pnr)
    .then(response => res.json(response))
    .catch(err => res.send(err));
}

module.exports = RailPnrRoutes;

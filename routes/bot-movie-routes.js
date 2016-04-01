'use strict';

const apiVersion = require('../config/api-version');
const ErrorController = require('../controllers/error-controller');
const MovieController = require('../controllers/movie/movie-controller');
const MovieBotDao = require('../dao/bot-movie-dao');

class BotMovieRoutes {

  static setup(app) {
    app.get({path: '/bot/@moviesnow/getmovies', version: apiVersion.v1}, getMovies);
    app.get({path: '/bot/@moviesnow/getcities', version: apiVersion.v1}, getCities);
    app.get({path: '/bot/@moviesnow/getlanguages', version: apiVersion.v1}, getLanguages);
    if (process.env.NODE_ENV === 'development')
      app.post({path: '/bot/@moviesnow/updateColor', version: apiVersion.v1}, updateColor);
  }
}

function getMovies(/*{check,params, clientIp, validationErrors}*/ req, res) {

  // error checking
  req.check('langArr', 'Languages array is required param').notEmpty();

  let errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  //noinspection JSUnresolvedVariable
  const langArr = req.params.langArr;
  if (!(langArr instanceof Array))
    return ErrorController.paramError(req, res, 'langArr should be an array');
  if (!req.clientIp) return ErrorController.logAndReturnError('client ip is null');
  return MovieController.getMovies(langArr, req.clientIp)
    .then(movies => {
      //noinspection JSUnresolvedFunction
      res.setHeader('Cache-Control', 'private, max-age=3600'); // 1hr
      res.json(movies);
    })
    .catch(err => res.send(err));
}

function getCities(req, res) {
  return MovieController.getCities()
    .then(cities => {
      //noinspection JSUnresolvedFunction
      res.setHeader('Cache-Control', 'private, max-age=3600'); // 1hr
      res.json(cities);
    })
    .catch(err => res.send(err));
}

function getLanguages(req, res) {
  return MovieController.getLanguages()
    .then(languages => {
      //noinspection JSUnresolvedFunction
      res.setHeader('Cache-Control', 'private, max-age=3600'); // 1hr
      res.json(languages);
    })
    .catch(err => res.send(err));
}

function updateColor(req, res) {
  // error checking
  req.check('eventCode', 'eventCode is required param').notEmpty();
  req.check('color', 'color is a required param').notEmpty();
  const errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  const eventCode = req.params.eventCode;
  const color = req.params.color;

  return MovieBotDao.updateMovieColors([{eventCode, color}]);
}

module.exports = BotMovieRoutes;

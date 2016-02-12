'use strict';

const apiVersion = require('../config/api-version');
const ErrorController = require('../controllers/error-controller');
const MovieController = require('../controllers/movie/movie-controller');

class BotMovieRoutes {

  static setup(app) {
    app.get({path: '/bot/@moviesnow/getmovies', version: apiVersion.v1}, getMovies);
  }
}

function getMovies(req, res) {

  // error checking
  req.check('langArr', 'Languages array is required param').notEmpty();
  req.check('cityCode', 'City code is required param').notEmpty();

  let errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  //noinspection JSUnresolvedVariable
  const langArr = req.params.langArr;
  const cityCode = req.params.cityCode;
  if (!(langArr instanceof Array))
    return ErrorController.paramError(req, res, 'langArr should be an array');

  return MovieController.getMovies(langArr, cityCode)
    .then(movies => res.json(movies))
    .catch(err => res.send(err));
}

module.exports = BotMovieRoutes;

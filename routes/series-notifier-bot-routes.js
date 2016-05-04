'use strict';

const SeriesDao = require('../dao/series-dao');
const apiVersion = require('../config/api-version');
const ErrorController = require('../controllers/error-controller');
const SeriesController = require('../controllers/series-notifier/series-controller');
const log = require('../utils/logger').child({
  module: 'series-notifier-bot-routes'
});

const prefix = '/bot/@seriesnotifier';

class SeriesNotifierBotRoutes {

  static setup(app) {
    app.get({path: `${prefix}/trending`, version: apiVersion.v1}, getTrending);
    app.get({path: `${prefix}/search`, version: apiVersion.v1}, getSearchResults);
    app.get({path: `${prefix}/nextEpisodes`, version: apiVersion.v1}, getNextEpisodes);
  }

}

function getTrending(req, res) {
  return SeriesDao.getTrending()
    .then(data => res.json(data))
    .catch(err => {
      log.error(err, 'Error occurred while getting trending series');
      return res.send(err);
    });
}

function getSearchResults(req, res) {

  // error checking
  req.check('q', 'Query is a required param').notEmpty();

  const errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  const query = req.params.q;
  return SeriesController.search(query)
    .then(results => res.json(results))
    .catch(err => {
      log.error(err, 'Error occurred while searching series');
      return res.send(err);
    });
}

function getNextEpisodes(req, res) {
  // error checking
  req.check('tvdbIds', 'tvdbIds shouldn\'t be empty').notEmpty();

  const errors = req.validationErrors();
  if (errors) return ErrorController.paramError(req, res, errors);

  /** @type {{tvdbIds}} */
  const params = req.params;
  let tvdbIds = params.tvdbIds;

  if (!(tvdbIds instanceof Array)) tvdbIds = [tvdbIds];
  return SeriesController.nextEpisodesWithSeriesInfoMulti(tvdbIds)
    .then(episodes => res.json(episodes))
    .catch(err => {
      log.error(err, 'failed fetching next episodes');
      res.send(err);
    });
}

module.exports = SeriesNotifierBotRoutes;

'use strict';

const agenda = require('../../utils/agenda');
const SeriesController = require('./series-controller');

const AgendaTasks = {
  taskName: 'updateTrendingSeries',
  updateTrending: (job, done) => {
    return TrendingSeriesUpdater.update().then(() => done());
  }
};

class TrendingSeriesUpdater {

  static update() {
    return SeriesController.updateTrendingData();
  }

  static onAgendaReady() {
    agenda.define(AgendaTasks.taskName, AgendaTasks.updateTrending);
    agenda.every('12 hours', AgendaTasks.taskName);
  }

}

module.exports = TrendingSeriesUpdater;

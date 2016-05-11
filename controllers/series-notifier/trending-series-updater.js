'use strict';

const agenda = require('../../utils/agenda');
const TraktController = require('./trakt-controller.js');

const AgendaTasks = {
  taskName: 'updateTrendingSeries',
  updateTrending: (job, done) => {
    return TrendingSeriesUpdater.update().then(() => done());
  }
};

class TrendingSeriesUpdater {

  static update() {
    return TraktController.updateTrendingData();
  }

  static onAgendaReady() {
    agenda.define(AgendaTasks.taskName, AgendaTasks.updateTrending);
    agenda.every('12 hours', AgendaTasks.taskName);
  }

}

module.exports = TrendingSeriesUpdater;

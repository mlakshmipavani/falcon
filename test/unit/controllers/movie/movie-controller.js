'use strict';

const Promise = require('bluebird');
const DaoHelper = require('../../../../dao/dao-helper');
const GeoIp = require('../../../../controllers/geoip/geoip');
const MovieController = require('../../../../controllers/movie/movie-controller');
const mockMovies = require('../../../mock/movie/mock-movies');
const mockCities = require('../../../mock/movie/mock-cities');

describe('Movie Controller', () => {

  const clientIp = '210.212.205.18';
  const cityCode = 'BANG';
  const languages = ['English', 'Hindi'];

  before(() => {
    return Promise.delay(100)
      .then(() => DaoHelper.db.dropDatabase())
      .then(() => DaoHelper.bmsCities.insertMany(mockCities))
      .then(() => DaoHelper.movies.insertMany(mockMovies))
      .then(() => DaoHelper.bmsCities.createIndex({Location: '2dsphere'}));
  });

  it('gets cities', () => {
    return MovieController.getCities()
      .tap(cities => cities.should.be.of.length(2))
      .map((/*BmsCity*/ city, index) =>
        city.SubRegionCode.should.equal(mockCities[index].SubRegionCode));
  });

  it('gets movies', () => {
    return MovieController._getMovies(languages, cityCode)
      .tap(movies => movies.should.be.of.length(1))
      .map((/*BmsMovie*/ movie) => movie.EventCode.should.equal(mockMovies[0].EventCode));
  });

  it('gets languages', () => {
    return MovieController.getLanguages()
      .should.eventually.deep.equal(['English', 'Hindi', 'Punjabi']);
  });

  it('gets ip then returns movies', () => {
    const geoIpOriginal = GeoIp.getDetails;
    GeoIp.getDetails = () => Promise.resolve({latitude: 12.9833, longitude: 77.5833});

    return MovieController.getMovies(languages, clientIp)
      .tap(movies => movies.should.be.of.length(1))
      .map((/*BmsMovie*/ movie) => movie.EventCode.should.equal(mockMovies[0].EventCode))
      .then(() => GeoIp.getDetails = geoIpOriginal);
  });
});

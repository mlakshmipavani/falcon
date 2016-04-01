'use strict';

const Promise = require('bluebird');
const DaoHelper = require('../../../dao/dao-helper');
const GeoIp = require('../../../controllers/geoip/geoip');
const BotMovieDao = require('../../../dao/bot-movie-dao');
const mockMovies = require('../../mock/movie/mock-movies');
const mockCities = require('../../mock/movie/mock-cities');

describe('BotMovie Dao', () => {

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

  it('gets movies', () => {
    return BotMovieDao.getMovies(languages, cityCode)
      .tap(movies => movies.should.be.of.length(1))
      .map((/*BmsMovie*/ movie) => movie.EventCode.should.equal(mockMovies[0].EventCode));
  });

  it('gets cities', () => {
    return BotMovieDao.getCities()
      .tap(cities => cities.should.be.of.length(2))
      .map((/*BmsCity*/ city, index) =>
        city.SubRegionCode.should.equal(mockCities[index].SubRegionCode));
  });

  it('gets nearest city', () => {
    return BotMovieDao.getNearestCity(12.9833, 77.5833)
      .then(city => city.SubRegionCode.should.equal(cityCode));
  });

  it('gets languages', () => {
    return BotMovieDao.getLanguages()
      .then(languages => languages.should.deep.equal(['English', 'Hindi', 'Punjabi']));
  });

  it('gets unique event codes', () => {
    return BotMovieDao.getUniqueEventCodes()
      .then(codes => codes.should.deep.equal(['ET00030143', 'ET00035719', 'ET00039115']));
  });

  it('gets all Poster Urls', () => {
    return BotMovieDao.getAllPosterUrls()
      .map((/*{eventCode, posterUrl}*/ entry, index, length) => {
        entry.eventCode.should.equal(mockMovies[length - index - 1].EventCode);
        entry.posterUrl.should.equal(mockMovies[length - index - 1].PosterUrl);
      });
  });

  it('stores cities', () => {
    const cities = [mockCities[0]];
    return BotMovieDao.getCities()
      .then(data => data.should.be.of.length(2))
      .then(() => BotMovieDao.storeCities(cities))
      .then(() => BotMovieDao.getCities())
      .then(data => data.should.be.of.length(1));
  });

  it('stores movies', () => {
    const languages = ['Hindi', 'Punjabi'];
    const mumbai = 'MWEST';
    const movies = [mockMovies[1]];
    return BotMovieDao.getMovies(languages, mumbai)
      .then(data => data.should.be.of.length(2))
      .then(() => BotMovieDao.storeMovies(movies))
      .then(() => BotMovieDao.getMovies(languages, mumbai))
      .then(data => data.should.be.of.length(1));
  });

  it('updates movie colors', () => {
    const languages = ['Hindi'];
    const city = 'MWEST';
    const color = '#f0f0f0';
    return BotMovieDao.getMovies(languages, city)
      .map((/*BmsMovie*/ movie) => {
        return {color, eventCode: movie.EventCode, no_poster: false};
      })
      .then(input => BotMovieDao.updateMovieColors(input))
      .then(() => BotMovieDao.getMovies(languages, city))
      .spread((/*BmsMovie*/ movie) => movie.color.should.equal(color));
  });

  it('updates movie ratings', () => {
    const languages = ['Hindi'];
    const city = 'MWEST';
    const rating = 50;
    return BotMovieDao.getMovies(languages, city)
      .reduce((finalObj, /*BmsMovie*/ item) => {
        finalObj[item.EventCode] = rating;
        return finalObj;
      }, {})
      .then(ratings => BotMovieDao.updateMovieRatings(ratings))
      .then(() => BotMovieDao.getMovies(languages, city))
      .map((/*BmsMovie*/ movie) => movie.rating.should.equal(rating));
  });

  it('should remove movie if no_poster=true', () => {
    const languages = ['Hindi'];
    const city = 'MWEST';
    const color = '#f0f0f0';
    return BotMovieDao.getMovies(languages, city)
      .map((/*BmsMovie*/ movie) => {
        return {color, eventCode: movie.EventCode, no_poster: true};
      })
      .then(input => BotMovieDao.updateMovieColors(input))
      .then(() => BotMovieDao.getMovies(languages, city))
      .then(data => data.should.be.of.length(0));
  });

});

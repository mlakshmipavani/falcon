'use strict';

const restify = require('restify');
const restifyValidator = require('restify-validator');
const Promise = require('bluebird');

const mockPnr = restify.createServer({});

let apiHitCount = 0;

mockPnr.use(restify.queryParser());
mockPnr.use(restify.bodyParser({
  mapParams: true
}));
mockPnr.use(restifyValidator);

//
mockPnr.get('/confirmTkt/pnr/:abc', (req, res) => {

  apiHitCount += 1;

  let body = 'hello!!!';

  // if testing with client than check the apihitcount to <=2
  if (apiHitCount <= 1)

  //body = undefinedPassenger;
    body = crmOnePassenger0;
  else
    body = crmOnePassenger1;

  //res.writeHead(200, {
  //  'Content-Length': Buffer.byteLength(body),
  //  'Content-Type': 'text/html'
  //});
  //res.write(body);
  //res.end();
  res.json(body);
});

// promisify the listen function
mockPnr.listen = Promise.promisify(mockPnr.listen);
mockPnr.close = Promise.promisify(mockPnr.close);
mockPnr.listen(5001);

/**
 * @type {Server}
 */
module.exports = mockPnr;

const crmOnePassenger0 = {
  ShowBlaBlaAd: true,
  PnrAlternativeAdPosition: 1,
  Pnr: '4528171237',
  TrainNo: '*16526',
  TrainName: 'KANYAKUMARI EXP',
  Doj: '18- 3-2016',
  From: 'KJM ',
  To: 'TCR ',
  ReservationUpto: 'TCR ',
  BoardingPoint: 'KJM ',
  Class: ' 3A',
  ChartPrepared: false,
  BoardingStationName: 'Krishnarajapuram',
  ReservationUptoName: 'Thrissur City',
  PassengerCount: 2,
  PassengerStatus: [{
    Number: 1,
    PercentageProbability: 0,
    Prediction: null,
    ConfirmTktStatus: 'Confirm',
    Coach: null,
    Berth: 0,
    Status: null,
    BookingStatus: 'W/L    2,GNWL',
    CurrentStatus: 'RAC    8'
  }, {
    Number: 2,
    PercentageProbability: 0,
    Prediction: null,
    ConfirmTktStatus: 'Confirm',
    Coach: null,
    Berth: 0,
    Status: null,
    BookingStatus: 'W/L    3,GNWL',
    CurrentStatus: 'RAC    9'
  }],
  Error: null
};

const crmOnePassenger1 = {
  ShowBlaBlaAd: true,
  PnrAlternativeAdPosition: 1,
  Pnr: '4528171237',
  TrainNo: '*16526',
  TrainName: 'KANYAKUMARI EXP',
  Doj: '18- 3-2016',
  From: 'KJM ',
  To: 'TCR ',
  ReservationUpto: 'TCR ',
  BoardingPoint: 'KJM ',
  Class: ' 3A',
  ChartPrepared: false,
  BoardingStationName: 'Krishnarajapuram',
  ReservationUptoName: 'Thrissur City',
  PassengerCount: 2,
  PassengerStatus: [{
    Number: 1,
    PercentageProbability: 0,
    Prediction: null,
    ConfirmTktStatus: 'Confirm',
    Coach: null,
    Berth: 0,
    Status: null,
    BookingStatus: 'W/L    2,GNWL',
    CurrentStatus: 'RAC    9'
  }, {
    Number: 2,
    PercentageProbability: 0,
    Prediction: null,
    ConfirmTktStatus: 'Confirm',
    Coach: null,
    Berth: 0,
    Status: null,
    BookingStatus: 'W/L    3,GNWL',
    CurrentStatus: 'RAC    9'
  }],
  Error: null
};


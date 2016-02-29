'use strict';

const CrmTktApi = require('../../../../controllers/pnr-controllers/confirm-tkt-api');

describe('CrmTktApi', () => {

  const pnr = 4528171237;
  const expectedResponse = {
    trainNumber: '*16526',
    trainName: 'KANYAKUMARI EXP',
    boardingDate: '18- 3-2016',
    from: 'KJM ',
    to: 'TCR ',
    reservedUpto: 'TCR ',
    boardingPoint: 'KJM ',
    class: ' 3A',
    passengers: [
      {
        name: '1',
        bookingStatus: 'W/L    2,GNWL',
        currentStatus: 'RAC    8'
      },
      {
        name: '2',
        bookingStatus: 'W/L    3,GNWL',
        currentStatus: 'RAC    9'
      }
    ],
    bookingFare: 'Not Known',
    chartStatus: 'Chart Not Prepared'
  };

  it('should get the pnr status detials out of html', () => {
    //noinspection JSAccessibilityCheck
    const actualRes = CrmTktApi._extractPnrDetail(apiResponse);
    const flag = JSON.stringify(actualRes) === JSON.stringify(expectedResponse);
    return flag.should.be.true;
  });
});

const apiResponse = {
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
  PassengerStatus: [
    {
      Number: 1,
      PercentageProbability: 0,
      Prediction: null,
      ConfirmTktStatus: 'Confirm',
      Coach: null,
      Berth: 0,
      Status: null,
      BookingStatus: 'W/L    2,GNWL',
      CurrentStatus: 'RAC    8'
    },
    {
      Number: 2,
      PercentageProbability: 0,
      Prediction: null,
      ConfirmTktStatus: 'Confirm',
      Coach: null,
      Berth: 0,
      Status: null,
      BookingStatus: 'W/L    3,GNWL',
      CurrentStatus: 'RAC    9'
    }
  ],
  Error: null
};

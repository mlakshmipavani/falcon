'use strict';

const twoPassengersParsed = {
  trainNumber: '*16526',
  trainName: 'KANYAKUMARI EXP',
  boardingDate: '18- 3-2016',
  from: 'KJM',
  to: 'TCR',
  reservedUpto: 'TCR',
  boardingPoint: 'KJM',
  class: '3A',
  passengers: [{
    name: 'Passenger 1',
    bookingStatus: 'W/L 2,GNWL',
    currentStatus: 'RAC 8'
  }, {
    name: 'Passenger 2',
    bookingStatus: 'W/L 3,GNWL',
    currentStatus: 'RAC 9'
  }],
  bookingFare: '1700',
  chartStatus: 'CHART NOT PREPARED'
};

const onePassengerConfirmed = {
  trainNumber: '*16533',
  trainName: 'BGKT SBC EXPRES',
  boardingDate: '17- 2-2016',
  from: 'ADI',
  to: 'YPR',
  reservedUpto: 'YPR',
  boardingPoint: 'ADI',
  class: 'SL',
  passengers: [{
    name: 'Passenger 1',
    bookingStatus: 'S9  , 64,GN',
    currentStatus: 'CNF'
  }],
  chartStatus: 'CHART NOT PREPARED'
};

const onePassengerNotConfirmed = {
  trainNumber: '*16533',
  trainName: 'BGKT SBC EXPRES',
  boardingDate: '17- 2-2016',
  from: 'ADI',
  to: 'YPR',
  reservedUpto: 'YPR',
  boardingPoint: 'ADI',
  class: 'SL',
  passengers: [{
    name: 'Passenger 1',
    bookingStatus: 'S9  , 64,GN',
    currentStatus: 'RAC'
  }],
  chartStatus: 'CHART NOT PREPARED'
};

const twoPassenger01Confirmed = {
  trainNumber: '*16533',
  trainName: 'BGKT SBC EXPRES',
  boardingDate: '17- 2-2016',
  from: 'ADI',
  to: 'YPR',
  reservedUpto: 'YPR',
  boardingPoint: 'ADI',
  class: 'SL',
  passengers: [
    {
      name: 'Passenger 1',
      bookingStatus: 'S9  , 64,GN',
      currentStatus: 'CNF'
    },
    {
      name: 'Passenger 2',
      bookingStatus: 'S9  , 64,GN',
      currentStatus: 'RAC'
    }],
  chartStatus: 'CHART NOT PREPARED'
};

const onePassengerCancelled = {
  trainNumber: '12956',
  trainName: 'JP BCT SUPFAST',
  boardingDate: '27- 3-2016',
  from: 'JP',
  to: 'BCT',
  reservedUpto: 'BCT',
  boardingPoint: 'JP',
  class: '3A',
  passengers: [{
    name: '1',
    bookingStatus: 'W/L   12,CK',
    currentStatus: 'Can/Mod'
  }],
  bookingFare: '1810',
  chartStatus: 'CHART PREPARED'
};

module.exports = {
  twoPassengersParsed,
  onePassengerConfirmed,
  onePassengerNotConfirmed,
  twoPassenger01Confirmed,
  onePassengerCancelled
};

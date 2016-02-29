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

module.exports = {
  twoPassengersParsed
};

'use strict';

class Utils {

  /**
   * Returns an object with the same properties as the passed one
   * @param object
   * @return {*}
   */
  static cloneProperties(object) {
    return JSON.parse(JSON.stringify(object));
  }

  /**
   * Converts an arrary of objects to a hash with a given unique key
   * @param arr Array with objects (Eg. [{id: 'a', msg: 'hi'}, {id: 'b', msg: 'hey'}])
   * @param uniqueKey A key for which all the objects in the array have unique value (Eg. 'id')
   * @returns {{}} Here it will return {a: {msg: 'hi'}, b: {msg: 'hey'}}
   */
  static getObjectFromArray(/*Array<{}>*/ arr, /*string*/ uniqueKey) {
    return arr.reduce((finalObj, eachObj) => {
      const uniqueValue = eachObj[uniqueKey];
      finalObj[uniqueValue] = eachObj;
      return finalObj;
    }, {});
  }

  /**
   * Returns a random integer between min (included) and max (excluded)
   * @param min Minimum value of the range
   * @param max Maximum value of the range
   * @return {number}
   */
  static getRandomInt(/*number*/ min, /*number*/ max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Gives you date after {@link count} days
   * @param count
   * @return {Date}
   */
  static inDays(/*number*/ count) {
    const today = new Date();
    today.setDate(today.getDate() + count);
    return today;
  }
}

module.exports = Utils;

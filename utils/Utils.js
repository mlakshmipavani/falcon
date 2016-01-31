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

}

module.exports = Utils;

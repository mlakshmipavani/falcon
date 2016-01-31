'use strict';

class Utils {

  /**
   * Returns duplicate object
   * @param object
   * @return JSON
   */
  static getDuplicateObject(object) {
    return JSON.parse(JSON.stringify(object));
  }

}

module.exports = Utils;

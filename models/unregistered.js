'use strict';

/**
 * Let's say jaydp registers on Yolo Messenger today, we take all his contacts,
 * find the ones who are already registered and send it back to jaydp
 * And the one's that are not registered we store them in the unregistered collection,
 * so that whenever that guy registers we can send jaydp a notification saying XYZ is on YOLO
 *
 * Basically this collection is a key-value store, where
 * Key => mobile Number of the unRegistered guy
 * Value => the list of people to notify when he registers
 */
class UnRegistered {

  /**
   * @param {string} mobNumber
   * @param {Array<string>} notifyList
   */
  constructor(mobNumber, notifyList) {
    this._mobNumber = mobNumber;
    this._notifyList = notifyList;
  }

  /**
   * Key
   * @returns {string}
   */
  get mobNumber() {
    return this._mobNumber;
  }

  /**
   * Value
   * @returns {Array<string>}
   */
  get notifyList() {
    return this._notifyList;
  }
}

module.exports = UnRegistered;

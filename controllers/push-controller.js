'use strict';

const request = require('request-promise');
const OneSignalDao = require('../dao/onesignal-dao');
const config = require('../config/config');
const log = require('../utils/logger').child({
  module: 'push-controller'
});

class PushController {

  /**
   * Push a PNR status Update
   * @param data Pnr Data
   * @param userTokens _id of users to send the notification
   * @returns {Promise<T>}
   */
  static pushPnrUpdate(/*{}*/ data, /*Array<string>*/ userTokens) {
    const action = 'com.stayyolo.PUSH.ON_PNR_TRACK_UPDATE';
    return OneSignalDao.getPlayerIds(userTokens)
      .then((/*Array<string>*/ playerIds) => this._pushData(action, data, playerIds));
  }

  /**
   * Sends a visible hello notification to all the registered users
   * @returns {Promise<T>}
   */
  static pushHelloMsgToAll() {
    return OneSignalDao.getAllPlayerIds()
      .then((/*Array<string>*/ playerIds) => this._pushMessage('hello', playerIds));
  }

  /**
   * Generic method to push a hash data object to device
   * @param action A string that defines what action needs to be taken on android
   *      (Eg. com.stayyolo.PUSH.ON_PNR_TRACK_UPDATE)
   * @param data A hash object that needs to be sent
   * @param playerIds One Signal User ids
   * @returns {Promise<T>}
   * @private
   */
  static _pushData(/*string*/ action, /*{}*/ data, /*Array<string>*/ playerIds) {
    const options = this._getRequestOptionsForData(action, data, playerIds);
    return request(options)
      .then((/*{id,recipients}*/ res) => {
        if (playerIds.length !== res.recipients)
          throw new Error(`playerIds = ${playerIds} & recipients = ${res.recipients}`);
        return res;
      })
      .catch(err => log.error(err, 'recipients != playerIds'));
  }

  /**
   * Pushes a user visible notification to the device
   * @param message Message to send
   * @param playerIds One Signal User ids
   * @returns {Promise<T>}
   * @private
   */
  static _pushMessage(/*string*/ message, /*Array<string>*/ playerIds) {
    const options = this._getRequestOptions(message, playerIds);
    return request(options)
      .then((/*{id,recipients}*/ res) => {
        if (playerIds.length !== res.recipients)
          throw new Error(`playerIds = ${playerIds} & recipients = ${res.recipients}`);
        return res;
      })
      .catch(err => log.error(err, 'recipients != playerIds'));
  }

  /**
   * Returns request options to send a user visible notification
   * @param message Message to send
   * @param playerIds One Signal User ids
   * @returns {{method, url, body, json}}
   * @private
   */
  static _getRequestOptions(/*string*/ message, /*Array<string>*/ playerIds) {
    const options = this._getBaseRequestOptions(playerIds);
    options.body.contents = {en: message};
    return options;
  }

  /**
   * Returns request options to send a background data notification
   * @param action A string that defines what action needs to be taken on android
   *      (Eg. com.stayyolo.PUSH.ON_PNR_TRACK_UPDATE)
   * @param data A hash object that needs to be sent
   * @param playerIds One Signal User ids
   * @returns {{method, url, body, json}}
   * @private
   */
  static _getRequestOptionsForData(/*string*/ action, /*{}*/ data, /*Array<string>*/ playerIds) {
    const options = this._getBaseRequestOptions(playerIds);
    options.body.data = Object.assign(data, {action});

    //noinspection Eslint
    options.body.android_background_data = true;// jscs:ignore
    return options;
  }

  /**
   * Returns the basic request options to send a request to OneSignal servers
   * @param playerIds One Signal User ids
   * @returns {{method, url, body: {app_id, include_player_ids: Array.<string>}, json}}
   * @private
   */
  static _getBaseRequestOptions(/*Array<string>*/ playerIds) {
    //noinspection Eslint,Jscs
    return {
      method: 'POST',
      url: 'https://onesignal.com/api/v1/notifications',
      body: {
        app_id: config.oneSignal.appId,
        include_player_ids: playerIds
      },
      json: true
    };
  }
}

module.exports = PushController;
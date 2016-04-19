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
  static pushPnrUpdate(/*PnrDetails|{isTracked}*/ data, /*Array<string>*/ userTokens) {
    if (!data.isTracked) log.warn('Pushing PNR update w/o isTracked field');
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
    options.body.android_background_data = true;
    return options;
  }

  /**
   * Returns the basic request options to send a request to OneSignal servers
   * @param playerIds One Signal User ids
   * @returns {{method, url, body: {app_id, include_player_ids: Array.<string>}, json}}
   * @private
   */
  static _getBaseRequestOptions(/*Array<string>*/ playerIds) {
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

  /**
   * Sends a dynamic notification to all the users
   * Useful when you want to send all users notification like Ola Micro @ Rs.6/Km
   * @param notif The Dynamic notif object
   * @return {Promise}
   * @private
   */
  static _pushDynamicNotif(/*DynamicNotif*/ notif) {
    const action = 'com.stayyolo.PUSH.SHOW_NOTIFICATION';

    const options = this._getRequestOptionsForData(action, notif, []);
    delete options.body.include_player_ids;
    options.headers = {Authorization: `Basic ${config.oneSignal.apiKey}`};
    options.body.included_segments = ['All'];
    return request(options).then(console.log).catch(console.error);
  }

  /**
   * Sends OneSignal analytics about who opened the notification
   * @param notificationId Notification Id obtained when sending the notification
   * @return {Promise}
   */
  static notifOpened(/*string*/ notificationId) {
    return request.put({
      url: `https://onesignal.com/api/v1/notifications/${notificationId}`,
      body: {
        app_id: config.oneSignal.appId,
        opened: true
      },
      json: true
    });
  }
}

// PushController._pushDynamicNotif({
//   botHandle: '@cabs', // use @app to open the home screen
//   title: 'Ola Micro @ Rs.6/Km',
//   content: 'Now book Ola Micro through Yolobots!',
//   bigPicture: 'http://www.nextbigwhat.com/wp-content/uploads/2016/03/OlaMicro-990x556.jpg' // leave blank if not needed
// });

module.exports = PushController;

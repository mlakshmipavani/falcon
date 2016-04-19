'use strict';

const ApiVersion = require('../config/api-version');
const PushController = require('../controllers/push-controller');

class NotificationRoutes {

  static setup(app) {
    app.post({path: '/notification/opened/:notificationId', version: ApiVersion.v1}, notifOpened);
  }
}

function notifOpened(req, res) {
  /**
   * @type {{notificationId}}
   */
  const params = req.params;
  PushController.notifOpened(params.notificationId);
  res.json({success: true});
}

module.exports = NotificationRoutes;

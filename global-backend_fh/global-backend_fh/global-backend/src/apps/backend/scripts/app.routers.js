define(function(require, exports, module) {

  var dashboardRouter = require('dashboard/router');
  var betCenterRouter = require('betCenter/router');
  var fundCenterRouter = require('fundCenter/router');
  var authorityCenterRouter = require('authorityCenter/router');
  var globalCenterRouter = require('globalCenter/router');
  var saleCenterRouter = require('saleCenter/router');
  var messageCenterRouter = require('messageCenter/router');
  var userCenterRouter = require('userCenter/router');
  var dataCenterRouter = require('dataCenter/router');
  var vipCenterRouter = require('vipCenter/router');
  var agGameRouter = require('agGame/router');


  exports.install = function() {
    dashboardRouter.install();
    betCenterRouter.install();
    fundCenterRouter.install();
    authorityCenterRouter.install();
    globalCenterRouter.install();
    saleCenterRouter.install();
    messageCenterRouter.install();
    userCenterRouter.install();
    dataCenterRouter.install();
    vipCenterRouter.install();
    agGameRouter.install();
  };
});
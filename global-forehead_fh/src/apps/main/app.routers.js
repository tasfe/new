"use strict";

var dashboardRouter = require('dashboard/router');
var userCenterRouter = require('userCenter/router');
var accountCenterRouter = require('accountCenter/router');
var activeCenterRouter = require('activeCenter/router');
var agencyCenterRouter = require('agencyCenter/router');
var fundCenterRouter = require('fundCenter/router');
var bettingCenterRouter = require('bettingCenter/router');
var newsCenterRouter = require('newsCenter/router');
var dynamicCenterRouter = require('dynamicCenter/router');
var helpCenterRouter = require('helpCenter/router');
var gameCenterRouter = require('gameCenter/router');
var bettingButlerRouter = require('bettingButler/router');

exports.install = function() {
  dashboardRouter.install();
  userCenterRouter.install();
  accountCenterRouter.install();
  activeCenterRouter.install();
  agencyCenterRouter.install();
  fundCenterRouter.install();
  bettingCenterRouter.install();
  newsCenterRouter.install();
  dynamicCenterRouter.install();
  helpCenterRouter.install();
  gameCenterRouter.install();
  bettingButlerRouter.install();
};

"use strict";

var MediatorModule = require('skeleton/modules/mediator');
var UIModule = require('skeleton/modules/ui');
var DataModule = require('skeleton/modules/data');
var RouterModule = require('skeleton/modules/router');
var SettingModule = require('skeleton/modules/setting');

var MenuModule = require('skeleton/modules/ui/menu');
var SyncModule = require('skeleton/modules/sync');
var OAuthModule = require('skeleton/modules/oauth');
var LoaderModule = require('skeleton/modules/ui/loader');
var NotificationModule = require('skeleton/modules/ui/notification');
var DialogModule = require('skeleton/modules/ui/dialog');
var PollingModule = require('skeleton/modules/polling');
var ViewPollModule = require('skeleton/modules/viewPool');
var InputMonitorModule = require('skeleton/modules/inputMonitor');
var ValidatorModule = require('skeleton/modules/validator');
var GlobalFuncModule = require('skeleton/modules/globalFunc');

var OauthMediatorModule = require('skeleton/modules/mediator/oauth');
var MessageMediatorModule = require('skeleton/modules/mediator/message');

var InsideLetterModule = require('skeleton/modules/ui/insideLetter');
// var RainActivityModule = require('skeleton/modules/mediator/rainActivity');
// var DriftActivityModule = require('skeleton/modules/mediator/driftActivity');
var NewsMediatorModule = require('skeleton/modules/mediator/news');

exports.install = function() {
  window.Global.module('viewPool', ViewPollModule);
  window.Global.module('router', RouterModule);
  window.Global.module('oauth', OAuthModule);
  window.Global.module('polling', PollingModule);
  window.Global.module('ui', UIModule);
  window.Global.module('data', DataModule);
  window.Global.module('sync', SyncModule);
  window.Global.module('m', MediatorModule);
  window.Global.module('inputMonitor', InputMonitorModule);
  window.Global.module('setting', SettingModule);
  window.Global.module('validator', ValidatorModule);
  window.Global.module('globalFunc', GlobalFuncModule);


  window.Global.module('ui.menu', MenuModule);
  window.Global.module('ui.loader', LoaderModule);
  window.Global.module('ui.dialog', DialogModule);
  window.Global.module('ui.notification', NotificationModule);
  window.Global.module('ui.insideLetter', InsideLetterModule);

  window.Global.module('m.message', MessageMediatorModule);
  window.Global.module('m.news', NewsMediatorModule);
  window.Global.module('m.oauth', OauthMediatorModule);
  // window.Global.module('m.rainActivity', RainActivityModule);
  // window.Global.module('m.driftActivity', DriftActivityModule);
};

define(function(require, exports, module) {

  var MediatorModule = require('skeleton/modules/mediator');
  var UIModule = require('skeleton/modules/ui');
  var DataModule = require('skeleton/modules/data');
  var RouterModule = require('skeleton/modules/router');
  var AuthorityModule = require('skeleton/modules/authority');
  var SettingModule = require('skeleton/modules/setting');

  var ScrollToTopModule = require('skeleton/modules/ui/scrollToTop');
  var AudioModule = require('skeleton/modules/audio');
  var SidemenuModule = require('skeleton/modules/ui/sidemenu');
  var SyncModule = require('skeleton/modules/sync');
  var OAuthModule = require('skeleton/modules/oauth');
  var LoaderModule = require('skeleton/modules/ui/loader');
  var NotificationModule = require('skeleton/modules/ui/notification');
  var DialogModule = require('skeleton/modules/ui/dialog');
  var PollingModule = require('skeleton/modules/polling');
  var ViewPollModule = require('skeleton/modules/viewPool');

  var NoticeMediatorModule = require('skeleton/modules/mediator/notice');

  exports.install = function() {
    window.Global.module('viewPool', ViewPollModule);
    window.Global.module('router', RouterModule);
    window.Global.module('oauth', OAuthModule);
    window.Global.module('polling', PollingModule);
    window.Global.module('ui', UIModule);
    window.Global.module('data', DataModule);
    window.Global.module('sync', SyncModule);
    window.Global.module('authority', AuthorityModule);
    window.Global.module('setting', SettingModule);
    window.Global.module('audio', AudioModule);
    window.Global.module('m', MediatorModule);

    window.Global.module('m.notice', NoticeMediatorModule);

    window.Global.module('ui.scrollToTop', ScrollToTopModule);
    window.Global.module('ui.sidemenu', SidemenuModule);
    window.Global.module('ui.loader', LoaderModule);
    window.Global.module('ui.notification', NotificationModule);
    window.Global.module('ui.dialog', DialogModule);

    //ZeroClipboard.config({swfPath: 'http://localhost:8080/apps/forehead/assets/ZeroClipboard.swf'});
  };

});
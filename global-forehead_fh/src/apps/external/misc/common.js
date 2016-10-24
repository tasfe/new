require('base/build.base');

window.Global = new window.Base.Application();
var UIModule = require('skeleton/modules/ui');
var DialogModule = require('skeleton/modules/ui/dialog');
var NotificationModule = require('skeleton/modules/ui/notification');
var SyncModule = require('skeleton/modules/sync');
var OAuthModule = require('skeleton/modules/oauth');
var OauthMediatorModule = require('skeleton/modules/mediator/oauth');
var MediatorModule = require('skeleton/modules/mediator');

window.Global.module('ui', UIModule);
window.Global.module('ui.dialog', DialogModule);
window.Global.module('ui.notification', NotificationModule);
window.Global.module('sync', SyncModule);
window.Global.module('oauth', OAuthModule);
window.Global.module('m', MediatorModule);
window.Global.module('m.oauth', OauthMediatorModule);

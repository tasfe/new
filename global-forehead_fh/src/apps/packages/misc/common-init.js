require('./minor-page-common.scss');

window.Global = new window.Base.Application();
var UIModule = require('skeleton/modules/ui');
var DialogModule = require('skeleton/modules/ui/dialog');
var NotificationModule = require('skeleton/modules/ui/notification');
var SyncModule = require('skeleton/modules/sync');
var OAuthModule = require('skeleton/modules/oauth');
var OauthMediatorModule = require('skeleton/modules/mediator/oauth');
var ValidatorModule = require('skeleton/modules/validator');
var MediatorModule = require('skeleton/modules/mediator');

window.Global.module('ui', UIModule);
window.Global.module('ui.dialog', DialogModule);
window.Global.module('ui.notification', NotificationModule);
window.Global.module('sync', SyncModule);
window.Global.module('oauth', OAuthModule);
window.Global.module('validator', ValidatorModule);
window.Global.module('m', MediatorModule);
window.Global.module('m.oauth', OauthMediatorModule);

if (window.ParsleyConfig) {
  window.ParsleyConfig.errorsWrapper = '<div class="js-pf-val-special-wrapper val-error-wrapper">&nbsp;</div>';
  window.ParsleyConfig.errorTemplate =  '<div class="val-error-temp text-danger "></div>';
  window.ParsleyConfig.trigger = 'change';
}

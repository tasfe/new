"use strict";

var SyncModule = Base.Module.extend({

  startWithParent: false,

  xhrList: [],

  login: true,

  initialize: function() {
    var self = this;
    //备份jquery的ajax方法
    var _ajax = $.ajax;

    //重写jquery的ajax方法
    this._ajax = $.ajax = function(url, options) {
      var ajaxOptions = {};
      var prevSameXhr;
      var currentXhr;

      var sign;

      if ( typeof url === "object" ) {
        ajaxOptions = url;
      }

      _.defaults(ajaxOptions, {
        type: 'POST',
        abort: true,
        dataType: 'json',
        autoLogout: true
      });

      _.extend(ajaxOptions, options);

      if (ajaxOptions.abort) {
        prevSameXhr = self.xhrList[ajaxOptions.url];

        //前一个重复请求存在并且还未完成时，阻止请求
        if (prevSameXhr && prevSameXhr.readyState !== 4) {
          prevSameXhr.abort();
        }
      }

      if (ajaxOptions.tradition) {
        _(ajaxOptions.data).each(function(reqData, reqName, data) {
          if (_(reqData).isArray()) {
            _(reqData).each(function(val, index) {
              if (_(val).isObject()) {
                _(val).each(function(value, prop) {
                  data[reqName + '[' + index + '].' + prop] = value;
                });
              } else {
                data[reqName + '[' + index + ']'] = val;
              }
            });

            delete data[reqName];
          }
        });
      }

      if ((_.isEmpty(ajaxOptions.data) || _.isObject(ajaxOptions.data)) && _.isEmpty(ajaxOptions.files)) {
        ajaxOptions.data = _.extend({
          token: Global.cookieCache.get('token'),
          device: 0 // 设备：0PC，1Android，2IOS，3H5
        }, ajaxOptions.data);
      } else {
        ajaxOptions.url += '?token=' + Global.cookieCache.get('token') || '';
      }

      if (ajaxOptions.localCache && ajaxOptions.cacheName) {
        sign = Global.localCache.get(ajaxOptions.cacheName);

        if (sign) {
          _.extend(ajaxOptions.data, {
            sign: sign
          });
        }

        if (ajaxOptions.success) {
          ajaxOptions.success = [localCacheCb, ajaxOptions.success];
        } else {
          ajaxOptions.success = localCacheCb;
        }
      }

      function localCacheCb(res, textStatus, jqXhr) {
        if (res.sign && res.sign === sign) {
          _(jqXhr.responseJSON).extend(Global.localCache.get(sign));
        } else if (res && res.result === 0 && res.sign && res.root) {
          if (sign) {
            Global.localCache.clear(sign);
          }
          Global.localCache.set(ajaxOptions.cacheName, res.sign);
          Global.localCache.set(res.sign, res);
        }
      }

      currentXhr = _ajax(ajaxOptions, options);

      if (ajaxOptions.abort) {
        self.xhrList[ajaxOptions.url] = currentXhr;
      }

      currentXhr.fail(function(xhr, resType, type) {
        if (resType === 'error') {
          if (type === 'Unauthorized') {
            if (!_(ajaxOptions.data.token).isEmpty()) {

              self.login = false;

              Global.ui.notification.show('您的账户已登出,请重新登录！', {
                event: function() {
                  window.location.href = 'login.html';
                }
              });
            } else {
              if (ajaxOptions.autoLogout) {
                window.location.href = 'login.html';
              }
            }
          } else {
            //Global.ui.notification.show('网络不给力，请稍后再试。');
          }
        }
      });

      if (!self.login) {
        currentXhr.abort();
      }

      return currentXhr;
    };
  },

  setLogout: function() {
    this.login = false;
    Global.cookieCache.clear('token');
  },

  ajax: function() {
    return this._ajax.apply(this._ajax, arguments);
  }
});

module.exports = SyncModule;

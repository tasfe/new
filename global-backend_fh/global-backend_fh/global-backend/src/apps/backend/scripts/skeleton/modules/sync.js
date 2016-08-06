define(function(require, exports, module) {

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

        NProgress.start();

        if ( typeof url === "object" ) {
          ajaxOptions = url;
        }

        _.defaults(ajaxOptions, {
          type: 'POST',
          abort: true,
          dataType: 'json',
          xhr: function(){
            var xhr = jQuery.ajaxSettings.xhr();

            xhr.onreadystatechange = function() {
              NProgress.set(_(xhr.readyState).div(5));
            };

            return xhr;
          }
        });

        _.defaults(ajaxOptions, options);

        if (ajaxOptions.abort) {
          prevSameXhr = self.xhrList[ajaxOptions.url];

          //前一个重复请求存在并且还未完成时，阻止请求
          if (prevSameXhr && prevSameXhr.readyState !== 4) {
            prevSameXhr.abort();
          }
        }

        //if (showLoading) {
        //  ajaxOptions.always = function() {
        //    Global.ui.loader.hide();
        //    ajaxOptions.always && ajaxOptions.always(arguments[0]);
        //  };
        //}

        /*
         ajaxOptions.error = function() {
         Global.ui.notification.show('服务端异常', {
         group: 'alert-danger'
         });
         ajaxOptions.error && ajaxOptions.error(arguments[0]);
         };
         */

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
            token: Global.cookieCache.get('back_token')
          }, ajaxOptions.data);
        } else {
          ajaxOptions.url += '?token=' + Global.cookieCache.get('back_token') || '';
        }

        currentXhr = _ajax(ajaxOptions, options);

        currentXhr.always(function() {
          NProgress.done();
        });

        if (ajaxOptions.abort) {
          self.xhrList[ajaxOptions.url] = currentXhr;
        }

        currentXhr.fail(function(xhr, resType, type) {
          if (resType === 'error') {
            if (type === 'Unauthorized') {
              if (self.login) {
                if (!_(ajaxOptions.data.token).isEmpty()) {

                  self.login = false;

                  Global.ui.notification.show('您的账户已登出,请重新登录！');
                  _.delay(function() {
                    window.location.href = 'login.html';
                  }, 2000);
                } else {
                  window.location.href = 'login.html';
                }
              }
            } else {
              Global.ui.notification.show('服务器异常，请稍后再试。');
            }
          }
        });

        if (!self.login) {
          currentXhr.abort();
        }

        return currentXhr;
      }
    },

    ajax: function() {
      return this._ajax.apply(this._ajax, arguments);
    }

    //ajax: function(options, showLoading) {
    //
    //  if (showLoading) {
    //    Global.ui.loader.show();
    //  }
    //
    //
    //  currentXhr = $.ajax(ajaxOptions);
    //  if (options.abort) {
    //    this.xhrList[options.url] = currentXhr;
    //  }
    //  return currentXhr;
    //}

  });

  module.exports = SyncModule;

});
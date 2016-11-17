"use strict";

var NewsMediatorModule = Base.Module.extend({

  startWithParent: false,

  interval: 15000,

  login: true,

  onStart: function() {
    var self = this;

    _.delay(function() {
      Global.polling.start('oauth:request', function() {
        self.check()
          .always(function() {
            Global.polling.next('oauth:request', {
              interval: self.interval
            });
          });
      });
    }, this.interval);
  },

  check: function(options) {
    var self = this;
    var oauthXhr = Global.oauth.check(options)
      .done(function(res) {
        var prevAcctInfo = Global.memoryCache.get('acctInfo');
        var acctInfo = res.root || {};

        acctInfo.fBalance = _(acctInfo.balance).convert2yuan();
        acctInfo.fLastLoginTime = _(acctInfo.lastLoginTime).toTime();
        acctInfo.fLoginTime = _(acctInfo.loginTime).toTime();


        if (self.login && acctInfo.outTime && acctInfo.outTime !== 0) {
          self.autoLogoutCountdown(acctInfo.outTime);
        }

        Global.memoryCache.set('acctInfo', _(prevAcctInfo || {}).extend(acctInfo));

        self.login = false;
      });

    var agXhr = Global.sync.ajax({
      url: '/acct/login/agBalance.json'
    })
      .done(function(res) {
        if (res && res.result === 0) {
          var acctInfo = Global.memoryCache.get('acctInfo');
          if (acctInfo) {
            acctInfo.agBalance = _(res.root || 0).convert2yuan();

            Global.memoryCache.set('acctInfo', acctInfo);

          }
        }
      });

    $.when(oauthXhr, agXhr).done(function() {
      Global.m.publish('acct:updating', Global.memoryCache.get('acctInfo'));
    });

    this._checkUserIsEffective(oauthXhr);

    return oauthXhr;
  },

  autoLogoutCountdown: function(time) {
    var timer;

    if (window.Global.appRouter) {
      window.Global.appRouter.on('route', function() {
        clearTimeout(timer);
        timer = _.delay(_autoLogoutCountdown, time * 1000 * 60);
      });
    }

    function _autoLogoutCountdown() {
      //Global.sync.setLogout();
      //Global.ui.notification.show('由于您长时间未操作，系统自动为您退出登录！', {
      //  event: function() {
      //    window.location.href = 'login.html';
      //  }
      //});
    }
  },

  _checkUserIsEffective: function(oauthXhr) {
    oauthXhr.done(function(res) {
      if (!res || res.result !== 0 || _([101, 103, 104, 105, 106]).indexOf(res.root.status) !== -1) {
        Global.ui.notification.show('账号状态异常！', {
          event: function() {
            window.location.href = 'login.html';
          }
        });
      }
    });
  },

  onStop: function() {
    Global.polling.stop('oauth:request');
  }
});

module.exports = NewsMediatorModule;

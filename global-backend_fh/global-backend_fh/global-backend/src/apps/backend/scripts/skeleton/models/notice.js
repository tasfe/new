define(function (require, exports, module) {

  var Model = require('skeleton/model');

  var NoticeModel = Model.extend({

    defaults: {
      monitor: 0,
      exBetting: 0,
      withdraw: 0,
      exWithdraw: 0,
      manualOp: 0,

      list: []
    },

    initialize: function() {
      var config = {
        monitor: {
          id: 1,
          bg: 'warning',
          icon: 'warning',
          tip: '$1条新的奖期监控',
          audio: 'bonus.mp3',
          router: 'bc/lm'
        },
        exBetting: {
          id: 2,
          bg: 'danger',
          icon: 'bolt',
          tip: '$1条新的异常投注',
          audio: 'bet.mp3',
          router: 'bc/ac'
        },
        withdraw: {
          id: 3,
          bg: 'success',
          icon: 'plus',
          tip: '$1条新的正常提现',
          audio: 'withdraw.mp3',
          router: 'fc/nw'
        },
        exWithdraw: {
          id: 4,
          bg: 'danger',
          icon: 'bolt',
          tip: '$1条新的异常提现',
          audio: 'abnormal-withdraw.mp3',
          router: 'fc/aw'
        },
        manualOp: {
          id: 5,
          bg: 'success',
          icon: 'plus',
          tip: '$1条新的人工审核',
          audio: 'money.mp3',
          router: 'fc/mc'
        }
      };

      this.on('change:monitor change:exBetting change:withdraw change:exWithdraw change:manualOp', function() {
        var changeList = this.pick('monitor', 'exBetting', 'withdraw', 'exWithdraw', 'manualOp');
        var list = this.get('list');
        var newList = [];
        var hasNew = false;

        _(changeList).each(function(num, prop) {
          var info = config[prop];
          if (num !== 0) {
            hasNew = true;
            newList.push({
              name: prop,
              id: info.id,
              bg: info.bg,
              icon: info.icon,
              router: info.router,
              audio: info.audio,
              content: info.tip.replace('$1', num)
            });

            this.set(prop, 0, {
              silent: true
            });
          }
        }, this);

        list = newList.concat(list);

        this.set({
          hasNew: hasNew,
          newList: newList,
          list: list
        });
      });
    },

    read: function(id) {
      var list = this.get('list');
      list = _(list).filter(function(info) {
        return info.id !== id;
      });

      this.set('list', list);
    }
  });

  module.exports = NoticeModel;
});
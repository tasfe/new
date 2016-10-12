"use strict";

require('./quotaTransfer.scss');

var QuotaTransferView = Base.ItemView.extend({

  template: require('./quotaTransfer.html'),

  className: '',

  events: {
    'blur .js-ac-subRebate': 'inputRebateHandler',
    'click .js-ac-submit': 'submitQuotaHandler'
  },

  initialize: function() {
    this.acctInfo = Global.memoryCache.get('acctInfo');
  },

  serializeData: function() {
    return {
      currentLevel: this.getUserGroupLevel(this.acctInfo.userGroupLevel, this.acctInfo.userRebate, this.acctInfo.parentRebate)
      + _(this.acctInfo.userRebate).formatDiv(10, {fixed: 1}),
      targetUsername: this.options.username,
      targetCurtLevel: this.getUserGroupLevel((Number(this.acctInfo.userGroupLevel) + 1), this.options.rebate) + _(this.options.rebate).formatDiv(10, {fixed: 1})
    };
  },

  onRender: function() {
    var data = this.options.data;
    if(data.userQuota.length > 0) {

      this._getTableQ(this.acctInfo.userGroupLevel, this.options.username, _(data.userQuota).map(function(item) {
        var dataQ = {};
        dataQ.userRebate = item.rebate;
        dataQ.userQuota = item.quota;
        dataQ.transfer = '';
        dataQ.subUserQuota = '/';

        _(data.subUserQuota).each(function(subItem, index) {
          if(item.rebate == subItem.rebate) {
            dataQ.userRebate = item.rebate;
            dataQ.userQuota = item.quota;
            dataQ.transfer = item.quota;
            dataQ.subUserQuota = subItem.quota;
          }
        });
        return dataQ
      }));
    }
  },

  getUserGroupLevel: function(level, rebate, parentRebate) {
    var levelName = '';
    var acctInfo = this.acctInfo;

    if (level === 0) {
      levelName = '招商';
    } else if (level === 1) {
      levelName = '直属';
    } else if (level === 2 && rebate === 128) {
      levelName = '总代';
    } else if (rebate === parentRebate) {
      levelName = '平级';
    } else {
      levelName = '代理';
    }

    // if(rebate < 12.8) {
    //   levelName = '代理';
    //   if((parentRebate && (parentRebate == rebate)) || !parentRebate && (_(acctInfo.userRebate).formatDiv(10) == rebate)) {
    //     levelName = '平级';
    //   }
    // } else {
    //   if(level == 4) {
    //     levelName = '平级';
    //   } else {
    //     levelName = '代理';
    //   }
    // }

    return levelName;
  },

  _getTableQ: function(levelName, name, tableInfo) {
    var self = this;
    this.$('.js-ac-quota-edit-container').staticGrid({
      tableClass: 'table table-bordered table-center',
      colModel: [
        {
          label: '账号层级', name: 'userRebate', width: '20%', formatter: function(val) {
          return self.getUserGroupLevel((Number(levelName) + 1), _(val).formatDiv(10)) + '<span class="js-quota-submit-d">' + _(val).formatDiv(10, {fixed: 1}) + '</span>';
        }
        },
        {
          label: '我的剩余配额', name: 'userQuota', width: '25%', formatter: function(val) {
            return '<span class="js-ac-quota-rest" data-origin-val="' + val + '">' + val + '</span>';
          }
        },
        {
          label: '转移数量', name: 'transfer', width: '20%', formatter: function(val, index, info) {
          if(val) {
            return '<input type="text" class="js-ac-subRebate input-xs text-center" value="0"' +
              ' data-parsley-oneDecimal data-parsley-range="[0,' + val + ']"> ';
          } else {
            return '<input type="text" class="input-xs invisible" disabled />';
          }
        }
        },
        {
          label: name + '的剩余配额', name: 'subUserQuota', width: '25%', formatter: function(val) {
          return '<span class="js-ac-quota-last ' + (val !== '/' ? 'js-usable' : '') + '" data-origin-val="' + val + '">' + val + '</span>';
        }
        }
      ],
      row: tableInfo
    });
  },

  submitQuotaHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

    $target.button('loading');

    var quota = [];
    var i = 0;
    var submitEle = this.$('.js-gl-static-tr');

    _(submitEle).each(function(item) {
      var submitRes = $(item).find('.js-ac-quota-last');
      if(Number($(item).find('.js-ac-subRebate').val()) > 0) {
        quota[i] = {
          'rebate': _(Number($(item).find('.js-quota-submit-d').text())).formatMul(10),
          'quota': submitRes.text(),
          'num': $(item).find('.js-ac-subRebate').val()
        };
        i++;
      }

    });

    if(quota.length > 0) {
      var temp = [];
      var temp2 = [];
      var data = {};

      for(i in quota) {
        temp[i] = 'quota[' + i + '].rebate';
        temp2[i] = 'quota[' + i + '].quota';
        data[temp[i]] = quota[i].rebate;
        data[temp2[i]] = quota[i].num;
      }

      data.userId = this.options.userId;

      Global.sync.ajax({
        url: '/acct/subaccount/quotatransfer.json',
        data: data
      }).always(function() {
        $target.button('reset');
      })
        .done(function(res) {
          if(res && res.result === 0) {
            var contentInner = '';
            for(var i in quota) {
              contentInner += '<div class="quota-result">' + quota[i].num + '</span>个' + self.getUserGroupLevel(self.acctInfo.userGroupLevel, _(quota[i].rebate).formatDiv(10)) + _(quota[i].rebate).formatDiv(10, {fixed: 1}) + '</div>';
            }

            var content = '<div class="text-hot border-bottom p-bottom-xs m-bottom-xs">您已成功转给' + self.options.username + '配额 </div>' +
              '<div class="quota-results">' + contentInner + '</div>';
            Global.ui.notification.show(content, {
              type: 'success',
              modalClass: 'llm-notification-quota',
              bodyClass: 'text-center font-sm'
            });
            self.trigger('submit:complete');
          } else {
            Global.ui.notification.show(res.msg);
          }
        });
    } else {
      if(this.$('.js-ac-quota-last.js-usable').length == 0) {
        Global.ui.notification.show('当前无可转移配额');
      } else {
        Global.ui.notification.show('请填写转移配额的数量');
      }
      $target.button('reset');
    }
  },

  inputRebateHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var range = $target.data('parsley-range');
    var rebate = Number($target.val());
    if(rebate !== '' && _(rebate).isFinite() && range.length == 2) {
      if(rebate < range[0]) {
        $target.val(range[0]);
      } else if(rebate > range[1]) {
        $target.val(range[1]);
      }
    } else {
      $target.val(range[0]);
    }

    var $rest = $target.parents('.js-gl-static-tr').find('.js-ac-quota-rest');
    var $last = $target.parents('.js-gl-static-tr').find('.js-ac-quota-last');

    rebate = Number($target.val());

    $rest.html($rest.data('originVal') + (rebate > 0 ? ' <span class="text-hot">- ' + $target.val() + '</span>' : ''));

    $last.html($last.data('originVal') + (rebate > 0 ? ' <span class="text-info">+ ' + $target.val() + '</span>' : ''));

    var $maxBonus = $target.parent().parent().parent().find('.js-ac-openAccount-maxBonus');

    _($maxBonus).each(function(item) {
      var $item = $(item);
      var maxBonus = $item.data('maxbonus');
      var ticketName = $item.data('name');
      $item.html(self.calculateMaxBonus(ticketName, rebate, maxBonus));
    });
  }
});

module.exports = QuotaTransferView;
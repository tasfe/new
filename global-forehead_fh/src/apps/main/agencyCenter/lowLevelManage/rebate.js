"use strict";

// require('./quotaTransfer.scss');

var RebateView = Base.ItemView.extend({

  template: require('./rebate.html'),

  className: '',

  events: {
    'blur .js-ac-subRebate': 'inputRebateHandler',
    'click .js-ac-submit': 'submitRebateHandler'
  },

  initialize: function() {
  },

  serializeData: function() {
  },

  onRender: function() {
    var data = this.options.data;

    var strTips = '';
    if(data.quotaList != null) {
      strTips = '温馨提示：您目前拥有';
      _.each(data.quotaList, function(quota) {
        strTips += _(quota.quotaLevel).formatDiv(10, {fixed: 1}) + '配额 <span class="text-hot">' + quota.quotaLimit + '</span> 个，'
      });

      this.$('.js-tips').html(strTips.substring(0, strTips.length - 1));
      this.$('.js-tips').removeClass('hidden');
    }

    this._getTable(_(data.seriesList.ticketSeriesList).map(function(ticketSeries) {
      return {
        sericeName: ticketSeries.sericeName,
        maxBonus: _(ticketSeries.maxBonus).convert2yuan(),
        subAcctRebate: data.seriesList.subRebateRange.subAcctRebate,
        maxRebate: data.seriesList.subRebateRange.rebateMax,
        minRebate: data.seriesList.subRebateRange.rebateMin
      };
    }));
  },

  _getTable: function(tableInfo) {
    var self = this;
    this.$('.js-ac-rebate-edit-container').staticGrid({
      tableClass: 'table table-bordered table-center',
      colModel: [
        {
          label: '彩种系列', name: 'sericeName', width: '25%'
        },
        {
          label: '最高奖金（元模式）', name: 'maxBonus', width: '25%', formatter: function(val, index, info) {
          return '<span class="js-ac-openAccount-maxBonus" data-maxBonus="' + val + '" data-name="' + info.sericeName + '">'
            + self.calculateMaxBonus(info.sericeName, _(info.subAcctRebate).formatDiv(10), val) + '</span>';
        }},
        {
          label: '下级返点', name: 'subAcctRebate', merge: true, formatter: function(val, index, info) {
          //val对应该行数据中与name同名的对应变量的值，此处具体为info.subAcctRebate的值，info表示此行的值
          return '<input type="text" class="js-ac-subRebate" value="' + _(val).formatDiv(10) +
            '" data-parsley-oneDecimal data-parsley-range="[' + _(val).formatDiv(10) + ',' +
            _(info.maxRebate).formatDiv(10, {fixed: 1}) + ']"> % 可配置范围(' +
            _(val).formatDiv(10) + '～' + _(info.maxRebate).formatDiv(10, {fixed: 1}) + ')';
        }}
      ],
      row: tableInfo
    });
  },

  calculateMaxBonus: function(ticketName,rebate,maxBonus){
    var baseNum = 20;
    if(ticketName === '十一选五'){
      baseNum = 19.8;
    }
    return _(_(Number(maxBonus)).add(_(baseNum).formatMul(rebate,{fixed:4})).toFixed(4)).add(0);
  },

  inputRebateHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var range = $target.data('parsley-range');
    var rebate = Number($target.val());
    if (rebate !== '' && _(rebate).isFinite() && range.length == 2) {
      if (rebate < range[0]) {
        $target.val(range[0]);
      } else if (rebate > range[1]) {
        $target.val(range[1]);
      }
    } else {
      $target.val(range[0]);
    }
    rebate = Number($target.val());
    var $maxBonus = $target.parent().parent().parent().find('.js-ac-openAccount-maxBonus');
    _($maxBonus).each(function(item, index) {
      var $item = $(item);
      var maxBonus = $item.data('maxbonus');
      var ticketName = $item.data('name');
      $item.html(self.calculateMaxBonus(ticketName, rebate, maxBonus));
    });
  },

  submitRebateHandler: function(e) {
    var $target = $(e.currentTarget);
    var self = this;
    $target.button('loading');
    Global.sync.ajax({
      url: '/acct/subaccount/modifySubAcctRebate.json',
      data: {
        subAcctId: this.options.userId,
        subAcctRebate: _(this.$('.js-ac-subRebate').val()).formatMul(10)
      }
    }).always(function() {
      $target.button('reset');
    }).fail(function() {
      //  Global.ui.notification.show(res.root);
    })
      .done(function(res) {
        if (res && res.result === 0) {
          Global.ui.notification.show('保存成功', {
            type: 'success'
          });
          self.trigger('submit:complete');
        } else {
          Global.ui.notification.show(res.msg);
        }
      });
  }
});

module.exports = RebateView;
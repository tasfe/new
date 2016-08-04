define(function(require, exports, module) {

  var ConfigView = Base.ItemView.extend({

    template: require('text!./config.html'),

    events: {
      'submit .js-form': 'saveHandler',
      'click .js-hc-btn-reset': 'resetHandler'
    },

    initialize: function() {
      this.lastIndex = 0;
    },
    //发送请求
    getConfigXhr: function() {
      return Global.sync.ajax({
        url: '/intra/activitymanage/upgradecfgdetail.json',
        data: {
          activityId: 15
        }
      });
    },

    saveConfigXhr: function(data) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/saveupgradecfg.json',
        data: _(data).extend({
          activityId: 15
        })
      })
    },

    onRender: function() {
      new Global.Prefab.Timeset({
        el: this.$('.js-hc-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();

      this.$form = this.$('.js-form');
      this.$form.parsley();

      this._loadPage('js-hc-cfgDetail');
    },

    _loadPage: function(classValue) {
      var self = this;
      this.getConfigXhr()
        .done(function(res) {
        if (res.result === 0) {
          if (res.root) {
            self.$('.js-start-time').val(_(res.root.fromDate).toTime());
            self.$('.js-end-time').val(_(res.root.endDate).toTime());
            self.$('[name=rebate]').val(_(res.root.rebate).formatDiv(10));

            _(res.root.itemList).each(function(info, index) {
              self.$('[name="itemList[' + (info.type - 1) + '].minSales"]').val(_(info.minSales).convert2yuan());
              self.$('[name="itemList[' + (info.type - 1) + '].maxSales"]').val(_(info.maxSales).convert2yuan());
              self.$('[name="itemList[' + (info.type - 1) + '].upBonus"]').val(_(info.upBonus).convert2yuan());
              self.$('[name="itemList[' + (info.type - 1) + '].curBonus"]').val(_(info.curBonus).convert2yuan());
            });
          } else {
            self._getTable([], classValue);
          }
        } else {
          Global.ui.notification.show(res.msg);
        }
      });
    },
    //获取表格
    _getTable: function(tableInfo, classValue) {
      this.staticGrid = this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '销量', name: 'formatBetAmount', width: 120},
          {label: '奖金金额（元）', name: 'formatBonus', width: 120},
          {label: '抽奖次数', name: 'formatLotteryTimes', width: 120}
        ],
        emptyTip: false,
        row: tableInfo
      }).staticGrid('instance');

    },
    saveHandler: function(e) {
      var self = this;
      var $target = $(e.currentTarget);

      var $submitBtn = $target.find('[type=submit]');

      $submitBtn.button('loading');

      this.saveConfigXhr(_($target.serializeArray()).serializeObject())
        .always(function() {
          $submitBtn.button('reset');
        })
        .done(function(res) {
          if (res && res.result === 0) {
            Global.ui.notification.show('操作成功。');
            self.render();
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
    },

    resetHandler: function(e) {
      this.render();
    }
  });
  module.exports = ConfigView;
});
define(function(require, exports, module) {

  var ConfigView = Base.ItemView.extend({

    template: require('text!./config.html'),

    events: {
      'click .js-hc-add': 'addHandler',
      'click .js-hc-del': 'delHandler',
      'submit .js-form': 'saveHandler',
      'click .js-hc-btn-reset': 'resetHandler'
    },

    initialize: function() {
      this.lastIndex = 0;
    },
    //发送请求
    getConfigXhr: function() {
      return Global.sync.ajax({
        url: '/intra/activitymanage/talentcfgdetail.json',
        data: {
          activityId: 14
        }
      });
    },

    saveConfigXhr: function(data) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/savetalentcfg.json',
        data: _(data).extend({
          activityId: 14
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
            self.$('[name=salesTimes]').val(res.root.salesTimes);
            self._getTable(self._formatCfgData(res.root.salesList), classValue);

            _(res.root.lotteryList).each(function(info, index) {
              self.$('[name="lotteryList[' + index + '].bonus"]').val(_(info.bonus).convert2yuan());
              self.$('[name="lotteryList[' + index + '].lotteryRate"]').val(info.lotteryRate);
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
    //格式化数据
    _formatCfgData: function(cfgs) {
      var self = this;
      this.lastIndex = cfgs.length;

      return _(cfgs).chain().map(function(cfg, index) {
          return self._formatRow(cfg, index);
        }
      ).flatten().value();
    },

    _formatRow: function(cfg, index) {
      var rowInfo = {};

      if (_(index).isUndefined()) {
        index = this.lastIndex;
      }

      rowInfo.formatBetAmount = '<input type="text" name="salesList[' + index + '].betAmount" class="form-control" required ';
      if (cfg) {
        rowInfo.formatBetAmount += 'value="' + _(cfg.betAmount).formatDiv(10000) + '"';
      }
      rowInfo.formatBetAmount += 'data-parsley-range="[0, 10000000]" data-parsley-threeDecimal required>';

      rowInfo.formatBonus = '<input type="text" name="salesList[' + index + '].bonus" class="form-control" required ';
      if (cfg) {
        rowInfo.formatBonus += 'value="' + _(cfg.bonus).formatDiv(10000) + '"';
      }
      rowInfo.formatBonus += 'data-parsley-range="[0, 10000000]" data-parsley-threeDecimal required>';

      rowInfo.formatLotteryTimes = '<input type="text" name="salesList[' + index + '].lotteryTimes" class="form-control" required ';
      if (cfg) {
        rowInfo.formatLotteryTimes += 'value="' + cfg.lotteryTimes + '"';
      }
      rowInfo.formatLotteryTimes += 'data-parsley-range="[0, 100]" data-parsley-type="integer" required>' +
      '<button class="js-hc-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>';

      return rowInfo;
    },

    addHandler: function() {
      this.staticGrid.addRows([this._formatRow()]);
      this.lastIndex++;
    },

    delHandler: function(e) {
      var $target = $(e.currentTarget);
      this.staticGrid.delRow($target);
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
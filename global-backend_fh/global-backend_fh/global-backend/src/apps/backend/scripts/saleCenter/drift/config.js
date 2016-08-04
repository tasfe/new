define(function (require, exports, module) {

  var bonusTypeConfig = require('./bonusType');

  var ConfigView = Base.ItemView.extend({

    template: require('text!./config.html'),

    events: {
      'click .js-hc-add': 'addHandler',
      'click .js-hc-del': 'delHandler',
      'click .js-hc-btn-submit': 'saveRainCfgHandler',
      'click .js-hc-btn-reset':'resetRainCfgHandler'
    },

    initialize: function() {
      this.lastIndex = 0;
    },

    //发送请求
    _getRedCfgData: function (params) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/bottlecfgdetail.json',
        //url: '/intra/activitymanage/raincfgdetail.json',
        data: params
      });
    },
    onRender: function () {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-hc-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();

      var activityId = 12;
      var params = {activityId: activityId};
      this._loadPage(params, 'js-hc-cfgDetail');
    },
    _loadPage: function (params, classValue) {
      var self = this;
      this._getRedCfgData(params).done(function (res) {
        if (res.result === 0) {
          if (res.root) {
            self.$('.js-start-time').val(_(res.root.fromDate).toTime());
            self.$('.js-end-time').val(_(res.root.endDate).toTime());
            self.$('.js-hc-rainMin').val(res.root.cycle);
            self.$('.js-hc-rainSec').val(res.root.duration);
            self.$('.js-hc-activityId').val(res.root.activityId);
            self.$('[name=bonus]').val(_(res.root.bonus).convert2yuan());
            self.$('[name=betlimit]').val(_(res.root.betlimit).convert2yuan());
            self._getTable(self._formatCfgData(res.root.itemList), classValue);
          } else {
            self._getTable([], classValue);
          }
        } else {
          Global.ui.notification.show(res.msg);
        }
      }).fail(function () {
      });
    },
    //获取表格
      _getTable: function (tableInfo, classValue) {
      this.staticGrid = this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '奖金金额', name: 'formatAmount', width: 100},
          {label: '漂流瓶个数', name: 'formatCount', width: 120},
          {label: '福字类型', name: 'type', width: 120}
        ],
        emptyTip: false,
        row: tableInfo
      }).staticGrid('instance');

      //this.staticGrid.addRows([{
      //  formatAmount: '总计',
      //  formatCount: _(tableInfo).reduce(function(count, info) {
      //    count += info.count;
      //    return count;
      //  }, 0)
      //}]);
    },
    //格式化数据
    _formatCfgData: function (cfgs) {
      var self = this;
      this.lastIndex = cfgs.length ;

      return _(cfgs).chain().map(function (cfg, index) {
          return self._formatRow(cfg, index);
        }
      ).flatten().value();
    },

    _formatRow: function(cfg, index) {
      rowInfo = {};
      if (_(index).isUndefined()) {
        index = this.lastIndex;
      }
      rowInfo.formatAmount = '<div><input type="text" name="itemList[' + index + '].amount" class="form-control" required style="width:150px;" ';
      if (cfg) {
        rowInfo.formatAmount += 'value="' + _(cfg.amount).formatDiv(10000) + '"';
      }
      rowInfo.formatAmount += 'data-parsley-range="[0, 10000]" data-parsley-threeDecimal required><label class="control-label">元</label></div>';

      rowInfo.formatCount = '<input type="text" name="itemList[' + index + '].count" class="form-control" style="width:150px;" required ';

      if (cfg) {
        rowInfo.formatCount += 'value="' + cfg.count + '"';
      }
      rowInfo.formatCount += 'data-parsley-range="[0, 10000]" data-parsley-threeDecimal required><label class="control-label">个</label>';

      rowInfo.type = '<select name="itemList[' + index + '].bonustype" class="form-control" style="width:150px;" required>';

      _(bonusTypeConfig.getAll()).each(function(typeInfo) {

        rowInfo.type += '<option value="' + typeInfo.id + '" ';
        if (cfg && cfg.bonustype === typeInfo.id) {
          rowInfo.type += 'selected';
        }
        rowInfo.type += '>' + typeInfo.name + '</option>';
      });

      rowInfo.type += '<select class="control-label m-right-sm"></select>' +
        '<button class="js-hc-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>';

      return rowInfo;
    },

    addHandler: function() {
      this.staticGrid.addRows([this._formatRow()], {
        eq: -2
      });
      this.lastIndex++;
    },

    delHandler: function(e) {
      var $target = $(e.currentTarget);
      this.staticGrid.delRow($target);
    },
    saveRainCfgHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-hc-rainCfg-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
          url: '/intra/activitymanage/savebottlecfg.json',
          data: _($currContainer.serializeArray()).serializeObject()
        })
          .always(function () {
            $target.button('reset');
          })
          .fail(function () {
            // 处理失败
          })
          .done(function (res) {
            if (res && res.result === 0) {
              Global.ui.notification.show('操作成功。');
              Global.appRouter.navigate(_('#sc/dc').addHrefArgs({_t: _.now()}), {
                trigger: true,
                replace: false
              });
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      } else {
        $target.button('reset');
      }
    },

    resetRainCfgHandler:function(e){
      this.render();
    }
  });
  module.exports = ConfigView;
});
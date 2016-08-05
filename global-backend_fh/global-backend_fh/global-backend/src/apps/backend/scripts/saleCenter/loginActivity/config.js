define(function(require, exports, module) {

  var deviceTypeConfig = require('skeleton/misc/deviceTypeConfig');

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
        url: '/intra/activitymanage/ioslogincfgdetail.json',
        data: {
          activityId: 12
        }
      });
    },

    saveConfigXhr: function(data) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/saveioslogincfg.json',
        data: data
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
            self._getTable(self._formatCfgData(res.root.itemList), classValue);
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
          {label: '奖金金额（元）', name: 'formatAmount', width: 120},
          {label: '奖励类型', name: 'type', width: 120}
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

      rowInfo.formatAmount = '<input type="text" name="itemList[' + index + '].bonus" class="form-control" required style="width:150px;" ';
      if (cfg) {
        rowInfo.formatAmount += 'value="' + _(cfg.bonus).formatDiv(10000) + '"';
      }
      rowInfo.formatAmount += 'data-parsley-range="[0, 10000]" data-parsley-threeDecimal required>';

      _(deviceTypeConfig.getAll()).each(function(typeInfo) {
        rowInfo.type += '<option value="' + typeInfo.id + '" ';
        if (cfg && cfg.deviceType === typeInfo.id) {
          rowInfo.type += 'selected';
        }
        rowInfo.type += '>' + typeInfo.zhName + '</option>';
      });

      rowInfo.type = '<select class="form-control" name="itemList[' + index + '].deviceType">' + rowInfo.type + '</select>' +
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
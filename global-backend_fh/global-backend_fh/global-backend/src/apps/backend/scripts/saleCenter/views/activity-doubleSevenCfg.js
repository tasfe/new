define(function(require, exports, module) {

  var ConfigView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/activity-doubleSevenCfg.html'),

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
        url: '/intra/activitymanage/doublesevencfgdetail.json',
        data: {
          activityId: 14
        }
      });
    },

    saveConfigXhr: function(data) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/savedoublesevencfg.json',
        data: _(data).extend({
          activityId: 23
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
              var confList = new Array();
              _(res.root.cfgList).map(function(cfgList, index) {
                _.map(_.range(cfgList.length), function(num) {
                  confList.push(cfgList[num]);
                })
              });
              self._getTable(self._formatCfgData(confList), classValue);

              _(res.root.bonusList).each(function(info, index) {
                self.$('[name="bonusList[' + index + '].type"]').val(info.type);
                self.$('[name="bonusList[' + index + '].minAmount"]').val(_(info.minAmount).convert2yuan());
                self.$('[name="bonusList[' + index + '].maxAmount"]').val(_(info.maxAmount).convert2yuan());
                self.$('[name="bonusList[' + index + '].outNum"]').val(info.outNum);
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
          {label: '活动条件', name: 'type', width: 120},
          {label: '起点金额（元）', name: 'minAmount', width: 120},
          {label: '领取数量', name: 'getNum', width: 120}
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

      rowInfo.type = '<select class="form-control"  name="confList[' + index + '].type"  required >';
      if(!cfg || cfg.type == 1) {
        rowInfo.type += '<option value="1" selected>当日充值</option><option value="2">当日投注</option><option value="3">单注投注</option>'
      }else if(cfg.type == 2){
        rowInfo.type += '<option value="1" >当日充值</option><option value="2" selected>当日投注</option><option value="3">单注投注</option>'
      }else if(cfg.type == 3){
        rowInfo.type += '<option value="1" >当日充值</option><option value="2">当日投注</option><option value="3" selected>单注投注</option>'
      }
      rowInfo.type += '</select>';

      rowInfo.minAmount = '<input type="text" name="confList[' + index + '].minAmount" class="form-control" required ';
      if (cfg) {
        rowInfo.minAmount += 'value="' + _(cfg.minAmount).formatDiv(10000) + '"';
      }
      rowInfo.minAmount += 'data-parsley-range="[0, 10000000]" data-parsley-threeDecimal required>';

      rowInfo.getNum = '<input type="text" name="confList[' + index + '].getNum" class="form-control" required ';
      if (cfg) {
        rowInfo.getNum += 'value="' + cfg.getNum + '"';
      }
      rowInfo.getNum += 'data-parsley-range="[0, 100]" data-parsley-type="integer" required>' +
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
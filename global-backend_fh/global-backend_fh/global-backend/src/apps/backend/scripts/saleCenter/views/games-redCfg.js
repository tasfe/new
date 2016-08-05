define(function (require, exports, module) {
  var RedCfgView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/games-redCfg.html'),

    events: {
      'click .js-hc-add': 'addHandler',
      'click .js-hc-del': 'delHandler',
      'click .js-hc-btn-submit': 'saveRainCfgHandler',
      'click .js-hc-btn-reset':'resetRainCfgHandler'
    },

    initialize: function () {
    },
  //发送请求
    _getRedCfgData: function (params) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/raincfgdetail.json',
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

      var activityId = 3;
      var params = {activityId: activityId};
      this._loadPage(params, 'js-hc-cfgDetail');
    },
    _loadPage: function (params, classValue) {
      var self = this;
      this._getRedCfgData(params).done(function (res) {
        if (res.result === 0) {
          self.$('.js-start-time').val(_(res.root.fromDate).toTime());
          self.$('.js-end-time').val(_(res.root.endDate).toTime());
          self.$('.js-hc-rainMin').val(res.root.cycle);
          self.$('.js-hc-rainSec').val(res.root.duration);
          self.$('.js-hc-activityId').val(res.root.activityId);
          self._getTable(self._formatCfgData(res.root.itemList), classValue);
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
          {label: '红包金额', name: 'formatAmount', width: 100},
          {label: '单词个数', name: 'formatCount', width: 120}
        ],
        emptyTip: false,
        row: tableInfo
      }).staticGrid('instance');

      this.staticGrid.addRows([{
        formatAmount: '总计',
        formatCount: _(tableInfo).reduce(function(count, info) {
          count += info.count;
          return count;
        }, 0)
      }]);
    },
    //格式化数据
    _formatCfgData: function (cfgs) {
      this.lastIndex = cfgs.length ;

      return _(cfgs).chain().map(function (cfg, index) {
          return {
            count: cfg.count,
            'formatAmount': '<div><input type="text" name="itemList[' + index + '].amount" class="js-hc-amount form-control" required style="width:150px;" value="' + _(cfg.amount).formatDiv(10000, {fixed: 0}) + '" data-parsley-range="[0, 10000]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
            'formatCount': '<input type="text" name="itemList[' + index + '].count" class="js-hc-count form-control" style="width:150px;" required value="'
            + cfg.count + '" data-parsley-range="[0, 10000]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">个</label>' +
            '<button class="js-hc-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
          }
        }
      ).flatten().value();

    },
    //组装错误提示框
    _getErrorMsg: function (text) {
      return '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '<i class="fa fa-times-circle m-right-xs"></i>' +
        '<strong>提示！</strong> ' + text +
        '</div>';
    },

    addHandler: function() {
      this.staticGrid.addRows([{
        'formatAmount': '<div><input type="text" name="itemList[' + this.lastIndex + '].amount" class="js-cj-amount form-control" required style="width:150px;" data-parsley-range="[0, 10000]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
        'formatCount': '<input type="text" name="itemList[' + this.lastIndex + '].count" class="js-hc-count form-control" style="width:150px;" data-parsley-range="[0, 10000]" data-parsley-type="integer" required">' +
        '<label class="control-label m-right-sm" style="margin-left: 20px;">个</label>' +
        '<button class="js-hc-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
      }], {
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
          url: '/intra/activitymanage/saveraincfg.json ',
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
              Global.appRouter.navigate(_('#sc/hc').addHrefArgs({_t: _.now()}), {
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
  module.exports = RedCfgView;
});
define(function (require, exports, module) {
  var lotteryCfgView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/bonusManager-manager.html'),

    events: {
      'click .js-cj-add': 'addHandler',
      'click .js-cj-del': 'delHandler',
      'click .js-cj-btn-submit': 'saveLotteryCfgHandler',
      'click .js-cj-btn-reset': 'resetLotteryCfgHandler'
    },
    initialize: function () {
    },
    //发送请求
    _getLotteryCfgData: function (params) {
      return Global.sync.ajax({
        url: '/intra/bonusmng/conf.json',
        data: params
      });
    },
    onRender: function () {
      var self = this;
      var params = {};
      this._loadPage(params, 'js-cj-cfgDetail');
    },
    _loadPage: function (params, classValue) {
      var self = this;
      this._getLotteryCfgData(params).done(function (res) {
        if (res.result === 0) {
          self._getTable(self._formatCfgData(res.root.masterItem), classValue);
        } else {
          Global.ui.notification.show(res.msg);
        }
      }).fail(function () {
      });
    },
    //获取表格
    _getTable: function (tableInfo, classValue) {
      this.staticGrid =this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '私返要求：日量标准（元/日） >=', name: 'amount', width: 100},
          {label: '私返比例', name: 'bonus', width: 120}
        ],
        emptyTip: false,
        row: tableInfo
      }).staticGrid('instance');
    },
    //格式化数据
    _formatCfgData: function (cfgs) {
      this.lastIndex = cfgs.length;
      return _(cfgs).chain().map(function (cfg, index) {
          return {
            'amount': '<div><input type="text" name="itemList[' + index + '].amount" class="form-control" required style="width:150px;" value="' + _(cfg.amount).formatDiv(10000, {fixed: 0}) + '" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
            'bonus': '<input type="text" name="itemList[' + index + '].bonus" class="form-control" style="width:150px;" required value="' + _(cfg.bonus).formatDiv(10000, {fixed: 4}) + '" data-parsley-range="[0, 100]" required><label class="control-label m-right-sm" style="margin-left: 20px;">%</label>'+
            '<button class="js-cj-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
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
    saveLotteryCfgHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-cj-lotteryCfg-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
            url: '/intra/bonusmng/saveconf.json',
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
              Global.appRouter.navigate(_('#sc/sf/conf').addHrefArgs({_t: _.now()}), {
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
    addHandler: function() {
      this.staticGrid.addRows([{
        'amount': '<div><input type="text" name="itemList[' + this.lastIndex + '].amount" class="form-control" required style="width:150px;" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
        'bonus': '<input type="text" name="itemList[' + this.lastIndex + '].bonus" class="form-control" style="width:150px;" data-parsley-range="[0, 100]"  required">' +
        '<label class="control-label m-right-sm" style="margin-left: 20px;">%</label>' +
        '<button class="js-cj-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
      }], {
        eq: -1
      });
      this.lastIndex++;
    },

    delHandler: function(e) {
      var $target = $(e.currentTarget);
      this.staticGrid.delRow($target);
    },
    resetLotteryCfgHandler:function(e){
      this.render();
    }


  });
  module.exports = lotteryCfgView;
});
define(function (require, exports, module) {
  var AgentWageCfgView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/games-agentWageCfg.html'),

    events: {
      'click .js-wc-add': 'addHandler',
      'click .js-wc-del': 'delHandler',
      'click .js-wc-btn-submit': 'saveAgentWageCfgHandler',
      'click .js-wc-btn-reset':'resetAgentWageCfgHandler',
      'change .js-wc-data-type': 'changeTypeHandler'
    },

    initialize: function () {
    },
    //发送请求
    _getRedCfgData: function (params) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/wagescfgdetail.json',
        data: params
      });
    },
    onRender: function () {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-wc-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();

      var activityId = 6;
      var params = {activityId: activityId};
      this._loadPage(params, 'js-wc-cfgDetail');
    },
    _loadPage: function (params, classValue) {
      var self = this;
      this._getRedCfgData(params).done(function (res) {
        if (res.result === 0) {
          self.$('.js-start-time').val(_(res.root.fromDate).toTime());
          self.$('.js-end-time').val(_(res.root.endDate).toTime());
          self.$('.js-wc-agentLevel').val(_(res.root.agentLevel).formatDiv(10));
          self.$('.js-wc-lossAmount').val(_(res.root.lossAmount).convert2yuan());
          self.$('.js-wc-activityId').val(res.root.activityId);
          self._getTable(self._formatCfgData(res.root.itemList), classValue);
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
          {label: '团队日销量≥', name: 'salesVolume', width: 100},
          {label: '活跃用户量≥', name: 'validUser', width: 120},
          {label: '奖励比例', name: 'wagesVal', width: 120}
        ],
        emptyTip: false,
        row: tableInfo
      }).staticGrid('instance');
    },
    //格式化数据
    _formatCfgData: function (cfgs) {
      this.lastIndex = cfgs.length;
      return _(cfgs).chain().map(function (cfg, index) {
          if(cfg.wagesType=="percent"){
            return {
              salesVolume: '<div><input type="text" name="itemList[' + index + '].salesVolume" class="form-control" required style="width:150px;" value="' + _(cfg.salesVolume).formatDiv(10000) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
              validUser: '<input type="text" name="itemList[' + index + '].validUser" class="form-control" required style="width:150px;" value="' + (cfg.validUser || '') + '" data-parsley-range="[0, 1000]" data-parsley-type="integer" required>',
              wagesVal: '<select class="js-wc-data-type form-control" style="margin-right:20px;" name="itemList[' + index + '].wagesType" ><option value="percent" selected>百分比</option><option value="fix">固定金额</option></select><input type="text" name="itemList[' + index + '].wagesVal" class="js-wc-wageVal form-control" style="width:150px;" data-parsley-range="[0, 100]" data-parsley-twoDecimal required value="' + _(cfg.wagesVal).formatDiv(100) + '"><label class="js-sc-wc-unit control-label m-right-sm" style="margin-left: 20px;">%</label>'+
              '<button class="js-wc-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
            }
          }
          if(cfg.wagesType=="fix"){
            return {
              salesVolume: '<div><input type="text" name="itemList[' + index + '].salesVolume" class="form-control" required style="width:150px;" value="' + _(cfg.salesVolume).formatDiv(10000) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
              validUser: '<input type="text" name="itemList[' + index + '].validUser" class="form-control" required style="width:150px;" value="' + (cfg.validUser || '') + '" data-parsley-range="[0, 1000]" data-parsley-type="integer" required>',
              wagesVal: '<select class="js-wc-data-type form-control" style="margin-right:20px;" name="itemList[' + index + '].wagesType"><option value="percent" >百分比</option><option value="fix" selected>固定金额</option></select><input type="text" name="itemList[' + index + '].wagesVal" class="js-wc-wageVal form-control" style="width:150px;" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required value="' + _(cfg.wagesVal).formatDiv(10000) + '"><label class="js-sc-wc-unit control-label m-right-sm" style="margin-left: 20px;">元</label>'+
              '<button class="js-wc-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
            }
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
    saveAgentWageCfgHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-wc-wageCfg-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
            url: '/intra/activitymanage/savewagescfg.json',
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
              Global.appRouter.navigate(_('#sc/wc').addHrefArgs({_t: _.now()}), {
                trigger: true,
                replace: false
              });} else {
              Global.ui.notification.show('操作失败。');
            }
          });
      } else {
        $target.button('reset');
      }
    },
    addHandler: function() {
      this.staticGrid.addRows([{
        salesVolume: '<div><input type="text" name="itemList[' + this.lastIndex + '].salesVolume" class="form-control" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required style="width:150px;"><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
        validUser: '<input type="text" name="itemList[' + this.lastIndex + '].validUser" class="form-control" required style="width:150px;" data-parsley-range="[0, 1000]" data-parsley-type="integer" required>',
        wagesVal: '<select class="js-wc-data-type form-control" style="margin-right:20px;" name="itemList[' + this.lastIndex + '].wagesType" ><option value="percent" selected>百分比</option><option value="fix">固定金额</option></select><input type="text" name="itemList[' + this.lastIndex + '].wagesVal" class="js-wc-wageVal form-control" style="width:150px;" data-parsley-range="[0, 100]" data-parsley-twoDecimal required><label class="js-sc-wc-unit control-label m-right-sm" style="margin-left: 20px;">%</label>'+
        '<button class="js-wc-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
      }], {
        eq: -1
      });
      this.lastIndex++;
    },
    delHandler: function(e) {
      var $target = $(e.currentTarget);
      this.staticGrid.delRow($target);
    },
    resetAgentWageCfgHandler:function(e){
      this.render();
    },
    changeTypeHandler: function(e) {
      var $target = $(e.currentTarget);
      var $input =  $target.closest('tr').find('.js-wc-wageVal');
      if ($target.val() === 'percent') {
        $input.attr('data-parsley-range', '[0, 100]');
        $input.removeAttr('data-parsley-type');
        $input.attr('data-parsley-twoDecimal');
        $input.closest('tr').find('.js-sc-wc-unit').html('%');
      } else {
        $input.attr('data-parsley-range', '[0, 100000]');
        $input.removeAttr('data-parsley-twoDecimal');
        $input.attr('data-parsley-type="integer"');
        $input.closest('tr').find('.js-sc-wc-unit').html('元');
      }
      $input.parsley().validate();
    }

  });
  module.exports = AgentWageCfgView;
});
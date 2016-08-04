define(function (require, exports, module) {
  var AgentRewardCfgView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/games-agentRewardCfg.html'),

    events: {
      'click .js-cl-add': 'addHandler',
      'click .js-cl-del': 'delHandler',
      'click .js-cl-btn-submit': 'saveAgentRewardCfgHandler',
      'change .js-cl-data-type': 'changeTypeHandler',
      'click .js-cl-btn-reset':'resetAgentRewardCfgHandler'
    },

    initialize: function () {
    },
  //发送请求
    _getRedCfgData: function (params) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/sprintcfgdetail.json',
        data: params
      });
    },
    onRender: function () {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-cl-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
        //startFormat: 'YYYY-MM-DD',
        //endFormat: 'YYYY-MM-DD'
      }).render();

      var activityId = 7;
      var params = {activityId: activityId};
      this._loadPage(params, 'js-cl-cfgDetail');
    },
    _loadPage: function (params, classValue) {
      var self = this;
      this._getRedCfgData(params).done(function (res) {
        if (res.result === 0) {
          self.$('.js-start-time').val(_(res.root.fromDate).toTime());
          self.$('.js-end-time').val(_(res.root.endDate).toTime());
          self.$('.js-cl-agentLevel').val(_(res.root.agentLevel).formatDiv(10));
          self.$('.js-cl-cycle').val(res.root.cycle);
          self.$('.js-cl-activityId').val(res.root.activityId);
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
          {label: '团队投注额（日）≥', name: 'salesVolume', width: 100},
          {label: '奖励比例', name: 'rewardVal', width: 120}
        ],
        emptyTip: false,
        row: tableInfo
      }).staticGrid('instance');
    },
    //格式化数据
    _formatCfgData: function (cfgs) {
      this.lastIndex = cfgs.length;
      return _(cfgs).chain().map(function (cfg, index) {
          if(cfg.rewardType=="percent"){
            return {
              'salesVolume': '<div><input type="text" name="itemList[' + index + '].salesVolume" class="form-control" required style="width:150px;" value="' + _(cfg.salesVolume).formatDiv(10000, {fixed: 0}) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
              'rewardVal': '<select class="js-cl-data-type form-control" style="margin-right:20px;" name="itemList[' + index + '].rewardType" ><option value="percent" selected>百分比</option><option value="fix">固定金额</option></select><input type="text" class="js-cl-rewardVal form-control" name="itemList[' + index + '].rewardVal"  style="width:150px;" required value="' + _(cfg.rewardVal).formatDiv(100) + '" data-parsley-range="[0, 100]" data-parsley-type="integer" required><label class="js-sc-ar-unit control-label m-right-sm" style="margin-left: 20px;">%</label>'+
              '<button class="js-cl-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
            }
          }
          if(cfg.rewardType=="fix"){
            return {
              'salesVolume': '<div><input type="text" name="itemList[' + index + '].salesVolume" class="form-control" required style="width:150px;" value="' + _(cfg.salesVolume).formatDiv(10000, {fixed: 0}) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
              'rewardVal': '<select class="js-cl-data-type form-control" style="margin-right:20px;" name="itemList[' + index + '].rewardType"><option value="percent" >百分比</option><option value="fix" selected>固定金额</option></select><input type="text" class="js-cl-rewardVal form-control" name="itemList[' + index + '].rewardVal" style="width:150px;" required value="' + _(cfg.rewardVal).formatDiv(10000, {fixed:0}) + '" data-parsley-range="[0, 9999999]" data-parsley-type="integer" required><label class="js-sc-ar-unit control-label m-right-sm" style="margin-left: 20px;">元</label>'+
              '<button class="js-cl-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
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
    saveAgentRewardCfgHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-cl-rewardCfg-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
          url: '/intra/activitymanage/savesprintcfg.json',
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
              Global.appRouter.navigate(_('#sc/cl').addHrefArgs({_t: _.now()}), {
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
        'salesVolume': '<div><input type="text" name="itemList[' + this.lastIndex + '].salesVolume" class="form-control" required style="width:150px;" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
        'rewardVal': '<select class="js-cl-data-type form-control" style="margin-right:20px;" name="itemList[' + this.lastIndex + '].rewardType" ><option value="percent" selected>百分比</option><option value="fix">固定金额</option></select><input type="text" class="js-cl-rewardVal form-control" name="itemList[' + this.lastIndex + '].rewardVal" style="width:150px;" data-parsley-range="[0, 100]" data-parsley-type="integer" required><label class="js-sc-ar-unit control-label m-right-sm" style="margin-left: 20px;">%</label>'+
        '<button class="js-cl-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button>'
      }], {
        eq: -1
      });
      this.lastIndex++;
    },
    delHandler: function(e) {
      var $target = $(e.currentTarget);
      this.staticGrid.delRow($target);
    },
    resetAgentRewardCfgHandler:function(e){
      this.render();
    },

    changeTypeHandler: function(e) {
      var $target = $(e.currentTarget);
      var $input =  $target.closest('tr').find('.js-cl-rewardVal');
      if ($target.val() === 'percent') {
        $input.attr('data-parsley-range', '[0, 100]');
        $input.removeAttr('data-parsley-type');
        $input.attr('data-parsley-twoDecimal');
        $input.closest('tr').find('.js-sc-ar-unit').html('%');
      } else {
        $input.attr('data-parsley-range', '[0, 100000]');
        $input.removeAttr('data-parsley-twoDecimal');
        $input.attr('data-parsley-type="integer"');
        $input.closest('tr').find('.js-sc-ar-unit').html('元');
      }
      $input.parsley().validate();
    }

  });
  module.exports = AgentRewardCfgView;
});
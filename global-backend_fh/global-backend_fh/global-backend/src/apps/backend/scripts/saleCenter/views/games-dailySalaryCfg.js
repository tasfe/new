define(function (require, exports, module) {
  var AgentRewardCfgView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/games-dailySalaryCfg.html'),

    events: {
      'click .js-cl-add': 'addHandler',
      'click .js-cl-del': 'delHandler',
      'click .js-cl-btn-submit': 'saveAgentRewardCfgHandler',
      'change .js-cl-data-type': 'changeTypeHandler',
      'click .js-cl-btn-reset':'resetAgentRewardCfgHandler',
      'click .js-cl-needLoss':'changeNeedLossHandler'
    },

    initialize: function () {
      this.lastIndex=0;
    },
    //发送请求
    _getRedCfgData: function (params) {
      return Global.sync.ajax({
        url: '/intra/dailysalary/conf.json',
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

      /*var activityId = 7;
      var params = {activityId: activityId};*/
      var params = {};
      this._loadPage(params, 'js-cl-cfgDetail');
    },
    _loadPage: function (params, classValue) {
      var self = this;
      this._getRedCfgData(params).done(function (res) {
        if (res.result === 0&&res.root!=null) {
          self.$('.js-start-time').val(_(res.root.fromDate).toTime());
          self.$('.js-end-time').val(_(res.root.endDate).toTime());
          self.$('.js-cl-cycle').val(_(res.root.lossLimit).formatDiv(10000,{fixed: 0}));
          self.$('.js-cl-activityId').val(res.root.activityId);
          if(res.root.needLoss){
            self.$('.js-cl-needLoss').prop("checked","checked");
            self.$('.js-cl-needLoss-value').val(1);
          }
          self._getTable(self._formatCfgData(res.root.itemList,res.root), classValue);
        } else {
          self.staticGrid =self.$('.' + classValue).staticGrid({
            colModel: [
              {label: '团队投注额（日）≥', name: 'saleAmount', width: 100},
              {label: '日薪金额', name: 'salaryAmount', width: 120}
            ],
            emptyTip: false,
            row: []
          }).staticGrid('instance');
          Global.ui.notification.show(res.msg);
        }
      }).fail(function () {
      });
    },
    //获取表格
    _getTable: function (tableInfo, classValue) {
      this.staticGrid =this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '团队投注额（日）≥', name: 'saleAmount', width: 100},
          {label: '日薪金额', name: 'salaryAmount', width: 120}
        ],
        emptyTip: false,
        row: tableInfo
      }).staticGrid('instance');
    },
    //格式化数据
    _formatCfgData: function (cfgs,msg) {
      if(msg!=null){
        this.lastIndex = cfgs.length;
      }
      return _(cfgs).chain().map(function (cfg, index) {
            return {
              'saleAmount': '<div><input type="text" name="item[' + index + '].saleAmount" class="form-control" required style="width:150px;" value="' + _(cfg.saleAmount).formatDiv(10000, {fixed: 0}) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
              'salaryAmount': '<div><input type="text" name="item[' + index + '].salaryAmount" class="form-control" required style="width:150px;" value="' + _(cfg.salaryAmount).formatDiv(10000, {fixed: 0}) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label><button class="js-cl-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button></div>'
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
            url: '/intra/dailysalary/saveconf.json',
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
              Global.appRouter.navigate(_('#sc/ds/conf').addHrefArgs({_t: _.now()}), {
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
        'saleAmount': '<div><input type="text" name="item[' + this.lastIndex + '].saleAmount" class="form-control" required style="width:150px;" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
        'salaryAmount': '<div><input type="text" name="item[' + this.lastIndex + '].salaryAmount" class="form-control" required style="width:150px;" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label><button class="js-cl-del btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button></div>'
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

    changeNeedLossHandler:function(e){
      var self = this;
      var $target = $(e.currentTarget);
      if($target.prop("checked")){
        $target.prop("checked",true);
        self.$('.js-cl-needLoss-value').val(1);
      }else{
        $target.prop("checked",false);
        self.$('.js-cl-needLoss-value').val(0);
      }
    }

  });
  module.exports = AgentRewardCfgView;
});
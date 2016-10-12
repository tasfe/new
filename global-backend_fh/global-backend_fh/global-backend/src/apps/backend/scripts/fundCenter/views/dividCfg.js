define(function (require, exports, module) {
  var AgentRewardCfgView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/dividCfg.html'),

    events: {
      'click .js-cl-add-manager': 'addManagerHandler',
      'click .js-cl-del-manager': 'delManagerHandler',
      'click .js-cl-btn-submit': 'saveAgentRewardCfgHandler',
      'click .js-cl-btn-reset':'resetAgentRewardCfgHandler'
    },

    initialize: function () {
    },
    //发送请求
    _getDividCfgData: function (params) {
      return Global.sync.ajax({
        url: '/intra/dividmng/masterconf.json',
        data: params
      });
    },
    onRender: function () {
      var self = this;
      var params = {};
      this._loadPage(params);
    },

    _loadPage: function (params) {
      var self = this;
      this._getDividCfgData(params).done(function (res) {
        if (res.result === 0) {
          self._getManagerTable(self._formatManagerCfgData(res.root.dividBetCfgList), 'js-cl-managerCfg');
        } else {
          Global.ui.notification.show(res.msg);
        }
      }).fail(function () {
      });
    },
    //获取表格
    _getManagerTable: function (tableInfo, classValue) {
      this.managerStaticGrid =this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '日量标准（元） ≥', name: 'betTotal', width: 100},
          {label: '分红比例（%） ', name: 'divid0', width: 120}
        ],
        emptyTip: false,
        row: tableInfo
      }).staticGrid('instance');
    },
    //格式化数据
    _formatManagerCfgData: function (cfgs) {
      this.lastIndex = cfgs.length;
      return _(cfgs).chain().map(function (cfg, index) {
          return {
            'betTotal': '<div><input type="text" name="dividConf[' + index + '].betTotal" class="form-control" required style="width:150px;" value="' + _(cfg.betTotal).formatDiv(10000, {fixed: 0}) + '" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
            'divid0': '<div><input type="text" name="dividConf[' + index + '].divid" class="form-control" required style="width:150px;" value="' + _(cfg.divid).formatDiv(100, {fixed: 0}) + '"  required><label class="control-label m-right-sm" style="margin-left: 20px;">%</label><button class="js-cl-del-manager btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button></div>'
          }
        }
      ).flatten().value();
    },


    addManagerHandler: function() {
      this.managerStaticGrid.addRows([{
        'betTotal': '<div><input type="text" name="dividConf[' + this.lastIndex + '].betTotal" class="form-control" required style="width:150px;" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">元</label></div>',
        'divid0': '<div><input type="text" name="dividConf[' + this.lastIndex + '].divid" class="form-control" required style="width:150px;" data-parsley-range="[0, 99999999]" data-parsley-type="integer" required><label class="control-label m-right-sm" style="margin-left: 20px;">%</label><button class="js-cl-del-manager btn btn-danger btn-sm pull-right"><i class="fa fa-minus"></i> </button></div>'
      }], {
        eq: -1
      });
      this.lastIndex++;
    },

    delManagerHandler: function(e) {
      var $target = $(e.currentTarget);
      this.managerStaticGrid.delRow($target);
    },



    resetAgentRewardCfgHandler:function(e){
      this.render();
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
            url: '/intra/dividmng/masterconfsave.json',
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
              Global.appRouter.navigate(_('#fc/ds').addHrefArgs({_t: _.now()}), {
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

  });
  module.exports = AgentRewardCfgView;
});
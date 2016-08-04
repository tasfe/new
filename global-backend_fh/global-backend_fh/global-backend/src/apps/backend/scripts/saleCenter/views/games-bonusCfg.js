define(function (require, exports, module) {
  var BonusCfgView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/games-bonusCfg.html'),

    events: {
      'click .js-jc-btn-submit': 'saveBonusCfgHandler',
      'click .js-jc-btn-reset': 'resetBonusCfgHandler'
    },
    initialize: function () {
    },
    //发送请求
    _getBonusCfgData: function (params) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/rebatecfgdetail.json',
        data: params
      });
    },
    onRender: function () {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-jc-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();

      var activityId = 4;
      var params = {activityId: activityId};
      this._loadPage(params, 'js-jc-bonusCfg-form');
    },
    _loadPage: function (params, classValue) {
      var self = this;
      this._getBonusCfgData(params).done(function (res) {
        if (res.result === 0) {
          self.$('.js-start-time').val(_(res.root.fromDate).toTime());
          self.$('.js-end-time').val(_(res.root.endDate).toTime());
          self.$('.js-jc-percent').val(_(res.root.percent).formatDiv(100, {fixed: 2}));
          self.$('.js-jc-activityId').val(res.root.activityId);
        } else {
          Global.ui.notification.show(res.msg);
        }
      }).fail(function () {
      });
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
    saveBonusCfgHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-jc-bonusCfg-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
          url: '/intra/activitymanage/saverebatecfg.json',
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
              Global.appRouter.navigate(_('#sc/jc').addHrefArgs({_t: _.now()}), {
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
    resetBonusCfgHandler:function(e){
      this.render();
    }



  });
  module.exports = BonusCfgView;
});
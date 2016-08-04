define(function (require, exports, module) {
  var UserAddBonusCfgView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/games-userAddBonusCfg.html'),

    events: {
      'click .js-xsjj-btn-submit': 'saveCfgHandler',
      'click .js-xsjj-btn-reset':'resetCfgHandler'
    },

    initialize: function () {
    },
  //发送请求
    _getBonusCfgData: function (params) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/plusprizecfgdetail.json',
        data: {
          activityId: 17
        }
      });
    },
    onRender: function () {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-xsjj-total-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();

      new Global.Prefab.Timeset({
        prevClass:'js-time',
        el: this.$('.js-xsjj-timeset'),
        startTime: 'itemList[0].validBegin',
        endTime: 'itemList[0].validEnd',
        endDate:moment().add(100, 'year'),
        startOps: {
          format: 'H:mm:ss'
        },
        endOps: {
          format: 'H:mm:ss'
        },
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();
      var activityId = 17;
      this._getBonusCfgData()
          .done(function (res) {
            if (res && res.result === 0) {
              if(res.root){

              self.$('.js-start-time').val(_(res.root.fromDate).toTime());
              self.$('.js-end-time').val(_(res.root.endDate).toTime());
              self.$('.js-xsjj-activityId').val(activityId);
              self.$('.js-xsjj-rate').val(_(res.root.rate).formatDiv(10000, {fixed: 2}));
              self.$('.js-time-start-time').val(res.root.itemList[0].validBegin);
              self.$('.js-time-end-time').val(res.root.itemList[0].validEnd);
              }else{
                self.$('.js-start-time').val('');
                self.$('.js-end-time').val('');
                self.$('.js-xsjj-activityId').val(activityId);
                self.$('.js-xsjj-rate').val('0.00');
                self.$('.js-time-start-time').val('');
                self.$('.js-time-end-time').val('');
              }
            } else {
              Global.ui.notification.show('数据异常。');
            }
          });

    },
    saveCfgHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-xsjj-cfg-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
          url: '/intra/activitymanage/saveplusprizecfg.json',
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
              Global.appRouter.navigate(_('#sc/xsjj').addHrefArgs({_t: _.now()}), {
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
    resetCfgHandler:function(e){
      this.render();
    }
  });
  module.exports = UserAddBonusCfgView;
});
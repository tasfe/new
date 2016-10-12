define(function (require, exports, module) {

  var RechargeRangeSetView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/recharge-RechargeSet-Range.html'),

    events: {
      'click .js-fc-rechargeSet-range-submit': 'rechargeSetSubmitHandler',
      'click .js-fc-rechargeSet-range-cancel': 'cancelHandler',
      'click .js-fc-rechargeSet-fullTimeService':'changeFullTimeService'

    },

    initialize: function () {

    },
    findRechargeRangeXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/timeconf.json',
        data: data
      });
    },
    saveRechargeSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/savetimeconf.json',
        data: data,
        tradition: true
      });
    },

    onRender: function () {
      var self = this;
      var data = {};

      self.findRechargeRangeXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.fillFormInfo(res.root);
        } else {
          Global.ui.notification.show('操作失败。');
        }
      });

    },
    rechargeSetSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-fc-rechargeSet-range-range-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {

        var data = {
          fullTimeService: this.$('input[type=radio][name=fullTimeService]:checked').val(),
          startTime: this.$('.js-fc-rechargeSet-startTime').val(),
          endTime: this.$('.js-fc-rechargeSet-endTime').val(),
          type:0
        };
        this.saveRechargeSetXhr(data).always(function () {
          $target.button('reset');
        }).fail(function () {
        }).done(function (res) {
          if (res.result === 0) {
            Global.ui.notification.show('操作成功。');
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
      }else{
        $target.button('reset');
      }

    },
    getSetInfoListFromContainer: function ($container) {
      var idList = $container.find('.js-fc-rechargeSet-id');
      var minMoneyLimitList = $container.find('.js-fc-rechargeSet-minMoneyLimit');
      var maxMoneyLimitList = $container.find('.js-fc-rechargeSet-maxMoneyLimit');
      return _(idList).map(function (id, index, inList) {
        return {
          bankId: $(id).data('type'),
          minMoneyLimit: $(minMoneyLimitList[index]).val(),
          maxMoneyLimit: $(maxMoneyLimitList[index]).val()
        }
      });
    },

    fillFormInfo: function (root) {
      var self = this;


      if (root.fullTimeService) {
        self.$('input[type="radio"][name="fullTimeService"][value="true"]').click();
      } else {
        self.$('input[type="radio"][name="fullTimeService"][value="false"]').click();
      }
      this.$('.js-fc-rechargeSet-startTime').val(root.startTime);
      this.$('.js-fc-rechargeSet-endTime').val(root.endTime);
    },


    changeFullTimeService:function(e){
      var self = this;
      var $target = self.$(e.currentTarget);

      if($target.val() == "true"){
        self.$("select[name='startTime']").attr("disabled",true);
        self.$("select[name='endTime']").attr("disabled",true);
      }else if($target.val() == "false"){
        self.$("select[name='startTime']").attr("disabled",false);
        self.$("select[name='endTime']").attr("disabled",false);
      }
    },


    insertNotice: function (html) {
      this.$('.js-fc-rechargeRangeSet-notice').html(this._getErrorMsg(html));
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
    cancelHandler: function(){
      this.onRender();
    }

  });

  module.exports = RechargeRangeSetView;
});
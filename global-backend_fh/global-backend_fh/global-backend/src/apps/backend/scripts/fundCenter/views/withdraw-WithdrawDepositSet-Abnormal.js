define(function (require, exports, module) {

  var WithdrawAbnormalSetView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/withdraw-WithdrawDepositSet-Abnormal.html'),

    events: {
      'click .js-fc-WithdrawSet-Abnormal-submit': 'AWDSetSubmitHandler',
      'click .js-fc-withdrawSet-Abnormal-cancel': 'cancelHandler'
    },

    initialize: function () {

    },
    findAWDXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/withdrawmanage/exceptioncfg.json',
        data: data
      });
    },
    saveAWDSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/withdrawmanage/exceptioncfgsave.json',
        data: data,
        tradition: true
      });
    },

    onRender: function () {
      var self = this;
      var data = {};

      self.findAWDXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.fillFormInfo(res.root);
        } else {
          self.insertNotice('获取配置信息失败，' + res.msg);
        }
      });

    },
    AWDSetSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      //todo 校验添加
      var $currContainer = $('.js-fc-WithdrawSet-Abnormal-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {

        var data = {
          dailyMoneyTotalLimit: this.$('.js-fc-withdrawSet-dailyMoneyTotalLimit').val(),
          singleMoneyLimit: this.$('.js-fc-withdrawSet-singleMoneyLimit').val(),
          dailyTimesLimit: this.$('.js-fc-withdrawSet-dailyTimesLimit').val()
        };
        $target.button('loading');
        this.saveAWDSetXhr(data).always(function () {
          $target.button('reset');
        }).fail(function () {
        }).done(function (res) {
          if (res.result === 0) {
            Global.ui.notification.show('操作成功。');
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
      }

    },

    fillFormInfo: function (root) {
      this.$('.js-fc-withdrawSet-dailyMoneyTotalLimit').val(_(root.dailyMoneyTotalLimit).convert2yuan());
      this.$('.js-fc-withdrawSet-singleMoneyLimit').val(_(root.singleMoneyLimit).convert2yuan());
      this.$('.js-fc-withdrawSet-dailyTimesLimit').val(root.dailyTimesLimit);
    },


    insertNotice: function (html) {
      this.$('.js-fc-AWDSet-notice').html(this._getErrorMsg(html));
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
  //取消按钮
  cancelHandler: function(){
    this.onRender();
  }

  });

  module.exports = WithdrawAbnormalSetView;
});
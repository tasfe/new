define(function (require, exports, module) {

  var WithdrawRateSetView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/withdraw-WithdrawDepositSet-Rate.html'),

    events: {
      'click .js-fc-wdRateSet-Rate-submit': 'withdrawRateSetSubmitHandler',
      'click .js-fc-withdrawSet-Rate-cancel': 'cancelHandler'
    },

    initialize: function () {

    },
    findWithdrawRangeRangeXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/withdrawmanage/balancecfg.json',
        data: data
      });
    },
    saveWithdrawRateSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/withdrawmanage/balancecfgsave.json',
        data: data,
        tradition: true
      });
    },

    onRender: function () {
      var self = this;
      var data = {};

      self.findWithdrawRangeRangeXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.fillFormInfo(res.root);
        } else {
          self.insertNotice('获取配置信息失败，' + res.msg);
        }
      });

    },
    withdrawRateSetSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);

      var $currContainer = $('.js-fc-wdRateSet-Rate-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {

        var data = {
          types: this.getSetInfoListFromContainer(),
          limit: this.$('.js-fc-wdRateSet-rate').val()
        };
        $target.button('loading');
        this.saveWithdrawRateSetXhr(data).always(function () {
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
    getSetInfoListFromContainer: function () {
      var typeList = $('input[name=type]:checked');
      return _(typeList).map(function (type, index, typeList) {
        return $(type).val();
      });
    },

    fillFormInfo: function (root) {
      _(root.types).each(function(type,index,types){
        this.$('input[type=checkbox][name=type][value='+type+']').prop('checked',true);
      });
      $('.js-fc-wdRateSet-rate').val(root.limit);
    },



    insertNotice: function (html) {
      this.$('.js-fc-withdrawRangeRangeSet-notice').html(this._getErrorMsg(html));
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

  module.exports = WithdrawRateSetView;
});
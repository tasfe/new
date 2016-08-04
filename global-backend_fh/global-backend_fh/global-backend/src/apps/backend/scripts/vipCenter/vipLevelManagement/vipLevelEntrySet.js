define(function (require, exports, module) {

  var VipLevelEntrySetView = Base.ItemView.extend({

    template: require('text!vipCenter/vipLevelManagement/vipLevelEntrySet.html'),

    events: {
      'click .js-vc-vm-es-btn-submit': 'formSubmitHandler',
      'click .js-vc-vm-es-btn-cancel': 'formCancelHandler'
    },

    initialize: function () {
    },
    _getVipLevelData: function (params) {
      return Global.sync.ajax({
        url: '/intra/vipmanager/creditcfgdetail.json',
        data: params
      });
    },
    onRender: function () {
      this.$formContainer = this.$('.js-vc-vm-es-form');
      this._loadPage();
    },
    _loadPage: function (classValue) {
      var self = this;
      this._getVipLevelData().done(function (res) {
        if (res.result === 0) {
          self._initData(res.root.itemList);
        }else{
          Global.ui.notification.show('数据异常。');
        }
      }).fail(function(){
      });
    },
    _initData: function (itemList) {
      var self = this;
      var $Status = this.$('.js-vc-es-status');
      var $Amount = this.$('.js-vc-es-amount');
      var $RateFront = this.$('.js-vc-es-rate-front');
      var $RateBack = this.$('.js-vc-es-rate-back');
      var row = [];
      _(itemList).each(function (item) {
        var index = Number(item.type);
        var rateArr = item.rate.split(':');
        $($Status[index]).prop('checked',true);
        $($Amount[index]).val(_(item.limit).formatDiv(10000));
        $($RateFront[index]).val(rateArr[0]);
        $($RateBack[index]).val(rateArr[1]);
      });
    },
    formSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var config = this.getConfigData();
      var clpValidate = this.$formContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
          url: '/intra/vipmanager/savecreditcfg.json',
          data: {itemList:config},
          tradition: true

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
                self.render();
              } else {
                Global.ui.notification.show('操作失败。');
              }
            });
      }else{
        $target.button('reset');
      }
    },
    getConfigData: function(){
      var config = [];
      var $Status = this.$('.js-vc-es-status');
      var $Amount = this.$('.js-vc-es-amount');
      var $RateFront = this.$('.js-vc-es-rate-front');
      var $RateBack = this.$('.js-vc-es-rate-back');
      _($Status).each(function (item,index) {
        if ($(item).prop('checked')) {
          config.push({
            type: index,
            status: 1,
            limit: $($Amount[index]).val(),
            rate: $($RateFront[index]).val() + ':' + $($RateBack[index]).val()
          })
        }
      });
      return config;
    },
    formCancelHandler: function (e) {
     this.render();
    }

  });

  module.exports = VipLevelEntrySetView;
});
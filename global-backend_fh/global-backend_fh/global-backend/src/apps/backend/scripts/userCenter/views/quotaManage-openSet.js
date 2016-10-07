define(function (require, exports, module) {

  var QuotaManageLevelOneView = Base.ItemView.extend({

    template: require('text!userCenter/templates/quotaManage-openSet.html'),


    events: {
      'click .js-uc-qm-saveQuota': 'saveQuotaHandler',
      'click .js-uc-qm-cancelQuota': 'cancelQuotaHandler'
    },
    initialize: function () {
    },
    //查询返点
    _getQuotaData: function (params) {
      return Global.sync.ajax({
        url: '/intra/usermanager/quotacfgdetail.json',
        data: params
      });
    },
    //保存返点
    _saveQuotaData: function (params) {
      return Global.sync.ajax({
        url: '/intra/usermanager/saverquotacfg.json',
        data: params,
        tradition: true
      });
    },

    onRender: function () {
      var self = this;
      self.$('.js-uc-qm-open').bind('click', self.switchHandler);
      this._getQuotaData().fail(function () {
      }).done(function (res) {
        if (res.result == 0) {
          self.renderBaseInfo(res.root);

        } else {
          Global.ui.notification.show('操作失败。');
        }
      });
    },
    renderBaseInfo: function (root) {
      //if(root && root.level4 && _(root.level4).size()==1){
      //    this.$('.js-uc-qm-quotaFour').val(  root.level4[0].quotaNum );
      //}
      if(root.subOpen){
        self.$('.js-uc-qm-open').click();
      }
      this.$('.js-uc-qm-quotaDown').val(root.subRebate/10);
      this.$('.js-uc-qm-quotaNum').val(root.subQuotaNum);
    },
    saveQuotaHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = this.$('.js-uc-qm-level-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        var quota = [
          {
            rebate: self.$('.js-uc-qm-quotaDown').val(),
            quotaNum: self.$('.js-uc-qm-quotaNum').val()
          }];

        var params = {
          level: 100,
          quota: quota,
          open:  self.$('.js-uc-qm-open').val()
        };

        this._saveQuotaData(params)
            .always(function(){
              $target.button('reset');
            }).done(function (res) {
              if (res.result === 0) {
                Global.ui.notification.show('操作成功。');
              } else {
                Global.ui.notification.show('操作失败。');
              }
            }).fail(function () {
            });
      }else{
        $target.button('reset');
      }
    },

    cancelQuotaHandler: function (e) {
      this.render();
    },

    //  点击开关触发的handler
    switchHandler:function(e) {
      var $target = $(e.currentTarget);
      var cancelOpenVal = $target.val(); // 0：开启 1：关闭
      if (cancelOpenVal == 0) {
        $target.val(1);
      } else if (cancelOpenVal == 1) {
        $target.val(0);
      }
    },
  });

  module.exports = QuotaManageLevelOneView;
});
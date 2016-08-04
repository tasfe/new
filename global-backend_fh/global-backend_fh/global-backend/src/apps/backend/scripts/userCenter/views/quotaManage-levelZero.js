define(function (require, exports, module) {

  var QuotaManageLevelOneView = Base.ItemView.extend({

    template: require('text!userCenter/templates/quotaManage-levelZero.html'),


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
     if(root && root.level0 && _(root.level0).size()==5){
       var quotaNumArr = _(root.level0).sort(function(item){
        return -item.rebate;
       });
       this.$('.js-uc-qm-quotaZero').val( quotaNumArr[0].quotaNum);
       this.$('.js-uc-qm-quotaOne').val( quotaNumArr[1].quotaNum);
       this.$('.js-uc-qm-quotaTwo').val( quotaNumArr[2].quotaNum );
       this.$('.js-uc-qm-quotaThree').val(  quotaNumArr[3].quotaNum );
       this.$('.js-uc-qm-quotaFour').val(  quotaNumArr[4].quotaNum );
     }
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
            rebate: 13.0,
            quotaNum: this.$('.js-uc-qm-quotaZero').val()
          },
          {
            rebate: 12.8,
            quotaNum: this.$('.js-uc-qm-quotaOne').val()
          },
          {
            rebate: 12.7,
            quotaNum: this.$('.js-uc-qm-quotaTwo').val()
          },
          {
            rebate: 12.6,
            quotaNum: this.$('.js-uc-qm-quotaThree').val()
          },
          {
            rebate: 12.5,
            quotaNum: this.$('.js-uc-qm-quotaFour').val()
          }];

        var params = {
          level: 0,
          quota: quota
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
    }
  });

  module.exports = QuotaManageLevelOneView;
});
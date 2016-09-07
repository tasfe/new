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
      if(root.sub130Open){
        self.$('.sub130Open').attr("checked", true);
      }
      if(root.sub129Open){
        self.$('.sub129Open').attr("checked", true);
      }
      if(root.sub128Open){
        self.$('.sub128Open').attr("checked", true);
      }
      if(root.sub127Open){
        self.$('.sub127Open').attr("checked", true);
      }
      if(root.sub126Open){
        self.$('.sub126Open').attr("checked", true);
      }
      if(root.sub125Open){
        self.$('.sub125Open').attr("checked", true);
      }
    },

    saveQuotaHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = this.$('.js-uc-qm-level-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        var open = '';

        $("[name='checkbox']").each(function(){
          if($(this).prop('checked') == true){
            open = open + $(this).val()+",";
          }
        })

        var params = {
          level: 100,
          open: open.substring(0,open.length-1)
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
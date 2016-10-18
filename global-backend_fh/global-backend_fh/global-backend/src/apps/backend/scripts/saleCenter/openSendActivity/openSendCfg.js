/**
 * Created by David Zhang on 2015/12/11.
 */
define(function (require, exports, module) {

  var OpenSendCfgView = Base.ItemView.extend({

    template: require('text!saleCenter/openSendActivity/openSendCfg.html'),

    events: {
      'submit .js-sc-bcac-form': 'saveSetHandler',
      'click .js-sc-bcac-cancel': 'cancelHandler'
    },

    initialize: function () {
      this.conLastIndex = 0;
    },
    findSetXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/newuseract/conf.json',
        data: data
      });
    },
    saveRedPackBattleSetXhr: function(data) {
      return Global.sync.ajax({
        url: '/intra/newuseract/saveconf.json',
        data: _(data).extend({
          activityId: 39
        })
      })
    },
    onRender: function () {
      var self = this;
      new Global.Prefab.Timeset({
        el: this.$('.js-sc-bcac-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();
      self.$('.js-sp-time').datetimepicker({
        useCurrent: false,
        format: 'YYYY-MM-DD H:mm:ss',
        minDate: moment().add('days',-1)
      });
      this.$conditionContainer = this.$('.js-fc-condition-container');

      this.findSetXhr()
          .fail(function(){
          }).done(function(res){
            if(res.result===0){
              self.fillBaseInfo(res.root);
            }else{
              this.insertNotice('处理信息获取失败'+res.msg);
            }
          });
    },

    fillBaseInfo: function(root){
      this.$('.js-start-time').val(_(root.fromDate).toTime());
      this.$('.js-end-time').val(_(root.endDate).toTime());
      this.$('.js-sp-time').val(_(root.regTime).toTime());

      this.$('.js-sc-bcac-activityId').val(root.activityId);
      if(root.cardBind==0){
        this.$('input[type="radio"][name="cardBind"][value="0"]').prop('checked', true);
      }else if(root.cardBind==1){
        this.$('input[type="radio"][name="cardBind"][value="1"]').prop('checked', true);
      }
      if(root.cardLock==0){
        this.$('input[type="radio"][name="cardLock"][value="0"]').prop('checked', true);
      }else if(root.cardLock==1){
        this.$('input[type="radio"][name="cardLock"][value="1"]').prop('checked', true);
      }
      this.$('.js-sc-bcac-bonus').val(_(root.bonus).convert2yuan());
      this.$('.js-sc-bcac-num').val(root.count);
    },


    saveSetHandler: function(e) {
      var self = this;
      var $target = $(e.currentTarget);

      var $submitBtn = $target.find('[type=submit]');

      $submitBtn.button('loading');

      this.saveRedPackBattleSetXhr(_($target.serializeArray()).serializeObject())
          .always(function() {
            $submitBtn.button('reset');
          })
          .done(function(res) {
            if (res && res.result === 0) {
              Global.ui.notification.show('操作成功。');
              self.render();
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
    },

    cancelHandler: function(){
      this.render();
    }

  });

  module.exports = OpenSendCfgView;
});
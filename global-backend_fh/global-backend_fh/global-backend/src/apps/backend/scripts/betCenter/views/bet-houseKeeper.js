/**
 * Created by David Zhang on 2015/9/2.
 */
define(function (require, exports, module) {
  var RebateRightView = require('com/rebateRight/index');
  var BetHouseKeeperView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/bet-houseKeeper.html'),

    //所有的事件绑定全部写在这！
    events: {
      'click .js-bhk-btn-submit': 'formSubmitHandler',
      'click .js-bhk-btn-cancel': 'formCancelHandler',
      'click .js-pf-allUser': 'selectAllUserHandler',
      'click .js-bhk-vip-allLevel': 'selectAllUserVipHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    getXxxXhr: function (datas) {

      return Global.sync.ajax({
        url: '/intra/betManagerConf/projectconf.json',
        data: datas
      });
    },

    //在页面被渲染出来的时候自动调用
    onRender: function () {
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      var self = this;
      this.$btnSumbit = self.$('.js-bhk-btn-submit');
      this.$formContainer = this.$('.js-bhk-form');

      this.getXxxXhr().always(function () {
      })
        .fail(function () {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            var option = {userLevel:res.root.userLevel,disabled:0};
            var rebateRightView = new RebateRightView(option);
            self.$('.js-bhk-form').prepend(rebateRightView.render().$el);
            _(self.$('.js-bhk-vip-userLevel')).each(function(item,index){
              if(_(res.root.vipLevel).contains(Number($(item).val()))){
                $(item).prop('checked',true);
              }
            });
            self.$('.js-bhk-open').val(res.root.open);
            self.$('.js-bhk-betSet').val(_(res.root.betMin).formatDiv(10000));
            self.$('.js-bhk-maxLimit').val(res.root.schemeMax);
          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
    },

    //表单被提交时触发的handler
    formSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var userLevel = [];
      _(this.$('.js-pf-userLevel')).map(function(item){
        if($(item).prop('checked')){
          userLevel.push( $(item).val());
        }
      });
      var vipLevel = [];
      _(this.$('.js-bhk-vip-userLevel')).map(function(item){
        if($(item).prop('checked')){
          vipLevel.push( $(item).val());
        }
      });
      var clpValidate = this.$formContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
          url: ' /intra/betManagerConf/saveprojectconf.json',
          data:{
            userLevel:userLevel.join(','),
            vipLevel:vipLevel.join(','),
            open:this.$('.js-bhk-open').val(),
            betMin:this.$('.js-bhk-betSet').val(),
            schemeMax:this.$('.js-bhk-maxLimit').val()
          }

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
              Global.appRouter.navigate(_('#bc/bhk').addHrefArgs({
                _t:_.now()
              }), {trigger: true, replace: false});
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      }else{
        $target.button('reset');
      }
    },
    selectAllUserHandler: function(){
      var $target = this.$('.js-pf-allUser');
      var checked = $target.prop('checked');
      if(checked){
        this.$('.js-pf-userLevel').each(function () {
          $(this).prop('checked',true);
        });
      }else{
        this.$('.js-pf-userLevel').each(function () {
          $(this).prop('checked',false);
        });
      }
    },
    selectAllUserVipHandler: function(){
      var $target = this.$('.js-bhk-vip-allLevel');
      var checked = $target.prop('checked');
      if(checked){
        _(this.$('.js-bhk-vip-userLevel')).each(function (item) {
          $(item).prop('checked',true);
        });
      }else{
        _(this.$('.js-bhk-vip-userLevel')).each(function (item) {
          $(item).prop('checked',false);
        });
      }
    },
    formCancelHandler:function(e){
      var self = this;
      Global.appRouter.navigate(_('#bc/am').addHrefArgs({
        _t:_.now()
      }), {trigger: true, replace: false});
    }
  });

  module.exports = BetHouseKeeperView;
});
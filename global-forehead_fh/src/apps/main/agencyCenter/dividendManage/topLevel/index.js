"use strict";

var TabView = require('com/tabView');

var FirstView = require('../firstLevel');
var TopView = require('./self');
var LowLevelView = require('./lowLevel');
var UserManageView = require('./userManage');

var SignedView = require('./../signed');

var TopLevelView = TabView.extend({

  className: 'ac-topLevel',

  //startOnLoading: true,

  events: {
    'click .js-ac-add-user': 'addUserHandler'
  },

  getConfXhr: function() {
    return Global.sync.ajax({
      url: '/fund/divid/conf.json'
    });
  },
  //签约、修改
  signAgreementXhr: function(data){
    return Global.sync.ajax({
      url: '/fund/divid/sign.json',
      data: data,
      tradition: true
    });
  },

  initialize: function() {
    var tabs = [{
      label: '我的分红',
      name: 'self',
      id: 'jsAcSelf',
      view: TopView
    }];
    var acctInfo = Global.memoryCache.get('acctInfo');
    this.userGroupLevel = acctInfo.userGroupLevel;
    if(this.userGroupLevel!==0){
      tabs = tabs.concat([
        {
          label: '下级分红',
          name: 'lowLevel',
          id: 'jsAcLowLevel',
          view: LowLevelView
        },
        {
          label: '分红用户管理',
          name: 'user',
          id: 'jsAcUserManage',
          view: UserManageView
        }
      ]);
      _(this.options).extend({
        tabs: tabs,
        tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
        // append: '<div class="js-ac-add-user cursor-pointer ac-add-user pull-right text-pleasant">' +
        // '<span class="sfa sfa-dividend-add vertical-bottom"></span> ' +
        // '签约分红用户</div>' +
        // '</div>'
          append:'<button type="button" class="js-ac-add-user btn btn-hot btn-linear ac-add-user pull-right">' +
          '<i class="fa fa-plus-circle"></i>' +
          '  签约分红用户' +
          '</button>'
      });
    }else{
      _(this.options).extend({
        tabs: tabs,
        tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
      });
    }
  },

  onRender: function() {
    var self = this;
    if(this.userGroupLevel!==0){
      //查询添加分红用户配额
      this.getConfXhr()
        .always(function() {
          self.loadingFinish();
        })
        .done(function(res) {
          if (res.result === 0) {
            self.dividConf = res.root;
            if (res.root.quotaLeft <= 0) {
             self.$('.js-ac-add-user').addClass('hidden');
            }
            TabView.prototype.onRender.apply(self, arguments);
          }
        });
    }else{
      TabView.prototype.onRender.apply(self, arguments);
    }
  },


  addUserHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    // 配置数据未加载时点击添加无效
    if(!this.dividConf){
      return false;
    }

    var $dialog = Global.ui.dialog.show({
      title: '签约分红用户',
      body: '<div class="js-ac-add-container"></div>',
      modalClass: 'ten',
      size: 'modal-lg',
      footer: ''
    });

    var $container = $dialog.find('.js-ac-add-container');

    var signedView = new SignedView({
      el: $container,
      dividConf: this.dividConf,
      type: 1
    })
      .render()
      .on('hide', function() {
        self.refresh();
        $dialog.modal('hide');
      });

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      signedView.destroy();
    });

    $dialog.find('.js-ac-next').on('click',function(){
      var conf = signedView.getConfigDataFormTable();
      if(conf){
        self.approveXhr(conf).done(function(res){
          if(res.result==0){
            Global.ui.notification.show('操作成功！');
            $dialog.modal('hide');
          }else{
            Global.ui.notification.show('操作失败！'+res.msg);
          }
        }).fail(function(res){
          Global.ui.notification.show('请求失败！');
        });
      }
    });
  },
  //签约、修改
  approveXhr: function (data) {
    return Global.sync.ajax({
      url: '/fund/divid/sign.json',
      data: data,
      tradition: true
    });
  },
});

module.exports = TopLevelView;

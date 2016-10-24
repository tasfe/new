"use strict";

require('./index.scss');

var AgreeView = require('./agree');

var TabView = require('com/tabView');

var MySalaryDetailView = require('./mySalaryDetail');
var LowLevelView = require('./lowLevel');
var UserManageView = require('./userManage');

var SignedView = require('./signed');
var dividendConfig = require('./salaryConfig');

var TopLevelView = TabView.extend({

  className: 'ac-topLevel',

  //startOnLoading: true,

  events: {
    'click .js-ac-sm-add-user': 'addUserHandler',
  },

  //签约、修改
  signAgreementXhr: function(data){
    return Global.sync.ajax({
      url: '/info/dailysalary/sign.json',
      data: data,
      tradition: true
    });
  },

  initialize: function() {
    var tabs;
    var acctInfo = Global.memoryCache.get('acctInfo');
    tabs = [
      {
        label: '我的日薪',
        name: 'self',
        id: 'jsAcSmSelf',
        view: MySalaryDetailView
      },
      {
        label: '日薪管理',
        name: 'lowLevel',
        id: 'jsAcSmLowLevel',
        view: LowLevelView
      },
      {
        label: '签约用户管理',
        name: 'user',
        id: 'jsAcSmUserManage',
        view: UserManageView
      }
    ];

    _(this.options).extend({
      tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
      tabs: tabs,
      // append: '<div class="js-ac-sm-add-user cursor-pointer ac-add-user pull-right text-pleasant">' +
      // '<span class="sfa sfa-dividend-add vertical-bottom"></span> ' +
      // '签约日薪</div>' +
      // '</div>'
      append:'<button type="button" class="js-ac-sm-add-user btn btn-hot btn-linear ac-add-user pull-right">' +
      '<i class="fa fa-plus-circle"></i>' +
      '  签约日薪' +
      '</button>'
    });

  },

  onRender: function() {
    var acctInfo = Global.memoryCache.get('acctInfo');
    // if (acctInfo.salaryStatus === dividendConfig.getByName('APPLYING').id) {//APPLYING
    //   //申请中
    //   this.$el.html(new AgreeView().render().$el);
    // } else if (acctInfo.salaryStatus === dividendConfig.getByName('APPLIED').id) {
      var self = this;
      TabView.prototype.onRender.apply(self, arguments);
    // }

  },

  //签约日薪
  addUserHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

    var $dialog = Global.ui.dialog.show({
      title: '签约日薪用户',
      body: '<div class="js-ac-add-container"></div>',
      modalClass: 'ten',
      size: 'modal-lg',
      footer: ''
    }).on('hidden.modal', function () {
      // self.render();
      $(this).remove();
    });

    var $container = $dialog.find('.js-ac-add-container');

    var signedView = new SignedView({
      el: $container,
    })
      .render()
      .on('hide', function() {
        $dialog.modal('hide');
      });

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      signedView.destroy();
    });
    $dialog.find('.js-ac-next').on('click',function(){
      var conf = signedView.getConfigDataFormTable();
      if(conf){
        self.signAgreementXhr(conf).done(function(res){
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
});

module.exports = TopLevelView;

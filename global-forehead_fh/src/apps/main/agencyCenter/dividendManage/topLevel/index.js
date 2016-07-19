"use strict";

var TabView = require('com/tabView');

var SelfView = require('./self');
var LowLevelView = require('./lowLevel');
var UserManageView = require('./userManage');

var SignedView = require('./../signed');

var TopLevelView = TabView.extend({

  className: 'ac-topLevel',

  startOnLoading: true,

  events: {
    'click .js-ac-add-user': 'addUserHandler'
  },

  getConfXhr: function() {
    return Global.sync.ajax({
      url: '/fund/divid/conf.json'
    });
  },

  initialize: function() {
    _(this.options).extend({
      tabs: [
        {
          label: '我的分红',
          name: 'self',
          id: 'jsAcSelf',
          view: SelfView
        },
        {
          label: '下级分红发放',
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
      ],
      append: '<div class="js-ac-add-user cursor-pointer ac-add-user pull-right text-pleasant">' +
      '<span class="sfa sfa-divid-add vertical-bottom"></span> ' +
      '签约分红用户</div>' +
      '</div>'
    });
  },

  onRender: function() {
    var self = this;

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
  },

  //event handlers

  addUserHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

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
      dividConf: this.dividConf
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
  }
});

module.exports = TopLevelView;

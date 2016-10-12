"use strict";

var TabView = require('com/tabView');

var findPwdView = require('accountCenter/views/passwordManage-findPwd');

var passwordManageView = TabView.extend({

  events: {
    
  },

  className: 'as-passwordManage',

  initialize: function() {
    _(this.options).extend({
      tabs: [
        {
          label: '找回资金密码',
          name: 'modifyFindPwd',
          id: 'jsFindManage',
          router: 'as/pz',
          view: findPwdView
        }
      ]
    });
  }
});

module.exports = passwordManageView;

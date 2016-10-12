"use strict";

require('./index.scss');

var viewList = {
  info: require('accountCenter/personalInfo'),
  loginPwd: require('accountCenter/loginPwd'),
  fundPwd: require('accountCenter/fundPwd'),
  emailBinding: require('accountCenter/emailBinding'),
  securityQuestion: require('accountCenter/securityQuestion')
};

var PersonalManageView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
  },

  onRender: function() {
    this.$mainContent = this.$('.js-personal-main');
    this.options.type = this.options.type ? this.options.type : 'info';

    var MainView = viewList[this.options.type];

    this.$mainContent.html(new MainView().render().$el);
  }
});

module.exports = PersonalManageView;

"use strict";

require('./index.scss');

var viewList = {
  info: require('accountCenter/personalInfo'),
  loginPwd: require('accountCenter/loginPwd'),
  fundPwd: require('accountCenter/fundPwd'),
  forgetFundPwd: require('accountCenter/fundPwd/forgetFundPwd'),
  emailBinding: require('accountCenter/emailBinding'),
  securityQuestion: require('accountCenter/securityQuestion')
};

var PersonalManageView = Base.ItemView.extend({

  template: require('./index.html'),



  onRender: function() {
    var self = this;
    this.$mainContent = this.$('.js-personal-main');
    this.options.type = this.options.type ? this.options.type : 'info';

    this.$personaInfo = this.$('.js-ac-personal-info');
    this.$fundPwd = this.$('.js-ac-fund-pwd');
    this.$security = this.$('.js-ac-security');
    this.$email = this.$('.js-ac-email');

    var MainView = viewList[this.options.type];

    this.$mainContent.html(new MainView().render().$el);

    this.subscribe('states', 'states:updating', function(model) {
      self.renderStates(model);
    });
  },

  renderStates: function(model) {
    var states = model.toJSON();
    this.$personaInfo.toggleClass('btn-pink', !states.complete)
      .text(states.complete ? '修改' : '未完善').removeClass('hidden');
    this.$fundPwd.toggleClass('btn-pink', !states.hasMoneyPwd)
      .text(states.hasMoneyPwd ? '修改' : '点击设置').removeClass('hidden');
    this.$security.toggleClass('btn-pink', !states.hasSecurity)
      .text(states.hasSecurity ? '修改' : '点击设置').removeClass('hidden');
    this.$email.toggleClass('btn-pink', !states.hasEmail)
      .text(states.hasEmail ? '修改' : '点击设置').removeClass('hidden');
  }
});

module.exports = PersonalManageView;

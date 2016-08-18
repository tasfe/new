"use strict";

require('./index.scss');

var AgreementView = require('./agreement');

var TopLevelView = require('./topLevel');

var FirstLevelView = require('./firstLevel');

var dividendConfig = require('./dividendConfig');

var levelConfig = require('./levelConfig');

var DividendManageView = Base.ItemView.extend({

  template: '',

  className: 'ac-dm',

  officialAgreementTpl: _(require('./official-agreement.html')).template(),

  events: {
    'click .js-ac-check-agreement': 'checkAgreementHandler'
  },

  onRender: function() {
    var self = this;

    Global.m.oauth.check()
      .done(function() {
        self._render();
      });
  },

  _render: function() {
    var acctInfo = Global.memoryCache.get('acctInfo');

    if (acctInfo.dividendStatus === dividendConfig.getByName('APPLYING').id) {
      //申请中
      this.$el.html(new AgreementView().render().$el);
    } else if (acctInfo.dividendStatus === dividendConfig.getByName('APPLIED').id) {
      //已开通
      //if (acctInfo.userGroupLevel === levelConfig.getByName('TOP').id) {
      //  this.$el.html(new TopLevelView().render().$el);
      //} else {
      //  this.$el.html(new FirstLevelView().render().$el);
      //}
      
      if (acctInfo.userRebate >= 128) {
        this.$el.html(new TopLevelView().render().$el);
      } else {
        this.$el.html(new FirstLevelView().render().$el);
      }
    }
  },

  checkAgreementHandler: function(e) {
    var $target = $(e.currentTarget);

    var $dialog = Global.ui.dialog.show({
      title: '繁华娱乐分红协议条款',
      size: 'modal-lg',
      body: '<div class="ac-official">' + this.officialAgreementTpl() + '</div>',
      footer: ''
    });

    $dialog.on('hidden.modal', function() {
      $(this).remove();
    });
  }
});

module.exports = DividendManageView;

"use strict";

require('./index.scss');

var AgreementView = require('./agreement');

var SelfView = require('./topLevel/self');
var TopView = require('./topLevel');

var FirstLevelView = require('./firstLevel');

var dividendConfig = require('./dividendConfig');

var levelConfig = require('./levelConfig');

var DividendManageView = Base.ItemView.extend({

  template: '',

  className: 'ac-dm',

  officialAgreementTpl: _(require('./official-agreement.html')).template(),

  //events: {
  //  'click .js-ac-check-agreement': 'checkAgreementHandler'
  //},


  onRender: function() {
    var self = this;
    self._render();
  },


  _render: function() {
    var acctInfo = Global.memoryCache.get('acctInfo');

    if (acctInfo.dividendStatus === dividendConfig.getByName('APPLYING').id) {//APPLYING
      //申请中
      this.$el.html(new AgreementView().render().$el);
    } else if (acctInfo.dividendStatus === dividendConfig.getByName('APPLIED').id) {
      //已开通
      //if (acctInfo.userGroupLevel === levelConfig.getByName('TOP').id) {
        this.$el.html(new TopView().render().$el);
      //} else {
      //  this.$el.html(new FirstLevelView().render().$el);
      //}
    }
  }


});

module.exports = DividendManageView;

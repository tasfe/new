"use strict";

var StatisticView = require('./../statistic');

var levelConfig = require('./../levelConfig');

var FirstLevelView = Base.ItemView.extend({

  template: require('./index.html'),

  agreementContentTpl: _(require('./../agreement-content.html')).template(),

  startOnLoading: true,

  getXhr: function() {
    return Global.sync.ajax({
      url: '/fund/divid/info.json'
    });
  },

  onRender: function() {
    var self = this;

    this.getXhr()
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        if (res && res.result === 0) {
          self._render(res.root);
        }
      });
  },

  _render: function(data) {
    //this.$('.js-ac-agreement-content').html(this.agreementContentTpl({
    //  agreement: data.agreement
    //}));

    this.$('.js-ac-effect-date').text(_(data.effectDate).toDate('YYYY年MM月DD日'));

    this.$('.js-ac-statistic').html(new StatisticView({
      level: levelConfig.getByName('LEVEL_ONE'),
      dividList: data.dividList,
      dividendUrl: '/fund/divid/subdividdetail1.json'
    }).render().$el);
  }
});

module.exports = FirstLevelView;

"use strict";

require('./index.scss');

var TopProfileView = Base.ItemView.extend({
  template: require('./index.html'),

  events: {},

  timer: null,

  getTeamInfoXhr: function() {
    var timestamp = Date.parse(new Date());
    var now = _(timestamp).toDate();
    return Global.sync.ajax({
      url: '/info/teamreport/subuserstat.json',
      data: {
        'startTime': now,
        'endTime': now
      }
    });
  },

  onRender: function() {
    var self = this;

    this.$betTotal = this.$('.js-team-bet-total');
    this.$bonusTotal = this.$('.js-team-bonus-total');
    this.$activityTotal = this.$('.js-team-activity-total');
    this.$profitTotal = this.$('.js-team-profit-total');

    this.renderData();

    this.timer = setInterval(function() {
      self.renderData();
    }, 60000);
  },

  renderData: function() {
    var self = this;
    this.getTeamInfoXhr()
      .done(function (res) {
        var data = res && res.root || {};
        if (res && res.result === 0) {
          self.$betTotal.text(_(data.todayBetTotal).convert2yuan());
          self.$bonusTotal.text(_(data.todayPrizeTotal).convert2yuan());
          self.$activityTotal.text(_(data.todayActivityTotal).convert2yuan());
          self.$profitTotal.text(_(data.todayProfitTotal).convert2yuan());
        }
      });
  },

  destroy: function() {
    Base.ItemView.prototype.destroy.apply(this, arguments);
    clearInterval(this.timer);
  }
});

module.exports = TopProfileView;

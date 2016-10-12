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

    this.$balanceTotal = this.$('.js-team-balance-total');
    this.$todayRegTotal = this.$('.js-team-today-reg-total');
    this.$todayOnlineTotal = this.$('.js-team-today-online-total');
    this.$todayBonusTotal = this.$('.js-team-today-bonus-total');

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
          self.$balanceTotal.text(_(data.balanceTotal).convert2yuan());
          self.$todayRegTotal.text( data.todayRegTotal);
          self.$todayOnlineTotal.text( data.todayOnlineTotal);
          self.$todayBonusTotal.text( data.todayBonusTotal);
        }
      });
  },

  destroy: function() {
    Base.ItemView.prototype.destroy.apply(this, arguments);
    clearInterval(this.timer);
  }
});

module.exports = TopProfileView;

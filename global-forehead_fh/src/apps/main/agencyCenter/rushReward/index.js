"use strict";

var levelConfig = require('./levelConfig');

var RushRewardView = Base.ItemView.extend({

  template: require('./index.html'),

  startOnLoading: true,

  className: 'ac-rush-reward',

  events: {
    'click .js-get-reward': 'getRewardHandler'
  },

  getInfoXhr: function() {
    return Global.sync.ajax({
      url: '/info/upgradeactivity/info.json',
      data: {
        activityId: 15
      }
    });
  },

  getRewardXhr: function(data) {
    return Global.sync.ajax({
      url: '/info/upgradeactivity/doget.json',
      data: _(data).extend({
        activityId: 15
      })
    });
  },

  onRender: function() {
    var self = this;
    this.$grid = this.$('.js-reward-grid');

    this.getInfoXhr()
      .always(function(res) {
        self.loadingFinish();
      })
      .done(function(res) {
        var data;
        if (res && res.result === 0) {
          data = res.root || {};
          self.renderGrid(data.cfgList, data);
        }
      });
  },

  renderGrid: function(list, data) {
    var self = this;
    var html = '<tr><td>试用期</td><td>10W≤a</td>';
    html += '<td>' + _(data.rebate).formatDiv(10) + '</td>';
    html += '<td>' + _(data.bonus).formatDiv(100) + '%</td>';
    html += '<td>无</td>';
    html += '<td>--</td>';


    html += _(list).chain().sortBy(function(info) {
      return info.type;
    }).map(function(info) {
      var html = ['<tr>'];
      var formatMinSales;
      var formatMaxSales;
      html.push('<td rowspan="2">' + levelConfig.toZh(info.type) + '</td>');

      var scope = '<td rowspan="2">';
      if (info.minSales > 0) {
        formatMinSales = _(info.minSales).convert2yuan();
        if (formatMinSales > 10000) {
          formatMinSales = _(formatMinSales).formatDiv(10000) + 'W';
        }
        scope += formatMinSales + '≤';
      }
      scope += 'a';

      if (info.maxSales > 0) {
        formatMaxSales = _(info.maxSales).convert2yuan();
        if (formatMaxSales > 10000) {
          formatMaxSales = _(formatMaxSales).formatDiv(10000) + 'W';
        }
        scope += '<' + formatMaxSales;
      }
      html.push(scope + '</td>');

      html.push('<td rowspan="2">' + _(data.rebate).formatDiv(10) + '</td>');
      html.push('<td rowspan="2">' + _(data.bonus).formatDiv(100) + '%</td>');

      html.push('<td>升级奖</td>');
      html.push('<td class="text-hot">' + _(info.upBonus).convert2yuan() + '元</td>');
      html.push(self.getRewardBtn(info.upStatus, info.type, 1));

      html.push('</tr>');

      html.push('<tr>');

      html.push('<td>保级奖</td>');

      if (info.type > 3) {
        html.push('<td class="text-hot">增加' + _(info.curBonus).convert2yuan() + '%分红</td>');
      } else {
        html.push('<td class="text-hot">' + _(info.curBonus).convert2yuan() + '元</td>');
      }
      html.push(self.getRewardBtn(info.curStatus, info.type, 2));

      html.push('</tr>');

      return html;
    }).value().join('');

    this.$grid.html(html);
  },

  getRewardBtn: function(status, grade, bonusType) {
    if (status === 0) {
      return '<td>未达标</td>';
    } else if (status === 1) {
      return '<td><button class="js-get-reward btn btn-sm no-radius" data-bonus-type="' + bonusType + '" data-grade="' + grade + '">领取奖励</button></td>';
    } else if (status === 2) {
      return '<td><button class="btn btn-pure btn-sm no-radius" disabled>已领取</button></td>';
    } else {
      return '<td></td>';
    }
  },


  getRewardHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

    this.getRewardXhr({
      bonusType: $target.data('bonusType'),
      grade: $target.data('grade')
    })
      .done(function(res) {
        if (res && res.result === 0) {
          Global.ui.notification.show('领取成功，请留意账户变化！');
          self.render();
        } else {
          Global.ui.notification.show(res.msg);
        }
      });
  }
});

module.exports = RushRewardView;

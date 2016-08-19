"use strict";

var StatisticView = require('./../statistic');

var levelConfig = require('./../levelConfig');

var SelfView = Base.ItemView.extend({

  template: require('./self.html'),

  startOnLoading: true,

  getInfoXhr: function() {
    return Global.sync.ajax({
      url: '/fund/divid/info0.json'
    });
  },

  applyXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/get.json',
      data: data
    });
  },

  onRender: function() {
    var self = this;

    this.getInfoXhr()
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        if (res && res.result === 0) {
          self._render(res.root);
        }
      });
  },

  _render: function(info) {
    var self = this;

    var strContent = '';
    var num = 1;
    _(info.dividConf).each(function(divid) {
      num++;
      strContent += '<tr><td>≥ ' + _(divid.betTotal).convert2yuan() + '元</td><td>' + _(divid.divid).formatDiv(100) + '%</td></tr>';
    });

    var str = '<tr><td>团队投注额（日）平均</td><td>分红比例</td><td rowspan="' + num + '"><p>1、每半个月为一个分红周期，不累计。</p>';
    str += '<p>2、每个月的1号和16号为分红分领取时间。</p><p>3、每个分红周期的分红比例，据分红制度表自动计算。</p></td></tr>';

    this.$('.js-ac-dividConf').html(str + strContent);

    var statisticView = new StatisticView({
      level: levelConfig.getByName('TOP'),
      dividList: info.dividList
    })
    .render()
    .on('click:op', function(e, data) {
        var $target = $(e.currentTarget);
        $target.button('loading');

        self.applyXhr({
          dividId: data.dividId
        })
          .always(function() {
            $target.button('reset');
          })
          .done(function(res) {
            if (res && res.result === 0) {
              Global.ui.notification.show('申请成功！<br />等待平台审核后会自动发放到您的平台账户。');
              self.refresh();
            }
          });
      });
    this.$('.js-ac-statistic').html(statisticView.$el);
  }
});

module.exports = SelfView;

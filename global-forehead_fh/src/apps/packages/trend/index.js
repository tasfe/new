"use strict";

require('./index.scss');
require('./../misc/common-init.js');

var ticketConfig = require('./config');
var Draw = require('./draw-line');

var BtnGroup = require('com/btnGroup');

$.widget('gl.trend', {

  template: require('./index.html'),

  tableTpl: _(require('./table.html')).template(),
  tableTpl_mmc: _(require('./table-mmc.html')).template(),

  getDataXhr: function(data) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/trend.json',
      data: data
    });
  },

  _create: function () {
    var self = this;
    this.ticketId = Number(_.getUrlParam('ticketId'));

    this.ticketInfo = ticketConfig.get(this.ticketId);
    this.element.html(_(this.template).template()({
      zhName: this.ticketInfo.zhName
    }));

    this.$btnGroup = this.element.find('.js-plan-select');
    this.$planTable = this.element.find('.js-plan-table');

    var btnConfig = [
      {
        title: '最近30期',
        value: 30,
        active: true
      },
      {
        title: '最近50期',
        value: 50
      },
      {
        title: '最近100期',
        value: 100
      }
    ];

    if (this.ticketInfo.oneDay) {
      btnConfig.push({
        title: '最近一天',
        value: this.ticketInfo.oneDay
      });
    }

    this.btnGroup = new BtnGroup({
      el: this.$btnGroup,
      inputName: 'pageSize',
      btnGroup: btnConfig,
      onBtnClick: function(offset) {
        self.update(offset);
      }
    }).render();

    resize();

    function resize(){
      window.onresize = function() {
        window.location.href = window.location.href;
      };
    }
  },

  draw: function() {
    var self = this;
    var $body = $('body');

    if($body.width() < 1366) {
      $body.width(1366);
      this.element.find('.history_code').css('width', this.element.find("#chartsTable").width());
    }

    var colors = ['#FFAAAA', '#B9B9FF', '#FFAAAA', '#B9B9FF', '#FFAAAA'];
    var num = this.ticketInfo.num.length;

    $body.find('canvas').remove();
    Draw.Chart.init();
    Draw.DrawLine.bind("chartsTable","has_line");

    _(self.ticketInfo.count).times(function(index) {
      Draw.DrawLine.color(colors[index]);
      if(self.ticketId===19 || self.ticketId===20){//MMC不显示期号
        Draw.DrawLine.add((parseInt(index) * num + 5 + 0), 2, num, 0);
      }else{
        Draw.DrawLine.add((parseInt(index) * num + 5 + 1), 2, num, 0);
      }
    });

    Draw.DrawLine.draw(Draw.Chart.ini.default_has_line);
  },

  update: function(pageSize) {
    var self = this;
    this.getDataXhr({
      ticketId: this.ticketId,
      pageSize: pageSize
    })
      .done(function(res) {
        var list;
        if (res && res.result === 0) {
          list = res.root.openedList || [];
          var temp = self.tableTpl;
          if(self.ticketId===19 || self.ticketId===20){//MMC不显示期号
            temp = self.tableTpl_mmc;
          }
          self.$planTable.html(temp({
            positions: self.ticketInfo.positions,
            isSuper: self.ticketInfo.isSuper,
            num: self.ticketInfo.num,
            count: self.ticketInfo.count,
            list: list
          }));

          self.draw();
        }
      });
  }
});

$(document).ready(function() {
  Global.m.oauth.check().done(function(res) {
    $('.js-package').trend().removeClass('package-main');
  });
});

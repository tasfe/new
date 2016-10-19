"use strict";

var BtnGroup = require('com/btnGroup');

var PlanListView = Base.ItemView.extend({
  template: require('./index.html'),

  events: {

  },

  getListXhr: function(type) {
    return Global.sync.ajax({
      url: '/ticket/betManager/projectlist.json',
      data: {
        status: type
      }
    });
  },

  onRender: function() {
    this.$typeGroup = this.$('.js-bb-type-group');
    this.$planList = this.$('.js-bb-plan-list');

    this.btnGroup = new BtnGroup({
      el: this.$typeGroup,
      btnStyle: 'btn-group-pink btn-xs btn-circle btn-xs-long-p m-right-xs',
      btnGroup: [
        {
          title: '进行中',
          value: 0,
          active: true
        },
        {
          title: '已结束',
          value: 1
        }
      ],
      onBtnClick: function(offset) {
        // self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
        // self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset === -1 ? -1 : 0, 'days').endOf('day'));
        // (self.$('.js-ac-search-form') && !self.firstTime) && self.$('.js-ac-search-form').trigger('submit');
        // return false;
      }
    }).render();

    this.renderGrid(1, true);
  },

  renderGrid: function(type, init) {
    var self = this;

    if (init) {
      this.$planList.staticGrid({
        tableClass: 'table table-bordered table-center',
        wrapperClass: '',
        // height: this.options.height,
        colModel: [
          {label: '计划号', name: '', width: '10%', formatter: function(val, index) {
            return index + 1;
          }},
          {label: '投注彩种', name: 'ticketName', width: '10%'},
          {label: '投注开始时间', name: 'startTime', width: '15%'},
          {label: '已追/总期数', name: 'ticketChaseAllPeriods', width: '10%', formatter: function(val, index, info) {
            return info.finishPeriods + '/' + info.ticketChaseAllPeriods;
          }},
          {label: '已投/总轮', name: 'bonusMax', width: '10%', formatter: function(val, index, info) {
            return info.finishTimes + '/' + (info.times + 1);
          }},
          {label: '已中奖金额', name: 'prizeTotal', width: '10%', formatter: function(val, index, info) {
            return _(val).convert2yuan();
          }},
          {label: '当前状态', name: 'status', width: '10%', formatter: function(val, index, info) {
            return val;
          }},
          {label: '操作', name: '', width: '10%', formatter: function(val, index, thisRow) {
            return '<button type="button" class="js-bb-plan-delete btn btn-link">删除</button>';
          }}
        ]
      });
    }

    this.getListXhr(type)
      .done(function(res) {
        if (res && res.result === 0) {
          self.$planList.staticGrid('renderRow', res.root || []);
        } else {
          Global.ui.notification.show('获取列表失败！错误原因：' + res.msg || '');
        }
      });
  }
});

module.exports = PlanListView;
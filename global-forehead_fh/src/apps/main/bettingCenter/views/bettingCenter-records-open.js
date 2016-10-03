"use strict";

var ticketConfig = require('skeleton/misc/ticketConfig');

var BettingRecordsView = Base.ItemView.extend({

  template: '',

  events: {
  },

  height: 340,

  tableClass: 'table table-center',

  initialize: function() {
  },

  onRender: function() {
    this.renderDrawRecords();
  },

  renderDrawRecords: function() {
    if (!this.drawRecords) {
     var gridTable = {};
     var sscTicketIdArr = _(ticketConfig.getSccList()).pluck('id');
     var c115TicketIdArr = _(ticketConfig.getChoose5List()).pluck('id');
     var dpcTicketIdArr = _(ticketConfig.getLowList()).pluck('id');
     if(_(sscTicketIdArr).indexOf(this.options.ticketId)!==-1){
       gridTable = this._renderSSCLotteryRecord();
     }else if(_(c115TicketIdArr).indexOf(this.options.ticketId)!==-1){
       gridTable = this._render115LotteryRecord();
     }else if(_(dpcTicketIdArr).indexOf(this.options.ticketId)!==-1){
       gridTable = this._renderDPCLotteryRecord();
     }
     this.drawRecords = this.$el.staticGrid(gridTable).staticGrid('instance');
    } else {
     this.drawRecords.update();
    }
  },

  _renderSSCLotteryRecord: function () {
    return {
      tableClass: this.tableClass,
      colModel: [
        {label: '期号', name: 'ticketPlanId', formatter: function(val, prop, info) {
          return '第' + val + '期';
        }, width: '45%'},
        {label: '开奖号码', name: 'ticketOpenNum', width: '35%', formatter: function(val) {
          var html = ['<div class="open-nums">'];
          var numList = val.split(',');
          _(numList).each(function(num) {
            html.push('<span class="key-num">' + num + '</span>');
            // html.push('<span>' + num + '</span>');
          });
          html.push('</div>');

          return html.join('');
        }},
        {label: '形态', name: 'type', width: '20%'}
        //{label: '开奖号', name: 'ticketOpenNum', width: '24%'},
        //{label: '前三', name: 'qianSan', width: '17%'},
        //{label: '后三', name: 'houSan', width: '17%', formatter: function (val) {
        //  return val;
        //}}
      ],
      url: '/ticket/ticketmod/openhistory.json',
      emptyTip: '最近无开奖记录',
      abort: false,
      initRemote: false,
      // showHeader: false,
      height: this.height,
      data: {
        pageSize: 30,
        ticketId: this.options.ticketId
      },
      dataProp: 'root.openedList'
    };
  },
  _render115LotteryRecord: function () {
    return {
      tableClass: this.tableClass,
      colModel: [
        {label: '期号', name: 'ticketPlanId', width: '45%'},
        {label: '开奖号码', name: 'ticketOpenNum', width: '35%'},
        {label: '形态', name: 'type', width: '20%'}
      ],
      url: '/ticket/ticketmod/openhistory.json',
      abort: false,
      height: this.height,
      initRemote: false,
      // showHeader: false,
      data: {
        pageSize: 84,
        ticketId: this.options.ticketId
      },
      dataProp: 'root.openedList'
    };
  },
  _renderDPCLotteryRecord: function() {
    return {
      tableClass: this.tableClass,
      colModel: [
        {label: '期号', name: 'ticketPlanId', width: '45%', formatter: function(val) {
          return val.substring(4);
        }},
        // {label: '期号', name: 'ticketPlanId', width: '45%'},
        {label: '开奖号码', name: 'ticketOpenNum', width: '35%'},
        {label: '形态', name: 'type', width: '20%'}
        // {label: '开奖号', name: 'ticketOpenNum', width: '30%'},
        // {label: '三星', name: 'qianSan', width: '20%'}
      ],
      url: '/ticket/ticketmod/openhistory.json',
      abort: false,
      height: this.height,
      // showHeader: false,
      initRemote: false,
      data: {
        pageSize: 20,
        ticketId: this.options.ticketId
      },
      dataProp: 'root.openedList'
    };
  },

  update: function() {
     this.renderDrawRecords();
  }
});

module.exports = BettingRecordsView;

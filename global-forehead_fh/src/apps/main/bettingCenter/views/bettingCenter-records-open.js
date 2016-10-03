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
    var self = this;

    return {
      tableClass: this.tableClass,
      colModel: [
        {label: '期号', name: 'ticketPlanId', formatter: function(val, prop, info) {
          return '第' + val + '期';
        }, width: '45%'},
        {label: '开奖号码', name: 'ticketOpenNum', width: '35%', formatter: function(val) {
          var html = ['<div class="open-nums">'];
          var numList = val.split(',');
          _(numList).each(function(num, index) {
            if (self.playRule && self.playRule.formType && self.playRule.keyPosition[index]) {
              html.push('<span class="key-num">' + num + '</span>');
            } else {
              html.push('<span>' + num + '</span>');
            }
          });
          html.push('</div>');

          return html.join('');
        }},
        {label: '形态', name: 'ticketOpenNum', width: '20%', formatter: function(val) {
          return self.getFormType(val, self.playRule && self.playRule.keyPosition, self.playRule && self.playRule.formType);
        }}
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
  },

  updateByPlayRule: function(playRule) {
    this.playRule = playRule;

    this.drawRecords.reformat();
  },

  //取得形态
  getFormType: function(nums, keyPosition, type) {
    var formType;
    var numList = nums.split(',');
    switch (type) {
      case 'GROUP':
        formType = this.getFormGroup(numList, keyPosition);
        break;
      case 'PAIR':
        formType = this.getFormPair(numList, keyPosition);
        break;
      case 'DRAGON':
        formType = this.getFormDragon(numList, keyPosition);
        break;
      default:
        formType = '';
        break;
    }

    return formType;
  },

  getFormGroup: function(numList, keyPosition) {
    var formType = '';

    var tempList = _(numList).chain().filter(function(val, index) {
      return keyPosition[index];
    }).union().value('');
    switch (tempList.length) {
      case 1:
        formType = '豹子';
        break;
      case 2:
        formType = '组三';
        break;
      case 3:
        formType = '组六';
        break;
      default:
        break;
    }

    return formType;
  },

  getFormPair: function(numList, keyPosition) {
    var formType = '';

    var tempList = _(numList).chain().filter(function(val, index) {
      return keyPosition[index];
    }).union().value('');
    switch (tempList.length) {
      case 1:
        formType = '对子';
        break;
      case 2:
        formType = '单号';
        break;
      default:
        break;
    }

    return formType;
  },

  getFormDragon: function(numList, keyPosition) {
    var formType = '';

    var tempList = _(numList).filter(function(val, index) {
      return keyPosition[index];
    });
    if (tempList[0] > tempList[1]) {
      formType = '<div class="text-circle text-circle-xs text-circle-hot">龙</div>';
    } else if (tempList[0] < tempList[1]) {
      formType = '<div class="text-circle text-circle-xs text-circle-sky">虎</div>';
    } else {
      formType = '<div class="text-circle text-circle-xs text-circle-peaceful">和</div>';
    }

    return formType;
  }
});

module.exports = BettingRecordsView;

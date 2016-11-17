"use strict";

var ticketConfig = require('skeleton/misc/ticketConfig');

var BettingRecordsView = Base.ItemView.extend({

  template: '',

  height: 225,

  tableClass: 'table table-center',

  url: '/ticket/ticketmod/openhistory.json',

  GridOps: {
    ssc: {
      pageSize: 30,
      formats: [
        function(val) {
          return '第' + val + '期';
        },
        function(val) {
          var html = ['<div class="open-nums">'];
          var numList = val.split(',');
          _(numList).each(function (num, index) {
            if (this.playRule && this.playRule.keyPosition && this.playRule.keyPosition[index]) {
              html.push('<span class="key-num">' + num + '</span>');
            } else {
              html.push('<span>' + num + '</span>');
            }
          }, this);
          html.push('</div>');

          return html.join('');
        },
        function(val) {
          return this.getFormType(val, this.playRule && this.playRule.keyPosition, this.playRule && this.playRule.formType);
        }
      ]
    },
    '115': {
      pageSize: 84
    },
    DPC: {
      pageSize: 20,
      formats: [
        function (val) {
          return val.substring(4);
        },
        function(val) {
          var html = ['<div class="open-nums">'];
          var numList = val.split(',');
          _(numList).each(function (num, index) {
            if (this.playRule && this.playRule.keyPosition && this.playRule.keyPosition[index] &&  this.playRule.keyPosition.indexOf(null) > -1) {
              html.push('<span class="key-num">' + num + '</span>');
            } else {
              html.push('<span>' + num + '</span>');
            }
          }, this);
          html.push('</div>');

          return html.join('');
        },
        function(val) {
          return this.getFormType(val, this.playRule && this.playRule.keyPosition, this.playRule && this.playRule.formType);
        }
      ]
    },
    pk10: {
      pageSize: 20,
      formats: [
        null,
        function(val) {
          var nums = val.split('\,');
          if(nums.length === 10) {
            nums = _(nums).map(function(item) {
              if(item.indexOf('0') === 0) {
                return item.substr(1);
              } else {
                return item;
              }
            })
          }
          val = nums.join(',');
          return val;
        }
      ]
    }
  },

  onRender: function () {
    // this.renderDrawRecords();
  },

  renderDrawRecords: function () {
    if (!this.drawRecords) {
      var gridTable = {};
      var sscTicketIdArr = _(ticketConfig.getSccList()).pluck('id');
      var c115TicketIdArr = _(ticketConfig.getChoose5List()).pluck('id');
      var dpcTicketIdArr = _(ticketConfig.getLowList()).pluck('id');
      var bjpk10TicketIdArr = _(ticketConfig.getHappyList()).pluck('id');
      var threeDTicketIdArr = _(ticketConfig.get3DList()).pluck('id');

      if (_(sscTicketIdArr).contains(this.options.ticketId)) {
        this.gridOps = this.GridOps['ssc'];
      } else if(_(c115TicketIdArr).contains(this.options.ticketId)){
        this.gridOps = this.GridOps['115'];
      } else if(_(dpcTicketIdArr).contains(this.options.ticketId)){
        this.gridOps = this.GridOps['DPC'];
      } else if(_(bjpk10TicketIdArr).indexOf(this.options.ticketId)!==-1) {
        this.gridOps = this.GridOps['pk10'];
      }
      gridTable = this.generateGridOptions(this.gridOps);
      this.drawRecords = this.$el.staticGrid(gridTable).staticGrid('instance');
    } else {
      this.drawRecords.update();
    }
  },

  generateGridOptions: function(ops) {
    var self = this;
    var options = {
      tableClass: this.tableClass,
      url: this.url,
      // emptyTip: '最近无开奖记录',
      emptyTip: '',
      abort: false,
      height: this.height,
      colModel: [],
      data: {
        pageSize: ops.pageSize,
        ticketId: this.options.ticketId
      },
      dataProp: 'root.openedList'
    };

    options.colModel.push({
      label: '期号',
      name: 'ticketPlanId',
      width: '45%',
      formatter: ops.formats && ops.formats[0] ? function () {
        return ops.formats[0].apply(self, arguments);
      } : null
    });

    options.colModel.push({
      label: '开奖号码',
      name: 'ticketOpenNum',
      width: '35%',
      formatter: ops.formats && ops.formats[1] ? function () {
        return ops.formats[1].apply(self, arguments);
      }: null
    });

    if (this.playRule && this.playRule.formType) {
      options.colModel.push({
        label: '形态',
        name: 'ticketOpenNum',
        width: '20%',
        formatter: ops.formats && ops.formats[2] ? function () {
          return ops.formats[2].apply(self, arguments);
        }: null
      });
    }

    return options;
  },

  update: function () {
    this.renderDrawRecords();
  },

  updateByPlayRule: function (playRule) {
    this.playRule = playRule;

    if (this.drawRecords) {
      this.drawRecords.reformat(this.generateGridOptions(this.gridOps));
    }
  },

  //取得形态
  getFormType: function (nums, keyPosition, type) {
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

  getFormGroup: function (numList, keyPosition) {
    var formType = '';

    var tempList = _(numList).chain().filter(function (val, index) {
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

  getFormPair: function (numList, keyPosition) {
    var formType = '';

    var tempList = _(numList).chain().filter(function (val, index) {
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

  getFormDragon: function (numList, keyPosition) {
    var formType = '';

    var tempList = _(numList).filter(function (val, index) {
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

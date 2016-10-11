"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');
var BtnGroup = require('com/btnGroup');

var betStatusConfig = require('userCenter/misc/betStatusConfig');

var RechargeRecordsView = SearchGrid.extend({

  template: require('./rechargeRecords.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: '账号',
          width: '13%'
        },
        {
          name: '交易流水号',
          width: '22%'
        },
        {
          name: '充值时间',
          width: '20%'
        },
        {
          name: '充值方式',
          width: '10%'
        },
        {
          name: '充值金额',
          width: '12%',
          sortable: true,
          id: 0
        },
        {
          name: '账户余额',
          width: '13%',
          sortable: true,
          id: 1
        },
        {
          name: '支付状态',
          width: '10%'
        }
      ],
      gridOps: {
        emptyTip: '没有充值记录'
      },
      ajaxOps: {
        url: '/fund/recharge/rechargelist.json',
        abort: false
      },
      // viewType: 'team',
      reqData: {
        subUser: 0
      },
      listProp: 'root.rechargeList',
      height: 315
    });
  },

  onRender: function() {
    var self = this;
    this.$('.js-pf-search-grid').addClass('bc-report-table');
    this.$btnGroup = this.$('.js-ac-btnGroup');
    this.$timeset = this.$('.js-ac-timeset');

    this.timeset = new Timeset({
      el: this.$timeset,
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      prevClass: 'js-pf'
      // startOps: {
      //   format: 'YYYY-MM-DD'
      // },
      // endOps: {
      //   format: 'YYYY-MM-DD'
      // }
    }).render();

    this.timeset.$startDate.on('dp.change', function() {
      if(self.btnGroup) {
        self.btnGroup.clearSelect();
      }
    });

    this.timeset.$endDate.on('dp.change', function() {
      if(self.btnGroup) {
        self.btnGroup.clearSelect();
      }
    });

    this.btnGroup = new BtnGroup({
      el: this.$btnGroup,
      btnGroup: [
        {
          title: '今日',
          value: 0,
          active: true
        },
        {
          title: '昨天',
          value: -1
        },
        {
          title: '本半月',
          value: -15
        },
        {
          title: '本月',
          value: -30
        }
      ],
      onBtnClick: function(offset) {
        self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
        self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset === -1 ? -1 : 0, 'days').endOf('day'));
        (self.$('.js-ac-search-form') && !self.firstTime) && self.$('.js-ac-search-form').trigger('submit');
        return false;
      }
    }).render();
    
    if(this.options.reqData.username){
      this.$('input[name="username"]').val(this.options.reqData.username);
    }
    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.rechargeList).map(function(info, index, list) {
      return {
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    });

    //加上统计行
    this.grid.addFooterRows({
      //trClass: 'tr-footer',
      columnEls: [
        '<div class="text-hot">所有页总计</div>', '', '','',
        '<div class="text-hot">' + _(gridData.amountTotal).fixedConvert2yuan() + '</div>',
        '',''
      ]
    })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];
    row.push(rowInfo.userName);
    row.push(rowInfo.tradeNo);
    row.push(_(rowInfo.payTime).toTime());
    row.push(rowInfo.type);
    row.push(_(rowInfo.amount).fixedConvert2yuan());
    row.push(_(rowInfo.balance).fixedConvert2yuan());
    row.push(rowInfo.status);
    return row;
  }
});

module.exports = RechargeRecordsView;

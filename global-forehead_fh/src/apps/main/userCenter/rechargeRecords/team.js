"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var betStatusConfig = require('userCenter/misc/betStatusConfig');

var RechargeRecordsView = SearchGrid.extend({

  template: require('./index.html'),

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
          name: '状态',
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
      viewType: 'team',
      reqData: {
        subUser: 1
      },
      listProp: 'root.rechargeList',
      height: 315
    });
  },

  onRender: function() {
    
    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime()
    }).render();
    
    var plArray=[{id:0,zhName:'单式直选'},{id:1,zhName:'直选和值'}];
    this.$('select[name=payStatus]').html(_(plArray).map(function (qr) {
      return '<option value="'+qr.id+'">'+qr.zhName+'</option>';
    }).join(''));

    var plArray=[{id:0,zhName:'单式直选'},{id:1,zhName:'直选和值'}];
    this.$('select[name=widthdrawStatus]').html(_(plArray).map(function (qr) {
      return '<option value="'+qr.id+'">'+qr.zhName+'</option>';
    }).join(''));

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

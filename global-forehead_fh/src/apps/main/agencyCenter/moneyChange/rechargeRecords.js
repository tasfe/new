"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var betStatusConfig = require('userCenter/misc/betStatusConfig');

var RechargeRecordsView = SearchGrid.extend({

  template: require('./rechargeRecords.html'),

  events: {
    'click .js-excess-cell': 'dateSelectHandler',
    'click .js-toggle-seach': 'toggleseachHandler'
  },

  dateSelectHandler:function (e) {
    var recIndex = $(e.currentTarget).data('index');
    this.$('.js-pf-end-time').val( _(moment().add('days')).toDate() );
    if (recIndex===1){
      this.$('.js-pf-start-time').val( _(moment().add('days')).toDate() );
    }else if (recIndex===2){
      this.$('.js-pf-start-time').val( _(moment().add('days',-3)).toDate() );
    }else if (recIndex===3){
      this.$('.js-pf-start-time').val( _(moment().add('days',-7)).toDate() );
    }
  },

  toggleseachHandler:function () {
    if($('.js-toggle-seach').hasClass('on')) {
      $('.search-condition-table .row2').addClass('hidden');
      $('.js-toggle-seach').removeClass('on')
    } else{
      $('.search-condition-table .row2').removeClass('hidden');
      $('.js-toggle-seach').addClass('on')
    }
  },

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
    this.$('.js-pf-search-grid').addClass('bc-report-table');
    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTime: 'regTimeStart',
      endTime: 'regTimeEnd',
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      size: 'julien-time',
      prevClass: 'js-pf',
      startOps: {
        format: 'YYYY-MM-DD'
      },
      endOps: {
        format: 'YYYY-MM-DD'
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

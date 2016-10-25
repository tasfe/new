"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var betStatusConfig = require('userCenter/misc/betStatusConfig');

var RechargeRecordsView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
    'click .js-excess-cell': 'dateSelectHandler',
    'click .js-toggle-seach': 'toggleseachHandler'
  },

  dateSelectHandler:function (e) {
    this. $('.toggle-athena').removeClass('toggle-athena');
    $(e.currentTarget).addClass('toggle-athena');
    var recIndex = $(e.currentTarget).data('index');
    if (recIndex===1){
      this.$('.js-start-time').val(_(moment().add('days')).toDate()+' 0:00:00');
    }else if (recIndex===2){
      this.$('.js-start-time').val(_(moment().add('days',-3)).toDate()+' 0:00:00');
    }else if (recIndex===3){
      this.$('.js-start-time').val(_(moment().add('days',-7)).toDate()+' 0:00:00');
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
          width: '10%'
        },
        {
          name: '交易流水号',
          width: '18%'
        },
        {
          name: '提现时间',
          width: '18%'
        },
        {
          name: '金额',
          width: '11%',
          sortable: true,
          id: 0
        },
        {
          name: '余额',
          width: '12%',
          sortable: true,
          id: 1
        },
        {
          name: '状态',
          width: '10%'
        },
        {
          name: '备注',
          width: '20%'
        }
      ],
      gridOps: {
        emptyTip: '没有提现记录'
      },
      ajaxOps: {
        url: '/fund/withdraw/withdrawlist.json',
        abort: false
      },
      reqData: {
        subUser: 0
      },
      listProp: 'root.withdrawList',
      height: 330
    });
  },

  onRender: function() {
    this.$('.js-pf-search-grid').addClass('bc-report-table');
    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime()
    }).render();
    if(this.options.reqData.username){
      this.$('input[name="username"]').val(this.options.reqData.username);
    }

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.withdrawList).map(function(info, index, list) {
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
        '<div class="text-hot">所有页总计</div>', '', '',
        '<div class="text-hot">' + _(gridData.amountTotal).fixedConvert2yuan() + '</div>',
        '', '', ''
      ]
    }).hideLoading();

  },

  formatRowData: function(rowInfo) {
    var row = [];
    row.push(rowInfo.userName);
    row.push(rowInfo.tradeNo);
    row.push(_(rowInfo.createTime).toTime());
    row.push(_(rowInfo.amount).fixedConvert2yuan());
    row.push(_(rowInfo.balance).fixedConvert2yuan());
    row.push(rowInfo.status);
    row.push(rowInfo.remark);
    return row;
  }
});

module.exports = RechargeRecordsView;

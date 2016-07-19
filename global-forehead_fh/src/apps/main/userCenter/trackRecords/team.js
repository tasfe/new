"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var trackStatusConfig = require('userCenter/misc/trackStatusConfig');

var TrackRecordsView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
  },

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: '账号',
          width: '10%'
        },
        {
          name: '彩种名称',
          width: '12%'
        },
        {
          name: '已追/总期数',
          width: '12%'
        },
        {
          name: '已投/总金额',
          width: '18%'
        },
        {
          name: '中奖金额',
          width: '12%'
        },
        {
          name: '追号状态',
          width: '8%'
        },
        {
          name: '追号时间',
          width: '15%'
        },
        {
          name: '操作',
          width: '10%'
        }
      ],
      gridOps: {
        emptyTip: '没有追号记录'
      },
      ajaxOps: {
        url: '/ticket/bethistory/userchasehistory.json'
      },
      viewType: 'team',
      reqData: {
        subUser: 1
      },
      tip: '<div class="m-left-md"><span>注意:</span> 追号记录只保留最近30天。</div>',
      height: 310
    });
  },

  onRender: function() {
    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: _(moment().startOf('day')).toTime(),
      endDefaultDate: _(moment().endOf('day')).toTime()
    }).render();
    if(this.options.reqData.username){
      this.$('input[name="username"]').val(this.options.reqData.username);
    }
    this.$('select[name=chaseStatus]').html(_(trackStatusConfig.get()).map(function(betStatus) {
      return '<option value="' + betStatus.id + '">' + betStatus.zhName + '</option>';
    }).join(''));

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.chaseList).map(function(bet, index, betList) {
      return {
        columnEls: this.formatRowData(bet, index, betList),
        dataAttr: bet
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    });

    //加上统计行
    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '<strong>所有页总计</strong>', '', '',
        _(gridData.betMoneyTotal).convert2yuan(),
        _(gridData.prizeMoneyTotal).convert2yuan(),
         '', ''
      ]
    })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];

    row.push(rowInfo.userName);
    row.push(rowInfo.ticketName);
   // row.push(rowInfo.ticketPlanId);
    row.push(rowInfo.chaseBetCount + '/' + rowInfo.chaseAllPeriods);
    row.push('&nbsp;' + _(rowInfo.chaseBetMoney).fixedConvert2yuan() +
      '/' + _(rowInfo.chaseAllMoney).fixedConvert2yuan());
    var status = '';

    if(rowInfo.chasePrizeMoney === 0 || rowInfo.chasePrizeMoney === null ){
      status = '0';
    } else {
      status = '<span class="text-pleasant">' + _(rowInfo.chasePrizeMoney).convert2yuan() + '</span>';
    }

    row.push(status);

    switch(rowInfo.chaseStatus) {
      case 0:
        rowInfo.formatChaseStatus = '未开始';
        break;
      case 1:
        rowInfo.formatChaseStatus = '进行中';
        break;
      case 2:
        rowInfo.formatChaseStatus = '已完成';
        break;
      case 3:
        rowInfo.formatChaseStatus = '已中止';
        break;

    }

    row.push(rowInfo.formatChaseStatus);
    row.push(_(rowInfo.chaseTime).toTime());
    row.push('<a class="router btn-link btn-link-sun" href="' + _.getUrl('/detail/' + rowInfo.ticketTradeNo) + '">查看详情</a>');

    return row;
  }
});

module.exports = TrackRecordsView;

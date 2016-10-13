"use strict";

var SearchGrid = require('com/searchGrid');

var TicketSelectGroup = require('com/ticketSelectGroup');

var Timeset = require('com/timeset');

var BtnGroup = require('com/btnGroup');

var trackStatusConfig = require('userCenter/misc/trackStatusConfig');

var TrackRecordsView = SearchGrid.extend({

  template: require('./chaseRecords.html'),

  events: {},

  initialize: function() {
    _(this.options).extend({
      columns: [
        {
          name: '账号',
          width: '10%'
        },
        {
          name: '追号编号',
          width: '18%'
        },
        {
          name: '彩种名称',
          width: '12%'
        },
        {
          name: '追号状态',
          width: '8%'
        },
        {
          name: '已追/总期数',
          width: '10%'
        },
        {
          name: '已投/总金额',
          width: '12%'
        },
        {
          name: '中奖金额',
          width: '12%'
        },
        {
          name: '追号时间',
          width: '15%'
        }
      ],
      gridOps: {
        emptyTip: '没有追号记录'
      },
      ajaxOps: {
        url: '/ticket/bethistory/userchasehistory.json'
      },
      // viewType: 'team',
      reqData: {
        subUser: 0
      },
      tip: '',
      height: 310
    });
  },

  onRender: function() {
    var self = this;

    this.$btnGroup = this.$('.js-ac-btnGroup');

    this.$timeset = this.$('.js-ac-timeset');

    this.$('.js-pf-search-grid').addClass('bc-report-table');

    this.timeset = new Timeset({
      el: this.$timeset,
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      prevClass: 'js-pf'
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
          title: '今天',
          value: 0,
          active: true
        },
        {
          title: '三天',
          value: -3
        },
        {
          title: '七天',
          value: -7
        }
      ],
      onBtnClick: function(offset) {
        self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
        self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset === -1 ? -1 : 0, 'days').endOf('day'));
        (self.$('.js-ac-search-form') && !self.firstTime) && self.$('.js-ac-search-form').trigger('submit');
        return false;
      }
    }).render();


    if(this.options.reqData.username) {
      this.$('input[name="username"]').val(this.options.reqData.username);
    }

    //初始化彩种选择
    new TicketSelectGroup({
      el: this.$('.js-uc-ticket-select-group')
    });

    //
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
        '所有页总计', '', '', '', '',
        _(gridData.betMoneyTotal).fixedConvert2yuan(),
        '<div class="text-hot">' + _(gridData.prizeMoneyTotal).convert2yuan() + '</div>',
        ''
      ]
    }).hideLoading();

  },

  formatRowData: function(rowInfo) {
    var row = [];
    var url = _.getUrl('/detail/' + rowInfo.ticketTradeNo + '?name=' + rowInfo.userName);

    row.push(rowInfo.userName);
    row.push('<a class="router btn-link" href="' + url + '">' + rowInfo.ticketTradeNo + '</a>');
    row.push(rowInfo.ticketName);

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

    row.push(rowInfo.chaseBetCount + '/' + rowInfo.chaseAllPeriods);
    row.push('&nbsp;' + _(rowInfo.chaseBetMoney).fixedConvert2yuan() + '/' + _(rowInfo.chaseAllMoney).fixedConvert2yuan());

    var status = '';
    if(rowInfo.chasePrizeMoney === 0 || rowInfo.chasePrizeMoney === null) {
      status = '0';
    } else {
      status = '<span class="text-pleasant">' + _(rowInfo.chasePrizeMoney).convert2yuan() + '</span>';
    }
    row.push(status);
    row.push(_(rowInfo.chaseTime).toTime());
    return row;
  }
});

module.exports = TrackRecordsView;

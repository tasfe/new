"use strict";

var tradingStatusConfig = require('fundCenter/misc/tradingStatusConfig');

var SearchGrid = require('com/searchGrid');

var BtnGroup = require('com/btnGroup');
var Timeset = require('com/timeset');

var MoneyDetailView = SearchGrid.extend({

  template: require('./moneyDetails.html'),

  events: {},

  initialize: function() {
    _(this.options).defaults({
      betDetailPrevUrl: '#uc/br/detail/',
      chaseDetailPrevUrl: '#uc/tr/detail/'
    });

    _(this.options).extend({
      height: '330',
      columns: [
        {
          name: '账号',
          width: '10%'
        },
        {
          name: '交易时间',
          width: '15%'
        },
        {
          name: '交易流水号',
          width: '18%'
        },
        {
          name: '交易类型',
          width: '8%'
        },
        // {
        //   name: '备注类型',
        //   width: '8%'
        // },
        {
          name: '交易金额',
          width: '12%'
        },
        {
          name: '账户余额',
          width: '15%'
        },
        {
          name: '备注',
          width: '15%'
        }
      ],
      tip: '<div class="table-foot-tips"><span>提示:</span> 帐户明细只保留30天数据。</div>',
      gridOps: {
        emptyTip: '没有账户明细'
      },
      ajaxOps: {
        url: '/fund/balance/history.json'
      },
      reqData: {
        subUser: 0
      }
      // viewType: 'team'
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
    
    this.$('select[name=tradeType]').html(_(tradingStatusConfig.get()).map(function(status) {
      return '<option value="' + status.id + '">' + status.searchName + '</option>';
    }).join(''));

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.balanceList).map(function(bet, index, betList) {
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
        trClass: 'tr-cool',
        columnEls: [
          '<div class="text-hot">所有页总计</div>',
          '', '', '',
         '<div class="text-hot">' +  _(gridData.income + gridData.spending).convert2yuan() + '</div>', '',''
        ]
      })
      .hideLoading();
  },

  formatRowData: function(info) {
    var row = [];

    //TODO 增加账号字段
    row.push(info.userName);

    row.push(_(info.createTime).toTime());

    row.push(info.tradeNo);

    row.push(tradingStatusConfig.toZh(info.tradeType));


    // TODO 增加账变字段
    if (info.amount >= 0) {
      row.push('<span class="">+'+_(info.amount).convert2yuan()+'</span>');
    } else {
      row.push('<span class="">'+_(info.amount).convert2yuan()+'</span>');
    }

    row.push('<span class="text-bold-cool">'+_(info.balance).convert2yuan()+'</span>');

    //var remark = info.remark;
    //
    //if (remark.replace(/[\u4e00-\u9fa5]/g, '**').length>16) {
    //  //if (info.remark.length > 5) {
    //  remark = remark.substring(0,16);
    //
    //  var newLen =remark.replace(/[*]/g,'').length;
    //  var subLen = 6+newLen/2;//当前宽度大约够显示16-17个字符，多减了两个位置留给省略号
    //  row.push('<div title="' + info.remark + '">' + info.remark.substr(0, subLen) + '...</div>');
    //} else {
    //  row.push(info.remark);
    //}

    //Number(info.tradeType) === 107 || info.tradeType === '投注'



    // if ( info.remark==='投注扣款'||info.remark==='免费游戏中奖'||info.remark==='中奖'||info.remark.indexOf('投注所得')!==-1||info.remark==='用户撤单'||info.remark==='系统撤单') {
    //   row.push('<a href="' + this.options.betDetailPrevUrl + info.tradeNo + _.getUrlParamStr() + '" class="router btn-link btn-link-sun">' + '查看详情' + '</a>');
    // } else if(info.remark==='追号扣款'||info.remark.indexOf('撤销追号')!==-1) {//
    //   row.push('<a href="' + this.options.chaseDetailPrevUrl + info.tradeNo + _.getUrlParamStr() + '" class="router btn-link btn-link-sun">' + '查看详情' + '</a>');
    // } else {
    //   row.push('');
    // }

    row.push(info.remark);

    return row;
  }
});

module.exports = MoneyDetailView;
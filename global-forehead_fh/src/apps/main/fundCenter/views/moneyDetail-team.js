"use strict";

var tradingStatusConfig = require('fundCenter/misc/tradingStatusConfig');

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var MoneyDetailView = SearchGrid.extend({

  template: require('fundCenter/templates/moneyDetails.html'),

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
          width: '15%'
        },
        {
          name: '交易时间',
          width: '20%'
        },
        {
          name: '交易类型',
          width: '8%'
        },
        {
          name: '账变',
          width: '15%'
        },
        {
          name: '账户余额',
          width: '20%'
        },
        {
          name: '操作',
          width: '15%'
        }
      ],
      tip: '<div class="tip-hot"><span>提示</span> 帐户明细只保留30天数据。</div>',
      gridOps: {
        emptyTip: '没有账户明细'
      },
      ajaxOps: {
        url: '/fund/balance/history.json'
      },
      reqData: {
        subUser: 0
      },
      // viewType: 'team'
    });
  },

  onRender: function() {
    this.$('.js-pf-search-grid').addClass('bc-report-table');
    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: _(moment().startOf('day')).toTime(),
      endDefaultDate: _(moment().endOf('day')).toTime()
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
          '', '',
         '<div class="text-hot">' +  _(gridData.income + gridData.spending).convert2yuan() + '</div>',
          '', ''
        ]
      })
      .hideLoading();
  },

  formatRowData: function(info) {
    var row = [];

    //TODO 增加账号字段
    row.push(info.userName);

    row.push(_(info.createTime).toTime());

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
    if ( info.remark==='投注扣款'||info.remark==='免费游戏中奖'||info.remark==='中奖'||info.remark.indexOf('投注所得')!==-1||info.remark==='用户撤单'||info.remark==='系统撤单') {
      row.push('<a href="' + this.options.betDetailPrevUrl + info.tradeNo + _.getUrlParamStr() + '" class="router btn-link btn-link-sun">' + '查看详情' + '</a>');
    } else if(info.remark==='追号扣款'||info.remark.indexOf('撤销追号')!==-1) {//
      row.push('<a href="' + this.options.chaseDetailPrevUrl + info.tradeNo + _.getUrlParamStr() + '" class="router btn-link btn-link-sun">' + '查看详情' + '</a>');
    } else {
      row.push('');
    }

    return row;
  }
});

module.exports = MoneyDetailView;
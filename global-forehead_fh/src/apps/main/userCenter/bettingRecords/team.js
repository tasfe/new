"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var betStatusConfig = require('userCenter/misc/betStatusConfig');

var BettingRecordsView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
    'click .js-excess-cell': 'dateSelectHandler'
  },

  dateSelectHandler:function (e) {
      alert($(e.currentTarget).data('index'));
    
  },

  initialize: function() {
    _(this.options).extend({
      columns: [
        {
          name: '账号',
          width: '10%'
        },
        {
          name: '彩种名称',
          width: '10%'
        },
        {
          name: '投注奖期',
          width: '12%'
        },
        {
          name: '投注金额',
          width: '11%'
        },
        {
          name: '订单状态',
          width: '12%'
        },
        {
          name: '是否追号',
          width: '8%'
        },
        {
          name: '投注时间',
          width: '15%'
        },
        {
          name: '操作',
          width: '15%'
        }
      ],
      gridOps: {
        emptyTip: '没有投注记录'
      },
      ajaxOps: {
        url: '/ticket/bethistory/userbethistory.json?_t=1',
        abort: false
      },
      viewType: 'team',
      reqData: {
        subUser: 1
      },
      listProp: 'root.betList',
      tip: '<div class="m-left-md"><span>注意:</span> 投注记录只保留最近30天。</div>',
      height: 310
    });

    Global.memoryCache.set('ticketCachedList', []);
  },

  onRender: function() {

    //
    var cheAr = ['今天','三天','七天'];
    this.$content = this.$('.br-excess-tbutton');
    var cheInd=0;
    this.$content.html(_(cheAr).map(function (val) {
      cheInd++;
      return '<button class="js-excess-cell br-excess-cell" data-index='+cheInd+'>'+val+'</button>';
    }));


    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime()
    }).render();
    if(this.options.reqData.username){
      this.$('input[name="username"]').val(this.options.reqData.username);
    }

    //
    var qrArray=[{id:0,zhName:'个人'},{id:0,zhName:'团队'}];
    this.$('select[name=queryRange]').html(_(qrArray).map(function (qr) {
        return '<option value="'+qr.id+'">'+qr.zhName+'</option>';
      }).join(''));

    //
    var nokArray=[{
                    id: 20,
                    zhName: "老虎机秒秒彩"
                  },
                  {
                    id:19,
                    zhName:'亿贝秒秒彩'
                  }];
    this.$('select[name=nameofkind]').html(_(nokArray).map(function (qr) {
      return '<option value="'+qr.id+'">'+qr.zhName+'</option>';
    }).join(''));

    //
    var gopArray=[{id:0,zhName:'五星'},{id:1,zhName:'四星'}];
    this.$('select[name=groupofpw]').html(_(gopArray).map(function (qr) {
      return '<option value="'+qr.id+'">'+qr.zhName+'</option>';
    }).join(''));

    //
    var plArray=[{id:0,zhName:'单式直选'},{id:1,zhName:'直选和值'}];
    this.$('select[name=playway]').html(_(plArray).map(function (qr) {
      return '<option value="'+qr.id+'">'+qr.zhName+'</option>';
    }).join(''));

    //
    this.$('select[name=betStatus]').html(_(betStatusConfig.get()).map(function(betStatus) {
      return '<option value="' + betStatus.id + '">' + betStatus.zhName + '</option>';
    }).join(''));

    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    Global.memoryCache.set('ticketCachedList', _(gridData.betList).pluck('ticketTradeNo'));
    var rowsData = _(gridData.betList).map(function(bet, index, betList) {
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
      //trClass: 'tr-footer',
      columnEls: [
        '<div class="text-hot">所有页总计</div>', '', '',
        '<div class="text-hot">' + _(gridData.betMoneyTotal).fixedConvert2yuan() + '</div>',
        '<div class="text-hot">' + _(gridData.prizeMoneyTotal).convert2yuan() + '</div>',
        '', '', ''
      ]
    })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];

    row.push(rowInfo.userName);
    row.push(rowInfo.ticketName);
    if(rowInfo.ticketPlanId==='mmc'){
      row.push('/');
    }else{
      row.push(rowInfo.ticketPlanId);
    }
    if(rowInfo.betTotalMoney==0) {
      row.push('免费游戏');
    }else {
      row.push(_(rowInfo.betTotalMoney).fixedConvert2yuan());
    }

    var status = _.checkBettingStatus({
      betStatus: rowInfo.ticketBetStatus,
      hasException: rowInfo.hasException,
      openNumbers: rowInfo.ticketResult,
      openStatus: rowInfo.ticketOpenStatus,
      prizing: rowInfo.prizing,
      prizeTotalMoney: rowInfo.prizeTotalMoney,
      betTime: rowInfo.betTime,
      prizeClass: 'text-bold-hot',
      ticketPlanId: rowInfo.ticketPlanId
    });

    row.push(status);
    row.push(rowInfo.chaseId ? '是' : '否');
    row.push(_(rowInfo.betTime).toTime());

    row.push('<a class="router btn-link btn-link-sun" href="' + _.getUrl('/detail/' + rowInfo.ticketTradeNo) + '">查看详情</a>');

    return row;
  }
});

module.exports = BettingRecordsView;

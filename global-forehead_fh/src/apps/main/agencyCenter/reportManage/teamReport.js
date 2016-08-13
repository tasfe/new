"use strict";

var SearchGrid = require('com/searchGrid');

var TicketSelectGroup = require('com/ticketSelectGroup');

var Timeset = require('com/timeset');

var ReportManageView = SearchGrid.extend({

  template: require('./teamReport.html'),

  events: {
    'click .js-ac-pr-rr': 'showRechargeRecord',
    'click .js-ac-pr-wr': 'showWithdrawRecord',
    'click .js-ac-pr-br': 'showBettingRecord',
    'click .js-ac-pr-ar': 'showActiveRecord',
    'click .js-excess-cell': 'dateSelectHandler',
    'click .js-toggle-seach': 'toggleseachHandler'
  },

  dateSelectHandler:function (e) {

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
      height: '364',
      title: '报表查询',
      columns: [
        {
          name: '用户名',
          width: '10%'
        },
        {
          name: '充值',
          width: '10%',
          sortable: true,
          id: 1
        },
        {
          name: '提现',
          width: '10%',
          sortable: true,
          id: 2
        },
        {
          name: '投注',
          width: '10%',
          sortable: true,
          id: 3
        },
        {
          name: '中奖',
          width: '10%',
          sortable: true,
          id: 4
        },
        {
          name: '返点',
          width: '10%',
          sortable: true,
          id: 5
        },
        {
          name: '活动',
          width: '9%',
          sortable: true,
          id: 7
        },
        {
          name: '盈亏',
          width: '12%',
          sortable: true,
          id: 6
        },
        //{
        //  name: '操作',
        //  width: '9%'
        //}
      ],
      tip: '注意：只保留最近35天的报表查询。</div>',
      gridOps: {
        emptyTip: '没有资金变更记录'
      },
      ajaxOps: {
        url: '/fund/fundreport/amountreport.json',
        abort: false
      },
      reqData: {
        subUser: 0
      }

    });
  },

  onRender: function () {

    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime()
    }).render();
    if(this.options.reqData.username){
      this.$('input[name="username"]').val(this.options.reqData.username);
    }

    //初始化彩种选择
    new TicketSelectGroup({
      el: this.$('.js-uc-ticket-select-group')
    });

    //初始化彩种
    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.amountList).map(function(fundTrace, index, betList) {
      return {
        columnEls: this.formatRowData(fundTrace, index, betList),
        dataAttr: fundTrace
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    });

    if (!_(gridData.parents).isEmpty()) {
      this._breadList = _(gridData.parents).map(function(parent, index) {
        var data = {
          userId: parent.userId,
          day: parent.day
        };

        return {
          data: data,
          label: parent.userName
        };
      }, this);
      this.renderBread();
    }

    //加上统计行
    this.grid.addFooterRows({
        trClass: 'tr-footer',
        columnEls: [
          '<strong>总计</strong>',
          _(gridData.rechargeTotal).convert2yuan({fixed:2}),
          _(gridData.withdrawTotal).convert2yuan({fixed:2}),
          _(gridData.betTotal).fixedConvert2yuan(),
          _(gridData.prizeTotal).convert2yuan(),
          _(gridData.bonusTotal).convert2yuan(),
          _(gridData.activityTotal).convert2yuan(),
          _(gridData.profitAndLossTotal).convert2yuan()
        ]
      })
      .hideLoading();

  },

  formatRowData:function(rowInfo) {
    var row = [];

    if(this.hasSub() && rowInfo.userName === this.getCurtSub().label || !rowInfo.hasSubUser) {
      row.push(rowInfo.userName);
    } else {
      row.push('<a class="js-pf-sub btn-link" data-label="' + rowInfo.userName +
          '" data-user-id="' + rowInfo.userId + '" href="javascript:void(0)">' +
          rowInfo.userName + '</a>');
    }
    row.push('<a  href="javascript:void(0);" class="js-ac-pr-rr "><span class="text-sunshine">'+_(rowInfo.recharge).convert2yuan({fixed:2, clear: false})+'</span></a>');
    row.push('<a  href="javascript:void(0);" class="js-ac-pr-wr "><span class="text-sunshine">'+_(rowInfo.withdraw).convert2yuan({fixed:2, clear: false})+'</span></a>');
    row.push('<a  href="javascript:void(0);" class="js-ac-pr-br "><span class="text-sunshine">'+_(rowInfo.bet).fixedConvert2yuan()+'</span></a>');

    row.push(_(rowInfo.prize).convert2yuan({clear: false}));
    row.push(_(rowInfo.bonus).convert2yuan({clear: false}));
    row.push(_(rowInfo.activity).convert2yuan({clear: false}));
    row.push(_(rowInfo.profitAndLoss).convert2yuan({clear: false}));
    //row.push('<a href="' + _.addHrefArgs('#ac/betting/' + rowInfo.userId, 'name', rowInfo.userName) + '" class="router btn btn-link no-padding">投注</a>&nbsp;&nbsp;' +
    //    '<a  href="' + _.addHrefArgs('#ac/account/' + rowInfo.userId, 'name', rowInfo.userName) + '" class="router btn btn-link no-padding">账变</a>');

    return row;
  },
  showRechargeRecord: function(e){
    var $target = $(e.currentTarget);
    var $tr = $target.closest('tr');
    var userId = $tr.data('userId');
    var userName = $tr.data('userName');
    var day = $tr.data('day');
    var startTime = this.$('.js-start-time').val() + ' 0:00:00';
    var endTime = this.$('.js-end-time').val() + ' 23:59:59';
    Global.appRouter.navigate('#ac/rm/rr/team?userName='+userName+'&startTime='+startTime+'&endTime='+endTime,{trigger: true, replace: false});
  },
  showWithdrawRecord: function(e){
    var $target = $(e.currentTarget);
    var $tr = $target.closest('tr');
    var userId = $tr.data('userId');
    var userName = $tr.data('userName');
    var startTime = this.$('.js-start-time').val() + ' 0:00:00';
    var endTime = this.$('.js-end-time').val() + ' 23:59:59';
    Global.appRouter.navigate('#ac/rm/wr/team?userName='+userName+'&startTime='+startTime+'&endTime='+endTime,{trigger: true, replace: false});
  },
  showBettingRecord:function(e){
    var $target = $(e.currentTarget);
    var $tr = $target.closest('tr');
    var userId = $tr.data('userId');
    var userName = $tr.data('userName');
    var startTime = this.$('.js-start-time').val() + ' 0:00:00';
    var endTime = this.$('.js-end-time').val() + ' 23:59:59';
    Global.appRouter.navigate('#ac/rm/br/team?userName='+userName+'&startTime='+startTime+'&endTime='+endTime,{trigger: true, replace: false});
  },
  showActiveRecord:function(e){
    var $target = $(e.currentTarget);
    var $tr = $target.closest('tr');
    var userId = $tr.data('userId');
    var userName = $tr.data('userName');
    var startTime = this.$('.js-start-time').val() + ' 0:00:00';
    var endTime = this.$('.js-end-time').val() + ' 23:59:59';
    Global.appRouter.navigate('#ac/rm/ar/'+userId+'?userName='+userName+'&&startTime='+startTime+'&endTime='+endTime,{trigger: true, replace: false});
  }
});

module.exports = ReportManageView;

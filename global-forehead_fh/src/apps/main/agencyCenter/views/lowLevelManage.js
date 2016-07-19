"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var LowLevelManageView = SearchGrid.extend({

  template: require('agencyCenter/templates/lowLevelManage.html'),

  className: 'lowLevelManage-view',

  events: {
    'click .js-ac-expend-btn': 'expendHandler',
    'click .js-ac-llm-cp': 'checkPayPwdSet'
  },

  initialize: function() {
    _(this.options).extend({
      footerClass: 'border-cool-top',
      height: 400,
      title: '下级管理',
      columns: [
        {
          name: '用户名',
          width: '15%'
        },
        {
          name: '返点',
          width: '7%',
          sortable: true,
          id: 1
        },
        {
          name: 'vip等级',
          width: '10%',
          sortable: true,
          id: 5
        },
        {
          name: '个人余额',
          width: '11%',
          sortable: true,
          id: 2
        },
        {
          name: '注册时间',
          width: '18%',
          sortable: true,
          id: 3
        },
        {
          name: '不活跃天数<i class="js-ac-uDays sfa sfa-help-tip cursor-pointer vertical-middle text-sunshine"></i>',
          width: '12%',
          sortable: true,
          id: 4
        },
        {
          name: '操作',
          width: '27%'
        }
      ],
      //gridOps: {
      //  emptyTip: '无记录'
      //},
      ajaxOps: {
        url: '/acct/subacctinfo/getsubacctlist.json'
      },
      subOps: {
        data: ['userParentId']
      }
    });

    this.on('router:back', function() {
      this._getGridXhr();
    });
  },

  checkPayPwdXhr: function() {
    return Global.sync.ajax({
      url: '/fund/moneypd/checkpaypwd.json'
    });
  },

  onRender: function() {
    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTime: 'regTimeStart',
      endTime: 'regTimeEnd',
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      startOps: {
        format: 'YYYY-MM-DD'
      },
      endOps: {
        format: 'YYYY-MM-DD'
      }
    }).render();

    SearchGrid.prototype.onRender.apply(this, arguments);

    this.$('.js-ac-uDays').popover({
      trigger: 'hover',
      html: true,
      content: '<strong>不活跃天数定义</strong> <br />连续多少天内无任何账变，即为不活跃的天数',
      placement: 'bottom'
    });
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.subAcctList).map(function(bet, index, betList) {
      return {
        columnEls: this.formatRowData(bet, index, betList),
        dataAttr: bet
      };
    }, this);

    if (!_(gridData.parents).isEmpty()) {
      this._breadList = _(gridData.parents).map(function(parent, index) {
        return {
          data: {
            userParentId: parent.userId
          },
          label: parent.userName
        };
      });
      this.renderBread();
    }

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
          pageIndex: this.filterHelper.get('pageIndex'),
          initPagination: true
        })
        .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];
    var onlineStatus = '<span class="ac-llm-online">●</span>';

    if (rowInfo.userSubAcctNum ) {
      row.push('<a class="js-pf-sub btn-link text-coffee" data-label="' + rowInfo.userName +
          '" data-user-parent-id="' + rowInfo.userId + '" href="javascript:void(0)">' +
          rowInfo.userName+'(' +rowInfo.userSubAcctNum + ')</a> '+(rowInfo.online?onlineStatus:''));
    } else {
      row.push('<span class="text-coffee">'+rowInfo.userName+'</span>'+(rowInfo.online?onlineStatus:''));
    }

    row.push(_(rowInfo.rebate).formatDiv(10,{fixed:1}) + '%');
    row.push(rowInfo.memberLevel );
    row.push('<span class="">'+_(rowInfo.balance).convert2yuan()+'</span>');//text-bold-pleasant

    row.push(_(rowInfo.regTime).toTime());
    row.push(rowInfo.uDays);
    row.push(this._formatOperation(rowInfo));

    return row;
  },

  _formatOperation: function(rowInfo) {
    var html = [];
    var cell = [];

    if (rowInfo.direct && !this.isSub()) {

      cell.push('<a href="javascript:void(0);" class="js-gl-letter btn btn-link text-sunshine"' +
          ' data-user-id="' + rowInfo.userId + '" data-name="' + rowInfo.userName + '">站内信</a>');
      //cell.push('<a href="'+_.getUrl('/message/' + rowInfo.userId, 'name',rowInfo.userName) + '" class="router btn btn-link text-sunshine">站内信</a>');
    }
    if (rowInfo.direct && !this.isSub()) {
      cell.push('<a href="javascript:void(0);"  class="js-ac-llm-cp btn btn-link ">转账</a>');
    }
    if (rowInfo.direct && !this.isSub()) {
      cell.push('<a href="' + _.getUrl('/rebate/' + rowInfo.userId, 'name', rowInfo.userName) + '" class="router btn btn-link">升点</a>');
    }

    // cell.push('<a href="' + _.getUrl('/detail/' + rowInfo.userId, 'name', rowInfo.userName) + '" class="router btn btn-link ">详情</a>');
    cell.push('<a href="' + _.addHrefArgs('#ac/betting/' + rowInfo.userId +'/team', 'name', rowInfo.userName) + '" class="router btn btn-link">投注</a>');
    cell.push('<a href="' + _.addHrefArgs('#ac/track/' + rowInfo.userId +'/team', 'name', rowInfo.userName) + '" class="router btn btn-link">追号</a>');
    cell.push('<a href="' + _.addHrefArgs('#ac/account/' + rowInfo.userId +'/team', 'name', rowInfo.userName) + '" class="router btn btn-link">账变</a>');

    if(_(cell).size()>3){
      html.push('<div class="relative">');
      html = html.concat(cell.splice(0, 3));
      html.push('<i class="js-ac-expend-btn ac-expend-btn fa fa-angle-double-up fa-rotate-180 fa-2x text-sunshine"></i>');
      html.push('</div>');

      html.push('<div class="js-ac-expend ac-expend no-height">');
      html = html.concat(cell);
      html.push('</div>');
    }else{
      html = html.concat(cell);
    }

    return html.join('');
  },

  //event handlers

  expendHandler: function(e) {
    var $target = $(e.currentTarget);
    var $currentTr = $target.closest('tr');
    var $currentExpend = $target.closest('td').find('.js-ac-expend');
    if ($target.hasClass('fa-rotate-180')) {
      $currentExpend.css('height', 25);
    } else {
      $currentExpend.css('height', '');
    }
    $target.toggleClass('fa-rotate-180');

    $currentTr.siblings().find('.js-ac-expend').css('height', '').end()
        .find('.js-ac-expend-btn').addClass('fa-rotate-180');
  },
  checkPayPwdSet: function(e){
    var $target = $(e.currentTarget);
    var rowInfo = this.grid.getRowData($target);
    this.checkPayPwdXhr()
        .done(function(res) {
          if (res && res.result === 0) {
            //设置了则弹出验证框
            //$(document).verifyFundPwd({parentView:self});
            Global.appRouter.navigate('#ac/llm/transfer/' + rowInfo.userId+'?name='+rowInfo.userName,{trigger: true, replace: false});
          } else if (res && res.result === 1) {
            //未设置则弹出链接到资金密码设置页面的提示框
            $(document).securityTip({
              content: '请补充完您的安全信息后再转账',
              showMoneyPwd: true,
              hasMoneyPwd: false,
              showBankCard: false,
              hasBankCard: false
            });
            //self.$('.js-uc-cm-fundPwdSetNotice').removeClass('hidden');
            //self.$el.removeClass('hidden');
          }
        });
  }
});

module.exports = LowLevelManageView;
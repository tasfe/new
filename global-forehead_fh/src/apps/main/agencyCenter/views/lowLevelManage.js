"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var LowLevelManageView = SearchGrid.extend({

  template: require('agencyCenter/templates/lowLevelManage.html'),

  className: 'lowLevelManage-view',

  events: {
    'click .js-ac-expend-btn': 'expendHandler',
    'click .js-ac-llm-cp': 'checkPayPwdSet',
    'click .js-toggle-seach': 'toggleSeach'
  },

  initialize: function() {
    _(this.options).extend({
      footerClass: 'border-cool-top',
      height: 400,
      title: '下级管理',
      columns: [
        {
          name: '用户名',
          width: '12%'
        },
        {
          name: '状态',
          width: '6%'
        },
        {
          name: '返点',
          width: '6%'
        },
        {
          name: '个人余额',
          width: '10%',
          sortable: true,
          id: 2
        },
        {
          name: '团队余额',
          width: '10%',
          sortable: true,
          id: 6
        },
        {
          name: '注册时间',
          width: '15%',
        },
        {
          name: '不活跃天数',
          width: '8%'
        },
        {
          name: '最后登录时间',
          width: '15%',
        },
        {
          name: '操作',
          width: '18%'
        }
      ],
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
      size: 'julien-time',
      prevClass: 'js-pf',
      startOps: {
        format: 'YYYY-MM-DD'
      },
      endOps: {
        format: 'YYYY-MM-DD'
      }
    }).render();

    new Timeset({
      el: this.$('.js-last-timeset'),
      startTime: 'loginTimeStart',
      endTime: 'loginTimeEnd',
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      size: 'julien-time',
      prevClass: 'js-last',
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

  toggleSeach: function(){
    $('.search-condition-table .row2').slideToggle('slow');
    if($('.js-toggle-seach').hasClass('on'))
    {
      $('.js-toggle-seach').removeClass('on')
    }
    else{
      $('.js-toggle-seach').addClass('on')
    }
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
          rowInfo.userName+'(' +rowInfo.userSubAcctNum + ')</a> ');
    } else {
      row.push('<span class="text-coffee">'+rowInfo.userName+'</span>');
    }
    var online = '离线';
    if(rowInfo.online){
      online = '在线';
    }
    row.push(online);
    row.push(_(rowInfo.rebate).formatDiv(10,{fixed:1}) + '%');
    row.push('<span class="">'+_(rowInfo.balance).convert2yuan()+'</span>');//text-bold-pleasant
    row.push('<span class="">'+_(rowInfo.balanceTotal).convert2yuan()+'</span>');
    row.push(_(rowInfo.regTime).toTime());
    row.push(rowInfo.uDays);
    row.push(_(rowInfo.loginTime).toTime());
    row.push(this._formatOperation(rowInfo));

    return row;
  },

  _formatOperation: function(rowInfo) {
    var html = [];
    var cell = [];
    
    if (rowInfo.direct && !this.isSub()) {
      cell.push('<a href="javascript:void(0);"  class="js-ac-llm-quota btn btn-link ">配额</a>');
    }
    if (rowInfo.direct && !this.isSub()) {
      cell.push('<a href="' + _.getUrl('/rebate/' + rowInfo.userId, 'name', rowInfo.userName) + '" class="router btn btn-link">升点</a>');
    }
    if (rowInfo.direct && !this.isSub()) {
      cell.push('<a href="javascript:void(0);"  class="js-ac-llm-cp btn btn-link ">转账</a>');
    }
    if (rowInfo.direct && !this.isSub()) {
      cell.push('<a href="javascript:void(0);" class="js-gl-letter btn btn-link text-sunshine"' +
          ' data-user-id="' + rowInfo.userId + '" data-name="' + rowInfo.userName + '">消息</a>');
    }

    html = html.concat(cell);

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
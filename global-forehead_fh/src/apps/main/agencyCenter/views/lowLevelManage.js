"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var OpenAccountView = require('agencyCenter/openAccount');

var QuotaTransferView = require('agencyCenter/lowLevelManage/quotaTransfer');

var LowLevelManageView = SearchGrid.extend({

  template: require('agencyCenter/templates/lowLevelManage.html'),

  className: 'lowLevelManage-view',

  events: {
    'click .js-ac-open-account': 'openAccountHandler',
    'click .js-ac-llm-quota': 'changeQuotaHandler',
    'click .js-ac-rebate': 'changeRebateHandler',
    'click .js-ac-expend-btn': 'expendHandler',
    'click .js-ac-llm-cp': 'checkPayPwdSetHandler'
  },

  getQuotaXhr: function(userId) {
    return Global.sync.ajax({
      url: '/acct/subaccount/getquotacfg.json',
      data: {
        userId: userId
      }
    });
  },

  initialize: function() {
    _(this.options).extend({
      height: 297,
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
          width: '15%'
        },
        {
          name: '不活跃天数',
          width: '8%'
        },
        {
          name: '最后登录时间',
          width: '15%'
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

  onRender: function() {
    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTime: 'regTimeStart',
      endTime: 'regTimeEnd',
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
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

  renderGrid: function(gridData) {
    var rowsData = _(gridData.subAcctList).map(function(bet, index, betList) {
      return {
        columnEls: this.formatRowData(bet, index, betList),
        dataAttr: bet
      };
    }, this);

    if(!_(gridData.parents).isEmpty()) {
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

    if(rowInfo.userSubAcctNum) {
      row.push('<a class="js-pf-sub btn-link text-coffee" data-label="' + rowInfo.userName +
        '" data-user-parent-id="' + rowInfo.userId + '" href="javascript:void(0)">' +
        rowInfo.userName + '(' + rowInfo.userSubAcctNum + ')</a> ');
    } else {
      row.push('<span class="text-coffee">' + rowInfo.userName + '</span>');
    }
    var online = '离线';
    if(rowInfo.online) {
      online = '在线';
    }
    row.push(online);
    row.push(_(rowInfo.rebate).formatDiv(10, {fixed: 1}) + '%');
    row.push('<span class="">' + _(rowInfo.balance).convert2yuan() + '</span>');//text-bold-pleasant
    row.push('<span class="">' + _(rowInfo.balanceTotal).convert2yuan() + '</span>');
    row.push(_(rowInfo.regTime).toTime());
    row.push(rowInfo.uDays);
    row.push(_(rowInfo.loginTime).toTime());
    row.push(this._formatOperation(rowInfo));

    return row;
  },

  _formatOperation: function(rowInfo) {
    var html = [];
    var cell = [];

    if(rowInfo.direct && !this.isSub()) {
      cell.push('<a href="javascript:void(0);" class="js-ac-llm-quota btn btn-link" data-subacctid="' + rowInfo.userId + '" data-username="' + rowInfo.userName + '">配额</a>');
    }
    if(rowInfo.direct && !this.isSub()) {
      cell.push('<a href="javascript:void(0);" class="js-ac-rebate btn btn-link" data-subacctid="' + rowInfo.userId + '" data-username="' + rowInfo.userName + '">升点</a>');
    }
    if(rowInfo.direct && !this.isSub()) {
      cell.push('<a href="javascript:void(0);"  class="js-ac-llm-cp btn btn-link" data-subacctid="' + rowInfo.userId + '" data-username="' + rowInfo.userName + '">转账</a>');
    }
    if(rowInfo.direct && !this.isSub()) {
      cell.push('<a href="javascript:void(0);" class="js-gl-letter btn btn-link"' +
        ' data-user-id="' + rowInfo.userId + '" data-name="' + rowInfo.userName + '">消息</a>');
    }

    html = html.concat(cell);
    return html.join('');
  },

  //event handlers

  openAccountHandler: function() {
    var openAccountView;
    var $dialog = Global.ui.dialog.show({
      title: '开户管理',
      size: 'modal-lg',
      body: '<div class="js-ac-open-account-container m-LR-sm"></div>',
      bodyClass: 'p-top-xs no-p-left no-p-right no-p-bottom',
      footer: ''
    });

    var $openAccountContainer = $dialog.find('.js-ac-open-account-container');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      openAccountView.destroy();
    });

    openAccountView = new OpenAccountView({
      className: 'ac-openAccount-view'
    });

    $openAccountContainer.html(openAccountView.render().$el);

    openAccountView.on('submit:complete', function() {
      $dialog.modal('hide');
    });
  },

  changeQuotaHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var rowData = this.grid.getRowData($target);
    this.getQuotaXhr(rowData.userId)
      .done(function(res) {
        var reqData = res.root;
        if(res && res.result === 0) {

          var $dialog = Global.ui.dialog.show({
            title: '转给' + $target.data('username') + '的配额',
            size: 'modal-lg',
            body: '<div class="js-ac-quotatransfer-container"></div>'
          });

          var $quotaContainer = $dialog.find('.js-ac-quotatransfer-container');
          var quotaView;

          $dialog.on('hidden.modal', function() {
            $(this).remove();
            quotaView.destroy();
          });

          quotaView = new QuotaTransferView({
            el: $quotaContainer,
            username: rowData.userName,
            userId: rowData.userId,
            rebate: rowData.rebate,
            data: reqData
          }).render()
            .on('submit:complete', function() {
              $dialog.modal('hide');
            });
        }
      });
  },

  changeRebateHandler: function(e) {
    var $target = $(e.currentTarget);

    $(document).rebate({
      title: '提升' + $target.data('username') + '返点',
      userId: $target.data('subacctid')
    });
  },

  expendHandler: function(e) {
    var $target = $(e.currentTarget);
    var $currentTr = $target.closest('tr');
    var $currentExpend = $target.closest('td').find('.js-ac-expend');
    if($target.hasClass('fa-rotate-180')) {
      $currentExpend.css('height', 25);
    } else {
      $currentExpend.css('height', '');
    }
    $target.toggleClass('fa-rotate-180');

    $currentTr.siblings().find('.js-ac-expend').css('height', '').end()
      .find('.js-ac-expend-btn').addClass('fa-rotate-180');
  },

  checkPayPwdSetHandler: function(e) {
    var $target = $(e.currentTarget);

    var acctInfo = Global.memoryCache.get('acctInfo');
    if(!acctInfo || acctInfo.userStatus === 100) {
      this.$dialog.modal('hide');
      Global.ui.notification.show('用户已被冻结，无法进行转账操作。');
    }
    else {
      this.getInfoXhr().fail(function() {
        Global.ui.notification.show('网络报错！');
      })
        .done(function(res) {
          if(res.root.hasMoneyPwd && res.root.hasSecurity) {
            $(document).transfer({
              title: $target.data('username'),
              userId: $target.data('subacctid'),
              data: res
            });
          }
          else {
            $(document).securityTip({
              content: '请补充完您的安全信息后再转账',
              showMoneyPwd: !res.root.hasMoneyPwd,
              showBankCard: false,
              showSecurity: !res.root.hasSecurity
            });
          }
        });
    }
  },

  //获取转账信息
  getInfoXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/gettradeinfo.json',
      abort: false
    });
  }
});

module.exports = LowLevelManageView;
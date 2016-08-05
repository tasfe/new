define(function (require, exports, module) {
  require('prefab/views/searchGrid');

  var AgencyProfitAndLossReportView = Base.Prefab.SearchGrid.extend({

    template: require('text!dataCenter/templates/agencyProfitAndLossReport.html'),

    events: {
      'click .js-pl-account':'userAccountHandler',
      'click .js-pl-bet':'userBetHandler'
    },
    initialize: function () {

      _(this.options).extend({
        title: '代理盈亏记录',
        columns: [
          {
            name: '日期',
            width: '6%'
          },
          {
            name: '用户名',
            width: '6%'
          },
          {
            name: '充值',
            width: '6%',
            sortable: true,
            id: 1
          },
          {
            name: '提现',
            width: '6%',
            sortable: true,
            id: 2
          },
          {
            name: '投注',
            width: '6%',
            sortable: true,
            id: 3
          },
          {
            name: '中奖',
            width: '6%',
            sortable: true,
            id: 4
          },
          {
            name: '返点',
            width: '6%',
            sortable: true,
            id: 5
          },
          {
            name: '活动',
            width: '6%',
            sortable: true,
            id: 7
          },
          {
            name: '奖励',
            width: '6%',
            sortable: true,
            id: 8
          },
          {
            name: '理赔',
            width: '6%',
            sortable: true,
            id: 9
          },
          {
            name: '盈亏',
            width: '6%',
            sortable: true,
            id: 6
          },
          {
            name: '操作',
            width: '6%'
          }

        ],
        pagination: false,
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/sysreport/profitreport.json'
        },
        subOps: {
          url: '/intra/sysreport/profitdetail.json',
          data: ['userId', 'day']
        }
      });
    },
    getTicketXhr: function () {
      return Global.sync.ajax({
        url: '/intra/playmng/tickets.json'
      });
    },
    onRender: function () {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-pl-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate: moment().add(1, 'year'),
        showToday: true,
        startFormat: 'YYYY-MM-DD',
        endFormat: 'YYYY-MM-DD'
      }).render();
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
      this.getTicketXhr().always(function () {
      }).fail(function () {
        // 处理失败
      }).done(function (res) {
        if (res && res.result === 0) {
          var ticketData = _(res.root).map(function (ticket) {
            return '<option value="' + ticket.ticketId + '">' + ticket.ticketName + '</option>';
          });
          self.$('.js-pl-ticket').html('<option value="">全部</option>' + ticketData.join(''));
        } else {
          Global.ui.notification.show('数据异常。');
        }

      })
    },
    renderGrid: function (gridData) {
      var self = this;
      var rowsData = _(gridData.amountList).map(function (amount, index) {
        return {
          columnEls: this.formatRowData(amount, index),
          dataAttr: amount
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });
      //加上统计行
      this.grid.addRows({
        columnEls: [
          '<strong>总结</strong>',
          {
            colspan: 1
          },
          _(gridData.rechargeTotal).convert2yuan({fixed:2, clear: false}),
          _(gridData.withdrawTotal).convert2yuan({fixed:2, clear: false}),
          _(gridData.betTotal).fixedConvert2yuan(),
          _(gridData.prizeTotal).convert2yuan(),
          _(gridData.bonusTotal).convert2yuan(),
          _(gridData.activityTotal).convert2yuan(),
          _(gridData.sysRebateTotal).convert2yuan(),
          _(gridData.sysReturnTotal).convert2yuan(),
          _(gridData.profitAndLossTotal).convert2yuan(),
          {
            colspan: 1
          }
        ]
      })
          .hideLoading();

      if (!_(gridData.parents).isEmpty()) {
        this._breadList = _(gridData.parents).map(function(parent, index) {
          var data = {
            userId:  parent.userId,
            day : parent.day
          }
          data.url = data.day ? self.options.subOps.url: self.options.ajaxOps.url;
          return {
            data: data,
            label: parent.userName
          };
        });
        this.renderBread();
      }

    },

    formatRowData: function (rowInfo) {
      var row = [];
      row.push(rowInfo.day);

      if (this.hasSub() && rowInfo.userName === this.getCurtSub().label) {
        row.push(rowInfo.userName);
      } else {
        row.push('<a class="js-pf-sub" data-label="' + rowInfo.userName +
          '" data-user-id="' + rowInfo.userId + '" data-day="' + rowInfo.day + '" href="javascript:void(0)">' + rowInfo.userName +  '&nbsp;&nbsp;');
      }
      row.push(_(rowInfo.recharge).convert2yuan({fixed:2, clear: false}));
      row.push(_(rowInfo.withdraw).convert2yuan({fixed:2, clear: false}));
      row.push(_(rowInfo.bet).fixedConvert2yuan());
      row.push(_(rowInfo.prize).convert2yuan());
      row.push(_(rowInfo.bonus).convert2yuan());
      row.push(_(rowInfo.activity).convert2yuan());
      row.push(_(rowInfo.sysRebate).convert2yuan());
      row.push(_(rowInfo.sysReturn).convert2yuan());
      row.push(_(rowInfo.profitAndLoss).convert2yuan());
      row.push(this._formatOperation(rowInfo));
      return row;
    },
    _formatOperation: function (rowInfo) {
      var cell = [];
      cell.push('<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.userName + '" class="js-pl-bet btn btn-link">投注</button>');
      cell.push('<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.userName + '" class="js-pl-account btn btn-link">帐变</button>');
      return cell.join('');
    },
    userAccountHandler:function(e){
      var $target = $(e.currentTarget);
      Global.appRouter.navigate(_('#fc/ad').addHrefArgs({
        _t:_.now(),
        username:$target.data('type')
      }), {trigger: true, replace: false});
    },
    userBetHandler:function(e){
      var $target = $(e.currentTarget);
      Global.appRouter.navigate(_('#bc/br').addHrefArgs({
        _t:_.now(),
        username:$target.data('type')
      }), {trigger: true, replace: false});
    }
  });

  module.exports = AgencyProfitAndLossReportView;
});
//56250
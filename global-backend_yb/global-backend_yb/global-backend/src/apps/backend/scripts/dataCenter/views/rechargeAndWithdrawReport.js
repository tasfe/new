define(function (require, exports, module) {
  require('prefab/views/searchGrid');

  var RechargeAndWithdrawReportView = Base.Prefab.SearchGrid.extend({

    template: require('text!dataCenter/templates/rechargeAndWithdrawReport.html'),

    events: {},

    initialize: function () {
      _(this.options).extend({
        title: '充值提现报表',
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
            name: '在线充值',
            width: '6%'
          },
          {
            name: '在线提现',
            width: '6%'
          },
          {
            name: '充值手续费',
            width: '6%'
          },
          {
            name: '提现手续费',
            width: '6%'
          },
          {
            name: '人工加币',
            width: '6%'
          },
          {
            name: '人工减币',
            width: '6%'
          },
          {
            name: '充值总计',
            width: '6%'
          },
          {
            name: '提现总计',
            width: '6%'
          }
        ],
        pagination: false,
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/sysreport/rechargereport.json'
        },
        subOps: {
          url: '/intra/sysreport/rechargedetail.json',
          data: ['userId', 'day']
        }
      });
    },
    onRender: function () {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-rw-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate: moment().add(1, 'year'),
        showToday: true,
        startFormat: 'YYYY-MM-DD',
        endFormat: 'YYYY-MM-DD'
      }).render();
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
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
          _(gridData.rechargeFeeTotal).convert2yuan({fixed:2, clear: false}),
          _(gridData.withdrawFeeTotal).convert2yuan({fixed:2, clear: false}),
          _(gridData.sysAddTotal).convert2yuan({fixed:2, clear: false}),
          _(gridData.sysDisTotal).convert2yuan({fixed:2, clear: false}),
          _(gridData.rechargeTotal + gridData.rechargeFeeTotal + gridData.sysAddTotal).convert2yuan({fixed:2, clear: false}),
          _(gridData.withdrawTotal + gridData.withdrawFeeTotal + gridData.sysDisTotal).convert2yuan({fixed:2, clear: false})
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
      row.push(_(rowInfo.day));

      if (this.hasSub() && rowInfo.userName === this.getCurtSub().label) {
        row.push(rowInfo.userName);
      } else {
        row.push('<a class="js-pf-sub" data-label="' + rowInfo.userName +
          '" data-user-id="' + rowInfo.userId + '" data-day="' + rowInfo.day + '" href="javascript:void(0)">' + rowInfo.userName +  '&nbsp;&nbsp;');
      }
      row.push(_(rowInfo.recharge).convert2yuan({fixed:2, clear: false}));
      row.push(_(rowInfo.withdraw).convert2yuan({fixed:2, clear: false}));
      row.push(_(rowInfo.rechargeFee).convert2yuan({fixed:2, clear: false}));
      row.push(_(rowInfo.withdrawFee).convert2yuan({fixed:2, clear: false}));
      row.push(_(rowInfo.sysAdd).convert2yuan({fixed:2, clear: false}));
      row.push(_(rowInfo.sysDis).convert2yuan({fixed:2, clear: false}));
      row.push(_(rowInfo.recharge + rowInfo.rechargeFee + rowInfo.sysAdd).convert2yuan({fixed:2, clear: false}));
      row.push(_(rowInfo.withdraw + rowInfo.withdrawFee + rowInfo.sysDis).convert2yuan({fixed:2, clear: false}));
      return row;
    }
  });

  module.exports = RechargeAndWithdrawReportView;
});
//56250
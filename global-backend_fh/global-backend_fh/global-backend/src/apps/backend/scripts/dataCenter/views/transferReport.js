define(function (require, exports, module) {
  require('prefab/views/searchGrid');
  var TransferReportView = Base.Prefab.SearchGrid.extend({

    template: require('text!dataCenter/templates/transferReport.html'),

    events: {},

    initialize: function () {

      _(this.options).extend({
        title: '转账报表',
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
            name: '向上转账金额',
            width: '6%'
          },
          {
            name: '向下转账金额',
            width: '6%'
          },
          {
            name: '转账次数',
            width: '6%'
          }
        ],
        pagination: false,
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/sysreport/transferreport.json'
        },
        subOps: {
          url: '/intra/sysreport/transferdetail.json',
          data: ['userId', 'day']
        }
      });
    },
    onRender: function () {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-tr-timeset'),
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
          _(gridData.upTransferTotal).convert2yuan({fixed:2, clear: false}),
          _(gridData.downTransferTotal).convert2yuan({fixed:2, clear: false}),
          gridData.transferTimesTotal
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

      row.push(_(rowInfo.upTransfer).convert2yuan({fixed:2, clear: false}));
      row.push(_(rowInfo.downTransfer).convert2yuan({fixed:2, clear: false}));
      row.push(rowInfo.transferTimes);
      return row;
    }
  });

  module.exports = TransferReportView;
});
//56250
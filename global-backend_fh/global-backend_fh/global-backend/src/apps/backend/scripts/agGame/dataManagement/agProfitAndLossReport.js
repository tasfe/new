define(function (require, exports, module) {
  require('prefab/views/searchGrid');

  var AgProfitAndLossReportView = Base.Prefab.SearchGrid.extend({

    template: require('text!agGame/dataManagement/agProfitAndLossReport.html'),

    events: {
      'click .js-pl-account':'userAccountHandler',
      'click .js-pl-bet':'userBetHandler'
    },
    initialize: function () {

      _(this.options).extend({
        title: 'AG代理盈亏记录',
        columns: [
          {
            name: '日期',
            width: '6%'
          },
          {
            name: 'AG用户名',
            width: '6%'
          },
          {
            name: '转入AG',
            width: '6%'
          },
          {
            name: '转出AG',
            width: '6%'
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
          url: '/intra/agmanager/agprofitreport.json'
        },
        subOps: {
          url: '/intra/sysreport/profitdetail.json',
          data: ['userId', 'day']
        }
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
    },
    renderGrid: function (gridData) {
      var self = this;
      var rowsData = _(gridData.dataList).map(function (data, index) {
        return {
          columnEls: this.formatRowData(data, index),
          dataAttr: data
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
          _(gridData.total.transferIn).convert2yuan(),
          _(gridData.total.transferOut).convert2yuan(),
          _(gridData.total.bet).convert2yuan(),
          _(gridData.total.prize).convert2yuan(),
          _(gridData.total.rebate).convert2yuan(),
          _(gridData.total.activity).convert2yuan(),
          _(gridData.total.profit).convert2yuan(),
          {
            colspan: 1
          }
        ]
      })
          .hideLoading();

    },

    formatRowData: function (rowInfo) {
      var row = [];
      row.push(rowInfo.date);
      row.push(rowInfo.userName);
      row.push(_(rowInfo.tramsferIn).convert2yuan());
      row.push(_(rowInfo.transferOut).convert2yuan());
      row.push(_(rowInfo.bet).convert2yuan());
      row.push(_(rowInfo.prize).convert2yuan());
      row.push(_(rowInfo.rebate).convert2yuan());
      row.push(_(rowInfo.activity).convert2yuan());
      row.push(_(rowInfo.profit).convert2yuan());
      row.push(this._formatOperation(rowInfo));
      return row;
    },
    _formatOperation: function (rowInfo) {
      var cell = [];
      cell.push('<button data-type="' + rowInfo.userName + '" class="js-pl-bet btn btn-link">投注</button>');
      return cell.join('');
    },
    userBetHandler:function(e){
      var $target = $(e.currentTarget);
      Global.appRouter.navigate(_('#ag/bt').addHrefArgs({
        _t:_.now(),
        player:$target.data('type')
      }), {trigger: true, replace: false});
    }
  });

  module.exports = AgProfitAndLossReportView;
});
//56250
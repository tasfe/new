define(function(require, exports, module) {

  require('prefab/views/searchGrid');

  var RedPacketListView = Base.Prefab.SearchGrid.extend({

    template: require('text!./redPacket-List.html'),

    initialize: function() {
      _(this.options).extend({
        tableClass: '',
        columns: [
          {
            name: '日期',
            width: '15%'
          },
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '返点等级',
            width: '10%'
          },
          {
            name: '团队投注金额',
            width: '10%'
          },
          {
            name: '获得加奖',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/activitymanage/redenvelopelist.json'
        }
      });
    },

    onRender: function() {
      this.$('input[name=day]').datetimepicker({
        useCurrent: false,
        format:'YYYY-MM-DD',
        defaultDate: moment()
      });

      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },

    renderGrid: function(gridData) {
      var rowsData = _(gridData.dataList).map(function(rowInfo, index) {
        return {
          columnEls: this.formatRowData(rowInfo, index),
          dataAttr: rowInfo
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });
      //加上统计行
      this.grid.addRows({
        columnEls: [
          {
            colspan: 1
          },
          '<strong>总计</strong>',
          {
            colspan: 1
          },
          _(gridData.betTotal).fixedConvert2yuan(),
          _(gridData.amountTotal).convert2yuan()
        ]
      })
          .hideLoading();
    },

    formatRowData: function(rowInfo) {
      var row = [];
      var showRebate = _(rowInfo.userRebate).formatDiv(10);
      row.push(rowInfo.day);
      row.push(rowInfo.username);

      if (rowInfo.userRebate === 128) {
        showRebate += rowInfo.isDirect ? '(总代)' : '(平级总代)';
      }
      row.push(showRebate);
      row.push(_(rowInfo.betTotal).fixedConvert2yuan());
      row.push(_(rowInfo.amount).convert2yuan());

      return row;
    }
  });

  module.exports = RedPacketListView;
});
define(function(require, exports, module) {
  require('prefab/views/searchGrid');


  var InjectBonusView = Base.Prefab.SearchGrid.extend({

    template: require('text!betCenter/templates/species-TicketList-injectBonusList.html'),

    events: {},

    initialize: function() {
      _(this.options).extend({
        columns: [
          {
            name: '奖级',
            width: '10%'
          },
          {
            name: '时间',
            width: '10%'
          },
          {
            name: '注入金额',
            width: '10%'
          },
          {
            name: '操作人',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/ticketmng/bonusinjectlist.json'
        }
      });
    },
    onRender: function() {
      var self = this;
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderGrid: function(gridData) {
      var rowsData = _(gridData.dataList).map(function(dataInfo, index) {
        return {
          columnEls: this.formatRowData(dataInfo, index),
          dataAttr: dataInfo
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      })
      .hideLoading();
    },
    formatRowData: function(rowInfo) {
      var row = [];

      row.push(rowInfo.jakepotName);
      row.push(_(rowInfo.createTime).toTime());
      row.push(_(rowInfo.amount).convert2yuan());
      row.push(rowInfo.userName);

      return row;
    }

  });
  module.exports = InjectBonusView;
});
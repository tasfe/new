define(function (require, exports, module) {
  require('prefab/views/searchGrid');
  var RedDetailView = Base.Prefab.SearchGrid.extend({

    template: require('text!saleCenter/templates/games-moneyTreeDetail.html'),

    events: {
    },

    initialize: function () {
      _(this.options).extend({
        title: '红包活动查看',
        columns: [
          {
            name: '时间',
            width: '25%'
          },
          {
            name: '用户名',
            width: '25%'
          },
          {
            name: '中奖金额',
            width: '25%'
          },
          {
            name: '中奖类型',
            width: '25%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },reqData: {
          activityId:9
        },
        ajaxOps: {
          url: '/intra/activitymanage/moneytreelist.json'
        }
      });
    },
    onRender: function () {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-sc-mt-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(1, 'year')
      }).render();
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderGrid: function (gridData) {
      var rowsData = _(gridData.dataList).map(function (dataInfo, index) {
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
    formatRowData: function (rowInfo) {
      var row = [];
      row.push(_(rowInfo.time).toTime());
      row.push(rowInfo.username);
      row.push(_(rowInfo.result).convert2yuan());
      var type = '';
      switch(rowInfo.resultType){
        case '0':
            type = '钱';break;
        case '1' :
            type = '金砖';break;
        case '2':
          type = '元宝';break;
        case '3' :
          type = '金条';break;
        default : type='';
      }
      row.push(type);//中奖类型
      return row;
    }

  });
  module.exports = RedDetailView;
});
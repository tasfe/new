define(function(require, exports, module) {
  require('prefab/views/searchGrid');

  var prizeConfig = require('./prizeConfig');

  var BonusDetailView = Base.Prefab.SearchGrid.extend({

    template: require('text!./lotteryDetails.html'),

    events: {},

    initialize: function() {
      _(this.options).extend({
        columns: [
          {
            name: '日期',
            width: '10%'
          },
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '奖品',
            width: '10%'
          },
          {
            name: '奖金金额',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        reqData: {
          activityId: 14
        },
        ajaxOps: {
          url: '/intra/activitymanage/talentlotterylist.json'
        }
      });
    },
    onRender: function() {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-sc-lad-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(1, 'year')
      }).render();

      this.$('[name=bonusType]').append(_(prizeConfig.getAll()).map(function(info) {
        return '<option value="' + info.id + '">' + info.zhName + '</option>';
      }).join(''));

      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderGrid: function(gridData) {
      var rowsData = _(gridData.lotteryList).map(function(dataInfo, index) {
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

      row.push(_(rowInfo.date).toTime());
      row.push(rowInfo.userName);
      row.push(prizeConfig.toZh(rowInfo.bonusType));
      row.push(_(rowInfo.bonus).convert2yuan());

      return row;
    }

  });
  module.exports = BonusDetailView;
});
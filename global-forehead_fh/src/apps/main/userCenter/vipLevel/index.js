"use strict";

var SearchGrid = require('com/searchGrid');

var VipLevelView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: '日期',
          width: '20%'
        },
        {
          name: '原vip等级',
          width: '20%'
        },
        {
          name: '新vip等级',
          width: '20%'
        },
        {
          name: '调整类型',
          width: '20%'
        },
        {
          name: '备注',
          width: '20%'
        }
      ],
      gridOps: {
        emptyTip: '没有记录'
      },
      ajaxOps: {
        url: '/acct/vip/vipChange.json',
        abort: false
      },
      reqData: {
        subUser: 0
      },
      //tip: '<div class="m-left-md"><span>提示：</span> 每月初根据积分情况重新调整vip等级。</div>',
      listProp: 'root.dataList',
      height: 400
    });

  },

  onRender: function() {

    SearchGrid.prototype.onRender.apply(this, arguments);

    var acctInfo = Global.memoryCache.get('acctInfo');
    this.$(".js_vipLevel").html(acctInfo.memberLevel);
    this.$(".js-vip-level").addClass('vip-main1')

  },



  renderGrid: function(gridData) {
    var rowsData = _(gridData.dataList).map(function(info, index, list) {
      return {
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    });

    //加上统计行

    this.grid.addFooterRows({

    })
      .hideLoading();

  },

  formatRowData: function(rowInfo) {
    var row = [];
    row.push(rowInfo.date);
    row.push(rowInfo.beforeLevel);
    row.push(rowInfo.afterLevel);
    row.push(rowInfo.upgradeType);
    row.push(rowInfo.remark);
    return row;
  }

});

module.exports = VipLevelView;

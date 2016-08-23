"use strict";

var SearchGrid = require('com/searchGrid');


var GetPrizeView = SearchGrid.extend({

  template: require('./getPrize.html'),

  events: {
    'click .js-getPrize': 'getPrizeHandler',
    'click .vip-success>span':'closepopup',
  },

  initialize: function () {
    _(this.options).extend({
      tableClass:'table vip-table no-margin table-bordered table-no-lr table-center',
      columns: [
        {
          name: '时间',
          width: '40%'
        },
        {
          name: '累积中奖金额',
          width: '20%'
        },
        {
          name: '加奖比例',
          width: '20%'
        },
        {
          name: '加奖金额',
          width: '20%'
        }
      ],
      gridOps: {
        emptyTip: '没有可领取的加奖金额'
      },
      ajaxOps: {
        url: '/acct/vip/queryPlusAward.json'
      },
      listProp: 'root.dataList',
      height: 245,
      tip: '<div class="js-divFlag" ><button  class="js-getPrize btn btn-sun btn-linear input-lg vc-gp-get m-left-lg left-vip">立即领取</button></div>'
    });
  },

  onRender: function() {

    SearchGrid.prototype.onRender.apply(this, arguments);

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
      initPagination: false
    });

    //加上统计行

    this.grid.addFooterRows({

    })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    this.$('.js-divFlag').show();
    var row = [];
    row.push(rowInfo.currentDate+' '+rowInfo.startTime+'至'+rowInfo.endTime);
    row.push(rowInfo.cumulatePrize/10000);
    row.push(rowInfo.proportion/10000+"%");
    row.push(rowInfo.money/10000);
    return row;
  },

  getPrizeInfoXhr: function() {
    return Global.sync.ajax({
      url: '/acct/vip/receivePrize.json'
    });

  },

  getPrizeHandler: function() {

    var self = this;
    this.getPrizeInfoXhr()
      .done(function(res) {
        var self1 = self;
        if (res && res.result === 0) {
          //  Global.ui.notification.show('领取成功', {
          //    type: 'success'
          //  });
          //self1.onRender();
          self1.$('#vip-back').show();
        }else {
          self1.$('#vip-back').show();
          //Global.ui.notification.show('领取失败，有可能是：<br>' + res.msg);
        }
      });
  },
  closepopup:function(){
    this.$("#vip-back").hide()
  }
});





module.exports = GetPrizeView;

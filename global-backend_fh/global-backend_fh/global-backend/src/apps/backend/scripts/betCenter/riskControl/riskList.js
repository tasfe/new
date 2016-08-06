/**
 * Created by David Zhang on 2015/9/13.
 */
define(function (require, exports, module) {
  require('prefab/views/searchGrid');

  var LotteryMonitorView = Base.Prefab.SearchGrid.extend({

    template: require('text!./riskList.html'),

    initialize: function () {
      _(this.options).extend({
        title: '风险控制记录',
        columns: [
          {
            name: '彩种名称',
            width: '10%'
          },
          {
            name: '期号',
            width: '15%'
          },
          {
            name: '销售日期',
            width: '10%'
          },
          {
            name: '销售时间段',
            width: '15%'
          },
          {
            name: '当期开奖号码',
            width: '10%'
          },
          {
            name: '操作',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/ticketmng/risklist.json',
        },
        reqData: {
          ticketId: this.options.ticketId
        }
      });
    },

    onRender: function() {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-bc-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        startFormat: 'YYYY-MM-DD',
        endFormat: 'YYYY-MM-DD',
        showToday: true
      }).render();

      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },

    renderGrid: function(gridData) {
      var self = this;
      self.$('.js-bc-ticketId').remove();
      var currentTicketId = self.$('#jsBCTicketId').val();
      _.map(gridData.types, function(type){
        if(type.ticketId == currentTicketId){
          self.$('#jsBCTicketId').before(
            "<button class='btn btn-sm btn-default js-bc-ticketId m-left-sm m-bottom-sm btn-warning' id='jsBCTicketId"+type.ticketId+"'>"+type.ticketName+"("+type.exceptionCount+")</button>"
          );
        }else{
          self.$('#jsBCTicketId').before(
            "<button class='btn btn-sm btn-default js-bc-ticketId m-left-sm m-bottom-sm' id='jsBCTicketId"+type.ticketId+"'>"+type.ticketName+"("+type.exceptionCount+")</button>"
          );
        }
      });
      var rowsData = _(gridData.opens).map(function(open,index) {
        return {
          columnEls: this.formatRowData(open, index),
          dataAttr: open
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

      row.push(rowInfo.ticketName);
      row.push(rowInfo.planId);
      row.push(_(rowInfo.saleStartTime).toTime('YYYY-MM-DD'));
      row.push(_(rowInfo.saleStartTime).toTime()+"-"+_(rowInfo.saleEndTime).toTime());
      row.push(rowInfo.openNum);
      row.push('<a href="bc/tl/riskDetail/' + this.options.ticketId + '/' + rowInfo.planId + '" class="router btn btn-link">查看详情</a>');

      return row;
    }
  });

  module.exports = LotteryMonitorView;
});

/**
 * Created by David Zhang on 2015/9/13.
 */
define(function (require, exports, module) {
  require('prefab/views/searchGrid');
  var LotteryMonitorView = Base.Prefab.SearchGrid.extend({

    template: require('text!betCenter/templates/species-LotteryMonitor.html'),

    events: {
      'click .js-bc-ticketId': 'changeTicketId',
      'click .js-bc-openStatus': 'changeOpenStatus',
      'click .js-bc-checkStatus': 'changeCheckStatus'
    },

    initialize: function () {
      _(this.options).extend({
        title: '奖期监控',
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
            name: '开奖时间',
            width: '15%'
          },
          {
            name: '开奖号码',
            width: '10%'
          },
          {
            name: '异常情况',
            width: '15%'
          },
          {
            name: '操作状态',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/openmng/openlist.json'
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
      var openStatus;
      var openTime;
      var openNum;
      if(rowInfo.expired == false){
        openStatus = '无异常';
        openTime = '销售中';
        openNum = '-';
      }else if(rowInfo.expired == true){
        if(rowInfo.openStatus==0){
          openStatus = '无异常';
          openTime = '开奖中';
          openNum = '-';
        }else if(rowInfo.openStatus==1){
          openStatus = '官方提前开奖';
          openTime = _(rowInfo.openTime).toTime();
          openNum = rowInfo.openNum;
        }else if(rowInfo.openStatus==2){
          openStatus = '官方未开奖';
          openTime = '无';
          openNum = '无';
        }else if(rowInfo.openStatus==3){
          openStatus = '官方延迟开奖';
          openTime = _(rowInfo.openTime).toTime();
          openNum = rowInfo.openNum;
        }else if(rowInfo.openStatus==4){
          openStatus = '无异常';
          openTime = _(rowInfo.openTime).toTime();
          openNum = rowInfo.openNum;
        }
      }
      row.push(openTime);
      row.push(openNum);
      row.push(openStatus);
      var checkStatus;
      if(rowInfo.checkStatus == 0){
        checkStatus = '未处理';
      }else if(rowInfo.checkStatus == 1){
        checkStatus = '已处理';
      }
      if(Global.authority.bc && Global.authority.bc.lm && Global.authority.bc.lm.lotteryDetail){
        checkStatus = "<a href='" + _.getUrl('/detail/' + rowInfo.ticketResultId) + "' class='router btn btn-link'>"+checkStatus+"</a>"
      }
      row.push(checkStatus);
      return row;
    },

    // 切換搜索彩種
    changeTicketId:function(e){
      var self = this;
      var $target = $(e.currentTarget);
      $target.addClass('btn-warning');
      var $targetId = $target.attr('id');
      self.$('#jsBCTicketId').val($targetId.substr(12,$targetId.length));
    },

    // 切換異常情況
    changeOpenStatus:function(e){
      var self = this;
      var $target = $(e.currentTarget);
      self.$('.js-bc-openStatus').removeClass('btn-warning');
      $target.addClass('btn-warning');
      var $targetId = $(e.currentTarget).attr('id');
      self.$('#jsBCOpenStatus').val($targetId.substr($targetId.length-1,$targetId.length));
    },

    // 切換操作狀態
    changeCheckStatus:function(e){
      var self = this;
      var $target = $(e.currentTarget);
      self.$('.js-bc-checkStatus').removeClass('btn-warning');
      $target.addClass('btn-warning');
      var $targetId = $(e.currentTarget).attr('id');
      self.$('#jsBCCheckStatus').val($targetId.substr($targetId.length-1,$targetId.length));
    }
  });

  module.exports = LotteryMonitorView;
});

/**
 * Created by David Zhang on 2015/9/13.
 */
define(function (require, exports, module) {
  require('prefab/views/searchGrid');
  var trackStatusConfig = require('betCenter/misc/trackStatusConfig');
  var ChaseRecordView = Base.Prefab.SearchGrid.extend({

    template: require('text!betCenter/templates/ticket-ChaseRecord.html'),

    events: {
    },

    initialize: function () {
      _(this.options).extend({
        title: '追号记录',
        columns: [
          {
            name: '追号编号',
            width: '10%'
          },
          {
            name: '彩种名称',
            width: '10%'
          },
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '开始奖期',
            width: '12%'
          },
          {
            name: '已追/总期数',
            width: '12%'
          },
          {
            name: '已投/总金额',
            width: '10%'
          },
          {
            name: '中奖金额',
            width: '5%'
          },
          {
            name: '追号状态',
            width: '8%'
          },
          {
            name: '追号时间',
            width: '15%'
          },
          {
            name: '终端类型',
            width: '5%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/chasemng/chaselist.json'
        },
        exportOps: {
          url: '/intra/chasemng/download'
        }
      });
    },

    onRender: function() {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-bc-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        showToday: true
      }).render();

      this.$('select[name=betStatus]').html(_(trackStatusConfig.get()).map(function(betStatus) {
        return '<option value="' + betStatus.id + '">' + betStatus.zhName + '</option>';
      }).join(''));

      //初始化彩种选择
      new Global.Prefab.TicketSelectGroup({
        el: this.$('.js-uc-ticket-select-group')
      });

      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },


    renderGrid: function(gridData) {
      var self = this;
      var rowsData = _(gridData.chaseList).map(function(order,index) {
        return {
          columnEls: this.formatRowData(order, index),
          dataAttr: order
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });

      this.grid.addRows({
        columnEls: [
          '<strong>所有页总计</strong>',
          {
            colspan: 4
          },
          '￥' + _(gridData.betMoneyTotal).fixedConvert2yuan()+'/￥' +  _(gridData.chaseMoneyTotal).fixedConvert2yuan(),
          '￥' + _(gridData.prizeMoneyTotal).fixedConvert2yuan(),
          {
            colspan: 3
          }
        ]
      })
        .hideLoading();
    },

    formatRowData: function(rowInfo) {
      var row = [];
      if(Global.authority.bc && Global.authority.bc.br && Global.authority.bc.br.chaseRecordDetail) {
        row.push("<a href='" + _.getUrl('/detail/' + rowInfo.ticketTradeNo) + "' class='router btn btn-link'>" + rowInfo.ticketTradeNo + "</a>");
      }else{
        row.push(rowInfo.ticketTradeNo);
      }
      row.push(rowInfo.ticketName);
      row.push(rowInfo.userName);
      row.push(rowInfo.ticketPlanId);
      row.push(rowInfo.chaseBetCount+'/'+rowInfo.chaseAllPeriods);
      row.push('￥' + _(rowInfo.chaseBetMoney).fixedConvert2yuan()+'/￥' +  _(rowInfo.chaseAllMoney).fixedConvert2yuan());
      row.push('￥' + _(rowInfo.chasePrizeMoney).fixedConvert2yuan());

      var chaseStatus;
      if(rowInfo.chaseStatus==0){
        chaseStatus = '未开始';
      }else if(rowInfo.chaseStatus==1){
        chaseStatus = '进行中';
      }else if(rowInfo.chaseStatus==2){
        chaseStatus = '已结束';
      }else if(rowInfo.chaseStatus==3){
        chaseStatus = '已终止';
      }
      row.push(chaseStatus);

      row.push(_(rowInfo.chaseTime).toTime());
      var chaseDevice;
      if(rowInfo.chaseDevice==0){
        chaseDevice = 'PC网页';
      }else if(rowInfo.chaseDevice==1){
        chaseDevice = 'ios';
      }else if(rowInfo.chaseDevice==2){
        chaseDevice = 'android';
      }
      row.push(chaseDevice);
      return row;
    }
  });

  module.exports = ChaseRecordView;
});

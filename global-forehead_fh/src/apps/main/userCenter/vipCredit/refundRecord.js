"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');

var betStatusConfig = require('userCenter/misc/betStatusConfig');

var RefundRecordView = SearchGrid.extend({

  template: require('./refundRecord.html'),

  events: {
    'click .js-checkout': 'checkoutHandler'
  },

  initialize: function () {
    _(this.options).extend({
      columns: [
        {
          name: '借款日期',
          width: '25%'
        },
        {
          name: '借款金额',
          width: '10%'
        },
        {
          name: '投注流水要求',
          width: '15%'
        },
        {
          name: '已完成流水',
          width: '10%'
        },
        {
          name: '剩余流水',
          width: '10%'
        },
        {
          name: '借款状态',
          width: '15%'
        },
        {
          name: '操作',
          width: '15%'
        }
      ],
      gridOps: {
        emptyTip: '没有记录'
      },
      ajaxOps: {
        url: '/acct/vip/repaymentList.json',
        abort: false
      },
      viewType: 'team',
      reqData: {
        subUser: 1
      },
      listProp: 'root.dataList',
      height: 345
    });
  },

  onRender: function() {

    //初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.reqData.startTime?this.options.reqData.startTime:_(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.reqData.endTime?this.options.reqData.endTime:_(moment().endOf('day')).toTime(),
      endOps:{
        viewMode: 'years',
        format: 'YYYY-MM-DD'
      },
      startOps:{
        viewMode: 'years',
        format: 'YYYY-MM-DD'
      }
    }).render();
    if(this.options.reqData.username){
      this.$('input[name="username"]').val(this.options.reqData.username);
    }

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
      initPagination: true
    });

    //加上统计行

    this.grid.addFooterRows({
    })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];

    var d=new Date(rowInfo.applyDate);
    var year=d.getFullYear();
    var day=d.getDate();
    var month=+d.getMonth()+1;
    var hour=d.getHours();
    var minute=d.getMinutes();
    var second=d.getSeconds();
    row.push(year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second);

    //row.push(rowInfo.applyDate);
    row.push(rowInfo.loanMoney/10000);
    row.push(rowInfo.betFlowStandard/10000);
    row.push(rowInfo.finishFlow/10000);
    row.push(rowInfo.surplusFlow/10000);
    row.push(rowInfo.status);

    var index = $(this).parent().prevAll().length;
    if((rowInfo.status).indexOf('结清')>0) {
      row.push("");
      //row.push("<input type='hidden' value='"+(rowInfo.betFlowStandard/rowInfo.loanMoney)+"' class='js-mm-"+index+"'/><input type='hidden' value='"+rowInfo.tradeId+"' class='js-tt-"+index+"'><button class='js-checkout'>申请结算</button></input>");
    }else {
      row.push("<input type='hidden' value='"+(rowInfo.betFlowStandard/rowInfo.loanMoney)+"' class='js-mm-"+index+"'></input><input type='hidden' value='"+rowInfo.tradeId+"' class='js-tt-"+index+"'><button class='js-checkout'>申请结算</button></input>");

    }
    return row;
  },

  checkoutXhr: function(tradeId) {
    return Global.sync.ajax({
      url: '/acct/vip/applySettle.json',
      data: {
        tradeId: tradeId
      }
    });
  },

  checkoutHandler: function(tradeId) {
    var self = this;
    var index = $(this).parent().prevAll().length;
    var confirm = $(document).confirm({
      title: '提示',
      content:'结算时，会优先扣除流水来冲抵借款（每'+$('.js-mm-'+index).val()+'流水可抵消1元借款），</br></br>'+
              '若流水不足，会再从账户余额中进行扣款。您确定要继续吗？',
      agreeCallback: function() {
        //var index = $(this).parent().prevAll().length;
        var tradeId = $('.js-tt-'+index).val();

        self.checkoutXhr(tradeId)
          .done(function(res) {
            var self1 = self;
            if (res && res.result === 0) {
              if(res.root === 0) {
                Global.ui.notification.show('结算成功', {
                  type: 'success'
                });
                self1.onRender();
              }else {
                Global.ui.notification.show('账户余额不足，结算失败');

              }
            }else {
              Global.ui.notification.show('结算失败，有可能是：<br>' + res.msg);
            }
          });
      }
    }).confirm('instance');


    //-----


    /* var index = $(this).parent().prevAll().length;
    var tradeId = $('.js-tt-'+index).val();

    var self = this;
    this.checkoutXhr(tradeId)
      .done(function(res) {
        if (res && res.result === 0) {
          if(res.root === 0) {
            Global.ui.notification.show('结算成功', {
              type: 'success'
            });
            //var $dialog = Global.ui.dialog.show({
            //  title: '温馨提示',
            //  body: '<div class=" fc-re-resultShow text-center">' +
            //  '<div class="text-center font-sm m-bottom-md fc-re-result-desc">结算成功</div>' +
            //  '</div>',
            //  footer: ''
            //});
          }else {
            Global.ui.notification.show('账户余额不足，结算失败');
            //var $dialog = Global.ui.dialog.show({
            //  title: '温馨提示',
            //  body: '<div class=" fc-re-resultShow text-center">' +
            //  '<div class="text-center font-sm m-bottom-md fc-re-result-desc">账户余额不足，结算失败</div>' +
            //  '</div>',
            //  footer: ''
            //});
          }
        }else {
          Global.ui.notification.show('结算失败，有可能是：<br>' + res.msg);
        }
      });*/
  }

});

module.exports = RefundRecordView;

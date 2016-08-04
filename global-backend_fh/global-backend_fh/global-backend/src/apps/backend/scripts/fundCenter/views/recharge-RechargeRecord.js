define(function (require, exports, module) {

  require('prefab/views/searchGrid');

  var chargeListView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/recharge-RechargeRecord.html'),

    events: {},

    initialize: function () {
      _(this.options).extend({
        title: '充值记录',
        columns: [
          {
            name: '交易流水号',
            width: '7%'
          },
          {
            name: '用户名',
            width: '7%'
          },
          {
            name: '申请时间',
            width: '7%'
          },
          {
            name: '加币时间',
            width: '7%'
          },
          {
            name: '收款金额',
            width: '7%'
          },
          {
            name: '手续费',
            width: '7%'
          },
          {
            name: '支付状态',
            width: '8%'
          },
          {
            name: '充值渠道',
            width: '7%'
          },
          {
            name: '充值方式',
            width: '8%'
          },
          {
            name: '收款银行',
            width: '8%'
          },
          {
            name: '收款卡',
            width: '7%'
          },
          {
            name: '收款人',
            width: '7%'
          },
          {
            name: '付款银行',
            width: '7%'
          },
          {
            name: '付款卡',
            width: '7%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/rechargemanage/rechargelist.json'
        },
        exportOps: {
          url: '/intra/rechargemanage/download.json'
        }
      });
    },

    getBankListXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/bankmanage/banklist.json',
        data:data
      });
    },

    onRender: function() {
      var self = this;
      //初始化时间选择控件
      new Global.Prefab.Timeset({
        el: this.$('.js-re-rr-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        showToday: true
      }).render();

      //this.getBankListXhr({bankType:1}).fail(function(){
      //  Global.ui.notification.show('操作失败。');
      //}).done(function(res){
      //  if(res.result===0){
      //    var optionData = _(res.root.bankList||[]).map(function(bank){
      //      return {
      //        value: bank.bankId,
      //        text: bank.bankName
      //      }
      //    });
      //    self.renderSelect(optionData,self.$('.js-fc-re-rr-bank'));
      //  }else{
      //    Global.ui.notification.show('操作失败。');
      //  }
      //});

      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
      this.AmountTotal = this.$('.js-fc-rr-amountTotal');
      this.baofooTotal = this.$('.js-fc-rr-baofooTotal');
      this.jubaoTotal = this.$('.js-fc-rr-jubaoTotal');
      this.yeepayTotal = this.$('.js-fc-rr-yeepayTotal');
      this.moboTotal = this.$('.js-fc-rr-moboTotal');
    },

    renderSelect:function(data,$select){
      var options = [];
      _(data).each(function(item){
        var option = '<option value="'+item.value+'">'+item.text+'</option>';
        options.push(option);
      });
      $select.append(options.join(''));
    },

    renderGrid: function(gridData) {
      this.AmountTotal.html(_(gridData.amountTotal).formatDiv(10000,{fixed: 2}));
      this.baofooTotal.html(_(gridData.baofooTotal).formatDiv(10000,{fixed: 2}));
      this.jubaoTotal.html(_(gridData.jubaoTotal).formatDiv(10000,{fixed: 2}));
      this.yeepayTotal.html(_(gridData.yeepayTotal).formatDiv(10000,{fixed: 2}));
      this.moboTotal.html(_(gridData.moboTotal).formatDiv(10000,{fixed: 2}));
      var rowsData = _(gridData.rechargeList).map(function(recharge, index, rechargeList) {
        return {
          id: recharge.id,
          columnEls: this.formatRowData(recharge, index, rechargeList),
          dataAttr: recharge
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });

      //加上统计行

      this.grid.addRows({
        columnEls: [
          '<strong>所有页总计</strong>',
          {
            colspan: 3
          },
          _(gridData.amountTotal).formatDiv(10000,{fixed: 2}),
          _(gridData.feeTotal).formatDiv(10000,{fixed: 2}),
          {
            colspan: 8
          }
        ]
      })
          .hideLoading();
    },

    formatRowData: function(recharge) {
      var row = [];

      row.push( recharge.tradeNo );
      row.push(recharge.userName);
      row.push(_(recharge.createTime).toTime());
      row.push(_(recharge.payTime).toTime());
      row.push(_(recharge.amount).formatDiv(10000,{fixed: 2}));
      row.push( _(recharge.fee).formatDiv(10000,{fixed: 2}));
      row.push(recharge.status);
      row.push(recharge.recvBankName);
      row.push(recharge.type);
      row.push(recharge.recvBankName);
      row.push(recharge.recvCardNo);
      row.push(recharge.recvName);
      row.push(recharge.payBankName);
      row.push(recharge.payCardNo);
      row.push(recharge.payer);

      return row;
    }
  });

  module.exports = chargeListView;
});
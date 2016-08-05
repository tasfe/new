define(function (require, exports, module) {

  require('prefab/views/searchGrid');
  var tradingStatusConfig = require('fundCenter/misc/tradingStatusConfig');

  var chargeListView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/account-AccountDetailView.html'),

    events: {},

    initialize: function () {
      _(this.options).extend({
        title: '账户明细',
        columns: [
          {
            name: '交易流水号',
            width: '20%'
          },
          {
            name: '用户名',
            width: '8%'
          },
          {
            name: '交易时间',
            width: '15%'
          },
          {
            name: '交易类型',
            width: '7%'
          },
          {
            name: '收入',
            width: '14%'
          },
          {
            name: '支出',
            width: '14%'
          },
          {
            name: '账户余额',
            width: '10%'
          },
          {
            name: '备注',
            width: '12%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/userbalance/history.json'
        }
      });
    },

    onRender: function() {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-fc-accountDetail-timeSet'),
        //startTime: 'startTime',
        //endTime: 'endTime',
        showToday: true
      }).render();

      this.$('select[name=tradeType]').html(_(tradingStatusConfig.get()).map(function(status) {
        return '<option value="' + status.id + '">' + status.searchName + '</option>';
      }).join(''));

      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },

    renderGrid: function(gridData) {
      var rowsData = _(gridData.balanceList).map(function(recharge, index, rechargeList) {
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
          '￥' + _(gridData.income).formatDiv(10000,{fixed:4}),
          '￥' + _(gridData.spending).formatDiv(10000,{fixed:4}),
          {
            colspan: 8
          }
        ]
      })
        .hideLoading();
    },

    formatRowData: function(recharge) {
      var row = [];
      if ( recharge.remark==='投注扣款'||recharge.remark==='中奖'||recharge.remark.indexOf('投注所得')!==-1||recharge.remark==='用户撤单'||recharge.remark==='系统撤单') {
        row.push('<a href="#bc/br/detail/' + recharge.tradeNo + '" class="router btn-link">' + recharge.tradeNo + '</a>');
      } else if(recharge.remark==='追号扣款'||recharge.remark.indexOf('撤销追号')!==-1) {
        row.push('<a href="#bc/cr/detail/' + recharge.tradeNo  + '" class="router btn-link">' + recharge.tradeNo + '</a>');
      } else {
        row.push(recharge.tradeNo);
      }
      row.push(recharge.userName);
      row.push(_(recharge.createTime).toTime());
      row.push(recharge.tradeType);
      var get = '';
      var pay ='';
      if( recharge.amount>0){
        get = +_(recharge.amount).formatDiv(10000,{fixed:4});
      }
      if( recharge.amount<0){
        pay =  +_(recharge.amount).formatDiv(10000,{fixed:4});
      }
      row.push( get);
      row.push( pay);
      row.push(+_(recharge.balance).formatDiv(10000,{fixed:4}));
      row.push(recharge.remark);
      return row;
    }
  });

  module.exports = chargeListView;
});
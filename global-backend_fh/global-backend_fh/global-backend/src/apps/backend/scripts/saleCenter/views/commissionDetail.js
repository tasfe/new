/**
 * Created by David Zhang on 2015/12/11.
 */
define(function (require, exports, module) {
  require('prefab/views/searchGrid');
  var commissionDetailView = Base.Prefab.SearchGrid.extend({

    template: require('text!saleCenter/templates/commissionDetail.html'),

    initialize: function () {
      _(this.options).extend({
        title: '活动查看',
        columns: [
          {
            name: '日期',
            width: '10%'
          },
          {
            name: '消费用户名',
            width: '10%'
          },
          {
            name: '消费金额',
            width: '10%'
          },
          {
            name: '上级用户名',
            width: '10%'
          },
          {
            name: '上级获得金额',
            width: '10%'
          },
          {
            name: '上级领取状态',
            width: '10%'
          },
          {
            name: '上上级用户名',
            width: '10%'
          },
          {
            name: '上上级获得金额',
            width: '10%'
          },
          {
            name: '上上级领取状态',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/agentCommission/commissiondetail.json'
        }
      });
    },

    onRender: function() {
      var self = this;
      //初始化时间选择
      self.$('.js-sp-time').datetimepicker({
          format: 'YYYY-MM-DD'
        }
      );
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },


    renderGrid: function(gridData) {
      var self = this;
      var rowsData = _(gridData.detailList).map(function(order,index) {
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
            colspan: 1
          },
          '￥' + _(gridData.consumeAmountTotal).convert2yuan(),
          {
            colspan: 1
          },
          '￥' + _(gridData.curHigherAmountTotal).convert2yuan(),
          {
            colspan: 2
          },
          '￥' + _(gridData.indirectHigherAmountTotal).convert2yuan(),
          {
            colspan: 1
          }
        ]
      })
        .hideLoading();
    },

    formatRowData: function(rowInfo) {
      var row = [];
      row.push(_(rowInfo.commissionDate).toTime('YYYY-MM-DD'));
      row.push(rowInfo.consumeUser);
      row.push('￥'+_(rowInfo.consumeAmount).convert2yuan());
      row.push(rowInfo.curhigherUser);
      row.push('￥'+_(rowInfo.curhigherAmount).convert2yuan());
      row.push(rowInfo.curhigherStatus == 0 ? '未领取':'已领取');
      row.push(rowInfo.indirecthigherUser);
      row.push('￥'+_(rowInfo.indirecthigherAmount).convert2yuan());
      row.push(rowInfo.indirecthigherStatus == 0 ? '未领取':'已领取');
      return row;
    }
  });

  module.exports = commissionDetailView;
});

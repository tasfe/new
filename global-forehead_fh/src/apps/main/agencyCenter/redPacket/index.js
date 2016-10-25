"use strict";

var SearchGrid = require('com/searchGrid');

var agentLevels = {
  '0': '直属总代',
  '1': '平级总代',
  '2': '12.7',
  '3': '12.6',
  '4': '12.5'
};

var RedPacketView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  getRuleXhr: function() {
    return Global.sync.ajax({
      url: '/fund/redenvelope/info.json'
    });
  },

  initialize: function() {
    _(this.options).extend({
      height: 330,
      title: '报表查询',
      columns: [
        {
          name: '日期',
          width: '25%'
        },
        {
          name: '团队总投注额',
          width: '25%'
        },
        {
          name: '获得红包',
          width: '25%'
        },
        {
          name: '操作',
          width: '25%'
        }
      ],
      gridOps: {
        emptyTip: '没有红包记录'
      },
      ajaxOps: {
        url: '/fund/redenvelope/list.json'
      },
      divider: false
    });
  },

  onRender: function() {
    var self = this;
    this.getRuleXhr()
      .done(function(res) {
        var data;
        if (res && res.result === 0) {
          data = res.root || {};
          self.$('.js-ac-agentLevel').text(agentLevels[data.agentLevel]);
          self.$('.js-ac-cycle').text(data.cycle);
          self.$('.js-ac-rewards').html(_(data.itemList).map(function(item) {
            if (item.redEnvelopeType === 'fix') {
              return '达到' + _(item.salesVolume).convert2yuan({clear: true}) + '元可获得' + _(item.redEnvelopeVal).convert2yuan({clear: true}) + '元红包';
            } else {
              return '达到' + _(item.salesVolume).convert2yuan({clear: true}) + '元可获得' + _(item.redEnvelopeVal).formatDiv(100) + '%红包';
            }
          }).join('，'));
        }
      });

    //初始化彩种
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

    if (!_(gridData.parents).isEmpty()) {
      this._breadList = _(gridData.parents).map(function(parent, index) {
        return {
          data: {
            userParentId: parent.userId
          },
          label: parent.userName
        };
      });
      this.renderBread();
    }

    this.grid.addFooterRows({
        trClass: 'tr-footer',
        columnEls: [
          '<strong>总计</strong>',
          _(gridData.betTotal).convert2yuan(),
          _(gridData.amountTotal).convert2yuan(),
          ''
        ]
      })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];
    row.push(rowInfo.day);

    row.push(_(rowInfo.betTotal).fixedConvert2yuan());
    row.push(_(rowInfo.amount).fixedConvert2yuan());
    row.push('<a href="' + _.addHrefArgs('#uc/ad', 'tradeNo', rowInfo.tradeNo) + '" class="router btn btn-link no-padding">查看明细</a>');

    return row;
  }
});

module.exports = RedPacketView;

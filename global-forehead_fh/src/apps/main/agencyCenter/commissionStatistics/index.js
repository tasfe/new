"use strict";

var SearchGrid = require('com/searchGrid');

var ReportManageView = SearchGrid.extend({

  template: require('./index.html'),

  className: 'ac-cs-view',

  events: {
  },

  initialize: function () {
    _(this.options).extend({
      height: 330,
      title: '报表查询',
      columns: [
        {
          name: '账号',
          width: '10%'
        },
        {
          name: '关系',
          width: '10%'
        },
        {
          name: '消费金额',
          width: '10%'
        },
        {
          name: '佣金',
          width: '10%'
        }
      ],
      // tip: 'juliencs',
      gridOps: {
        emptyTip: '没有佣金变更记录'
      },
      ajaxOps: {
        url: '/info/agentCommission/list.json'
      }
    });
  },

  onRender: function () {
    //初始化时间选择
    var self = this;
    this.$('.js-ac-timeSel').datetimepicker({
      useCurrent: false,
      format: 'YYYY-MM-DD',
      defaultDate: _(moment().add('days',-1)).toDate(),
      minDate: moment().add('days',-330)
    });
    //初始化彩种
    SearchGrid.prototype.onRender.apply(this, arguments);
  },

  renderGrid: function(gridData) {
    var rowsData = _(gridData.detailList).map(function(fundTrace, index, betList) {
      return {
        columnEls: this.formatRowData(fundTrace, index, betList),
        dataAttr: fundTrace
      };
    }, this);

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true
    });
    
    var iIs = 0;
    if (rowsData != null && rowsData != '') {
      iIs = 1;
    }

    this.grid.addFooterRows({
      trClass: 'julien-table-footer',
      columnEls: [
        '所有页面总计',
        _(gridData.commissionAmount).fixedConvert2yuan()
      ],
      iIs: iIs
    }).hideLoading();
  },

  formatRowData:function(rowInfo) {
    var row = [];
    var onlineStatus = '<span class="ac-llm-online">●</span>';

    //if (rowInfo.userSubAcctNum ) {
    //  row.push('<a class="js-pf-sub btn-link " data-label="' + rowInfo.userName +
    //      '" data-user-parent-id="' + rowInfo.userId + '" href="javascript:void(0)">' +
    //      rowInfo.userName+'(' +rowInfo.userSubAcctNum + ')</a> '+(rowInfo.online?onlineStatus:''));
    //} else {
    row.push('<span class="text-coffee">'+rowInfo.consumeUser+'</span>'+(rowInfo.online?onlineStatus:''));
    //}
    row.push(rowInfo.relationship);
    row.push(_(rowInfo.consumeAmount).fixedConvert2yuan());
    row.push(_(rowInfo.commissionAmount).fixedConvert2yuan());

    return row;
  }
});

module.exports = ReportManageView;

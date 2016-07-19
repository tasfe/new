"use strict";

var SearchGrid = require('com/searchGrid');

var ReportManageView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
    'blur .js-ac-timeSel': 'submitForm'
  },

  initialize: function () {
    _(this.options).extend({
      height: '364',
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
        },
        {
          name: '操作',
          width: '10%'
        }
      ],
      tip: '<div class="m-left-md"><span>注意:</span> 只保留最近30天的报表查询。</div>',
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

    //if (!_(gridData.parents).isEmpty()) {
    //  this._breadList = _(gridData.parents).map(function(parent, index) {
    //    return {
    //      data: {
    //        userParentId: parent.userId
    //      },
    //      label: parent.userName
    //    };
    //  });
    //  this.renderBread();
    //}

    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '<strong>所有页统计</strong>',
        '',
        _(gridData.betTotal).fixedConvert2yuan(),
        _(gridData.commissionAmount).fixedConvert2yuan(),
        ''
      ]
    })
      .hideLoading();
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
    row.push('<a href="' + _.addHrefArgs('#ac/betting/' + rowInfo.consumeUserId, 'name', rowInfo.consumeUser) + '" class="router btn btn-link no-padding text-sunshine">查看投注</a>&nbsp;&nbsp;');

    return row;
  },

  submitForm: function(e){
    var $target = $(e.currentTarget);
    var $form = $target.closest('form').trigger('submit');
  }
});

module.exports = ReportManageView;

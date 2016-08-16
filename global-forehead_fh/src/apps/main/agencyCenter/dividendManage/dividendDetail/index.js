"use strict";

var DividendDetailView = Base.ItemView.extend({

  template: '',

  options: {
    url: '/fund/divid/subdividdetail.json'
  },

  render: function() {
    var self = this;

    return this.$el.staticGrid({
      tableClass: 'table table-bordered table-hover table-center',
      height: 369,
      colModel: [
        {label: '结算日期', name: 'cycle', width: '10%'},
        {label: '用户名', name: 'username', width: '10%'},
        {label: '团队投注', name: 'betTotal', width: '10%', formatter: function(val) {
          return _(val).fixedConvert2yuan();
        }},
        {label: '团队盈亏', name: 'profitTotal', width: '10%', formatter: function(val) {
          return _(val).fixedConvert2yuan();
        }},
        {label: '分红比例', name: 'divid', width: '10%', formatter: function(val) {
          return _(val).formatDiv(100);
        }},
        {label: '分红金额', name: 'dividTotal', width: '10%', formatter: function(val) {
          return _(val).convert2yuan();
        }}
      ],
      dataProp: 'root.dividList',
      url: this.options.url,
      data: {
        dividId: this.options.dividId,
        userId: this.options.userId
      }
    })
      .on('update:done', function(e, data) {
        if (!data) {
          return;
        }
        self.$el.staticGrid('addFooterRows', {
          trClass: 'tr-footer',
          columnEls: [
            '<strong>总计</strong>', '',
            _(data.betTotal).fixedConvert2yuan(),
            _(data.profitTotal).fixedConvert2yuan(),
            '',
            _(data.dividTotal).convert2yuan()
          ]
        });
      });
  }
});

module.exports = DividendDetailView;

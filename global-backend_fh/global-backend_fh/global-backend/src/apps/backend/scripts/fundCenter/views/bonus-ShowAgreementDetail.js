define(function (require, exports, module) {

  var TicketListView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bonus-ShowAgreementDetail.html'),

    events: {},

    initialize: function () {
    },

    onRender: function () {
      var self = this;
      this._loadPage('js-bc-ticketListGrid');
    },

    _loadPage: function (classValue) {
      var self = this;
        self._getStandTable(self._formatStandData(self.options.agreement), classValue);
    },

    //获取表格(标准)
    _getStandTable: function (tableInfo, classValue) {
      this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '日量标准（元） ≥', name: 'saleAmount',width: 100},
          {label: '分红比例（%）', name: 'div', width: 100}
        ],
        row: tableInfo
      });
    },
    //格式化数据（标准）
    _formatStandData: function (agreement) {
      return _(agreement).map(function (agree) {
        return {
          'saleAmount': _(agree.betTotal).formatDiv(10000, {fixed: 2}),
          'div':_( agree.divid).formatDiv(100, {fixed: 2})
        };
      });
    }
  });
  module.exports = TicketListView;
});
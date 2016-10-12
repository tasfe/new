define(function (require, exports, module) {

  var TicketListView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/games-ShowAgreementDetail.html'),

    events: {},

    initialize: function () {
    },

    onRender: function () {
      var self = this;
      this._loadPage('js-bc-ticketListGrid');
    },

    _loadPage: function (classValue) {
      var self = this;
      if(self.options.agreement.length>1) {
        self._getStandTable(self._formatStandData(self.options.agreement), classValue);
      }else if(self.options.agreement.length==1){
        if(self.options.agreement[0].saleSpan==0) {
          self._getStandTable(self._formatStandData(self.options.agreement), classValue);
        }else{
          self._getTable(self._formatData(self.options.agreement), classValue);
        }
      }

    },

    //获取表格(标准)
    _getStandTable: function (tableInfo, classValue) {
      this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '日销量', name: 'saleAmount',width: 100},
          {label: '日薪金额', name: 'salaryAmount', width: 100},
          {label: '亏损限制', name: 'needLoss', width: 100},
          {label: '最少亏损', name: 'lossLimit', width: 100}
        ],
        row: tableInfo
      });
    },
    //获取表格(非标准)
    _getTable: function (tableInfo, classValue) {
      this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '日量要求基础值', name: 'saleAmount',width: 100},
          {label: '日薪发放基础值', name: 'salaryAmount', width: 100},
          {label: '日量要求跨度值', name: 'saleSpan', width: 100},
          {label: '日薪发放跨度值', name: 'salarySpan', width: 100},
          {label: '日薪最高值', name: 'maxSalary', width: 100},
          {label: '是否需要亏损', name: 'needLoss', width: 100}
        ],
        row: tableInfo
      });
    },
    //格式化数据（标准）
    _formatStandData: function (agreement) {
        return _(agreement).map(function (agree) {
          return {
            'saleAmount': _(agree.saleAmount).formatDiv(10000, {fixed: 2}),
            'salaryAmount':_( agree.salaryAmount).formatDiv(10000, {fixed: 2}),
            'needLoss': agree.needLoss==true?'开' : '关',
            'lossLimit':_( agree.lossLimit).formatDiv(10000, {fixed: 2})
          };
        });
    },
    //格式化数据
    _formatData: function (agreement) {
      return _(agreement).map(function (agree) {
        return {
          'saleAmount': _(agree.saleAmount).formatDiv(10000, {fixed: 2}),
          'salaryAmount':_( agree.salaryAmount).formatDiv(10000, {fixed: 2}),
          'saleSpan': _(agree.saleSpan).formatDiv(10000, {fixed: 2}),
          'salarySpan':_( agree.salarySpan).formatDiv(10000, {fixed: 2}),
          'maxSalary':_( agree.maxSalary).formatDiv(10000, {fixed: 2}),
          'needLoss': agree.needLoss==true?'是' : '否'
        };
      });
    }
  });
  module.exports = TicketListView;
});
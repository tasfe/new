define(function (require, exports, module) {

  require('prefab/views/searchGrid');

  var AbnormalWithdrawAuditView =  Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/bonus-FirstGenerationMan-Detail.html'),

    events: {

    },

    initialize: function () {
      _(this.options).extend({
        tableClass: '',
        checkable: false,
        columns: [
          {
            name: '结算日期',
            width: '15%'
          },
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '团队投注',
            width: '10%'
          },
          {
            name: '团队盈亏',
            width: '10%'
          },
          {
            name: '分红比例',
            width: '10%'
          },
          {
            name: '分红金额',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/dividmng/subdetail.json'
        },
        pagination: false
      });
    },
    //发送请求
    _getBonusXhr: function (params) {
      return Global.sync.ajax({
        url: '/intra/dividmng/subdetail.json',
        data: params
      });
    },
    onRender: function(){
      var self = this;
      //this._getBonusXhr({dividId:this.options.dividId}).fail(function(){
      //
      //}).done(function(res){
      //  if(res.result===0){
      //    self._getTable(res.dividList,this.$el);
      //  }
      //});
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    //获取表格
    _getTable: function (tableInfo, classValue) {
      this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '结算日期', name: 'day', width: 150},
          {label: '用户名', name: 'username', width: 150},
          {label: '团队投注', name: 'betTotal', width: 150},
          {label: '团队盈亏', name: 'profitTotal', width: 150},
          {label: '分红比例', name: 'divid', width: 150},
          {label: '分红金额', name: 'dividTotal', width: 150}
        ],
        row: tableInfo
      });
    },
    renderGrid: function(gridData) {
      var self = this;
      var rowsData = _(gridData.dividList).map(function(divided,index) {
        return {
          columnEls: this.formatRowData(divided, index),
          dataAttr: divided
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: false
      });

      this.grid.addRows({
          columnEls: [
            '<strong>总计</strong>',
            '',
            _(gridData.betTotal).fixedConvert2yuan(),
            _(gridData.profitTotal).convert2yuan(),
            '',
            _(gridData.dividTotal).convert2yuan()
          ]
        })
        .hideLoading();

      this.$('.js-pf-search-bar').addClass('hidden');
    },
    formatRowData: function(dividend){
      var row = [];
      row.push(dividend.cycle);
      row.push(dividend.username);
      row.push(_(dividend.betTotal).fixedConvert2yuan());
      row.push( _(dividend.profitTotal).convert2yuan());
      row.push( _(dividend.divid).formatDiv(100));
      row.push( _(dividend.dividTotal).convert2yuan());
      return row;
    }

  });

  module.exports = AbnormalWithdrawAuditView;
});
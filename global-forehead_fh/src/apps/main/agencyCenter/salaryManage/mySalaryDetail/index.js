"use strict";

var SearchGrid = require('com/searchGrid');

var Timeset = require('com/timeset');
var BtnGroup = require('com/btnGroup');
var SalaryConfView = require('./../salaryConf/');

var SalaryRecordsView = SearchGrid.extend({

  template: require('./index.html'),

 // des_template : require('./salaryDescription.html'),

  events: {
    'click .js-ac-state': 'stateHandler',
    'click .js-ac-daily-divid-apply': 'applyDividendHandler',
    'click .js-ac-sm-mySalary-conf': 'watchMySalarayConfHandler'
  },

  applySalaryXhr: function(data){
    return Global.sync.ajax({
      url: '/acct/wages/get.json',
      data: data
    });
  },

  //getSalaryConfXhr: function(data){
  //  return Global.sync.ajax({
  //    url: '/acct/wages/cfg.json',
  //    data: data
  //  });
  //},
  //查询日薪签约信息
  //getSalaryConfXhr: function(data){
  //  return Global.sync.ajax({
  //    url: '/info/dailysalary/reqinfo.json',
  //    data: data
  //  });
  //},
  //查询日薪签约信息
  getSalaryConfXhr: function(data){
    return Global.sync.ajax({
      url: '/info/dailysalary/info.json',
      data: data
    });
  },
  serializeData: function() {
    return this.options;
  },

  initialize: function () {

    _(this.options).extend({

	  height: '309',

      columns: [
        {
          name: '结算日期',
          width: '25%'
        },
        {
          name: '销量',
          width: '25%'
        },
        {
            name: '日薪',
            width: '25%'
        },
        {
          name: '发放状态',
          width: '25%'
        }
      ],
      gridOps: {
        emptyTip: '没有日薪记录'
      },
      ajaxOps: {
        url: '/info/dailysalary/list.json',
        abort: false
      },
      reqData: {
        subUser: 0
      },
      listProp: 'root.dataList',
      tip: '注意：只保留最近35天的数据。',
      willLoad:false
    });
  },

  onRender: function() {
    var self = this;

    // this.timeset = new Timeset({
    //   el: this.$('.js-ac-sm-my-timeset'),
    //   startDefaultDate: _(moment().startOf('day')).toTime(),
    //   endDefaultDate: _(moment().endOf('day')).toTime()
    // }).render();

    this.timeset = new Timeset({
      el: this.$('.js-ac-sm-my-timeset'),
      startDefaultDate: '',
      endDefaultDate: ''
    }).render();


    this.$btnGroup = this.$('.js-pf-btnGroup');
    this.firstTime = true;
    this.btnGroup = new BtnGroup({
      el: this.$btnGroup,
      prevClass: 'js',
      styleClass: 'btnGroup-gray',
      onBtnClick: function(offset) {
        self.timeset.$startDate.data("DateTimePicker").date(moment().add(offset, 'days').startOf('day'));
        self.timeset.$endDate.data("DateTimePicker").date(moment().add(offset === -1 ? -1 : 0, 'days').endOf('day'));
        (self.$searchForm && !self.firstTime) && self.$searchForm.trigger('submit');
        return false;
      }
    }).render();
    this.firstTime = false;

    // self.timeset.$startDate.data("DateTimePicker").date(moment().add(-1, 'days').startOf('day'));
    // self.timeset.$endDate.data("DateTimePicker").date(moment().add(-1, 'days').endOf('day'));

    this.$btnGroup.find('button').removeClass('active');

    this.timeset.$startDate.on('dp.change', function() {
      if (self.btnGroup) {
        self.btnGroup.clearSelect();
      }
    });

    this.timeset.$endDate.on('dp.change', function() {
      if (self.btnGroup) {
        self.btnGroup.clearSelect();
      }
    });

    self.timeset.$startDate.data('');

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
//      initPagination: false
    });

    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
		  '<strong>所有页总计</strong>',
		  gridData.saleAmountTotal/10000 ,
      gridData.salaryAmountTotal/10000 ,
		  ''
      ]
    })
      .hideLoading();
  },

  formatRowData: function(rowInfo) {
    var row = [];

    row.push(_(rowInfo.salaryDate).toTime());
    row.push(rowInfo.saleAmount/10000);
    row.push(rowInfo.salaryAmount/10000);
    var statusDes = '';
    switch (rowInfo.status) {
      case 0:
        statusDes = '未发放';
        break;
      case 1:
        statusDes = '已发放';
        break;
      default:
        statusDes = '';
    }
    row.push(statusDes);
    return row;
  },
  watchMySalarayConfHandler: function(){
    var acctInfo = Global.memoryCache.get('acctInfo');
    this.getSalaryConfXhr().done(function(res){
      if(res.result==0){
        var $dialog = Global.ui.dialog.show({
          title: '我的日薪标准',
          body: '<div class="js-ac-add-container"></div>',
          modalClass: 'ten',
          size: 'modal-lg',
          footer: ''
        }).on('hidden.modal', function () {
          $(this).remove()
        });

        var $container = $dialog.find('.js-ac-add-container');

        var salaryConfView = new SalaryConfView({
          el: $container,
          agreement: res.root
        }).render();

        $dialog.on('hidden.modal', function() {
          $(this).remove();
          salaryConfView.destroy();
        });
      }
    });

  }

});

module.exports = SalaryRecordsView;

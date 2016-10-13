"use strict";

var WatchView = Base.ItemView.extend({

  template: require('./index.html'),

  approveXhr: function(data) {
    return Global.sync.ajax({
      url: '/info/dailysalary/approve.json',
      data: data
    });
  },

  onRender: function() {

    var self = this;

    this.$table = this.$('.js-ac-sm-agree-table');
    this.$tableSpecial = this.$('.js-ac-sm-agree-table-special');

    var list = this.options.agreement;
    var salarySpan = list[0].salarySpan;

    if(salarySpan>0){
      self.$('.js-ac-sm-agree-table-special-container').removeClass('hidden');
      self.$table.addClass('hidden');
    }else{
      self.$table.removeClass('hidden');
      self.$('.js-ac-sm-agree-table-special-container').addClass('hidden');
    }

    self.$table.staticGrid({
      colModel: [
        {label: '日薪等级', name: 'level', key: true, width: '20%', formatter: function(val,index) {
          return index+1;
        }},
        {label: '日量要求', name: 'saleAmount', width: '20%', formatter: function(val,index,rowInfo) {
          return '≥'+_(val).convert2yuan({fixed:0});
        }},
        {label: '是否需要亏损', name: 'needLoss', width: '20%', formatter: function(val,index,rowInfo) {
          return val?'是':'否';
        }},
        {label: '亏损要求', name: 'lossLimit', width: '20%', formatter: function(val,index,rowInfo) {

          return rowInfo.needLoss?'≥'+_(val).convert2yuan({fixed:0}):'/';
        }},
        {label: '日薪标准', name: 'salaryAmount', width: '20%', formatter: function(val,index,rowInfo) {
          return _(val).convert2yuan({fixed:0});
        }},
      ],
      height: 270,
      row: list||[],
      startOnLoading: false
    });

    self.$tableSpecial.staticGrid({
      colModel: [
        {label: '日量要求基础值', name: 'saleAmount', key: true, width: '15%', formatter: function(val,index) {
          return '≥'+_(val).convert2yuan({fixed:0});
        }},
        {label: '日薪发放基础值', name: 'salaryAmount', width: '15%', formatter: function(val,index,rowInfo) {
          return _(val).convert2yuan({fixed:0});
        }},
        {label: '日量要求跨度值', name: 'saleSpan', width: '15%', formatter: function(val,index,rowInfo) {
          return _(val).convert2yuan({fixed:0});
        }},
        {label: '日薪发放跨度值', name: 'salarySpan', width: '15%', formatter: function(val,index,rowInfo) {
          return _(val).convert2yuan({fixed:0});
        }},
        {label: '日薪最高值', name: 'maxSalary', width: '15%', formatter: function(val,index,rowInfo) {
          return val ? _(val).convert2yuan({fixed:0}) : '无限制';
        }},
        {label: '是否需要亏损', name: 'needLoss', width: '25%', formatter: function(val,index,rowInfo) {
          return val?'是':'否';
        }},
      ],
      height: 34,
      row: list||[],
      startOnLoading: false
    });

  },


});

module.exports = WatchView;

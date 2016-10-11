"use strict";

var DividendDetailView = require('./../dividendDetail');

var StatisticView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-ad-statics': 'changeHandler',
    'click .js-ad-detail': 'detailHandler',
    'click .js-ac-status-op': 'opHandler',
    'click .js-ac-dm-description': 'configHandler'
  },

  getDividendDetailXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/subdividdetail1.json',
      data: data
    });
  },

  serializeData: function() {
    return this.options;
  },

  onRender: function() {
    this.$btnDetail = this.$('.js-ad-detail');
    this.$betTotal = this.$('.js-ac-betTotal');
    this.$profitTotal = this.$('.js-ac-profitTotal');
    this.$divid = this.$('.js-ac-divid');
    this.$addDivid = this.$('.js-ac-addDivid');
    this.$dividTotal = this.$('.js-ac-dividTotal');
    this.$freezeTotal = this.$('.js-ac-freezeTotal');
    this.$freezeContainer = this.$('.js-ac-freezeTotal-container');

    this.$status = this.$('.js-ac-status');

    this.$('.js-ad-statics').eq(0).click();
    var dividId = this.$('.js-ad-statics').eq(0).data('id');
    this.trigger('click:tab', null, {
      dividId: dividId,
    });

    this.$('.js-ac-freeze-top').popover({
      trigger: 'hover',
      html: true,
      content: '<strong>冻结金额</strong> <br />应该发放给签约下级的分红金额，平台将暂时冻结',
      placement: 'bottom'
    });
  },

  changeHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var index = $target.index();
    var info = this.options.dividList[index];

    $target.addClass('active').siblings().removeClass('active');

    if (this.options.level.name === 'TOP') {
      this.$btnDetail.remove();
    } else {
      this.$btnDetail.data({
        dividId: info.dividId,
        cycle: info.cycle
      });
    }

    this.$betTotal.text(_(info.betTotal).fixedConvert2yuan());
    this.$profitTotal.text(_(info.profitTotal).convert2yuan({clear: false}));
    this.$divid.text(_(info.divid).formatDiv(100));
    this.$addDivid.text(_(info.addDivid).formatDiv(100));
    this.$dividTotal.text(_(info.dividTotal).convert2yuan({clear: false}));

    this.$freezeContainer.toggleClass('hidden', !info.freezeTotal);

    var statusInfo = _(this.options.level.status).findWhere({
      id: info.status
    });

    this.$status.html(statusInfo.type === 'button' ?
    '<button class="js-ac-status-op btn btn-sm ac-status-op" data-loading-text="' + statusInfo.loadingText + '" data-status="' + info.status +
    '" data-divid-id="' + info.dividId + '">' + statusInfo.zhName + '</button>' : statusInfo.zhName);//

    self.getDividendDetailXhr({
        dividId: info.dividId,
      })
      .always(function() {
      })
      .done(function(res) {
        if (res && res.result === 0) {
          self.$('.js-ac-dm-md-report').staticGrid({
            wrapperClass: 'm-top-md',
            height: '310',
            colModel: [
              {label: '日期', name: 'cycle', merge: false, width: 100},
              {label: '团队销量', name: 'betTotal', merge: false, width: 150},
              {label: '盈亏', name: 'profitTotal', width: 150}
            ],
            row: self.formatData((res.root && res.root.dividList)||[]),
            startOnLoading: false
          });
        }else{
          Global.ui.notification.show(res.msg)
        }
        //self.refresh();
      });
  },

  detailHandler: function(e) {
    var $target = $(e.currentTarget);

    var $dialog = Global.ui.dialog.show({
      title: $target.data('cycle') + '的分红明细',
      size: 'modal-lg',
      body: '<div class="js-ac-detail"></div>',
      footer: ''
    });

    var $detail = $dialog.find('.js-ac-detail');

    new DividendDetailView({
      dividId: $target.data('dividId'),
      url: this.options.dividendUrl,
      el: $detail
    }).render();
  },

  opHandler: function(e) {
    var $target = $(e.currentTarget);

    this.trigger('click:op', e, {
      dividId: $target.data('dividId'),
      status: $target.data('status')
    });
  },

  configHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var conf = this.options.signList;
    if(!conf){
      Global.ui.notification.show('分红配置获取失败！');
      return false;
    }
    var $dialog = Global.ui.dialog.show({
      title: '平台日分红规则',
      body: '<div class="js-ac-dm-my-agreement"></div>',
      modalClass: 'ten',
      //size: 'modal-lg',
      footer: ''
    });
    $dialog.find(".js-ac-dm-my-agreement").staticGrid({
      wrapperClass: '',
      colModel: [
        {label: '日量标准', name: 'betTotal', key: true, width: 150, formatter: function(val) {
          return _(val).convert2yuan();
        }},
        {label: '分红比例', name: 'divid', width: 150, formatter: function(val) {
          return _(val).formatDiv(100,{fixed:0})+'%';
        }},

        //{label: '备注', name: 'remark', width: 300}
      ],
      height: 270,
      row: conf,
      startOnLoading: false
      //url: '/acct/login/loginhistory.json'
    });

  },
  formatAgreement: function(list){
    list = _(list).map(function(item){

    })
  },
  //格式化我的分红数据
  formatData: function(list){
    //金额负的红色，正的绿色
    return _(list).map(function(item){
      return {
        cycle: item.cycle,
        betTotal: _(item.betTotal).convert2yuan(),
        profitTotal: _(item.profitTotal).convert2yuan({clear: false,color0: '#3c993b',color1: '#ce010f'})
      }
    })

  }

});

module.exports = StatisticView;

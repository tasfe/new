"use strict";

var DividendDetailView = require('./../dividendDetail');

var StatisticView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-ad-statics': 'changeHandler',
    //'click .js-ad-detail': 'detailHandler',
    'click .js-ac-status-op': 'opHandler'
  },

  serializeData: function() {
    return this.options;
  },

  onRender: function() {
    this.$detail = this.$('.js-ac-detail');
    this.$betTotal = this.$('.js-ac-betTotal');
    this.$profitTotal = this.$('.js-ac-profitTotal');
    this.$divid = this.$('.js-ac-divid');
    this.$dividTotal = this.$('.js-ac-dividTotal');
    this.$freezeTotal = this.$('.js-ac-freezeTotal');
    this.$freezeContainer = this.$('.js-ac-freezeTotal-container');

    this.$status = this.$('.js-ac-status');

    this.$('.js-ad-statics').eq(0).click();

    this.$('.js-ac-freeze-top').popover({
      trigger: 'hover',
      html: true,
      content: '<strong>冻结金额</strong> <br />应该发放给签约下级的分红金额，平台将暂时冻结',
      placement: 'bottom'
    });

    //this.detailChange(0);
  },

  detailChange: function(index) {
    var info = this.options.dividList[index];

    if (this.detailGrid) {
      this.detailGrid.destroy();
    }

    this.detailGrid = new DividendDetailView({
      dividId: info.dividId,
      url: '/fund/divid/subdividdetail.json',
    }).render();
    this.$detail.html(this.detailGrid.el);
  },

  changeHandler: function(e) {
    var $target = $(e.currentTarget);
    var index = $target.index();
    var info = this.options.dividList[index];

    $target.addClass('active').siblings().removeClass('active');

    this.$betTotal.text(_(info.betTotal).fixedConvert2yuan());
    this.$profitTotal.text(_(info.profitTotal).convert2yuan({clear: false}));
    this.$divid.text(_(info.divid).formatDiv(100));
    this.$dividTotal.text(_(info.dividTotal).convert2yuan({clear: false}));

    //this.$freezeContainer.toggleClass('hidden', !info.freezeTotal);
    //this.$freezeTotal.text(_(info.freezeTotal).convert2yuan());

    //if (info.freezeTotal) {
    //  this.$('.ac-statics-detail-item').css('width', '20%');
    //}

    var statusInfo = _(this.options.level.status).findWhere({
      id: info.status
    });

    this.$status.html(statusInfo.type === 'button' ?
    '<button class="js-ac-status-op btn btn-sun" data-loading-text="' + statusInfo.loadingText + '" data-status="' + info.status +
    '" data-divid-id="' + info.dividId + '">' + statusInfo.zhName + '</button>' : statusInfo.zhName);

    this.detailChange(index);
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
      url: '/fund/divid/subdividdetail.json',
      el: $detail
    }).render();
  },

  opHandler: function(e) {
    var $target = $(e.currentTarget);

    this.trigger('click:op', e, {
      dividId: $target.data('dividId'),
      status: $target.data('status')
    });
  }
});

module.exports = StatisticView;

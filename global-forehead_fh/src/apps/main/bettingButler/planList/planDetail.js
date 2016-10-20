"use strict";

var PlanDetailView = Base.ItemView.extend({
  template: require('./planDetail.html'),

  events: {},

  planDetailXhr: function(data) {
    return Global.sync.ajax({
      url: '/ticket/betManager/projectdetail.json',
      data: data
    });
  },

  initialize: function() {
    this.maxLength = 20;
  },

  onRender: function() {
    var self = this;

    this.$ticketList = this.$('.js-bb-ticket-list');
    this.$startTime = this.$('.js-bb-start-time');
    this.$typeGroup = this.$('.js-ac-type-group');
    this.$collectionList = this.$('.js-bb-collection-list');
    this.$planGridContainer = this.$('.js-bb-plan-grid-container');
    this.$planGrid = this.$('.js-bb-plan-grid');
    this.$planDetails = this.$('.js-bb-plan-details');
    this.$chasePlans = this.$('.js-bb-periods');
    this.$suspendSwitch = this.$('.js-bb-chase-switch');
    this.$timesSwitch = this.$('.js-bb-times-switch');
    this.$times = this.$('.js-bb-times');

    this.renderBasicInfo();

    this.planDetailXhr({
      projectId: this.options.planInfo.projectId
    })
      .done(function(res) {
        if(res && res.result === 0) {
          self.renderPlanGrid((res.root) || []);
        }
      });
  },

  renderBasicInfo: function() {
    var planInfo = this.options.planInfo;

    this.$ticketList.text(planInfo.ticketName);
    this.$startTime.text(planInfo.startTime);
    this.$chasePlans.text(planInfo.periods);
    this.$suspendSwitch.prop('checked', !!planInfo.isSuppend);
    this.$timesSwitch.prop('checked', !!planInfo.times);
    this.$times.text(planInfo.times);

  },

  renderPlanGrid: function(schemeDetail) {
    var self = this;
    var is11xuan5 = this.options.planInfo.ticketName.indexOf('11选5') !== -1;

    if(this.$planGrid.staticGrid('instance')) {
      this.$planGrid.staticGrid('destroy');
    }

    this.$planGrid.staticGrid({
      tableClass: 'table table-bordered table-center',
      height: 280,
      colModel: [
        {label: '投注彩种', name: 'ticketName', width: '10%', merge: true},
        {label: '玩法', name: 'ticketChasePlay', width: '10%', merge: true},
        {
          label: '投注内容', name: 'ticketChaseBetNum', width: '15%', formatter: function(val, index, thisRow) {
          var html = is11xuan5 ? val : val.replace(/ /g, '');
          if(thisRow.rx) {
            html = '<a class="js-uc-betDetail-optional-betNum btn-link btn-link-hot" data-id="' + thisRow.ticketBetPlayId + '"">详细号码</a>';
          } else if(html.length > self.maxLength) {
            html = '<a class="js-uc-betDetail-betNum btn-link btn-link-hot">详细号码</a>';
          }
          return html;
        }
        },
        {label: '倍数', name: 'ticketChaseBetMultiple', width: '8%'},
        {
          label: '投注模式', name: 'ticketChaseMoneyMethod', width: '10%', formatter: function(val) {
          return val === 10000 ? '元' : val === 1000 ? '角' : val === 100 ? '分' : '厘';
        }
        }
      ],
      row: schemeDetail
    });

    var no = 0;

    _(schemeDetail).each(function(item) {
      item.ticketChaseBetNum = is11xuan5 ? item.ticketChaseBetNum : item.ticketChaseBetNum.replace(/ /g, '');
      if(item.ticketChaseBetNum.length > self.maxLength && !item.rx) {
        $(self.$('.js-uc-betDetail-betNum')[no++]).popover({
          title: '详细号码',
          // trigger: 'toggle',
          html: true,
          container: this.$el,
          content: '<div class="js-pf-popover"><span class="word-break">' + item.ticketChaseBetNum + '</span></div>',
          placement: 'right'
        }).on('hidden', function(e) {
          e.stopPropagation();
        //   var _this = this;
        //   $(this).popover("toggle");
        //   e.stopPropagation();
        });
      }
    }, this);
  },

  renderGrid: function(planDetail) {

  }
});

module.exports = PlanDetailView;
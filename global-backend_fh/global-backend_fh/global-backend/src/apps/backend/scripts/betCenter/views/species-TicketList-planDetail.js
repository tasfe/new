/**
 * Created by David Zhang on 2015/9/12.
 */
define(function (require, exports, module) {

  require('prefab/views/searchGrid');
  var planDetailView = Base.Prefab.SearchGrid.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/species-TicketList-planDetail.html'),

    //所有的事件绑定全部写在这！
    events: {
      'click .js-bc-btn-submit': 'formSubmitHandler',
      'click .js-bc-btn-cancel': 'formCancelHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function () {
      _(this.options).extend({
        title: '奖期详情',
        columns: [
          {
            name: '期号',
            width: '30%'
          },
          {
            name: '开始时间',
            width: '35%'
          },
          {
            name: '截止时间',
            width: '35%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        remoteEveryTime: false,
        ajaxOps: {
          url: '/intra/planmng/planlist.json'
        }
      });
    },

    //在页面被渲染出来的时候自动调用
    onRender: function () {
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      var self = this;
      new Global.Prefab.Timeset({
        el: this.$('.js-bc-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate:moment().add(1, 'year')
      }).render();

      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-bc-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"',
        strDefaultValue:_(new Date()).toTime(),
        endDefaultValue:_(new Date()).toTime()
      }).render();

      self.$('#jsBCTicketId').val(this._parentView.options.ticketId);

      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },

    renderGrid: function(gridData, res) {
      var self = this;
      var rowsData = _(gridData).map(function(planDetail,index) {
        return {
          columnEls: this.formatRowData(planDetail, index),
          dataAttr: planDetail
        };
      }, this);

      this.grid.refreshRowData(rowsData, res.root.length, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      })
        .hideLoading();
    },

    formatRowData: function(info) {
      return [info.ticketPlanId, _(info.ticketStarttime).toTime(), _(info.ticketEndtime).toTime()];
    }
  });

  module.exports = planDetailView;
});

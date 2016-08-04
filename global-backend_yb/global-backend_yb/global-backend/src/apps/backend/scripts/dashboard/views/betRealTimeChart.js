/**
 * wmChart 图表view
 *
 * @description
 *
 * @api
 *
 * @example
 *
 * @author
 *   xiami
 */
define(function(require, exports, module) {

  var BetRealTimeView = Base.ItemView.extend({

    initialize: function() {
    },

    //common APIs

    render: function() {
      var self = this;

      this._checkVisible();

      this.$el.append(Global.ui.loader.getHtml());

      return this;
    },

    renderChart: function(data) {
      data = data || this.options.data;
      this.options.data = data;
      if (!this.isVisible) {
        return false;
      }
      if (!data) {
        return false;
      }
      if (!this.eChart) {
        this.eChart = echarts.init(this.$el[0], 'macarons');
        $(window).on('resize.chart', this.eChart.resize);
      }

      this.eChart.hideLoading();

      // 为eCharts对象加载数据
      this.eChart.setOption(data, true);
    },

    //只有当dom拥有了宽高的时候才进行chart的render
    _checkVisible: function() {
      var self = this;

      this.timer = setInterval(function() {

        if (self.$el.height() > 0 && self.$el.width() > 0) {
          clearInterval(self.timer);
          self.timer = null;

          self.isVisible = true;
          self.renderChart();
        }
      }, 100);
    },

    clearFilter: function() {
      this.options.filters = {};
      return this;
    },

    resize: function() {
      this.eChart.resize();
    },

    refresh: function() {
      this.eChart.refresh();
    },

    restore: function() {
      this.eChart.restore();
    },

    dispose: function() {
      $(window).off('resize.chart', this.eChart.resize);
      this.eChart.dispose();
    },

    getChart: function() {
      return this.eChart;
    }
  });

  module.exports = BetRealTimeView;
});

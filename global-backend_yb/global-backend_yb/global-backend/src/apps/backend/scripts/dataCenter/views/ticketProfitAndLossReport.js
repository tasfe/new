define(function (require, exports, module) {

  require('prefab/views/searchGrid');

  var TicketProfitAndLossReportView = Base.Prefab.SearchGrid.extend({

    template: require('text!dataCenter/templates/ticketProfitAndLossReport.html'),

    events: {},

    initialize: function () {
      _(this.options).extend({
        title: '转账报表',
        columns: [
          {
            name: '日期',
            width: '6%'
          },
          {
            name: '彩种名称',
            width: '6%'
          },
          {
            name: '期号',
            width: '6%'
          },
          {
            name: '销售总额',
            width: '6%'
          },
          {
            name: '中奖总额',
            width: '6%'
          },
          {
            name: '返点总额',
            width: '6%'
          },
          {
            name: '盈亏',
            width: '6%'
          }
        ],
       // pagination: false,
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/sysreport/ticketreport.json'
        }
      });
    },
    getTicketXhr: function () {
      return Global.sync.ajax({
        url: '/intra/playmng/tickets.json'
      });
    },
    onRender: function () {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-lt-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        showToday: true,
        endDate: moment().add(1, 'year'),
        startFormat: 'YYYY-MM-DD',
        endFormat: 'YYYY-MM-DD'
      }).render();
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
      this.getTicketXhr().always(function () {
      }).fail(function () {
        // 处理失败
      }).done(function (res) {
        if (res && res.result === 0) {
          var ticketData = _(res.root).map(function (ticket) {
            return '<option value="' + ticket.ticketId + '">' + ticket.ticketName + '</option>';
          });
          self.$('.js-lt-ticket').html('<option value="">全部</option>' + ticketData.join(''));
        } else {
          Global.ui.notification.show('数据异常。');
        }

      })
    },
    renderGrid: function (gridData) {
      var rowsData = _(gridData.amountList).map(function (amount, index) {
        return {
          columnEls: this.formatRowData(amount, index),
          dataAttr: amount
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });
      //加上统计行
      this.grid.addRows({
        columnEls: [
          '<strong>总结</strong>',
          {
            colspan: 2
          },
          _(gridData.betTotal).fixedConvert2yuan(),
          _(gridData.prizeTotal).convert2yuan(),
          _(gridData.bonusTotal).convert2yuan(),
          _(gridData.betTotal - gridData.prizeTotal - gridData.bonusTotal).convert2yuan()
        ]
      })
        .hideLoading();

    },

    formatRowData: function (rowInfo) {
      var row = [];
      row.push(_(rowInfo.day));
      if(Global.authority.dc && Global.authority.dc.lt && Global.authority.dc.lt.playProfitAndLoss) {
        row.push('<a href="' + _.getUrl('/play', {
            'id': rowInfo.ticketId,
            'name': rowInfo.ticketName,
            'plan': rowInfo.ticketPlanId,
            'day': rowInfo.day
          }) + '" class="router btn btn-link">' + rowInfo.ticketName + '</a>');
      }else{
        row.push(rowInfo.ticketName);
      }

      //row.push('<button data-id="' + rowInfo.ticketId + '" data-name="' + rowInfo.ticketName + '" data-plan="' + rowInfo.ticketPlanId + '" data-day="' + rowInfo.day + '" class="js-ul-enable btn btn-link">' + rowInfo.ticketName + '</button>')
      row.push(rowInfo.ticketPlanId);
      row.push(_(rowInfo.bet).fixedConvert2yuan());
      row.push(_(rowInfo.prize).convert2yuan());
      row.push(_(rowInfo.bonus).convert2yuan());
      row.push(_(rowInfo.bet - rowInfo.prize - rowInfo.bonus).convert2yuan());
      return row;
    },

    openPlayReport: function () {

    }
  });

  module.exports = TicketProfitAndLossReportView;
});
//56250
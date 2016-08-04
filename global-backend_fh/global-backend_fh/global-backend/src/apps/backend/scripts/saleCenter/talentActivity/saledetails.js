define(function(require, exports, module) {
  require('prefab/views/searchGrid');

  var BonusDetailView = Base.Prefab.SearchGrid.extend({

    template: require('text!./saleDetails.html'),

    events: {},

    getConfigXhr: function() {
      return Global.sync.ajax({
        url: '/intra/activitymanage/talentcfgdetail.json',
        data: {
          activityId: 14
        }
      });
    },

    initialize: function() {
      _(this.options).extend({
        columns: [
          {
            name: '日期',
            width: '10%'
          },
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '自助彩种销量',
            width: '10%'
          },
          {
            name: '其它彩种销量',
            width: '10%'
          },
          {
            name: '获得奖金',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        reqData: {
          activityId: 14
        },
        ajaxOps: {
          url: '/intra/activitymanage/talentsaleslist.json'
        }
      });
    },
    onRender: function() {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-sc-lad-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(1, 'year')
      }).render();

      this.getConfigXhr()
        .done(function(res) {
          if (res.result === 0) {
            if (res.root) {
              var html = _(res.root.salesList).map(function(info) {
                var amount = _(info.betAmount).convert2yuan();
                return '<option value="' + amount + '">' + amount + '</option>';
              }).join('');

              self.$('[name=fromBet]').append(html);
              self.$('[name=endBet]').append(html);
            }
          }
        });


      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderGrid: function(gridData) {
      var rowsData = _(gridData.itemList).map(function(dataInfo, index) {
        return {
          columnEls: this.formatRowData(dataInfo, index),
          dataAttr: dataInfo
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });

      this.grid.addRows({
        columnEls: [
          '<strong>总计</strong>',
          {
            colspan: 1
          },
          _(gridData.selfGameTotal).convert2yuan(),
          _(gridData.officialGameTotal).convert2yuan(),
          _(gridData.bonusTotal).convert2yuan()
        ]
      })
        .hideLoading();
    },
    formatRowData: function(rowInfo) {
      var row = [];
      row.push(_(rowInfo.date).toTime());
      row.push(rowInfo.userName);
      row.push(_(rowInfo.selfGameBet).convert2yuan());
      row.push(_(rowInfo.officialGameBet).convert2yuan());
      row.push(_(rowInfo.bonus).convert2yuan());

      return row;
    }

  });
  module.exports = BonusDetailView;
});
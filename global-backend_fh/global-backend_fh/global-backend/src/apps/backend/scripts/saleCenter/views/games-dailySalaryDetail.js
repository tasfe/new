define(function(require, exports, module) {
  var ShowAgreementDetailView = require('saleCenter/views/games-ShowAgreementDetail');
  require('prefab/views/searchGrid');
  var BonusDetailView = Base.Prefab.SearchGrid.extend({

    template: require('text!saleCenter/templates/games-dailySalaryDetail.html'),

    events: {
      'click .js-pm-show': 'showAgreementDetailHandler'
    },

    initialize: function() {
      _(this.options).extend({
        columns: [
          {
            name: '签约时间',
            width: '10%'
          },
          {
            name: '生效时间',
            width: '10%'
          },
          {
            name: '上级用户名',
            width: '10%'
          },
          {
            name: '下级用户名',
            width: '10%'
          },
          {
            name: '上级返点',
            width: '10%'
          },
          {
            name: '下级返点',
            width: '10%'
          },
          {
            name: '协议内容',
            width: '10%'
          },
          {
            name: '状态',
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
          url: '/intra/dailysalary/signlist.json'
        }
      });
    },
    onRender: function() {
      var self = this;
      //初始化时间选择
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-sy-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate: moment().add(1, 'year')
      }).render();
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderGrid: function(gridData) {
      var rowsData = _(gridData.dataList).map(function(dataInfo, index) {
        return {
          columnEls: this.formatRowData(dataInfo, index),
          dataAttr: dataInfo
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      }).hideLoading();
    },
    formatRowData: function(rowInfo) {
      var row = [];
      row.push(_(rowInfo.signDate).toTime());
      row.push(_(rowInfo.effectDate).toTime());
      row.push(rowInfo.userName);
      row.push(rowInfo.subUserName);
      row.push(_(rowInfo.userRebate).formatDiv(10, {fixed: 1}));
      row.push(_(rowInfo.subUserRebate).formatDiv(10, {fixed: 1}));
      row.push("<button data-agreement='"+ JSON.stringify(rowInfo.agreement)+ "' class='js-pm-show btn btn-link'>查看</button>");
      row.push(rowInfo.status == 0?'申请签约':rowInfo.status == 1 ? '已同意':'已拒绝');  // 0:申请 1：同意 2：拒绝
      return row;
    },

    //显示系统通知详情
    showAgreementDetailHandler: function (e) {
      var $target = $(e.currentTarget);
      var agreement = $target.data('agreement');
      var $dialog = Global.ui.dialog.show(
        {   size: 'modal-lg',
          title: '查看协议',
          body: '<div class="js-il-show-agreement"></div>'
        }
      );
      var $selectContainer = $dialog.find('.js-il-show-agreement');

      var showAgreementDetailView = new ShowAgreementDetailView({agreement: agreement});
      $selectContainer.html(showAgreementDetailView.render().el);

      $dialog.on('hidden.bs.modal', function (e) {
        $(this).remove();
        showAgreementDetailView.destroy();
      });
    }

  });
  module.exports = BonusDetailView;
});
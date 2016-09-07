define(function (require, exports, module) {
  require('prefab/views/searchGrid');
  var DropUserListView = Base.Prefab.SearchGrid.extend({

    template: require('text!userCenter/templates/abnormalUser-dropUserList.html'),

    events: {},
    initialize: function () {
      _(this.options).extend({
        title: '降点用户记录',
        columns: [
          {
            name: '用户名',
            width: '6%'
          },
          {
            name: '用户组',
            width: '6%'
          },
          {
            name: '降点前返点',
            width: '6%',
            //sortable: true,
            id: 3
          },
          {
            name: '降点后返点',
            width: '15%'
          },
          {
            name: '降点原因',
            width: '10%'
          },
          {
            name: '降点时间',
            width: '10%'
          },
          {
            name: '操作人',
            width: '5%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/usermanager/disrebatelist.json'

        }
      });
    },

    getCheckUserListXhr: function(){
      return Global.sync.ajax({
        url: '/intra/usermanager/diserlist.json '
      });
    },

    onRender: function () {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-cu-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate: moment().add(1, 'year'),
        showToday: true
      }).render();
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
      this.creater = 0;

      this.getCheckUserListXhr() .fail(function(){
      }).done(function(res){
        if(res.result===0){
          var optionData = _(res.root.userList||[]).map(function(user){
            return {
              value: user.userId,
              text: user.username
            }
          });
          var options = [];
          _(optionData).each(function(item){
            var option = '<option value="'+item.value+'">'+item.text+'</option>';
            options.push(option);
          });
          self.$('.js-du-operatorId').append(options.join(''));
        }else{
          Global.ui.notification.show('操作失败。');
        }
      });
    },

    renderGrid: function (gridData) {
      var rowsData = _(gridData.dataList).map(function (disable, index) {
        return {
          columnEls: this.formatRowData(disable, index),
          dataAttr: disable
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
          pageIndex: this.filterHelper.get('pageIndex'),
          initPagination: true
        })
        .hideLoading();
    },

    formatRowData: function (rowInfo) {
      var row = [];

      row.push(rowInfo.userName);
      row.push(rowInfo.userLevel);
      row.push(rowInfo.orgRebate);
      row.push(rowInfo.rebate);
      row.push(rowInfo.remark);
      row.push(_(rowInfo.createTime).toTime());
      row.push(rowInfo.operator);
      return row;
    }

  });

  module.exports = DropUserListView;
});
//56250
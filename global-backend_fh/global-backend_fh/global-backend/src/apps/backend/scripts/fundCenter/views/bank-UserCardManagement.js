define(function (require, exports, module) {

  require('prefab/views/searchGrid');

  var UserBankHistoryView = require('fundCenter/views/bank-UserCardManagement-History');


  var UserCardManView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/bank-UserCardManagement.html'),

    events: {
      'click .js-fc-ucm-changeStatus': 'changeStatusHandler',
      'click .js-fc-ucm-viewHistory': 'viewHistoryHandler',
      'click .js-fc-ucm-del': 'deleteUserCardHandler'
    },

    initialize: function () {
      _(this.options).extend({
        tableClass: '',
        title: '用户银行卡管理',
        columns: [
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '绑定数量',
            width: '5%'
          },
          {
            name: '当前绑定卡',
            width: '65%'
          },
          {
            name: '状态',
            width: '8%'
          },
          {
            name: '操作',
            width: '12%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/usercardmanage/cardlist.json'
        }
      });
    },
    changeUserBankStatusXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/usercardmanage/dostatus.json',
        data: data
      });
    },


  deleteUserCardXhr: function (data) {
    return Global.sync.ajax({
      url: '/intra/usercardmanage/delcard.json',
      data: data
    });
  },

    changeStatusHandler: function (e) {
      var self = this;
      $(document).confirm({
        content: '确认变更用户的银行状态？',
        agreeCallback: function () {
          self.changeUserBankState(e);
        }
      });
    },
    changeUserBankState: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      var userId = $target.data('id');
      var status = $target.data('status');
      if(status===0){
        status=1;
      }else{
        status=0;
      }
      var data = {
        userId:userId,
        status: status
      };
      this.changeUserBankStatusXhr(data).fail(function(){
      }).done(function(res){
        if(res.result===0){
          Global.ui.notification.show('操作成功。');
          self._getGridXhr();
        }else{
          Global.ui.notification.show('操作失败。');
        }
      });
    },

    viewHistoryHandler: function (e) {
      var data = {
        userId:$(e.currentTarget).data('id')
      };
      this.popUserBankHistoryModel(data);
    },
    popUserBankHistoryModel: function (data) {
      var $dialog = Global.ui.dialog.show(
        {
          title: '用户银行卡操作历史',
          body: '<div class="js-fc-ucm-history-container"></div>',
          footer: '<button class="btn" data-dismiss="modal">确定</button>'
        }
      );
     var $addUserContainer = $dialog.find('.js-fc-ucm-history-container');

      var userBankHistoryView = new UserBankHistoryView(data);
      $addUserContainer.html(userBankHistoryView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });

    },

    onRender: function () {
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },

    renderGrid: function (gridData) {
      var rowsData = _(gridData.userCardList).map(function (userCard, index, userCardList) {
        return {
          id: userCard.userId,
          columnEls: this.formatRowData(userCard, index, userCardList),
          dataAttr: userCard
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      }).hideLoading();

    },

    formatRowData: function (userCard) {
      var row = [];
      row.push(userCard.userName);
      row.push(userCard.cardCount);
      var tdHtml = [];
      _(userCard.cardList).each(function (card, index, cardList) {
        tdHtml.push(card.bankName + ' | ' + card.bankBranchName + ' | ' + card.name + ' | ' + card.cardNo + ' | ' + _(card.updateTime).toTime()
          + (userCard.status===1? '': ('<a class="js-fc-ucm-del btn btn-link" data-userid="'+userCard.userId+'" data-cardid="'+card.cardId+'">删除</a>')));
      });
      row.push(tdHtml.join('<br>'));
      var status;
      var btnValue;
      switch (userCard.status) {
        case 0:
          status = '未锁定';
          btnValue = '锁定';
          break;
        case 1 :
          status = '已锁定';
          btnValue = '解锁';
          break;
      }
      row.push(status);
      var operate = '';
      if(Global.authority.fc && Global.authority.fc.uc && Global.authority.fc.uc.lock){
        operate += '<input type="button" data-id="' + userCard.userId + '"  data-status="' + userCard.status + '" class="js-fc-ucm-changeStatus btn btn-link" value="' + btnValue + '" >&nbsp;';
      }
      operate += '<input type="button" data-id="' + userCard.userId + '" class="js-fc-ucm-viewHistory btn btn-link" value="查看历史">';
      row.push(operate);
      return row;
    },
    insertNotice: function ($container, html) {
      $container.html(this._getErrorMsg(html));
    },
    //组装错误提示框
    _getErrorMsg: function (text) {
      return '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '<i class="fa fa-times-circle m-right-xs"></i>' +
        '<strong>提示！</strong> ' + text +
        '</div>';
    },



    deleteUserCardHandler: function(e){
      var self = this;
      var $target = $(e.currentTarget);
      var $tr = $target.closest('tr');
      var status = $tr.data('status');
      if(status===1){
        Global.ui.notification.show('请解锁后再进行删除！');
        return false;
      }
      $(document).confirm({
        content: '<div class="text-center">确认删除此用户银行卡？</div>',
        agreeCallback: function () {
          self.deleteUserCard(e);
        }
      });

    },
    deleteUserCard: function(e){
      var self = this;
      var $target = $(e.currentTarget);
      var userId = $target.data('userid');
      var cardId = $target.data('cardid');
      this.deleteUserCardXhr({
        userId: userId,
        cardId: cardId
      }).done(function(res){
        if(res.result===0){
          Global.ui.notification.show('操作成功。');
          self._getGridXhr();
        }else{
          Global.ui.notification.show('操作失败。');
        }
      });
    }
  });

  module.exports = UserCardManView;
});
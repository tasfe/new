define(function (require, exports, module) {

  require('prefab/views/searchGrid');

  var AddBlackCardView = require('fundCenter/views/bank-CardBlackList-Add');
  var DelBlackCardView = require('fundCenter/views/bank-CardBlackList-Del');

  var BlackCardListView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/bank-CardBlackList.html'),

    events: {
      'click .js-fc-cbl-add': 'addBlackCardHandler',
      'click .js-fc-cbl-del': 'delBlackCardHandler',
      'click .js-fc-cbl-delReason': 'viewDelReasonHandler'
    },

    initialize: function () {
      _(this.options).extend({
        tableClass: '',
        columns: [
          {
            name: '用户名',
            width: '8%'
          },
          {
            name: '银行名称',
            width: '10%'
          },
          {
            name: '开户支行',
            width: '14%'
          },
          {
            name: '开户人姓名',
            width: '10%'
          },
          {
            name: '银行卡号',
            width: '12%'
          },
          {
            name: '加入时间',
            width: '12%'
          },
          {
            name: '加入原因',
            width: '14%'
          },
          {
            name: '加入人',
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
          url: '/intra/blackmanage/blacklist.json'
        }
      });
    },
    addBlackCardXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/blackmanage/add.json',
        data: data
      })
    },
    getCardHistoryXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/blackmanage/info.json',
        data: data
      });
    }
    ,
    deleteBlackCardXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/blackmanage/remove.json',
        data: data
      })
    }
    ,
    addBlackCardHandler: function (e) {
      var self = this;
      var $dialog = Global.ui.dialog.show(
        {
          title: '增加黑名单卡',
          body: '<div class="js-fc-cbl-add-container"></div>',
          footer: ''
        }
      );
      var $addContainer = $dialog.find('.js-fc-cbl-add-container');
      var addBlackCardView = new AddBlackCardView();
      $addContainer.html(addBlackCardView.render().el);
      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-cbl-add-confirm', function (ev) {
          if(!$dialog.find('.js-fc-cbl-tip').hasClass('hidden')){
            //window.confirm('请输入有效的用户名！');
            $(document).confirm({
              content: '请输入有效的银行卡号！',
              agreeCallback: function () {
              }
            });
            return  false;
          }
          self.addBlackCardInfo($dialog);
        });
    },
    delBlackCardHandler: function (e) {
      var self = this;
      var cardNo = $(e.currentTarget).data('cardno');
      var cardId = $(e.currentTarget).data('cardid');
      var $dialog = Global.ui.dialog.show(
        {
          title: '提示',
          body: '<div class="js-fc-cbl-del-container"></div>',
          footer: ''
        }
      );
      var $delContainer = $dialog.find('.js-fc-cbl-del-container');
      var delBlackCardView = new DelBlackCardView({cardNo: cardNo,cardId:cardId});
      $delContainer.html(delBlackCardView.render().el);
      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-cbl-del-confirm', function (ev) {
          var $currContainer = $dialog.find('.js-fc-cbl-del-form');
          var clpValidate = $currContainer.parsley().validate();
          if (!clpValidate) {
            return false;
          }
          self.delBlackCardInfo($dialog);
        });
    },
    viewDelReasonHandler: function (e) {
      var $tr = $(e.currentTarget).parent().parent();
      var data = {
        deleteReason: $tr.data('deletereason'),
        deleteTime: $tr.data('deletetime'),
        deleterName: $tr.data('deletername')
      };

      var html = '<div><div class="pull-left"><strong>' + _(data.deleteTime).toTime() + '</strong></div><div class="pull-right"><strong>' + data.deleterName + '</strong></div><br><div class="panel panel-default no-m-bottom" style="margin-top: 20px;">';
      html += '<div class="panel-body  no-m-bottom "><p>' + data.deleteReason + '</p></div></div></div>';
      var $dialog = Global.ui.dialog.show(
        {
          title: '操作日志',
        //  size: 'modal-lg',
          body: '<div>' + html + '</div>',
          footer: ''
        });
    },
    delBlackCardInfo: function ($dialog) {
      var self = this;
      var data = {
        cardNo: $dialog.find('.js-fc-cbl-del-cardNo').html(),
        blackCardId: $dialog.find('.js-fc-cbl-del-cardId').val(),
        reason: $dialog.find('.js-fc-cbl-del-reason').val()
      };
      this.deleteBlackCardXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          Global.ui.notification.show('操作成功。');
          $dialog.modal('hide');
          self._getGridXhr();
        } else {
          Global.ui.notification.show('操作失败。');
        }
      });
    },

    addBlackCardInfo: function ($dialog) {
      var $currContainer = $dialog.find('.js-fc-cbl-add-form');
      var clpValidate = $currContainer.parsley().validate();
      if (!clpValidate) {
        return false;
      }
      var self = this;
      var cardNo = $dialog.find('.js-fc-cbl-add-cardNo').val();
      var data = {
        cardNo: cardNo,
        reason: $dialog.find('.js-fc-cbl-add-reason').val()
      };
      this.addBlackCardXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          Global.ui.notification.show('操作成功。');
          self.getHistoryInfo(cardNo);
        } else {
          Global.ui.notification.show('操作失败。');
        }
      });
    },
    getHistoryInfo: function (cardNo) {
      var self = this;
      this.getCardHistoryXhr({cardNo: cardNo}).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.showHistoryInfo(res.root);
        } else {
          Global.ui.notification.show('数据异常。');
        }
      });

    },


    onRender: function () {
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    }
    ,

    renderGrid: function (gridData) {
      var rowsData = _(gridData.userCardList).map(function (userCard, index, userCardList) {
        return {
          id: userCard.blackCardId,
          columnEls: this.formatRowData(userCard, index, userCardList),
          dataAttr: userCard
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      }).hideLoading();

    }
    ,
    formatRowData: function (userCard) {
      var row = [];

      row.push(userCard.userName);
      row.push(userCard.bankName);
      row.push(userCard.bankBranchName);
      row.push(userCard.name);
      row.push(userCard.cardNo);
      row.push(_(userCard.createTime).toTime());
      row.push(userCard.createReason);
      row.push(userCard.creatorName);

      var html;
      switch (userCard.status) {
        case 0:

          if(Global.authority.fc && Global.authority.fc.cb && Global.authority.fc.cb.del){
            html = '<button type="button" data-cardno="' + userCard.cardNo + '" data-cardid="' + userCard.blackCardId + '" class="js-fc-cbl-del btn btn-link">移出黑名单</button>';
          }

          break;
        case 1 :
          html = '<span style="margin-left: 12px;">已移出</span><button type="button" data-blackcardid="' + userCard.blackCardId + '" class="js-fc-cbl-delReason btn btn-link" >移出原因</button>';
          break;
      }
      row.push(html);

      return row;
    },

    showHistoryInfo: function (root) {
      $('.js-fc-cbl-add-history-container').append('');
      _(root).each(function (history) {
        var html = '<span style="margin-right: 150px">' + _(history.operateTime).toTime() + '</span><span style="margin-right: 120px">' + history.operator + '</span><span>' + history.optType + '</span><br><span">原因：' + history.optReason + '<br></span><br>';
          $('.js-fc-cbl-add-history-container').append(html);
      });
      if(_(root).size()>0){
      $('.js-fc-recharge-history-div').removeClass('hidden');
      }
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
    }
  });

  module.exports = BlackCardListView;
});
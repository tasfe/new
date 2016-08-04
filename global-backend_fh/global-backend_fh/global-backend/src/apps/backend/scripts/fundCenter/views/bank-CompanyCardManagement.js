define(function (require, exports, module) {

  require('prefab/views/searchGrid');

  var AddOrEditCompanyCardView = require('fundCenter/views/bank-CompanyCardManagement-AddOrEdit');

  var CompanyCardManagementView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/bank-CompanyCardManagement.html'),

    events: {
      'click .js-fc-ccm-add': 'addCompanyCardHandler',
      'click .js-fc-ccm-changeState': 'changeStatusHandler',
      'click .js-fc-ccm-edit': 'editCompanyCardHandler'
    },

    initialize: function () {
      _(this.options).extend({
        tableClass: '',
        columns: [
          {
            name: 'ID',
            width: '8%'
          },
          {
            name: '银行名称',
            width: '12%'
          },
          {
            name: '开户支行',
            width: '15%'
          },
          {
            name: '开户人姓名',
            width: '10%'
          },
          {
            name: '银行卡号',
            width: '15%'
          },
          {
            name: '卡等级',
            width: '15%'
          },
          {
            name: '状态',
            width: '10%'
          },
          {
            name: '操作',
            width: '15%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/syscardmanage/cardlist.json'
        }
      });
    },
    saveCompanyCardXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/syscardmanage/save.json',
        data: data
      })
    }
    ,
    changeCompanyCardStatusXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/syscardmanage/dostatus.json',
        data: data
      })
    },

    addCompanyCardHandler: function (e) {
      this.popCompanyCardEditModel('add');
    }
    ,
    editCompanyCardHandler: function (e) {
      var $target = $(e.currentTarget);
      var $tr = $target.parent().parent();
      var data = {
        cardId: $tr.data('cardid'),
        bankId: $tr.data('bankid'),
        bankBranchName: $tr.data('bankbranchname'),
        name: $tr.data('name'),
        cardNo: $tr.data('cardno'),
        cardType: $tr.data('cardtype')
      };
      this.popCompanyCardEditModel('edit', data);
    }
    ,
    //todo 删除。。。
    changeStatusHandler: function (e) {
      var $target = $(e.currentTarget);
      var status = $target.data('status');
      var type = $target.html();
      var cardId = $target.data('cardid');

      if(status===1){
        status=0;
      }else{
        status=1;
      }
      var data = {
        cardId: cardId,
        status: status
      };

      var self = this;

      var $dialog = Global.ui.dialog.show(
        {
          title: '提示',
          body: '<div class="text-center"><p>确认' + type + '此记录？</p></div>',
          footer: '<button class="js-fc-ccm-change-confirm btn btn-primary" type="button">确定</button><button class="btn" data-dismiss="modal">取消</button>'
        }
      );

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });

      $dialog.off('click.changeStatus')
        .on('click.changeStatus', '.js-fc-ccm-change-confirm', function () {
          self.changeCompanyCardStatusXhr(data).fail(function () {
          }).done(function (res) {
            if (res.result === 0) {
              $dialog.modal('hide');
              Global.ui.notification.show( '操作成功。');
              self._getGridXhr();
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
        });

    }
    ,
    popCompanyCardEditModel: function (type, data) {
      var self = this;
      var title;
      if (type === 'edit') {
        title = '编辑公司银行卡'
      } else {
        title = '增加公司银行卡';
      }
      var $dialog = Global.ui.dialog.show(
        {
          title: title,
          body: '<div class="js-fc-ccm-save-container"> </div>',
          footer: ''
        }
      );
      var $saveCardContainer = $dialog.find('.js-fc-ccm-save-container');

      var addOrEditCompanyCardView = new AddOrEditCompanyCardView(data);
      $saveCardContainer.html(addOrEditCompanyCardView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });

      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-ccm-ae-confirm', function (ev) {
          var $currContainer = $dialog.find('.js-fc-ccm-ae-form');
          var clpValidate = $currContainer.parsley().validate();
          if (!clpValidate) {
            return false;
          }
          self.saveCompanyCardInfo($dialog, type);
        });
    },

    saveCompanyCardInfo: function ($dialog) {
      var self = this;
      var $notice = $dialog.find('.js-fc-lrAddOrEdit-notice');
      var data = {
        cardId: $dialog.find('.js-fc-ccm-ae-cardId').val(),
        bankId: $dialog.find('.js-fc-ccm-ae-bankId').val(),
        bankBranchName: $dialog.find('.js-fc-ccm-ae-bankBranchName').val(),
        name: $dialog.find('.js-fc-ccm-ae-name').val(),
        cardNo: $dialog.find('.js-fc-ccm-ae-cardNo').val(),
        cardType: $dialog.find('.js-fc-ccm-ae-cardType').val()
      };
      this.saveCompanyCardXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          $dialog.modal('hide');
          Global.ui.notification.show('操作成功。');
          self._getGridXhr();
        }
        else
          Global.ui.notification.show('操作失败。');
      });
    },

    onRender: function () {
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },

    renderGrid: function (gridData) {
      var rowsData = _(gridData.cardList).map(function (card, index, cardList) {
        return {
          id: card.cardId,
          columnEls: this.formatRowData(card, index, cardList),
          dataAttr: card
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      }).hideLoading();

    }
    ,

    formatRowData: function (card) {
      var row = [];
      row.push(card.cardId);
      row.push(card.bankName);
      row.push(card.bankBranchName);
      row.push(card.name);
      row.push(card.cardNo);
      var level;
      switch (card.cardType) {
        case 1:
          level = '普通用户';
          break;
        case 2:
          level = 'VIP用户';
          break;
        case 3:
          level = '大额充值用户';
          break;
      }
      row.push(level);
      var status;
      var html;
      switch (card.status) {
        case 1:
          level = '使用中';
          html = '<button type="button" data-status="' + card.status + '" data-cardid="' + card.cardId + '" class="js-fc-ccm-changeState btn btn-link ">禁用</button>';
          break;
        case 0:
          level = '<span class="text-danger">已停用</span>';
          html = '<button type="button" data-status="' + card.status + '" data-cardid="' + card.cardId + '" class="js-fc-ccm-changeState btn btn-link ">启用</button>';
          break;
      }
      row.push(level);
      if(!Global.authority.fc || !Global.authority.fc.cc || !Global.authority.fc.cc.disable){
        html = '';
      }
      if(Global.authority.fc && Global.authority.fc.cc && Global.authority.fc.cc.edit){
        html += '<button type="button" class="js-fc-ccm-edit btn btn-link " data-cardid="' + card.cardId + '">编辑</button>';
      }

      row.push(html);
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
    }
  });

  module.exports = CompanyCardManagementView;
});
define(function (require, exports, module) {

  var BankManagementAddOrEditView = require('fundCenter/views/bank-BankManagement-Withdraw-AddOrEdit');

  var RechargeBankManagementView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bank-BankManagement-Withdraw.html'),

    events: {
      'click .js-fc-bmw-add': 'addBankHandler',
      'click .js-fc-bmw-edit': 'editBankHandler',
      'click .js-fc-bmw-useable': 'changeBankStateHandler'
    },

    initialize: function () {
    },

    //银行列表
    findBankListXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/bankmanage/banklist.json',
        data: data
      });
    },

    //保存详情
    saveBankInfoXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/bankmanage/save.json',
        data: data
      });
    },
    //禁用/启用银行卡
    changeBankStatusXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/bankmanage/dostatus.json',
        data: data
      });
    },
    addBankHandler: function (e) {
      var data = {
        type: 'add'
      };
      this.popLargeRechargeUserEditModel(data);

    },
    editBankHandler: function (e) {
      var bankId = $(e.currentTarget).data('type');
      var $tr = $(e.currentTarget).parent().parent();
      var data = {
        type: 'edit',
        bankId: $tr.data('bankid'),
        bankName: $tr.data('bankname'),
        bankCode: $tr.data('bankcode'),
        transferCode: $tr.data('transfercode'),
        url: $tr.data('url'),
        sort: $tr.data('sort'),
        bankLogo: $tr.data('banklogo')
      };
      this.popLargeRechargeUserEditModel(data);
    },
    changeBankStateHandler: function (e) {
      var self = this;
      $(document).confirm({
        content: '确认变更银行状态？',
        agreeCallback: function () {
          self.changeBankState(e);
        }
      });
    },
    changeBankState: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      var bankId = $target.data('id');
      var status = $target.data('status');
      if(status===0){
        status=1;
      }else{
        status=0;
      }
      var data = {
        bankId: bankId,
        status: status,
        bankType: '2'
      };
      this.changeBankStatusXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          Global.ui.notification.show('操作成功。');
          self.onRender();
        } else {
          Global.ui.notification.show('操作失败。');
        }
      });
    },

    onRender: function () {
      var self = this;
      this.$bankTable = this.$('.js-fc-bmw-table');
      this.$bankTable.html('');
      var reqParams = {bankType:2};

      this.findBankListXhr(reqParams).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          _(res.root.bankList).each(function (bank, index) {
            self.generateBankTr(bank);
          });

        } else {
          Global.ui.notification.show('数据异常。');
        }
      });

    },
    generateBankTr: function (bank) {
      var html = [];
      html.push('<tr data-bankname="');
      html.push(bank.bankName||'');
      html.push( '" data-banklogo="');
      html.push(bank.bankLogo||'');
      html.push( '" data-bankcode="');
      html.push(bank.bankCode||'') ;
      html.push('" data-url="');
      html.push(bank.url||'');
      html.push('" data-sort="');
      html.push(bank.sort||'');
      html.push( '" data-bankid="');
      html.push(bank.bankId||'') ;
      html.push('" data-transfercode="');
      html.push(bank.transferCode||'');
      html.push('"><td>');
      html.push(bank.bankId + '</td>');
      html.push('<td><div class="gallery-list js-masonry m-top-md"><div class="gallery-item no-rotate width-sm m-right-sm">');
      html.push('<img src="' + (bank.bankLogo||'') + '" class="img-thumbnail"></div></div></td>');
      html.push('<td>' + (bank.bankName||'') + '</td>');
      html.push('<td>' + (bank.bankCode||'') + '</td>');
      html.push('<td>' + (bank.url||'') + '</td>');
      html.push('<td>' + (bank.sort||'') + '</td>');
      var status = '';
      var operate = '';
      switch (bank.status) {
        case 1 :
          status = '使用中';
          operate += '<button class="btn btn-link js-fc-bmw-useable no-m-right" data-status="1" data-id="' + bank.bankId + '">禁用</button>';
          break;
        case 0 :
          status = '<span class="text-danger">已停用</span>';
          operate += '<button class="btn btn-link js-fc-bmw-useable no-m-right" data-status="0" data-id="' + bank.bankId + '">启用</button>';
          break;
      }
      if(!Global.authority.fc || !Global.authority.fc.bm || !Global.authority.fc.bm.disableWiBank){
        operate += '';
      }
      if(Global.authority.fc && Global.authority.fc.bm && Global.authority.fc.bm.editWiBank){
        operate += '<button  class="btn btn-link js-fc-bmw-edit no-m-left no-p-left" data-id="' + bank.bankId + '" data-type="edit">编辑</button>';
      }

      html.push('<td>' + status + '</td>');
      html.push('<td>' + operate + '</td></tr>');

      this.$bankTable.append(html.join(''));
    },

    popLargeRechargeUserEditModel: function (data) {
      var self = this;
      var type = data.type;
      var title;
      if (type === 'edit') {
        title = '编辑银行';
      } else {
        title = '新建银行';
      }
      var $dialog = Global.ui.dialog.show(
        {
          title: title,
          body: '<div class="js-fc-bmw-AOE-container"></div>',
          footer: '<button class="js-fc-bmw-AOE-confirm btn btn-primary" type="button">确定</button><button class="btn" data-dismiss="modal">取消</button>'
        }
      );
      var $aOEContainer = $dialog.find('.js-fc-bmw-AOE-container');
      var bankManagementAddOrEditView = new BankManagementAddOrEditView(data);
      $aOEContainer.html(bankManagementAddOrEditView.render().el);
      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-bmw-AOE-confirm', function (ev) {
          if(_($dialog.find('.js-wt-img-attach')).size()===0){
            bankManagementAddOrEditView.insertNotice('请先上传图片。');
            return false;
          }
          self.saveBankInfo($dialog);
        });
    },
    saveBankInfo: function ($dialog) {
      var $currContainer = $dialog.find('.js-fc-bmw-aoe-form');
      var clpValidate = $currContainer.parsley().validate();
      if (!clpValidate) {
        return false;
      }
      var $notice = $dialog.find('.js-fc-bmw-AOE-notice');
      var self = this;
      var data = {
        bankType: '2' ,
        bankId: $dialog.find('.js-fc-bmw-AOE-bankId').val(),
        bankName: $dialog.find('.js-fc-bmw-AOE-bankName').val(),
        bankCode: $dialog.find('.js-fc-bmw-AOE-bankCode').val(),
        transferCode: $dialog.find('.js-fc-bmw-AOE-transferCode').val(),
        url: $dialog.find('.js-fc-bmw-AOE-url').val(),
        bankLogo: _($dialog.find('.js-wt-img-attach')).map(function (attach, index) {
          return $(attach).attr('src');
        }).join(','),
        sort: $dialog.find('.js-fc-bmw-AOE-sort').val()
      };
      this.saveBankInfoXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          $dialog.modal('hide');
          Global.ui.notification.show('操作成功。');
          self.onRender();
        } else {
          Global.ui.notification.show('操作失败。');
        }
      });
    },

    insertNotice: function ($target, html) {
      $target.html(this._getErrorMsg(html));
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

  module.exports = RechargeBankManagementView;
});
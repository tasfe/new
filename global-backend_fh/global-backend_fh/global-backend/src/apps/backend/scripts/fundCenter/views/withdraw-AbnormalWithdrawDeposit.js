define(function (require, exports, module) {

  require('prefab/views/searchGrid');

  var AbnormalWithdrawAuditView = require('fundCenter/views/withdraw-AbnormalWithdrawDeposit-Audit');
  var deviceConfig = require('skeleton/misc/deviceTypeConfig');

  var AbnormalWithdrawView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/withdraw-AbnormalWithdrawDeposit.html'),

    events: {
      'click .js-fc-awd-deal': 'dealWithdrawHandler',
      'click .js-fc-awd-notDeal': 'notDealWithdrawHandler',
      'click .js-fc-awd-view': 'viewDealResultHandler'
    },

    initialize: function () {
      _(this.options).extend({
        tableClass: '',
        checkable: true,
        columns: [
          {
            name: '流水号',
            width: '15%'
          },
          {
            name: '申请提现时间',
            width: '10%'
          },
          {
            name: '用户名',
            width: '5%'
          },
          {
            name: '提现银行',
            width: '10%'
          },
          {
            name: '卡户支行',
            width: '15%'
          },
          {
            name: '开户人姓名',
            width: '5%'
          },
          {
            name: '卡号',
            width: '10%'
          },
          {
            name: '提现金额',
            width: '5%'
          },
          {
            name: '终端类型',
            width: '5%'
          },
          {
            name: '风险类型',
            width: '10%'
          },
          {
            name: '操作时间',
            width: '10%'
          },
          {
            name: '操作日志',
            width: '8%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/withdrawmanage/exceptionwithdrawlist.json'
        }
      });
    },

    //审核提现
    dealWithdrawDepositXhr: function(data){
      return  Global.sync.ajax({
        url: '/intra/withdrawmanage/exceptionwithdrawcheck.json',
        data: data
      });
    },
    //TODO 接口未提供 查询处理日志
    findOperateLogXhr:function(data){
      return  Global.sync.ajax({
        url: '',
        data: data
      });
    },
    getCheckedData: function(){
      var checkedData = this.grid.getChk();
      var tradeNos = _(checkedData.$rows).map(function(row,index,$rows){
        return $(row).data('tradeno');
      }).join(',');
      return data = {
        num: _(checkedData.ids).size(),
        tradeNo: tradeNos
      }
    },

    dealWithdrawHandler: function(e){
      var data = this.getCheckedData();
      this.propWithdrawDealModel('allow',data);
    },
    notDealWithdrawHandler: function() {
      var data = this.getCheckedData();
      this.propWithdrawDealModel('prevent',data);
    },
    viewDealResultHandler: function(e){
      var self = this;
      var id = $(e.currentTarget).data('id');
      var $tr = $(e.currentTarget).parent().parent();
      //this.findOperateLogXhr({
      //  id:id
      //}).fail(function(){
      //  Global.ui.notification.show('服务器未响应，查询审核结果失败！');
      //}).done(function(res){
      //  if(res.result===0){
      //    var data = {
      //      dealTime : res.root.dealTime,
      //      dealUser : res.root.dealUser,
      //      dealRemark : res.root.remark
      //    };
      //    self.popWithdrawResultCheckModel(data);
      //  }else{
      //    Global.ui.notification.show('查询审核结果失败！'+res.msg);
      //  }
      //});

      var data = {
        dealTime : $tr.data('operatetime'),
        dealUser : $tr.data('operator'),
        dealRemark : $tr.data('operateremark')
      };
      self.popWithdrawResultCheckModel(data);

    },

    //弹出处理窗口
    propWithdrawDealModel: function (type,data) {
      var self = this;
      if(data.num===0){
        Global.ui.notification.show('请先选择需要处理的数据。');
        return false;
      }
      var $dialog = Global.ui.dialog.show(
        {
          title:  '提示',
          body: '<div class="js-fc-awd-Check-container"></div>',
          footer: ''
        }
      );
      var data1 = {
        type: type,
        num: data.num
      };
      var $checkWithdrawContainer = $dialog.find('.js-fc-awd-Check-container');
      var abnormalWithdrawAuditView = new AbnormalWithdrawAuditView(data1);
      $checkWithdrawContainer.html(abnormalWithdrawAuditView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
      var $notice = $dialog.find('.js-fc-awd-deal-notice');
      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-awd-audit-submit', function (ev) {
          var $target = $(ev.currentTarget);
          $target.button('loading');
          var clpValidate = $dialog.find('.js-fc-awd-deal-form').parsley().validate();
          if (clpValidate) {
            //var type = $(ev.currentTarget).data('type');
            var status;
            if (type === 'allow') {
              status = '1';
            } else if (type === 'prevent') {
              status = '2';
            }
            var data2 = {
              tradeNo: data.tradeNo,
              remark: $dialog.find('.js-fc-nwd-deal-remark').val(),
              status: status
            };
            self.dealWithdrawDepositXhr(data2).always(function () {
              $target.button('reset');
            }).fail(function () {
            }).done(function (res) {
              if (res.result === 0) {
                // $dialog.modal('hide');
                Global.ui.notification.show('操作成功。');
                self._getGridXhr();
              } else {
                Global.ui.notification.show('操作失败。');
              }
            });
          }else{
            $target.button('reset');
          }

        });
    },
    popWithdrawResultCheckModel: function(data) {
      var num;
      var html = '<div><div class="pull-left"><strong>' + _(data.dealTime).toTime() + '</strong></div><div class="pull-right"><strong>' + data.dealUser + '</strong></div><br><div class="panel panel-default no-m-bottom" style="margin-top: 20px;">';
      html += '<div class="panel-body  no-m-bottom "><p>' + data.dealRemark + '</p></div></div></div>';
      var $dialog = Global.ui.dialog.show(
        {
          title:  '操作日志',
          body: '<div>'+html+'</div>',
          footer: ''
        }
      );

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
    }
    ,
//银行列表
    getBankListXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/bankmanage/banklist.json',
        data: data
      });
    },
    //处理人列表
    getCheckUserListXhr: function () {
      return Global.sync.ajax({
        url: '/intra/withdrawmanage/exceptioncheckerlist.json'
      });
    },
    onRender: function () {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-fc-awd-timeSet'),
        startTime: 'startTime',
        endTime: 'endTime'
      }).render();
      var self = this;
      this.getBankListXhr({bankType: 2}).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          var optionData = _(res.root.bankList || []).map(function (bank) {
            return {
              value: bank.bankId,
              text: bank.bankName
            }
          });
          self.renderSelect(optionData, self.$('.js-fc-wd-aw-bankId'));
        } else {
          Global.ui.notification.show('操作失败。');
        }
      });

      this.getCheckUserListXhr().fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          var optionData = _(res.root.userList || []).map(function (user) {
            return {
              value: user.userId,
              text: user.username
            }
          });
          self.renderSelect(optionData, self.$('.js-fc-wd-aw-operatorId'));
        } else {
          Global.ui.notification.show('操作失败。');
        }
      });
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderSelect:function(data,$select){
      var options = [];
      _(data).each(function(item){
        var option = '<option value="'+item.value+'">'+item.text+'</option>';
        options.push(option);
      });
      $select.append(options.join(''));
    },

    renderGrid: function (gridData) {
      var rowsData = _(gridData.exceptionList).map(function (exception, index, exceptionList) {
        return {
          id: exception.id,
          columnEls: this.formatRowData(exception, index, exceptionList),
          dataAttr: exception,
          needCheck: exception.status===0
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      }).hideLoading();

    },

    formatRowData: function (exception) {
      var row = [];
      row.push(exception.tradeNo);
      row.push(_(exception.createTime).toTime());
      row.push(exception.userName);
      row.push(exception.bankName);
      row.push(exception.bankBranchName);
      row.push(exception.name);
      row.push(exception.cardNo);
      row.push(  _(exception.amount).convert2yuan());
      //row.push( _(exception.fee).convert2yuan());
      row.push(deviceConfig.toZh(exception.device));
      row.push(exception.exceptionType);
      row.push(_(exception.operateTime).toTime());

      if(exception.status==0){
      row.push("");
      }else{
        row.push('<button type="button" class="js-fc-awd-view btn btn-link" data-id="'+exception.serialNo+'">查看</button>');
      }
      return row;
    }
  });

  module.exports = AbnormalWithdrawView;
});

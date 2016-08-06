define(function (require, exports, module) {

  require('prefab/views/searchGrid');

  var fundStatusConfig = require('fundCenter/misc/fundStateTDConfig');
  var deviceConfig = require('skeleton/misc/deviceTypeConfig');

  var CheckWithdrawView = require('fundCenter/views/withdraw-WithdrawDeposit-Deal');

  var chargeListView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/withdraw-NormalWithdrawDeposit.html'),
    return_template: require('text!fundCenter/templates/withdraw-NormalWithdrawDeposit-return.html'),
    status_template: require('text!fundCenter/templates/fund-StatusTD-Temp.html'),

    events: {
      'click .js-fc-nwd-deal': 'dealWithdrawHandler',
      'click .js-fc-nwd-notDeal': 'notDealWithdrawHandler',
      'click .js-fc-nwd-view': 'viewDealResultHandler',
      //'click .js-fc-send-back': 'sendBackHandler',
      'click .js-fc-nwd-return': 'returnWithdrawHandler'
    },

    initialize: function () {
      _(this.options).extend({
        tableClass: '',
        //checkable: true,
        columns: [
          {
            name: '流水号',
            width: '14%'
          },
          {
            name: '申请提现时间',
            width: '10%'
          },
          {
            name: '用户名',
            width: '9%'
          },
          {
            name: '提现银行',
            width: '8%'
          },
          {
            name: '卡户支行',
            width: '10%'
          },
          {
            name: '开户人姓名',
            width: '10%'
          },
          {
            name: '卡号',
            width: '10%'
          },
          {
            name: '提现金额',
            width: '10%'
          },
          {
            name: '手续费',
            width: '6%'
          },
          {
            name: '终端类型',
            width: '8%'
          },
          {
            name: '处理时间',
            width: '8%'
          },
          {
            name: '状态',
            width: '8%'
          },
          {
            name: '操作',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/withdrawmanage/withdrawlist.json'
        },
        exportOps: {
          url: '/intra/withdrawmanage/download'
        }
      });
    },

    //审核提现
    dealWithdrawDepositXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/withdrawmanage/withdrawcheck.json',
        data: data
      });
    },
    returnWithdrawDepositXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/withdrawmanage/withdrawreturn.json',
        data: data
      });
    },

    showFailModal: function(tradeNo, message, finishCb) {
      var self = this;
      var footer = '';

      var body = '<div class="text-center">' +
        '<strong>' + message + '</strong>' +
        '<div>' +
        '<label class="radio-inline">' +
        '<input type="radio" name="type" value="1" data-status="1" checked>手动出款' +
        '</label>' +
        '<label class="radio-inline">' +
        '<input type="radio" name="type" value="0" data-status="2">退回' +
        '</label>' +
        '</div>' +
        '</div>';
      footer += '<button class="js-commit btn btn-primary">重新审核</button>';
      footer += '<button class="btn" data-dismiss="modal">取&nbsp;&nbsp;消</button>';

      var $dialog = Global.ui.dialog.show({
        title: '自动出款失败',
        body: body,
        footer: footer
      });

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-commit', function (e) {
          var $btn = $(e.currentTarget);
          var $select = $dialog.find('[name=type]').filter(':checked');
          self.dealWithdrawDepositXhr({
            tradeNo: tradeNo,
            status: $select.data('status'),
            remark: '',
            type: $select.val()
          })
            .always(function () {
              $btn.button('reset');
            })
            .done(function (res) {
              if (res.result === 0) {
                $dialog.modal('hide');
                Global.ui.notification.show('操作成功。');
                finishCb();
              } else {
                Global.ui.notification.show('操作失败。');
              }
            });
        });
    },

    dealWithdrawHandler: function (e) {
      this.propWithdrawDealModel('allow', this.grid.getRowData(e.currentTarget));
    },
    notDealWithdrawHandler: function (e) {
      this.propWithdrawDealModel('prevent', this.grid.getRowData(e.currentTarget));
    },
    viewDealResultHandler: function (e) {
      this.popWithdrawResultCheckModel(this.grid.getRowData(e.currentTarget));
    },

    //弹出处理窗口
    propWithdrawDealModel: function (type, data) {
      var self = this;

      var $dialog = Global.ui.dialog.show(
        {
          title: '提示',
          body: '<div class="js-fc-nwd-Check-container"></div>',
          footer: ''
        }
      );

      var $checkWithdrawContainer = $dialog.find('.js-fc-nwd-Check-container');
      var checkNormalWithdrawView = new CheckWithdrawView(_(data).extend({
        type: type
      }));
      $checkWithdrawContainer.html(checkNormalWithdrawView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-nwd-deal-submit', function (ev) {
          var $target = $(ev.currentTarget);
          $target.button('loading');
          var clpValidate = $dialog.find('.js-fc-nwd-deal-form').parsley().validate();
          if (clpValidate) {
            var type = $(ev.currentTarget).data('type');
            var status;
            if (type === 'allow') {
              status = 1;
            } else if (type === 'prevent') {
              status = 2;
            }
            var data2 = {
              tradeNo: data.tradeno,
              remark: $dialog.find('.js-fc-nwd-deal-remark').val(),
              status: status
            };
            self.dealWithdrawDepositXhr(data2).always(function () {
              $target.button('reset');
            }).done(function (res) {
              var data;
              if (res.result === 0) {
                data = res.root || {};
                if (data.message === 'success') {
                  Global.ui.notification.show('操作成功。');
                  $dialog.modal('hide');
                  self._getGridXhr();
                } else {
                  if (data.type === 1) {
                    //手动出款失败
                    Global.ui.notification.show('手动出款失败，请联系程序员处理。');
                    $dialog.modal('hide');
                  } else {
                    //自动出款失败
                    self.showFailModal(data2.tradeNo, data.message, function() {
                      $dialog.modal('hide');
                      self._getGridXhr();
                    });
                  }
                }
              } else {
                Global.ui.notification.show('操作失败。');
              }
            });
          } else {
            $target.button('reset');
          }
        });
    },
    popWithdrawResultCheckModel: function (data) {
      var html = '<div><div class="pull-left"><strong>' + _(data.operatetime).toTime() + '</strong></div><div class="pull-right"><strong>' + data.operator + '</strong></div><br><div class="panel panel-default no-m-bottom" style="margin-top: 20px;">';
      html += '<div class="panel-body  no-m-bottom "><p>' + (data.operateremark===null?'': data.operateremark )+ '</p></div></div></div>';
      if(data.returnoperatetime){
        html += '<div><div class="pull-left"><strong>' + _(data.returnoperatetime).toTime() + '</strong></div><div class="pull-right"><strong>' + data.returnoperator + '</strong></div><br><div class="panel panel-default no-m-bottom" style="margin-top: 20px;">';
        html += '<div class="panel-body  no-m-bottom "><p>' +( data.returnoperateremark===null?'': data.returnoperateremark ) + '</p></div></div></div>';
      }
      var $dialog = Global.ui.dialog.show(
        {
          title: '操作日志',
          body: '<div>' + html + '</div>',
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
    //审核人列表
    getCheckUserListXhr: function () {
      return Global.sync.ajax({
        url: '/intra/withdrawmanage/checkerlist.json '
      });
    },

    onRender: function () {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-fc-nwd-timeSet'),
        startTime: 'startTime',
        endTime: 'endTime'
        //strDefaultValue: '',
        //endDefaultValue: _(new Date()).toTime()
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
          self.renderSelect(optionData, self.$('.js-fc-wd-nw-bankId'));
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
          self.renderSelect(optionData, self.$('.js-fc-wd-nw-operatorId'));
        } else {
          Global.ui.notification.show('操作失败。');
        }
      });


      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },
    renderSelect: function (data, $select) {
      var options = [];
      _(data).each(function (item) {
        var option = '<option value="' + item.value + '">' + item.text + '</option>';
        options.push(option);
      });
      $select.append(options.join(''));
    },

    renderGrid: function (gridData) {
      var rowsData = _(gridData.withdrawList).map(function (withdraw, index, withdrawList) {
        return {
          id: withdraw.id,
          columnEls: this.formatRowData(withdraw, index, withdrawList),
          dataAttr: withdraw
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      }).hideLoading(this._addCopyHandler());

    },

    formatRowData: function (withdraw) {
      var row = [];
      row.push(withdraw.tradeNo);
      row.push(_(withdraw.createTime).toTime());
      row.push(withdraw.userName);
      row.push(withdraw.bankName);
      row.push(withdraw.bankBranchName);
      row.push('<span class="js-fc-nwd-copy">' + withdraw.name + '</span>');
      row.push('<span class="js-fc-nwd-copy">' + withdraw.cardNo + '</span>');
      row.push('<span class="js-fc-nwd-copy">' + _(withdraw.amount).convert2yuan() + '</span>');
      row.push( _(withdraw.fee).convert2yuan());

      row.push(deviceConfig.toZh(withdraw.device));
      row.push(_(withdraw.operateTime).toTime());

      var status = '';
      switch(withdraw.status){
        case 0: status='待处理';break;
        case 1: status='已处理-人工打款';break;
        case 2: status='不处理';break;
        case 3: status='已处理-人工退回';break;
        case 4: status='已处理-自动出款成功';break;
        case 5: status='已处理-自动出款失败';break;
        case 6: status='已处理-自动出款失败-已退回';break;
      }

      row.push(_(this.status_template).template()({code:fundStatusConfig.getCodeByStatus(status),status:status}) );

      var operate = '';

      if (withdraw.status === 0) {
        if (Global.authority.fc && Global.authority.fc.nw && Global.authority.fc.nw.process){
          operate += '<button class="js-fc-nwd-deal btn btn-success btn-sm" type="button">' +
            '<i class="fa fa-check-circle m-right-xs"></i>处&nbsp;&nbsp;理</button>';
        }
        if(Global.authority.fc && Global.authority.fc.nw && Global.authority.fc.nw.notProcess){
          operate += '<button class="js-fc-nwd-notDeal btn btn-danger btn-sm" type="button">' +
            '<i class="fa fa-ban m-right-xs"></i>不处理</button>';
        }
      }
      //
      //if(withdraw.status === 4 || withdraw.status === 5) {
      //  operate += '<button type="button" class="js-fc-send-back btn btn-link">查看</button>';
      //}

      if (withdraw.status !== 0) {
        operate += '<button type="button" class="js-fc-nwd-view btn btn-link" data-id="' + withdraw.serialNo + '">查看</button>';
      }

      if(withdraw.status === 1 || withdraw.status === 4 || withdraw.status=== 5) {
        operate = operate + '<button type="button" class="js-fc-nwd-return btn btn-link" data-id="' + withdraw.serialNo + '">退回</button>';
      }

      row.push(operate);
      return row;
    },
    returnWithdrawHandler: function(e){
      var self = this;
      var $target = $(e.currentTarget);
      var $dialog = Global.ui.dialog.show(
        {
          title: '提示',
          body: _(this.return_template).template()(),
          footer: ''
        }
      );
      var $tr = $target.closest('tr');
      var name = $tr.data('username');
      var tradeNo = $tr.data('tradeno');
      $dialog.find('.js-fc-nwd-return-username').html(name);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-nwd-return-submit', function (ev) {
          var $target1 = $(ev.currentTarget);
          $target1.button('loading');
          var clpValidate = $dialog.find('.js-fc-nwd-return-form').parsley().validate();
          if (clpValidate) {
            var data2 = {
              tradeNo: tradeNo,
              remark: $dialog.find('.js-fc-nwd-return-remark').val()
            };
            self.returnWithdrawDepositXhr(data2).always(function () {
              $target1.button('reset');
            }).done(function (res) {
              if (res.result === 0) {
                $dialog.modal('hide');
                Global.ui.notification.show('操作成功。');
                self._getGridXhr();
              } else {
                Global.ui.notification.show('操作失败。');
              }
            });
          } else {
            $target1.button('reset');
          }
        });
    },

    _addCopyHandler: function() {
      var $copyElList = this.$('.js-fc-nwd-copy');
      _.each($copyElList, function(copyEl) {
        $(copyEl).textCopy({
          textEl: $(copyEl),
          type: 'dblclick'
        });
      });
    }

  });

  module.exports = chargeListView;
});
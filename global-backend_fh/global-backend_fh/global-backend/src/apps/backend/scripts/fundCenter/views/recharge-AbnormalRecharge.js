define(function (require, exports, module) {
  require('prefab/views/searchGrid');
  var AbnormalRechargeManageView = require('fundCenter/views/recharge-AbnormalRecharge-Manage');
  var AbnormalRechargeCheckView = require('fundCenter/views/recharge-AbnormalRecharge-Check');
  var fundStatusConfig = require('fundCenter/misc/fundStateTDConfig');

  var AbnormalRechargeView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/recharge-AbnormalRecharge.html'),
    status_template: require('text!fundCenter/templates/fund-StatusTD-Temp.html'),

    events: {
      'click .js-fc-arManage': 'abnormalRechargeManageHandler',
      'click .js-fc-arCheck': 'abnormalRechargeCheckHandler'
    },

    initialize: function () {
      _(this.options).extend({
        tableClass: '',
        checkable: false,
        columns: [
          {
            name: '流水号',
            width: '10%'
          },
          {
            name: '用户名',
            width: '7%'
          },
          {
            name: '到账时间',
            width: '14%'
          },
          {
            name: '附言',
            width: '7%'
          },
          {
            name: '收款金额',
            width: '10%'
          },
          {
            name: '手续费',
            width: '10%'
          },
          {
            name: '收款银行',
            width: '7%'
          },
          {
            name: '收款人',
            width: '7%'
          },
          {
            name: '付款银行',
            width: '7%'
          },
          {
            name: '付款人',
            width: '7%'
          },
          {
            name: '状态',
            width: '7%'
          },
          {
            name: '操作',
            width: '7%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/rechargemanage/exceptionlist.json'
        }
      });
    },
    getCheckUserListXhr: function(){
      return Global.sync.ajax({
        url: '/intra/rechargemanage/checkerlist.json '
      });
    },

    onRender: function () {
      var self = this;
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-pf-timeset')
        //startTime: 'chaseStartTime',
        //endTime: 'chaseEndTime'
      }).render();
      //this.$('.js-start-time').val('2015-08-20 18:18:18');
      this.getCheckUserListXhr() .fail(function(){
      }).done(function(res){
        if(res.result===0){
          var optionData = _(res.root.userList||[]).map(function(user){
            return {
              value: user.userId,
              text: user.username
            }
          });
          self.renderSelect(optionData,self.$('.js-fc-re-ar-operatorId'))
        }else{
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
      var rowsData = _(gridData.exceptionList).map(function (recharge, index, rechargeList) {
        return {
          columnEls: this.formatRowData(recharge, index, rechargeList),
          dataAttr: recharge
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });

      //加上统计行

      this.grid
        //  .addRows({
        //  columnEls: [
        //    '<strong>所有页总计</strong>',
        //    {
        //      colspan: 3
        //    },
        //    '￥' + _(gridData.amountTotal).convert2yuan(),
        //    '￥' + _(gridData.feeTotal).convert2yuan(),
        //    {
        //      colspan: 9
        //    }
        //  ]
        //})
        .hideLoading();


    },

    formatRowData: function (recharge) {
      var row = [];

      row.push(recharge.tradeNo);
      row.push(recharge.userName || '');
      row.push(_(recharge.createTime).toTime());
      row.push(recharge.keyword);
      row.push('￥' + _(recharge.amount).formatDiv(10000,{fixed:4}));
      row.push('￥' + _(recharge.fee).formatDiv(10000,{fixed:4}));
      row.push(recharge.recvBankName);
      row.push(recharge.recvName);
      row.push(recharge.payBankName);
      row.push(recharge.payName);
      //row.push(recharge.status === 1 ? '已处理' : '待处理');
      var status = recharge.status === 1 ? '已处理' : '待处理';
      row.push(_(this.status_template).template()({code:fundStatusConfig.getCodeByStatus(status),status:status}));
      row.push(this.getOperateHtml(recharge.exceptionId, recharge.status));

      return row;
    },

    //
    getOperateHtml: function (tradeNo, state) {
      var manageLink = '';
      if(Global.authority.fc && Global.authority.fc.ar && Global.authority.fc.ar.process){
        manageLink = '<a class="js-fc-arManage btn-link" data-type="' + tradeNo + '">处理</a>';
      }
      var checkLink = '<a class="js-fc-arCheck btn-link" data-type="' + tradeNo + '">查看</a>';
      var html;
      if (state === 1) {
        html = checkLink;
      } else {
        html = manageLink;
      }
      return html;
    },

    abnormalRechargeManageHandler: function (e) {
      var $target = $(e.currentTarget);
      var tradeNo = $target.data('type');
      this.popManageModel(tradeNo);

    }

    ,
    abnormalRechargeCheckHandler: function (e) {
      var $target = $(e.currentTarget);
      var exceptionId = $target.data('type');
      this.popCheckModel(exceptionId);
    },
    popManageModel: function (exceptionId) {
      var self = this;
      var $dialog = Global.ui.dialog.show(
        {
          title: '处理',
          body: '<div class="js-fc-arManage-container"></div>',
          footer: '<button class="js-fc-arManage-confirm btn btn-primary" type="button">确定</button><button class="btn" data-dismiss="modal">取消</button>'
        }
      );

      var $manageContainer = $dialog.find('.js-fc-arManage-container');

      var abnormalRechargeManageView = new AbnormalRechargeManageView({tradeNo: exceptionId});
      $manageContainer.html(abnormalRechargeManageView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });

      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-arManage-confirm', function (e) {
          var $target = $(e.currentTarget);
          $target.button('loading');
          var clpValidate = $dialog.find('.js-fc-ar-m-form').parsley().validate();
          if (!$dialog.find('.js-fc-re-am-tip').hasClass('hidden')) {
            //window.confirm('请输入有效的用户名！');
            $target.button('reset');
            $(document).confirm({
              content: '请输入有效的用户名！',
              agreeCallback: function () {
              }
            });
            return false;
          }
          if (clpValidate) {
            var userName = $dialog.find('.js-fc-arManageUserName').val();
            var remark = $dialog.find('.js-fc-arManageRemark').val();
            var attach = _($dialog.find('.js-wt-img-attach')).map(function (attach, index, attacheList) {
              return $(attach).attr('src');
            }).join(',');
            var data = {
              exceptionId: exceptionId,
              username: userName,
              attach: attach,
              remark: remark
            };

            abnormalRechargeManageView.saveAuxiliaryRechargeInfoXhr(data).always(function(){
              $target.button('reset');
            })
              .fail(function () {
              })
              .done(function (res) {
                if (res.result === 0) {
                  $dialog.modal('hide');
                  Global.ui.notification.show("操作成功。");
                  self._getGridXhr();//刷新表格中的
                } else {
                  Global.ui.notification.show("操作失败。");
                }
              });
          } else {
            $target.button('reset');
          }

        });
    },
    popCheckModel: function (exceptionId) {

      var $dialog = Global.ui.dialog.show(
        {
          title: '查看',
          body: '<div class="js-fc-arManageCheck-container"></div>'
        }
      );

      var $checkContainer = $dialog.find('.js-fc-arManageCheck-container');

      var abnormalRechargeCheckView = new AbnormalRechargeCheckView({exceptionId: exceptionId});
      $checkContainer.html(abnormalRechargeCheckView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });

    }


  });

  module.exports = AbnormalRechargeView;
});
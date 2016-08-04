define(function (require, exports, module) {

  require('prefab/views/searchGrid');
  var fundStatusConfig = require('fundCenter/misc/fundStateTDConfig');

  var CheckFundOperateView = require('fundCenter/views/fund-ManualOperateCheck-Deal');

  var fundCheckView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/fund-ManualOperateCheck.html'),
    status_template: require('text!fundCenter/templates/fund-StatusTD-Temp.html'),

    events: {
      'click .js-fc-fund-pass': 'dealFundCheckHandler',
      'click .js-fc-fund-noPass': 'notDealFundCheckHandler',
      'click .js-fc-fund-viewApply': 'viewFundApplyHandler',
      'click .js-fc-fund-viewResult': 'viewDealResultHandler'
    },

    initialize: function () {
      _(this.options).extend({
        checkable: true,
        columns: [
          {
            name: '流水号',
            width: '9%'
          },
          {
            name: '类型',
            width: '10%'
          },
          {
            name: '用户名',
            width: '9%'
          },
          {
            name: '申请金额',
            width: '10%'
          },
          {
            name: '实际加减金额',
            width: '10%'
          },
          {
            name: '申请人',
            width: '10%'
          },
          {
            name: '申请时间',
            width: '15%'
          },
          {
            name: '状态',
            width: '7%'
          },
          {
            name: '操作',
            width: '20%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/rechargemanage/sysrechargelist.json'
        }
      });
    },

    //审核人列表
    getCheckUserListXhr: function(){
      return Global.sync.ajax({
        url: '/intra/rechargemanage/syscheckerlist.json'
      });
    },
    //申请人列表
    getApplyUserListXhr: function(){
      return Global.sync.ajax({
        url: '/intra/rechargemanage/sysadderlist.json'
      });
    },
    //审核提现
    dealFundCheckXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/sysrechargecheck.json',
        data: data
      });
    },


    //TODO 查看申请信息
    viewFundApplyHandler: function (e) {
      var self = this;
      var id = $(e.currentTarget).data('id');
      var $tr = $(e.currentTarget).parent().parent();
      var data = {
        attachment: $tr.data('attachment'),
        reason: $tr.data('reason')
      };
      self.popFundApplyInfoModel(data);

    },

    //TODO 获取选中的行,只提供有效的需要处理的数据状态为0
    getCheckedData: function () {
      var checkedData = this.grid.getChk();
      var tradeNos = _(checkedData.$rows).chain().filter(function (row) {
        return $(row).data('status') === 0;
      }).map(function(row){
        return  $(row).data('tradeno') ;
      }).value().join(',');
      return data = {
        num: _(checkedData.ids).size(),
        tradeNo: tradeNos
      }
    },
    //TODO 处理
    dealFundCheckHandler: function (e) {
      var data = this.getCheckedData();
      this.propFundCheckDealModel('allow', data);
    },
    //TODO 不处理
    notDealFundCheckHandler: function () {
      var data = this.getCheckedData();
      this.propFundCheckDealModel('prevent', data);
    },
    //TODO 查看处理结果
    viewDealResultHandler: function (e) {
      var self = this;
      var id = $(e.currentTarget).data('id');
      var $tr = $(e.currentTarget).parent().parent();
      var data = {
        dealTime: _($tr.data('approvetime')).toTime(),
        dealUser: $tr.data('operator'),
        dealRemark: $tr.data('approveremark')
      };
      self.popFundCheckResultCheckModel(data);
    },

    //弹出处理窗口
    propFundCheckDealModel: function (type, data) {
      var self = this;
      if(data.num===0){
        Global.ui.notification.show('请先选择需要处理的数据。');
        return false;
      }
      var $dialog = Global.ui.dialog.show(
        {
          title: '提示',
          body: '<div class="js-fc-fundCheck-container"></div>',
          footer: ''
        }
      );

      var data1 = {
        type: type,
        num: data.num
      };
      var $fundCheckContainer = $dialog.find('.js-fc-fundCheck-container');
      var checkFundOperateView = new CheckFundOperateView(data1);
      $fundCheckContainer.html(checkFundOperateView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
      var $notice = $dialog.find('.js-fc-fundCheck-deal-notice');
      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-fc-fundCheck-deal-submit', function (ev) {
          //表单校验
          var $target = $(ev.currentTarget);
          $target.button('loading');
          var clpValidate = $dialog.find('.js-fc-fundCheck-form').parsley().validate();
          if (clpValidate) {
            var type = $(ev.currentTarget).data('type');
            var status;
            if (type === 'allow') {
              status = '1';
            } else if (type === 'prevent') {
              status = '2';
            }
            var data2 = {
              tradeNo: data.tradeNo,
              remark: $dialog.find('.js-fc-fundCheck-deal-remark').val(),
              status: status
            };
            self.dealFundCheckXhr(data2).always(function () {
              $target.button('reset');
            }).fail(function () {
            }).done(function (res) {
              if (res.result === 0) {
                $dialog.modal('hide');
                self._getGridXhr();
                Global.ui.notification.show('操作成功。');
              } else {
                Global.ui.notification.show('操作失败。');
              }
            });
          }
          else {
            $target.button('reset');
          }
        });
    },
    popFundCheckResultCheckModel: function (data) {
      var num;
      var html = '<div><div class="pull-left"><strong>' + _(data.dealTime).toTime() + '</strong></div><div class="pull-right"><strong>' + data.dealUser + '</strong></div><br><div class="panel panel-default no-m-bottom" style="margin-top: 20px;">';
      html += '<div class="panel-body  no-m-bottom "><p>' + data.dealRemark + '</p></div></div></div>';
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
    },
    popFundApplyInfoModel: function (data) {
      var num;
      var self = this;
      var html = [];
      html.push('<div class="js-fc-arCheckAttach gallery-list js-masonry m-top-md">');
      if (data.attachment) {
        _((data.attachment).split(',')).each(function (attach, index) {
          html.push(self.generateImageArea(attach));
        });
      }
      html.push('</div>');
      html.push('<div class="panel panel-default no-m-bottom "><div class="panel-body  no-m-bottom "><p>' + data.reason + '</p></div></div>');
      var $dialog = Global.ui.dialog.show(
        {
          title: '申请原因附件',
          body: '<div>' + html.join('') + '</div>',
          footer: ''
        }
      );
      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
    },

    generateImageArea: function (url, name) {
      return '<div class="gallery-item no-rotate width-sm m-right-sm">' +
        '<div class="gallery-wrapper width-sm"><a class="gallery-remove"><i class="fa fa-times"></i></a><img src="' +
        url + '" class="js-fc-arManage-attach square-sm">' + (name ? '<div class="gallery-title">' + name + '</div>' : '') + '</div></div>';
    },

    onRender: function () {
      //初始化时间选择
      var self = this;
      new Global.Prefab.Timeset({
        el: this.$('.js-fc-fundCheck-timeSet'),
        startTime: 'startTime',
        endTime: 'endTime',
        showToday: true
      }).render();

      this.getCheckUserListXhr().fail(function(){
      }).done(function(res){
        if(res.result===0){
          var optionData = _(res.root.userList||[]).map(function(user){
            return {
              value: user.userId,
              text: user.username
            }
          });
          self.renderSelect(optionData,self.$('.js-fc-fu-mc-approverId'));
        }else{
          Global.ui.notification.show('操作失败。');
        }
      });
      this.getApplyUserListXhr().fail(function(){
      }).done(function(res){
        if(res.result===0){
          var optionData = _(res.root.userList||[]).map(function(user){
            return {
              value: user.userId,
              text: user.username
            }
          });
          self.renderSelect(optionData,self.$('.js-fc-fu-mc-operatorId'));
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
      var rowsData = _(gridData.rechargeList).map(function (recharge, index, withdrawList) {
        return {
          id: recharge.tradeNo,
          columnEls: this.formatRowData(recharge, index, withdrawList),
          dataAttr: recharge,
          needCheck: recharge.status===0
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: false
      });
      this.grid.addRows({
        columnEls: [
          '<strong>所有页总计</strong>',
          {
            colspan: 2
          },
          '￥' + _(gridData.amountTotal).convert2yuan(),
          '￥' + _(gridData.affectAmountTotal).convert2yuan(),
          {
            colspan: 4
          }
        ]
      })
        .hideLoading();
    },

    formatRowData: function (withdraw) {
      var row = [];
      row.push(withdraw.tradeNo);
      row.push(withdraw.rechargeType);
      row.push(withdraw.userName);
      row.push('￥' + _(withdraw.amount).formatDiv(10000,{fixed:4}));
      row.push('￥' + _(withdraw.affectAmount).formatDiv(10000,{fixed:4}));
      row.push(withdraw.operator);
      row.push(_(withdraw.createTime).toTime());
      var status = '';
      if (withdraw.status === 0) {
        status = '待审核';
      } else if (withdraw.status === 1) {
        status = '已通过';
      } else if (withdraw.status === 2) {
        status = '未通过';
      }
      row.push(_(this.status_template).template()({code:fundStatusConfig.getCodeByStatus(status),status:status}));

      var html = '<button type="button" class="js-fc-fund-viewApply btn btn-link" data-id="' + withdraw.tradeNo + '">查看申请</button>';
      if (withdraw.status != 0) {
        html += '<button type="button" class="js-fc-fund-viewResult btn btn-link" data-id="' + withdraw.tradeNo + '">查看结果</button>';
      }
      row.push(html);
      return row;
    }
  });

  module.exports = fundCheckView;
});
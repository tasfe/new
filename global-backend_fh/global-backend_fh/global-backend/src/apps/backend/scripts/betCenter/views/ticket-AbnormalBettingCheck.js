define(function (require, exports, module) {
  require('prefab/views/searchGrid');
  var ExceptionDetailView = require('betCenter/views/ticket-AbnormalBettingCheck-detail');
  var CheckBettingView = require('betCenter/views/ticket-AbnormalBettingCheck-deal');

  var AbnormalBettingCheckView = Base.Prefab.SearchGrid.extend({

    template: require('text!betCenter/templates/ticket-AbnormalBettingCheck.html'),

    events: {
      'click .js-bc-ticketPlanId':'exceptionDetaiHandler',
      'click .js-bc-nwd-notDeal': 'notDealWithdrawHandler',
      'click .js-bc-nwd-deal': 'dealWithdrawHandler',
      'click .js-ul-chase':'userChaseHandler',
      'click .js-ul-bet':'userBetHandler',
      'click .js-ul-user':'userListHandler'
    },

    initialize: function () {
      _(this.options).extend({
        title: '异常投注记录',
        tableClass: '',
        checkable: true,
        columns: [
          {
            name: '彩种',
            width: '10%'
          },
          {
            name: '用户名',
            width: '10%'
          },
          {
            name: '期号',
            width: '12%'
          },
          {
            name: '单期投注',
            width: '10%'
          },
          {
            name: '单期奖金',
            width: '10%'
          },
          {
            name: '单期中/投比',
            width: '10%'
          },
          {
            name: '连续中奖期数',
            width: '10%'
          },
          {
            name: '连续中奖订单数',
            width: '10%'
          },
          {
            name: '连续中奖注数',
            width: '10%'
          },
          {
            name: '查看',
            width: '10%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/exceptionmng/list.json'
        }
      });
    },

    onRender: function() {
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-bc-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        showToday: true
      }).render();

      //初始化彩种选择
      new Global.Prefab.TicketSelectGroup({
        el: this.$('.js-uc-ticket-select-group')
      });

      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
    },


    renderGrid: function(gridData) {
      var self = this;
      var rowsData = _(gridData.exceptionList).map(function(exception,index) {
        return {
          id: exception.ticketExceptionId,
          columnEls: this.formatRowData(exception, index),
          dataAttr: exception,
          needCheck: gridData.status!==1
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      })
        .hideLoading();
    },

    formatRowData: function(rowInfo) {
      var row = [];
      row.push(rowInfo.ticketName+
               '<input type="text" class="hidden js-bc-ticketId" id="jsBCTicketId'+rowInfo.ticketExceptionId+'" value="'+rowInfo.ticketId+'">');
      row.push(rowInfo.userName+
              '<input type="text" class="hidden js-bc-ticketId" id="jsBCUserName'+rowInfo.ticketExceptionId+'" value="'+rowInfo.userName+'">'
              );
      row.push("<a class='js-bc-ticketPlanId' id='jsBCTicketPlanId"+rowInfo.ticketExceptionId+"'>"+rowInfo.ticketPlanId+"</a>");
      row.push('￥'+ _(rowInfo.ticketBetMoney).fixedConvert2yuan());
      row.push(_(rowInfo.ticketPrizeMoneyVal) == 0 ? '￥'+ _(rowInfo.ticketPrizeMoney).convert2yuan():'<font color="red">￥'+ _(rowInfo.ticketPrizeMoney).convert2yuan()+'</font>');
      row.push(_(rowInfo.ticketMoneyBetRateVal) == 0 ? rowInfo.ticketMoneyBetRate:'<font color="red">'+ rowInfo.ticketMoneyBetRate+'</font>');
      row.push(_(rowInfo.serialWinPlanVal) == 0 ? rowInfo.serialWinPlan:'<font color="red">'+ rowInfo.serialWinPlan+'</font>');
      row.push(_(rowInfo.serialWinBetVal) == 0 ? rowInfo.serialWinBet:'<font color="red">'+ rowInfo.serialWinBet+'</font>');
      row.push(_(rowInfo.serialWinBetnumVal) == 0 ? rowInfo.serialWinBetnum:'<font color="red">'+ rowInfo.serialWinBetnum+'</font>');
      var operate = '';
      if(Global.authority.bc && Global.authority.bc.br && Global.authority.bc.br.page){
        operate += '<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.userName + '" class="js-ul-bet btn btn-link">投注</button>';
      }
      if(Global.authority.bc && Global.authority.bc.cr && Global.authority.bc.cr.page){
        operate += '<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.userName + '" class="js-ul-chase btn btn-link">追号</button>';
      }
      operate += '<button data-id="' + rowInfo.userId + '" data-type="' + rowInfo.userName + '" class="js-ul-user btn btn-link">冻结</button>';
      row.push(operate);
      return row;
    },

    // 查看异常详情
    exceptionDetaiHandler:function(e){
      var self = this;
      var $target = $(e.currentTarget);
      var $dialog = Global.ui.dialog.show(
        {
          title: '异常详情',
          size: 'modal-lg',
          body: '<div class="js-bc-exceptionDetailContainer"></div>'
        }
      );
      var $exceptionDetailContainer = $dialog.find('.js-bc-exceptionDetailContainer');
      $targetId = $target.attr('id');
      $ticketExceptionId = $targetId.substring(16,$targetId.length);
      var exceptionDetailView = new ExceptionDetailView(
        {
          ticketExceptionId:$ticketExceptionId,
          ticketId:self.$('#jsBCTicketId'+$ticketExceptionId).val(),
          ticketPlanId:$target.text(),
          username:self.$('#jsBCUserName'+$ticketExceptionId).val(),
          subUser:self.$('.js-bc-subUser').val(),
          tradeNo:self.$('.js-bc-tradeNo').val(),
          startTime:self.$('.js-start-time').val(),
          endTime:self.$('.js-end-time').val(),
          planMoneyTotal:self.$('.js-bc-planMoneyTotal').val(),
          planMoneyBetRate:self.$('.js-bc-planMoneyBetRate').val(),
          betMoney:self.$('.js-bc-betMoney').val(),
          moneyBetRate:self.$('.js-bc-moneyBetRate').val(),
          playBetMoney:self.$('.js-bc-playBetMoney').val(),
          playMoneyBetRate:self.$('.js-bc-playMoneyBetRate').val(),
          status:self.$('.js-bc-status').val(),
          curStatus:self.$('.js-bc-curStatus').val()
        }
      );
      $exceptionDetailContainer.html(exceptionDetailView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
        exceptionDetailView.destroy();
      });

      exceptionDetailView.on('submit:success', function() {
        this._getGridXhr();
        $dialog.modal('hide');
      }, this);

      $dialog.on('click', '.js-bc-btn-submit-check', function (e) {
        var $target = $(e.currentTarget);

        $dialog.modal('hide');
      });
    },

    getCheckedData: function(){
      var checkedData = this.grid.getChk();
      var ticketexceptionids = _(checkedData.$rows).map(function(row,index,$rows){
        return $(row).data('ticketexceptionid');
      }).join(',');
      return data = {
        num: _(checkedData.ids).size(),
        ticketexceptionid: ticketexceptionids
      }
    },

    dealWithdrawHandler: function(){
      var self = this;
      var data = this.getCheckedData();
      this.propBettingDealModel('allow',data);
    },

    notDealWithdrawHandler: function() {
      var self = this;
      var data = this.getCheckedData();
      this.propBettingDealModel('prevent',data);
    },

    propBettingDealModel: function (type,data) {
      var self = this;
      if(data.num===0){
        Global.ui.notification.show('请先选择需要处理的数据。');
        return false;
      }
      var $dialog = Global.ui.dialog.show(
        {
          title:  '提示',
          body: '<div class="js-bc-nwd-Check-container"></div>',
          footer: ''
        }
      );
      var num = 0;
      var data1 = {
        type: type,
        num: data.num
      };
      var $CheckBettingContainer = $dialog.find('.js-bc-nwd-Check-container');
      var checkBettingView = new CheckBettingView(data1);
      $CheckBettingContainer.html(checkBettingView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
        checkBettingView.destroy();
      });
      var $notice = $dialog.find('.js-bc-nwd-deal-notice');
      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-bc-nwd-deal-submit', function (ev) {
          var type = $(ev.currentTarget).data('type');
          var status;
          if(type==='allow'){
            status= '1';
          }else if(type==='prevent'){
            status= '2';
          }
          var data2 = {
            ticketExceptionIds: data.ticketexceptionid,
            remark: $dialog.find('.js-bc-nwd-deal-remark').val(),
            status: status
          };
          checkBettingView.dealBettingDepositXhr(data2).fail(function(){
          }).done(function(res){
            if(res.result===0){
              $dialog.modal('hide');
              self.onRender();//刷新页面
              Global.ui.notification.show('操作成功。');
            }else{
              Global.ui.notification.show('操作失败。');
            }
          });

        });
    },

    insertNotice: function ( html) {
      this.$('.js-bc-abnormalBetting-notice').html(this._getErrorMsg(html));
    },
    //组装错误提示框
    _getErrorMsg: function (text) {
      return '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '<i class="fa fa-times-circle m-right-xs"></i>' +
        '<strong>提示：</strong> ' + text +
        '</div>';
    },

    userChaseHandler:function(e){
      var $target = $(e.currentTarget);
      Global.appRouter.navigate(_('#bc/cr').addHrefArgs({
        _t:_.now(),
        username:$target.data('type')
      }), {trigger: true, replace: false});
    },
    userBetHandler:function(e){
      var $target = $(e.currentTarget);
      Global.appRouter.navigate(_('#bc/br').addHrefArgs({
        _t:_.now(),
        username:$target.data('type')
      }), {trigger: true, replace: false});
    },

    userListHandler:function(e){
      var $target = $(e.currentTarget);
      Global.appRouter.navigate(_('#uc/ul').addHrefArgs({
        _t:_.now(),
        username:$target.data('type')
      }), {trigger: true, replace: false});
    },

  });

  module.exports = AbnormalBettingCheckView;
});

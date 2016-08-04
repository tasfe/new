/**
 * Created by David Zhang on 2015/9/17.
 */
define(function (require, exports, module) {
  var CheckBettingView = require('betCenter/views/ticket-AbnormalBettingCheck-deal');
  var ExceptionDetailView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/ticket-AbnormalBettingCheck-detail.html'),

    //所有的事件绑定全部写在这！
    events: {
      'click .js-bc-nwd-notDeal': 'notDealWithdrawHandler',
      'click .js-bc-nwd-deal': 'dealWithdrawHandler',
      'click .jsBCOperateLog': 'operateLogHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    _getExceptionSubList:function(data){
      return Global.sync.ajax({
        url: '/intra/exceptionmng/sublist.json',
        data: data,
        abort:false
      });
    },

    onRender:function(){
      var self = this;
      var params = {
        ticketExceptionId:this.options.ticketExceptionId,
        ticketId:this.options.ticketId,
        ticketPlanId:this.options.ticketPlanId,
        username:this.options.username,
        subUser:this.options.subUser,
        tradeNo:this.options.tradeNo,
        startTime:this.options.startTime,
        endTime:this.options.endTime,
        planMoneyTotal:this.options.planMoneyTotal,
        planMoneyBetRate:this.options.planMoneyBetRate,
        betMoney:this.options.betMoney,
        moneyBetRate:this.options.moneyBetRate,
        playBetMoney:this.options.playBetMoney,
        playMoneyBetRate:this.options.playMoneyBetRate
      //  status:this.options.status
      };
      //var curStatus = this.options.curStatus;
      //if(curStatus == 2){
      //  self.$('.js-bc-nwd-notDeal').addClass('hidden');
      //}else if(curStatus == 1){
      //  self.$('.js-bc-nwd-notDeal').addClass('hidden');
      //  self.$('.js-bc-nwd-deal').addClass('hidden');
      //}
      this._getExceptionSubList(params).done(function (res) {
        if (res.result === 0) {
          if(res.root != null){
            self._getTable(self._formatsubExceptionData(res.root.subExceptionList), 'js-bc-exceptionDetailGrid');
          }
        }else{
          Global.ui.notification.show('数据异常。');
        }
      }).fail(function(){
      });
    },

    //获取表格
    _getTable: function (tableInfo, classValue) {
      this.grid = this.$('.' + classValue).grid({
        checkable: true,
        pagination: false,
        columnDefinitions: [
          {name: '订单编号', width: 200},
          {name: '投注时间', width: 200},
          {name: '订单金额', width: 200},
          {name: '订单奖金', width: 200},
          {name: '订单中/投比', width: 200},
          {name: '单注奖金', width: 200},
          {name: '单注中/投比', width: 200},
          {name: '是否追号', width: 200},
          {name: '终端', width: 200},
          {name: '订单状态', width: 200},
          {name: '操作日志', width: 200}
        ],
        row: tableInfo
      }).grid ('instance');

      this.grid.hideLoading().refreshRowData(tableInfo, 0);
    },

    _formatsubExceptionData: function (subExceptionList) {
      return _(subExceptionList).chain().map(function (subException) {
        var operate = '';
        if(subException.status != 0){
          operate = "<a class='jsBCOperateLog' id='jsBCOperateLog"+subException.ticketBetId+"'>点击查看</a>";
        }
        var betDevice;
        if(subException.ticketBetDevice==0){
          betDevice = 'PC网页';
        }else if(subException.ticketBetDevice==1){
          betDevice = 'ios';
        }else if(subException.ticketBetDevice==2){
          betDevice = 'android';
        }
        var status = '';
        if(subException.status==0){
          status = '待审核';
        }else if(subException.status==1){
          status = '通过审核';
        }else if(subException.status==2){
          status = '未通过审核';
        }
        return {
          id: subException.ticketBetId,
          columnEls: [
            subException.ticketBetNum,_(subException.ticketBetTime).toTime(),
            '￥'+_(subException.ticketBetMoney).fixedConvert2yuan(),
            _(subException.ticketPrizeMoneyVal) == 0 ? '￥'+_(subException.ticketPrizeMoney).convert2yuan():'<font color="red">￥'+ _(subException.ticketPrizeMoney).convert2yuan()+'</font>',
            _(subException.ticketMoneyBetRateVal) == 0 ? subException.ticketMoneyBetRate:'<font color="red">'+ subException.ticketMoneyBetRate+'</font>',
            _(subException.ticketPlayPrizeMoneyVal) == 0 ? '￥'+_(subException.ticketPlayPrizeMoney).convert2yuan():'<font color="red">￥'+ _(subException.ticketPlayPrizeMoney).convert2yuan()+'</font>',
            _(subException.ticketPlayMoneyBetRateVal) == 0 ? subException.ticketPlayMoneyBetRate:'<font color="red">'+ subException.ticketPlayMoneyBetRate+'</font>',
            subException.ticketChaseId == null ? '否':'是',
            betDevice,
            status,
            operate
          ],
          needCheck: subException.status!==1,
          dataAttr: subException
        };
      }).value();
    },

    getCheckedData: function(){
      var checkedData = this.grid.getChk();
      var ticketbetids = _(checkedData.$rows).map(function(row,index,$rows){
        return $(row).data('ticketbetid');
      }).join(',');
      return data = {
        num: _(checkedData.ids).size(),
        ticketbetid: ticketbetids
      }
    },

    dealWithdrawHandler: function(){
      var data = this.getCheckedData();
      //if(data.num == 0){
      //  content = '请先选中记录';
      //  this.insertNotice(content);
      //}else{
        this.propBettingDealModel('allow',data);
      //}
    },

    notDealWithdrawHandler: function() {
      var data = this.getCheckedData();
      //if(data.num == 0){
      //  content = '请先选中记录';
      //  this.insertNotice(content);
      //}else{
        this.propBettingDealModel('prevent',data);
      //}
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
      var num = 2;
      var data1 = {
        type: type,
        num: data.num
      };
      var $CheckBettingContainer = $dialog.find('.js-bc-nwd-Check-container');
      var checkBettingView = new CheckBettingView(data1);
      $CheckBettingContainer.html(checkBettingView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
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
            ticketBetIds: data.ticketbetid,
            remark: $dialog.find('.js-bc-nwd-deal-remark').val(),
            status: status
          };
          checkBettingView.dealBettingDepositXhr(data2).fail(function(){
          }).done(function(res){
            if(res.result===0){
              $dialog.modal('hide');
              self.trigger('submit:success');
              Global.ui.notification.show('操作成功。');
            }else{
              Global.ui.notification.show('操作失败。');
            }
          });

        });
    },

    // 查看操作日志
    getOperateLog: function (datas) {

      return Global.sync.ajax({
        url: '/intra/exceptionmng/approvedetail.json ',
        data: datas
      });

    },

    // 操作日志详情
    operateLogHandler: function(e) {

      var $target = $(e.currentTarget);
      var reqParams = {ticketBetId:$target.attr('id').substring(14,$target.attr('id').length)};
      this.getOperateLog(reqParams).always(function () {
      })
        .fail(function () {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            var html = [];
            _(res.root).each(function(item,index){
              var style = 'margin-top: 10px;';
              if(index==0){
                style = '';
              }
              html.push('<div style="'+style+'"><span><strong>'+_(item.operateTime).toTime()+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+item.operatorName+'</strong></span></div>');
              html.push('<div class="panel panel-default no-m-bottom "><div class="panel-body  no-m-bottom "><p>'+item.remark+'</p></div></div>');
            });
            var $dialog = Global.ui.dialog.show(
              {
                title:  '操作日志',
                body: '<div>'+html.join('')+'</div>',
                footer: ''
              }
            );

            $dialog.on('hidden.bs.modal', function () {
              $(this).remove();
            });
          } else {
            Global.ui.notification.show('操作日志获取失败');
          }
        });
    },

    insertNotice: function ( html) {
      this.$('.js-bc-checkBetting-notice').html(this._getErrorMsg(html));
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
  });

  module.exports = ExceptionDetailView;
});
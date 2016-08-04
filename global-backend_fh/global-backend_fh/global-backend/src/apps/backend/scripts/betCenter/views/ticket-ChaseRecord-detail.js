/**
 * Created by David Zhang on 2015/9/19.
 */
define(function (require, exports, module) {

  var CancelChaseView = require('betCenter/views/ticket-ChaseRecord-detail-cancelChase');

  var OptionalBettingDetailView = require('betCenter/views/ticket-BettingRecord-optional-detail');

  var BettingRecordDetailView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/ticket-ChaseRecord-detail.html'),

    //所有的事件绑定全部写在这！
    events: {
      'click .js-bc-btn-cancelChase': 'cancelChaseHandler',
      'click .js-BC-canceLChasePlan': 'cancelChaseHandler',
      'click .js-bc-sysCancelBet':'sysCancelBetHandler',
      'click .js-BC-betDetail':'viewBetDetail',
      'click .js-BC-accountDetail':'viewAccountDetail',
      'click .js-BC-betDetail-optional-betNum': 'showBettingDetailOfOptionalHandler',
      'click .js-BC-cd-placeOrder': 'placeOrderHandler',
      'click .js-BC-cd-award': 'awardHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    getXxxXhr: function (datas) {

      return Global.sync.ajax({
        url: '/intra/chasemng/chasedetail.json',
        data: datas
      });
    },
    placeOrderXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/chasemng/chasetobet.json',
        data: data
      });
    },
    awardXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/betmng/betprize.json',
        data: data
      });
    },
    //在页面被渲染出来的时候自动调用
    onRender: function () {
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      var self = this;
      this.$btnSumbit = self.$('.js-bc-btn-submit');
      this.$formContainer = this.$('.js-bc-form');
      var params = {tradeNo:this.options.tradeNo};
      this.betNumMaxLength = 20;

      this.getXxxXhr(params).always(function () {
      })
        .fail(function (params) {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            self.$('.js-bc-ticketChaseId').val(res.root.chaseFormId)
            self.$('.js-bc-ticketName').text(res.root.ticketName);
            self.$('.js-bc-userName').text(res.root.username);
            self.$('.js-bc-beginPlanId').text(res.root.chaseStart);
            self.$('.js-bc-chaseTime').text(_(res.root.chaseTime).toTime());
            self.$('.js-bc-tradeNo').text(res.root.chaseFormNo);
            self.$('.js-bc-prizeStop').text(res.root.suspend == true ? '是':'否');
            self.$('.js-bc-planIdDetail').text(res.root.chasePeriods+"/"+res.root.chaseAllPeriods);
            self.$('.js-bc-chaseAllMoney').text('￥'+_(res.root.chaseAllAmount).fixedConvert2yuan());
            self.$('.js-bc-chaseedAllMoney').text('￥'+_(res.root.chaseAmount).fixedConvert2yuan());
            self.$('.js-bc-allPrize').text('￥'+_(res.root.money).convert2yuan());

            self.$('.js-BC-viewAccountDetail').html("<a class='js-BC-accountDetail'>查看全部明细</a>");

            var playDetail = _.find(res.root.chaseTicketPlanDetail, function(playDetail){
              return playDetail.canCancel == true;
            });

            if(typeof(playDetail) == 'object'){
              self.$('.js-bc-btn-cancelChase').removeClass('hidden');
            }
            self.is11xuan5 = self.is11X5(res.root.ticketName);

            self._getPlayDetailTable(self._formatPlayDetailData(res.root.chaseTicketPlayDetail), 'js-bc-chasePlayDetailGrid');

            self._getChasePlanDetailTable(self._formatChasePlanDetailData(res.root.chaseTicketPlanDetail,res.root.chaseFormId), 'js-bc-chasePlanDetailGrid');

            self._getAccountDetailTable(self._formatAccountDetailData(res.root.balanceDetail), 'js-bc-chaseAccountDetailGrid');

          } else {
            Global.ui.notification.show('订单详情获取失败');
          }
        });
    },

    is11X5: function(ticketName){
      return ticketName.indexOf('11选5')!==-1;
    },

    //获取注单玩法表格
    _getPlayDetailTable: function (tableInfo, classValue) {
      var self = this;
      this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '玩法群', name: 'ticketLevelName',  width: 100},
          {label: '玩法', name: 'ticketPlayName', width: 150},
          {label: '投注号码', name: 'betNums', width: 100,formatter: function(val, thisRow) {
            var html = self.is11xuan5 ? val : val.replace(/ /g,'');
            //if(thisRow.rx){
            //  html = '<a class="js-BC-betDetail-optional-betNum btn-link btn-link-cool" data-id="'+thisRow.ticketBetPlayId+'" data-loading-text="处理中">详细号码</a>';
            //}else
            if(html.length> self.betNumMaxLength){
              html  = '<a class="js-bc-bd-betNumDetail btn-link text-passion">详细号码</a>';
            }
            return  '<div style=" word-break: break-word">'+html  + '</div>';
          }},
          {label: '注数', name: 'betNum', width: 100},
          {label: '奖金模式', name: 'moneyMethod', width: 100},
          {label: '投注模式', name: 'betMethod', width: 100}
        ],
        row: tableInfo
      });

      var no = 0;
      _(tableInfo).each(function(item){
        item.betNums = self.is11xuan5 ? item.betNums : item.betNums.replace(/ /g,'');
        if(item.betNums.length>self.betNumMaxLength ){
          $(self.$('.js-bc-bd-betNumDetail')[no++]).popover({
            title: '详细号码',
            trigger: 'click',
            html: true,
            container: this.$el,
            content: '<div class="js-pf-popover"><span class="word-break">'+ item.betNums +'</span></div>',
            placement: 'right'
          });
        }
      },this);

    },

    //格式化注单玩法数据
    _formatPlayDetailData: function (playDetails) {
      return _(playDetails).chain().map(function (playDetail) {
        //var betNums;
        //if(playDetail.betNums.length < this.betNumMaxLength){
        //  betNums = playDetail.betNums;
        //}else{
        //  betNums = '<a class="js-bc-bd-betNumDetail btn-link text-passion" >详细号码</a>';//data-toggle="tooltip"  title="'+playDetail.betNums+'"
        //}

        var betMethod;
        if(playDetail.betMethod == 1){
          betMethod = _(playDetail.singleMoney).convert2yuan({clear: true})+"/"+_(playDetail.userRebate).formatDiv(10,{fixed:1})+"%";
        }else if(playDetail.betMethod == 0){
          betMethod = _(playDetail.singleMoney).convert2yuan({clear: true})+"/0.0%";
        }
        return {
          'ticketLevelName':playDetail.ticketLevelName,
          'ticketPlayName':playDetail.ticketGroupName+playDetail.ticketPlayName,
          'betNums':playDetail.betNums, //投注号码
          'betNum':playDetail.betNum,// 注数
          'moneyMethod':betMethod,
          'betMethod': playDetail.moneyMethod === 10000 ? '元' : playDetail.moneyMethod === 1000 ? '角' : playDetail.moneyMethod === 100 ?  '分' : '厘',
          'rx': playDetail.rx,
          'ticketBetPlayId':  playDetail.ticketBetPlayId
        };
      }).flatten().value();
    },


    //追号奖期表格
    _getChasePlanDetailTable: function (tableInfo, classValue) {

      if(!this.chasePlanlGrid){
        this.chasePlanlGrid = this.$('.' + classValue).staticGrid({
          colModel: [
            {label: '奖期', name: 'ticketPlanId',  width: 100},
            {label: '开奖号码', name: 'ticketResult', width: 150},
            {label: '倍数', name: 'betMultiple', width: 100},
            {label: '投注金额', name: 'amount', width: 100},
            {label: '状态', name: 'betStatus', width: 100},
            {label: '操作', name: 'operation', width: 100},
          ],
          row: tableInfo
        }).staticGrid('instance');
      }
      this.chasePlanlGrid.renderRow(tableInfo);

    },

    //格式化追号奖期数据
    _formatChasePlanDetailData: function (planDetails,chaseFormId) {

      return _(planDetails).chain().map(function (planDetail) {

        var ticketBetStatus;


      if(planDetail.planStatus==4){
          ticketBetStatus = '未开始';
        }else if(planDetail.planStatus==2){
          ticketBetStatus = '<a class="js-bc-sysCancelBet" id="jsBCSysCancelBet'+planDetail.chasePlanId+'">用户撤单</a>';
        }else  if(planDetail.planStatus==3){
          ticketBetStatus = '<a class="js-bc-sysCancelBet" id="jsBCSysCancelBet'+planDetail.chasePlanId+'">系统撤单</a>';
        }else if(planDetail.hasException) {
            ticketBetStatus = '等待开奖';
        }else  if(planDetail.money != 0){
          ticketBetStatus =  '￥'+_(planDetail.money).formatDiv(10000);
        }else if(planDetail.ticketResult == null){
          if(planDetail.ticketOpenStatus>0){
            ticketBetStatus = '未中奖';
          }else {
            ticketBetStatus = '等待开奖';
          }
        }else{
          ticketBetStatus = '未中奖';
        }
        var operationHtml = '';
        var operationHtml_place = '<a class="js-BC-cd-placeOrder" data-chase-form-id="'+ chaseFormId +'"  data-chase-plan-id="'+planDetail.chasePlanId+'">下单</a>';
        var operationHtml_award = '<a class="js-BC-cd-award" data-trade-id="'+ planDetail.tradeId +'" >派奖</a>';

        if(planDetail.tradeId != null){
          if(planDetail.canCancel == true){
            operationHtml = '<a class="js-BC-canceLChasePlan" id="jsBCCanceLChasePlan'+planDetail.chasePlanId+'">撤单</a><input type="hidden" value="'+planDetail.ticketPlanId+'">';
          }else{
            operationHtml = '<a class="js-BC-betDetail">查看</a><input type="hidden" value="'+planDetail.tradeId+'">';
          }
          operationHtml = operationHtml +'&nbsp;&nbsp;'+ operationHtml_award;//TODO 有交易号，则可以派奖?
        }else{
          if(planDetail.canCancel == true) {
            operationHtml = '<a class="js-BC-canceLChasePlan" id="jsBCCanceLChasePlan' + planDetail.chasePlanId + '">撤单</a><input type="hidden" value="' + planDetail.ticketPlanId + '">';
          }
          operationHtml = operationHtml +'&nbsp;&nbsp;'+ operationHtml_place;//TODO 没有交易号，则可以显示下单?
        }

        return {
          'ticketPlanId':planDetail.ticketPlanId,
          'ticketResult':planDetail.ticketResult,
          'betMultiple':planDetail.betMultiple,
          'amount':'￥'+_(planDetail.amount).fixedConvert2yuan(),
          'betStatus':ticketBetStatus,
          'operation':operationHtml
        };
      }).flatten().value();
    },

    //获取帐变明细表格
    _getAccountDetailTable: function (tableInfo, classValue) {

      if(!this.accountDetailGrid){
        this.accountDetailGrid = this.$('.' + classValue).staticGrid({
          colModel: [
            {label: '交易流水号', name: 'tradeNo',  width: 100},
            {label: '用户名', name: 'username', width: 150},
            {label: '交易时间', name: 'balanceTime', width: 100},
            {label: '交易类型', name: 'balanceType', width: 100},
            {label: '收入', name: 'income', width: 100},
            {label: '支出', name: 'cost', width: 100},
            {label: '账户余额', name: 'balance', width: 100},
            {label: '备注', name: 'remark', width: 100},
          ],
          row: tableInfo
        }).staticGrid('instance');
      }
      this.accountDetailGrid.renderRow(tableInfo);

    },

    //格式化帐变明细数据
    _formatAccountDetailData: function (accountDetails) {
      return _(accountDetails).chain().map(function (accountDetail) {
        return {
          'tradeNo':accountDetail.tradeNo,
          'username':accountDetail.username,
          'balanceTime':_(accountDetail.balanceTime).toTime(),
          'balanceType':accountDetail.balanceType,
          'income':(accountDetail.amount >= 0?'￥'+_(accountDetail.amount).formatDiv(10000,{fixed:0}):'') ,
          'cost':(accountDetail.amount < 0?'￥'+_(Math.abs(Number(accountDetail.amount))).convert2yuan():''),
          'balance':'￥'+_(accountDetail.balance).convert2yuan(),
          'remark':accountDetail.remark
        };
      }).flatten().value();

    },

    // 撤销全部追号、单期撤单
    cancelChaseHandler:function(e){
      var self = this;
      var $target = $(e.currentTarget);
      var $dialog = Global.ui.dialog.show(
        {
          title: '提示',
          body: '<div class="panel padding-md js-bc-chaseRecordCancelChase-container"></div>',
        }
      );

      var $cancelChaseContainer = $dialog.find('.js-bc-chaseRecordCancelChase-container');

      var ticketPlanId = '';
      var chasePlanId = ''
      if($target.text() == '撤单'){
        chasePlanId = $target.attr('id').substring(19,$target.attr('id').length);
        ticketPlanId = $target.next().val();
      }
      var cancelChaseView = new CancelChaseView({tradeNo:self.$('.js-bc-tradeNo').text(),ticketPlanId:ticketPlanId});
      $cancelChaseContainer.html(cancelChaseView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });

      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-bc-btn-submit', function () {
          var remark = $dialog.find('.js-bc-remark').val();
          var data = {
            ticketChaseId:self.$('.js-bc-ticketChaseId').val(),
            chasePlanId: chasePlanId,
            remark: remark
          };
          cancelChaseView.cancelChase(data)
            .fail(function () {
            })
            .done(function (res) {
              if (res.result === 0) {
                $dialog.modal('hide');
                self.onRender();//刷新页面
              } else {
                cancelChaseView.insertNotice('操作失败,' + res.msg);
              }
            });
        });
    },

    // 系统撤单原因
    getSysCancelBetReason: function (datas) {

      return Global.sync.ajax({
        url: '/intra/chasemng/chasecanceldetail.json',
        data: datas
      });
    },

    // 系统撤单详情
    sysCancelBetHandler: function(e) {

      var $target = $(e.currentTarget);
      var reqParams = {chasePlanId:$target.attr('id').substring(16,$target.attr('id').length)};
      this.getSysCancelBetReason(reqParams).always(function () {
      })
        .fail(function () {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            var html = '<strong>'+_(res.root.operateTime).toTime()+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+res.root.operatorName+'</strong><br>';
            html += '<div class="panel panel-default no-m-bottom "><div class="panel-body  no-m-bottom "><p>'+res.root.remark+'</p></div></div>';
            var $dialog = Global.ui.dialog.show(
              {
                title:  '系统撤单原因',
                body: '<div>'+html+'</div>',
                footer: ''
              }
            );

            $dialog.on('hidden.bs.modal', function () {
              $(this).remove();
            });
          } else {
            Global.ui.notification.show('彩种接口设置获取失败');
          }
        });
    },

    //跳转至追号详情
    viewBetDetail: function (e) {
      var ticketTradeNo = $(e.currentTarget).next().val();
      Global.appRouter.navigate(_('#bc/br/detail/'+ticketTradeNo).addHrefArgs({
        _t:_.now()
      }), {trigger: true});
    },

    // 跳转至账变明细
    viewAccountDetail:function (e) {
      Global.appRouter.navigate(_('#fc/ad').addHrefArgs({
        _t:_.now()
      }), {trigger: true});
    },
    showBettingDetailOfOptionalHandler: function (e) {
      var $target = $(e.currentTarget);
      var ticketBetPlayId = $target.data('id');
      var chaseView;
      var $dialog = Global.ui.dialog.show({
        title: '详细号码',
        size: 'modal-lg',
        body: '<div class="js-BC-optionalBetDetail-container"></div>',
        bodyClass: 'no-padding',
        footer: ''
      });

      var $chaseContainer = $dialog.find('.js-BC-optionalBetDetail-container');

      $dialog.on('hidden.modal', function() {
        $(this).remove();
        chaseView.destroy();
      });

      chaseView = new OptionalBettingDetailView({
        el: $chaseContainer,
        ticketBetPlayId:ticketBetPlayId
      }).render();

    },
    placeOrderHandler: function(e){
      var self = this;
      var $target = $(e.currentTarget);
      var chaseFormId = $target.data('chaseFormId');
      var chasePlanId = $target.data('chasePlanId');
      var data = {
        ticketChaseId: chaseFormId,
        chasePlanId: chasePlanId
      };
      $(document).confirm({
        content: '<div class="text-center">确认下单？</div>',
        agreeCallback: function () {
          self.placeOrder(data);
        }
      });
    },
    placeOrder: function(data){
      this.placeOrderXhr(data).done(function(res){
        if(res.result ===0){
          Global.ui.notification.show('下单完成！');
        }else{
          Global.ui.notification.show('下单失败！');
        }
      });
    },
    awardHandler: function(e){
      var self = this;
      var $target = $(e.currentTarget);
      var tradeId = $target.data('tradeId');
      var data = {
        tradeNo: tradeId
      };
      $(document).confirm({
        content: '<div class="text-center">确认派奖？</div>',
        agreeCallback: function () {
          self.award(data);
        }
      });
    },
    award: function(data){
      this.awardXhr(data).done(function(res){
        if(res.result ===0){
          Global.ui.notification.show('派奖完成！');
        }else{
          Global.ui.notification.show('派奖失败！');
        }
      });

    }

  });

  module.exports = BettingRecordDetailView;
});
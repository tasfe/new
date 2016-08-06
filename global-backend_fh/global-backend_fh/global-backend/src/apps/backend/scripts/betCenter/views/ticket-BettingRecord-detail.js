/**
 * Created by David Zhang on 2015/9/16.
 */
define(function (require, exports, module) {

  var CancelBetView = require('betCenter/views/ticket-BettingRecord-detail-cancelBet');

  var OptionalBettingDetailView = require('betCenter/views/ticket-BettingRecord-optional-detail');

  var BettingRecordDetailView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/ticket-BettingRecord-detail.html'),

    //所有的事件绑定全部写在这！
    events: {
      'click .js-bc-btn-cancelBet': 'cancelBetHandler',
      'click .js-BC-chaseDetail':'viewChaseDetail',
      'click .js-BC-accountDetail':'viewAccountDetail',
      'click .js-BC-betDetail-optional-betNum': 'showBettingDetailOfOptionalHandler',
      'click .js-bc-btn-award': 'awardHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    getXxxXhr: function (datas) {

      return Global.sync.ajax({
        url: '/intra/betmng/betdetail.json',
        data: datas
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
      this.betNumMaxLength = 20;
      this.$formContainer = this.$('.js-bc-form');
      var params = {tradeNo:this.options.ticketTradeNo};

      this.getXxxXhr(params).always(function () {
      })
        .fail(function (params) {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            self.$('.js-bc-ticketBetId').val(res.root.ticketBetId);
            self.$('.js-bc-ticketName').text(res.root.ticketName);
            self.$('.js-bc-userName').text(res.root.username);
            self.$('.js-bc-tradeNo').text(res.root.ticketBetNo);
            if(res.root.ticketPlanId==='mmc'){
              self.$('.js-bc-planId').text('/');
            }else{
              self.$('.js-bc-planId').text(res.root.ticketPlanId);
            }
            self.$('.js-bc-betTime').text(_(res.root.betTime).toTime());
            self.$('.js-bc-betAllMoney').text('￥'+_(res.root.betAllMoney).fixedConvert2yuan());
            self.$('.js-bc-allPrize').text('￥'+_(res.root.money).convert2yuan());
            if(res.root.ticketChaseId != null){
              self.$('.js-bc-ticketChaseId-container').removeClass('hidden');
              self.$('.js-bc-ticketChaseId-container').html("<a  class='js-BC-chaseDetail paddingTB-sm' data-chaseno='"+res.root.ticketChaseNo+"'>相关追号记录</a>");
            }

            if(!res.root.canCancel){
              self.$('.js-bc-btn-cancelBet').addClass('hidden');
            }
            if(res.root.money===0){
              self.$('.js-bc-btn-award').removeClass('hidden');
              self.$('.js-bc-btn-award').data('tradeId',res.root.ticketBetNo)
            }

            self.$('.js-BC-viewAccountDetail').html("<a class='js-BC-accountDetail'>查看全部明细</a>");

            if(res.root.openNum != null){
              var openNumArr = res.root.openNum.split(',');
              var openNumHtml = '';
              _.map(_.range(openNumArr.length), function(num){
                openNumHtml = openNumHtml + '<span class="text-circle m-right-sm text-circle-main text-circle-sm js-bc-openNum">'+openNumArr[num]+'</span>'
              });
              self.$('.js-bc-openNum-label').after(openNumHtml);
            }
            self.is11xuan5 = self.is11X5(res.root.ticketName);

            self._getPlayDetailTable(self._formatPlayDetailData(res.root.betTicketPlayDetail,res.root.openNum,res.root.ticketBetStatus,res.root.hasException,res.root.ticketOpenStatus), 'js-bc-betPlayDetailGrid');

            self._getAccountDetailTable(self._formatAccountDetailData(res.root.balanceDetail), 'js-bc-betAccountDetailGrid');

          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
    },

    is11X5: function(ticketName){
      return ticketName.indexOf('11选5')!==-1;
    },

    //获取注单玩法表格
    _getPlayDetailTable: function (tableInfo, classValue) {
      var self = this;
      if (!this.detailGrid) {
        this.detailGrid = this.$('.' + classValue).staticGrid({
          colModel: [
            {label: '玩法群', name: 'ticketLevelName',  width: 100},
            {label: '玩法', name: 'ticketPlayName', width: 150},
            {label: '投注号码', name: 'betNums', width: 100,formatter: function(val,item) {
              var html =  self.is11xuan5 ? val : val.replace(/ /g,'');
              if(item.rx){
                html = '<a class="js-BC-betDetail-optional-betNum btn-link btn-link-cool" data-id="'+item.ticketBetPlayId+'" data-loading-text="处理中" data-opennum="'+item.openNum+'">详细号码</a>';
              }else if(html.length> self.betNumMaxLength){
                html  = '<a class="js-bc-bd-betNumDetail btn-link text-passion" >详细号码</a>';
              }
              return '<div style=" word-break: break-word">'+  html +'</div>';
            }},
            {label: '注数', name: 'betNum', width: 100},
            {label: '倍数', name: 'betMultiple', width: 100},
            {label: '投注金额', name: 'betMoney', width: 100},
            {label: '奖金模式', name: 'moneyMethod', width: 100},
            {label: '投注模式', name: 'betMethod', width: 100},
            {label: '状态', name: 'betStatus', width: 100}
          ]
        }).staticGrid('instance');
      }

      this.detailGrid.renderRow(tableInfo);
      var no = 0;
      _(tableInfo).each(function(item){
        item.betNums =  self.is11xuan5 ? item.betNums : item.betNums.replace(/ /g,'');
        if(item.betNums.length>self.betNumMaxLength  && !item.rx){
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
    _formatPlayDetailData: function (playDetails,openNum,betStatus,hasException,ticketOpenStatus) {
      return _(playDetails).chain().map(function (playDetail) {
        var ticketBetStatus;
        if(betStatus==2){
          ticketBetStatus = '用户撤单';
        }else if(betStatus==3){
          ticketBetStatus = '系统撤单';
        }else if (hasException) {
            ticketBetStatus = '等待开奖';
        }else if(playDetail.money != 0){
          ticketBetStatus = '￥'+_(playDetail.money).formatDiv(10000);
        }else if(openNum == null){
          if(ticketOpenStatus>0){
            ticketBetStatus = '未中奖';
          }else {
            ticketBetStatus = '等待开奖';
          }
        }else{
          ticketBetStatus = '未中奖';
        }

        var betMethod;
        if(playDetail.betMethod == 1){
          if(playDetail.ticketLevelName.indexOf('超级3000') != -1){
            betMethod = _(playDetail.minSingleMoney).convert2yuan()+"/"+_(playDetail.singleMoney).convert2yuan()+"-"+_(playDetail.userRebate).formatDiv(10,{fixed:1})+"%";
          }else{
            betMethod = _(playDetail.singleMoney).convert2yuan()+"/"+_(playDetail.userRebate).formatDiv(10,{fixed:1})+"%";
          }
        }else if(playDetail.betMethod == 0){
          if(playDetail.ticketLevelName.indexOf('超级3000') != -1){
            betMethod = _(playDetail.minSingleMoney).convert2yuan()+"/"+_(playDetail.singleMoney).convert2yuan()+"-0.0%";
          }else{
            betMethod = _(playDetail.singleMoney).convert2yuan()+"/0.0%";
          }
        }

        //var betNums;
        //if(playDetail.betNums.length < this.betNumMaxLength){
        //  betNums = playDetail.betNums;
        //}else{
        //  betNums = '<a class="js-bc-bd-betNumDetail btn-link text-passion" >详细号码</a>';// data-toggle="tooltip"  title="'+playDetail.betNums+'"
        //}

        return {
          'ticketLevelName':playDetail.ticketLevelName,
          'ticketPlayName':playDetail.ticketGroupName+playDetail.ticketPlayName,
          'betNum':playDetail.betNum,// 注数
          'betNums':playDetail.betNums, // 投注号码
          'betMultiple':''+playDetail.betMultiple, // 倍数
          'betMoney':'￥'+_(playDetail.betMoney).fixedConvert2yuan(),
          'moneyMethod':betMethod,
          'betMethod': playDetail.moneyMethod === 10000 ? '元' : playDetail.moneyMethod === 1000 ? '角' : playDetail.moneyMethod === 100 ?  '分' : '厘',
          'betStatus':ticketBetStatus,
          'openNum': openNum,
          'rx': playDetail.rx,
          'ticketBetPlayId':  playDetail.ticketBetPlayId
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
          'income':(accountDetail.amount >= 0?'￥'+_(accountDetail.amount).convert2yuan():'') ,
          'cost':(accountDetail.amount < 0?'￥'+_(Math.abs(Number(accountDetail.amount))).convert2yuan():''),
          'balance':'￥'+_(accountDetail.balance).convert2yuan(),
          'remark':accountDetail.remark
        };
      }).flatten().value();
    },

    // 撤单
    cancelBetHandler:function(e){
      var self = this;
      var $dialog = Global.ui.dialog.show(
        {
          title: '提示',
          body: '<div class="panel padding-md js-bc-betRecordCancelBet-container"></div>',
        }
      );

      var $cancelBetContainer = $dialog.find('.js-bc-betRecordCancelBet-container');

      var cancelBetView = new CancelBetView({tradeNo:self.$('.js-bc-tradeNo').text()});
      $cancelBetContainer.html(cancelBetView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
        cancelBetView.destroy();
      });

      $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-bc-btn-submit', function () {
          var remark = $dialog.find('.js-bc-remark').val();
          var data = {
            ticketBetId:self.$('.js-bc-ticketBetId').val(),
            remark: remark
          };

          cancelBetView.cancelBet(data)
            .fail(function () {
            })
            .done(function (res) {
              if (res.result === 0) {
                $dialog.modal('hide');
                self.onRender();//刷新页面
                Global.ui.notification.show('操作成功。');
              } else {
                cancelBetView.insertNotice('操作失败,' + res.msg);
              }
            });

        });
    },

    //跳转至追号详情
    viewChaseDetail: function (e) {
      var chaseNo = $(e.currentTarget).data('chaseno');
      Global.appRouter.navigate(_('#bc/cr/detail/'+chaseNo).addHrefArgs({
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
      var openNum = $target.data('opennum');
      var $dialog = Global.ui.dialog.show({
        title: '详细号码',
        size: 'modal-lg',
        body: '<div class="js-bc-optionalBetDetail-container"></div>',
        bodyClass: 'no-padding',
        footer: ''
      });

      var $chaseContainer = $dialog.find('.js-bc-optionalBetDetail-container');

      $dialog.on('hidden.modal', function() {
        $(this).remove();
        chaseView.destroy();
      });

      chaseView = new OptionalBettingDetailView({
        el: $chaseContainer,
        ticketBetPlayId:ticketBetPlayId,
        openNum:openNum
      }).render();

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
"use strict";

require('./index.scss');

var OptionalBettingDetailView = require('userCenter/views/optionalBettingDetail');

var BettingDetailView = Base.ItemView.extend({

  template: require('./index.html'),

  startOnLoading: true,

  events: {
    'click .js-uc-bdCancelBetting': 'cancelBettingHandler',
    'click .js-uc-betDetail-optional-betNum': 'showBettingDetailOfOptionalHandler',
    'click .js-pa-play-detail': 'closePopoverHandler'
  },

  className: 'js-main-bettingDetail main-bettingDetail',

  getBetDetailXhr: function(data) {
    return Global.sync.ajax({
      url: '/ticket/bet/detail.json',
      data: data
    });
  },

  cancelBettingXhr: function(data){
    return Global.sync.ajax({
      url: '/ticket/bet/cancel.json',
      data: data
    });
  },

  confirmCancelBetting: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    $target.button('loading');
    var data = {betId:this.$('#jsTicketBetId').val()};
    this.cancelBettingXhr(data)
      .always(function(){
        $target.button('reset');
      })
      .done(function(res) {
        if(res.result === 0){
          Global.ui.notification.show("取消投注成功", {
            type: 'success'
          });
          self.render();
        } else {
          if(res.msg.indexOf('fail')!==-1){
            Global.ui.notification.show("取消投注失败!");
          }else{
            Global.ui.notification.show("取消投注失败：" + res.msg);
          }
          self.render();
        }
      });
  },

  initialize: function() {
    _(this.options).defaults({
      detailPrevUrl: '#gr/tr/detail/'
    });
  },

  onRender: function() {
    var self = this;
    this.maxLength = 20;
    this.getBetDetailXhr({
      userId: this.options.userId,
      tradeNo: this.options.tradeNo
    }).always(function(){
      self.loadingFinish();
    })
      .done(function(res) {
        var data;
        if (res && res.result === 0) {
          data = res.root || {};
          //self.isSelf = !(!_(self.options.userId).isUndefined() && (Global.memoryCache.get('acctInfo').userId + '' !== self.options.userId+'')) ;
          self.isSelf = !(!_(self.options.username).isUndefined() && (Global.memoryCache.get('acctInfo').username + '' !== self.options.username+'')) ;
          self.is11xuan5 = self.is11X5(data.ticketName);
          self.renderBetInfo(data);
          self.renderBetGrid(data.chaseTicketPlayDetail, data);

        } else {
          Global.ui.notification.show('操作失败。');
        }
      });
  },

  is11X5: function(ticketName){
    return ticketName.indexOf('11选5') !== -1;
  },


  renderBetInfo: function(betInfo) {
    this.$('#jsPaTicketName').html(betInfo.ticketName);
    if(betInfo.ticketPlanId==='mmc'){
      this.$('#jsPaTicketPlanId').html('/');
    }else{
      this.$('#jsPaTicketPlanId').html(betInfo.ticketPlanId);
    }
    this.$('#jsPaBetTime').html(_(betInfo.betTime).toTime());
    this.$('#jsPaTicketBetNo').html(betInfo.ticketBetNo);
    this.$('#jsPaBetAllMoney').html(_(betInfo.betAllMoney).fixedConvert2yuan());
    this.$('#jsPaMoney').html(_(betInfo.money).convert2yuan());

    if (betInfo.ticketChaseNo) {
      this.$('.js-pa-link-track').attr('href', this.options.detailPrevUrl + betInfo.ticketChaseNo + _.getUrlParamStr()).removeClass('hidden');
    }

    var openNum = betInfo.openNum ? betInfo.openNum : '等,待,开,奖';

    this.$('#jsPaOpenNum').html(_(openNum.split(',')).map(function(openNum) {
      return '<span class="text-circle m-right-xs">' + openNum + '</span>';
    }).join(''));

    if(betInfo.canCancel && this.isSelf){
      this.$('.js-uc-bdCancelBetting-container').removeClass('hidden');
    }
    this.$('#jsTicketBetId').val(betInfo.ticketBetId);

    var selfName = Global.memoryCache.get('acctInfo').username;

    if(!_(selfName).isUndefined() && !_(betInfo.username).isUndefined() && selfName!==betInfo.username){
      this.$('.js-bd-title').html('查看' + betInfo.username + '的投注详情');
    }

  },



  renderBetGrid: function(row, data) {
    var self = this;
    this.$('.js-pa-play-detail').staticGrid({
      tableClass: 'table table-bordered table-center',
      height: 280,
      colModel: [
        {label: '玩法群', name: 'ticketLevelName', width: '10%'},
        {label: '玩法', name: 'ticketPlayName', width: '10%'},
        {label: '投注号码', name: 'betNums', width: '15%', formatter: function(val, index, thisRow) {
          var html =  self.is11xuan5 ? val : val.replace(/ /g,'');
          if(thisRow.rx){
            html  = '<a class="js-uc-betDetail-optional-betNum btn-link btn-link-hot" data-id="'+thisRow.ticketBetPlayId+'" data-loading-text="处理中">详细号码</a>';
          }else if(html.length>self.maxLength ){
            html  = '<a class="js-uc-betDetail-betNum btn-link btn-link-hot">详细号码</a>';
          }
          return html;
        }},
        {label: '注数', name: 'betNum', width: '8%'},
        {label: '倍数', name: 'betMultiple', width: '8%'},
        {label: '投注金额', name: 'betMoney', width: '10%', formatter: function(val) {
          return '<span class="text-hot">' + _(val).fixedConvert2yuan() + '</span>';
        }},
        //{label: '奖金模式', name: 'singleMoney', width: '14%', formatter: function(val, index, info) {
        //  var cell = _(val).chain().div(10000).mul(info.moneyMethod).convert2yuan().value();
        //
        //  if (info.betMethod === 0) {
        //    cell = +cell + '/0.0%';
        //  } else {
        //    cell = +cell + '/' + _(info.userRebate).formatDiv(10) + '%';
        //  }
        //
        //  return cell;
        //}},
        {label: '投注模式', name: 'moneyMethod', width: '10%', formatter: function(val) {
          return val === 10000 ? '元' : val === 1000 ? '角' : val === 100 ?  '分' : '厘';
        }},
        {label: '中奖金额', name: 'money', width: '10%', formatter: function(val, index, thisRow) {
          return _.checkBettingStatus({
            betStatus: data.ticketBetStatus,
            hasException: data.hasException,
            openNumbers: data.openNum,
            openStatus: data.ticketOpenStatus,
            prizing: data.prizing,
            prizeTotalMoney: val,
            prizeClass: 'text-hot'
          });
        }}
      ],
      row: row
    });
    var no = 0;
    _(row).each(function(item){
      item.betNums =  self.is11xuan5 ? item.betNums : item.betNums.replace(/ /g,'');
      if(item.betNums.length>self.maxLength && !item.rx){
        $(self.$('.js-uc-betDetail-betNum')[no++]).popover({
          title: '详细号码',
          trigger: 'manual',
          html: true,
          container: self.$el,
          content: '<div class="js-pf-popover"><span class="word-break">'+ item.betNums +'</span></div>',
          placement: 'right'
        }).on("click", function (e) {
          var _this = this;
          $(this).popover("toggle");
          e.stopPropagation();
        });
      }
    }, this);
  },

  cancelBettingHandler: function(e){
    var self = this;
    var html = '<div class="text-center"><p><span class="circle-icon"><i class="fa fa-commenting"></i></span></p><p class="font-md">请问您是否需要进行撤单处理？</p></div>';
    $(document).confirm({
      content: html,
      agreeCallback: function() {
        self.confirmCancelBetting(e);
      }
    });
  },
  showBettingDetailOfOptionalHandler: function (e) {
    var $target = $(e.currentTarget);
    var ticketBetPlayId = $target.data('id');
    var chaseView;
    var $dialog = Global.ui.dialog.show({
      title: '详细号码',
      size: 'modal-lg',
      body: '<div class="js-ac-betDetail-container"></div>',
      bodyClass: 'no-padding',
      footer: '',
      backdrop: true
    });

    var $chaseContainer = $dialog.find('.js-ac-betDetail-container');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      chaseView.destroy();
    });

    chaseView = new OptionalBettingDetailView({
      el: $chaseContainer,
      ticketBetPlayId: ticketBetPlayId
    }).render();

  },
  closePopoverHandler: function(e){
    var $popover = this.$('.js-uc-betDetail-betNum');
    if($popover.data('popover')){
      $popover.popover('hide');
    }
  }
});

module.exports = BettingDetailView;

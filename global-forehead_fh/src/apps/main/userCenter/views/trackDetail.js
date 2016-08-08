"use strict";

var OptionalBettingDetailView = require('userCenter/views/optionalBettingDetail');

var TrackDetailView = Base.ItemView.extend({

  template: require('userCenter/templates/trackDetail.html'),

  startOnLoading: true,

  className: 'uc-trackDetail-view',

  events: {
    'click .js-uc-td-cancelAllTrack':'cancelAllBettingHandler',
    'click .js-uc-td-cancel': 'cancelBettingHandler',
    'click .js-uc-betDetail-optional-betNum': 'showBettingDetailOfOptionalHandler'
  },

  getBetDetailXhr: function(data) {
    return Global.sync.ajax({
      url: '/ticket/chase/detail.json',
      data: data
    });
  },

  initialize: function () {
    _(this.options).defaults({
      detailPrevUrl: '#uc/br/detail/'
    });
  },

  cancelTrackXhl: function(data){
    return Global.sync.ajax({
      url: '/ticket/chase/cancel.json',
      data: data
    });
  },

  confirmCancelAllTrack: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    $target.button('loading');
    var data = {chaseId : this.$('#jsPaChaseFormId').val()};
    this.cancelTrackXhl(data).always(function(){
      $target.button('reset');
    })
      .done(function(res){
      if(res.result===0){
        Global.ui.notification.show("终止追号成功", {
          type: 'success'
        });
        self.render();
      }else{
        if(res.msg.indexOf('fail')!==-1){
          Global.ui.notification.show("终止追号失败!");
        }else{
          Global.ui.notification.show("终止追号失败：" + res.msg);
        }
      }
    });
  },
  cancelAllBettingHandler: function(e){
    var self = this;
    var html = '<p>确定终止追号？</p>';
    $(document).confirm({
      content: html,
      agreeCallback: function() {
        self.confirmCancelAllTrack(e);
      }
    });

  },

  confirmCancelTrack: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    $target.button('loading');
    var chasePlanId = $target.data('chaseplanid');
    var data = {chasePlanId : chasePlanId , chaseId : this.$('#jsPaChaseFormId').val()};
    this.cancelTrackXhl(data).always(function(){
      $target.button('reset');
    })
      .done(function(res){
      if(res.result===0){
        Global.ui.notification.show("撤销追号成功", {
          type: 'success'
        });
        self.render();
      }else{
        if(res.msg.indexOf('fail')!==-1){
          Global.ui.notification.show("撤销追号失败!");
        }else{
          Global.ui.notification.show("撤销追号失败：" + res.msg);
        }
      }
    });
  },

  cancelBettingHandler: function(e){
    var self = this;
    var html = '<p>确定撤销本期追号？</p>';
    $(document).confirm({
      content: html,
      agreeCallback: function() {
        self.confirmCancelTrack(e);
      }
    });

  },

  onRender: function() {
    var self = this;
    this.maxLength = 20;

    this.getBetDetailXhr({
      userId: this.options.userId,
      chaseFormId: this.options.chaseFormId,
      tradeNo: this.options.tradeNo
    }).always(function(){
      self.loadingFinish();
    })
      .done(function(res) {
        var data;
        if (res && res.result === 0) {
          data = res.root || {};
          self.isSelf = !(!_(self.options.userId).isUndefined() && (Global.memoryCache.get('acctInfo').userId + '' !== self.options.userId+'')) ;
          self.is11xuan5 = self.is11X5(data.ticketName);
          self.renderHeadInfo(data);
          self.renderPlayGrid(data.chaseTicketPlayDetail);
          self.renderPlanGrid(data.chaseTicketPlanDetail, data);

        } else {
          Global.ui.notification.show(res.msg);
        }
      });
  },
  is11X5: function(ticketName){
    return ticketName.indexOf('11选5')!==-1;
  },

  renderHeadInfo: function(info) {
    var detail = info.chaseTicketPlayDetail[0];

    this.$('#jsPaTicketName').html(info.ticketName);
    this.$('#jsPaChaseStart').html(info.chaseStart);
    this.$('#jsPaChaseTime').html(_(info.chaseTime).toTime());
    this.$('#jsPaChaseFormNo').html(info.chaseFormNo);
    this.$('#jsPaStop').html(Number(info.suspend) ? '是' : '否');
    this.$('#jsPaPeriod').html(info.chasePeriods + '/' + info.chaseAllPeriods);
    this.$('#jsPaChaseAllAmount').html( _(info.chaseAllAmount).fixedConvert2yuan());
    this.$('#jsPaChaseAmount').html(_(info.chaseAmount).fixedConvert2yuan());
    this.$('#jsPaMoney').html(_(info.money).convert2yuan());
    this.$('#jsPaChaseFormId').val(info.chaseFormId);

    this.$('.js-pa-betting-numbers').text(this.is11xuan5 ? detail.betNums : detail.betNums.replace(/ /g,''));
  },

  renderPlayGrid: function(row) {
    var self = this;
    this.$('.js-pa-play-detail').staticGrid({
      tableClass: 'table table-bordered table-hover table-center',
      height: 75,
      colModel: [
        {label: '玩法群', name: 'ticketLevelName', width: '15%'},
        {label: '玩法', name: 'ticketPlayName', width: '15%'},
        {label: '投注号码', name: 'betNums', width: '15%', formatter: function(val, index, thisRow) {
          var html =  self.is11xuan5 ? val : val.replace(/ /g,'');
          //if(thisRow.rx){
          //  html  = '<a class="js-uc-betDetail-optional-betNum btn-link btn-link-cool" data-id="'+thisRow.ticketBetPlayId+'" data-loading-text="处理中">详细号码</a>';
          //}else
          if(html.length> self.maxLength){
            html  = '<a class="js-uc-trackDetail-betNum btn-link btn-link-cool">详细号码</a>';
          }
          return html;
        }},
        {label: '注数', name: 'betNum', width: '15%'},
        {label: '奖金模式', name: 'singleMoney', width: '15%', formatter: function(val, index, info) {
          var cell = _(val).chain().div(10000).mul(info.moneyMethod).convert2yuan().value();

          if (info.betMethod === 0) {
            cell = +cell + '/0.0%';
          } else {
            cell = +cell + '/' + _(info.userRebate).formatDiv(10) + '%';
          }

          return cell;
        }},
        {label: '投注模式', name: 'moneyMethod', width: '15%', formatter: function(val, info) {
          return val === 10000 ? '元' : val === 1000 ? '角' : val === 100 ?  '分' : '厘';
        }}
      ],
      row: row
    });
    var no = 0;
    _(row).each(function(item){
      item.betNums =  self.is11xuan5 ? item.betNums : item.betNums.replace(/ /g,'');
      if(item.betNums.length>self.maxLength ){
        $(self.$('.js-uc-trackDetail-betNum')[no++]).popover({
          title: '详细号码',
          trigger: 'click',
          html: true,
          container: this.$el,
          content: '<div class="js-pf-popover"><span class="word-break">'+  item.betNums +'</span></div>',
          placement: 'right'
        });
      }
    },this);
  },

  renderPlanGrid: function(row, data) {
    var self = this;
    this.$('.js-pa-plan-detail').staticGrid({
      tableClass: 'table table-bordered table-hover table-center',
      height: 200,
      colModel: [
        {label: '奖期', name: 'ticketPlanId', width: '15%'},
        {label: '开奖号码', name: 'ticketResult', width: '15%', formatter: function(val) {
          return val ? val.split(',') : '';
        }},
        {label: '倍数', name: 'betMultiple', width: '15%'},
        {label: '投注金额', name: 'amount', width: '15%', formatter: function(val) {
          return _(val).fixedConvert2yuan();
        }},
        {label: '状态', name: 'money', width: '15%', formatter: function(val,index,thisRow) {
          return _.checkBettingStatus({
            betStatus: thisRow.planStatus,
            hasException: thisRow.hasException,
            openNumbers: thisRow.ticketResult,
            openStatus: thisRow.ticketOpenStatus,
            prizing: thisRow.prizing,
            prizeTotalMoney: val,
            betTime: data.chaseTime,
            prizeClass: 'text-sun'
          });
        }},
        {label: '操作', name: 'betStatus', width: '15%', formatter: function(val,index,thisRow) {
          if (thisRow.canCancel && self.isSelf) {
            self.$('.js-uc-td-cancelAllTrack').removeClass('hidden');
            self.$('.js-dd-cantCancel').addClass('hidden');
            return '<a class="js-uc-td-cancel btn btn-link btn-link-cool" href="javascript:void(0)" data-chasePlanId="'+thisRow.chasePlanId+'">撤销</a>';
          } else {
            if(thisRow.tradeId){
              return '<a class="js-uc-td-view router btn btn-link btn-link-hot" href="'+ self.options.detailPrevUrl + thisRow.tradeId + _.getUrlParamStr() + '">查看</a>';
            }else{
              return '';
            }

          }
        }}
      ],
      row: row
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
      footer: ''
    });

    var $chaseContainer = $dialog.find('.js-ac-betDetail-container');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      chaseView.destroy();
    });

    chaseView = new OptionalBettingDetailView({
      el: $chaseContainer,
      ticketBetPlayId:ticketBetPlayId
    }).render();

  }
});

module.exports = TrackDetailView;

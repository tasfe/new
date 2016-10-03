"use strict";

var BettingChoiceModel = require('bettingCenter/models/bettingChoice');
var BettingInfoModel = require('bettingCenter/models/bettingInfo');
var BettingRulesCollection = require('bettingCenter/collections/bettingRules');
var PlayAreaSelectView = require('bettingCenter/views/bettingCenter-playArea-select');
var PlayAreaInputView = require('bettingCenter/views/bettingCenter-playArea-input');
var BettingChaseView = require('bettingCenter/views/bettingCenter-chase');

var RecordsOpenView = require('bettingCenter/views/bettingCenter-records-open');
var RecordsRecentView = require('bettingCenter/views/bettingCenter-records-recent');


var ticketConfig = require('skeleton/misc/ticketConfig');
var betRulesConfig = require('bettingCenter/misc/betRulesConfig');
var IDsSuper3 = require('bettingCenter/misc/super3k/IDsOfSuper3k');

var Countdown = require('com/countdown');


var BettingCenterView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter.html'),

  playLevelTpl: _.template(require('bettingCenter/templates/bettingCenter-level.html')),
  rulesTpl: _.template(require('bettingCenter/templates/bettingCenter-rules.html')),
  confirmTpl: _.template(require('bettingCenter/templates/bettingCenter-confirm.html')),

  height: 310,

  tableClass: 'table table-center',

  events: {
    'click .js-bc-video': 'openVideoHandler',
    'click .js-bc-basic-rule': 'baseRuleChangeHandler',
    'click .js-bc-play-toggle': 'togglePlayModeHandler',
    'click .js-bc-advance-rule': 'advanceRuleChangeHandler',
    'click .js-bc-monetary-unit': 'monetaryUnitChangeHandler',
    'change .js-bc-bet-mode': 'betModeChangeHandler',
    'change .js-bc-type-select':'typeChangeHandler',
    'change .js-bc-customize-money': 'syncCustomizeMoneyHandler',
    'click .js-bc-btn-lottery-add': 'lotteryAddHandler',
    'click .js-bc-lottery-clear': 'lotteryClearHandler',
    'click .js-bc-lottery-preview-del': 'lotteryPreviewDelHandler',
    'click .js-bc-chase': 'lotteryChaseHandler',
    'click .js-bc-quick-bet': 'quickBetHandler',
    'click .js-bc-btn-lottery-confirm': 'lotteryConfirmHandler',
    'click .js-bc-records-tab': 'toggleTabHandler',


    //需要重构的代码
    'click .js-cang02':'cangHandler'
  },

  getTeamOnlineXhr: function() {
    var timestamp = Date.parse(new Date());
    var now = _(timestamp).toDate();
    return Global.sync.ajax({
      url: '/info/teamreport/subuserstat.json',
      data: {
        'startTime': now,
        'endTime': now
      }
    });
  },

  serializeData: function() {
    return {
      ticketInfo: this.options.ticketInfo
    };
  },

  initialize: function() {
    this.options.ticketInfo = ticketConfig.getComplete(this.options.ticketId);

    this.model = new BettingChoiceModel();
    this.infoModel = new BettingInfoModel();
    this.rulesCollection = new BettingRulesCollection();
    this.rulesCollection.setTicketInfo(this.options.ticketInfo);

    this.rulesCollection.fetch({
      abort: false,
      localCache: true,
      cacheName: 'ticketList.' + this.options.ticketId,
      data: {
        ticketId: this.options.ticketId
      }
    });

    this.getNewPlan();

    this.model.set('ticketId', Number(this.options.ticketId));

    this.listenTo(this.infoModel, 'change:sale', this.renderSale);
    this.listenTo(this.infoModel, 'change:lastOpenId', this.renderLastPlan);

    this.listenTo(this.infoModel, 'change:leftSecond', this.updateCountdown);
    this.listenTo(this.infoModel, 'change:planId', this.renderBasicInfo);
    this.listenTo(this.infoModel, 'change:openVideoUrl', this.renderVideo);

    this.listenTo(this.rulesCollection, 'sync sync:fromCache', this.renderBasicRules);

    this.listenTo(this.model, 'change:levelId', function(model, levelId) {
      this.renderAdvanceRules(levelId);
    });

    this.listenTo(this.model, 'change:playId', function(model, playId) {
      this.renderPlayArea();
      this.renderPlayInfo(this.rulesCollection.getPlayInfo(model.get('groupId'), playId));

      this.model.set({
        statistics: 0
      });
    });

    this.listenTo(this.model, 'change:formatMaxMultiple', this.renderNumRange);
    this.listenTo(this.model, 'change:unit', this.renderPlayBetMode);
    this.listenTo(this.model, 'change:betWay', this.renderBetWay);

    this.listenTo(this.model, 'change:prefabMoney change:rebateMoney', this.renderSelectStatisticsInfo);
    this.listenTo(this.model, 'change:betWay change:prefabMoney change:rebateMoney', this.renderBettingBtns);
    this.listenTo(this.model, 'change:previewList', this.renderLotteryPreviewAdd);
    this.listenTo(this.model, 'change:previewList:del', this.renderLotteryPreviewDel);
    this.listenTo(this.model, 'change:totalInfo', this.renderTotalLotteryInfo);

    //快捷入口

    this.on('entry:show router:back', function() {
      this.recordsOpenView.update();
      this.recordsRecentView.update();
    });

    this.getTeamOnlineXhr().done(function (res) {
      var data = res && res.root || {};
      if (res && res.result === 0) {
        $('.js-julien-data11').text( '今日充值：'+(data.todayRechargeTotal/10000).toFixed(2) );
        $('.js-julien-data21').text( '今日提现：'+(data.todayWithdrawTotal/10000).toFixed(2) );
        $('.js-julien-data31').text( '今日投注：'+(data.todayBetTotal/10000).toFixed(2) );
        $('.js-julien-data41').text( '今日盈亏：'+(data.todayProfitTotal/10000).toFixed(2) );
      }
    });


  },

  getNewPlan: function() {
    this.infoModel.fetch({
      abort: false,
      type: 'post',
      data: {
        ticketId: this.options.ticketId
      }
    });
  },

  onRender: function() {

    this.$bettingRecords = this.$('.js-bc-betting-records');

    this.$countdown = this.$('.js-bc-countdown');
    this.$planId = this.$('.js-bc-planId');
    this.$planIdStop = this.$('.js-bc-planId-stop');
    this.$lastPlanId = this.$('.js-bc-last-planId');
    this.$lastResults = this.$('.js-bc-last-plan-results');
    this.$saleStop = this.$('.js-bc-sale-stop');

    this.$videoMain = this.$('.js-bc-video-main');

    //rules
    this.$rules = this.$('.js-bc-rules');
    this.$playToggle = this.$('.js-bc-play-toggle');
    this.$basicRules = this.$('.js-bc-basic-rules');
    this.$optionalRules = this.$('.js-bc-optional-rules');
    this.$superRules = this.$('.js-bc-super-rules');
    this.$advanceRules = this.$('.js-bc-advance-rules');

    //playInfo
    this.$playTip = this.$('.js-bc-play-tip');
    this.$playExample = this.$('.js-bc-play-example');
    this.$playBetMode = this.$('.js-bc-bet-mode');
    this.$playExample2 = this.$('.js-infor-tip');

    //playArea
    this.$playArea = this.$('.js-bc-play-area');

    //numRange
    this.$multiRange = this.$('.js-bc-multi-range');

    //
    this.$statisticsLottery = this.$('.js-bc-statistics-lottery');
    this.$statisticsMoney = this.$('.js-bc-statistics-money');
    this.$statisticsRebateMoney = this.$('.js-bt-statistics-rebateMoney');
    this.$statisticsBonus = this.$('.js-bc-statistics-bonus');

    //total
    this.$totalLottery = this.$('.js-bc-total-lottery');
    this.$totalMoney = this.$('.js-bc-total-money');
    this.$totalRebateMoney = this.$('.js-bc-total-rebateMoney');

    this.$recordsOpenContainer = this.$('.js-bc-records-open');

    //betting preview
    this.$lotteryPreview = this.$('.js-bc-lottery-preview');
    this.$recordsRecentContainer = this.$('.js-bc-records-recent');


    //======
    this.$btnAdd = this.$('.js-bc-btn-lottery-add');
    this.$btnConfirm = this.$('.js-bc-btn-lottery-confirm');
    this.$btnChase = this.$('.js-bc-chase');

    this.initNumRange();

    this.renderCountdown();

    this.lotteryPreview = this.$lotteryPreview.staticGrid({
      tableClass: 'table',
      colModel: [
        {label: '', name: 'no', key: true, width: '10px'},
        {label: '玩法/投注内容', name: 'title', key: true, width: '160px'},
        //{label: '奖金模式', name: 'bonusMode', width: '20%'},
        {label: '注数', name: 'mode', width: '60px'},
        {label: '投注金额', name: 'mode2', width: '20%'},
        {label: '<i class="icon-trash"></i>', name: 'mode3', width: '10%'}
        //{label: '注数/倍数/模式', name: 'mode', width: '20%'}
        //{label: '投注金额', name: 'bettingMoney', width: '17%'}
      ],
      showHeader: true,
      height: 200,
      startOnLoading: false,
      emptyTip: ''
    }).staticGrid('instance');

    this.recordsOpenView = new RecordsOpenView({
      el: this.$recordsOpenContainer,
      ticketId: this.options.ticketId
    }).render();

    this.recordsRecentView = new RecordsRecentView({
      el: this.$recordsRecentContainer,
      ticketId: this.options.ticketId
    }).render();

    var sign = Global.localCache.get('ticketList.' + this.options.ticketId);

    if (sign) {
      this.rulesCollection.reset(this.rulesCollection.parse(Global.localCache.get(sign)));
      this.rulesCollection.trigger('sync:fromCache');
    }
  },


  renderSale: function(model, sale) {
    this.$btnAdd.prop('disabled', !sale);
    this.$btnConfirm.prop('disabled', !sale);
    this.$btnChase.prop('disabled', !sale);

    this.$lastResults.toggleClass('hidden', !sale);
    this.$saleStop.toggleClass('hidden', sale);

    //this.$planId.toggleClass('hidden', !sale);
    //this.$planIdStop.toggleClass('hidden', sale);

    if (sale) {
      this.getNewPlan();
    } else {
      this.infoModel.set('leftSecond', 0);
      this.updateCountdown();

      if (this.$el.closest('html').length !== 0) {
        Global.ui.notification.show('<p class="font-md">非常抱歉，目前此彩种暂停销售</p>' +
          '重新开启销售时间请留意平台公告。');
      }
    }
  },

  initNumRange: function() {
    var self = this;
    this.$multiRange.numRange({
      onChange: function(num) {
        self.model.set('multiple', num);
      },
      onOverMax: function(maxNum) {
        Global.ui.notification.show(
          '您填写的倍数已超出平台限定的单注中奖限额<span class="text-sunshine">' +
          _(self.rulesCollection.limitMoney).convert2yuan() + '</span>元，' +
          '已为您计算出本次最多可填写倍数为：<span class="text-sunshine">' + maxNum + '</span>倍'
        );
      }
    });
  },

  renderCountdown: function() {
    var self = this;
    var times = 1;

    this.countdown = new Countdown({
      el: this.$countdown,
      color: 'red',
      size: ''
    })
      .render()
      .on('change:leftTime', function(e) {
        --times;
        if (times === 0) {
          var leftTime = moment.duration(e.finalDate.getTime() - new Date().getTime()).asSeconds();
          self.trigger('change:leftTime', leftTime, self.infoModel.get('totalSecond'));
          times = 1;
        }
      });
  },

  renderLastPlan: function(model) {
    var planInfo = model.pick('lastOpenId', 'lastOpenNum');

    //this.$lastPlanId.html(planInfo.lastOpenId);

    if (this.$lastPlanId.data('popover')) {
      this.$lastPlanId.popover('destroy');
    }

    $('.js-bc-last-planId').html('第' + planInfo.lastOpenId  + '期');

    this.$lastResults.html(_(model.get('lastOpenNum')).map(function(num) {
      return '<span class="text-circle">' + num + '</span>';
    }));

    this.recordsOpenView.update();
    this.recordsRecentView.update();
  },

  renderBasicInfo: function(model) {
    var planInfo = model.pick('planId', 'lastPlanId', 'sale');

    //this.$planId.html(planInfo.planId);

    if (this.$planId.data('popover')) {
      this.$planId.popover('destroy');
    }
    
    this.$planId.html('第' + planInfo.planId + '期');


    if (this.infoModel.get('init')) {
      this.infoModel.changeToUpdate();
    } else {
      if (this.$el.closest('html').length !== 0 && planInfo.sale && planInfo.lastPlanId !== planInfo.planId) {
        Global.ui.notification.show('<span class="text-sunshine">' + planInfo.lastPlanId + '</span>期已截止<br/>当前期为<span class="text-sunshine">' + planInfo.planId + '</span>期<br/>投注时请注意期号！',{id:'ticketNotice'});
      }
    }
  },

  renderVideo: function() {
    this.$videoMain.toggleClass('hidden', !this.infoModel.getVideoUrl());
  },

  renderBasicRules: function() {
    var playLevels = this.rulesCollection.getPlayLevels();
    this.$basicRules.html(this.playLevelTpl({
      ruleClass: 'js-bc-basic-rule',
      rules: playLevels.normalList
    }));
    if (!_(playLevels.optionalList).isEmpty()) {
      this.$rules.removeClass('rule-hide-optional');
      this.$playToggle.parent('.bc-play-toggle').removeClass('bc-play-toggle-hasSuper');
      this.$optionalRules.html(this.playLevelTpl({
        ruleClass: 'js-bc-basic-rule',
        rules: playLevels.optionalList
      }));
      this.$playToggle.parent('.js-bc-toggle').removeClass('hidden');
    }
    if (!_(playLevels.superList).isEmpty()) {
      this.$rules.removeClass('rule-hide-super');
      this.$playToggle.parent('.bc-play-toggle').addClass('bc-play-toggle-hasSuper');
      this.$superRules.html(this.playLevelTpl({
        ruleClass: 'js-bc-basic-rule',
        rules: playLevels.superList
      }));
      this.$playToggle.parent('.js-bc-toggle').removeClass('hidden');
    }
    this.selectDefaultPlay();
  },

  selectDefaultPlay: function() {
    var defaultSelectInfo =  this.options.ticketInfo.info.defaultSelectPlay.split(',');
    if(!_(defaultSelectInfo).isEmpty()){
      if(_(Number(defaultSelectInfo[0])).isFinite()){
        var $basics = this.$basicRules.find('.js-bc-basic-rule');
        var $basicSelected = $basics.eq(defaultSelectInfo[0]);
        if ($basicSelected.length) {
          $basicSelected.trigger('click');
        } else {
          this.$playToggle.eq(1).addClass('active').siblings().removeClass('active');
          this.$basicRules.addClass('hidden');
          this.$optionalRules.find('.js-bc-basic-rule').eq(Number(defaultSelectInfo[0]) - $basics.length).trigger('click');
          this.$optionalRules.removeClass('hidden');
        }
      }
      if(_(Number(defaultSelectInfo[1])).isFinite()){
        this.$advanceRules.find('.js-bc-advance-rule').eq(defaultSelectInfo[1]).trigger('click');
      }
    }else{
      this.$basicRules.find('.js-bc-basic-rule').eq(0).trigger('click');
    }

  },

  renderAdvanceRules: function(levelId) {
    var advanceRules = this.rulesCollection.getPlayGroups(levelId);
    var length = advanceRules.length;
    this.$advanceRules.html(_(advanceRules).map(function(rules, index) {
      var containerClass;
      //强制两排显示
      if (length > 2) {
        if (index === 1) {
          containerClass = 'inline-block';
        } else if (index === 2) {
          containerClass = 'inline-block no-padding';
        }
      }
      return this.rulesTpl({
        tabToolbarClass: 'tab-pill tab-pill-main',
        ruleClass: 'js-bc-advance-rule',
        containerClass: containerClass,
        id: rules.id,
        title: rules.title,
        rules: rules.playList
      });
    }, this));

    this.$advanceRules.find('.js-bc-advance-rule').eq(0).trigger('click');
  },

  renderPlayInfo: function(playInfo) {

    this.$playExample.html('<i class="icon-question-sign"></i>玩法说明：' + playInfo.playExample).attr('title', playInfo.playExample);
    this.$playExample2.html( playInfo.playDes.replace(/\|/g, '<br />').replace(/\[max\]/g,_(playInfo.betMethodMax).chain().formatDiv(10000).floor(4).value()).replace(/\[min\]/g,_(playInfo.betMethodMin).chain().formatDiv(10000).floor(4).value()) );
    if (this.$playTip.data('popover')) {
      this.$playTip.popover('destroy');
    }

   // this.$playTip.popover({
   //   trigger: 'hover',
   //   container: this.$el,
   //   html: true,
   //   content: playInfo.playDes.replace(/\|/g, '<br />').replace(/\[max\]/g,_(playInfo.betMethodMax).chain().formatDiv(10000).floor(4).value()).replace(/\[min\]/g,_(playInfo.betMethodMin).chain().formatDiv(10000).floor(4).value()),
   //   placement: 'top'
   // });

    this.renderPlayBetMode();
    //初始化奖金
    this.model.set({
      maxMultiple: playInfo.betMultiLimitMax,
      userRebate: playInfo.userRebate
    });
  },

  renderNumRange: function(model, formatMaxMultiple) {
    this.$multiRange.numRange('setRange', 1, formatMaxMultiple);
  },

  renderPlayBetMode: function() {
    var unit = _(100000000).div(this.model.get('unit'));
    var playInfo = this.rulesCollection.getCurrentPlay();

    var betMethod = _(playInfo.betMethodMax).chain().formatDiv(unit).floor(4).value();

    this.model.set({
      maxBonus: playInfo.betMethodMax,
      betMethod: 0, //高奖金
      maxMultiple: playInfo.betMultiLimitMax
    });

    this.$playBetMode.html(betMethod);
  },

  renderBetWay: function() {
    switch (this.model.get('betWay')) {
      case 2:
        this.$('.bc-result-container2').removeClass('hidden');
        this.$('.bc-result-container3').addClass('hidden');
        break;
      default:
        this.$('.bc-result-container2').addClass('hidden');
        this.$('.bc-result-container3').removeClass('hidden');
    }
  },

  renderPlayArea: function(groupId, playId) {
    var playRule = betRulesConfig.get(this.model.pick('playId'));

    if (this.currentPlayAreaView) {
      this.currentPlayAreaView.destroy();
    }

    if (_.isEmpty(playRule)) {
      return;
    }
    switch (playRule.type) {
      case 'select':
        this.currentPlayAreaView = new PlayAreaSelectView(playRule);
        break;
      case 'input':
        this.currentPlayAreaView = new PlayAreaInputView(playRule);
        break;
    }

    this.options.type = playRule.type;

    this.currentPlayAreaView.on('statistic', function(statistics) {
      this.model.set({
        statistics: statistics
      });
    }, this);

    this.$playArea.html(this.currentPlayAreaView.render().el).addClass('loaded');

    if (playRule.type === 'select') {
      this.$playArea.addClass('middle')
    } else {
      this.$playArea.removeClass('middle')
    }

    //console.log(this.model.pick('ticketId', 'levelId', 'groupId', 'playId'));
  },

  renderSelectStatisticsInfo: function() {
    var statisticsInfo = this.model.getStatisticsInfo();
    this.$statisticsLottery.text(statisticsInfo.statistics);
    this.$statisticsMoney.text(statisticsInfo.prefabMoney);
    this.$statisticsRebateMoney.text(statisticsInfo.rebateMoney);
  },

  renderBettingBtns: function() {
    var statisticsInfo = this.model.getStatisticsInfo();
    var canAdd = false;
    var canQuickBet = false;
    var betWay = this.model.get('betWay');

    //切换投注按钮显示模式 根据1投注模式 2是否有注数。根据投注的模式不同计算方式不同
    if (betWay === 1) {
      canQuickBet = canAdd = !!statisticsInfo.statistics;
    } else {
      canQuickBet = !!statisticsInfo.prefabMoney;
    }
    this.$('.js-bc-quick-bet1').toggleClass('hidden', canQuickBet);
    this.$('.js-bc-quick-bet').toggleClass('hidden', !canQuickBet);
    this.$('.js-bc-btn-lottery-add1').toggleClass('hidden', canAdd);
    this.$('.js-bc-btn-lottery-add').toggleClass('hidden', !canAdd);
  },

  renderMaxBonus: function(model, formatMaxBonus) {
    this.$statisticsBonus.text(_(formatMaxBonus).convert2yuan());
  },

  updateCountdown: function() {
    var self = this;

    var leftSecond = this.infoModel.get('leftSecond');
    var sale = this.infoModel.get('sale');
    var leftTime = _(sale ? leftSecond : 0).mul(1000);
    this.infoModel.set('leftTime', leftTime);

    clearInterval(self.timer);
    clearInterval(self.goToNextTimer);
    clearInterval(self.nextTimer);

    this.timer = _.delay(function() {
      self.getNewPlan();
    }, 2200);

    //只有销售时才进行倒计时
    if (sale) {
      this.goToNextTimer = _.delay(function() {
        self.infoModel.goToNextPlan();
      }, _(leftSecond).mul(1000));

      //取得下一期的信息延迟一秒再做
      this.nextTimer = _.delay(function() {
        self.getNewPlan();
      }, _(leftSecond + 1).mul(1000));
    }

    this.infoModel.set('leftSecond', 0, {
      silent: true
    });

    this.countdown.render(leftTime);
  },

  renderTotalLotteryInfo: function(model, totalInfo) {
    this.$totalLottery.text(totalInfo.totalLottery);
    this.$totalMoney.text(_(totalInfo.totalMoney).convert2yuan());
    this.$totalRebateMoney.text(_(totalInfo.totalRebateMoney).convert2yuan());
  },

  getBonusMode: function(bonus, unit, userRebate, betMethod) {
    var bonusMode = _(bonus).chain().div(10000).mul(unit).convert2yuan().value();
    if (betMethod) {
      bonusMode += '/' + _(userRebate).div(10) + '%';
    } else {
      bonusMode += '/0.0%';
    }
    return bonusMode;
  },

  renderLotteryPreviewAdd: function() {
    var previewList = this.model.get('previewList');
    var self = this;
    var rows = _(previewList).map(function(previewInfo) {
      if(!(IDsSuper3.getArr().indexOf(parseInt(previewInfo.playId.toString().slice(0,3))) === -1)){
        var title = '<span class="text-hot">【超级3000_' + previewInfo.levelName + '_' + previewInfo.playName + '】 ';
        var sf = true;
      }else{
        var title = '[' + previewInfo.levelName + '_' + previewInfo.playName + '] ';
        var sf = false;
      }
      if (previewInfo.formatBettingNumber.length > 7) {
        title += '<a href="javascript:void(0)" class="js-bc-betting-preview-detail btn-link">' +
          previewInfo.formatBettingNumber.slice(0, 7) + '...</a></span>';
      } else {
        title += previewInfo.formatBettingNumber + '</span>';
      }
      return {
        title: title,
        bonusMode: this.getBonusMode(previewInfo.maxBonus, previewInfo.unit, previewInfo.userRebate, previewInfo.betMethod),
        mode: previewInfo.statistics + '注',
        mode2: _(previewInfo.prefabMoney).convert2yuan() + '</span>元',
        mode3: '<div class="js-bc-lottery-preview-del  icon-remove-sign"></div>'
      };

    }, this);

    var $rows = this.lotteryPreview.renderRow(rows);

    $rows.each(function(index, row) {
      var $row = $(row);
      var $detail = $row.find('.js-bc-betting-preview-detail');
      var betNumber = previewList[index].bettingNumber;
      var is11X5 = (self.options.ticketInfo.title.indexOf('11选5') !== -1);
      betNumber = is11X5 ? betNumber : betNumber.replace(/ /g,'');
      $('.sfClass').css('background-color','#ffb300');
      if ($detail.length) {
        $detail.popover({
          title: '详细号码',
          trigger: 'click',
          html: true,
          container: this.$el,
          content: '<div class="js-pf-popover">'+betNumber+ '</div>',
          placement: 'right'
        });
      }
    });

    this.$lotteryPreview.scrollTop(0);
  },
  renderLotteryPreviewDel: function(model, index) {
    if (_.isUndefined(index)) {
      this.lotteryPreview.renderEmpty();
    } else {
      this.lotteryPreview.delRow(index);
    }
  },

  getSelectLottery: function() {
    var bettingInfo = this.currentPlayAreaView.getBetting();

    return {
      lotteryList: bettingInfo.rowsResult,
      selectOptionals: bettingInfo.selectOptionals,
      format: bettingInfo.format,
      type: 'select',
      formatToNum: bettingInfo.formatToNum
    };
  },

  addSelectLottery: function() {
    var result = this.model.addPrevBet(this.getSelectLottery());

    if (result) {
      if (!_.isEmpty(result)) {
        Global.ui.notification.show('您选择的号码在号码篮已存在，将直接进行倍数累加');
      }
      this.currentPlayAreaView.empty();

      this.$('.js-bc-select-item-title').removeClass('active');
    } else {
      Global.ui.notification.show('号码选择不完整，请重新选择！');
    }
  },

  getInputLottery: function() {
    var bettingInfo = this.currentPlayAreaView.getBetting();

    var html = ['<div class=" max-height-smd overflow-auto">'];
    if (!_.isEmpty(bettingInfo.repeatNumbers)) {
      html.push('<p class="word-break">以下号码重复，已进行自动过滤<br />' + bettingInfo.repeatNumbers.join(',') + '</p>');
    }
    if (!_.isEmpty(bettingInfo.errorNumbers)) {
      html.push('<p class="word-break">以下号码错误，已进行自动过滤<br />' + bettingInfo.errorNumbers.join(',') + '</p>');
    }
    html.push('</div>');

    if (html.length > 2) {
      Global.ui.notification.show(html.join(''));
    }

    return {
      lotteryList: bettingInfo.passNumbers,
      selectOptionals: bettingInfo.selectOptionals,
      format: bettingInfo.format,
      type: 'input',
      formatToNum: bettingInfo.formatToNum
    };
  },

  addInputLottery: function() {
    var result = this.model.addPrevBet(this.getInputLottery());

    if (result) {
      if (!_.isEmpty(result)) {
        Global.ui.notification.show('您选择的号码在号码篮已存在，将直接进行倍数累加');
      }

      this.currentPlayAreaView.empty();
    } else {
      Global.ui.notification.show('号码选择不完整，请重新选择！');
    }
  },

  destroy: function() {
    Base.ItemView.prototype.destroy.apply(this, arguments);
    clearInterval(this.timer);
  },

  //event handlers

  openVideoHandler: function(e) {
    var $target = $(e.currentTarget);

    $target.attr('href', this.infoModel.getVideoUrl() || 'javascript:void(0)');
  },


  baseRuleChangeHandler: function(e) {
    this.$('.js-bc-advance-rules').show();

    var $target = $(e.currentTarget);
    $target.addClass('active').siblings().removeClass('active');

    this.model.set({
      levelId: $target.data('id'),
      levelName: $target.data('title')
    });

    var idStr =  ''+$target.data('index');
    idStr = parseInt(idStr);
    var playValue = (idStr+1)*82 +3;
    this.$('.js-bc-advance-rules').css('left',playValue+'px');

    this.$('.js-rule-title-hidden-temp').html(idStr);

    this.$('.js-rule-title-clear').html('');
  },


  togglePlayModeHandler: function(e) {
    var $target = $(e.currentTarget);
    var type = $target.data('type');
    $target.addClass('hidden').siblings().removeClass('hidden');
    if (type === 'normal') {
      this.$basicRules.find('.js-bc-basic-rule').eq(0).trigger('click');
      this.$basicRules.removeClass('hidden');
      this.$superRules.addClass('hidden');
      this.$optionalRules.addClass('hidden');
      $('.bc-curt-plan-main').addClass('bg-deep-gray');
      this.$lastResults.find('.text-circle:lt(3)').removeClass('text-circle-red');
    // } else if (type === 'super') {
    //   this.$superRules.find('.js-bc-basic-rule').eq(0).trigger('click');
    //   this.$basicRules.addClass('hidden');
    //   this.$optionalRules.addClass('hidden');
    //   this.$superRules.removeClass('hidden');
    //   $('.bc-curt-plan-main').removeClass('bg-deep-gray');
    //   this.$lastResults.find('.text-circle:lt(3)').addClass('text-circle-red');
    } else {
      this.$optionalRules.find('.js-bc-basic-rule').eq(0).trigger('click');
      this.$basicRules.addClass('hidden');
      this.$superRules.addClass('hidden');
      this.$optionalRules.removeClass('hidden');
      $('.bc-curt-plan-main').addClass('bg-deep-gray');
      this.$lastResults.find('.text-circle:lt(3)').removeClass('text-circle-red');
    }
  },

  advanceRuleChangeHandler: function(e) {

    var $target = $(e.currentTarget);
    var $parent = $target.closest('.js-bc-rules-toolbar');

    this.$advanceRules.find('.js-bc-advance-rule').removeClass('active');

    $target.addClass('active');

    this.model.set({
      groupId: $parent.data('id'),
      groupName: $parent.data('title'),
      playId: $target.data('id'),
      playName: $target.data('title')
    });

    var idStr =this.$('.js-rule-title-hidden-temp').html();

    this.$('.js-rule-title-clear').html('');
    this.$(".js-rule-title-sub-"+idStr).html($target.data('title'));
  },

  //advanceRuleDefaultChangeHandler: function(e) {
  //  var $target = $(e.currentTarget);
  //  var $parent = $target.closest('.js-bc-rules-toolbar');
  //
  //  this.$advanceRules.find('.js-bc-advance-rule').removeClass('active');
  //
  //  $target.addClass('active');
  //
  //  this.model.set({
  //    groupId: $parent.data('id'),
  //    groupName: $parent.data('title'),
  //    playId: $target.data('id'),
  //    playName: $target.data('title')
  //  });
  //
  //  var idStr =this.$('.js-rule-title-hidden-temp').html();
  //
  //  this.$('.js-rule-title-clear').html('');
  //  this.$(".js-rule-title-sub-"+idStr).html($target.data('title'));
  //},

  betModeChangeHandler: function(e) {
    var $target = $(e.currentTarget);
    var $selectedOption = $target.find(':selected');
    var maxMultiple = $selectedOption.data('max');

    this.model.set({
      maxBonus: $selectedOption.data('maxBonus'),
      //formatBonusMode: $target.find(':selected').text(),
      betMethod: Number($target.val()),
      maxMultiple: maxMultiple
    });

    //this.$multiRange.numRange('setRange', 1, maxMultiple);
  },

  monetaryUnitChangeHandler: function(e) {
    var $target = $(e.currentTarget);
    $target.addClass('active').siblings().removeClass('active');

    this.model.set('unit', $target.data('rate'));
  },

  lotteryAddHandler: function(e) {
    if (!this.model.get('multiple')) {
      Global.ui.notification.show('倍数为0，不能投注');
      return false;
    }
    if (this.options.type === 'select') {
      this.addSelectLottery();
    } else {
      this.addInputLottery();
    }
  },

  quickBetHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

    var bettingInfo;

    if (this.options.type === 'select') {
      bettingInfo = this.getSelectLottery();
    } else {
      bettingInfo = this.getInputLottery();
    }

    var info = this.model.quickBet(bettingInfo);

    this.bettingConfirm(info.totalInfo, info.previewList, $target, function() {
      self.currentPlayAreaView.empty();
    });
  },

  lotteryClearHandler: function() {
    this.model.emptyPrevBetting();
  },

  lotteryPreviewDelHandler: function(e) {
    var $target = $(e.currentTarget);
    var $row = $target.closest('.js-gl-static-tr');
    this.model.delPrevBetting($row.index());
  },

  lotteryChaseHandler: function() {
    var self = this;
    var info = this.model.pick('previewList', 'totalInfo');

    if (_.isEmpty(info.previewList)) {
      Global.ui.notification.show('请至少选择一注投注号码！');
      return;
    }

    if (info.totalInfo.totalMoney > Global.memoryCache.get('acctInfo').balance) {
      Global.ui.notification.show('账号余额不足，请先<a href="javascript:void(0);" class="btn-link btn-link-pleasant js-fc-re"  data-dismiss="modal" >充值</a>。');
      return false;
    }

    var chaseView;
    var $dialog = Global.ui.dialog.show({
      title: '追号',
      size: 'modal-lg-julien',
      body: '<div class="js-bc-chase-container menu-bock-chase" style="padding-left: 30px; padding-right: 30px;"></div>',
      bodyClass: 'p-top-xs no-p-left no-p-right no-p-bottom',
      footer: ''
    });

    var $chaseContainer = $dialog.find('.js-bc-chase-container');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      chaseView.destroy();
    });

    chaseView = new BettingChaseView({
      el: $chaseContainer,

      limitMoney: this.rulesCollection.limitMoney,
      ticketInfo: this.options.ticketInfo,
      planId: this.infoModel.get('planId'),
      ticketId: this.options.ticketId,
      previewList: info.previewList,
      totalLottery: this.model.get('totalInfo').totalLottery
    }).render();

    chaseView.listenTo(this.infoModel, 'change:planId', function() {
      var planInfo = self.infoModel.pick('planId', 'lastPlanId');
      if (planInfo.lastPlanId !== planInfo.planId) {
        this.trigger('change:planId', planInfo.lastPlanId);
      }
    });

    chaseView.on('submit:complete', function() {
      self.model.emptyPrevBetting();

      self.recordsRecentView.update();
      $dialog.modal('hide');
    });
  },

  //提交号码篮
  lotteryConfirmHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var info = this.model.pick('totalInfo', 'previewList');

    this.bettingConfirm(info.totalInfo, info.previewList, $target, function() {
      self.model.emptyPrevBetting();
    });
  },

  bettingConfirm: function(totalInfo, previewList, $target, callback) {
    var self = this;
    var planId = self.infoModel.get('planId');

    var inputCount = _(previewList).reduce(function(inputCount, previewInfo) {
      if (previewInfo.type === 'input') {
        inputCount += previewInfo.statistics;
      }
      return inputCount;
    }, 0);

    if (inputCount > 100000) {
      Global.ui.notification.show('非常抱歉，目前平台单式投注只支持最多10万注单。');
      return false;
    }

    if (_.isEmpty(previewList)) {
      Global.ui.notification.show('请至少选择一注投注号码！');
      return false;
    }


    if (totalInfo.totalMoney > Global.memoryCache.get('acctInfo').balance) {
      Global.ui.notification.show('账号余额不足，请先<a href="javascript:void(0);" class="btn-link btn-link-pleasant js-fc-re"  data-dismiss="modal">充值</a>。');
      return false;
    }
    // previewList.map(function(item){
    //   if(!(IDsSuper3.getArr().indexOf(parseInt(item.playId.toString().slice(0,3))) === -1)){
    //     item.levelName = '超级3000_' + item.levelName;
    //   }else{
    //     item.levelName = item.levelName;
    //   }
    // });

    var confirm = $(document).confirm({
      title: '确认投注',
      id: 'adsf123',
      content: this.confirmTpl({
        ticketInfo: this.options.ticketInfo,
        ticketName: this.options.ticketName,
        planId: planId,
        totalInfo: totalInfo,
        previewList: previewList
      }),
      //size: 'modal-md',
      agreeCallback: function() {

        $target.button('loading');

        self.model.saveBettingXhr(planId, previewList)
          .always(function() {
            $target.button('reset');
          })
          .done(function(res) {
            if (res && res.result === 0) {
              self.recordsRecentView.update();
              if (callback) {
                callback();
              }

              Global.m.oauth.check();

              Global.ui.notification.show('投注成功！', {
                type: 'success'
              });
            } else {
              if (res.root && res.root.errorCode === 101) {
                Global.ui.notification.show('账号余额不足，请先<a href="javascript:void(0);" class="btn-link btn-link-pleasant js-fc-re"  data-dismiss="modal">充值</a>。');
              } else {
                Global.ui.notification.show(res.msg || '');
              }
            }
          });
      }
    }).confirm('instance');

    this.infoModel.off('change:planId', changePlanId).on('change:planId', changePlanId);

    function changePlanId(model, newPlanId) {
      planId = newPlanId;
      confirm.element.find('.js-bc-confirm-planId').text(planId);
    }
  },

  toggleTabHandler: function(e) {
    var $target = $(e.currentTarget);
    var flag = $target.data('type') === 'recent';
    $target.addClass('active').siblings().removeClass('active');

    this.$recordsRecentContainer.toggleClass('hidden', !flag);
    this.$lotteryPreview.toggleClass('hidden', flag);
  },

  //common APIs

  typeChangeHandler: function (e) {
    var $target = $(e.currentTarget);
    var betWay = Number($target.val());

    this.model.set({
      betWay: betWay
    });
  },

  syncCustomizeMoneyHandler: function(e) {
    this.model.set({
      customizeMoney: Number($(e.currentTarget).val())
    });
  },

  cangHandler: function() {
    var self = this;

    var previewList1 = this.model.get('previewList');

    var previewList = _(previewList1).reduce(function(list, item) {

      list.push({
        betNum: item.bettingNumber,
        playId: item.playId,
        betMultiple: item.multiple,
        moneyMethod: item.unit,
        //0 高奖金 1 有返点
        betMethod: item.betMethod
      });

      return list;
    }, []);


    return Global.sync.ajax({
      url: '/ticket/betManager/newscheme.json',
      tradition: true,
      data: {
        bet: previewList
      }
    })
      .done(function(res) {
        //if (res && res.result === 0) {
        //  self.emptyPrevBetting();
        //}
        if (res && res.result === 0) {
          Global.ui.notification.show('收藏成功！', {
            type: 'success'
          });
        } else {
          Global.ui.notification.show('收藏失败！错误原因：' + res.msg || '');
        }
      });
  }

});

module.exports = BettingCenterView;

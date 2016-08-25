"use strict";

var BettingChoiceModel = require('bettingCenter/models/bettingChoice-smmc');
var BettingRulesCollection = require('bettingCenter/collections/bettingRules');

var PlayAreaSelectView = require('bettingCenter/views/bettingCenter-playArea-select');
var PlayAreaInputView = require('bettingCenter/views/bettingCenter-playArea-input');
var BettingRecordsView = require('bettingCenter/views/bettingCenter-records');

var ticketConfig = require('skeleton/misc/ticketConfig');
var betRulesConfig = require('bettingCenter/misc/betRulesConfig');

require('./misc/easing')
require('./misc/index.scss')
require('./misc/jquery-animate-plugin')

var BettingCenterView = Base.ItemView.extend({

  template: require('bettingCenter/smmc/index.html'),

  playLevelTpl: _.template(require('bettingCenter/templates/bettingCenter-level-mmc.html')),
  rulesTpl: _.template(require('bettingCenter/templates/bettingCenter-rules.html')),
  treasureTpl: _.template(require('bettingCenter/smmc/treasureChest.html')),
  freeGameTpl: _.template(require('bettingCenter/smmc/freeGame.html')),
  jackpotTpl: _.template(require('bettingCenter/smmc/jackpot.html')),
  CongratulationTpl: _.template(require('bettingCenter/smmc/congratulation.html')),
  jackpotWinTpl: _.template(require('bettingCenter/smmc/jackpotWin.html')),
  jackpotRuleTpl: _.template(require('bettingCenter/smmc/jackpotRule.html')),

  events: {
    'click .js-bc-basic-rule': 'baseRuleChangeHandler',
    'click .js-bc-play-toggle': 'togglePlayModeHandler',
    'click .js-bc-advance-rule': 'advanceRuleChangeHandler',
    'change .js-bc-bet-mode': 'betModeChangeHandler',
    'click .js-bc-monetary-unit': 'monetaryUnitChangeHandler',
    'click .js-bc-btn-lottery-add': 'lotteryAddHandler',
    'click .js-bc-lottery-auto': 'lotteryAutoAddHandler',
    'click .js-bc-lottery-clear': 'lotteryClearHandler',
    'click .js-bc-lottery-preview-del': 'lotteryPreviewDelHandler',
    'click .js-bc-btn-lottery-confirm': 'lotteryConfirmHandler',

    'click .js-bc-mmc-start': 'startlotteryHandler',
    'click .js-bc-mmc-reSelect-btn': 'reSelectHandler',
    'click .js-bc-mmc-bet-times': 'betTimesHandler',
    'click .js-bc-mmc-open-history-turn-page': 'openHistoryTurnPage',
    'change .js-bc-mmc-continue-lottery-times': 'lotteryTimesChange',
    'click .js-bc-smmc-treasure-button': 'get',
    'click .js-bc-mmc-result-mask': 'closeMaskHandler',
    //'click .js-bc-smmc-rule': 'checkSmmcJackpotRuleHandler'

    //'mouseover .js-bc-basic-rule': 'baseRuleChangeHandler',
    //'mouseout .js-bc-basic-rule': 'baseRuleChange1Handler',
    'mouseover .js-bc-advance-rules': 'baseRuleChangeMOHandler',
    'mouseout .js-bc-advance-rules': 'baseRuleChangeMO1Handler',
    'click .js-play1': 'play1',
    'click .js-play2': 'play2',
    'click .js-lottery-rules': 'lottertyRulesHandler'
  },

  lottertyRulesHandler: function() {

    var self = this;

    var $dialogRe = Global.ui.dialog.show({
      id: _.now(),
      title: '奖池规则',
      size: 'modal-lg',
      body: '<div class="js-lottery-rules pic-rules"></div>'
    });

    //var lotteryTypeListView = new LotteryTypeListView({parentView: self});
    //lotteryTypeListView.onRender();
    //
    //$dialogRe.on('click', '.js-list-active1', function(e) {
    //  $('.list-active').removeClass('list-active');
    //  var $target = $(e.currentTarget);
    //  $target.addClass('list-active');
    //
    //  var currentIndex = $target.data('index');
    //  $('.js-lotteryList-0').addClass('hidden');
    //  $('.js-lotteryList-1').addClass('hidden');
    //  $('.js-lotteryList-2').addClass('hidden');
    //  $('.js-lotteryList-3').addClass('hidden');
    //  $('.js-lotteryList-4').addClass('hidden');
    //  $('.js-lotteryList-'+currentIndex).removeClass('hidden');
    //
    //
    //});
    //
    //$dialogRe.on('click', '.js-list-close1', function(e) {
    //  $dialogRe.modal('hide');
    //});

  },

  play1:function () {
    $('.js-play1').addClass('sd');
    $('.js-play2').removeClass('sd');
    $('.js-bc-basic-rules').addClass('hidden');
    $('.js-bc-optional-rules').removeClass('hidden');
    $('.js-bc-optional-rules ul').removeClass('hidden');
  },

  play2:function () {
    $('.js-play2').addClass('sd');
    $('.js-play1').removeClass('sd');
    $('.js-bc-basic-rules').removeClass('hidden');
    $('.js-bc-optional-rules').addClass('hidden');
    $('.js-bc-optional-rules ul').addClass('hidden');
  },

  serializeData: function () {
    return {
      ticketInfo: this.options.ticketInfo
    };
  },

  getOpenHistoryXhr: function (data) {
    return Global.sync.ajax({
      url: '/ticket/bet/openHistory.json',
      data: data
    });
  },

  getJapepotInfoXhr: function (data) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/jakepotinfo.json',
      data: data
    });
  },

  getExperienceInfoXhr: function (data) {
    return Global.sync.ajax({
      url: 'ticket/ticketmod/experienceInfo.json',
      data: data
    });
  },

  getTicketInfoXhr: function (data) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketinfoMmc.json',
      data: data
    });
  },
  getJackpotPrizeInfoXhr: function () {
    return Global.sync.ajax({
      url: '/ticket/bet/dojakepot.json'
    });
  },
  getNoticeXhr: function(){
    return Global.sync.ajax({
      url: '/ticket/bet/jakepothistory.json'
    });
  },
  initialize: function () {
    this.options.ticketInfo = ticketConfig.getComplete(this.options.ticketId);

    this.model = new BettingChoiceModel();
    //this.infoModel = new BettingInfoModel();
    this.rulesCollection = new BettingRulesCollection();
    this.rulesCollection.setTicketInfo(this.options.ticketInfo);


    this.model.set('ticketId', Number(this.options.ticketId));

    this.listenTo(this.rulesCollection, 'sync sync:fromCache', this.renderBasicRules);

    this.listenTo(this.model, 'change:levelId', function (model, levelId) {
      this.renderAdvanceRules(levelId);
    });

    this.listenTo(this.model, 'change:playId', function (model, playId) {
      this.renderPlayArea();
      this.renderPlayInfo(this.rulesCollection.getPlayInfo(model.get('groupId'), playId));

      this.model.set({
        statistics: 0
      });
    });

    this.listenTo(this.model, 'change:formatMaxMultiple', this.renderNumRange);
    this.listenTo(this.model, 'change:unit', this.renderPlayBetMode);

    this.listenTo(this.model, 'change:prefabMoney change:rebateMoney', this.renderSelectStatisticsInfo);
    this.listenTo(this.model, 'change:previewList', this.renderLotteryPreviewAdd);
    this.listenTo(this.model, 'change:previewList:del', this.renderLotteryPreviewDel);
    this.listenTo(this.model, 'change:totalInfo', this.renderTotalLotteryInfo);

    //快捷入口

    this.on('entry:show router:back', function () {
      this.bettingRecordsView.update();
    });
  },

  onRender: function () {
    var self = this;
    $('#footer').css('display', 'none');
    this.rulesCollection.fetch({
      abort: false,
      localCache: false,//todo true
      cacheName: 'ticketList.' + this.options.ticketId,
      data: {
        ticketId: this.options.ticketId
      }
    });
    this.refreshOpenHistory();

    this.canTrunPage = true;
    this.isBegin = false;
    //rules
    this.$rules = this.$('.js-bc-rules');
    this.$playToggle = this.$('.js-bc-play-toggle');
    this.$basicRules = this.$('.js-bc-basic-rules');
    this.$optionalRules = this.$('.js-bc-optional-rules');
    this.$advanceRules = this.$('.js-bc-advance-rules');

    //playInfo
    this.$playTip = this.$('.js-bc-play-tip');
    this.$playExample = this.$('.js-bc-play-example');
    this.$playBetMode = this.$('.js-bc-bet-mode');

    //playArea
    this.$playArea = this.$('.js-bc-play-area');

    //numRange
    this.$multiRange = this.$('.js-bc-multi-range');

    //
    this.$statisticsLottery = this.$('.js-bc-statistics-lottery');
    this.$statisticsMoney = this.$('.js-bc-statistics-money');
    this.$statisticsRebateMoney = this.$('.js-bt-statistics-rebateMoney');
    this.$statisticsBonus = this.$('.js-bc-statistics-bonus');

    //betting preview
    this.$lotteryPreview = this.$('.js-bc-lottery-preview');
    this.$lotteryCurrResultPreview = this.$('.js-bc-lottery-currResult-preview');
    this.$lotteryTotalResultPreview = this.$('.js-bc-lottery-totalResult-preview');


    //total
    this.$totalLottery = this.$('.js-bc-total-lottery');
    this.$totalMoney = this.$('.js-bc-total-money');
    this.$totalRebateMoney = this.$('.js-bc-total-rebateMoney');

    this.$reSelectBtn = this.$('.js-bc-mmc-reSelect-btn');

    this.$recordsContainer = this.$('.js-bc-records');

    //======
    this.$btnAdd = this.$('.js-bc-btn-lottery-add');
    this.$btnConfirm = this.$('.js-bc-btn-lottery-confirm');
    this.$btnStart = this.$('.js-bc-mmc-start');

    this.$OpenHistory = this.$('.js-bc-mmc-open-history');

    this.$CurrentResult = this.$('.js-bc-mmc-result-win');
    this.$CurrentResultMask = this.$('.js-bc-mmc-result-mask');
    this.$CurrentResultTotal = this.$('.js-bc-mmc-result-total');

    this.$LotteryTime = this.$('.js-bc-mmc-continue-lottery-times');
    this.$WinStop = this.$('.js-bc-mmc-win-stop');

    this.$LotteryTimeShow = this.$('.js-bc-mmc-lottery-time-show');
    this.$FreeGameLotteryTimeShow = this.$('.js-bc-mmc-free-game-lottery-time-show');


    //jackpot
    this.$JackpotTotal = this.$('.js-bc-smmc-jakePool-total');
    this.$JackpotCrown = this.$('.js-bc-smmc-jakePool-crown');
    this.$JackpotDiamond = this.$('.js-bc-smmc-jakePool-diamond');
    this.$JackpotGold = this.$('.js-bc-smmc-jakePool-gold');
    this.$JackpotEgg = this.$('.js-bc-smmc-jakePool-egg');
    //experienceBar
    //this.$ExperienceBar = this.$('.js-bc-smmc-experience-bar-fg');

    this.$MainArea = this.$('.js-bc-main-area');
    this.$JackpotNoticeContainer = this.$('.js-bc-smmc-jackpot-notice')

    this.initNumRange();
    this.getTicketInfoAndDeal();
    //this.renderCountdown();

    this.TimeOutArr = [];

    this.lotteryPreview = this.$lotteryPreview.staticGrid({
      tableClass: 'table_bg table-dashed',
      colModel: [
        //{label: '玩法/投注内容  ', name: 'title', key: true, width: '43%'},
        {label: '玩法/投注内容  ', name: 'title', key: true, width: '55%'},
        //{label: '奖金模式', name: 'bonusMode', width: '20%'},
        {label: '注数/倍数/模式', name: 'mode', width: '45%'}
        //{label: '注数/倍数/模式', name: 'mode', width: '20%'}
        //{label: '投注金额', name: 'bettingMoney', width: '17%'}
      ],
      showHeader: false,
      height: 91,
      startOnLoading: false,
      emptyTip: ''
    }).staticGrid('instance');


    this.lotteryCurrResultPreview = this.$lotteryCurrResultPreview.staticGrid({
      tableClass: 'table_bg table-dashed',
      colModel: [
        {label: '玩法/投注内容  ', name: 'title', key: true, width: '48%'},
        {label: '奖金模式', name: 'bonusMode', width: '12%'},
        {label: '注数', name: 'statistics', width: '12%'},
        {label: '倍数', name: 'multiple', width: '12%'},
        {label: '状态', name: 'status', width: '16%'}
      ],
      showHeader: false,
      height: 91,
      startOnLoading: false,
      emptyTip: ''
    }).staticGrid('instance');

    this.lotteryTotalResultPreview = this.$lotteryTotalResultPreview.staticGrid({
      tableClass: 'table_bg table-dashed',
      colModel: [
        {label: '批次', name: 'title', key: true, width: '40%'},
        {label: '开奖结果  ', name: 'result', key: true, width: '45%'},
        {label: '状态', name: 'status', width: '15%'}
      ],
      showHeader: false,
      height: 91,
      startOnLoading: false,
      emptyTip: ''
    }).staticGrid('instance');

    this.bettingRecordsView = new BettingRecordsView({
      el: this.$recordsContainer,
      ticketId: this.options.ticketId
    }).render();

    var sign = Global.localCache.get('ticketList.' + this.options.ticketId);

    if (sign) {
      this.rulesCollection.reset(this.rulesCollection.parse(Global.localCache.get(sign)));
      this.rulesCollection.trigger('sync:fromCache');
    }

    this.RefreshJackpotInfo = setInterval(function(){
      self.getJapepotInfoXhr({ticketId: self.options.ticketId}).done(function (res) {
        if (res.result === 0) {
          if (res.root) {
            self.$JackpotTotal.html(_(res.root.mainJakepot).convert2yuan());
            self.$JackpotCrown.html(_(res.root.sub1Jakepot).convert2yuan());
            self.$JackpotDiamond.html(_(res.root.sub2Jakepot).convert2yuan());
            self.$JackpotGold.html(_(res.root.sub3Jakepot).convert2yuan());
            self.$JackpotEgg.html(_(res.root.sub4Jakepot).convert2yuan());
          }
        }
      });
    },2000);
    this.RefreshJackpotNoticeInfo = setInterval(function(){
      self.getNoticeXhr().done(function(res){
        if(res.result ===0 ){
          var noticeList = res.root.dataList;
          if(_(noticeList).size()>0){
            self.$JackpotNoticeContainer.addClass('bc-smmc-jackpot-notice-height');
            var html = [];
            html.push('<ul>');
            _(noticeList).each(function(item,index){
              html.push('<li>中奖公告：恭喜'+item.userName+'，进入老虎机秒秒彩'+item.type+',并从'+item.type+'中获得<span>'+_(item.bonus).convert2yuan() +'</span>奖金，特此表示祝贺</li>');
            });
            html.push('</ul>');
            self.$JackpotNoticeContainer.html(html.join(''));
          }else{
            self.$JackpotNoticeContainer.removeClass('bc-smmc-jackpot-notice-height');
            self.$JackpotNoticeContainer.html('');
          }
        }
      })
    },15000);
    self.noticeInterval = setInterval(function(){
      self.$JackpotNoticeContainer.find("ul:first").animate({
        marginTop: "-38px"
      }, 500, function () {
        $(this).css({marginTop: "0px"}).find("li:first").appendTo(this);
      });

    },5000);

    //this.openTreasureChests();
    //this.goIntoFreeGame();
    //this.goIntoJackpot();
  },

  autoScroll: function () {

  },

  initNumRange: function () {
    var self = this;
    this.$multiRange.numRange({
      onChange: function (num) {
        self.model.set('multiple', num);
      },
      onOverMax: function (maxNum) {
        Global.ui.notification.show(
          '您填写的倍数已超出平台限定的单注中奖限额<span class="text-sunshine">' +
          _(self.rulesCollection.limitMoney).convert2yuan() + '</span>元，' +
          '已为您计算出本次最多可填写倍数为：<span class="text-sunshine">' + maxNum + '</span>倍'
        );
      }
    });
  },


  renderBasicRules: function () {
    var playLevels = this.rulesCollection.getPlayLevels();

    this.$basicRules.html(this.playLevelTpl({
      ruleClass: 'js-bc-basic-rule',
      rules: playLevels.normalList
    }));

    if (!_(playLevels.optionalList).isEmpty()) {
      this.$rules.removeClass('rule-hide-optional');
      this.$optionalRules.html(this.playLevelTpl({
        ruleClass: 'js-bc-basic-rule',
        rules: playLevels.optionalList
      }));
    }

    this.selectDefaultPlay();
  },

  selectDefaultPlay: function () {
    var defaultSelectInfo = this.options.ticketInfo.info.defaultSelectPlay.split(',');
    if (!_(defaultSelectInfo).isEmpty()) {
      if (_(Number(defaultSelectInfo[0])).isFinite()) {
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
      if (_(Number(defaultSelectInfo[1])).isFinite()) {
        this.$advanceRules.find('.js-bc-advance-rule').eq(defaultSelectInfo[1]).trigger('click');
      }
    } else {
      this.$basicRules.find('.js-bc-basic-rule').eq(0).trigger('click');
    }

  },

  renderAdvanceRules: function (levelId) {
    var advanceRules = this.rulesCollection.getPlayGroups(levelId);
    var length = advanceRules.length;

    this.$advanceRules.html(_(advanceRules).map(function (rules, index) {
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

  renderPlayInfo: function (playInfo) {
    this.$playExample.text(playInfo.playExample).attr('title', playInfo.playExample);

    if (this.$playTip.data('popover')) {
      this.$playTip.popover('destroy');
    }

    this.$playTip.popover({
      trigger: 'hover',
      container: this.$el,
      html: true,
      content: playInfo.playDes.replace(/\|/g, '<br />'),
      placement: 'bottom'
    });

    this.renderPlayBetMode();
    //初始化奖金
    this.model.set({
      maxMultiple: playInfo.betMultiLimitMax,
      userRebate: playInfo.userRebate
    });
  },

  renderNumRange: function (model, formatMaxMultiple) {
    this.$multiRange.numRange('setRange', 1, formatMaxMultiple);
  },

  renderPlayBetMode: function () {
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

  renderPlayArea: function (groupId, playId) {
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

    this.currentPlayAreaView.on('statistic', function (statistics) {
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

  renderSelectStatisticsInfo: function () {
    var statisticsInfo = this.model.getStatisticsInfo();
    this.$statisticsLottery.text(statisticsInfo.statistics);
    this.$statisticsMoney.text(statisticsInfo.prefabMoney);
    this.$statisticsRebateMoney.text(statisticsInfo.rebateMoney);
  },

  renderMaxBonus: function (model, formatMaxBonus) {
    this.$statisticsBonus.text(_(formatMaxBonus).convert2yuan());
  },

  renderTotalLotteryInfo: function (model, totalInfo) {
    this.$totalLottery.text(totalInfo.totalLottery);
    this.$totalMoney.text(_(totalInfo.totalMoney).convert2yuan());
    this.$totalRebateMoney.text(_(totalInfo.totalRebateMoney).convert2yuan());
  },

  getBonusMode: function (bonus, unit, userRebate, betMethod) {
    var bonusMode = _(bonus).chain().div(10000).mul(unit).convert2yuan().value();
    if (betMethod) {
      bonusMode += '/' + _(userRebate).div(10) + '%';
    } else {
      bonusMode += '/0.0%';
    }
    return bonusMode;
  },

  renderLotteryPreviewAdd: function () {
    var previewList = this.model.get('previewList');
    var self = this;

    var rows = _(previewList).map(function (previewInfo) {
      var title = '【' + previewInfo.levelName + '_' + previewInfo.playName + '】 ';
      if (previewInfo.formatBettingNumber.length > 20) {
        title += '<a href="javascript:void(0)" class="js-bc-betting-preview-detail btn-link bc-betting-preview-detail">' +
          previewInfo.formatBettingNumber.slice(0, 20) + '...</a>';
      } else {
        title += previewInfo.formatBettingNumber;
      }

      return {
        title: title,
        bonusMode: this.getBonusMode(previewInfo.maxBonus, previewInfo.unit, previewInfo.userRebate, previewInfo.betMethod),
        mode: previewInfo.statistics + '注 / ' + previewInfo.multiple + '倍 / <span class="">' + _(previewInfo.prefabMoney).convert2yuan() + '</span>元' +
        '<div class="js-bc-lottery-preview-del lottery-preview-del icon-block m-right-lg pull-right"></div>'
      };

    }, this);

    var $rows = this.lotteryPreview.renderRow(rows);

    $rows.each(function (index, row) {
      var $row = $(row);
      var $detail = $row.find('.js-bc-betting-preview-detail');
      var betNumber = previewList[index].bettingNumber;
      var is11X5 = (self.options.ticketInfo.title.indexOf('11选5') !== -1);
      betNumber = is11X5 ? betNumber : betNumber.replace(/ /g, '');
      if ($detail.length) {
        $detail.popover({
          title: '详细号码',
          trigger: 'click',
          html: true,
          container: this.$el,
          content: '<div class="js-pf-popover"><span class="word-break">' + betNumber + '</span></div>',
          placement: 'right'
        });
      }
    });

    this.$lotteryPreview.scrollTop(0);
  },
  renderLotteryPreviewDel: function (model, index) {
    if (_.isUndefined(index)) {
      this.lotteryPreview.renderEmpty();
    } else {
      this.lotteryPreview.delRow(index);
    }
  },

  addSelectLottery: function () {
    var bettingInfo = this.currentPlayAreaView.getBetting();
    var result = this.model.addPrevBet({
      lotteryList: bettingInfo.rowsResult,
      selectOptionals: bettingInfo.selectOptionals,
      format: bettingInfo.format,
      type: 'select'
    });

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

  addInputLottery: function () {
    var bettingInfo = this.currentPlayAreaView.getBetting();
    var result = this.model.addPrevBet({
      lotteryList: bettingInfo.passNumbers,
      selectOptionals: bettingInfo.selectOptionals,
      format: bettingInfo.format,
      type: 'input'
    });

    if (result) {
      if (!_.isEmpty(result)) {
        Global.ui.notification.show('您选择的号码在号码篮已存在，将直接进行倍数累加');
      }
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

      this.currentPlayAreaView.empty();
    } else {
      Global.ui.notification.show('号码选择不完整，请重新选择！');
    }
  },

  destroy: function () {
    Base.ItemView.prototype.destroy.apply(this, arguments);
    clearInterval(this.timer);
    clearInterval(this.RefreshJackpotInfo);
    clearInterval(this.RefreshJackpotNoticeInfo);
    clearInterval(this.noticeInterval);
    this.BeenDistoryed = true;
    _(this.TimeOutArr).each(function (item, index) {
      console.log('distroy timeout:index=' + index + ',item=' + item);
      clearTimeout(item);
    })
  },

  //event handlers

  //openVideoHandler: function(e) {
  //  var $target = $(e.currentTarget);
  //
  //  $target.attr('href', this.infoModel.getVideoUrl() || 'javascript:void(0)');
  //},

  baseRuleChange1Handler: function(e) {
    this.$('.js-bc-advance-rules').hide();
  },

  baseRuleChangeMOHandler: function(e) {
    this.$('.js-bc-advance-rules').show();
  },
  baseRuleChangeMO1Handler: function(e) {
    this.$('.js-bc-advance-rules').hide();
  },


  baseRuleChangeHandler: function (e) {
    this.$('.js-bc-advance-rules').show();

    var $target = $(e.currentTarget);
    $target.addClass('active').siblings().removeClass('active');

    this.model.set({
      levelId: $target.data('id'),
      levelName: $target.data('title')
    });

    var idStr =  ''+$target.data('index');
    idStr = parseInt(idStr);
    var playValue = (idStr+1)*82 +6;//(idStr+1)*69 +30;

    this.$('.js-bc-advance-rules').css('left',playValue+'px');
    this.$('.js-rule-title-hidden-temp').html(idStr);

    this.$('.js-rule-title-clear').html('');
  },

  togglePlayModeHandler: function (e) {
    var $target = $(e.currentTarget);
    var type = $target.data('type');
    $target.addClass('active').siblings().removeClass('active');
    if (type === 'normal') {
      this.$basicRules.find('.js-bc-basic-rule').eq(0).trigger('click');
      this.$basicRules.removeClass('hidden');
      this.$optionalRules.addClass('hidden');
    } else {
      this.$optionalRules.find('.js-bc-basic-rule').eq(0).trigger('click');
      this.$basicRules.addClass('hidden');
      this.$optionalRules.removeClass('hidden');
    }
  },

  advanceRuleChangeHandler: function (e) {
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

  betModeChangeHandler: function (e) {
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

  monetaryUnitChangeHandler: function (e) {
    var $target = $(e.currentTarget);
    $target.addClass('active').siblings().removeClass('active');

    this.model.set('unit', $target.data('rate'));
  },

  lotteryAddHandler: function (e) {
    var status = this.$btnConfirm.data('status');
    if (status !== '1' && status !== 1) {
      return false;
    }

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

  lotteryAutoAddHandler: function (e) {
    var $target = $(e.currentTarget);

    if (!this.model.get('multiple')) {
      Global.ui.notification.show('倍数为0，不能投注');
      return false;
    }

    var lotteryResults = this.currentPlayAreaView.create(Number($target.data('times')));
    var result = this.model.addAutoBets(lotteryResults);

    if (!_.isEmpty(result)) {
      Global.ui.notification.show('您选择的号码在号码篮已存在，将直接进行倍数累加');
    }
  },

  lotteryClearHandler: function () {
    this.model.emptyPrevBetting();
  },

  lotteryPreviewDelHandler: function (e) {
    var $target = $(e.currentTarget);
    var $row = $target.closest('.js-gl-static-tr');
    this.model.delPrevBetting($row.index());
  },

  startlotteryHandler: function (e) {
    var status = this.$btnConfirm.data('status');//按钮状态：当前事件仅处理“1-马上开奖，3-再玩一次”这两个状态，“2-停止”由另一事件处理。
    if (status === '2' || status === 2) {
      return false;
    } else {
      this.lotteryConfirmHandler();
    }
  },

  //波动拉杆,或者点击按钮
  lotteryConfirmHandler: function (e) {



    var self = this;

    var status = this.$btnConfirm.data('status');//按钮状态：当前事件仅处理“1-马上开奖，3-再玩一次”这两个状态，“2-停止”由另一事件处理。
    if (status === '2' || status === 2) {
      this.UserStop = true;//定义变量标记，用户操作了停止按钮。
      this.$btnConfirm.text('开奖中');
      this.$btnConfirm.prop('disabled', true);
      return false;
    }
    this.BetinfoList = [];

    this.BeenDistoryed = false;
    this.UserStop = false;//用户终止
    this.NetException = false;//网络异常
    this.BettingFail = false;//投注失败
    this.HasWin = false;//中奖
    this.TotalPrize = 0;

    this.BetTimes = this.$LotteryTime.val();
    this.LeftTimes = this.BetTimes;
    this.WinStop = this.$WinStop.prop('checked');
    var info = this.model.pick('totalInfo', 'previewList');
    if (this.isBegin) return false;

    var inputCount = _(info.previewList).reduce(function (inputCount, previewInfo) {
      if (previewInfo.type === 'input') {
        inputCount += previewInfo.statistics;
      }
      return inputCount;
    }, 0);

    if (inputCount > 100000) {
      Global.ui.notification.show('非常抱歉，目前平台单式投注只支持最多10万注单。');
      return false;
    }
    if (_.isEmpty(info.previewList)) {
      Global.ui.notification.show('请至少选择一注投注号码！');
      return false;
    }

    if (info.totalInfo.totalMoney > Global.memoryCache.get('acctInfo').balance) {
      Global.ui.notification.show('账号余额不足，请先<a href="javascript:void(0);" class="btn-link btn-link-pleasant js-fc-re"  data-dismiss="modal">充值</a>。');
      return false;
    }

    //var confirm = $(document).confirm({
    //  title: '确认投注',
    //  content: this.confirmTpl({
    //    ticketInfo: this.options.ticketInfo,
    //    ticketName: this.options.ticketName,
    //    totalInfo: this.model.get('totalInfo'),
    //    previewList: info.previewList
    //  }),
    //  //size: 'modal-md',
    //  agreeCallback: function() {
    //
    //  }
    //}).confirm('instance');

    if (status === '1' || status === 1) {
      this.toggleShowDealOnce();
    } else {
      this.$reSelectBtn.addClass('hidden');
      this.toggleStopButton();
    }


    this.dealCycle();
    $('.bc-lottery-add').hide();

  },
  toggleShowDealOnce: function () {
    //隐藏选号区域
    this.toggleMainAreaShow();
    //隐藏选号记录
    this.togglePrevBettingShow();
    //隐藏连续投注输入框
    this.toggleContinueLotteryShow();
    //隐藏投注概要
    this.toggleBriefShow();
    //切换按钮文字由‘马上开奖’为'停止'，'再玩一次'为‘马上开奖’
    this.toggleSoonButton();
  },
  // 连续投注当期数据显示， 开始摇奖动画，下单，显示结果，循环调用？循环||终止
  dealCycle: function () {
    this.isBegin = true;
    this.isReturn = false;//由于后续对isBegin的状态更新相对请求返回会有延迟，导致可能在初始动画中如果使用isBegin变量的判断可能出现误差，因此引入此状态
    this.LeftTimes--;
    this.BetinfoList.push({status: '0'});
    this.BetRes = undefined;
    this.showWinResult(false);
    this.showLastResult(false);
    this.showLotteryTime(true, this.BetTimes - this.LeftTimes);
    if (!this.BeenDistoryed) {
      //1.开始动画
      this.startAnimate();
    }
    if (!this.BeenDistoryed) {
      //2.开始投注
      this.startBetting();
    }

  },

  startAnimate: function () {
    var self = this;
    //1.显示本轮投注数据、状态
    self.showCurrIsBetting();
    //2.处理拉杆及按钮状态
    this.$btnStart.addClass('active');
    self.$('.js-bc-btn-lottery-confirm').button('loadding');
    //3.准备动画参数
    var easing1 = 'linear';
    this.delay = 9;//测试环境，动画持续最长10S（未被外部强制终止的情况），6s内返回，则固定为6s停止，6s后返回，则固定增加1s
    this.left = 9;
    var height = 116;//转动图片中每个数字的高度
    this.$(".mmc-num").css('backgroundPosition', '50% 0');//数字复位
    var result = '0,0,0,0,0';//初始化动画结束的位置
    var resultArr = (result + '').split(',');
    self.$(".js-bc-smmc-num-wrapper").removeClass('bc-smmc-num-win-icon');
    //4.依次让五个数字开始转动
    this.$(".mmc-num").each(function (index) {
      var $num = $(this);
      //启动每个数字的动画延时为50ms

      var AnimateTimeOut = setTimeout(function () {
        // "50px"为偏移量，确保动画自动终止不会停在正常位置,位置定位10*height为转动一圈
        $num.animate({
          'backgroundPosition': '50% ' + ((height * 10 * self.delay * self.delay ) - (height * resultArr[index]) + 58) + 'px'
        }, {
          duration: 1000 * self.delay + index * 50,
          easing: easing1,
          complete: function () {
            if (index == 0) {
              if (!self.isReturn) {
                self.isBegin = false;
                self.isReturn = true;
                //TODEL 待删除
                clearInterval(self.leftSecondCount);
                self.openException();
                //顺序，以下两句相关
                self.NetException = true;
                self.showCurrResult();
                //提示异常
                Global.ui.notification.show('网络出现异常，本次投注结果获取失败！请前往投注记录查看投注详情！', {
                  type: 'fail'
                });
                self.refreshOpenHistory();
                self.refreshJackpotInfo();
                //self.refreshExperienceInfo();
                self.toggleStopButton();
              }
            }
          }
        });
      }, 50);

      self.TimeOutArr.push(AnimateTimeOut);
    });
    //TODEL  开发用于计时测试。待删除
    this.leftSecondCount = setInterval(function () {
      self.left--;
      console.log('this.left:' + self.left)
    }, 1000);
  },

  openException: function () {
    var self = this;
    //先影藏一下数字，并停止5个数字的所有动画
    this.$(".mmc-num").addClass('hidden');
    this.$(".mmc-num").stop();
    //号码复位，显示
    var OpenExceptionTimeOut = setTimeout(function () {
      self.$(".mmc-num").css('backgroundPosition', '50% 0');
      self.$(".mmc-num").removeClass('hidden');
    }, 1000);
    this.TimeOutArr.push(OpenExceptionTimeOut);
  },

  //开始投注
  startBetting: function () {
    var self = this;
    self.model.saveBettingXhr('mmc')
      .always(function () {
        self.$('.js-bc-btn-lottery-confirm').button('reset');
        self.$btnStart.removeClass('active');

      })
      .done(function (res) {
        console.log('请求已返回：' + self.isReturn + '--' + self.isBegin);
        if (!self.isReturn && self.isBegin && !self.BeenDistoryed) {
          self.isReturn = true;

          //保存投注结果对象
          var betInfo = self.BetinfoList[self.BetTimes - self.LeftTimes - 1];
          if (res && res.result === 0) {
            //TODO .正常停止摇奖,显示号码，
            self.BetRes = res.root;
            betInfo.result = res.root.openCode;
            betInfo.status = '1';
            betInfo.bonus = res.root.winPrize;
            self.normalStop(res.root ? res.root : {openCode: '0,0,0,0,0'});
          } else {
            //1.异常终止
            betInfo.status = '2';
            self.BetRes = 0;
            self.abend(res);
          }
        } else {
          //请求成功，

        }
      }).fail(function (res) {
      self.isReturn = false;
    });
  },

  //正常终止,num为开奖号
  normalStop: function (root) {

    var self = this;
    var easing2 = 'linear';//动画类型
    var height = 116;//滚动动画中的每个数字的高度

    //TODEL  待删除，开发时测试用于获取接口延时开奖情况
    clearInterval(self.leftSecondCount);

    console.log('this.left in stop:' + self.left);
    console.log('this.isBegin in stop:' + self.isBegin);
    var showIconIndex =_( [0,1,2,3,4]).shuffle();
    var num = this.BetRes.icons;
    var showList = showIconIndex.slice(0,num);
    //如果单次开奖还未终止
    if (self.isBegin) {
      var resultArr = (root.openCode + '').split(',');
      self.$(".mmc-num").each(function (index) {
        var $num = $(this);
        var second = 0.5;
        var delay = 200;
        var stopAnimateTimeout =
          setTimeout(function () {
            //1.停止之前固定时间的动画
            $num.stop();
            $num.css('backgroundPosition', '50% 0');
            //$num.css('top',0);
            //计算剩余动画持续的时间，如果未超过3s,则总计运行3s.如果超过3s则默认运行0.5s后停下来（为了持续动画效果）
            var maxSec = 2.5;
            if (self.left > (9 - maxSec)) {
              second = maxSec + self.left - 9;
            }
            //2.开始新的动画，剩余几秒则滚动几圈

            $num[0].style.backgroundPositionY = '0px';
            $num.animate({
              'backgroundPosition': '50% ' + ((height * 10 * 9 * (100*((index+1)*(index+1)))) - (height * resultArr[index])) + 'px'
            }, {
              duration: 1000 * second + (index) * delay,
              easing: easing2,
              complete: function () {
                if(num>0){
                  if(_(showList).contains(index)){
                    self.$(".js-bc-smmc-num-wrapper").eq(index).addClass('bc-smmc-num-win-icon');
                  }
                }
                if (index == 4) {
                  //待第五个数字完全停止
                  self.isBegin = false;
                  Global.m.oauth.check();
                  //1.更新开奖状态
                  self.showCurrResult();
                  //TODO 2.更新开奖记录
                  self.refreshOpenHistory();
                  self.refreshJackpotInfo();
                  //self.refreshExperienceInfo();
                }
              }
            });
          }, delay * index);
        self.TimeOutArr.push(stopAnimateTimeout);
      });
    }
  },

  //异常终止
  abend: function (res) {

    if (this.isBegin) {
      //更新开始状态
      this.isBegin = false;
      this.BettingFail = true;
      this.openException();

      //TODEL 待删除，开发时测试用于获取接口延时开奖情况
      clearInterval(this.leftSecondCount);
      this.refreshOpenHistory();
      this.refreshJackpotInfo();
      //this.refreshExperienceInfo();
      //1.异常停止摇奖
      if (res.root && res.root.errorCode === 101) {
        Global.ui.notification.show('账号余额不足，请先<a href="javascript:void(0);" class="btn-link btn-link-pleasant js-fc-re"  data-dismiss="modal">充值</a>。');
      } else {
        Global.ui.notification.show(res.msg || '');
      }
      this.showCurrResult();
    }

  },

  toggleMainAreaShow: function () {
    this.$MainArea.slideToggle(500);
    var $MainAreaWrapper = this.$('.js-bc-main-area-wrapper');
    if ($MainAreaWrapper.hasClass('bc-smmc-main-area')) {
      $MainAreaWrapper.removeClass('bc-smmc-main-area')
    } else {
      var timeout =  setTimeout(function () {
        $MainAreaWrapper.addClass('bc-smmc-main-area')
      }, 400);
      this.TimeOutArr.push(timeout);
    }
  },
  toggleContinueLotteryShow: function () {
    this._toggleShow(this.$('.js-bc-mmc-continue-lottery'));
  },
  toggleBriefShow: function () {
    this._toggleShow(this.$('.js-bc-total-brief'));
  },
  togglePrevBettingShow: function () {
    this._toggleShow(this.$lotteryPreview);
  },
  togglePrevBettingCurrResultShow: function () {
    this._toggleShow(this.$lotteryCurrResultPreview);
  },
  togglePrevBettingTotalResultShow: function () {
    this._toggleShow(this.$lotteryTotalResultPreview);
  },
  _toggleShow: function ($target) {
    if ($target) {
      if ($target.hasClass('hidden')) {
        $target.removeClass('hidden');
      } else {
        $target.addClass('hidden');
      }
    }
  },
  //切换按钮文字由‘马上开奖’为'停止'，'再玩一次'为‘马上开奖’
  toggleSoonButton: function () {
    this.UserStop = false;
    if (this.$btnConfirm.data('status') === '1' || this.$btnConfirm.data('status') === 1) {
      this._setConfirmButton('2');
    } else {
      this._setConfirmButton('1');
    }
  },
  //切换按钮文字由‘停止’为'再玩一次'，'再玩一次'为‘停止’
  toggleStopButton: function () {
    this.UserStop = false;
    if (this.$btnConfirm.data('status') === '2') {
      this._setConfirmButton('3');
    } else {
      this._setConfirmButton('2');
    }
  },

  _setConfirmButton: function (status) {
    this.$btnConfirm.removeClass('disabled');
    this.$btnConfirm.prop('disabled', false);
    if (status === '1') {
      this.$btnConfirm.text('马上开奖');
      this.$btnConfirm.data('status', 1);
    } else if (status === '2') {
      this.$btnConfirm.text('停止');
      this.$btnConfirm.data('status', 2);
    } else if (status === '3') {
      this.$btnConfirm.text('再玩一次');
      this.$btnConfirm.data('status', 3);
    }
  },
  //重新选号按钮事件
  reSelectHandler: function () {
    $('.bc-lottery-add').show();
    this.showLotteryTime(false);
    this.$reSelectBtn.addClass('hidden');
    this.$lotteryCurrResultPreview.addClass('hidden');
    this.$lotteryTotalResultPreview.addClass('hidden');
    this.toggleShowDealOnce();
    this.model.emptyPrevBetting();//删除之前的选号
    this.showWinResult(false);
    this.showLastResult(false);
    this.$LotteryTime.val(1);
    this.$WinStop.prop('checked', false);

  },

  //当次下单结束，显示当前结果，并进入下一个流程
  showCurrResult: function () {
    var self = this;
    //隐藏整体投注结果，清空投注结果
    this.$lotteryTotalResultPreview.addClass('hidden');
    this.$lotteryCurrResultPreview.removeClass('hidden');
    //显示本轮订单中奖详情,中奖金额或未中奖
    this.renderlotteryCurrResultPreview();
    //TODO 刷新记录，判断是否中奖
    if (this.BetRes && this.BetRes.winPrize && Number(this.BetRes.winPrize) > 0) {
      this.TotalPrize = this.TotalPrize + this.BetRes.winPrize;
      this.HasWin = true;
      //中奖才弹中奖提示
      this.showWinResult(true, this.BetRes.winPrize);
      //Global.ui.notification.show('<div class="bc-mmc-bet-result-win">单次中奖</div>', {
      //  type: 'success'
      //});
    } else {
      this.showWinResult(false);
    }

    //TODO 当期投注结果显示停留时间，待调整
    var flag = false;
    flag = this.LeftTimes > 0 && !this.UserStop && !this.NetException && !this.BettingFail && !(this.WinStop && this.HasWin);//新的一轮开始时，需要重置
    console.log('showCurrResult: UserStop-' + this.UserStop);
    if (flag) {
      //5。未完毕，开启延时连续投注
      //todo 5.1.判断当前是否进入特殊流程
      self.specialProcess(true);

    } else {
      self.specialProcess(false);

    }
  },

  showTotalResult: function () {
    var self = this;
    var timeout = setTimeout(function () {
      //1.显示‘再玩一次’，显示‘重新选号’
      self._setConfirmButton('3');
      self.$reSelectBtn.removeClass('hidden');
      if (((self.BetTimes == 1 && self.TotalPrize == 0) || self.BetTimes > 1) && !self.NetException && !self.BettingFail) {
        self.showLastResult(true, self.TotalPrize);
      }
      //显示整体投注结果，当前最近一期为‘异常终止’，后续投注为“未投注”，之前投注为‘未中奖’或‘金额’
      if (self.BetTimes > 1) {
        //2隐藏当前期投注结果,清除数据
        self.$lotteryCurrResultPreview.addClass('hidden');
        self.$lotteryTotalResultPreview.removeClass('hidden');
        self.renderlotteryTotalResultPreview();
      }
    }, 1000);
    this.TimeOutArr.push(timeout);
  },

  showCurrIsBetting: function () {
    //隐藏整体投注结果，清空投注结果
    this.$lotteryTotalResultPreview.addClass('hidden');
    this.$lotteryCurrResultPreview.removeClass('hidden');
    //显示当前期投注结果，开奖中，
    this.renderlotteryCurrResultPreview();
  },
  //TODO 更新开奖记录
  refreshOpenHistory: function () {
    var self = this;
    this.getOpenHistoryXhr({
      pageSize: 10,
      ticketId: this.options.ticketId
    }).done(function (res) {
      if (res.result == 0) {
        var openedList = _(res.root).map(function (item) {
          return item.lotteryResult;
        });
        var html = [];
        //openedList = ['34567','56789','89012','54682','56289','83321','34267','56089','89012','49023'];
        _(openedList).each(function (item, index) {
          html.push(self.generateOpenHistoryHtml(item));
        });
        self.$OpenHistory.fadeOut('fast', function () {
          self.$OpenHistory.html(html.join('') + '</div>').after('');
          self.$OpenHistory.fadeIn();
        });

      }
    });
  },
  generateOpenHistoryHtml: function (result) {
    var html = [];
    var resultArr = result.split(',');
    _(resultArr).each(function (item, index) {
      html.push('<span>' + item + '</span>')
    });
    return '<div class="bc-mmc-open-history-num">' + html.join('') + '</div>';
  },

  //TODO
  renderlotteryCurrResultPreview: function () {
    var previewList = this.model.get('previewList');
    var self = this;
    //var size = _(previewList).size();
    var rows = _(previewList).map(function (previewInfo, index) {
      var title = '【' + previewInfo.levelName + '_' + previewInfo.playName + '】 ';
      if (previewInfo.formatBettingNumber.length > 20) {
        title += '<a href="javascript:void(0)" class="js-bc-betting-curr-preview-detail btn-link bc-betting-preview-detail">' +
          previewInfo.formatBettingNumber.slice(0, 20) + '...</a>';
      } else {
        title += previewInfo.formatBettingNumber;
      }
      var status = '开奖中';

      if (this.BetRes) {
        status = '未中奖';
        // if(this.BetRes.openResultList &&_(this.BetRes.openResultList).size()===size){
        var bonus = this.BetRes.openResultList[index].winPrize;
        if (Number(bonus) > 0) {
          status = '<span class="bc-mmc-gold-coin-win " ></span>中奖' + _(bonus).convert2yuan() + '元';
        }
        //  }

      } else if (this.BetRes === 0) {
        status = '投注失败';
      }

      return {
        title: title,
        bonusMode: previewInfo.formatUnit,
        statistics: previewInfo.statistics + '注',
        multiple: previewInfo.multiple + '倍',
        status: status
      };
    }, this);

    var $rows = this.lotteryCurrResultPreview.renderRow(rows);

    $rows.each(function (index, row) {
      var $row = $(row);
      var $detail = $row.find('.js-bc-betting-curr-preview-detail');
      var betNumber = previewList[index].bettingNumber;
      var is11X5 = (self.options.ticketInfo.title.indexOf('11选5') !== -1);
      betNumber = is11X5 ? betNumber : betNumber.replace(/ /g, '');
      if ($detail.length) {
        $detail.popover({
          title: '详细号码',
          trigger: 'click',
          html: true,
          container: self.$el,
          content: '<div class="js-pf-popover"><span class="word-break">' + betNumber + '</span></div>',
          placement: 'right'
        });
      }
    });

    this.$lotteryCurrResultPreview.scrollTop(0);
  },

  //TODO
  renderlotteryTotalResultPreview: function () {
    var betList = this.model.get('betList');
    var self = this;
    var betTimes = _.range(0, this.BetTimes, 1);
    var rows = _(betTimes).map(function (index) {
      var betInfo = self.BetinfoList[index] || {};
      var result = betInfo.result;
      var status = betInfo.status;
      var bonus = betInfo.bonus;
      if (status === '0') {
        status = '待确认';

      } else if (status === '1') {
        if (bonus > 0) {
          status = '<span class="bc-mmc-gold-coin-win " ></span>中奖' + _(bonus).convert2yuan() + '元';
        } else {
          status = '未中奖';
        }
      } else if (status === '2') {
        status = '投注失败';//异常失败
      } else {
        status = '未投注';//用户取消，或者异常终止投注
      }

      if (result === '' || !result) {
        result = '<span class="bc-mmc-result-num">-</span><span class="bc-mmc-result-num">-</span><span class="bc-mmc-result-num">-</span>' +
          '<span class="bc-mmc-result-num">-</span><span class="bc-mmc-result-num">-</span>';
      } else {
        result = _(result.split(',')).reduce(function (memo, num) {
          return memo + '<span class="bc-mmc-result-num">' + num + '</span>';
        }, '');
      }

      return {
        title: '第' + (index + 1) + '次开奖',
        result: '开奖号码' + result,
        status: status
      };

    });
    var $rows = this.lotteryTotalResultPreview.renderRow(rows);
    this.$lotteryTotalResultPreview.scrollTop(0);
  },

  betTimesHandler: function (e) {
    var $target = $(e.currentTarget);
    var times = $target.data('id');
    if (times > 0) {
      this.$LotteryTime.val(times);
    } else {
      e.stopPropagation();
      //e.preventDefault();
    }
  },
  openHistoryTurnPage: function (e) {
    var self = this;
    if (!this.canTrunPage) {
      return;
    }

    var type = $(e.currentTarget).data('type');
    var height = -36;
    var $target = this.$OpenHistory;
    var currentY = $target.position().top;
    var speed = 500;
    var easing = 'linear';
    if (type === 'up') {
      if (currentY > -252) {
        this.canTrunPage = false;
        $target.animate({'top': currentY + height}, speed, easing, function () {
          self.canTrunPage = true;
        })
      }
      //$target.fadeOut(speed,function() {
      //  $target.css('top', currentY + height);
      //  $target.fadeIn(speed);
      //});
    } else {
      if (currentY < 0) {
        this.canTrunPage = false;
        $target.animate({'top': currentY - height}, speed, easing, function () {
          self.canTrunPage = true;
        })

      }
    }

  },
  showWinResult: function (flag, prize) {
    if (flag) {
      this.$CurrentResultMask.addClass('hidden');
      this.$CurrentResult.removeClass('hidden');
      this.$CurrentResult.html('<span>恭喜您，中奖金额为' + _(prize).convert2yuan() + '元！</span><div class="bc-mmc-result-win-gold"></div>');
    } else {
      this.$CurrentResult.addClass('hidden');
      this.$CurrentResult.html('<span></span>');
    }
  },
  showLastResult: function (flag, prize) {
    if (flag) {
      this.$CurrentResult.addClass('hidden');
      if (prize > 0) {
        this.$CurrentResultTotal.removeClass('bc-mmc-result-lost-total');
        this.$CurrentResultTotal.addClass('bc-mmc-result-win-total');
        this.$CurrentResultTotal.html('<span>总计中奖金额为<span class="bc-mmc-result-win-total-amount">' + _(prize).convert2yuan() + '</span>元</span>');
      } else {
        this.$CurrentResultTotal.removeClass('bc-mmc-result-win-total');
        this.$CurrentResultTotal.addClass('bc-mmc-result-lost-total');
        this.$CurrentResultTotal.html('<span></span>');
      }
      this.$CurrentResultMask.removeClass('hidden');
    } else {
      this.$CurrentResultMask.addClass('hidden');
      this.$CurrentResultTotal.html('<span></span>');
    }
  },
  lotteryTimesChange: function (e) {
    var $target = $(e.currentTarget);
    var val = Number($target.val());
    if (val !== NaN && _(val).isNumber()) {
      if (Number(val) > 50) {
        $target.val(50);
      } else if (Number(val) < 1) {
        $target.val(1);
      } else {
        $target.val(_(val).floor(0));
      }
    } else {
      $target.val(1);
    }
  },
  showLotteryTime: function (flag, time) {
    if (flag && time > 0) {
      this.$LotteryTimeShow.removeClass('hidden');
      this.$LotteryTimeShow.html('第<span class="bc-mmc-bet-times-num">' + time + '</span>次开奖');
    } else if (!flag) {
      this.$LotteryTimeShow.addClass('hidden');
      this.$LotteryTimeShow.html('');
    }
  },
  //主要获取销售状态
  getTicketInfoAndDeal: function () {
    var self = this;
    this.getTicketInfoXhr({ticketId: this.options.ticketId}).done(function (res) {
      if (res.result === 0) {
        if (res.root && res.root.sale) {

        } else {
          self.$btnAdd.prop('disabled', true);
          self.$btnConfirm.prop('disabled', true);
          self.$btnStart.prop('disabled', true);
          self.$('.js-bc-mmc-num-box').addClass('hidden');

          self.$('.js-bc-mmc-num-box-stop').removeClass('hidden');

        }
      } else {
        //self.$btnAdd.prop('disabled',true);
        //self.$btnConfirm.prop('disabled',true);
        //self.$btnStart.prop('disabled',true);
        //self.$('.js-bc-mmc-num-box').addClass('hidden');
        //self.$('.js-bc-mmc-num-box-stop').removeClass('hidden');
      }
    });

  },
  //更新奖池
  refreshJackpotInfo: function () {
    var self = this;

    this.getJapepotInfoXhr({ticketId: this.options.ticketId}).done(function (res) {
      if (res.result === 0) {
        if (res.root) {
          self.$JackpotTotal.html(_(res.root.mainJakepot).convert2yuan());
          self.$JackpotCrown.html(_(res.root.sub1Jakepot).convert2yuan());
          self.$JackpotDiamond.html(_(res.root.sub2Jakepot).convert2yuan());
          self.$JackpotGold.html(_(res.root.sub3Jakepot).convert2yuan());
          self.$JackpotEgg.html(_(res.root.sub4Jakepot).convert2yuan());
        }
      }

    });
  },
  //更新经验条
  //refreshExperienceInfo: function () {
  //  var self = this;
  //  this.getExperienceInfoXhr({ticketId: this.options.ticketId}).done(function (res) {
  //    if (res.result === 0) {
  //      if (res.root) {
  //        self.$ExperienceBar.css('width', _(res.root.experience).chain().div(res.root.end).mul(100).value() + 'px');
  //      }
  //    }
  //  });
  //},
  // todo 特殊流程判断及处理
  specialProcess: function (flag) {
    if (this.BetRes) {
      var type = this.BetRes.uniquePlayType;
      if (type === 1) {
        this.openTreasureChests(flag);//打开宝箱
      } else if (type === 2) {
        this.goIntoFreeGame(flag);//进入freegame
      } else if (type === 3) {
        this.goIntoJackpot(flag);//进入奖池
      } else {
        if (flag) {
          this.goOnNormalProcess();
        }else{
            this.showTotalResult();
        }
      }
    }else{
      this.showTotalResult();
    }

  },
  //todo 继续投注
  goOnNormalProcess: function () {
    var self = this;
    var delay = 1;
    var GoOnLottery = setTimeout(function () {
      self.dealCycle();
    }, 1000 * delay);
    self.TimeOutArr.push(GoOnLottery);
  },
  //打开宝箱
  openTreasureChests: function (flag) {
    var self = this;
    //弹层提示获得宝箱金额。点击按钮，继续
    var amount = _((this.BetRes && this.BetRes.bag && this.BetRes.bag.money) || 0).convert2yuan();
    var $dialog = Global.ui.dialog.show({
      body: this.treasureTpl({amount: amount}),
      modalClass: 'bc-smmc-treasure-modal'
    });
    $dialog.on('hidden.modal', function (e) {
      if (flag) {
        self.goOnNormalProcess();
      }else{
          self.showTotalResult();
      }
      $dialog.remove();
    });
  },
  //进入freegame
  goIntoFreeGame: function (flag) {
    var self = this;
    this.FreeGameStopAndGoOnLottery = true;
    this.FreeGameTotalPrize = 0;
    this.FreeGameHasWin = false;
    var modeList = (this.BetRes && this.BetRes.free) ;
    _(modeList).each(function (mode) {
      switch (mode.method) {
        case  10000:
          mode.formatUnit = '元';
          mode.modeClass = 'bc-smmc-free-game-yuan';
          break;
        case  1000:
          mode.formatUnit = '角';
          mode.modeClass = 'bc-smmc-free-game-jiao';
          break;
        case  100:
          mode.formatUnit = '分';
          mode.modeClass = 'bc-smmc-free-game-fen';
          break;
        case  10:
          mode.formatUnit = '厘';
          mode.modeClass = 'bc-smmc-free-game-li';
          break;
      }
    });

    var $dialog = Global.ui.dialog.show({
      body: this.freeGameTpl({
        play: this.BetRes.free[0].ticketPlay + ' ' + this.BetRes.free[0].ticketBetNum,
        modeList: modeList
      }),
      modalClass: 'bc-smmc-free-game-modal'
    });
    $dialog.find('.js-bc-smmc-free-game').on('click', function (e) {
      self.FreeGameStopAndGoOnLottery = false;//点击时会触发关闭当前弹层的事件，其中会判断是否继续之前的处理。需要阻止
      var freeId = $(e.currentTarget).data('id');
      var multiple = $(e.currentTarget).data('multiple');
      var method = $(e.currentTarget).data('method');
      self.freeMethod = method;
      self.freeId = freeId;
      self.freeModeList = modeList;
      self.freeFlag = flag;
      var formatUnit = '';

      if (method === 10000) {
        formatUnit = '元';
      } else if (method === 1000) {
        formatUnit = '角';
      } else if (method === 100) {
        formatUnit = '分';
      } else if (method === 10) {
        formatUnit = '厘';
      }
      self.FreeGamePreviewList = [{
        playName: self.BetRes.free[0].ticketPlay,
        levelName: '',
        formatBettingNumber: self.BetRes.free[0].ticketBetNum,
        bettingNumber: self.BetRes.free[0].ticketBetNum,
        formatUnit: formatUnit,
        statistics: '1',
        multiple: multiple
      }];
      //self.goIntoFreeGameProcess(freeId, multiple, modeList, flag);
      self.goIntoFreeGameProcess(freeId, multiple, method, modeList, flag);
      //$dialog.remove();
    });
    $dialog.on('hidden.modal', function () {
      if (self.FreeGameStopAndGoOnLottery && flag) {
        self.goOnNormalProcess();
      }else if(self.FreeGameStopAndGoOnLottery && !flag){
          self.showTotalResult();
      }
      $dialog.remove();
    });
  },
  //进入奖池
  goIntoJackpot: function (flag) {
    var self = this;
    var $dialog = Global.ui.dialog.show({
      body: this.CongratulationTpl({type: 1}),
      modalClass: 'bc-smmc-congratulation-modal'
    });

    var timeout = setTimeout(function () {
      $dialog.modal('hide');
    }, 3000);
    self.TimeOutArr.push(timeout);
    $dialog.on('hidden.modal', function (e) {
      self.showJackpotPage(flag);
      $dialog.remove();
    });
  },

  showJackpotPage: function (flag) {
    var self = this;
    var jackpotType = '';
    var jackpotLevel = '';
    var lastIcon = '';
    var crownCount = 0;
    var diamondCount = 0;
    var goldCount = 0;
    var eggCount = 0;
    var waitting = false;
    var goOnLottery = true;

    var $dialog = Global.ui.dialog.show({
      body: this.jackpotTpl(),//{jackpotIcon: jackpotIcon}
      modalClass: 'bc-smmc-jackpot-modal'
    });
    $dialog.on('hidden.modal', function (e) {
      //
      if (goOnLottery && flag) {
        self.goOnNormalProcess();
      }

      $dialog.remove();
    });
    $dialog.find('.js-bc-smmc-jackpot').on('click', function (e) {
      var target = $(e.currentTarget);
      if (target.find('.js-bc-smmc-jackpot-mode-item-wrapper').css('display')==='none') {
        if (!waitting) {
          waitting = true;
          self.getJackpotPrizeInfoXhr().always(function () {
            waitting = false;
          }).done(function (res) {

            if (res.result === 0) {
              self.JackpotRes = res;
              var lotteryType = res.root.lotteryType;
              var prize = res.root.bonus;
              var status = res.root.status;
              switch (lotteryType) {
                case 1:
                  lastIcon = 'crown';
                  crownCount++;
                  jackpotType = '皇冠';
                  jackpotLevel = '一等奖';
                  break;
                case 2:
                  lastIcon = 'diamond';
                  diamondCount++;
                  jackpotType = '钻石';
                  jackpotLevel = '二等奖';
                  break;
                case 3:
                  lastIcon = 'gold';
                  goldCount++;
                  jackpotType = '黄金';
                  jackpotLevel = '三等奖';
                  break;
                case 4:
                  lastIcon = 'egg';
                  eggCount++;
                  jackpotType = '金蛋';
                  jackpotLevel = '四等奖';
                  break;
              }
              //翻开图片
              target.find('.js-bc-smmc-jackpot-mode-item').addClass('bc-smmc-jackpot-mode-' + lastIcon);
              //target.children().removeClass('hidden');
              var verticalOpts = [{'width':1},{'width':'150px'}];
              $(target).find('.js-bc-smmc-jackpot-mode-item-unknown').stop().animate(verticalOpts[0],100,function(){
                $(this).hide().prev().show();
                $(this).prev().animate(verticalOpts[1],100);
              });

              //显示结果
              if ((crownCount === 3 || diamondCount === 3 || goldCount === 3 || eggCount === 3) && status) {
                self.refreshJackpotInfo();
                var timeout= setTimeout(function () {
                  goOnLottery = false;//隐藏前先将影响影藏时是否继续下单的判断条件置为false
                  $dialog.modal('hide');
                  var $dialogResult = Global.ui.dialog.show({
                    body: self.jackpotWinTpl({
                      jackpotType: jackpotType,
                      jackpotLevel: jackpotLevel,
                      prize: _(prize).convert2yuan()
                    }),
                    modalClass: 'bc-smmc-jackpot-win-modal'
                  });
                  $dialogResult.on('hidden.modal', function (e) {
                    if (flag) {
                      self.goOnNormalProcess();
                    }else{
                      self.showTotalResult();
                    }
                    $dialogResult.remove();
                  });
                }, 1000);
                self.TimeOutArr.push(timeout);
              }
            } else {
              Global.ui.notification.show('开奖失败，请重新开奖!')
            }
          });
        } else {
          Global.ui.notification.show('请等待开奖完成后再点击!')
        }
      }

    });
    //}

  },
  //goIntoFreeGameProcess: function (freeId, multiple, modeList, flag) {
  //  //开始动画
  //  var mode = _(modeList).find(function (mode) {
  //    return mode.freeId === freeId && mode.mutiple === multiple;
  //  });

  goIntoFreeGameProcess: function (freeId, multiple, method, modeList, flag) {
    //开始动画
    var mode = _(modeList).find(function (mode) {
      return mode.freeId === freeId && mode.mutiple === multiple && mode.method=== method;
    });


    this.FreeGameLeftTimes = mode.times;
    this.FreeGameBetTimes = mode.times;
    this.FreeGameMultiple = mode.mutiple
    //this.FreeGameMethod = mode.method;
    this.FreeGameBetinfoList = [];
    this.$('.js-bc-btn-lottery-confirm').button('loadding');//投注按钮，不可用
    this.FreeGamePlaying = true;

    this.dealFreeGameCycle(freeId, mode.method, flag);

    //开始下单

  },

  // 连续投注当期数据显示， 开始摇奖动画，下单，显示结果，循环调用？循环||终止
  dealFreeGameCycle: function (freeId, moneyMethod, flag) {
    this.FreeGameIsBegin = true;
    this.FreeGameIsReturn = false;//由于后续对isBegin的状态更新相对请求返回会有延迟，导致可能在初始动画中如果使用isBegin变量的判断可能出现误差，因此引入此状态
    this.FreeGameLeftTimes--;
    this.FreeGameBetinfoList.push({status: '0'});
    this.FreeGameBetRes = undefined;
    this.FreeGameNetException = false;
    this.FreeGameBettingFail = false;
    this.showWinResult(false);//把之前的开奖结果隐藏
    this.showLastResult(false);//把之前的开奖结果隐藏
    this.showFreeGameLotteryTime(true, this.FreeGameLeftTimes);
    this.showFreeGameCurrIsBetting();
    if (!this.BeenDistoryed) {
      //1.开始动画
      this.FreeGameStartAnimate(flag);
    }
    if (!this.BeenDistoryed) {
      //2.开始投注
      this.freeGameStartBetting(freeId, moneyMethod, flag);
    }

  },
  showFreeGameLotteryTime: function (flag, time) {
    if (flag && time >= 0) {
      this.$FreeGameLotteryTimeShow.removeClass('hidden');
      this.$FreeGameLotteryTimeShow.html('免费游戏剩余' + time + '次,奖金' + this.FreeGameMultiple + '倍');
    } else if (!flag) {
      this.$FreeGameLotteryTimeShow.addClass('hidden');
      this.$FreeGameLotteryTimeShow.html('');
    }
  },
  FreeGameStartAnimate: function (flag) {
    var self = this;
    ////1.显示本轮投注数据、状态
    //self.showCurrFreeGameIsBetting();
    //2.处理拉杆及按钮状态
    this.$btnStart.addClass('active');
    //3.准备动画参数
    var easing1 = 'linear';
    this.FreeGameDelay = 9;//测试环境，动画持续最长10S（未被外部强制终止的情况），6s内返回，则固定为6s停止，6s后返回，则固定增加1s
    this.FreeGameLeft = 9;
    var height = 116//转动图片中每个数字的高度
    this.$(".mmc-num").css('backgroundPosition', '50% 0');//数字复位
    var result = '0,0,0,0,0';//初始化动画结束的位置
    var resultArr = (result + '').split(',');
    //4.依次让五个数字开始转动
    self.$(".js-bc-smmc-num-wrapper").removeClass('bc-smmc-num-win-icon');
    this.$(".mmc-num").each(function (index) {
      var $num = $(this);
      //启动每个数字的动画延时为50ms

      var AnimateTimeOut = setTimeout(function () {
        // "50px"为偏移量，确保动画自动终止不会停在正常位置,位置定位10*height为转动一圈
        $num.animate({
          'backgroundPosition': '50% ' + ((height * 10 * self.FreeGameDelay * self.FreeGameDelay ) - (height * resultArr[index]) + 58) + 'px'
        }, {
          duration: 1000 * self.FreeGameDelay + index * 50,
          easing: easing1,
          complete: function () {
            if (index == 0) {
              if (!self.FreeGameIsReturn) {
                self.FreeGameIsBegin = false;
                self.FreeGameIsReturn = true;
                //TODEL 待删除
                clearInterval(self.FreeGameLeftSecondCount);
                self.openException();
                //顺序，以下两句相关
                self.FreeGameNetException = true;
                self.showFreeGameCurrResult(flag);
                //提示异常
                Global.ui.notification.show('网络出现异常，本次投注结果获取失败！请前往投注记录查看投注详情！', {
                  type: 'fail'
                });
                self.refreshOpenHistory();
                self.refreshJackpotInfo();
                //self.refreshExperienceInfo();

              }
            }
          }
        });
      }, 50);

      self.TimeOutArr.push(AnimateTimeOut);
    });
    //TODEL  开发用于计时测试。待删除
    this.FreeGameLeftSecondCount = setInterval(function () {
      self.FreeGameLeft--;
    }, 1000);
  },
  //开始投注
  freeGameStartBetting: function (freeId, moneyMethod, flag) {
    var self = this;
    self.model.freeBettingXhr(freeId, moneyMethod)
      .always(function () {
        //self.$('.js-bc-btn-lottery-confirm').button('reset');
        self.$btnStart.removeClass('active');

      })
      .done(function (res) {
        console.log('请求已返回：' + self.FreeGameIsReturn + '--' + self.isBegin);
        if (!self.FreeGameIsReturn && self.FreeGameIsBegin && !self.BeenDistoryed) {
          self.FreeGameIsReturn = true;

          //保存投注结果对象
          var betInfo = self.FreeGameBetinfoList[self.FreeGameBetTimes - self.FreeGameLeftTimes - 1];
          if (res && res.result === 0) {
            //TODO .正常停止摇奖,显示号码，
            self.FreeGameBetRes = res.root;
            betInfo.result = res.root.openCode;
            betInfo.status = '1';
            betInfo.bonus = res.root.winPrize;
            self.freeGameNormalStop(res.root ? res.root : {openCode: '0,0,0,0,0'}, flag);
          } else {
            //1.异常终止
            betInfo.status = '2';
            self.FreeGameBetRes = 0;
            self.freeGameAbend(res, flag);
          }
        } else {
          //请求成功，

        }
      }).fail(function(res){
        self.FreeGameIsReturn = false;
      });
  },
  //正常终止,num为开奖号
  freeGameNormalStop: function (root, flag) {

    var self = this;
    var easing2 = 'linear';//动画类型
    var height = 116;//滚动动画中的每个数字的高度

    //TODEL  待删除，开发时测试用于获取接口延时开奖情况
    clearInterval(self.FreeGameLeftSecondCount);

    //如果单次开奖还未终止
    if (self.FreeGameIsBegin) {
      var resultArr = (root.openCode + '').split(',');
      self.$(".mmc-num").each(function (index) {
        var $num = $(this);
        var second = 0.5;
        var delay = 200;
        var stopAnimateTimeout =
          setTimeout(function () {
            //1.停止之前固定时间的动画
            $num.stop();
            $num.css('backgroundPosition', '50% 0');
            //$num.css('top',0);
            //计算剩余动画持续的时间，如果未超过3s,则总计运行3s.如果超过3s则默认运行0.5s后停下来（为了持续动画效果）
            var maxSec = 2.5;
            if (self.FreeGameLeft > (9 - maxSec)) {
              second = maxSec + self.FreeGameLeft - 9;
            }
            //2.开始新的动画，剩余几秒则滚动几圈
            $num[0].style.backgroundPositionY = '0px';
            $num.animate({
              'backgroundPosition': '50% ' + ((height * 10 * 9 *(100*((index+1)*(index+1)))) - (height * resultArr[index])) + 'px'
            }, {
              duration: 1000 * second + (index) * delay,
              easing: easing2,
              complete: function () {
                if (index == 4) {
                  //待第五个数字完全停止
                  self.FreeGameIsBegin = false;
                  Global.m.oauth.check();
                  //1.更新开奖状态
                  //TODO 2.更新开奖记录
                  self.refreshOpenHistory();
                  self.refreshJackpotInfo();
                  //self.refreshExperienceInfo();
                  //self.showFreeGameLotteryTime(false, 0);
                  self.showFreeGameCurrResult(flag);
                }
              }
            });
          }, delay * index);
        self.TimeOutArr.push(stopAnimateTimeout);
      });
    }
  },

  //异常终止
  freeGameAbend: function (res, flag) {

    if (this.FreeGameIsBegin) {
      //更新开始状态
      this.FreeGameIsBegin = false;
      this.FreeGameBettingFail = true;
      this.openException();

      //TODEL 待删除，开发时测试用于获取接口延时开奖情况
      clearInterval(this.FreeGameLeftSecondCount);
      this.refreshOpenHistory();
      this.refreshJackpotInfo();
      //this.refreshExperienceInfo();
      this.showFreeGameLotteryTime(false, 0);
      //1.异常停止摇奖
      if (res.root && res.root.errorCode === 101) {
        Global.ui.notification.show('账号余额不足，请先<a href="javascript:void(0);" class="btn-link btn-link-pleasant js-fc-re"  data-dismiss="modal">充值</a>。');
      } else {
        Global.ui.notification.show(res.msg || '');
      }
      //todo 异常时显示什么？
      this.showFreeGameCurrResult(flag);

    }

  },
  showFreeGameResult: function (flag) {
    var self = this;
    var prize = _(this.FreeGameBetinfoList).reduce(function (prize, betInfo) {
      return _(prize).add(betInfo.bonus);
    }, 0);
    if (prize > 0) {
      var $dialog = Global.ui.dialog.show({
        body: this.CongratulationTpl({type: 0, prize: _(prize).convert2yuan()}),
        modalClass: 'bc-smmc-congratulation-modal'
      });
      //$dialog.find('.js-bc-smmc-free-game-total-prize').on('click', function (e) {
      //
      //});
      $dialog.on('hidden.modal', function () {
        if(self.UserStop){
            self.showTotalResult();
        }else{
          if (flag) {
            self.goOnNormalProcess();
          }else{
              self.showTotalResult();
          }
        }

        $dialog.remove();
      });
    }else{
      if(self.UserStop){
          self.showTotalResult();
      }else{
        if (flag) {
          self.goOnNormalProcess();
        }else{
            self.showTotalResult();
        }
      }
    }

  },
  checkSmmcJackpotRuleHandler: function () {
    var $dialog = Global.ui.dialog.show({
      body: this.jackpotRuleTpl(),
      modalClass: 'bc-smmc-jackpot-rule-modal'
    });
    $dialog.on('hidden.modal', function () {
      $dialog.remove();
    });
  },
  //当次下单结束，显示当前结果，并进入下一个流程
  showFreeGameCurrResult: function (flag) {
    var self = this;
    var delay = 1;
    //隐藏整体投注结果，清空投注结果
    //this.$lotteryTotalResultPreview.addClass('hidden');
    this.$lotteryCurrResultPreview.removeClass('hidden');
    //显示本轮订单中奖详情,中奖金额或未中奖
    this.renderFreeGameLotteryCurrResultPreview();
    //TODO 刷新记录，判断是否中奖
    if (this.FreeGameBetRes && this.FreeGameBetRes.winPrize && Number(this.FreeGameBetRes.winPrize) > 0) {
      this.FreeGameTotalPrize = this.FreeGameTotalPrize + this.BetRes.winPrize;
      this.FreeGameHasWin = true;
      //中奖才弹中奖提示
      this.showWinResult(true, this.FreeGameBetRes.winPrize);
      //Global.ui.notification.show('<div class="bc-mmc-bet-result-win">单次中奖</div>', {
      //  type: 'success'
      //});
    } else {
      this.showWinResult(false);
    }

    // 当期投注结果显示停留时间，待调整
    var freeGameFlag = false;
    freeGameFlag = this.FreeGameLeftTimes > 0 && !this.FreeGameNetException && !this.FreeGameBettingFail;//新的一轮开始时，需要重置 && !this.UserStop
    console.log('showCurrResult: UserStop-' + this.UserStop);
    if (freeGameFlag) {
      //判断当前是否进入下一轮下单
      var GoOnFreeGameLottery = setTimeout(function(){
        self.showFreeGameLotteryTime(false, 0);
        self.dealFreeGameCycle(self.freeId, self.freeMethod, self.freeFlag);
      },1000*delay);
      self.TimeOutArr.push(GoOnFreeGameLottery);

    } else {
      self.showFreeGameResult(flag);
      self.showFreeGameLotteryTime(false, 0);

    }
  },
  //TODO
  renderFreeGameLotteryCurrResultPreview: function () {
    var previewList = this.FreeGamePreviewList;
    var self = this;
    //var size = _(previewList).size();
    var rows = _(previewList).map(function (previewInfo, index) {
      var freePreviewInfo = _(self.model.get('previewList')).find(function(item){
        return item.bettingNumber == previewInfo.formatBettingNumber;
      });

      var title = '【' + previewInfo.levelName + '_' + previewInfo.playName + '】 ';
      if (previewInfo.formatBettingNumber.length > 20) {
        title += '<a href="javascript:void(0)" class="js-bc-betting-curr-preview-detail btn-link bc-betting-preview-detail">' +
          previewInfo.formatBettingNumber.slice(0, 20) + '...</a>';
      } else {
        title += previewInfo.formatBettingNumber;
      }
      var status = '开奖中';

      if (self.FreeGameBetRes) {
        status = '未中奖';
        // if(this.BetRes.openResultList &&_(this.BetRes.openResultList).size()===size){
        var bonus = self.FreeGameBetRes.openResultList[index].winPrize;
        if (Number(bonus) > 0) {
          status = '<span class="bc-mmc-gold-coin-win " ></span>中奖' + _(bonus).convert2yuan() + '元';
        }
        //  }

      } else if (self.FreeGameBetRes === 0) {
        status = '投注失败';
      }

      return {
        title: title,
        bonusMode: previewInfo.formatUnit,
        statistics: freePreviewInfo.statistics + '注',
        multiple: previewInfo.multiple + '倍',
        status: status
      };
    }, this);

    var $rows = this.lotteryCurrResultPreview.renderRow(rows);

    $rows.each(function (index, row) {
      var $row = $(row);
      var $detail = $row.find('.js-bc-betting-curr-preview-detail');
      var betNumber = previewList[index].bettingNumber;
      var is11X5 = (self.options.ticketInfo.title.indexOf('11选5') !== -1);
      betNumber = is11X5 ? betNumber : betNumber.replace(/ /g, '');
      if ($detail.length) {
        $detail.popover({
          title: '详细号码',
          trigger: 'click',
          html: true,
          container: self.$el,
          content: '<div class="js-pf-popover"><span class="word-break">' + betNumber + '</span></div>',
          placement: 'right'
        });
      }
    });

    this.$lotteryCurrResultPreview.scrollTop(0);
  },

  showFreeGameCurrIsBetting: function () {
    //隐藏整体投注结果，清空投注结果
    this.$lotteryTotalResultPreview.addClass('hidden');
    this.$lotteryCurrResultPreview.removeClass('hidden');
    //显示当前期投注结果，开奖中，
    this.renderFreeGameLotteryCurrResultPreview();
  },
  closeMaskHandler: function(){
    this.showLastResult(false);
    this.showLotteryTime(false);
  },
  horizontalTurn: function(target,time,opts){
    var verticalOpts = [{'width':0},{'width':'180px'}];
    turn($('#vertical'),100,verticalOpts);
    var horizontalOpts = [{'height':0,'top':'120px'},{'height':'240px','top':0}];
    turn($('#horizontal'),100,horizontalOpts);
  },
  turnJackpotIcon : function(target,time,opts){


    target.find('a').hover(function(){

    },function(){
      $(this).find('.info').animate(opts[0],time,function(){
        $(this).hide().prev().show();
        $(this).prev().animate(opts[1],time);
      });
    });
  }
});

module.exports = BettingCenterView;

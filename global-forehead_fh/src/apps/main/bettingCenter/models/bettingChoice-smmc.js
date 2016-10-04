"use strict";

/**
 * SlotMMC专用，20160708
 */
var Model = require('skeleton/model');

var BettingChoiceModel = Model.extend({

  url: '/ticket/bet/betTigerMmc.json',

  freeUrl: '/ticket/bet/freebet.json',

  defaults: {
    //groupId: 1,
    //groupName: '',
    //levelId: 1,
    //levelName: '',
    //multiple: 1,
    //playId: 1,
    //playName: '',
    maxBonus: 195000,
    unit: 10000,
    formatUnit: '元',
    statistics: 0,
    userRebate: 0,
    previewList: [],
    totalInfo: {}
    //ticketId:
  },

  saveBettingXhr: function(planId) {
    var self = this;

    var params = this.pick('playId', 'multiple', 'userRebate', 'previewList');
    var previewList = _(params.previewList).reduce(function(list, item) {

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
      url: self.url,
      tradition: true,
      data: {
        planId: planId,
        bet: previewList
      }
    })
      .done(function(res) {
        if (res && res.result === 0) {
          //self.emptyPrevBetting();

        }
      });
  },

  //
  freeBettingXhr: function(freeId,moneyMethod) {
    var self = this;

    return Global.sync.ajax({
        url: self.freeUrl,
        data: {
          freeId: freeId,
          method: moneyMethod// 游戏模式：10000元，1000角，100分，10厘
        }
      })
      .done(function(res) {
        if (res && res.result === 0) {
          //self.emptyPrevBetting();
        }
      });
  },

  initialize: function() {
    this.on('change:multiple change:statistics change:userRebate change:betMethod', this.calculateByPrefab);
    this.on('change:maxBonus change:multiple change:unit', this.calculateMaxBonus);
    this.on('change:maxMultiple change:unit', function() {
      var info = this.pick('maxMultiple', 'unit');
      this.set('formatMaxMultiple', _(info.maxMultiple).chain().mul(10000).div(info.unit).value());
    });

    this.on('change:unit', function(model, unit) {
      this.set('formatUnit', unit === 10000 ? '元' : unit === 1000 ? '角' : unit === 100 ?  '分' : '厘');
      this.calculateByPrefab();
    });

    this.on('change:previewList', this.calculateTotal);
  },

  calculateByPrefab: function() {
    var info = this.pick('statistics', 'betMethod', 'multiple', 'userRebate');

    if (info.statistics && info.multiple) {
    //if (info.statistics && info.multiple && info.userRebate) {
      var prefabMoney = _(info.statistics).chain().mul(info.multiple).mul(2).mul(this.get('unit')).value();

      this.set({
        prefabMoney: prefabMoney,
        rebateMoney: info.betMethod === 1 ? _(prefabMoney).chain().mul(info.userRebate).div(1000).value() : 0
      });
    } else {
      this.set({
        prefabMoney: 0,
        rebateMoney: 0
      });
    }
  },

  getStatisticsInfo: function() {
    var info = this.pick('statistics', 'prefabMoney', 'rebateMoney');

    info.prefabMoney = _(info.prefabMoney).convert2yuan();
    info.rebateMoney = _(info.rebateMoney).convert2yuan();

    return info;
  },

  calculateMaxBonus: function() {
    var multiple = this.get('multiple');

    if (multiple) {
      this.set('formatMaxBonus', _(this.get('maxBonus')).chain()
        .div(10000).mul(this.get('unit')).mul(multiple).value());
    }
  },

  calculateTotal: function() {
    var previewList = this.get('previewList');

    var totalInfo = _(previewList).reduce(function(info, item) {
      info.totalLottery = _(info.totalLottery).add(item.statistics);
      info.totalMoney = _(info.totalMoney).add(item.prefabMoney);
      info.totalRebateMoney = _(info.totalRebateMoney).add(item.rebateMoney);
      return info;
    }, {
      totalLottery: 0,
      totalMoney: 0,
      totalRebateMoney: 0
    });

    this.set('totalInfo', totalInfo);
  },

  //手动输入和自动生成、选择的唯一区别在于分隔符要用空格
  formatBettingNumber: function(bettingNumber, options) {
    var number = '';
    options = _(options || {}).defaults({
      type: 'data'
    });

    if (!_.isEmpty(options.selectOptionals)) {
      number += options.selectOptionals.join(',') + '|';
    }

    if (bettingNumber.length === 1) {
      number += bettingNumber[0].join(',');
    } else {

      number += _(bettingNumber).map(function(row) {
        if (_.isEmpty(row)) {
          row = ['-'];
        }

        //如果有值，则用该符号隔开number
        if (options.format) {
          return row.join(options.format.symbol);
        } else {
          //同行是否用空格隔开
          return row.join(options.type === 'display' ? '' : ' ');
        }

      }).join(',');
    }

    return number;
  },

  _addBets: function(bettingList, options) {
    var selectInfo = this.pick(
      'levelName',
      'playId',
      'multiple',
      'playName',
      'bonusMode',
      'formatBonusMode',
      'unit',
      'formatUnit',
      'betMethod',
      'maxBonus',
      'userRebate',
      'formatMaxMultiple',
      'maxMultiple',
      'rebateMoney',
      'formatMaxBonus'
    );

    var previewList = this.get('previewList');
    var items = [];
    var sameBets = [];

    options = _(options || {}).defaults({
    });

    _(bettingList).each(function(bettingInfo) {
      var sameBet;
      var statistics;

      if (bettingInfo.statistics) {
        statistics = bettingInfo.statistics;
      } else {
        statistics = options.statistics;
      }

      var item = {
        levelName: selectInfo.levelName,
        playId: selectInfo.playId,
        playName: selectInfo.playName,
        bettingNumber: this.formatBettingNumber(bettingInfo.lotteryList, {
          selectOptionals: bettingInfo.selectOptionals
        }),
        //显示用
        formatBettingNumber: this.formatBettingNumber(bettingInfo.lotteryList, {
          type: 'display',
          format: bettingInfo.format
        }),
        type: bettingInfo.type,
        formatBonusMode: selectInfo.formatBonusMode,
        multiple: selectInfo.multiple,
        unit: selectInfo.unit,
        statistics: statistics,
        formatUnit: selectInfo.formatUnit,
        betMethod: selectInfo.betMethod,
        userRebate: selectInfo.userRebate,
        rebateMoney: selectInfo.rebateMoney,
        maxMultiple: selectInfo.formatMaxMultiple,
        maxBonus: selectInfo.maxBonus,
        formatMaxBonus: selectInfo.formatMaxBonus
      };

      //if (!_.isUndefined(options.statistics)) {
      //  //手选
      //  item.rebateMoney = options.rebateMoney;
      //} else {
      //  //机选
      //  item.rebateMoney = _(prefabMoney).chain().mul(selectInfo.userRebate).div(100).value();
      //}

      //判断是否有相同的投注,几个方面比较playId,unit,betMethod,bettingNumber
      sameBet = _(previewList).findWhere({
        playId: item.playId,
        unit: item.unit,
        betMethod: item.betMethod,
        bettingNumber: item.bettingNumber
      });

      if (sameBet) {
        sameBet.multiple = _(sameBet.multiple).add(item.multiple);
        //if (sameBet.multiple > sameBet.maxMultiple) {
        //  sameBet.multiple = sameBet.maxMultiple;
        //}
        item = sameBet;
      }

      //计算prefabMoney 和 rebateMoney

      item.prefabMoney = _(2).chain()
        .mul(item.multiple).mul(item.statistics).mul(item.unit).value();

      //rebateMoney: info.betMethod === 1 ? _(prefabMoney).chain().mul(info.userRebate).div(1000).value() : 0
      //item.rebateMoney = _(item.prefabMoney).chain()
      //  .mul(selectInfo.userRebate).div(100).value();

      if (sameBet) {
        sameBets.push(item);
      } else {
        items.splice(0, 0, item);
      }
    }, this);

    previewList = items.concat(previewList);

    this.set('previewList', previewList);

    this.trigger('change:previewList', this);

    return sameBets;
  },

  addAutoBets: function(bettingList) {
    return this._addBets(bettingList);
  },

  addPrevBet: function(bettingInfo, options) {
    var selectInfo = this.pick(
      'statistics'
    );

    if (selectInfo.statistics) {
      return this._addBets([bettingInfo], _(options || {}).extend(selectInfo));
    } else {
      return false;
    }
  },

  emptyPrevBetting: function() {
    this.set('previewList', []);

    this.trigger('change:previewList:del', this);
    this.trigger('change:previewList', this);
  },

  delPrevBetting: function(index) {
    var previewList = this.get('previewList');
    previewList.splice(index, 1);

    this.trigger('change:previewList:del', this, index);
    this.trigger('change:previewList', this, index);
  }

});

module.exports = BettingChoiceModel;

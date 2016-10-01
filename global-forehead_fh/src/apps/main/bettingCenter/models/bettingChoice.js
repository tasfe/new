"use strict";

var Model = require('skeleton/model');

var BettingChoiceModel = Model.extend({

  url: '/ticket/bet/bet.json',

  unitPrice: 2,

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
    totalInfo: {},
    customizeMoney: 0,
    betWay: 1 //投注方式 普通1/自定义投注2
    //ticketId:
  },

  saveBettingXhr: function(planId, previewList) {
    var self = this;

    var params = this.pick('playId', 'multiple', 'userRebate');

    var previewList = _(previewList).reduce(function(list, item) {

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
      url: '/ticket/bet/bet.json',
      tradition: true,
      data: {
        planId: planId,
        bet: previewList
      }
    })
      .done(function(res) {
        if (res && res.result === 0) {
          self.emptyPrevBetting();
        }
      });
  },

  initialize: function() {
    this.on('change:multiple change:statistics change:userRebate change:betMethod change:customizeMoney change:betWay', this.calculateByPrefab);
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
    //普通投注模式走普通计算路线，自定义路线根据给的投注金额计算出使用的金钱模式betMethod和倍数，不使用普通模式玩家选择的倍数和金钱模式
    var statistics = this.get('statistics');
    if (statistics) {
      if (this.get('betWay') === 1) {
        this._calculateNormalMode();
      } else {
        this._calculateCustomMode();
      }
    } else {
      this.set({
        prefabMoney: 0,
        rebateMoney: 0
      });
    }
  },

  _calculateNormalMode: function() {
    var info = this.pick('statistics', 'betMethod', 'unit', 'multiple', 'userRebate');

    if (info.multiple) {
      var prefabMoney = _(info.statistics).chain().mul(info.multiple).mul(this.unitPrice).mul(info.unit).value();

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

  _calculateCustomMode: function() {
    var info = this.pick('statistics', 'betMethod', 'userRebate', 'customizeMoney', 'maxMultiple');

    //从元开始往厘计算
    var unit = 10000;
    var perPrice = info.statistics * this.unitPrice;

    var prefab = _calculate(info.customizeMoney, perPrice, unit);

    if (prefab.multiple) {
      var prefabMoney = _(info.statistics).chain().mul(prefab.multiple).mul(this.unitPrice).mul(prefab.unit).value();

      this.set({
        customiseUnit: prefab.unit,
        customiseMultiple: prefab.multiple,
        prefabMoney: prefabMoney,
        rebateMoney: info.betMethod === 1 ? _(prefabMoney).chain().mul(info.userRebate).div(1000).value() : 0
      });
    } else {
      this.set({
        customiseUnit: 0,
        customiseMultiple: 0,
        prefabMoney: 0,
        rebateMoney: 0
      });
    }

    function _calculate(customizeMoney, perPrice, unit) {
      var multiple = Math.floor(customizeMoney / perPrice);
      if (multiple === 0 && unit > 10) {
        return _calculate(customizeMoney, perPrice / 10, unit / 10);
      }

      multiple = multiple > info.maxMultiple ? info.maxMultiple : multiple;

      return {
        multiple: multiple,
        unit: unit
      };
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

    if (options.formatToNum) {
      number = this._formatToNum(number);
    }

    return number;
  },

  _formatToNum: function(betNum) {
    var newNum = betNum;
    while(newNum.indexOf('大') != -1 || newNum.indexOf('小')!=-1 || newNum.indexOf('单')!=-1 || newNum.indexOf('双')!=-1
    || newNum.indexOf('龙')!=-1 || newNum.indexOf('虎')!=-1 || newNum.indexOf('和')!=-1) {
      newNum = newNum.replace('大', 1);
      newNum = newNum.replace('小', 2);
      newNum = newNum.replace('单', 3);
      newNum = newNum.replace('双', 4);
      newNum = newNum.replace('龙', 0);
      newNum = newNum.replace('虎', 1);
      newNum = newNum.replace('和', 2);
    };
    return newNum;
  },

  _generateBets: function(bettingList, options, previewList) {
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
      'formatMaxBonus',
      'betWay'
    );

    var items = [];
    var sameBets = [];

    options = _(options || {}).defaults({
    });

    if (selectInfo.betWay === 2) {
      selectInfo.unit = this.get('customiseUnit');
      selectInfo.multiple = this.get('customiseMultiple');
    }

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
          selectOptionals: bettingInfo.selectOptionals,
          formatToNum: bettingInfo.formatToNum
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
      if (previewList) {
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

      }
        //计算prefabMoney 和 rebateMoney

      item.prefabMoney = _(this.unitPrice).chain()
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

    return {
      items: items,
      sameBets: sameBets
    };
  },

  _addBets: function(bettingList, options) {

    var previewList = this.get('previewList');

    var generatedBets = this._generateBets(bettingList, options, previewList);

    previewList = generatedBets.items.concat(previewList);

    this.set('previewList', previewList);

    this.trigger('change:previewList', this);

    return generatedBets.sameBets;
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

  quickBet: function(bettingInfo, options) {
    var selectInfo = this.pick(
      'statistics'
    );

    var generatedBets = this._generateBets([bettingInfo], _(options || {}).extend(selectInfo));

    return {
      previewList: generatedBets.items,
      totalInfo: {
        totalLottery: generatedBets.items[0].statistics,
        totalMoney: generatedBets.items[0].prefabMoney,
        totalRebateMoney: generatedBets.items[0].rebateMoney
      }
    };
    // return this._addBets([bettingInfo], _(options || {}).extend(selectInfo));
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

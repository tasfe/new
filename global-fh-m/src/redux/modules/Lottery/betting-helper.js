import Base from 'redux/Helper'

class BettingHelper extends Base {

  calculateByPrefab () {
    let info = _(this.state).pick('statistics', 'betMethod', 'multiple', 'userRebate');

    if (info.statistics && info.multiple) {
      //if (info.statistics && info.multiple && info.userRebate) {
      let prefabMoney = _(info.statistics).chain().mul(info.multiple).mul(2).mul(this.get('unit')).value();

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
  }

  getStatisticsInfo () {
    let info = _(this.state).pick('statistics', 'prefabMoney', 'rebateMoney');

    info.prefabMoney = _(info.prefabMoney).convert2yuan();
    info.rebateMoney = _(info.rebateMoney).convert2yuan();

    return info;
  }

  calculateMaxBonus () {
    let multiple = this.get('multiple');

    if (multiple) {
      this.set('formatMaxBonus', _(this.get('maxBonus')).chain()
        .div(10000).mul(this.get('unit')).mul(multiple).value());
    }
  }

  calculateTotal () {
    let previewList = this.get('previewList');

    let totalInfo = _(previewList).reduce(function(info, item) {
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
  }

  //手动输入和自动生成、选择的唯一区别在于分隔符要用空格
  formatBettingNumber (bettingNumber, options) {
    let number = '';
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
  }

  _formatToNum (betNum) {
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
  }

  _addBets (bettingList, options) {
    let selectInfo = _(this.state).pick(
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

    let previewList = this.get('previewList');
    let items = [];
    let sameBets = [];

    options = _(options || {}).defaults({});

    _(bettingList).each(function(bettingInfo) {
      let sameBet;
      let statistics;

      if (bettingInfo.statistics) {
        statistics = bettingInfo.statistics;
      } else {
        statistics = options.statistics;
      }

      let item = {
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
      sameBet = _(previewList).findWhere({
        playId: item.playId,
        unit: item.unit,
        betMethod: item.betMethod,
        bettingNumber: item.bettingNumber
      });

      if (sameBet) {
        window.Alert({
          content: '您选的号码码篮中已经存在，将直接进行倍数累加'
        })
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

    //this.trigger('change:previewList', this);
    this.calculateTotal()

    return sameBets;
  }

  addAutoBets (bettingList) {
    return this._addBets(bettingList);
  }

  addPrevBet (bettingInfo, options) {
    this.set('adding', false)

    let selectInfo = _(this.state).pick(
      'statistics'
    );

    if (selectInfo.statistics) {
      return this._addBets([bettingInfo], _(options || {}).extend(selectInfo));
    } else {
      return false;
    }
  }

  emptyPrevBetting () {
    this.set('previewList', []);
  }

  delPrevBetting (index) {
    let previewList = this.get('previewList');
    previewList.splice(index, 1);
  }

  setMaxMultiple () {
    let info = _(this.state).pick('maxMultiple', 'unit');
    this.set('formatMaxMultiple',  _(info.maxMultiple).chain().mul(10000).div(info.unit).value())
  }
  
  changeUnit () {
    this.set('formatUnit', unit === 10000 ? '元' : unit === 1000 ? '角' : unit === 100 ? '分' : '厘')
    this.calculateByPrefab();
  }

  process (data) {
    this.set(data)

    let keys = _(data).keys()
    while (keys.length) {
      switch (keys.pop()) {
        case 'multiple':
          this.calculateByPrefab()
          this.calculateMaxBonus()
          break
        case 'unit':
          this.changeUnit()
          this.calculateMaxBonus()
          this.setMaxMultiple()
          break
        case 'maxBonus':
          this.calculateMaxBonus()
          break
        case 'maxMultiple':
          this.setMaxMultiple()
          break
        case 'statistics':
        case 'userRebate':
        case 'betMethod':
          this.calculateByPrefab()
          break
        case 'previewList':
          this.calculateTotal()
          break
        case 'add':
          this.addPrevBet(data.add)
      }
    }
  }

  order (planId, cb) {
    let params = _(this.state).pick('playId', 'multiple', 'userRebate', 'previewList');
    let previewList = _(params.previewList).reduce(function(list, item) {
      list.push({
        betNum: item.bettingNumber,
        playId: item.playId,
        betMultiple: item.multiple,
        moneyMethod: item.unit,
        //0 高奖金 1 有返点
        betMethod: item.betMethod
      })

      return list;
    }, []);

    return ajax({
      url: '/ticket/bet/bet.json',
      tradition: true,
      data: {
        planId: planId,
        bet: previewList,
        device: 3
      }
    }, cb, resp => {
      cb && cb(false, resp)
    })
  }

  mmc (planId, cb) {
    let params = _(this.state).pick('playId', 'multiple', 'userRebate', 'previewList');
    let previewList = _(params.previewList).reduce(function(list, item) {
      list.push({
        betNum: item.bettingNumber,
        playId: item.playId,
        betMultiple: item.multiple,
        moneyMethod: item.unit,
        //0 高奖金 1 有返点
        betMethod: item.betMethod
      })

      return list;
    }, []);

    return ajax({
      url: '/ticket/bet/betMmc.json',
      tradition: true,
      data: {
        planId: planId,
        bet: previewList,
        device: 3
      }
    }, resp => {
      cb && cb(true, resp)
    }, resp => {
      cb && cb(false, resp)
    })
  }

  remove (index) {
    if (_.isNumber(index)) {
      let temp = $.extend(true, [], this.state.previewList)
      temp.splice(index, 1)
      this.state.previewList = temp
      this.calculateTotal()
    }
  }
}

export default BettingHelper
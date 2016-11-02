_.mixin({
  add: function (a, b) {
    var c, d, e;
    try {
      c = a.toString().split(".")[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split(".")[1].length;
    } catch (f) {
      d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) + this.mul(b, e)) / e;
  },

  sub: function (a, b) {
    var c, d, e;
    try {
      c = a.toString().split(".")[1].length;
    } catch (f) {
      c = 0;
    }
    try {
      d = b.toString().split(".")[1].length;
    } catch (f) {
      d = 0;
    }
    return e = Math.pow(10, Math.max(c, d)), (this.mul(a, e) - this.mul(b, e)) / e;
  },

  mul: function (a, b) {
    var snReg = /[eE]+/
    var c = 0,
      d = a.toString(),
      e = b.toString();
    if (snReg.test(d) || snReg.test(e)) {
      return a * b
    }
    try {
      c += d.split(".")[1].length;
    } catch (f) {}
    try {
      c += e.split(".")[1].length;
    } catch (f) {}
    return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
  },

  div: function (a, b) {
    var c, d, e = 0,
      f = 0;
    try {
      e = a.toString().split(".")[1].length;
    } catch (g) {}
    try {
      f = b.toString().split(".")[1].length;
    } catch (g) {}
    return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), this.mul(c / d, Math.pow(10, f - e));
  },

  convert2yuan: function (money, options) {
    options = _.extend({}, {
      fixed: 4,
      ratio: 10000,
      clear: true
    }, options);

    return this.formatDiv(money, options.ratio, options);
  },

  fixedConvert2yuan: function(money, options) {
    options = _.extend({}, {
      fixed: 3,
      clear: false
    }, options);
    return this.convert2yuan(money, options);
  },

  formatMul: function(money, ratio, options) {
    var format;

    options = _.extend({}, {
      fixed: 0
    }, options);

    if (!_.isUndefined(money)) {

      format = _(money).mul(ratio);

      if (options.fixed) {
        format  = format.toFixed(options.fixed);
      }
    }

    return format;
  },

  formatDiv: function (money, ratio, options) {
    var format;

    money = money || 0;

    options = _.extend({}, options);

    if (!_.isUndefined(money)) {

      format = this.div(money, ratio);

      if (options.fixed ||  options.fixed === 0) {
        format  = format.toFixed(options.fixed);
      }

      if (options.clear) {
        format = _.add(format, 0);
      }

    }

    return format
  },

  floor: function (arg1, index) {
    var sArg1 = String(arg1);
    var pos = sArg1.indexOf('.');
    if (pos > -1) {
      return Number(sArg1.substring(0, pos + index + 1));
    } else {
      return arg1;
    }
  },

  getQuery: function (name, target) {
    target = target || window.location.href
    var matcher = target.match(new RegExp('[\?\&]' + name + '=([^\&\?\#]+)'))
    return matcher ? matcher[1] : ''
  },
  
  unique: function(arr) {
    var unique = [];
    var repeat = [];
    var hash = {};

    if (!_.isEmpty(arr)) {
      var length = arr.length;
      for (var i = 0, elem; i < length; i++) {
        elem = arr[i];
        if (!hash[elem]) {
          unique.push(elem);
          hash[elem] = true;
        } else {
          repeat.push(elem);
        }
      }
    }

    return {
      unique: unique,
      repeat: repeat
    };
  },
  checkBettingStatus: function(bet) {
    //0:未中奖，1：已中奖，2：用户撤单，3：系统撤单 4: 未开始,ticketResult,prizeTotalMoney
    //betStatus, hasException, openNumbers, openStatus, prized, prizeTotalMoney
    var status = '';
    if(bet.ticketPlanId==='mmc'){
      if (bet.prizeTotalMoney > 0) {
        status = '<span class="bet-prize">' + _(bet.prizeTotalMoney).convert2yuan() + '</span>';
      }else{
        status = '未中奖';
      }
    }else{
      if (bet.betStatus === 4) {
        status = '未开始';
      } else if (bet.betStatus === 2) {
        status = '用户撤单';
      } else if (bet.betStatus === 3) {
        status = '系统撤单';
      } else if (bet.hasException) {
        status = '<span class="bet-waite">等待开奖</span>';
      } else if (bet.openNumbers === null) {
        if (bet.openStatus > 0) {
          status = '未中奖';
        } else {
          status = '<span class="bet-waite">等待开奖</span>';
        }
      } else if (bet.prizeTotalMoney > 0) {
        status = '<span class="bet-prize">' + _(bet.prizeTotalMoney).convert2yuan() + '</span>';
      } else if (bet.prizing) {
        status = '正在开奖';
      } else if (bet.prizeTotalMoney === 0) {
        status = '未中奖';
      }
    }

    return status;
  },

  checkBettingStatusForDetail: function(bet) {
    //0:未中奖，1：已中奖，2：用户撤单，3：系统撤单 4: 未开始,ticketResult,prizeTotalMoney
    //betStatus, hasException, openNumbers, openStatus, prized, prizeTotalMoney
    var status = '';
    if (bet.betStatus === 4) {
      status = '未开始';
    } else if (bet.betStatus === 2) {
      status = '用户撤单';
    } else if (bet.betStatus === 3) {
      status = '系统撤单';
    } else if (bet.hasException) {
      status = '等待开奖';
    } else if (bet.openNumbers === null) {
      if (bet.openStatus > 0) {
        status = '未中奖';
      } else {
        status = '等待开奖';
      }
    } else if (bet.prizeTotalMoney > 0) {
      status = '<span class="' + bet.prizeClass + '">已中奖</span>';
    } else if (bet.prizing) {
      status = '正在开奖';
    } else if (bet.prizeTotalMoney === 0) {
      status = '未中奖';
    }
    return status;
  },
  checkChaserStatus: function(rowInfo) {
    var status = '';
    switch(rowInfo.chaseStatus) {
      case 0:
        status =  '<span class="bet-waite">进行中</span>';//未开始
        break;
      case 1:
        status = '<span class="bet-waite">进行中</span>';
        break;
      case 2:
        if(rowInfo.chasePrizeMoney === 0 || rowInfo.chasePrizeMoney === null){
          status = '未中奖';
        }else{
          status = '<span class="bet-prize">' + _(rowInfo.chasePrizeMoney).convert2yuan() + '</span>';
        }
        break;
      case 3:
        status = '已中止';
        break;
    }
    return status;
  },
  convert2yuanWithColor: function(money,option){
    var money = this.convert2yuan(money,option)
    if(money>0){
      return '<span style="color:#67ce00">+'+money+'</span>';
    }else if(money<0){
      return  '<span style="color:#cd3300">'+money+'</span>';
    }else{
      return money;
    }
  },
  getSpecialSrc: function(type){
    var cla = '';
    switch(type){
      case '投注' : cla=require('images/md-bet.png');break;
      case '中奖' : cla=require('images/md-prize.png');break;
      case '返点' : cla=require('images/md-prize.png');break;
      case '充值' : cla=require('images/md-recharge.png');break;
      case '提现' : cla=require('images/md-withdraw.png');break;
      case '转账' : cla=require('images/md-transfer.png');break;

    }
    return cla;
  }

})


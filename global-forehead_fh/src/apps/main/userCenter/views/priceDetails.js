var TabView = require('com/tabView');
var cup = require('../misc/cup.png');
var IDsSuper3 = require('bettingCenter/misc/super3k/IDsOfSuper3k');

var TrackRecordsView = TabView.extend({

  events: {},

  // className: 'price-ul',

  initialize: function() {
    _(this.options).defaults({
      height: 330,
      tabClass: 'view-tabs nav nav-tabs nav-tabs-special',
      tabs: [
        {
          label: '时时彩',
          name: 'constant',
          id: 'jsUCConstantTab',
          view: '',
          template: '<div class="js-uc-constContainer"><div class="js-uc-constNotice"></div><div class="js-uc-constGrid portlet-filter price-container"></div></div>'
        },
        {
          label: '11选5',
          name: 'elev',
          id: 'jsUCElevenSelectFiveTab',
          template: '<div class="js-uc-ElevContainer"><div class="js-uc-ElevNotice"></div><div class="js-uc-ElevGrid portlet-filter price-container"></div></div>'
        },
        {
          label: '低频彩',
          name: 'low',
          id: 'jsUCLowFrequentTab',
          template: '<div class="js-uc-lowContainer"><div class="js-uc-lowNotice"></div><div class="js-uc-lowGrid portlet-filter price-container"></div></div>'
        }
        // {
        //   label: '秒秒彩',
        //   name: 'mmc',
        //   id: 'jsUCMmcFrequentTab',
        //   template: '<div class="js-uc-mmcContainer price-container"><div class="js-uc-mmcNotice"></div><div class="js-uc-mmcGrid portlet-filter uc-prize"></div></div>'
        // },
        ,
        {
          label: '快乐彩',
          name: 'happy',
          id: 'jsUCHappyFrequentTab',
          template: '<div class="js-uc-happyContainer price-container"><div class="js-uc-happyNotice"></div><div class="js-uc-happyGrid portlet-filter uc-prize"></div></div>'
        }
      ],
      // append:  '<div class="controls fc-lesson">' +
      // '<div class="pull-right fc-lesson-text text-pleasant">' +
      // '<img class="" src="'+cup+'">' +
      // '</span>单期最高奖金限制：<span class="js-ac-pd-maxBonus" >300,000</span>元</div>' +
      // '</div>'
      append:'<div class="alert">' +
      '<div class="js-ac-quota-container">' +
      '<span class="sfa sfa-tip-trophy vertical-middle m-right-xs"></span>' +
      '单期最高奖金限制：<span class="js-ac-pd-maxBonus" >300,000</span>元' +
      '</div>' +
      '</div>'
    });

    //未传递此参数时使用当前用户的id,分别用于个人中心及代理中心的奖金详情查询
    _(this.options).defaults({
      userId: Global.memoryCache.get('acctInfo').userId
    });

  },

  onConstantRender: function () {
    var self = this;
    var params = {ticketSeriesId: 1, subAcctId: this.options.userId};
    this._loadPage(params, 'js-uc-constGrid');
  },
  onElevRender: function () {
    var self = this;
    var params = {ticketSeriesId: 2, subAcctId: this.options.userId};
    this._loadPage(params, 'js-uc-ElevGrid');

  },
  onLowRender: function () {
    var self = this;
    var params = {ticketSeriesId: 3, subAcctId: this.options.userId};
    this._loadPage(params, 'js-uc-lowGrid');
  },
  onMmcRender: function () {
    var self = this;
    var params = {ticketSeriesId: 5, subAcctId: this.options.userId};
    this._loadPage(params, 'js-uc-mmcGrid');
  },
  onSmmcRender: function () {
    var self = this;
    var params = {ticketSeriesId: 6, subAcctId: this.options.userId};
    this._loadPage(params, 'js-uc-smmcGrid');
  },
  onHappyRender: function () {
    var self = this;
    var params = {ticketSeriesId: 4, subAcctId: this.options.userId};
    this._loadPage(params, 'js-uc-happyGrid');
  },
  
  _loadPage: function (params, classValue) {
    this.$('.' + classValue).html(Global.ui.loader.get());

    var self = this;
    if(this.options.rebate || this.options.rebate===0){
      params = _(params).chain().omit('subAcctId').extend({userRebate: this.options.rebate}).value();
    }
    this._getBonusData(params).done(function(res) {
      if (res.result === 0) {
        self._getTable(self._formatNewGroups(self._formatLevelData(res.root.playBonusList.levels)), classValue);
        self.$('.js-ac-pd-maxBonus').html(self.formatMoney(_(res.root.maxBonus).formatDiv(10000,{fixed:0}),0));
      }else{
        Global.ui.notification.show(res.msg);
      }
    });
  },
  //发送请求
  _getBonusData: function (params) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/userticketbonus.json',
      data: params
    });
  },
  //获取表格
  _getTable: function (tableInfo, classValue) {
    this.$('.' + classValue).staticGrid({
      tableClass: 'table table-bordered table-center',
      wrapperClass: '',
      height: this.options.height,
      colModel: [
        {label: '玩法群', name: 'playLevel', merge: true, width: 100},
        {label: '玩法组', name: 'playGroup', merge: true, width: 120},
        {label: '玩法', name: 'playName', width: 130},
        {label: '最低奖金（元模式）', name: 'bonusMin', width: 130},
        {label: '返点', name: 'rebate', width: 120},
        {label: '最高奖金（元模式）', name: 'bonusMax', width: 120}
      ],
      row: tableInfo
    });
  },
  //格式化数据
  _formatLevelData: function (levels) {
    return _(levels).chain().map(function (level) {
      var playLevel = level.ticketLevelName;
      var groups = level.groups;
      return _(groups).map(function (group) {
        var playGroup = group.ticketGroupName;
        return {
          'playLevel': playLevel,
          'playGroup': playGroup,
          'plays': group.plays
        };
      });
    }).flatten().value();
  },
  _formatNewGroups: function (groups) {
    return _(groups).chain().map(function (group) {
      return _(group.plays).map(function (play) {
        return {
          'playLevel': group.playLevel,
          'playGroup': group.playGroup,
          'playName': play.ticketPlayName,
          'bonusMin': _(play.ticketPlayBonus).convert2yuan(),
          'rebate': _(play.userRebate).formatDiv(10) + '%',
          'bonusMax': '<span class="text-hot">' + _(play.ticketPlayMaxBonus).convert2yuan() + '</span>'
        };
      });
    }).flatten().value();
  },

  formatMoney: function(s, type) {
    if (/[^0-9\.]/.test(s))
      return "0";
    if (s == null || s == "")
      return "0";
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
      s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    if (type == 0) {// 不带小数位(默认是有小数位)
      var a = s.split(".");
      if (a[1] == "00") {
        s = a[0];
      }
    }
    return s;
  }

});

module.exports = TrackRecordsView;

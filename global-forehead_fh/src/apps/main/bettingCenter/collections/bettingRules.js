"use strict";

var Collection = require('skeleton/collection');
var IDsSuper3 = require('bettingCenter/misc/super3k/IDsOfSuper3k');

var BettingRulesCollection = Collection.extend({

  url: '/ticket/ticketmod/ticketplaylist.json',

  parse: function(res) {
    var data;

    if (res && res.result === 0) {
      data = res.root && res.root.ticketPlayLevelInfo || [];
      this.limitMoney = res.root && res.root.limitMoney;
    }
    return data;
  },

  //common APIs

  setTicketInfo: function(ticketInfo) {
    this.ticketInfo = ticketInfo;
  },

  getPlayLevels: function() {
    var self = this;
    var normalList = [];
    var optionalList = [];
    var superList = [];
    this.each(function(ruleModel) {
      if (!(ruleModel.get('playLevelName').indexOf('任选') === -1) && self.ticketInfo.info.optional) {
        optionalList.push({
          type: 'optional',
          id: ruleModel.get('playLevelId'),
          title: ruleModel.get('playLevelName'),
          firstPrize: ruleModel.get('ticketPlayGroupInfo')[0].ticketPlayInfo[0].betMethodMax
        });
      } else if (!(IDsSuper3.getArr().indexOf(ruleModel.get('playLevelId')) === -1) && self.ticketInfo.info.isSuper) {
        superList.push({
          type: 'super',
          id: ruleModel.get('playLevelId'),
          title: ruleModel.get('playLevelName'),
          firstPrize: ruleModel.get('ticketPlayGroupInfo')[0].ticketPlayInfo[0].betMethodMax
        });
      }else {
        normalList.push({
          type: 'normal',
          id: ruleModel.get('playLevelId'),
          title: ruleModel.get('playLevelName'),
          firstPrize: ruleModel.get('ticketPlayGroupInfo')[0].ticketPlayInfo[0].betMethodMax
        });
      }
    });
    return {
      normalList: normalList,
      superList: superList,
      optionalList: optionalList
    };
  },

  getPlayGroups: function(levelId) {
    var levelInfoModel = this.findWhere({
      playLevelId: levelId
    });
    var groups = levelInfoModel && levelInfoModel.get('ticketPlayGroupInfo') || [];

    this.currentLevel = groups;

    return _(groups).map(function(group) {
      return {
        id: group.playGroupId,
        title: group.playGroupName,
        playList: _(group.ticketPlayInfo).map(function(play) {
          return {
            id: play.playId,
            title: play.playName
          };
        })
      };
    });
  },

  getPlayInfo: function(groupId, playId) {
    var groupInfo = _(this.currentLevel).findWhere({
      playGroupId: groupId
    });


    var playInfo = _(groupInfo.ticketPlayInfo).findWhere({
      playId: playId
    });

    this.currentGroup = groupInfo;
    this.currentPlay = playInfo;

    return this.currentPlay;
  },

  getCurrentPlay: function() {
    return this.currentPlay;
  }

});

module.exports = BettingRulesCollection;

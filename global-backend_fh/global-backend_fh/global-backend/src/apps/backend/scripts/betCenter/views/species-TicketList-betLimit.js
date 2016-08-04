/**
 * Created by David Zhang on 2015/9/7.  接口待修改
 */
define(function (require, exports, module) {

  require('prefab/views/tabView');

  var TicketBetLimitView = Base.Prefab.TabView.extend({

    //所有的事件绑定全部写在这！
    events: {
      'click .js-bc-fifteenHundredBouns-btn-submit': 'formSubmitHandler',
      'click .js-bc-fifteenHundredBouns-btn-cancel': 'formCancelHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function () {
      _(this.options).extend({
        tabs: [
          {
            label: '1500奖金组',
            name: 'fifteenHundredBouns',
            id: 'jsFifteenHundredBounsTab',
            template:  require('text!betCenter/templates/species-TicketList-betLimit.html')
          }
        ]
      });
    },

    //发送请求
    _getBonusData: function (params) {
      return Global.sync.ajax({
        url: '/intra/playmng/playlist.json',
        data: params
      });
    },

    onFifteenHundredBounsRender: function () {
      var self = this;
      this.$btnSumbit = self.$('.js-bc-fifteenHundredBouns-btn-submit');
      this.$formContainer = this.$('.js-bc-fifteenHundredBouns-form');
      var params = {ticketId:this.options.ticketId};
      this._loadPage(params, 'js-bc-fifteenHundredBouns-constGrid');
    },

    _loadPage: function (params, classValue) {
      var self = this;
      this._getBonusData(params).done(function (res) {
        if (res.result === 0) {
          self.$('.js-bc-fifteenHundredBouns-ticketId').text(res.root.ticketId);
          self.$('.js-bc-fifteenHundredBouns-ticketName').text(res.root.ticketName);
          self._getTable(self._formatNewGroups(self._formatLevelData(res.root.levels)), classValue);
        }else{
          Global.ui.notification.show('数据异常。');
        }
      }).fail(function(){
      });
    },

    //获取表格
    _getTable: function (tableInfo, classValue) {
      this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '玩法群', name: 'playLevel', merge: true, width: 150},
          {label: '玩法组', name: 'playGroup', merge: true, width: 150},
          {label: '玩法', name: 'playName', width: 150},
          {label: '理论最大中奖金额', name: 'ticketMaxBonus', width: 150},
          {label: '基础奖金', name: 'ticketPlayBonus', width: 150},
          {label: '倍数限制(倍)', name: 'ticketPlayBetLimit', width: 150}
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
            'ticketMaxBonus':_(play.ticketMaxBonus).convert2yuan()+'',
            'ticketPlayBonus':_(play.ticketPlayBonus).convert2yuan()+'',
            'ticketPlayBetLimit':play.ticketPlayBetLimit+''
            //'ticketPlayBetLimit':'<input type="text" id="jsBCFifteenHundredBounsTicketPlayBetLimit'+play.ticketPlayId+'" class="js-BC-FifteenHundredBouns-ticketPlayBetLimit form-control" value="'+play.ticketPlayBetLimit+'">'
          };
        });
      }).flatten().value();
    },
  });

  module.exports = TicketBetLimitView;
});
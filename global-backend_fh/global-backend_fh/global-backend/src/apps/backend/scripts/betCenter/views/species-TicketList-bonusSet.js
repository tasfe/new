/**
 * Created by David Zhang on 2015/9/2.
 */
define(function (require, exports, module) {

  require('prefab/views/tabView');

  var TicketBonusSetView = Base.Prefab.TabView.extend({

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
            template:  require('text!betCenter/templates/species-TicketList-bonusSet.html')
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
          {label: '基础奖金', name: 'ticketPlayBonus', width: 150}
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
            'ticketPlayBonus':'<input type="text" id="jsBCFifteenHundredBounsPlayBonus'+play.ticketPlayId+'" class="js-BC-FifteenHundredBouns-PlayBonus form-control" value="'+_(play.ticketPlayBonus||0).fixedConvert2yuan()+'" data-parsley-range="[0, 10000000]"  data-parsley-threeDecimal required>'
          };
        });
      }).flatten().value();
    },

    //表单被提交时触发的handler
    formSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var clpValidate = this.$formContainer.parsley().validate();
      if (clpValidate) {
        var reqParams = {};
        //var reqParams = {'play[0].ticketPlayId':1,'play[0].ticketPlayBonus':1500};
        //reqParams['play[1].ticketPlayId'] = 2;
        //reqParams['play[1].ticketPlayBonus'] = 2500;
        var length = self.$('.js-BC-FifteenHundredBouns-PlayBonus').length;
        var jsBCFifteenHundredBounsPlayBonusInput;
        _.map(_.range(length), function(num){
          jsBCFifteenHundredBounsPlayBonusInput = self.$('.js-BC-FifteenHundredBouns-PlayBonus').eq(num);
          reqParams['play['+num+'].ticketPlayId'] =  _(Number(jsBCFifteenHundredBounsPlayBonusInput.attr('id').substr(32,jsBCFifteenHundredBounsPlayBonusInput.attr('id').length))).formatMul(1);
          reqParams['play['+num+'].ticketPlayBonus'] = _(Number(jsBCFifteenHundredBounsPlayBonusInput.val())).formatMul(1);
        });
        Global.sync.ajax({
          url: '/intra/playmng/saveplay.json',
          data: reqParams
        })
          .always(function () {
            $target.button('reset');
          })
          .fail(function () {
            // 处理失败
          })
          .done(function (res) {
            if (res && res.result === 0) {
              Global.ui.notification.show('操作成功。');
              Global.appRouter.navigate(_('#bc/tl/bonus/'+self.$('.js-bc-fifteenHundredBouns-ticketId').text()).addHrefArgs({
                _t:_.now()
              }), {trigger: true, replace: false});
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      }else{
        $target.button('reset');
      }
    },

    formCancelHandler: function (e) {
      var self = this;
      Global.appRouter.navigate(_('#bc/tl/bonus/'+self.$('.js-bc-fifteenHundredBouns-ticketId').text()).addHrefArgs({
        _t:_.now()
      }), {trigger: true, replace: false});
    }
  });

  module.exports = TicketBonusSetView;
});
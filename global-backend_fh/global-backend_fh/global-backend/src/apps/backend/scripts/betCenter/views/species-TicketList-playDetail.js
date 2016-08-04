/**
 * Created by David Zhang on 2015/9/7.
 */
define(function (require, exports, module) {


  var TicketPlayDetailView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/species-TicketList-playDetail.html'),

    //所有的事件绑定全部写在这！
    events: {
      'click .js-bc-btn-submit': 'formSubmitHandler',
      'click .js-bc-btn-cancel': 'formCancelHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function () {
    },

    //发送请求
    _getBonusData: function (params) {
      return Global.sync.ajax({
        url: '/intra/playmng/playlist.json',
        data: params
      });
    },

    onRender: function () {
      var self = this;
      this.$formContainer = this.$('.js-bc-form');
      var params = {ticketId:this.options.ticketId};
      this._loadPage(params, 'js-bc-constGrid');
    },

    _loadPage: function (params, classValue) {
      var self = this;
      this._getBonusData(params).done(function (res) {
        if (res.result === 0) {
          self.$('.js-bc-ticketId').text(res.root.ticketId);
          self.$('.js-bc-ticketName').text(res.root.ticketName);
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
          {label: '玩法说明', name: 'ticketPlayDesc', width: 150},
          {label: '中奖举例', name: 'ticketPlayExample', width: 150}
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
            'ticketPlayDesc':'<textarea  id="jsBCFifteenHundredBounsTicketPlayDesc'+play.ticketPlayId+'" class="height-sm width-md js-BC-ticketPlayDesc form-control" data-parsley-zhMaxLength="1000" data-parsley-someSpecialChar required>'+play.ticketPlayDesc+'</textarea>',
            'ticketPlayExample':'<textarea type="text" id="jsBCFifteenHundredBounsTicketPlayExample'+play.ticketPlayId+'" class="height-sm width-md js-BC-ticketPlayExample form-control"  data-parsley-zhMaxLength="1000" data-parsley-someSpecialChar required >'+play.ticketPlayExample+'</textarea>'
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
        var length = self.$('.js-BC-ticketPlayDesc').length;
        var ticketPlayDescInput;
        var ticketPlayExampleInput;
        _.map(_.range(length), function(num){
          ticketPlayDescInput = self.$('.js-BC-ticketPlayDesc').eq(num);
          ticketPlayExampleInput = self.$('.js-BC-ticketPlayExample').eq(num);
          reqParams['play['+num+'].ticketPlayId'] =  _(Number(ticketPlayDescInput.attr('id').substr(37,ticketPlayDescInput.attr('id').length))).formatMul(1);
          reqParams['play['+num+'].ticketPlayDesc'] = ticketPlayDescInput.val();
          reqParams['play['+num+'].ticketPlayExample'] = ticketPlayExampleInput.val();
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
              Global.appRouter.navigate(_('#bc/tl/playDetail/'+self.$('.js-bc-ticketId').text()).addHrefArgs({
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
      Global.appRouter.navigate(_('#bc/tl/playDetail/'+self.$('.js-bc-ticketId').text()).addHrefArgs({
        _t:_.now()
      }), {trigger: true, replace: false});
    }
  });

  module.exports = TicketPlayDetailView;
});
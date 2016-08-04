/**
 * Created by David Zhang on 2015/9/8.
 */
define(function (require, exports, module) {


  var TicketPlayStatusView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/species-TicketList-playStatus.html'),

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
      var self = this;
      var tableInfoCount = _.countBy(tableInfo, function(tableInfoRow) {
        return tableInfoRow.ticketPlayStatus==0 ? 'validTotal': 'invalidTotal';
      });
      self.$('.js-bc-playTotal').text(_(Number(typeof(tableInfoCount.validTotal) == "undefined" ? 0:tableInfoCount.validTotal)).formatMul(1)+_(Number(typeof(tableInfoCount.invalidTotal) == "undefined" ? 0 : tableInfoCount.invalidTotal)).formatMul(1));
      self.$('.js-bc-validPlayTotal').text(typeof(tableInfoCount.validTotal) == "undefined" ? 0:tableInfoCount.validTotal);
      self.$('.js-bc-invalidPlayTotal').text(typeof(tableInfoCount.invalidTotal) == "undefined" ? 0 : tableInfoCount.invalidTotal);
      this.$('.' + classValue).staticGrid({
        colModel: [
          {label: '玩法群', name: 'playLevel', merge: true, width: 150},
          {label: '玩法组', name: 'playGroup', merge: true, width: 150},
          {label: '玩法', name: 'playName', width: 150},
          {label: '状态', name: 'ticketPlaySaleStatus', width: 150}
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
      var invalidPlayTotal;var validPlayTotal;
      return _(groups).chain().map(function (group) {
        return _(group.plays).map(function (play) {
          var optionsHtml = play.ticketPlayStatus==0?'<option value="0" selected>在售</option><option value="1">停售</option>':'<option value="0">在售</option><option value="1" selected>停售</option>'
          return {
            'playLevel': group.playLevel,
            'playGroup': group.playGroup,
            'playName': play.ticketPlayName,
            'ticketPlayStatus':play.ticketPlayStatus,
            'ticketPlaySaleStatus':'<select id="jsBCTicketPlayStatus'+play.ticketPlayId+'" class="js-BC-ticketPlayStatus form-control">'+optionsHtml+'</select>'
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
        var length = self.$('.js-BC-ticketPlayStatus').length;
        var ticketPlayStatusInput;
        _.map(_.range(length), function(num){
          ticketPlayStatusInput = self.$('.js-BC-ticketPlayStatus').eq(num);
          reqParams['play['+num+'].ticketPlayId'] =  _(Number(ticketPlayStatusInput.attr('id').substr(20,ticketPlayStatusInput.attr('id').length))).formatMul(1);
          reqParams['play['+num+'].ticketPlayStatus'] = ticketPlayStatusInput.val();
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
              Global.appRouter.navigate(_('#bc/tl/playStatus/'+self.$('.js-bc-ticketId').text()).addHrefArgs({
                _t:_.now()
              }), {trigger: true, replace: false});
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      }
    },

    formCancelHandler: function (e) {
      var self = this;
      Global.appRouter.navigate(_('#bc/tl/playStatus/'+self.$('.js-bc-ticketId').text()).addHrefArgs({
        _t:_.now()
      }), {trigger: true, replace: false});
    }
  });

  module.exports = TicketPlayStatusView;
});
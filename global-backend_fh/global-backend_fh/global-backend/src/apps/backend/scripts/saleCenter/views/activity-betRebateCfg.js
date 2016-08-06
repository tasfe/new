/**
 * Created by Administrator on 2016/7/9.
 */

define(function (require, exports, module) {
  var BetRebateCfgView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/activity-betRebateCfg.html'),

    events: {
      'click .js-brc-btn-submit': 'saveBetRebateCfgHandler',
      'click .js-brc-btn-reset':'resetBetRebateCfgHandler'
    },

    initialize: function () {
    },

    //获取彩种列表
    _getTicketList: function (params) {
      return Global.sync.ajax({
        url: '/intra/playmng/tickets.json',
        data: params
      });
    },

    //发送请求
    _getBetRebateCfgData: function (params) {
      return Global.sync.ajax({
        url: '/intra/betrebate/betrebatecfg.json',
        data: params
      });
  },
    onRender: function () {
      var self = this;
      //初始化活动时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-brc-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();

      //初始化开放时间选择
      new Global.Prefab.Timeset({
        prevClass:'js-time',
        el: this.$('.js-brc-opentimeset'),
        startTime: 'fromTime',
        endTime: 'endTime',
        endDate: moment().add(10, 'year'),
        startOps: {
          format: 'H:mm'
        },
        endOps: {
          format: 'H:mm'
        },
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();

      var params = {};
      this._getTicketList(params).done(function (res) {
        if (res.result === 0 ) {
          if(res.root){
             var html='';
            _.map(res.root, function(ticketInfo){
               html = html + '<label><input type="radio"  value="'+ticketInfo.ticketId+'" name="ticketId"/><span class="vertical-top m-right-md">'+ticketInfo.ticketName+'</span></label>';
            });
            self.$('.js-brc-betRebateTypes').html(html);

            var activityId = 22;
            params = {activityId: activityId};
            self._loadPage(params, 'js-brc-cfgDetail');
            self.$('.js-brc-activityId').val(activityId);
          }
        } else {
          Global.ui.notification.show(res.msg);
        }
      }).fail(function () {
      });
    },
    _loadPage: function (params, classValue) {
      var self = this;
      this._getBetRebateCfgData(params).done(function (res) {
        if (res.result === 0 ) {
          if(res.root){
            self.$('.js-start-time').val(_(res.root.fromDate).toTime());
            self.$('.js-end-time').val(_(res.root.endDate).toTime());
            self.$('.js-time-start-time').val(res.root.fromTime);
            self.$('.js-time-end-time').val(res.root.endTime);
            self.$('.js-brc-betRebateRate').val(_(res.root.betRebate/100));
            self.$('.js-brc-activityId').val(res.root.activityId);
            self.$('input[name="ticketId"]').each(function(){
              if($(this).val() == res.root.ticketId){
                 $(this).attr("checked", true);
              }
            });
          }
        } else {
          Global.ui.notification.show(res.msg);
        }
      }).fail(function () {
      });
    },

    //保存配置
    saveBetRebateCfgHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var $currContainer = $('.js-brc-betRebateCfg-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        Global.sync.ajax({
            url: '/intra/betrebate/savebetrebatecfg.json',
            data: _($currContainer.serializeArray()).serializeObject()
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
              Global.appRouter.navigate(_('#sc/brc').addHrefArgs({_t: _.now()}), {
                trigger: true,
                replace: false
              });} else {
              Global.ui.notification.show('操作失败。');
            }
          });
      } else {
        $target.button('reset');
      }
    },

    resetBetRewardCfgHandler:function(e){
      this.render();
    }
  });
  module.exports = BetRebateCfgView;
});

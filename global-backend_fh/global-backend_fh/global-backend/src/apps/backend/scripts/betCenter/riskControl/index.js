/**
 * Created by David Zhang on 2015/9/8.
 */
define(function (require, exports, module) {

  var commonRuleSetView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!./index.html'),
    //所有的事件绑定全部写在这！
    events: {
      'submit .js-bc-form': 'confirmHandler',
      'click .js-bc-btn-cancel': 'formCancelHandler'
    },

    getInfoXhr: function () {
      return Global.sync.ajax({
        url: '/intra/ticketmng/riskdetail.json',
        data: {
          ticketId: this._parentView.options.ticketId
        }
      });
    },

    confirmXhr: function(data) {
      data.open = !!data.open;
      return Global.sync.ajax({
        url: '/intra/ticketmng/saverisk.json',
        data: data
      })
    },

    serializeData: function() {
      return {
        ticketId: this._parentView.options.ticketId
      };
    },

    //在页面被渲染出来的时候自动调用
    onRender: function () {
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      var self = this;
      this.$form = this.$('.js-bc-form');


      new Global.Prefab.Timeset({
        el: this.$('.js-bc-timeset'),
        startTime: 'fromTime',
        endTime: 'endTime',
        endDate:moment().add(100, 'year'),
        startOps: {
          format: 'H:mm'
        },
        endOps: {
          format: 'H:mm'
        }
      }).render();

      this.$form.parsley();

      this.getInfoXhr()
        .done(function (res) {
          var data;
          if (res && res.result === 0) {
            data = res.root || {};
            if(data.ticketId == 19 || data.ticketId == 20){
              self.$('.js-bc-riskRecord').addClass('hidden');
              self.$('.js-bc-periods').addClass('hidden');
            }

            self.$('[name=planNums]').val(data.planNums);
            self.$('.js-bc-ticketName').text(data.ticketName);
            self.$('[name=open]').prop('checked', data.open);
            self.$('[name=fromTime]').val(data.fromTime);
            self.$('[name=endTime]').val(data.endTime);
            self.$('[name=openIndex]').val(_(data.openIndex).formatDiv(100));
            self.$('[name=openNums]').val(data.openNums);
          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
    },

    confirmHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);

      var $submitBtn = $target.find('[type=submit]');

      $submitBtn.button('loading');

      this.confirmXhr(_($target.serializeArray()).serializeObject())
        .always(function () {
          $submitBtn.button('reset');
        })
        .done(function (res) {
          if (res && res.result === 0) {
            Global.ui.notification.show('操作成功。');
            self.onRender();
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
    },

    formCancelHandler:function(e) {
      this.onRender();
    }
  });

  module.exports = commonRuleSetView;
});
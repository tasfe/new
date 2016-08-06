define(function(require, exports, module) {

  var ConfigView = Base.ItemView.extend({

    template: require('text!./config.html'),

    events: {
      'submit .js-form': 'saveHandler',
      'click .js-hc-btn-reset': 'resetHandler'
    },

    initialize: function() {
      this.lastIndex = 0;
    },
    //发送请求
    getConfigXhr: function() {
      return Global.sync.ajax({
        url: '/intra/activitymanage/salescfgdetail.json',
        data: {
          activityId: 16
        }
      });
    },

    saveConfigXhr: function(data) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/savesalescfg.json',
        data: _(data).extend({
          activityId: 16
        })
      })
    },

    onRender: function() {
      new Global.Prefab.Timeset({
        el: this.$('.js-hc-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();

      this.$form = this.$('.js-form');
      this.$form.parsley();

      this._loadPage('js-hc-cfgDetail');
    },

    _loadPage: function(classValue) {
      var self = this;
      this.getConfigXhr()
        .done(function(res) {
        if (res.result === 0) {
          if (res.root) {
            self.$('.js-start-time').val(_(res.root.fromDate).toTime());
            self.$('.js-end-time').val(_(res.root.endDate).toTime());
            self.$('[name=userRebate]').val(_(res.root.userRebate).formatDiv(10));

            _(res.root.itemList).chain().sortBy(function(info) {
              return info.sales;
            }).each(function(info, index) {
              self.$('[name="itemList[' + index + '].day3"]').val(_(info.day3).convert2yuan());
              self.$('[name="itemList[' + index + '].day6"]').val(_(info.day6).convert2yuan());
              self.$('[name="itemList[' + index + '].day10"]').val(_(info.day10).convert2yuan());
              self.$('[name="itemList[' + index + '].day15"]').val(_(info.day15).convert2yuan());
              self.$('[name="itemList[' + index + '].day30"]').val(_(info.day30).convert2yuan());
            });
          }
        } else {
          Global.ui.notification.show(res.msg);
        }
      });
    },

    saveHandler: function(e) {
      var self = this;
      var $target = $(e.currentTarget);

      var $submitBtn = $target.find('[type=submit]');

      $submitBtn.button('loading');

      this.saveConfigXhr(_($target.serializeArray()).serializeObject())
        .always(function() {
          $submitBtn.button('reset');
        })
        .done(function(res) {
          if (res && res.result === 0) {
            Global.ui.notification.show('操作成功。');
            self.render();
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
    },

    resetHandler: function(e) {
      this.render();
    }
  });
  module.exports = ConfigView;
});
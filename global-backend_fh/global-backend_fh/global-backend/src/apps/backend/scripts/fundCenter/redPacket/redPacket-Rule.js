define(function(require, exports, module) {

  var operateCheckView = Base.ItemView.extend({

    template: require('text!./redPacket-Rule.html'),
    itemTpl: _(require('text!./redPacket-RuleItem.html')).template(),

    events: {
      'click .js-fc-gs-addBonusSet-btn': 'addBonusSetHandler',
      'click .js-fc-del': 'delItemHandler',
      'submit .js-fc-form': 'submitHandler',
      'change .js-fc-select-type': 'selectTypeHandler',
      'click .js-fc-gs-cancel': 'cancelHandler'
    },

    findBonusSetXhr: function(data) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/redenvelopecfgdetail.json',
        data: data
      });
    },
    saveBonusSetXhr: function(data) {
      return Global.sync.ajax({
        url: '/intra/activitymanage/saveredenvelopecfg.json',
        data: data
      });
    },
    onRender: function() {
      var self = this;

      this.options = {
        index: 0
      };

      this.$container = this.$('.js-fc-gs-container');
      this.$signNum = this.$('.js-fc-gs-signNum');
      this.$signRebate = this.$('.js-fc-gs-signRebate');
      this.$submit = this.$('.js-fc-submit');
      this.$form = this.$('.js-fc-form');
      this.$form.parsley();

      this.findBonusSetXhr()
        .done(function(res) {
          var root = res.root || {};
          if (res.result === 0) {
            self.generateBonusSetTr(root.itemList || []);
            self.$('input[name=fromDate]').val(_(root.fromDate).toTime());
            self.$('input[name=endDate]').val(_(root.endDate).toTime());
            self.$('select[name=agentLevel]').val(root.agentLevel);
            self.$('input[name=cycle]').val(root.cycle);
          } else {
            Global.ui.notification.show('处理信息获取失败' + res.msg);
          }
      });

      new Global.Prefab.Timeset({
        el: this.$('.js-fc-timeset'),
        startTime: 'fromDate',
        endTime: 'endDate',
        endDate: moment().add(10, 'years')
      }).render();

      this.$('input[name=fromDate],input[name=endDate]').prop('required', true)
    },

    generateBonusSetTr: function(itemList) {
      var self = this;
      this.options.index = itemList.length || 0;

      _(itemList).each(function(item, index) {
        self.$container.append(self.itemTpl({
          salesVolume: _(item.salesVolume).convert2yuan(),
          redEnvelopeType: item.redEnvelopeType,
          redEnvelopeVal: item.redEnvelopeType === 'fix' ? _(item.redEnvelopeVal).convert2yuan() : _(item.redEnvelopeVal).formatDiv(100),
          index: index
        }));
      });
    },
    addBonusSetHandler: function() {
      this.$container.append(this.itemTpl({
        index: this.options.index
      }));
      ++this.options.index;
    },
    delItemHandler: function(e) {
      $(e.currentTarget).closest('.js-fc-item').remove();
    },

    submitHandler: function(e) {
      var self = this;

      this.$submit.button('loading');

      this.saveBonusSetXhr(_(this.$form.serializeArray()).serializeObject())
        .always(function() {
          self.$submit.button('reset');
        })
        .done(function(res) {
          if (res.result === 0) {
            Global.ui.notification.show('操作成功。');
            self.render();
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });
    },

    selectTypeHandler: function(e) {
      var $target = $(e.currentTarget);
      var $item = $target.closest('.js-fc-item');
      var $value = $item.find('.js-fc-value');
      var $percent = $item.find('.js-fc-select-percent');
      if ($target.val() === 'fix') {
        $value.removeAttr('data-parsley-range data-parsley-twoDecimal');
        $value.attr({
          'data-parsley-range': '[0, 100000000]',
          'data-parsley-type': 'integer'
        });
        $percent.addClass('hidden');
      } else {
        $value.removeAttr('data-parsley-range data-parsley-type');
        $value.attr({
          'data-parsley-range': '[0.01, 100]',
          'data-parsley-twoDecimal': true
        });
        $percent.removeClass('hidden');
      }
      $value.parsley().validate();
    },

    cancelHandler: function() {
      this.render();
    }

  });

  module.exports = operateCheckView;
});
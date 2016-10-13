"use strict";

require('./index.scss');

var AgreementView = require('./agreement');

var SelfView = require('./topLevel/self');
var TopView = require('./topLevel');

var FirstLevelView = require('./firstLevel');

var dividendConfig = require('./dividendConfig');

var levelConfig = require('./levelConfig');

var DividendManageView = Base.ItemView.extend({

  template: '',

  className: 'ac-dm',

  officialAgreementTpl: _(require('./official-agreement.html')).template(),

  //events: {
  //  'click .js-ac-check-agreement': 'checkAgreementHandler'
  //},


  onRender: function() {
    var self = this;
    self._render();
  },


  _render: function() {
    var acctInfo = Global.memoryCache.get('acctInfo');

    if (acctInfo.dividendStatus === dividendConfig.getByName('APPLYING').id) {//APPLYING
      //申请中
      this.$el.html(new AgreementView().render().$el);
    } else if (acctInfo.dividendStatus === dividendConfig.getByName('APPLIED').id) {
      //已开通
      //if (acctInfo.userGroupLevel === levelConfig.getByName('TOP').id) {
        this.$el.html(new TopView().render().$el);
      //} else {
      //  this.$el.html(new FirstLevelView().render().$el);
      //}
    }else{

      var $dialog = Global.ui.dialog.show({
        title: '签约分红用户',
        body: '<div class="js-ac-add-container"></div>',
        modalClass: 'ten',
        size: 'modal-lg',
        footer: ''
      });
      var $container = $dialog.find('.js-ac-add-container');

      var agreementView = new AgreementView({
        el: $container
      })
        .render()
        .on('hide', function() {
          self.refresh();
          $dialog.modal('hide');
        });

      $dialog.on('hidden.modal', function() {
        $(this).remove();
        agreementView.destroy();
      });

      $dialog.find('.js-ac-next').on('click',function(e){
        self.approveHandler(e,$dialog);
      });
    }
  },

  approveXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/approve.json',
      data: data
    });
  },
  approveHandler: function(e,dialog) {
    var self = this;
    var $target = $(e.currentTarget);
    var status = $target.data('status');

    this.$btnApprove.button('loading');

    this.approveXhr({
      status: status
    })
      .always(function() {
        self.$btnApprove.button('reset');
      })
      .done(function(res) {
        if (res && res.result === 0) {
          Global.m.oauth.check()
            .done(function(res) {
              if (res && res.result === 0) {
                if (status === 1) {
                  Global.ui.notification.show('签署分红协议成功。', {
                    event: function() {
                      Global.m.oauth.check();
                      Global.router.goTo('ac/dm');
                    }
                  });
                } else {
                  Global.ui.notification.show('拒绝分红协议成功。', {
                    event: function() {
                      Global.m.oauth.check();
                      Global.router.goTo('');
                    }
                  });
                }
              }
              dialog.modal('hide');
            });
        } else {
          dialog.modal('hide');
          Global.ui.notification.show(res.msg || '');
        }
      });
  }

});

module.exports = DividendManageView;

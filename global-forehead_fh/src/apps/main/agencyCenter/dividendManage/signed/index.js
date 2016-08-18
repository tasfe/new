"use strict";

var SignedView = Base.ItemView.extend({

  template: require('./index.html'),

  verifyTpl: _(require('./verify.html')).template(),

  officialAgreementTpl: _(require('./../official-agreement.html')).template(),

  events: {
    'click .js-ac-check-agreement': 'checkAgreementHandler',
    'click .js-add-area': 'addArea',
    'change #jsAcAgreeSign': 'changeAgreeHandler',
    'change .js-ac-divid': 'dividChangeHandler',
    'submit .js-ac-signed-form': 'nextHandler',
    'submit .js-ac-verify-form': 'confirmHandler'
  },

  addArea: function () {
   // alert(1);
      $('.js-julien-dm-area').removeClass('hidden');
     $('.julien-dm-area').append('<dl><dd><span class="js-athena-span-01" >234</span></dd><dd><span class="js-athena-span-02">123</span>%</dd><dt><span class="athena-dl-area">删除</span></dt> </dl>');

    $('.athena-dl-area').click(function(){
       $(this).parent().parent().remove();
      console.log(this.index);
    });
    $('.js-add-area').click(function(){
      //alert(1);
      $('.js-athena-span-01').eq($('.js-athena-span-01').length -1).html($('[name="betTotal"]').val());
      $('.js-athena-span-02').eq($('.js-athena-span-02').length -1).html($('[name="divid"]').val());
    })
  },

  signXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/sign.json',
      data: data
    });
  },

  verifyXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/valid.json',
      data: data
    });
  },

  serializeData: function() {
    var userData = this.options.userData;
    var dividConf = this.options.dividConf;

    dividConf.formatRebateLimit = _(dividConf.rebateLimit).formatDiv(10);
    dividConf.formatDividMax = _(dividConf.dividMax).formatDiv(100);
    dividConf.formatDividMin = _(dividConf.dividMin).formatDiv(100);

    if (userData) {
      userData.formatDivid = _(userData.divid).formatDiv(100);
      if (dividConf.formatDividMin < userData.formatDivid) {
        dividConf.formatDividMin = userData.formatDivid;
      }
    }
    return this.options;
  },

  onRender: function() {
    this.$btnNext = this.$('.js-ac-next');
    this.$form = this.$('.js-ac-signed-form');
    this.$verify = this.$('.js-ac-verify');

    this.$form.parsley();

    window.ParsleyExtend.addAsyncValidator('accheckusername', function(xhr) {
      var valid = xhr.responseJSON.result === 0;

      this.$element.parsley().domOptions.remoteMessage = xhr.responseJSON.msg || '';

      return valid;
    }, '/fund/divid/valid.json');
  },

  changeAgreeHandler: function(e) {
    var $target = $(e.currentTarget);
    this.$btnNext.prop('disabled', !$target.prop('checked'));
  },

  nextHandler: function() {
    this.data = _(this.$form.serializeArray()).serializeObject();
    this.data.agreement = _(this.data.agreement).escape();
    this.$form.addClass('hidden');
    this.$verify.html(this.verifyTpl(_({
      dividConf: this.options.dividConf
    }).extend(this.data)));
  },

  confirmHandler: function(e) {
    var self = this;
    var $btnConfirm = this.$('.js-ac-confirm');
    $btnConfirm.button('loading');

    this.signXhr(this.data)
      .always(function() {
        $btnConfirm.button('reset');
      })
      .done(function(res) {
        if (res && res.result === 0) {
          Global.ui.notification.show('操作成功！<br />等待下级同意签约。');
          self.trigger('hide');
        } else {
          Global.ui.notification.show(res.msg || '');
        }
      });
  },

  checkAgreementHandler: function(e) {
    var $target = $(e.currentTarget);

    var $dialog = Global.ui.dialog.show({
      title: '无限娱乐分红协议条款',
      size: 'modal-lg',
      body: '<div class="ac-official">' + this.officialAgreementTpl() + '</div>',
      footer: ''
    });

    $dialog.on('hidden.modal', function() {
      $(this).remove();
    });
  },

  dividChangeHandler: function(e) {
    var $target = $(e.currentTarget);
    var divid = Number($target.val());
    var min = this.options.dividConf.formatDividMin;
    var max = this.options.dividConf.formatDividMax;

    if (!_.isNumber(divid)) {
      divid = min;
    }

    if (divid < min) {
      $target.val(min);
    }

    if (divid > max) {
      $target.val(max);
    }
  }
});

module.exports = SignedView;

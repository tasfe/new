"use strict";

var SignedView = Base.ItemView.extend({

  template: require('./index.html'),

  verifyTpl: _(require('./verify.html')).template(),

  officialAgreementTpl: _(require('./../official-agreement.html')).template(),

  events: {
    'click .js-ac-check-agreement': 'checkAgreementHandler',
    'click .js-add-area': 'addArea',
    'click .js-ac-next': 'saveData',
    'change #jsAcAgreeSign': 'changeAgreeHandler',
    'change .js-rebetRate': 'dividChangeHandler',
    'submit .js-ac-signed-form': 'nextHandler'
  },

  saveData: function () {
    var clpValidate = this.$('.js-ac-signed-form').parsley().validate();
    if (clpValidate) {
      var self = this;
      var $btnConfirm = this.$('.js-ac-next');
      $btnConfirm.button('loading');

      this.signXhr()
      .always(function() {
        $btnConfirm.button('reset');
      })
      .done(function(res) {
        if (res && res.result === 0) {
          $('.modal-lg-julien').modal('hide');
          Global.ui.notification.show('操作成功！<br />等待下级同意签约。');
        } else {
          Global.ui.notification.show(res.msg || '');
        }
      });
    }
  },

  addArea: function () {
    if ($('.js-betTotal').val() != '' && $('.js-rebetRate').val() != '') {
      $('.js-julien-dm-area').removeClass('hidden');
      $('.julien-dm-area').append('<dl><dd>≥<span class="js-athena-span-01" >' + $('[name="betTotal"]').val() +'</span></dd><dd><span class="js-athena-span-02">' + $('[name="divid"]').val() + '</span>%</dd><dt><span class="athena-dl-area">删除</span></dt> </dl>');

      $('.athena-dl-area').click(function(){
         $(this).parent().parent().remove();

         if ($('.js-julien-dm-area dl').length == 1) {
          $('.js-julien-dm-area').addClass('hidden');
         }
      });
    }
  },

  signXhr: function() {
    var itemList = [];
    for (var i = 0; i < $('.js-athena-span-01').length; i++){
      itemList[i] = {
        betTotal: $('.js-athena-span-01').eq(i).text(),
        divid: $('.js-athena-span-02').eq(i).text() *10
      };
    }

    return Global.sync.ajax({
      url: '/fund/divid/sign.json',
      tradition: true,
      data:{
        username: $('.js-username').val(),
        itemList: itemList
      }
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

    var listContent = $('.js-update-content').val();
    var username = $('.js-update-username').val();
    if (listContent != '') {
      $('.js-username').val(username);
      $('.js-julien-dm-area').removeClass('hidden');

      var data = listContent.split(' ');
      var obj = {};
      for (var i = 0; i < data.length - 1; i++) {
        obj = eval('(' + data[i] + ')');
        $('.julien-dm-area').append('<dl><dd>≥<span class="js-athena-span-01" >' + obj.betTotal/10000 +'</span></dd><dd><span class="js-athena-span-02">' + obj.divid/100 + '</span>%</dd><dt><span class="athena-dl-area">删除</span></dt> </dl>');
      }

      $('.athena-dl-area').click(function(){
         $(this).parent().parent().remove();

         if ($('.js-julien-dm-area dl').length == 1) {
          $('.js-julien-dm-area').addClass('hidden');
         }
      });
    }
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

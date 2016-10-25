"use strict";

require('./index.scss');

var FooterView = Base.ItemView.extend({

  template: require('./index.html'),
  validateTpl: _(require('./userFeedbackInfo.html')).template(),
  events: {
    'mouseover .js-footer-qrcode': 'showBigQrcode',
    'mouseout .js-footer-qrcode': 'hideBigQrcode',
    'click .js-footer-feedback': 'feedbackSubmitHandler' //提交反馈信息
  },

  render: function() {
    var self = this;
    this.$el.html(_(this.template).template()(this.options));
    this.$qrcodebig = this.$(".js-qrcode-big");

    var $body = $('body');
    var $html = $('html');
    setInterval(function() {
      self.$el.removeClass('footer-fixed');
      self.$el.toggleClass('footer-fixed', $body.height() < ($html.height()));
    }, 100);
  },
  showBigQrcode: function() {
    this.$qrcodebig.removeClass("hidden");
  },
  hideBigQrcode: function() {
    this.$qrcodebig.addClass("hidden");
  },
  verifyFeedbackInfoXhr: function(data) {
    return Global.sync.ajax({
      url: '/info/feedback/commit.json',
      data: data
    });
  },
  //提交反馈信息
  feedbackSubmitHandler: function(e) {
    var $target = $(e.currentTarget);
    var type = 'addBankCard';
    var token = this.$('.js-uc-pwdToken').val();
    if(token && !(_(token).isEmpty())) {
      Global.appRouter.navigate(_('#uc/cm/bind').addHrefArgs({
        _t: _.now(),
        pwdToken: token
      }), {trigger: true, replace: false});
    } else {
      this.popValidateFeedbackInfoModal(type);
    }
  },
  refreshValCodeHandler: function($valImg, $valCode) {
    $valImg.attr('src', '');
    var url = window.self.location.toString();
    var codeUrl = url.substring(0, url.indexOf('/', url.indexOf('://', 0) + 3)) + '/acct/imgcode/code';
    $valImg.attr('src', codeUrl + '?_t=' + _.now());
    $valCode.val('');
  },
  popValidateFeedbackInfoModal: function(type, cardId) {
    var self = this;
    var url = window.self.location.toString();
    this.codeUrl = url.substring(0, url.indexOf('/', url.indexOf('://', 0) + 3)) + '/acct/imgcode/code';
    var $dialog = Global.ui.dialog.show({
      size: 'footer-feedback-body',
      title: '用户反馈',
      body: this.validateTpl({type: type, src: this.codeUrl + '?_t=' + _.now()}),
      footer: ''
    });

    $dialog.on('hidden.modal', function() {
      $(this).remove();
    });

    $dialog.off('click.refresh').on('click.refresh', '.js-ft-valImg', function(ev) {
      var $valImg = $dialog.find('.js-ft-valImg');

      var url = window.self.location.toString();
      var codeUrl = url.substring(0, url.indexOf('/', url.indexOf('://', 0) + 3)) + '/acct/imgcode/code';
      $valImg.attr('src', codeUrl + '?_t=' + _.now());
    });

    $dialog.off('change.refreshNum keyup.refreshNum').on('change.refreshNum keyup.refreshNum', '.js-ft-content', function(ev) {
      var contentLen = $dialog.find('.js-ft-content').val().length;
      $dialog.find('.js-ft-left').html(500 - contentLen);
    });

    $dialog.off('input.valCode').on('input.valCode', '.js-ft-code', function(ev) {
      if($dialog.find('.js-ft-code').val().length == 4) {
        Global.sync.ajax({
          type: 'POST',
          url: '/acct/imgcode/val.json',
          data: {
            code: $dialog.find('.js-ft-code').val()
          }
        }).done(function(data, status, xhr) {
          if(data.result === 0) {
            $dialog.find('.js-code').removeClass('wrong');
            $dialog.find('.js-code').addClass('correct');
          } else {
            self.refreshValCodeHandler($dialog.find('.js-ft-valImg'), $dialog.find('.js-ft-code'));
            $dialog.find('.js-code').addClass('wrong');
            $dialog.find('.js-code').removeClass('correct');
          }
        }).fail(function() {
          self.refreshValCodeHandler($dialog.find('.js-ft-valImg'), $dialog.find('.js-ft-code'));
          Global.ui.notification.show('验证码错误');
        });
      }
    });

    $dialog.off('click.validateInfo')
      .on('click.validateInfo', '.js-ft-cmValidateFeedbackInfo', function(ev) {
        var $target = $(ev.currentTarget);
        var valType = $dialog.find('.js-ft-type').val();
        var title = $dialog.find('.js-ft-title').val();
        var content = $dialog.find('.js-ft-content').val();
        var code = $dialog.find('.js-ft-code').val();
        if(!valType || valType === '') {
          $dialog.find('.js-ft-cmValFeedbackInfoNotice').html(self._getErrorEl('反馈类型不能为空'));
          return;
        }
        if(!title || title === '') {
          $dialog.find('.js-ft-cmValFeedbackInfoNotice').html(self._getErrorEl('主题不能为空'));
          return;
        }
        if(!content || content === '') {
          $dialog.find('.js-ft-cmValFeedbackInfoNotice').html(self._getErrorEl('内容不能为空'));
          return;
        }
        if(!code || code === '') {
          $dialog.find('.js-ft-cmValFeedbackInfoNotice').html(self._getErrorEl('验证码不能为空'));
          return;
        }
        var data = {
          type: valType,
          title: title,
          content: content,
          code: code
        };

        $target.button('loading');

        self.verifyFeedbackInfoXhr(data)
          .always(function() {
            $target.button('reset');
          })
          .done(function(res) {
            if(res.result === 0) {
              Global.ui.notification.show("意见反馈提交成功。", {
                type: 'success'
              });
              $dialog.modal('hide');
            } else {
              Global.ui.notification.show("意见反馈提交失败。");
            }
          });
      });
  },
  _getErrorEl: function(text) {
    return '<div class="alert alert-danger alert-dismissible" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '<span aria-hidden="true">×</span>' +
      '</button>' +
      '<i class="fa fa-times-circle m-right-xs"></i>' +
      '<strong>提示！</strong> ' + text +
      '</div>';
  }
});

module.exports = FooterView;

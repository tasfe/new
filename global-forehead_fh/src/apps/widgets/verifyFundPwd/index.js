"use strict";

$.widget('gl.verifyFundPwd', {

  options: {
    id: '',
    namespace: 'tip',
    title: '验证资金密码',
    onValidateSuccess: _.noop
  },

  _create: function() {
    var self = this;
    var body = [];
    body.push('<div class="text-center m-TB-lg">');
    body.push('<form class="js-gl-fund-check-form form-horizontal" action="javascript:void(0)">');
    body.push('<div class="font-sm m-bottom-sm text-amber">输入资金密码：</div>');
    body.push('<div class="m-bottom-lg p-bottom-lg"><input type="password" class="js-uc-cmPayPwd input-md text-center" name="payPwd" placeholder="请输入资金密码" required /></div>');
    body.push('<button type="submit" class="js-uc-cmValidatePayPwd btn btn-pink btn-linear" data-loading-text="确定">确定</button>');
    body.push('</form>');
    body.push('</div>');

    this.uuid = this.options.id || this.options.namespace + _.now();

    this.$dialog = Global.ui.dialog.show({
      id: this.uuid,
      title: this.options.title,
      size: 'modal-md',
      body: body.join('')
    });

    this.$form = this.$dialog.find('.js-gl-fund-check-form');

    this.$submit = this.$form.find('.js-uc-cmValidatePayPwd');

    this.$dialog.on('hidden.modal', function(e) {
      $(this).remove();
      self.destroy();
    });

    this._bindEvents();
  },

  _bindEvents: function() {
    var self = this;
    this.$dialog.off('submit')
      .on('submit', '.js-gl-fund-check-form', function() {

        var parsley = self.$form.parsley(Global.validator.getInlineErrorConfig());
        var inputParsley = self.$form.find('[name=payPwd]').parsley();

        ParsleyUI.removeError(inputParsley, 'remoteError');

        if(!parsley.validate()) {
          return false;
        }

        self.$submit.button('loading');

        //验证密码
        var payPwd = self.$dialog.find('.js-uc-cmPayPwd').val();

        var data = {
          payPwd: payPwd,
          type: '1'
        };

        self.verifyPayPwdXhr(data)
          .always(function() {
            self.$submit.button('reset');
          })
          .done(function(res) {
            if(res.result === 0) {
              self.$dialog.modal('hide');
              self.options.onValidated(payPwd);
            } else {
              if(_(res.root).isNull()) {
                ParsleyUI.addError(inputParsley, 'remoteError', '验证失败，' + res.msg, 'required');
              } else {
                if(res.root > 0) {
                  ParsleyUI.addError(inputParsley, 'remoteError', '验证失败，剩余' + res.root + '次机会', 'required');
                } else {
                  ParsleyUI.addError(inputParsley, 'remoteError', '验证失败，请一个小时后在验证！', 'required');
                }
              }
            }
          });
      });

  },

  changeHrefHandler: function(e) {
    if(this.$dialog) {
      this.$dialog.modal('hide');
    }
  },

  check: function(_callback) {
    this._create();
    this._callback = _callback;
  },
  verifyPayPwdXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/moneypd/verify.json',
      data: data
    });
  }
});

module.exports = $.gl.verifyFundPwd;

"use strict";

$.widget('gl.verifyFundPwd', {

  options: {
    id: '',
    namespace: 'tip',
    title: '验证资金密码'
  },

  _create: function() {
    var self = this;
    var body = [];
    body.push('<div class="text-center margin-sm">');
    body.push('<form class=" uc-cm-fund-pwd-form form-horizontal" action="javascript:void(0)">');
    body.push('<div class="uc-bank-manage-lock">');
    body.push('<div class="control-group uc-cm-fund-pwd-div">');
    body.push('<label class="control-label uc-cm-fund-label">资金密码</label>');
    body.push('<div class="controls text-left">');
    body.push('<input type="password" class="js-uc-cmPayPwd uc-cmPayPwd "/>');
    body.push('</div>');
    body.push('</div>');
    body.push('<div class="control-group uc-cm-fund-pwd-notice-div">');
    body.push('<div class="controls text-left">');
    body.push('<ul class="js-uc-cmValPayPwdNotice parsley-errors-list filled font-sm">');
    body.push('</ul>');
    body.push('</div>');
    body.push('</div>');
    body.push('<div class="control-group">');
    body.push('<div class="controls text-left">');
    body.push('<button type="button" class="js-uc-cmValidatePayPwd uc-cmValidatePayPwd btn-liner width-250 ">下一步</button>');
    body.push('</div>');
    body.push('</div>');
    body.push('</div>');
    body.push('</form>');
    body.push('</div>');

    this.uuid = this.options.id || this.options.namespace + _.now();

    this.$dialog = Global.ui.dialog.show({
      id: this.uuid,
      title: this.options.title,
      size: 'modal-md',
      body: body.join('')
    });
    this.$validateError = this.$dialog.find('.js-uc-cmValPayPwdNotice');
    this.$dialog.on('hidden.bs.modal', function (e) {
      $(this).remove();
      self.destroy();
    });

    this._bindEvents();
  },

  _bindEvents: function() {
    var self = this;
    this.$dialog.off('click.verifyPwd')
        .on('click.verifyPwd', '.js-uc-cmValidatePayPwd',function () {
          //验证密码
          var payPwd = self.$dialog.find('.js-uc-cmPayPwd').val();
          if(!payPwd || payPwd === '') {
            self.$validateError.html('资金密码不能为空');
            return ;
          }

          var data = {
            payPwd: payPwd,
            type:'1'
          };

          self.verifyPayPwdXhr(data)
              .done(function(res) {
                if (res.result === 0) {
                 
                  self.$dialog.modal('hide');
                  //self.$('.js-uc-pwdToken').val(res.root);
                  //self.$('.js-uc-cm-fundPwdInput').addClass('hidden');
                  if(self.options.parentView && self.options.parentView.verifySuccCallBack){

                    self.options.parentView.verifySuccCallBack(payPwd);
                  }
                } else {
                  if(_(res.root).isNull()) {
                    self.renderError('验证失败，' + res.msg);
                  }else{
                    if (res.root > 0) {
                      self.renderError('验证失败，剩余' + res.root + '次机会');
                    } else {
                      self.renderError('验证失败，请一个小时后在验证！');
                    }
                  }
                }
              });
        });

  },

  changeHrefHandler: function(e) {
    if (this.$dialog) {
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
      data:data
    });
  },
  renderError: function(text) {
    this.$validateError.closest('.control-group').removeClass('hidden');
    this.$validateError.html(text);
  }
});

module.exports = $.gl.verifyFundPwd;

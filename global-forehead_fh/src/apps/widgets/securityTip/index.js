"use strict";
var bankCard = require('./bankCard.png');
var fundPwd = require('./fundPwd.png');

$.widget('gl.securityTip', {

  options: {
    id: '',
    namespace: 'tip',
    title: '安全提示',
    content: '请补充完您的安全信息后再提现',
    hasMoneyPwd: false,
    hasSecurity: false,
    hasBankCard: false,
    showBankCard: true,
    showSecurity: true,
    showMoneyPwd: true
  },

  _create: function() {

    var self = this;

    var body = [];
    body.push('<div class="text-center margin-sm">');
    body.push('<div class="m-bottom-md font-md fc-security-notice-content">' + this.options.content + '</div>');
    body.push('<div class="fc-security-notice-link">');
    if(this.options.showMoneyPwd){
      body.push('<div class="security-notice-type-div">');
      var fundPasswordHmtl = '<span class="security-notice-span text-left">资金密码已设置完毕</span>';
      if (!this.options.hasMoneyPwd) {
        fundPasswordHmtl = '<span class="security-notice-span text-left">建议您</span><a class="js-fc-aHref btn-link text-pleasant" href="#as/pf" >去设置资金密码</a>';
      }
      body.push(fundPasswordHmtl+'</div>');
    }

    if(this.options.showBankCard){
      body.push('<div class="security-notice-type-div">');
      var bankCardHtml = '<span class="security-notice-span text-left">银行卡已绑定</span>';
      if (!this.options.hasBankCard) {
        bankCardHtml = '<span class="security-notice-span text-left">建议您</span><a class="js-fc-aHref  btn-link text-pleasant " href="#uc/cm" >去绑定银行卡</a>';
      }
      body.push(bankCardHtml+'</div>');
    }

    if(this.options.showSecurity){

      body.push('<div class="security-notice-type-div">');
      var securityHtml = '<span class="security-notice-span text-left">安全问题已绑定</span>';
      
      if (!this.options.hasSecurity) {
        securityHtml = '<span class="security-notice-span text-left">建议您</span><a class="js-fc-aHref  btn-link text-pleasant " href="#as/sq" >去绑定安全问题</a>';
      }
      body.push(securityHtml+'</div>');
    }

    body.push('</div>');
    body.push('</div>');

    this.uuid = this.options.id || this.options.namespace + _.now();

    if (this.options.body) {
      this.options.body.html(body.join(''));
    } else {
      this.$dialog = Global.ui.dialog.show({
        id: this.uuid,
        title: this.options.title,
        size: 'modal-smd',
        body: body.join('')
      });

      this.$dialog.on('hidden.bs.modal', function (e) {
        $(this).remove();
        self.destroy();
      });
    }

    this._bindEvents();
  },

  _bindEvents: function() {
    this._on({
      'click .js-fc-aHref': 'changeHrefHandler'
    });
  },

  changeHrefHandler: function(e) {
    if (this.$dialog) {
      this.$dialog.modal('hide');
    }
  },

  show: function() {
    Global.ui.dialog.show({
      id: this.uuid
    });
  }
});

module.exports = $.gl.securityTip;
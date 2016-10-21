"use strict";

require('./index.scss');

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
    body.push('<dl class="pf-security-tip">');
    body.push('<dt class="pf-security-icon"><div class="circle-icon circle-icon-lg"><i class="fa fa-pencil-square-o"></i></div></dt>');
    body.push('<dd class="m-TB-xs font-md">' + this.options.content + '</dd>');
    body.push('<dd class="overflow">');
    if(this.options.showMoneyPwd) {
      body.push('<div class="">');
      var fundPasswordHmtl = '<span class="text-amber">资金密码已设置完毕</span>';
      if(!this.options.hasMoneyPwd) {
        fundPasswordHmtl = '<span class="text-amber">资金密码未设置：</span><a class="js-fc-aHref btn-link text-pleasant" href="#pm/pf" >点击设置</a>';
      }
      body.push(fundPasswordHmtl + '</div>');
    }

    if(this.options.showBankCard) {
      body.push('<div class="">');
      var bankCardHtml = '<span class="text-amber">银行卡已绑定</span>';
      if(!this.options.hasBankCard) {
        bankCardHtml = '<span class="text-amber">银行卡未绑定：</span><a class="js-fc-aHref  btn-link text-pleasant " href="#uc/cm" >点击绑定</a>';
      }
      body.push(bankCardHtml + '</div>');
    }

    if(this.options.showSecurity) {

      body.push('<div class="">');
      var securityHtml = '<span class="text-amber">安全问题已绑定</span>';

      if(!this.options.hasSecurity) {
        securityHtml = '<span class="text-amber">安全问题未绑定：</span><a class="js-fc-aHref  btn-link text-pleasant " href="#pm/sq" >点击绑定</a>';
      }
      body.push(securityHtml + '</div>');
    }

    body.push('</dd>');
    body.push('</dl>');

    var footer = [];
    footer.push('<div class="border-top p-top-md"><button class="btn btn-pink btn-linear" data-dismiss="modal">确认</button></div>');

    this.uuid = this.options.id || this.options.namespace + _.now();

    if(this.options.body) {
      this.options.body.html(body.join(''));
    } else {
      this.$dialog = Global.ui.dialog.show({
        id: this.uuid,
        title: this.options.title,
        size: 'modal-md',
        body: body.join(''),
        footer: footer.join('')
      });

      this.$dialog.on('hidden.bs.modal', function(e) {
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
    if(this.$dialog) {
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
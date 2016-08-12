"use strict";

$.widget('gl.transfer', {

  options: {
    id: '',
    namespace: 'tip',
    title: '转账',
    userId: 0,
    data: {}
  },

  _create: function() {
    var self = this;
    this.uuid = this.options.id || this.options.namespace + _.now();

    var body = [];
    body.push('<div class="julien-transfer-dialog julien-verify">');
    body.push('<div class="tips js-transfer-tips" data-id="' + this.options.userId + '" data-did="' + this.uuid + '"></div>');
    body.push('<div class="js-ac-transfer-container transferContainer">');
    body.push('<dl class="price"><dt>可用金额：</dt><dd>0</dd></dl>');
    body.push('<dl><dt>转账金额：</dt><dd><input class="js-fc-tf-amount" type="text"><i></i><div class="messageBox"><b></b><span></span></dd></dl>');
    body.push('<dl><dt>安全问题：</dt><dd></dd></dl>');
    body.push('<dl><dt>答案：</dt><dd><input class="js-question-input" type="text"><i></i><div class="messageBox"><b></b><span></span></dd></dl>');
    body.push('<dl><dt>资金密码：</dt><dd><input class="js-fc-tf-payPwd" type="password"><i></i><div class="messageBox"><b></b><span></span></dd></dl>');
    body.push('</div>');
    body.push('<div class="row-btn"><button type="button" class="js-transfer-btn" data-loading-text="提交中">确认转账</button></div>');
    body.push('</div>');

    this.$dialog = Global.ui.dialog.show({
      id: this.uuid,
      title: '给' + this.options.title + '转账',
      size: 'modal-lg-julien',
      body: body.join('')
    });

    this.$validateError = this.$dialog.find('.js-uc-cmValPayPwdNotice');
    this.$dialog.on('hidden.bs.modal', function (e) {
      $(this).remove();
      self.destroy();
    });

    this._bindEvents();
  },

  _bindEvents: function () {
    var self = this;

    var data = this.options.data.root;
      
    $('.js-ac-transfer-container dl dd').eq(0).html(data.balance / 10000);
    $('.js-ac-transfer-container dl dd').eq(2).html(data.question);
    $('.js-question-input').attr('data-qid',data.securityId);

    var minMoney = data.minMoney / 10000;
    var maxMoney = data.maxMoney / 10000;
    var tradeNum = data.tradeNum;
    var confNum = data.confNum;

    $('.js-question-input').attr('data-tradenum',tradeNum);
    $('.js-question-input').attr('data-confnum',confNum);

    if (minMoney == 0) {
      minMoney = '无限制';
    }
    if (confNum == 0) {
      tradeNum = '无限制';
    }

    var strTips = '温馨提示：单笔最低转账金额' + minMoney + ',最高转账金额' + maxMoney + '元,转账次数' + tradeNum + '。';
    $('.js-transfer-tips').html(strTips);
    $('.js-fc-tf-amount').attr('data-parsley-range',minMoney + ',' + maxMoney);

    $('.js-transfer-btn').on('click',function () {

      var amount = $('.js-fc-tf-amount').val() * 1;
      var range = $('.js-fc-tf-amount').data('parsley-range');
      var balance = $('.js-ac-transfer-container dl dd').eq(0).text() / 10000;

      var iIs = 0;

      range = range.split(',');

      if (isNaN(amount)) {
        $('.js-fc-tf-amount').val(0);
        $('.js-ac-transfer-container dl').eq(1).addClass('wrong');
        $('.js-ac-transfer-container dl').eq(1).removeClass('correct');
        $('.js-ac-transfer-container dl .messageBox span').eq(0).text('转账金额' + range[0] + '元 - ' + range[1] + '元');

        iIs = 1;
      }
      else if (balance < amount || isNaN(balance)) {
        $('.js-ac-transfer-container dl').eq(1).addClass('wrong');
        $('.js-ac-transfer-container dl').eq(1).removeClass('correct');
        $('.js-ac-transfer-container dl .messageBox span').eq(0).text('转账资金不足');

        iIs = 1;
      }
      else if (amount > range[0] && amount < range[1]) {

        $('.js-ac-transfer-container dl').eq(1).addClass('correct');
        $('.js-ac-transfer-container dl').eq(1).removeClass('wrong');
        $('.js-ac-transfer-container dl .messageBox span').eq(0).text('');
      }
      else{
        $('.js-ac-transfer-container dl').eq(1).addClass('wrong');
        $('.js-ac-transfer-container dl').eq(1).removeClass('correct');
        $('.js-ac-transfer-container dl .messageBox span').eq(0).text('转账金额' + range[0] + '元 - ' + range[1] + '元');

        iIs = 1;
      }

      var question = $('.js-question-input').val();

      if (question == '') {
        $('.js-ac-transfer-container dl').eq(3).addClass('wrong');
        $('.js-ac-transfer-container dl').eq(3).removeClass('correct');
        $('.js-ac-transfer-container dl .messageBox span').eq(1).text('不能为空');

        iIs = 1;
      }
      else{
        $('.js-ac-transfer-container dl').eq(3).addClass('correct');
        $('.js-ac-transfer-container dl').eq(3).removeClass('wrong');
        $('.js-ac-transfer-container dl .messageBox span').eq(1).text('');
      }

      var payPwd = $('.js-fc-tf-payPwd').val();

      if (payPwd.length <6 || payPwd.length >20) {
        $('.js-ac-transfer-container dl').eq(4).addClass('wrong');
        $('.js-ac-transfer-container dl').eq(4).removeClass('correct');
        $('.js-ac-transfer-container dl .messageBox span').eq(2).text('字符数在6~20之间');

        iIs = 1;
      }
      else{
        $('.js-ac-transfer-container dl').eq(4).addClass('correct');
        $('.js-ac-transfer-container dl').eq(4).removeClass('wrong');
        $('.js-ac-transfer-container dl .messageBox span').eq(2).text('');
      }


      if($('.js-question-input').data('tradenum') == 0 && $('.js-question-input').data('confnum') != 0){
        Global.ui.notification.show('可转账次数不足。');
        iIs = 1;
      }
      
      if (iIs == 0) {
        $('.js-fc-btn-submit').button('loading');

        self.getTransferXhr()
        .always(function() {
          $('.js-fc-btn-submit').button('reset');
        })
        .done(function(res) {
          if (res && res.result === 0) {
            Global.ui.notification.show('转账成功。', {
              type: 'success'
            });

            $('#' + $('.js-transfer-tips').data('did')).modal('hide');
          } else {
            if(_(res.root).isNumber()) {
              if (res.root > 0){
                Global.ui.notification.show('验证失败，您还有' + res.root + '次输入机会');
              }
              if(res.root === 0){
                Global.ui.notification.show('验证失败，请一个小时后再尝试！');
              }
            } else {
              Global.ui.notification.show('验证失败，' + res.msg);
            }
          }
        });
      }
    });
  },

  getTransferXhr: function() {
    return Global.sync.ajax({
      url: '/fund/transfer/transfer.json',
      data: {
        moneyPwd: $('.js-fc-tf-payPwd').val(),
        tradeMoney: $('.js-fc-tf-amount').val(),
        answer: $('.js-question-input').val(),
        securityId: $('.js-question-input').data('qid'),
        sub: $('.js-transfer-tips').data('id')
      },
      tradition: true
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

  renderError: function(text) {
    this.$validateError.closest('.control-group').removeClass('hidden');
    this.$validateError.html(text);
  },

  //获取转账信息
  getInfoXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/gettradeinfo.json',
      abort: false
    });
  }
});

module.exports = $.gl.transfer;

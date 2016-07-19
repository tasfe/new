"use strict";

var TabView = require('com/tabView');

var quickPayConfig = require('fundCenter/misc/quickPayConfig');
var bankConfig = require('userCenter/misc/bankConfig');
var picInfo = require('../misc/picInfo.png');
var picFlag = require('../misc/flag.png');
var pic = require('../misc/pic.png');

var RechargeView = TabView.extend({

  template: require('fundCenter/templates/recharge.html'),

  events: {
    'click .js-fc-re-payment-type': 'paymentTypeChangeHandler',
    'click .js-fc-re-bank': 'bankSelectHandler',
    'click .js-ac-statistic-type': 'quickAmountHandler',
    'click .js-fc-re-commit': 'confirmHandler',
    'click .js-payment-commit': 'paymentconfirmHandler',

    'mouseover .js-flag': 'showPicInfo',
    'mouseout .js-flag': 'hidePicInfo'
  },

  startOnLoading: true,

  className: 'js-fc-recharge-view fc-recharge',

  getRechargeBaseInfoXhr: function() {
    return Global.sync.ajax({
      url: '/fund/recharge/rechargetype.json'
    });
  },

  //去支付
  getPayTonglueyunXhr: function(amount,paymentId,paymentType,payUserName) {
    return Global.sync.ajax({
      url: '/fund/recharge/dopayTonglueyun.json',
      data: {
        amount: amount,
        paymentId:paymentId,
        paymentType:paymentType,
        payUserName:payUserName
      }
    });
  },

  //去支付
  getPayWFTXhr: function(amount,paymentId,paymentType,payUserName) {
    return Global.sync.ajax({
      url: '/fund/recharge/dopaymentrecharge.json',
      data: {
        amount: amount,
        paymentId:paymentId,
        paymentType:paymentType,
        payUserName:payUserName,
        wap:0
      }
    });
  },

  //查询
  getRechargequeryXhr: function(tradeNo) {
    return Global.sync.ajax({
      url: '/fund/recharge/rechargequery.json',
      data:{
        tradeNo:tradeNo
      }
    });
  },



  onRender: function() {
    var self = this;
    this.$PaymentContainer = this.$('.js-fc-re-tabs');
    this.$BankContainer = this.$('.js-fc-re-bankList');
    this.$QuickAmountContainer = this.$('.js-fc-re-quickAmounts');

    this.getRechargeBaseInfoXhr()
      .done(function(res) {
        if (res.result === 0) {
          self.generateTab(res.root.paymentList);
          self.paymentList = res.root.paymentList;
          self.$('.js-fc-re-payment-type:first').trigger('click');
        }
      });
  },
  initPaymentPage: function(e) {
    var $target = $(e.currentTarget);
    var paymentId = $target.data('paymentId');
    var paymentType = $target.data('paymentType');

    this.$('input[name="paymentId"]').val(paymentId);
    this.$('input[name="paymentType"]').val(paymentType);

    var payment = _(this.paymentList).findWhere({
      paymentType: paymentType
    });
    this.paymentInfo = {
      paymentId: paymentId,
      paymentType: paymentType
    };

    this.generateQuickAmount(payment.keyAmount);
    this.generateBankTab(payment);
    var maxAmount = _(payment.maxMoneyLimit).convert2yuan({fixed: 0});
    var minAmount = _(payment.minMoneyLimit).convert2yuan({fixed: 0});

    this.$('.js-fc-re-amount').attr('data-parsley-range', '[' + minAmount + ',' + maxAmount + ']');
    this.$('.js-fc-re-amount').removeClass('parsley-error');
    this.$('.tooltip').remove();
    this.$('.js-info-quickAmounts').html('（最低 <font color="red">'+minAmount+'</font> 元，最高 <font color="red">'+maxAmount+'</font> 元）');
    var $form = this.$('.js-fc-re-form');
    $form.parsley().reset();

    this.$('.js-paypal').hide();
    this.$('.js-wechat').hide();

    if(paymentId==9) {
      if(paymentType==4) {
        this.$('.js-paypal').show();
        this.$('.js-wechat').hide();
      }
      //wechat
      if(paymentType==5) {
        this.$('.js-paypal').hide();
        this.$('.js-wechat').show();
      }
    }
  },

  generateTab: function(paymentList) {
    var html = [];
    var paymentTypes = [];
    _(paymentList).each(function(payment, index) {
      var paymentInfo = quickPayConfig.get(payment.paymentType);
      html.push('<li class="js-fc-re-payment-type ' + (index === 0 ? 'active' : '') +
        '" data-payment-type="' + payment.paymentType + '" data-payment-id="' + payment.paymentId + '">');
      html.push('<a href="javascript:void(0)" class="fc-re-nav-tab-a" >');
      html.push('<span class="' + paymentInfo.className + '">' + paymentInfo.zhName + '</span>');
      html.push('</a>');
      html.push('</li>');
    });
    this.$PaymentContainer.html(html.join(''));
  },

  generateBankTab: function(payment) {
    if (!_(payment.bankList).isEmpty()) {
      var bankList = payment.bankList;
      var html = [];
      _(bankList).each(function(bank, index) {
        var bankInfo = bankConfig.get(bank.bankId);
        if ((index + 1) % 4 === 1) {
          html.push('<tr>')
        }
        html.push('<td class="js-fc-re-bank fc-re-bank ' + (index === 0 ? 'active' : '') + '" data-type="' + bankInfo.id + '" data-code="' + bank.bankCode + '">');
        html.push('<span class="' + bankInfo.className + '">' + bankInfo.zhName + '</span>');
        html.push('</td>');
        if ((index + 1) % 4 === 0) {
          html.push('</tr>')
        }
      });
      var n = _(bankList).size();
      var x = 4 - n % 4;

      if (x !== 0) {
        _(_(x).range()).each(function(item, index) {
          if (index === 0) {
            html.push('<td class="js-fc-re-bank fc-re-bank " data-type=""><span>其他</span></td>');
          } else {
            html.push('<td></td>');
          }
        });
        html.push('</tr>')
      }
      this.$BankContainer.html(html.join(''));
      this.$('.js-fc-re-bank').eq(0).trigger('click');
    } else {
      this.$BankContainer.html('');
    }
  },
  generateQuickAmount: function(keyAmount) {
    var self = this;
    var html = [];
    _(keyAmount).each(function(amount, index) {
      html.push('<li class="js-ac-statistic-type " data-type="' + amount + '">');
      html.push(self.formatAmount(amount));
      html.push('</li>');
    });
    this.$QuickAmountContainer.html(html.join(''));
  },
  paymentTypeChangeHandler: function(e) {
    var $target = $(e.currentTarget);
    $target.addClass('active').siblings().removeClass('active');
    this.initPaymentPage(e);
  },
  formatAmount: function(amount) {
    var str = String(amount);
    var l = str.length;
    if (str.slice(l - 4, l) === '0000') {
      str = str.replace(/0000$/, '万');
    } else if (str.slice(l - 3, l) === '000') {
      str = str.replace(/000$/, '仟');
    }
    return str;
  },

  quickAmountHandler: function(e) {
    var $target = $(e.currentTarget);
    var amount = $target.data('type');
    this.$('.js-fc-re-amount').val(amount);
  },

  bankSelectHandler: function(e) {
    var $target = $(e.currentTarget);
    this.$('.js-fc-re-bankList').find('td').removeClass('active');
    $target.addClass('active');
    var bankId = $target.data("type");
    var bankCode = $target.data("code");
    this.$('input[name="bankId"]').val(bankId);

    this.$('input[name="bankCode"]').val(bankCode);
  },

  confirmHandler: function() {

    var $form = this.$('.js-fc-re-form');
    var clpValidate = $form.parsley().validate();
    var paymentInfo;

    if (clpValidate) {
      //
      var paymentId_ = this.$('.js-paymentId').val();


      if(paymentId_==9) {
        this.paymentTransHandler();
        return;
      }

      if(paymentId_==13) {
        this.paymentWFTTransHandler();
        return;
      }


      $form.submit();
      var amount = this.$('.js-fc-re-amount').val();
      $('.js-fc-re-modal').closest('.modal').modal('hide');

      paymentInfo = quickPayConfig.get(this.paymentInfo.paymentType);

      var $dialog = Global.ui.dialog.show({
        title: '温馨提示',
        body: '<div class=" fc-re-resultShow text-center"><div class="text-center font-sm m-bottom-md fc-re-result-desc">请在新打开的页面完成支付</div>' +
        '<div  class="m-bottom-md"><span>支付方式：</span><input type="text" class="fc-re-paymentName  fc-re-payment-input" value="' + paymentInfo.zhName + '" disabled></div>' +
        '<div class="m-bottom-md"><span>充值金额：</span><input type="text" class="fc-re-rechargeAmount fc-re-payment-input" value="' + amount + '" disabled></div>' +
        '<div class="text-center m-bottom-lg">' +
        '<button type="button" class="js-fc-re-succ fc-re-result-btn fc-re-succ btn m-right-md">已完成充值</button>' +
        '<button type="button" class="js-fc-re-fail fc-re-result-btn fc-re-fail btn ">充值遇到问题</button>' +
        '</div></div>',
        footer: ''
      });

      $dialog.on('hidden.modal', function() {
        $(this).remove();
      });

      $dialog.off('click.rechargeSucc')
        .on('click.rechargeSucc', '.js-fc-re-succ', function() {
          //提交充值完成通知，
          $dialog.modal('hide');
          Global.router.goTo('#uc/rr');
        });

      $dialog.off('click.rechargeFail')
        .on('click.rechargeFail', '.js-fc-re-fail', function() {
          $dialog.modal('hide');
          window.open('#hc?page=withdrawal-flow');
        });
    }
  },

  showPicInfo: function() {

    $('.js-picInfo').show();
  },

  hidePicInfo: function() {

    $('.js-picInfo').hide();
  },

  paymentWFTTransHandler: function() {


    var paymentInfo = quickPayConfig.get(this.paymentInfo.paymentType);
    var payUserName = '';
    var paymentId = this.$('.js-paymentId').val();
    var paymentType = this.$('.js-paymentType').val();
    if(paymentType == 4) {
      payUserName = $('.js-paypalName').val();
    }
    if(paymentType == 5) {
      payUserName = $('.js-wechatName').val();
    }
    var amount = this.$('.js-fc-re-amount').val();

    this.getPayWFTXhr(amount,paymentId,paymentType,payUserName)
      .done(function(res) {
        if (res.result === 0) {

          $('.js-div-all').hide();
          $('.js-fc-re-commit').hide();

          var amount = res.root.amount/10000;
          var vaildTime = res.root.expireTime ;
            var picUrl = res.root.payUrl;
          var transNo = res.root.tradeNo ;

          $('.js-transNo').val(transNo);

          var paymentHtml = 	'<div class="text-left m-bottom-md" style="padding-left:15%">'+

            '<div  style="text-align:left;  color:grey" >'+
            '  <div style="text-align:left;">'+
            '	<div style="font-size: medium">温馨提示：</div>'+
            '  </div>'+
            '  <div style="text-align:left;">'+
            '	<div>    1、为了您的充值能顺利到账，请您在<font color="red">'+vaildTime+'</font>分钟内完成充值。</div>'+
            '	 </div>'+
            '  <div style="text-align:left;">'+
            '	<div>     2、充值完成后，充值金额将在3分钟内添加到您的游戏账户。</div>'+
            ' </div>'+
            '</div><hr>'+

            '<div style="font-size: medium; color: black" >'+
            '   <div style="text-align:left ; color: black">'+
            '	<div >充值信息：</br></div>'+
            '	 </div>'+
            ' <div style="background-color:lightgoldenrodyellow; width:85%; color: grey ; text-align: left;">'+
            '	<div><span>充值方式：微信支付</span</div>'+
            ' </div >'+
            '<div style="background-color:lightgoldenrodyellow;  width:85%; color: grey ;  text-align: left;font-size: medium">'+
            '	<div><span>充值金额： <font color="red">'+amount+'</font>元</span></br></div>'+
            '</div></div>'+
            '  <div style="text-align: left;">'+
            '	<div><span>'+
            '</br>微信付款二维码：</br>'+
            '	</span></div>'+
            ' </div>'+
            ' <div style="text-align: left;">'+
            '	<div style="text-align: left;"><img id="u12_img" class="img " style="width: 250px; height: 250px" src="'+picUrl+'"><img id="u12_img" style="margin: -240px  0 0 0 " class="js-flag img "  src="'+picFlag+'"><img  class="js-picInfo img " style="display:none; width:200px; height:250px "  src="'+picInfo+'"></br>' +
            '<img id="u12_img" class="img " src="'+pic+'" style="width:230px;margin:0 0 0 7px"></div>' +
            '</div>'+
            '</div></br>'+

            '<div class="js-timeout text-left" >若完成充值，请单击  <button type="button" style="width: 100px; font-size: medium" class="js-payment-commit btn btn-pleasure btn-liner ' +
            'fc-re-commit">支付成功</button></div></br></br>'+

              '</div>';
          $('.js-div-transaction').html(paymentHtml);

          $(".js-fc-re-payment-type").removeClass("js-fc-re-payment-type");


          setTimeout(function () {

            $('.js-fc-re-modal').closest('.modal').modal('hide');

            var $dialog = Global.ui.dialog.show({
              title: '温馨提示',
              body: '<div class=" fc-re-resultShow text-center">' +
              '<div  class="m-bottom-md"><span>对不起，您的充值已经失效，请重新发起充值申请，谢谢！</span> </div>' +
              '<div class="text-center m-bottom-lg">' +
              '<button type="button" class="js-fc-re fc-re-result-btn fc-re-succ btn m-right-md" >重新支付</button>' +
              '</div></div>',
              footer: ''
            });

          },(vaildTime*60*1000));

        }
      });
  },



  paymentTransHandler: function() {

    var paymentInfo = quickPayConfig.get(this.paymentInfo.paymentType);
    var payUserName = '';
    var paymentId = this.$('.js-paymentId').val();
    var paymentType = this.$('.js-paymentType').val();
    if(paymentType == 4) {
      payUserName = $('.js-paypalName').val();
    }
    if(paymentType == 5) {
      payUserName = $('.js-wechatName').val();
    }
    var amount = this.$('.js-fc-re-amount').val();

    this.getPayTonglueyunXhr(amount,paymentId,paymentType,payUserName)
      .done(function(res) {
        if (res.result === 0) {

          $('.js-div-all').hide();
          $('.js-fc-re-commit').hide();

          var amount = this.$('.js-fc-re-amount').val();
          var transNo = res.root.tradeId ;
          var recName = res.root.revAccNo ;
          var avaDate = res.root.valideDate ;
          var picUrl = res.root.pictureUrl;

          $('.js-transNo').val(transNo);

          var paymentHtml = 	'<div class="text-center m-bottom-md">'+
            '<table style="text-align:center; width: 100%" >'+
            '  <tr style="text-align:center;">'+
            '	<th rowspan=7><img id="u12_img" class="img " src="'+picUrl+'"></th>'+
            ' </tr>'+
            ' <tr style="text-align: left;">'+
            '	<th><span>交易流水号： '+transNo+'</span</th>'+
            ' </tr >'+
            '<tr style="text-align: left;">'+
            '	<th><span>收款账号名字： '+recName+'</span></th>'+
            '</tr>'+
            ' <tr style="text-align: left;">'+
            '	<th><span>您的充值金额： '+amount+'元</span></th>'+
            ' </tr>'+
            ' <tr style="text-align: left;">'+
            '	<th><span>订单有效期：'+avaDate+'</span></th>'+
            ' </tr>'+
            '  <tr style="text-align: left;">'+
            '	<th><span style="color: red">'+
            '注意事项：</br>'+
            '	1,请确保实际支付金额与充值金额一致，以免匹配失败给您造成资金损失。</br>'+
            '   2,请在订单有效期内完成支付，以免收款账号失效给您造成资金损失。</br>'+
            '	3,支付完成后，请点击 “支付成功”，充值金额将在1分钟内添到您的游戏账户。'+
            '	</span></th>'+
            ' </tr>'+
            ' <tr style="text-align: center;">'+
            '	<th><div class="js-timeout"><button type="button" class="js-payment-commit btn btn-pleasure btn-liner fc-re-commit">支付成功</button></div></th>'+
            '  </tr>'+
            '</table>'+
            '</div>';

          $('.js-div-transaction').html(paymentHtml);

          $(".js-fc-re-payment-type").removeClass("js-fc-re-payment-type");

          setTimeout(function () {
            $(".js-timeout").html('支付申请已失效，请重新提交申请。      <a href="javascript:void(0);" class="btn-link btn-link-pleasant js-fc-re"  data-dismiss="modal" >重新申请</a>')
          },30*60*1000);

        }
      });

  },

  paymentconfirmHandler: function() {

    $('.js-fc-re-modal').closest('.modal').modal('hide');

    this.getRechargequeryXhr($('.js-transNo').val())
      .done(function(res) {
        if (res.result === 0) {
          var self = this;
          var $dialog = Global.ui.dialog.show({
            title: '温馨提示',
            body: '<div class=" fc-re-resultShow text-center">' +
            '<div  class="m-bottom-md"><span>充值成功，祝您游戏愉快。</span> </div>' +
            '<button type="button" data-dismiss="modal" class="fc-re-result-btn fc-re-succ btn m-right-md">确定</button>' +
            '</div>',
            footer: ''
          });
        }else {
          var $dialog = Global.ui.dialog.show({
            title: '温馨提示',
            body: '<div class=" fc-re-resultShow text-center">' +
            '<div  class="m-bottom-md"><span>系统未查询到该笔款项，请再次确认您是否已经支付成功。</span> </div>' +
            '<div class="text-center m-bottom-lg">' +
            '<button type="button" class="js-fc-re fc-re-result-btn fc-re-succ btn m-right-md" >重新支付</button>' +
            '<button type="button" class="js-gl-service  fc-re-result-btn fc-re-succ btn m-right-md" >联系客服</button>' +
            '</div></div>',
            footer: ''
          });
        }
      });

  }

});

module.exports = RechargeView;


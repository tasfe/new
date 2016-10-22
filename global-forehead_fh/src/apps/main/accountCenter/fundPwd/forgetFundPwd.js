"use strict";

var findPwdView = Base.ItemView.extend({

  template: require('./forgetFundPwd.html'),
  
  byCITpl: _.template(require('./passwordManage-byCI.html')), //构造通过银行卡信息找回资金密码页面
  
  byEMTpl: _.template(require('./passwordManage-byEM.html')),//构造通过邮箱找回资金密码页面

  className: 'as-personalManage',

  events: {
    'click .js-ac-findByCIBtn': 'findByCIHandler',
    'change .js-as-questionSelect': 'questionSelectChangeHandler',//控制三个下拉框的值不能重复选择
    'click .js-as-inputSecurityQuestion-submit': 'submitSecurityQuestionHandler',//验证安全问题
    'click .js-ac-cardInfo-submit': 'inputCardInfoHandler',//验证银行卡信息
    'click .js-as-resetFundPassword-submit': 'resetFundPasswordHandler',    //重置资金密码
    'keyup #newFundPassword': 'validatePwdHandler',
    'click .js-pm-confirm': 'refreshPageHandler',
    'click .js-ac-findByEMBtn': 'findByEMHandler',
    'click .js-as-resendEmail': 'resendEmailHandler',
    'click .js-as-confirmEmail-submit': 'inputEmailHandler'
  },

  serializeData: function() {
    return this.options;
  },

  _getRechargeInfoXhr: function(){
    return Global.sync.ajax({
      url:'/fund/recharge/rechargetype.json'
    });
  },

  _getHasEmailXhr:function () {
    return Global.sync.ajax({
      url:'/acct/userinfo/userdetail.json'
    });
  },

  _getSecurityXhr: function () {
    return Global.sync.ajax({
      url: '/acct/usersecurity/getsecurity.json'
    });
  },

  onRender: function() {
    var self = this;
    // this._initSteps();

    this._getSecurityXhr()
      .done(function (res) {
        if (res && res.result === 0) {
          //0表示密保问题不存在，则不能通过密保问题找回资金密码
          self.$('.js-ac-findByCIBtn').addClass('hidden');
          self.$('.js-ac-findByEMBtn').addClass('hidden');

        } else if (res && res.result === 1) {
          //1表示密保问题存在
          self._getRechargeInfoXhr()
            .done(function(res) {
              if (res.result === 0 && res.root) {
                if (res.root.hasBankCard) {
                  self.$('.js-ac-findByCIBtn').removeClass('hidden');
                  self.$('.js-ac-findByCI-notice').addClass('hidden');
                }
              }
            });

          self._getHasEmailXhr()
            .done(function(res) {
              if (res && res.result === 0 && res.root) {
                if (res.root.userEmail) {
                  self.$('.js-ac-findByEMBtn').removeClass('hidden');
                  self.$('.js-ac-findByEM-notice').addClass('hidden');
                  self.email = res.root.userEmail || '';
                }
              }
            });
        }
      });
  },

  validatePwdHandler: function (e) {
    var $target = $(e.currentTarget);
    var pwd= $target.val();
    var safety = 0;
    var $pwdTip = $('.js-invalid-pwd-tip');
    var $submitBtn = $('.js-as-resetFundPassword-submit');
    var $saftyLevel = $('.js-passwdSafetyTips');

    if ( !isNaN(pwd) && pwd.length < 9 ) {

      $pwdTip.html('*新密码不能是9位以下的纯数字（≤8个阿拉伯数字）').removeClass('hidden');
      $submitBtn.attr('disabled', 'disabled');
    } else if(pwd.indexOf(" ")>0){

      $pwdTip.html('*新密码不能包含空格').removeClass('hidden');
      $submitBtn.attr('disabled', 'disabled');
    } else if (pwd.length < 6 || pwd.length > 20) {

      $pwdTip.html('*新密码必须由6-20位字符组成').removeClass('hidden');
      $submitBtn.attr('disabled', 'disabled');
    } else{

      $pwdTip.addClass('hidden');
      $submitBtn.removeAttr('disabled');
    }

    if ( pwd.length > 0 ) {
      $saftyLevel.removeClass('hidden');
      if(/\d/gi.test(pwd)){
        safety++;
      }
      if (/[A-Za-z]/.test(pwd)) {
        safety++;
      }
      if(/[@#\$%\^&\*\!]+/g.test(pwd)){
        safety++;
      }
    } else {
      $saftyLevel.addClass('hidden');
    }

    $saftyLevel.removeClass('level1').removeClass('level2').removeClass('level3');
    if (safety == 3) {
      $saftyLevel.addClass('level3').find('b').html('强');
    }
    if (safety == 2) {
      $saftyLevel.addClass('level2').find('b').html('中');
    }
    if (safety == 1) {
      $saftyLevel.addClass('level1').find('b').html('弱');
    }
  },

  _initSteps: function() {
    var $findFundPasswordContainer = this.$('.js-as-stepContainer');
    $findFundPasswordContainer.steps({
      stepLength: 540,
      headerTag: "h3",
      bodyTag: 'form',
      forceMoveForward: false,
      enablePagination: false,
      transitionEffect: "slideLeft",
      onStepChanging: function(event, currentIndex, newIndex) {
        return newIndex !== 4;
      }
    });
  },

  // 通过密保问题+邮箱找回密码
  findByEMHandler:function (e) {
    this.$el.html(this.byEMTpl());
    this._initSteps();
    this._renderSq();
  },
  
  _sendEmail: function () {
    var self = this;
    var $submitBtn = this.$('.js-as-confirmEmail-submit');
    self.$('.js-as-email').html((self.email).replace(/^(\w{3})(\w*)(?=@)/, '$1***'));
    self._reverseCountDown();
    Global.sync.ajax({
      url: '/acct/usermsg/sendEmailToken.json',
      data:{
        sendType: 0
      }
    }).done(function(res) {
      if (res && res.result === 0) {
        $submitBtn.removeAttr('disabled');
      }else {
        Global.ui.notification.show(res.msg);
      }
    });
  },

  _reverseCountDown:function () {
    var $countdown = this.$('.js-as-resend-countdown');
    var $resendBtn = this.$('.js-as-resendEmail');
    $countdown.html(120);
    $resendBtn.attr("disabled","disabled");

    var emailTime = setInterval(function(){
      var num = $countdown.html() - 1;
      if ($countdown.html() == 0) {
        clearInterval(emailTime);
        $resendBtn.removeAttr("disabled");
        $countdown.html(0);
      }else{
        $countdown.html(num);
      }
    }, 1000);
  },

  resendEmailHandler: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    $target.button('loading');
    Global.sync.ajax({
      url: '/acct/usermsg/sendEmailToken.json',
      data:{
        sendType:2
      }
    }).always(function() {
      $target.button('reset');
    }).done(function(res) {
      if (res && res.result === 0) {
        self._reverseCountDown();
      } else {
        Global.ui.notification.show(res.msg);
      }
    });
  },

  inputEmailHandler:function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $findFundPasswordContainer = this.$('.js-as-stepContainer');
    $target.button('loading');
    Global.sync.ajax({
      url: '/acct/usermsg/validatePwdCode.json',
      data:{
        validateCode: self.$('.js-as-email-verifyCode').val()
      }
    }).always(function() {
      $target.button('reset');
    }).done(function(res) {
      if (res && res.result === 0) {
        $findFundPasswordContainer.steps('goTo', 2);
      }else {
        Global.ui.notification.show(res.msg);
      }
    });
  },

  // 通过密保问题+银行卡找回密码
  findByCIHandler: function(e) {
    this.$el.html(this.byCITpl());
    this._initSteps();
    this._renderSq();
  },

  _renderSq: function() {
    var self = this;
    Global.sync.ajax({
      url: '/acct/usersecurity/getuserecurityqes.json'
    }).done(function(res) {
      if (res && res.result === 0) {
        //添加密保问题到下拉框，验证时只需要两个即可
        self.$('.js-as-questionSelect').append(_(res.root).map(function(option) {
          return '<option value="' + option.userSecurityId + '">' + option.userSecurityQuestion + '</option>';
        }).join(''));
      } else {
        Global.ui.notification.show('获取密保问题失败');
      }
    });
  },

  questionSelectChangeHandler: function (e) {
    var $select = this.$('.js-as-questionSelect');
    this._selectDupControl(e, $select);
  },

  //下拉框选择的事件,用于控制不会重复选择
  _selectDupControl: function (e, $select) {
    var $target = $(e.currentTarget);
    var $option = $target.find('option:selected');
    var selectedValue = $option.siblings('.selected').removeClass('selected').val();
    var selectingValue = $target.val();
    $select.not($target).find('option[value=' + selectedValue + ']').removeClass('hidden');
    $select.not($target).find('option[value=' + selectingValue + ']').addClass('hidden');
    $option.addClass('selected');
  },

  // 验证安全问题
  submitSecurityQuestionHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $findFundPasswordContainer = this.$('.js-as-stepContainer');
    var $sqForm = this.$('.js-ac-sq-form');
    var action = $target.data('action');
    var clpValidate = $sqForm.parsley().validate();
    if (clpValidate) {
      $target.button('loading');
      Global.sync.ajax({
        url: '/acct/usersecurity/verqesforpaypwd.json',
        data: {
          'secrityList[0].securityId': $(this.$('.js-as-questionSelect').find("option:selected")[0]).val(),
          'secrityList[0].securityQes': $(this.$('.js-as-questionSelect').find("option:selected")[0]).text(),
          'secrityList[0].securityAsw': $(this.$('.js-as-answer')[0]).val(),
          'secrityList[1].securityId': $(this.$('.js-as-questionSelect').find("option:selected")[1]).val(),
          'secrityList[1].securityQes': $(this.$('.js-as-questionSelect').find("option:selected")[1]).text(),
          'secrityList[1].securityAsw': $(this.$('.js-as-answer')[1]).val()
        }
      }).always(function() {
        $target.button('reset');
      }).done(function (res) {
        if (res && res.result === 0) {
          //保存安全问题token
          self.securityToken = res.root;

          //设置验证token到页面，用于重置资金密码
          $findFundPasswordContainer.steps('goTo', 1);
          if (action === 'ci') {
            self.$('.js-as-securityNotice').html('为了您的账户安全，请提供最近的一次银行卡绑定信息资料');
          } else if (action === 'email') {
            self._sendEmail();
          }
        } else {
          self.$('.js-ac-sqNotice-div').html(self._getErrorMsg('验证失败,' + res.msg));
        }
      });
    }
  },

  inputCardInfoHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $findFundPasswordContainer = this.$('.js-as-stepContainer');
    var $ciForm = this.$('.js-ac-ci-form');
    var clpValidate = $ciForm.parsley().validate();

    if (clpValidate) {
      $target.button('loading');
      Global.sync.ajax({
        url: '/fund/bankcard/verifycard.json',
        data: {
          name: self.$('#account-name').val(),
          cardNo: self.$('#card-no').val()
        }
      }).always(function() {
        $target.button('reset');
      }).done(function(res) {
        if (res && res.result === 0) {
          //保存银行token
          self.cardToken = res.root;
          //设置验证token到页面，用于重置资金密码
          $findFundPasswordContainer.steps('goTo', 2);
          self.$('#newFundPassword').bind('keyup', this, self.validatePwdHandler);
        } else {
            self.$('.js-ac-sqNotice-div').html(self._getErrorMsg('验证失败,' + res.msg));
        }
      });
    }
  },

  resetFundPasswordHandler: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $resetForm = this.$('.js-ac-reset-form');
    var $findFundPasswordContainer = this.$('.js-as-stepContainer');
    var clpValidate = $resetForm.parsley().validate();

    if (clpValidate) {
      $target.button('loading');
      Global.sync.ajax({
        url: '/fund/moneypd/reset.json',
        data: {
          passwd: self.$('#newFundPassword').val(),
          securityToken: self.securityToken,
          cardToken: self.cardToken,
          emailToken: self.emailToken
        }
      }).always(function () {
        $target.button('reset');
      }).done(function (res) {
        if(res.result === 0){
          $findFundPasswordContainer.steps('goTo', 3);
          // Global.ui.notification.show('资金密码保存成功', {
          //   type: 'success',
          //   event: function() {
          //     Global.router.goTo('#');
          //   },
          //   btnContent: '确定'
          // });
        }else{
          self.$('.js-ac-resetNotice-div').html(self._getErrorMsg('重置失败，' + res.msg));
        }
      });
    }
  },

  refreshPageHandler: function () {
    this.render();
  },

  //组装错误提示框
  _getErrorMsg: function (text) {
    return '<div class="parsley-errors-list filled font-sm text-center m-top-smd">' +
      '<span class="login-error-message parsley-required">' + text + '</span>' +
      '</div>';
  }
});

module.exports = findPwdView;

require('./resetPassword.scss');
require('./../misc/common-init.js');

//var header = require('../misc/header.html');
//var footer = require('../misc/footer.html');
var footer = require('../../components/footer');

var Encryption =  require('com/encryption');

$.widget('gl.resetPassword', {

  template: require('./resetPassword.html'),

  _create: function () {

    this.element.html(_(this.template).template()());
    this.$resetPasswordMain =  this.element.find('.js-rp-resetPassword-main');
    this._initSteps();
    //需在initSteps()后获取对象
    this.$step1Form = this.element.find('.js-rp-verifyUNContainer');
    this.$username = this.element.find('.js-rp-userName');
    ////=============================================================TODO
    this.$valCode = this.element.find('.js-rp-valCode');
    this.$valImg = this.element.find('.js-rp-valImg');
    this.$valResult = this.element.find('.js-rp-valResult');
    this.$valResultDiv = this.element.find('.js-rp-val-result-div');
    this.$valCodeResult = this.element.find('.js-re-val-res');
    var url =  window.self.location.toString();
    this.codeUrl = url.substring(0, url.indexOf('/', url.indexOf('://',0)+3))+'/acct/imgcode/code';
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());
    //==============================================================

    this.$step2Div = this.element.find('.js-rp-step2-div');
    //this.$step2Form =  this.element.find('.js-rp-findWayContainer');
    //this.$validateForm1 = this.element.find('.js-rp-validateContainer1');
    this.$validateForm2 = this.element.find('.js-rp-validateContainer2');
    //this.$findBySQBtn = this.element.find('.js-rp-findBySQBtn');
    //this.$noticeSQ = this.element.find('.js-rp-noticeSQ');
    //this.$findByFPBtn = this.element.find('.js-rp-findByFPBtn');
    //this.$noticeFP = this.element.find('.js-rp-noticeFP');

    //this.$questionSelect = this.element.find('.js-rp-questionSelect');

    this.$step3Form =  this.element.find('.js-rp-resetLPContainer');

    this.$footer = this.element.find('.rp-footer');
    new footer({
      el: this.$footer
    }).render();

    this._bindEvent();
    // this._setupForm();
  },
  //listenFieldStatus : function($target){
  //  $target.parsley().on('field:success', function() {
  //    this._ui.$errorsWrapper.removeClass('val-img-times');
  //    this._ui.$errorsWrapper.addClass('val-img-check');
  //  });
  //  $target.parsley().on('field:error', function() {
  //    this._ui.$errorsWrapper.removeClass('val-img-check');
  //    this._ui.$errorsWrapper.addClass('val-img-times');
  //  });
  //},
  //_onPageLoaded: function() {
  //  $(window).load(function() {
  //    $('body').removeClass('overflow-hidden');
  //    $('.wrapper').removeClass('preload');
  //  });
  //},
  //初始化找回登录密码的分步操作页面
  _initSteps: function () {
    var self = this;
    this.$resetPasswordMain.steps({
      stepLength: 658,
      headerTag: "h3",
      bodyTag: "div",
      forceMoveForward: false,//阻止返回
      enablePagination: false,
      transitionEffect: "slideLeft",
      onStepChanging: function (event, currentIndex, newIndex) {
        return newIndex !== 5;
      },
      onStepChanged: function (event, currentIndex, newIndex) {
        self.element.find('.steps ul li[role=tab]:gt(' + newIndex + ')').removeClass('done').addClass('disabled');
      }
    });
  },

  _bindEvent: function () {
    var self = this;
    //绑定事件
    this._on({
      //=============================================================TODO
      'click .js-rp-valImg': 'refreshValCodeHandler',//刷新验证码
      //'click .js-rp-step1-returnBtn': 'returnToLoginHandler',
      // =================================================================
      'click .js-rp-verifyUNBtn': 'verifyUNHandler',//校验用户名

     // 'click .js-rp-findBySQBtn': 'findBySQHandler',//通过密保找回
      //'click .js-rp-findByFPBtn': 'findByFPHandler',//通过资金密码找回
      //'click .js-rp-step2-returnBtn': 'returnToStep1Handler',
      //'change .js-rp-questionSelect': 'questionSelectChangeHandler',//控制三个下拉框的值不能重复选择
      //'click .js-rp-verifySQABtn': 'verifySQAHandler',//验证密保问题
      'click .js-rp-verifyFPBtn': 'verifyFPHandler',//验证资金密码
      //'click .js-rp-Step3-returnBtn': 'goStep2Handler',
      //'click .js-rp-Step2-val-returnBtn': 'valPageReturnHandler',//验证页面的返回按钮
      'click input[type=password]': 'resetInputHandler',
      'click .js-rp-setLPBtn': 'setLPHandler'//设置登录密码
    });
    //=============================================================TODO
    this.element.find('.js-rp-valCode').on('keyup', function() {
      self.valCodeHandler();
    });
    // ==============================================================
  },
//=============================================================TODO
  refreshValCodeHandler: function(){
    this.$valImg.attr('src','');
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());
    this.$valResult.val('1');
    this.$valCode.val('');
    this.$valCode.focus();
    this.$valCodeResult.html('');  
  },

  valCodeHandler: function () {

    var self = this;
    if(self.$valCode && self.$valCode.val()!='' && self.$valCode.val().length===4){
      Global.sync.ajax({
        type: 'POST',
        url: '/acct/imgcode/val.json',
        data: {
          code: self.$valCode.val()
        }
      }).done(function (data, status, xhr) {
        if (data.result === 0) {
          self._showValResult(0,self.$valCodeResult,'', self.$valResult);
        }else{
          self._showValResult(1,self.$valCodeResult,'验证码错误', self.$valResult);
          self.refreshValCodeHandler();
        }
      }).fail(function () {
        self._showValResult(1,self.$valCodeResult,'验证码错误' ,self.$valResult);
        self.refreshValCodeHandler();
      });
    }else{
      //self._showValResult(1,self.$valResultDiv);
      //self._showValResult(1,self.$valCodeResult,'验证码错误' ,self.$valResult);
      self.$valResult.val('1');
      self.$valCodeResult.html('');
    }

  },
  //==========================================================================

  renderError: function(text) {
    this.element.find('.js-rp-notice-page1').html(self._getErrorMsg(text));
  },


  //TODO 待添加用户验证
  verifyUNHandler: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var clpValidate = this.$step1Form.parsley().validate();

    //=============================================================TODO
    if(self.$valCode.val()===''||self.$valResult.val()==='1'){
      self._showValResult(1,self.$valCodeResult,'',self.$valResult);
      //self.$valCode.val('')
      self.refreshValCodeHandler();
      return false;
    }
    //================================================================

    if (clpValidate) {
      $target.button('loading');
      self.element.find('.js-rp-userNameContainer').val('');
      self.element.find('.js-rp-tokenContainer').val('');
      //校验验证码
      this.verifyUserNameXhr().always(function () {
        $target.button('reset');
      }).fail(function () {
        self.element.find('.js-rp-notice-page1').html(self._getErrorMsg(''));

        //=============================================================TODO
        //self.refreshValCodeHandler();
        // =============================================================
      }).done(function (res) {
        if (res && res.result === 0) {
          //todo 获取密保及资金密码设置状态 控制第二步页面的显示
          if(res.root.qesStatus===1){//1代表设置了该方式
            //self.$findBySQBtn.addClass('hidden');
            //self.$noticeSQ.removeClass('hidden');
          }else{
            //self.$findBySQBtn.removeClass('hidden');
            //self.$noticeSQ.addClass('hidden');

          }
          if(res.root.payPwdStatus===1){
            //self.$findByFPBtn.removeClass('hidden');
            //self.$noticeFP.addClass('hidden');
          }else{
            //self.$findByFPBtn.addClass('hidden');
            //self.$noticeFP.removeClass('hidden');
          }
            self.element.find('.js-rp-userNameContainer').val(self.$username.val());
            self.element.find('.js-rp-tokenContainer').val(res.root.pwdToken);
           // self.$step2Div.addClass('hidden');
           // self.$step2Form.removeClass('hidden');
           // self.$validateForm1.addClass('hidden');
           // self.$validateForm1[0].reset();
           // self.$validateForm2.addClass('hidden');
            self.$validateForm2[0].reset();
            self.$resetPasswordMain.steps('goTo', 1);
        } else {
          self.element.find('.js-rp-notice-page1').html(self._getErrorMsg('用户名验证失败'));

          //=============================================================TODO
          //self.refreshValCodeHandler();
          // ===========================================================
        }
      });

    }

  },

  //TODO Deferred 验证用户，用户名和验证码,待修改参数名
  verifyUserNameXhr: function () {
    return $.ajax({
      type: 'POST',
      url: '/acct/login/verifyusername.json',
      data: {
        username: this.$username.val(),
        //=============================================================TODO
        verifyCode:this.$valCode.val()
        //=================================================
      }
    });
  },


  //findBySQHandler: function (e) {
  //  var self = this;
  //  //this.$validateForm1.removeClass('hidden');
  //  //this.$validateForm2.addClass('hidden');
  //  //TODO获取密保问题，添加到页面中
  //  self.getSecurityQuestion().fail(function () {
  //    self.element.find('.js-rp-notice-page2').html(self._getErrorMsg('密保问题获取请求服务失败'));
  //  }).done(function (res) {
  //    if (res && res.result === 0) {
  //      //成功后,将问题列表加载在下拉框中
  //      self.$questionSelect.html('<option value="">请选择密保问题</option>');
  //      self.$questionSelect.append(_(res.root).map(function (option) {
  //        return '<option value="' + option.qesId + '">' + option.question + '</option>';
  //      }).join(''));
  //      //隐藏当前step2的form1，展示form2
  //      //self.$step2Form.addClass('hidden');
  //      self.$validateForm1.removeClass('hidden');
  //      self.$validateForm2.addClass('hidden');
  //    } else {
  //      self.element.find('.js-rp-notice-page2').html(self._getErrorMsg('密保问题获取失败'));
  //    }
  //  });
  //
  //},
  //下拉框选择的事件,用于控制不会重复选择
  //questionSelectChangeHandler: function (e) {
  //  var $target = $(e.currentTarget);
  //  var $option = $target.find('option:selected');
  //
  //  var selectedValue = $option.siblings('.selected').removeClass('selected').val();
  //  var selectingValue = $target.val();
  //
  //  this.$questionSelect.not($target).find('option[value=' + selectedValue + ']').removeClass('hidden');
  //  this.$questionSelect.not($target).find('option[value=' + selectingValue + ']').addClass('hidden');
  //
  //  $option.addClass('selected');
  //},

  //TODO 待修改参数名
  //getSecurityQuestion: function () {
  //  return $.ajax({
  //    type: 'POST',
  //      url: '/acct/usersecurity/getqesforloginpwd.json',
  //    data: {
  //      username: this.element.find('.js-rp-userNameContainer').val(),
  //      loginToken: this.element.find('.js-rp-tokenContainer').val()
  //
  //    }
  //  });
  //},

  //findByFPHandler: function (e) {
  //  //this.$step2Form.addClass('hidden');
  //  this.$validateForm1.addClass('hidden');
  //  this.$validateForm2.removeClass('hidden');
  //},
  //
  //returnToStep1Handler: function(e){
  //  this.$resetPasswordMain.steps('goTo', 0);
  //  //this.$step2Form.removeClass('hidden');
  //  this.$validateForm1.addClass('hidden');
  //  this.$validateForm2.addClass('hidden');
  //},

  //TODO 验证密保问题
  //verifySQAHandler: function (e) {
  //  var self = this;
  //  var $target = $(e.currentTarget);
  //  var type = $target.data('type');
  //  //var type = $target.data('type');
  //  //var clpValidate = this.$validateForm1.parsley().validate();
  //  if (clpValidate) {
  //    $target.button('loading');
  //    this.verifySecurityQuestion().always(function () {
  //      $target.button('reset');
  //    }).fail(function () {
  //      self.element.find('.js-rp-notice-page31').html(self._getErrorMsg('密保问题验证请求失败'));
  //    }).done(function (res) {
  //      if (res && res.result === 0) {
  //        self.$resetPasswordMain.steps('goTo', 2);
  //      } else {
  //        if(res.root!=null&&_(res.root).isNumber()) {
  //          if(res.root>0){
  //          self.element.find('.js-rp-notice-page31').html(self._getErrorMsg('验证失败,剩余' + res.root + '次机会。'));
  //          }else{
  //            self.element.find('.js-rp-notice-page31').html(self._getErrorMsg('验证失败,请一个小时后再验证！'));
  //          }
  //        }else{
  //          self.element.find('.js-rp-notice-page31').html(self._getErrorMsg('验证失败,' + res.msg));
  //        }
  //      }
  //    });
  //  }
  //
  //},

  //TODO 验证密保 ，待修改参数名
  //verifySecurityQuestion: function () {
  //  return $.ajax({
  //    type: 'POST',
  //    url: '/acct/usersecurity/verqesforloginpwd.json',
  //    data: {
  //      'secrityList[0].securityId': this.element.find('#jsRPQuestion1').find("option:selected").val(),
  //      'secrityList[0].securityQes': this.element.find('#jsRPQuestion1').find("option:selected").text(),
  //      'secrityList[0].securityAsw': this.element.find('#jsRPAsw1').val(),
  //      'secrityList[1].securityId': this.element.find('#jsRPQuestion2').find("option:selected").val(),
  //      'secrityList[1].securityQes': this.element.find('#jsRPQuestion2').find("option:selected").text(),
  //      'secrityList[1].securityAsw': this.element.find('#jsRPAsw2').val(),
  //       username: this.element.find('.js-rp-userNameContainer').val(),
  //       loginToken: this.element.find('.js-rp-tokenContainer').val()
  //
  //    }
  //  });
  //},

  verifyFPHandler: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var type = $target.data('type');
    self.element.find('.js-rp-notice-page32').html('');

    var clpValidate = this.$validateForm2.parsley().validate();
    if (clpValidate) {
      $target.button('loading');
      this.verifyFundPassword().always(function () {
        $target.button('reset');
      }).fail(function () {
        self.element.find('.js-rp-notice-page32').html(self._getErrorMsg('资金密码验证请求失败'));

      }).done(function (res) {
        if (res && res.result === 0) {

          self.$resetPasswordMain.steps('goTo', 2);
        } else {
          if(res.root!=null&&_(res.root).isNumber()) {
            if(res.root>0){
              self.element.find('.js-rp-notice-page32').html(self._getErrorMsg('验证失败,剩余' + res.root + '次机会。'));
            }else{
              self.element.find('.js-rp-notice-page32').html(self._getErrorMsg('验证失败,请一个小时后再验证！'));
            }
          }else{
            self.element.find('.js-rp-notice-page32').html(self._getErrorMsg('验证失败,' + res.msg));
          }

          self.element.find('.js-rp-fundPassword').val('');
        }
      });
    }

  },

  //TODO 验证资金密码 ，待修改参数名
  verifyFundPassword: function () {
    return $.ajax({
      type: 'POST',
      url: '/fund/moneypd/verpwdforloginpwd.json',
      data: {
        payPwd: this.element.find('.js-rp-fundPassword').val(),
        username: this.element.find('.js-rp-userNameContainer').val(),
        loginToken: this.element.find('.js-rp-tokenContainer').val()
      }
    });
  },

  //返回按钮事件
  //goStep2Handler: function (e) {
  //  this.$resetPasswordMain.steps('goTo', 1);
  //},
  //设置登录密码
  setLPHandler: function (e) {
    var self = this;

    var $target = $(e.currentTarget);
    var type = $target.data('type');
    var $resetLPContainer = this.$step3Form;
    //var type = $target.data('type');
    var clpValidate = $resetLPContainer.parsley().validate();
    if (clpValidate) {
      $target.button('loading');
      this.resetLoginPwd().always(function () {
        $target.button('reset');
      }).fail(function () {
        self.element.find('.js-rp-notice-page4').html(self._getErrorMsg('设置登录密码请求失败'));
        //self.$resetPasswordMain.steps('goTo', 4);
      }).done(function (res) {
        if (res && res.result === 0) {
          var jumpToLoginPage = function() {
            self.loginHandler();
            //setInterval(function() {
            //  window.location.href = 'login.html';
            //}, 500);
          };
          Global.ui.notification.show('重置密码保存成功', {
            type: 'success',
            event: jumpToLoginPage,
            btnContent: '跳转到主界面'
          });
        } else {
          self.element.find('.js-rp-notice-page4').html(self._getErrorMsg(res.msg));
        }
      });
    }

  },
  //TODO 重置登录密码 ，待修改参数名
  resetLoginPwd: function(){
    return $.ajax({
      type: 'POST',
      url: '/acct/userinfo/resetloginpwd.json',
      data: {
        loginPwd: this.element.find('#jsRPLoginPwd1').val(),
        username: this.element.find('.js-rp-userNameContainer').val(),
        loginToken: this.element.find('.js-rp-tokenContainer').val()
      }
    });
  },

  //组装错误提示框
  _getErrorMsg: function (text) {
    //return '<div class="alert alert-danger alert-dismissible" role="alert">' +
    //  '<button type="button" class="close" data-dismiss="alert">' +
    //  '<span aria-hidden="true">×</span>' +
    //  '</button>' +
    //  '<i class="fa fa-times-circle m-right-xs"></i>' +
    //  '<strong>提示！</strong> ' + text +
    //  '</div>';
    return text;
  },

  _showValResult: function(result,$container,msg, $result){
    var wrong = '<div class="val-img-times"><span class="text-danger">'+msg+'</span></div>';
    var right = '<div class="val-img-check">&nbsp;</div>';
    if(result===0){
      $container.html(right);
      if($result){
        $result.val('0');
      }
    }else if(result===1){
      $container.html(wrong);
      if($result){
        $result.val('1');
      }
    }else{
      $container.html('');
    }
  },
  //valPageReturnHandler: function(e){
  //  //this.$step2Form.removeClass('hidden');
  //  //this.$validateForm1.addClass('hidden');
  //  this.$validateForm2.addClass('hidden');
  //}

  loginHandler: function() {
    var self = this;

    var encryption = new Encryption();
    var param = encryption.encryptSha(new Date().valueOf() + '');
    var entPassword = encryption.encrypt(self.element.find('#jsRPLoginPwd1').val(),param);
    var userName = self.element.find('.js-rp-userNameContainer').val();

    //if (!this.parsley.validate()) {
    //  return false;
    //}
    //if (self.$valResult.val()!=='0') {
    //  if(!this.$valCode.hasClass('hidden')){
    //    self.$valRegion.removeClass('hidden');
    //    self.$valCode.removeClass('hidden');
    //    self.$valCode.attr('type','text');
    //    self.renderError('请输入验证码！');
    //    self.refreshValCodeHandler();
    //  } else {
    //    self.renderError('验证码输入有误！');
    //  }
    //  return false;
    //}

    $.ajax({
        type: 'POST',
        url: '/acct/login/dologin.json',
        data: {
          username: userName,
          loginPwd: entPassword,
          param: param,
          code: ''
        },
        beforeSend: function(xhr, settings) {
          self.element.find('.js-rp-setLPBtn').text('登录中...');
        }
      })
      .always(function() {
        self.element.find('.js-rp-setLPBtn').button('reset');
      })
      .done(function(data, status, xhr) {
        if (data.result === 0) {

          //if (self.$remember.prop('checked')) {
          //  Global.localCache.set('account.remember', self.$username.val());
          //} else {
            Global.localCache.clear('account.remember');
          //}

          Global.cookieCache.set('token', data.root.token);

          status = Number(data.root.userStatus);
          //状态的值
          //int WOKRING = 0;// 正常
          //int DISABLED = 100;// 冻结,只登录
          //int DEEP_DISABLED = 101;// 冻结，完全冻结
          //int ENABLED = 102;// 解冻
          //int RECOVER = 103;// 回收
          //int RESET = 104;// 重置
          //int BYPARENT = 105;// 手工开户
          //int BYSUPER = 106;// 总代开户
          status = Number(status);
          if(status===0 || status===100 || status===102){
            window.location.href = 'index.html';
          }else if(status===103 || status===104 || status===105 || status===106){
            var ur ='userName='+data.root.username+(data.root.uName?'&uName='+data.root.uName:'')+'&status='+status;
            window.location.href = 'updateUserInfo.html?'+encodeURI(ur);
          }else if(status===101){
            self.renderError('完全冻结的用户无法登录');
          }
          else{
            window.location.href = 'index.html';
          }

        } else {
          self.renderError(data.msg);
          //if(data.msg.indexOf('验证码')!==-1){
          //  if(self.$valCode.hasClass('hidden')){
          //    self.$valRegion.removeClass('hidden');
          //    self.$valCode.removeClass('hidden');
          //    self.$valCode.attr('type','text');
          //    self.$valResult.val('1');
          //    self.$valImg.attr('src',self.codeUrl+'?_t='+_.now());
          //    self.renderError('请输入验证码！');
          //    self.$valCode.focus();
          //  }else{
          //    self.renderError('验证码输入有误！');
          //    self.refreshValCodeHandler();
          //  }
          //}else{
          //  self.renderError(data.msg);
          //  // self.refreshValCodeHandler();
          //}
        }
      })
      .fail(function(){
        self.renderError('当前网络异常，请切换线路');
        //if(!self.$valRegion.hasClass('hidden')){
        //  self.$valImg.trigger('click');
        //}
      });

    return false;
  },

  resetInputHandler: function(e) {
    var $target = $(e.currentTarget);
    var $pInput1 = this.element.find('.js-rp-loginPwd1');
    var $pInput2 = this.element.find('.js-rp-loginPwd2');
    if ($pInput1.val() != $pInput2.val()) {
      $target.val('');
    }
  }

});

$(document).ready(function() {
  //$('.js-package').before(_(header).template()({})).after(footer);
  $('.js-package').resetPassword();
});

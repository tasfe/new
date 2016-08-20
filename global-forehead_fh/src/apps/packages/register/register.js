require('./register.scss');
require('./../misc/common-init.js');

//var header = require('../misc/header.html');
var footer = require('../../components/footer');

var bannerConfig = require('./bannerConfig');

$.widget('gl.register', {

  template: require('./register.html'),

  _create: function () {

    this.element.html(_(this.template).template()());
    this.$username = this.element.find('.js-re-userName');
    this.$usernameValRes = this.element.find('.js-re-username-val-res');
    this.$usernameValDes = this.element.find('.js-re-verify-username');

    this.$password = this.element.find('#jsRELoginPassword');
    this.$passwordValRes = this.element.find('.js-re-password-val-res');
    this.$passwordValDes = this.element.find('.js-re-verify-password');


    this.$password1 = this.element.find('#jsRELoginPassword1');
    this.$password1ValRes = this.element.find('.js-re-password1-val-res');
    this.$password1ValDes = this.element.find('.js-re-verify-password1');

    this.$valCode = this.element.find('.js-re-valCode');
    this.$valImg = this.element.find('.js-re-valImg');
    this.$valCodeRes = this.element.find('.js-re-valCode-val-res');
    this.$valCodeDes = this.element.find('.js-re-valCode-val-des');


    var url =  window.self.location.toString();
    this.codeUrl = url.substring(0, url.indexOf('/', url.indexOf('://',0)+3))+'/acct/imgcode/code';
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());

    this.$footer = this.element.find('.register-footer');
    new footer({
      el: this.$footer
    }).render();

    this._setupForm();

    this._bindEvent();


    this.safetyTipsBind();

  },


  checkNameExistXhr: function(){
    var self = this;
    return $.ajax({
      type: 'POST',
      url: '/acct/reg/userexist.json',
      data: {
        username: $('.js-re-userName').val()
      }
    });
  },

  checkUNameExistXhr: function(data){
    var self = this;
    return $.ajax({
      type: 'POST',
      url: '/acct/reg/checkuname.json',
      data: data
    });
  },

  _bindEvent: function () {
    var self = this;
    //绑定事件
    this._on({
      'click .js-re-valImg': 'refreshValCodeHandler'//刷新验证码
    });
  },

  safetyTipsBind: function () {
    var self = this;

    var newLoginPassword = _(function() {
      var str= $('.js-rp-loginPwd1').val();
      var str2= $('.js-rp-loginPwd2').val();

      if (str.length == 0) {
        $('.content-julien .right dl').eq(1).addClass('wrong');
        $('.content-julien .right dl').eq(1).removeClass('correct');
        $('.content-julien .right dl .messageBox span').eq(0).html('不能为空');
      }
      else if ( !isNaN(str) && str.length < 9 ) {
        $('.content-julien .right dl').eq(1).addClass('wrong');
        $('.content-julien .right dl').eq(1).removeClass('correct');
        $('.content-julien .right dl .messageBox span').eq(0).html('不能是9位以下的纯数字（≤8个阿拉伯数字）');
      }
      else if(str.indexOf(" ")>0){
        $('.content-julien .right dl').eq(1).addClass('wrong');
        $('.content-julien .right dl').eq(1).removeClass('correct');
        $('.content-julien .right dl .messageBox span').eq(0).html('不能包含空格');
      }
      else if (str.length < 6 || str.length > 20) {
        $('.content-julien .right dl').eq(1).addClass('wrong');
        $('.content-julien .right dl').eq(1).removeClass('correct');
        $('.content-julien .right dl .messageBox span').eq(0).html('6-20位字符组成');
      }
      else{
        $('.content-julien .right dl').eq(1).removeClass('wrong');
        $('.content-julien .right dl').eq(1).addClass('correct');
        $('.content-julien .right dl .messageBox span').eq(0).html('');
      }

      if (str2 != '') {
        if (str == str2) {
          $('.content-julien .right dl').eq(2).removeClass('wrong');
          $('.content-julien .right dl').eq(2).addClass('correct');
        }
        else{
          $('.content-julien .right dl').eq(2).addClass('wrong');
          $('.content-julien .right dl').eq(2).removeClass('correct');
        }
      }

      var num = 0;
      if ( str.length > 0 ) {
        if(/\d/gi.test(str)){
          num++;
        }

        if (/[A-Za-z]/.test(str)) {
          num++;
        }

        if(/[@#\$%\^&\*\!]+/g.test(str)){
          num++;
        }

        $('.js-passwdSafetyTips span').removeClass('s3').removeClass('s2').removeClass('s1');
        $('.js-passwdSafetyTips p').removeClass('s3').removeClass('s2').removeClass('s1');
        if (num == 3) {
          $('.js-passwdSafetyTips span').eq(0).addClass('s1');
          $('.js-passwdSafetyTips span').eq(1).addClass('s2');
          $('.js-passwdSafetyTips span').eq(2).addClass('s3');
          $('.js-passwdSafetyTips p').addClass('s3');
        }
        if (num == 2) {
          $('.js-passwdSafetyTips span').eq(0).addClass('s1');
          $('.js-passwdSafetyTips p').addClass('s2');
          $('.js-passwdSafetyTips span').eq(1).addClass('s2');
        }
        if (num == 1) {
          $('.js-passwdSafetyTips span').eq(0).addClass('s1');
          $('.js-passwdSafetyTips p').addClass('s1');
        }

        num = 0;
        num = 0;
      }

      if (str.length != 0) {
        $('.passwdSafetyTips').removeClass('hide');
      }
      else{
        $('.passwdSafetyTips').addClass('hide');
      }

    }).debounce(400);

    var newLoginPassword2 = _(function() {
      var str= $('.js-rp-loginPwd1').val();
      var str2= $('.js-rp-loginPwd2').val();

      if (str != str2){
        $('.content-julien .right dl').eq(2).addClass('wrong');
        $('.content-julien .right dl').eq(2).removeClass('correct');
      }
      else{
        $('.content-julien .right dl').eq(2).removeClass('wrong');
        $('.content-julien .right dl').eq(2).addClass('correct');
      }
    }).debounce(400);

    $('.js-rp-loginPwd1').on('keypress', newLoginPassword);
    $('.js-rp-loginPwd2').on('keypress', newLoginPassword2);

    $('.js-rp-valCode').on('input', function() {
      if ($('.js-rp-valCode').val().length == 4) {
        Global.sync.ajax({
          type: 'POST',
          url: '/acct/imgcode/val.json',
          data: {
            code: $('.js-rp-valCode').val()
          }
        }).done(function (data, status, xhr) {
          if (data.result === 0) {
            $('.js-code').removeClass('wrong');
            $('.js-code').addClass('correct');
          }else{
            self.refreshValCodeHandler();
            $('.js-code').addClass('wrong');
            $('.js-code').removeClass('correct');
          }
        }).fail(function () {
            self.refreshValCodeHandler();
            Global.ui.notification.show('验证码报错');
        });
      }
    });


    var verifyInputUserName = _(function() {
      alert(1);
      var str= $('.js-re-userName').val();
      if (str.length == 0) {
        $('.content-julien .right dl').eq(0).addClass('wrong');
        $('.content-julien .right dl').eq(0).removeClass('correct');
        $('.content-julien .right dl .messageBox span').eq(0).html('不能为空');
      }
      else{
        var myReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
        if (myReg.test(str)) {
          if(str.replace(/[\u4e00-\u9fa5]/g, '**').length >= 4 && str.replace(/[\u4e00-\u9fa5]/g, '**').length <= 16){
            self.checkNameExistXhr().fail(function(){
              Global.ui.notification.show('用户名验证出错');
            }).done(function(res){
              if(res.result===0){
                $('.content-julien .right dl').eq(0).addClass('correct');
                $('.content-julien .right dl').eq(0).removeClass('wrong');
                $('.content-julien .right dl .messageBox span').eq(0).html('');
              }else{
                $('.content-julien .right dl').eq(0).addClass('wrong');
                $('.content-julien .right dl').eq(0).removeClass('correct');
                $('.content-julien .right dl .messageBox span').eq(0).html('用户名已存在');
              }
            });
          }
          else{
            $('.content-julien .right dl').eq(0).addClass('wrong');
            $('.content-julien .right dl').eq(0).removeClass('correct');
            $('.content-julien .right dl .messageBox span').eq(0).html('字符4到6');
          }
        } 
        else{
          $('.content-julien .right dl').eq(0).addClass('wrong');
          $('.content-julien .right dl').eq(0).removeClass('correct');
          $('.content-julien .right dl .messageBox span').eq(0).html('格式不符');
        }
      }
    }).debounce(400);

    $('.js-re-userName').on('keypress', verifyInputUserName);
  },

  refreshValCodeHandler: function(){
    this.$valImg.attr('src','');
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());
    this.$valCode.val('');
  },

  getADInfoXhr: function () {
    return $.ajax({
      type: 'POST',
      url: ''
    });
  },
  registerXhr: function (data) {
    return $.ajax({
      type: 'POST',
      url: '/acct/reg/doreg.json',
      data: data
    });
  },

  getBannerADXhr: function () {
    return $.ajax({
      type: 'POST',
      url: '/acct/usernotice/getregadvertise.json'
    });
  },
  registerHandler: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $registerForm = this.element.find('.js-re-registerForm');
   // var clpValidate = $registerForm.parsley().validate();

    var flag = true;
    if(self.$username.val()==='' || self.$usernameValRes.val()==='1'){
      self._showValResult(1,self.$usernameValDes,'请输入有效的用户名',self.$usernameValRes);
      flag =  false;
    }
    //if(self.$userUName.val()==='' || self.$userUNameValRes.val()==='1'){
    //  self._showValResult(1,self.$userUNameValDes,'请输入有效的昵称',self.$userUNameValRes);
    //  flag =  false;
    //}
    if(self.$password.val()===''){
      self._showValResult(1,self.$passwordValDes,'密码不能为空',self.$passwordValRes);
      flag =  false;
    }else  if(self.$password.val()!=='' && self.$passwordValRes.val()!=='0'){
      if(!self._valPassword(self.$password, self.$passwordValRes,self.$passwordValDes,self.$password1,self.$password1ValRes)){
        flag = false;
      }
    }

    if(self.$password1.val()==='' ){
      self._showValResult(1,self.$password1ValDes,'密码不能为空',self.$password1ValRes);
      flag =  false;
    }else  if(self.$password1.val()!=='' && self.$password1ValRes.val()!=='0'){
      if(!self._valPassword(self.$password1, self.$password1ValRes,self.$password1ValDes,self.$password,self.$passwordValRes)){
        flag = false;
      }

    }

    if(self.$valCode.val()===''||self.$valCodeRes.val()==='1'){
      self._showValResult(1,self.$valCodeDes,'请输入正确的验证码',self.$valCodeRes);
      self.refreshValCodeHandler();
      flag =  false;
    }

    if (flag ) {
      $target.button('loading');
      var data = _($registerForm.serializeArray()).serializeObject();
      this.registerXhr(data).always(function() {
        $target.button('reset');
      }).fail(function() {
        Global.ui.notification.show('注册失败！',{btnContent:'重新注册',event:function(){
          self._create();
        }});
      }).done(function (res) {
        if (res.result === 0) {
          Global.ui.notification.show('注册成功！',{type:'success',btnContent:'登陆',event:function(){
            Global.cookieCache.set('token', res.root.token);
            window.location.href = 'index.html';
          }});
          //self.element.find('.js-re-notice').html(self._getErrorEl('注册成功！'));
        } else {
         // self.element.find('.js-re-notice').html(self._getErrorEl('注册失败！' + res.msg));
          var msg = '注册失败！';
          if(res.msg!=='fail'){
            msg = res.msg;
            Global.ui.notification.show( msg ,{btnContent:'确定',event:function(){
              self._create();
            }});
          }else{
            Global.ui.notification.show( msg,{btnContent:'重新注册',event:function(){
              self._create();
            }});
          }
        }
      });
    }else{
      self.refreshValCodeHandler();
    }
  },

  _valPassword: function($password,$result,$describe,$target,$targetResult){
    var password = $password.val();
    var myReg = /[~`\-\_^@\/\'\\\"#$%&\*\?\(\),\+;\[\]\{\}\|\.:：<>!！￥？（），。、—]/;
    var msg = [];
    if(password.length<6||password.length>20){
      msg.push( '密码长度限制6-20位字符');
    }
    if( myReg.test(password)){
      msg.push('不能使用特殊字符');
    }
    if($target && password!=='' && $target.val()!==''){
      if(password !== $target.val()){
        msg.push('两次输入的密码不一致');
      }else{
        if(_(msg).isEmpty() && $targetResult.val()==='1'){
          this._showValResult(0,$describe,'',$result);
          $target.trigger('blur');
        }
      }
    }
    if(_(msg).size()>0){
      this._showValResult(1,$describe,msg.join(','),$result);
      return false;
    }else{
      this._showValResult(0,$describe,'',$result);
      return true;
    }
  },

  valPasswordHandler: function(){
    this._valPassword(this.$password,this.$passwordValRes,this.$passwordValDes,this.$password1,this.$password1ValRes);
  },
  valPassword1Handler: function(){
    this._valPassword(this.$password1,this.$password1ValRes,this.$password1ValDes,this.$password,this.$passwordValRes);
  },


  _setupForm: function () {
    var self = this;
    var linkId = _.getUrlParam('linkId');
    this.element.find('.js-re-linkId').val(linkId);
    //加载广告信息
    this.renderRegistrationBannerAD();
  },
  renderRegistrationBannerAD: function () {
    var self = this;
    this.getBannerADXhr().done(function (res) {
      if (res.result === 0) {
        self.generateBannerAD(res.root);
      }
    });
  },
  generateBannerAD: function (data) {
    var liList = [];
    var divList = [];

    if (_(data).isEmpty()) {
      data = bannerConfig;
    }

    _(data).each(function (item, index) {
      var div = [];
      div.push('<div class="item' + (index === 0 ? ' active' : '') + '">');
      div.push('<a href="' + (item.advUrl ? item.advUrl : 'javascript:void(0)') + '" target="_blank"><img src="' + item.picUrl + '" alt="' + item.advName + '"></a>');
      div.push('</div>');
      divList.push(div.join(''));
      liList.push('<li data-target="#jsREADCarousel" data-slide-to="' + index + (index === 0 ? '" class="active"' : '"') + '></li>');
    });
    if(_(liList).size()>1){
      this.element.find('.js-re-navigate').html(liList.join(''));
    }
    this.element.find('.js-re-ad-container').html(divList.join(''));
  },


  //拼装广告；
  _generateAD: function (adList) {
    var self=this;
    _(adList).each(function (ad, index) {
      var li = '<li data-target = "#jsREADCarousel" data-slide-to = "' + index;
      if (index === 0) {
        li = li + '" class = "active" ';
      }
      li = li + '"> < / li >';
      self.element.find('.js-re-navigate').append(li);

      var div = ' <div class="item"> <img src="' + ad.picUrl + '" class = "item ';
      if (index === 0) {
        li = li + ' active ';
      }
      div = div + '" alt> <div class="carousel-caption"><h4>' + ad.advName + '</h4><p></p></div></div>';
      self.element.find('.js-re-ad-container').append(div);
    });
  },

  _getErrorEl: function (text) {
    return '<div class="alert alert-danger alert-dismissible" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '<span aria-hidden="true">×</span>' +
      '</button>' +
      '<i class="fa fa-times-circle m-right-xs"></i>' +
      '<strong>提示！</strong> ' + text +
      '</div>';
  },


  refreshValCodeOnly: function(){
    this.$valImg.attr('src','');
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());
  },

  valCodeHandler: function (e) {
    var self = this;
    if(self.$valCode && self.$valCode.val()!='' && self.$valCode.val().length===4){
      $.ajax({
        type: 'POST',
        url: '/acct/imgcode/val.json',
        data: {
          code: self.$valCode.val()
        }
      }).done(function (data, status, xhr) {
        if (data.result === 0) {
          self._showValResult(0,self.$valCodeDes,'',self.$valCodeRes);
          self.registerHandler(e);
        }else{
          self._showValResult(1,self.$valCodeDes,'验证码输入有误',self.$valCodeRes);
          //self.refreshValCodeHandler();
          self.refreshValCodeOnly();
        }
      }).fail(function () {
        self._showValResult(1,self.$valCodeDes,'验证码输入有误',self.$valCodeRes);
        //self.refreshValCodeHandler();
        self.refreshValCodeOnly();
      });
    }else{
      self.$valCodeRes.val('1');
      self.$valCodeDes.html('');
      if(self.$valCode.val()===''||self.$valCodeRes.val()==='1'){
        self._showValResult(1,self.$valCodeDes,'请输入正确的验证码',self.$valCodeRes);
       // self.refreshValCodeHandler();
        flag =  false;
      }
    }
  },
  _showValResult: function(result,$container,msg,$valResult,notShowRightTag){
    var wrong = '<span class="text-danger">'+msg+'</span>';
    var right = '';
    if(!notShowRightTag){
       right = '';
    }
    if(result===0){
      $container.html(right);
      if($valResult){
        $valResult.val('0');
      }
    }else if(result===1){
      $container.html(wrong);
      if($valResult) {
        $valResult.val('1');
      }
    }else{
      $container.html('');
    }
  },
  
  renderError: function(text) {
    this.$form.find('.login-error-message').html(text);
  },

  resetInputHandler: function(e) {
    var $target = $(e.currentTarget);
    var $pInput1 = this.element.find('#jsRELoginPassword');
    var $pInput2 = this.element.find('#jsRELoginPassword1');
    if ($pInput1.val() != $pInput2.val()) {
      $target.val('');
    }
  }
  
});

$(document).ready(function() {
  $('.js-package').register();
});
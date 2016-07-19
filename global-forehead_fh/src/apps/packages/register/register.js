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
    //this.$userUName = this.element.find('.js-re-uName');
    //this.$userUNameValRes = this.element.find('.js-re-uName-val-res');
    //this.$userUNameValDes = this.element.find('.js-re-verify-userUName');

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

  },

  checkNameExistXhr: function(data){
    var self = this;
    return $.ajax({
      type: 'POST',
      url: '/acct/reg/userexist.json',
      data: data
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
      'click .js-re-register-submit': 'valCodeHandler',//校验用户名
      'blur .js-re-userName': 'checkNameExistHandler',//校验用户名是否存在
      //'blur .js-re-uName': 'checkUNameExistHandler',//校验昵称是否存在
      'click .js-re-valImg': 'refreshValCodeHandler',//刷新验证码
      'blur #jsRELoginPassword': 'valPasswordHandler',
      'blur #jsRELoginPassword1': 'valPassword1Handler',
      'click input[type=password]': 'resetInputHandler'
    });
    //this.element.find('.js-re-valCode').on('blur', function() {
    //  self.valCodeHandler();//校验验证码
    //});
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
  checkNameExistHandler: function(e){
    var self = this;
    var cookie = new Base.Storage({
      name: 'appstorage',
      type: 'cookie'
    });
    var data = {
      username: this.$username.val()
    };
    if(this.$username.val()===''){
      self._showValResult(1,this.$usernameValDes,"用户名不能为空",self.$usernameValRes);
      return false;
    }else{
      var myReg = /^[A-Za-z][A-Za-z0-9]{3,15}$/;
      if(!myReg.test(this.$username.val())){
        self._showValResult(1,this.$usernameValDes,"仅支持4-16位字母和数字，不能以数字开头",self.$usernameValRes);
        return;
      }
    }
    this.checkNameExistXhr(data).fail(function(){
      self._showValResult(1,self.$usernameValDes,"用户名验证出错",self.$usernameValRes);
    }).done(function(res){
      if(res.result===0){
        self._showValResult(0,self.$usernameValDes,"",self.$usernameValRes);
      }else{
        self._showValResult(1,self.$usernameValDes,res.msg,self.$usernameValRes);
      }
    });

  },
  //checkUNameExistHandler: function(e){
  //  var self = this;
  //  var cookie = new Base.Storage({
  //    name: 'appstorage',
  //    type: 'cookie'
  //  });
  //  var data = {
  //    uname:this.$userUName.val()
  //  };
  //  if(this.$userUName.val()==''){
  //    self._showValResult(1,self.$userUNameValDes,"昵称不能为空",this.$userUNameValRes);
  //    return;
  //  }else {
  //    var myReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
  //    if (myReg.test(this.$userUName.val())) {
  //       if(!(this.$userUName.val().replace(/[\u4e00-\u9fa5]/g, '**').length >= 4 && this.$userUName.val().replace(/[\u4e00-\u9fa5]/g, '**').length <= 16)){
  //         self._showValResult(1,self.$userUNameValDes,"昵称仅支持4-16个字符，",this.$userUNameValRes);
  //         return false;
  //       }
  //    }else{
  //      self._showValResult(1,self.$userUNameValDes,"昵称仅支持英文和数字，不能以数字开头",this.$userUNameValRes);
  //      return false;
  //    }
  //  }
  //  this.checkUNameExistXhr(data).fail(function(){
  //    self._showValResult(1,self.$userUNameValDes,"昵称验证失败",self.$userUNameValRes);
  //  }).done(function(res){
  //    if(res.result===0){
  //      //self.element.find('.js-re-uName-tip').addClass('hidden');
  //      self._showValResult(0,self.$userUNameValDes,"",self.$userUNameValRes);
  //    }else{
  //      //self.element.find('.js-re-uName-tip').removeClass('hidden').html(res.msg);
  //      self._showValResult(1,self.$userUNameValDes,res.msg,self.$userUNameValRes);
  //    }
  //  });
  //},
  refreshValCodeHandler: function(){
    this.$valImg.attr('src','');
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());
    this.$valCodeRes.val('1');
    this.$valCode.val('');
    this.$valCode.focus();
    this.$valCodeDes.html('');
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
  //$('.js-package').before(_(header).template()({
  //  extra: '<span class="header-login">已有账号，<a class="text-pleasant" href="login.html">登录</a></span>'
  //})).after(footer);
  $('.js-package').register();

});
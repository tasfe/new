require('./updateUserInfo.scss');
require('./../misc/common-init.js');

var footer = require('../../components/footer');

$.widget('gl.updateUserInfo', {

  template: require('./updateUserInfo.html'),

  _bindEvent: function () {
    this._on({
      'blur #newLoginPassword': 'valPasswordHandler',
      'blur #newLoginPassword1': 'valPassword1Handler',
      'click input[type=password]': 'resetInputHandler'
    });
  },
  checkUNameExistXhr: function(data){
    var self = this;
    return $.ajax({
      type: 'POST',
      url: '/acct/userinfo/checkuname.json',
      data: data
    });
  },
  _create: function () {

    this.element.html(_(this.template).template()());
    this.$form = this.element.find('.js-uu-updateUUContainer');

    this.$password = this.element.find('#newLoginPassword');
    this.$passwordValRes = this.element.find('.js-uu-password-val-res');
    this.$passwordValDes = this.element.find('.js-uu-verify-password');

    this.$password1 = this.element.find('#newLoginPassword1');
    this.$password1ValRes = this.element.find('.js-uu-password1-val-res');
    this.$password1ValDes = this.element.find('.js-uu-verify-password1');

    this.$footer = this.element.find('.updateUserInfo-footer');
    new footer({
      el: this.$footer
    }).render();

    this._setupForm();

    this._bindEvent();
  },

  _setupForm: function () {
    var self = this;
    var userName = _.getUrlParam('userName');
    var uName = _.getUrlParam('uName');
    var status = Number(_.getUrlParam('status'));
    this.$form.find('.js-uu-status').val(status);
    //
    //this.$form.find('.js-uu-userName').val(userName);
    //this.$form.find('.js-uu-uName').val(uName);
    if (status === 105 || status === 106) {
      //手工开户，总代开户
      this.$form.find('.js-uu-fundPwdContainer').addClass('hidden');

      this.$form.find('#jsUUOldFundPassword').attr('type', 'hidden');
      this.$form.find('#jsUUNewFundPassword').attr('type', 'hidden');
      this.$form.find('#jsUUNewFundPassword1').attr('type', 'hidden');

      this.$form.removeClass('hidden');
    } else if (status === 103 || status === 104) {
      //回收,重置
      this.$form.find('.js-uu-fundPwdContainer').addClass('hidden');

      this.$form.find('#jsUUOldFundPassword').attr('type', 'hidden');
      this.$form.find('#jsUUNewFundPassword').attr('type', 'hidden');
      this.$form.find('#jsUUNewFundPassword1').attr('type', 'hidden');

      //this.$form.find('#jsUUOldFundPassword').attr('type', 'password');
      //this.$form.find('#jsUUNewFundPassword').attr('type', 'password');
      //this.$form.find('#jsUUNewFundPassword1').attr('type', 'password');

      this.$form.removeClass('hidden');
    } else {
      //其他

      this.$form.addClass('hidden');
    }

    this.$form.parsley().subscribe('parsley:form:success', function (formInstance) {

      //if (self.$form.find('#newLoginPassword1').val() === self.$form.find('#jsUUNewFundPassword').val()) {
      //  self.$form.find('.js-uu-notice-page1').html(self._getLoginErrorEl('新资金密码和新登陆密码不能一致'));
      //  return false;
      //}
      var flag = true;

      //if(self.$userUName.val()==='' || self.$userUNameValRes.val()==='1'){
      //  self._showValResult(1,self.$userUNameValDes,'请输入有效的昵称',self.$userUNameValRes);
      //  flag =  false;
      //}

      //if(self.$passwordOld.val()===''){
      //  self._showValResult(1,self.$passwordOldValDes,'密码不能为空',self.$passwordOldValRes);
      //  flag =  false;
      //}else  if(self.$passwordOld.val()!=='' && self.$passwordOldValRes.val()!=='0'){
      //  if(!self._valPassword(self.$passwordOld, self.$passwordOldValRes,self.$passwordOldValDes,null,null,self.$password,self.$passwordValRes)){
      //    flag = false;
      //  }
      //}

      if(self.$password.val()===''){
        self._showValResult(1,self.$passwordValDes,'密码不能为空',self.$passwordValRes);
        flag =  false;
      }else  if(self.$password.val()!=='' && self.$passwordValRes.val()!=='0'){
        if(!self._valPassword(self.$password,self.$passwordValRes,self.$passwordValDes,self.$password1,self.$password1ValRes,self.$passwordOld,self.$passwordOldValRes)){
          flag = false;
        }
      }

      if(self.$password1.val()==='' ){
        self._showValResult(1,self.$password1ValDes,'密码不能为空',self.$password1ValRes);
        flag =  false;
      }else  if(self.$password1.val()!=='' && self.$password1ValRes.val()!=='0'){
        if(!self._valPassword(self.$password1,self.$password1ValRes,self.$password1ValDes,self.$password,self.$passwordValRes)){
          flag = false;
        }

      }
      if(!flag){
        return ;
      }

      formInstance.submitEvent.preventDefault();

      var cookie = new Base.Storage({
        name: 'appstorage',
        type: 'cookie'
      });

      self.token = cookie.get('token');
      var functionExe;
      //if (status === 105 || status === 106) {
        functionExe = self.updateLoginPwdAndUName();
      //}
      //else if (status === 103 || status === 104) {
      //  functionExe =  self.updateLoginPwdAndUNameAndFundPwd();
      //}

      functionExe.always(function () {
        self.$form.find('button[type="submit"]').text('确定').removeClass('disabled');
      })
        .done(function (data) {
          if (data.result === 0) {
            Global.ui.notification.show('修改成功，登录中！',{type:'success',btnContent:'立即登陆',event:function(){
              window.location.href = 'index.html';
            }});
          } else {
            Global.ui.notification.show('修改失败！'+data.msg,{btnContent:'重新修改',event:function(){
              self._create();
            }});
          }

        })
        .fail(function () {
          //self.$form.find('.js-uu-notice-page1').html(self._getLoginErrorEl('服务端异常，请稍后登录。'));
          Global.ui.notification.show('修改失败！',{btnContent:'重新修改',event:function(){
            self._create();
          }});
        });

    });
  },

  updateLoginPwdAndUName: function () {
    var self = this;
    return $.ajax({
      type: 'POST',
      url: '/acct/userinfo/updateloginpwd.json',
      data: {
        token: this.token,
        //uName: this.$form.find('.js-uu-uName').val(),
        //oldPwd: this.$form.find('#oldLoginPassword').val(),
        newPwd: this.$form.find('#newLoginPassword').val()
      },
      beforeSend: function (xhr, settings) {
        self.$form.find('button[type="submit"]').text('登录中...').addClass('disabled');
      }
    });
  },
  updateLoginPwdAndUNameAndFundPwd: function () {
    var self = this;
    return $.ajax({
      type: 'POST',
      url: '/acct/userinfo/updatepwds.json',
      data: {
        token: self.token,
        //uName: self.$form.find('.js-uu-uName').val(),
        //oldPwd: self.$form.find('#oldLoginPassword').val(),
        newPwd: self.$form.find('#newLoginPassword').val(),
        oldPayPwd: self.$form.find('#jsUUOldFundPassword').val(),
        newPayPwd: self.$form.find('#jsUUNewFundPassword').val(),

        beforeSend: function (xhr, settings) {
          self.$form.find('button[type="submit"]').text('登录中...').addClass('disabled');
        }
      }
    });
  },

  _getLoginErrorEl: function (text) {
    return '<div class="alert alert-danger alert-dismissible" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '<span aria-hidden="true">×</span>' +
      '</button>' +
      '<i class="fa fa-times-circle m-right-xs"></i>' +
      '<strong>提示！</strong> ' + text +
      '</div>';
  },
  getUrlParams: function () {
    //获取当前URL地址
    var search = window.location.search;
    //从search中抽取从 1 开始到search.length字符，并以&分割获取写入字符串
    var tmparray = search.substr(1, search.length).split("&");
    var paramsArray = [];
    if (tmparray) {
      for (var i = 0; i < tmparray.length; i++) {
        // 用=进行拆分，但不包括==
        var reg = /[=|^==]/;
        //用&替换reg
        var set1 = tmparray[i].replace(reg, '&');
        //以&分割获取
        var tmpStr2 = set1.split('&');
        var array = [];
        array[tmpStr2[0]] = tmpStr2[1];
        // 将array添加到paramsArray中，并返回长度
        paramsArray.push(array);
      }
    }
    // 返回参数数组
    return paramsArray;
  },
  //checkUNameExistHandler: function(e){
  //  var self = this;
  //  var cookie = new Base.Storage({
  //    name: 'appstorage',
  //    type: 'cookie'
  //  });
  //  var data = {
  //    token: cookie.get('token')
  //    //uname:this.$userUName.val()
  //  };
  //  if(this.$userUName.val()==''){
  //    self._showValResult(1,self.$userUNameValDes,"昵称不能为空",this.$userUNameValRes);
  //    return;
  //  }else {
  //    var myReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
  //    if (myReg.test(this.$userUName.val())) {
  //      if(!(this.$userUName.val().replace(/[\u4e00-\u9fa5]/g, '**').length >= 4 && this.$userUName.val().replace(/[\u4e00-\u9fa5]/g, '**').length <= 16)){
  //        self._showValResult(1,self.$userUNameValDes,"昵称仅支持4-16个字符，",this.$userUNameValRes);
  //        return false;
  //      }
  //    }else{
  //      self._showValResult(1,self.$userUNameValDes,"昵称仅支持英文和数字，不能以数字开头",this.$userUNameValRes);
  //      return false;
  //    }
  //  }
  //  this.checkUNameExistXhr(data).fail(function(){
  //    self._showValResult(1,self.$userUNameValDes,"昵称验证失败",self.$userUNameValRes);
  //  }).done(function(res){
  //    if(res.result===0){
  //      self._showValResult(0,self.$userUNameValDes,"",self.$userUNameValRes);
  //    }else{
  //      self._showValResult(1,self.$userUNameValDes,res.msg,self.$userUNameValRes);
  //    }
  //  });
  //},

  //valPasswordOldHandler: function(){
  //  this._valPassword(this.$passwordOld,this.$passwordOldValRes,this.$passwordOldValDes,null,null,this.$password,this.$passwordValRes)
  //},
  valPasswordHandler: function(){
    this._valPassword(this.$password,this.$passwordValRes,this.$passwordValDes,this.$password1,this.$password1ValRes);//,this.$passwordOld,this.$passwordOldValRes);
  },
  valPassword1Handler: function(){
    this._valPassword(this.$password1,this.$password1ValRes,this.$password1ValDes,this.$password,this.$passwordValRes);
  },
  _valPassword: function($password,$result,$describe,$target,$targetResult,$notEqual,$notEqualResult){
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
    if($notEqual && $notEqual.val()!=='' && password !==''){
      if(password === $notEqual.val()){
        msg.push('新旧密码不能一致');
      }else{
      //  $notEqual.trigger('blur');
        if(_(msg).isEmpty() && $notEqualResult!==null && $notEqualResult.val()==='1'){
          this._showValResult(0,$describe,'',$result);
          $notEqual.trigger('blur');
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

  resetInputHandler: function(e) {
    var $target = $(e.currentTarget);
    var $pInput1 = this.element.find('#newLoginPassword');
    var $pInput2 = this.element.find('#newLoginPassword1');
    if ($pInput1.val() != $pInput2.val()) {
      $target.val('');
    }
  }

});

$(document).ready(function () {
  $('.js-package').updateUserInfo();
});

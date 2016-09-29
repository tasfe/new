var footer = require('com/footer');

var servers = require('skeleton/misc/servers');

require('./../misc/common-init.js');
require('./../../../base/minimal/grey.css');
require('./login.scss');

var connectIcon = require('./connect-icon.png');
var Encryption =  require('com/encryption');

$.widget('gl.login', {

  template: require('./login.html'),

  resetInput: false,

  _create: function () {
    $('body').css('display','none');

    this.element.html(_(this.template).template()({
      time: moment().format('M月DD日 ddd'),
      remember: Global.localCache.get('account.remember')
    }));

    //ray(this.element.find('.js-shine-ray')[0]);

    this.$form = this.element.find('#loginForm');
    this.$username = this.element.find('input[name="username"]');
    this.$password =  this.element.find('input[name="loginPwd"]');
    this.$valRegion = this.element.find('.js-login-valRegion');
    this.$valCode = this.element.find('.js-login-valCode');
    this.$valImg = this.element.find('.js-login-valImg');
    this.$valResult = this.element.find('.js-login-valResult');
    this.$submit = this.element.find('button[type="submit"]');
    this.$errMsg = this.element.find('.login-error-message');
    this.$remember = this.element.find('#jsRemember');

    this.$connectText = this.element.find('.js-connect-test');

    this.$footer = this.element.find('.footer');
    new footer({
      el: this.$footer,
      signed: false
    }).render();

    var url =  window.self.location.toString();
    this.codeUrl = url.substring(0, url.indexOf('/', url.indexOf('://',0)+3))+'/acct/imgcode/code';

    this._onPageLoaded();

    var cookie = new Base.Storage({
      name: 'appstorage',
      type: 'cookie'
    });

    this.username = cookie.get('username');

    this.parsley = this.$form.parsley({
      priorityEnabled: false
    });

    this._bindEvent();

    this._connectTest();

    $('input').iCheck({
      checkboxClass: 'icheckbox_minimal-grey',
      radioClass: 'iradio_minimal-grey',
      increaseArea: '20%' // optional
    });


    if (localStorage.getItem("account") != null && localStorage.getItem("password") != null) {
      $('.js-onfocus-Inp-01').val(localStorage.getItem("account"));
      $('.js-onfocus-Inp-02').val(localStorage.getItem("password"));
      $('#rem').iCheck('check');
    }
  },

  _connectTest: function() {
    var self = this;
    var showIndex = 0;

    _(servers).each(function(serverInfo, index) {
      var isCurrent = window.location.href.indexOf(serverInfo.server) > -1;
      //var isCurrent = 'http://www.tlf9.com'.indexOf(serverInfo.server) > -1;
      var html = '<li>' +
        '<a href="' + serverInfo.server + '">' +
        '<div class="connect-server">' +
        '<img class="connect-item-icon" src="' + connectIcon + '" />' +
        '<div class="js-connect-server js-connect-server-' + index + ' connect-speeds">' +
        '<span></span>' +
        '<span></span>' +
        '<span></span>' +
        '<span></span>' +
        '<span></span>' +
        '<span></span>' +
        '<span></span>' +
        '<span></span>' +
        '<span></span>' +
        '<span></span>' +
        '</div>' +
        '</div>' +
        '<p>' + (isCurrent ? '当前线路' : ('线路' + ++showIndex)) + '</p>' +
        '</a>' +
        '</li>';

      isCurrent ? this.$connectText.prepend(html) : this.$connectText.append(html);
    }, this);

    _(servers).each(function(serverInfo, index) {
      var start = Date.now();

      $.ajax({
        url: serverInfo.server + '/connect-test.json',
        dataType: 'jsonp',
        jsonpCallback: 'abc',
        timeout: 2000
      })
        .always(function(res) {
          self.element.find('.js-connect-server-' + index).addClass('connect-speeds-tested connect-speeds-' + Math.floor((Date.now() - start) / 200));
          $('body').css('display','block');
        });
    });

  },

  _bindEvent: function () {
    var self = this;
    this._on({
      'click .js-login-login-btn': 'valCodeHandler',//校验用户名
      'click .js-login-valImg': 'refreshValCodeHandler',//刷新验证码
      'click input[type!=hidden]': 'resetInputHandler',
      'click .js-showConnectTest': 'showConnectTest',
      'focus  .js-onfocus-Inp-01': 'focusInpu',
      'blur  .js-onfocus-Inp-01': 'blurInpu',
      'focus  .js-onfocus-Inp-02': 'focusInpuOne',
      'blur  .js-onfocus-Inp-02': 'blurInpuOne',
    });
  },
  focusInpu:function(){
    //alert(1);
    $('.js-onfocus-Inp-01').focus(function(){
      $(this).addClass('onfocus-Inp-active');
      $('.js-i-user').addClass('i-user');
      //$('.js-i-key').addClass('i-key');
    })
  },
  blurInpu:function(){
    //alert(1);
    $('.js-onfocus-Inp-01').blur(function(){
      $(this).removeClass('onfocus-Inp-active');
      $('.js-i-user').removeClass('i-user');
      //$('.js-i-key').addClass('i-key');
    })
  },
  focusInpuOne:function(){
    //alert(1);
    $('.js-onfocus-Inp-02').focus(function(){
      $(this).addClass('onfocus-Inp-active');
      $('.js-i-key').addClass('i-key');
      //$('.js-i-key').addClass('i-key');
    })
  },
  blurInpuOne:function(){
    //alert(1);
    $('.js-onfocus-Inp-02').blur(function(){
      $(this).removeClass('onfocus-Inp-active');
      $('.js-i-key').removeClass('i-key');
      //$('.js-i-key').addClass('i-key');
    })
  },
  _onPageLoaded: function() {
    $(window).load(function() {
      $('body').removeClass('overflow-hidden');
      $('.wrapper').removeClass('preload');
    });
  },

  showConnectTest: function(){
    $('.js-connectTest').removeClass('hidden')
  },

  loginHandler: function() {
    var self = this;
    //todo
    var encryption = new Encryption();
    var param = encryption.encryptSha(new Date().valueOf() + '');
    var entPassword = encryption.encrypt(self.$password.val(),param);

    if (!this.parsley.validate()) {
      return false;
    }
    if (self.$valResult.val()!=='0') {
      if(!this.$valCode.hasClass('hidden')){
        self.$valRegion.removeClass('hidden');
        self.$valCode.removeClass('hidden');
        self.$valCode.attr('type','text');
        self.renderError('请输入验证码！');
        self.refreshValCodeHandler();
      } else {
        self.renderError('验证码输入有误！');
      }
      return false;
    }

    $.ajax({
      type: 'POST',
      url: '/acct/login/dologin.json',
      data: {
        username: self.$username.val(),
        loginPwd: entPassword,
        param: param,
        code: self.$valCode.val()
      },
      beforeSend: function(xhr, settings) {
        self.$submit.button('loading');
      }
    })
      .always(function() {
        self.$submit.button('reset');
      })
      .done(function(data, status, xhr) {
        if ($("input[name='iCheck']:checked").val() == 1) {
          localStorage.setItem("account", $('.js-onfocus-Inp-01').val());
          localStorage.setItem("password", $('.js-onfocus-Inp-02').val());
        }
        else{
          localStorage.clear();
        }

        sessionStorage.status = 0;
        if (data.result === 0) {
          self.resetInput = false;

          if (self.$remember.prop('checked')) {
            Global.localCache.set('account.remember', self.$username.val());
          } else {
            Global.localCache.clear('account.remember');
          }

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
            sessionStorage.username = data.root.username;
            sessionStorage.status = 1;
            window.location.href = 'index.html';
            //var ur ='userName='+data.root.username+(data.root.uName?'&uName='+data.root.uName:'')+'&status='+status;
            //window.location.href = 'updateUserInfo.html?'+encodeURI(ur);
          }else if(status===101){
            Global.ui.notification.show('完全冻结的用户无法登录');
          }
          else{
            window.location.href = 'index.html';
          }

        } else {
          if(data.msg.indexOf('验证码')!==-1) {
            if(self.$valCode.hasClass('hidden')){
              self.$valRegion.removeClass('hidden');
              self.$valCode.removeClass('hidden');
              self.$valCode.attr('type','text');
              self.$valResult.val('1');
              self.$valImg.attr('src',self.codeUrl+'?_t='+_.now());
              self.renderError('请输入验证码！');
              self.$valCode.focus();
            }else{
              self.renderError('验证码输入有误！');
              self.refreshValCodeHandler();
            }
            self.resetInput = false;
          }else{
            Global.ui.notification.show('用户名或密码错误');

            //self.renderError(data.msg);
            self.resetInput = true;
           // self.refreshValCodeHandler();
          }
        }
      })
      .fail(function(){
        Global.ui.notification.show('当前网络异常，请切换线路');

        if(!self.$valRegion.hasClass('hidden')){
          self.$valImg.trigger('click');
        }
      });

    return false;
  },
  //
  valCodeHandler: function () {

    var self = this;
    if(self.$valRegion.hasClass('hidden')){
      self.loginHandler();
    }else{
      if(self.$valCode && self.$valCode.val()!='' && self.$valCode.val().length===4){
        $.ajax({
          type: 'POST',
          url: '/acct/imgcode/val.json',
          data: {
            code: self.$valCode.val()
          }
        }).done(function (data, status, xhr) {
          if (data.result === 0) {
            self.$valResult.val('0');
            self.renderError('');
            self.loginHandler();
          }else{
            self.$valResult.val('1');
            if(self.$valRegion.hasClass('hidden')){
              self.renderError('请输入验证码！');
            }else{
              self.renderError('验证码输入有误！');
            }
            self.refreshValCodeHandler();
          }
        }).fail(function () {
          self.renderError('验证失败！');
          self.refreshValCodeHandler();
        });
      }else{
        self.renderError('请输入验证码！');

      }
    }


  },

  valUsernameNeedValCode: function(e){
    if (!this.$username.parsley().isValid() || !this.$password.parsley().isValid()) {
      return;
    }

    this.$username.val(this.$username.val().trim());
    var self = this;
    if(self.$username && self.$username.val() !== '' && self.$username.val().length >= 4){
      $.ajax({
        type: 'POST',
        url: '/acct/login/needimgcode.json',
        data: {
          username: self.$username.val()
        }
      })
        .done(function(data, status, xhr) {
          if (data.result === 0) {
            //隐藏验证码
            self.$valRegion.addClass('hidden');
            self.$valCode.addClass('hidden');
            self.$valCode.attr('type','hidden');
            self.$valCode.val('');
            self.$valResult.val('0');
            self.$valImg.attr('src','');
          } else {
            if (self.$valRegion.hasClass('hidden')) {
              //展示验证码
              self.$valRegion.removeClass('hidden');
              self.$valCode.removeClass('hidden');
              self.$valCode.attr('type','text');
              self.$valResult.val('1');
              self.$valImg.attr('src',self.codeUrl);
              self.$valCode.focus();
            }
          }
        }).
        fail(function() {
          //隐藏验证码
          self.$valRegion.addClass('hidden');
          self.$valCode.addClass('hidden');
          self.$valCode.attr('type','hidden');
          self.$valCode.val('');
          self.$valResult.val('0');
          self.$valImg.attr('src','');
          self.renderError('当前网络异常，请切换线路');
        });
    }

  },
  refreshValCodeHandler: function() {
    this.$valImg.attr('src','');
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());
    this.$valCode.val('');
    this.$valCode.focus();
    this.$valResult.val('1');
  },

  renderError: function(text) {
    this.$errMsg.html(text);
  },

  resetInputHandler: function(e) {
    var $target = $(e.currentTarget);
    if (this.resetInput) {
      $target.val('');
    }
  }

});

$(document).ready(function() {
  $('.js-package').login();
});

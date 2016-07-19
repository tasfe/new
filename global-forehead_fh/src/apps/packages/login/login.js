var footer = require('com/footer');

var servers = require('skeleton/misc/servers');

require('./../misc/common-init.js');
require('./login.scss');

var connectIcon = require('./connect-icon.png');
var Encryption =  require('com/encryption');

$.widget('gl.login', {

  template: require('./login.html'),

  resetInput: false,

  _create: function () {

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
          console.log(serverInfo.server + ': ' + (Date.now() - start));
        });
    });
  },

  _bindEvent: function () {
    var self = this;
    //绑定事件
    //this._on(this.$form,{
    //  'submit': 'loginHandler'//校验用户名
    //});
    this._on({
      'click .js-login-login-btn': 'valCodeHandler',//校验用户名
    //  'blur .js-login-valCode': 'valCodeHandler',//校验验证码
    //  'blur input[name="username"]': 'valUsernameNeedValCode',//校验是否需要输入验证码
    //  'blur input[name="loginPwd"]': 'valUsernameNeedValCode',//校验是否需要输入验证码
      'click .js-login-valImg': 'refreshValCodeHandler',//刷新验证码
      'click input[type!=hidden]': 'resetInputHandler'
    });
    //this.$valCode.on('keyup', function() {
    //  self.valCodeHandler();
    //});
  },

  _onPageLoaded: function() {
    $(window).load(function() {
      $('body').removeClass('overflow-hidden');
      $('.wrapper').removeClass('preload');
    });
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
            var ur ='userName='+data.root.username+(data.root.uName?'&uName='+data.root.uName:'')+'&status='+status;
            window.location.href = 'updateUserInfo.html?'+encodeURI(ur);
          }else if(status===101){
            self.renderError('完全冻结的用户无法登录');
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

            self.renderError('用户名或密码错误');

            //self.renderError(data.msg);
            self.resetInput = true;
           // self.refreshValCodeHandler();
          }
        }
      })
      .fail(function(){
        self.renderError('当前网络异常，请切换线路');
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

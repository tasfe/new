$.widget('gl.login', {

  _create: function () {

    this._onPageLoaded();

    this.parsley = this.element.parsley({
      errorsWrapper: '<div class="tooltip bottom parsley-errors-list tooltip-error"><div class="tooltip-arrow"></div></div>',
      errorTemplate: '<div class="tooltip-inner">',
      trigger: 'change'
    });

    this.$loginBox = this.element.find('.login-box');
    this.$loadingBox = this.element.find('.loading-box');

    this._bindEvent();

    var $image = $('#background');
    $image.on('load', function() {
      var engine = new RainyDay({
        image: this
      });
      engine.rain([ [0, 2, 100], [3, 3, 1] ], 100);
    });
    $image.attr('crossOrigin', 'anonymous');
    $image.attr('src', './images/login-background.jpg');
  },

  _bindEvent: function () {
    //绑定事件
    this._on(this.element, {
      'submit': 'loginHandler'//校验用户名
    });
  },

  _onPageLoaded: function() {
    $(window).load(function() {
      $('body').removeClass('overflow-hidden');
      $('.wrapper').removeClass('preload');
    });
  },

  _doLogin: function() {
    var self = this;
    this.$loginBox.addClass('loading');

    setTimeout(function() {
      self.$loadingBox.addClass('in-mid');
    }, 300);
  },

  return: function() {
    var self = this;
    this.$loadingBox.addClass('out-right');

    setTimeout(function() {
      self.$loadingBox.removeClass('in-mid');
      self.$loadingBox.removeClass('out-right');
      self.$loginBox.removeClass('loading');
    }, 300);
  },

  loginHandler: function(e) {
    var self = this;

    if (!this.parsley.validate()) {
      return false;
    }

    //this._doLogin();

    var param = this.encryptSha(new Date().valueOf() + '');
    var entPassword = this.encrypt(self.element.find('input[name="loginPwd"]').val(),param);

    $.ajax({
      type: 'POST',
      url: '/intra/superlogin/dologin.json',
      data: {
        username: self.element.find('input[name="username"]').val(),
        loginPwd: entPassword,
        param: param
      },
      beforeSend: function(xhr, settings) {
        self.element.find('button[type="submit"]').button('loading');
      }
    })
      .always(function() {
        self.element.find('button[type="submit"]').button('reset');
      })
      .done(function(data, status, xhr) {
        if (data.result === 0) {

          var cookie = new Base.Storage({
            name: 'appstorage',
            type: 'cookie'
          });

          cookie.set('back_token', data.root.token);

          window.location.href = 'index.html';

        } else {
          //self.return();
          self.element.find('.login-error-message').html(self._getLoginErrorEl(data.msg));
        }

      })
      .fail(function(){
        //self.return();
        self.element.find('.login-error-message').html(self._getLoginErrorEl('服务端异常，请稍后登录。'));
      });

    return false;
  },

  _getLoginErrorEl: function(text) {
    return '<div class="alert alert-danger alert-dismissible" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '<span aria-hidden="true">×</span>' +
      '</button>' +
      '<i class="fa fa-times-circle m-right-xs"></i>' +
      '<strong>提示！</strong> ' + text +
      '</div>';
  },

  encrypt: function (password, salt) {
    return hex_sha512(hex_md5(password + '') + '' + salt);
  },

  encryptSha: function (data){
    return hex_sha512(data+'');
  }

});

$(document).ready(function() {
  $('#loginForm').login();
});

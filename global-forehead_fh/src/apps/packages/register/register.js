require('./register.scss');
require('./../misc/common-init.js');

//var header = require('../misc/header.html');
var footer = require('../../components/footer');

var bannerConfig = require('./bannerConfig');

$.widget('gl.register', {

  template: require('./register.html'),

  bannerTpl: _(require('./banner.html')).template(),

  _create: function () {

    this.element.html(_(this.template).template()());

    this.$valCode = this.element.find('.js-rp-valCode');
    this.$valImg = this.element.find('.js-re-valImg');

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

    this.$form = this.element.find('.js-register-form');
    this.parsley = this.$form.parsley(Global.validator.getInlineErrorConfig());

    this.$navigationLiList = $('.scroll-dots');
    this.$imgList = $('.js-banner-list');
    this.renderRegistrationBannerAD();
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
      'click .js-re-valImg': 'refreshValCodeHandler',//刷新验证码
      'click .js-re-register-submit': 'registerSubmit' //提交注册
    });
  },

   registerXhr: function(data) {
    return $.ajax({
      type: 'POST',
      url: '/acct/reg/doreg.json',
      data: _(data).extend({
        linkId: _.getUrlParam('linkId')
      })
    });
  },

  getBannerADXhr: function () {
    return $.ajax({
      type: 'POST',
      url: '/acct/usernotice/getregadvertise.json'
    });
  },

  registerSubmit: function (e) {
    var self = this;
    var $target = $(e.currentTarget);

    if (!this.parsley.validate()) {
      return false;
    }

    this.registerXhr(_(this.$form.serializeArray()).serializeObject())
      .always(function() {
        $target.button('reset');
      })
      .fail(function() {
        Global.ui.notification.show('注册失败！',{btnContent:'重新注册',event:function(){
          self._create();
        }});
      })
      .done(function (res) {
        if (res.result === 0) {
          Global.ui.notification.show('注册成功！',{type:'success',btnContent:'登陆',event:function(){
            Global.cookieCache.set('token', res.root.token);
            window.location.href = 'index.html';
          }});
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
  },

  safetyTipsBind: function () {
    var self = this;

    var newLoginPassword = _(function() {
      var str= $('.js-rp-loginPwd1').val();
      var str2= $('.js-rp-loginPwd2').val();

      if (str.length == 0) {
        $('.content-julien .right dl').eq(1).addClass('wrong');
        $('.content-julien .right dl').eq(1).removeClass('correct');
        $('.content-julien .right dl .messageBox span').eq(1).html('不能为空');
      }
      else if ( !isNaN(str) && str.length < 9 ) {
        $('.content-julien .right dl').eq(1).addClass('wrong');
        $('.content-julien .right dl').eq(1).removeClass('correct');
        $('.content-julien .right dl .messageBox span').eq(1).html('不能是9位以下的纯数字（≤8个阿拉伯数字）');
      }
      else if(str.indexOf(" ")>0){
        $('.content-julien .right dl').eq(1).addClass('wrong');
        $('.content-julien .right dl').eq(1).removeClass('correct');
        $('.content-julien .right dl .messageBox span').eq(1).html('不能包含空格');
      }
      else if (str.length < 6 || str.length > 20) {
        $('.content-julien .right dl').eq(1).addClass('wrong');
        $('.content-julien .right dl').eq(1).removeClass('correct');
        $('.content-julien .right dl .messageBox span').eq(1).html('6-20位字符组成');
      }
      else{
        $('.content-julien .right dl').eq(1).removeClass('wrong');
        $('.content-julien .right dl').eq(1).addClass('correct');
        $('.content-julien .right dl .messageBox span').eq(1).html('');
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

    $('.js-rp-loginPwd1').on('blur', newLoginPassword);
    $('.js-rp-loginPwd2').on('blur', newLoginPassword2);

    var $valCode = $('.js-rp-valCode');
    inputParsley = $valCode.parsley(Global.validator.getInlineErrorConfig());
    $valCode.on('input', function() {
      if ($('.js-rp-valCode').val().length == 4) {

        ParsleyUI.removeError(inputParsley, 'remoteError');
        Global.sync.ajax({
          type: 'POST',
          url: '/acct/imgcode/val.json',
          data: {
            code: $('.js-rp-valCode').val()
          }
        }).done(function (data, status, xhr) {
          if (data.result === 0) {
          }else{
            self.refreshValCodeHandler();
            ParsleyUI.addError(inputParsley, 'remoteError', '验证码不正确');
          }
        }).fail(function () {
            self.refreshValCodeHandler();
            //Global.ui.notification.show('验证码报错');
        });
      }
    });


    var verifyInputUserName = _(function() {
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
            $('.content-julien .right dl .messageBox span').eq(0).html('字符数必须是4至16之间');
          }
        }
        else{
          $('.content-julien .right dl').eq(0).addClass('wrong');
          $('.content-julien .right dl').eq(0).removeClass('correct');
          $('.content-julien .right dl .messageBox span').eq(0).html('格式不符');
        }
      }
    }).debounce(400);

    $('.js-re-userName').on('blur', verifyInputUserName);
  },

  refreshValCodeHandler: function(){
    this.$valImg.attr('src','');
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());
    this.$valCode.val('');
  },

  _setupForm: function () {
    var self = this;
    var linkId = _.getUrlParam('linkId');
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
      // liList.push('<li data-target="#jsREADCarousel" data-slide-to="' + index + (index === 0 ? '" class="active"' : '"') + '></li>');
    });

    _(data).each(function(item, index) {
      liList.push('<li data-target="#jsDbCarousel" data-slide-to="' + index + (index === 0 ? '" class="active"' : '"') + '></li>');
      // liList.push('<a ' + (index === 0 ? ' class="active"' : '') + '></a>');
    });

    if(_(liList).size()>0){
      this.$navigationLiList.html(liList.join('')).removeClass('hidden');
    }

    this.$imgList.html(divList.join(''));

    this.element.find('#jsDbCarousel').carousel()
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

  refreshValCodeOnly: function(){
    this.$valImg.attr('src','');
    this.$valImg.attr('src',this.codeUrl+'?_t='+_.now());
  }
  
});

$(document).ready(function() {
  $('.js-package').register();
});
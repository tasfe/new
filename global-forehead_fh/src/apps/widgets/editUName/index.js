"use strict";

$.widget('gl.editUName', {

  options: {
    id: '',
    namespace: 'tip',
    title: '修改昵称'
  },

  _create: function() {
    var self = this;
    var body = [];
    body.push('<div class="text-center margin-sm julien-dialog">');
    body.push('<div class="uc-bank-manage-lock">');
    body.push('<div class="control-group uc-cm-fund-pwd-div">');
    body.push('<div class="julien-input">');
    body.push('昵称：<input type="text" class="js-uName"/> <i></i><div class="messageBox"><b></b><span>不能为空</span>');
    body.push('</div>');
    body.push('</div>');
    body.push('<hr>');
    body.push('<div class="control-group">');
    body.push('<button type="button" class="js-uc-updateUName julien-btn">修改</button>');
    body.push('</div>');
    body.push('</div>');
    body.push('</div>');

    this.uuid = this.options.id || this.options.namespace + _.now();

    this.$dialog = Global.ui.dialog.show({
      id: this.uuid,
      title: this.options.title,
      size: 'modal-md',
      body: body.join('')
    });
    this.$validateError = this.$dialog.find('.js-uc-cmValPayPwdNotice');
    this.$dialog.on('hidden.bs.modal', function (e) {
      $(this).remove();
      self.destroy();
    });

    this._bindEvents();

    var acctInfo = Global.memoryCache.get('acctInfo');
    $('.js-uName').val(acctInfo.uName);

    if (acctInfo.uName != ''){
      if (acctInfo.uName.length < 4) {
        $('.julien-dialog .julien-input').addClass('wrong');
        $('.julien-dialog .julien-input').removeClass('correct');
        $('.julien-dialog .julien-input .messageBox span').html('字符不小于4');
      }
      else{
        $('.julien-dialog .julien-input').removeClass('wrong');
        $('.julien-dialog .julien-input').addClass('correct');
      }
    }
    
  },

  _bindEvents: function() {
    var self = this;

    var uName = _(function() {
      var str= $('.js-uName').val();

      if (str == ''){
        $('.julien-dialog .julien-input').addClass('wrong');
        $('.julien-dialog .julien-input').removeClass('correct');
        $('.julien-dialog .julien-input .messageBox span').html('不能为空');
      }
      else if (str.length < 4) {
        $('.julien-dialog .julien-input').addClass('wrong');
        $('.julien-dialog .julien-input').removeClass('correct');
        $('.julien-dialog .julien-input .messageBox span').html('字符不小于4');
      }
      else{
        $('.julien-dialog .julien-input').removeClass('wrong');
        $('.julien-dialog .julien-input').addClass('correct');
      }
    }).debounce(400);

    $('.js-uName').on('keypress', uName);

    $('.js-uc-updateUName').on('click',function (e) {
      
      var $target = $(e.currentTarget);
      var type = $target.data('type');

      var str= $('.js-uName').val();

      if (str == ''){
        $('.julien-dialog .julien-input').addClass('wrong');
        $('.julien-dialog .julien-input').removeClass('correct');
        $('.julien-dialog .julien-input .messageBox span').html('不能为空');
      }
      else if (str.length < 4) {
        $('.julien-dialog .julien-input').addClass('wrong');
        $('.julien-dialog .julien-input').removeClass('correct');
        $('.julien-dialog .julien-input .messageBox span').html('字符不小于4');
      }
      else{
        $('.julien-dialog .julien-input').removeClass('wrong');
        $('.julien-dialog .julien-input').addClass('correct');


        $target.button('loading');
        self.updateuname().always(function () {
          $target.button('reset');
        }).fail(function () {
          Global.ui.notification.show('修改昵称请求失败');
        }).done(function (res) {
          if (res && res.result === 0) {
            $('.uc-info dt b').html(str);
            Global.ui.notification.show('修改成功');

            self.$dialog.modal('hide');
          } else {
            Global.ui.notification.show(res.msg);
          }
        })
      }
    });
  },

  changeHrefHandler: function(e) {
    if (this.$dialog) {
      this.$dialog.modal('hide');
    }
  },

  check: function(_callback) {
    this._create();
    this._callback = _callback;
  },

  updateuname: function() {
    var data = {
      uname: $('.js-uName').val()
    };
    return Global.sync.ajax({
      url: '/acct/userinfo/updateuname.json',
      data: data
    });
  },

  renderError: function(text) {
    this.$validateError.closest('.control-group').removeClass('hidden');
    this.$validateError.html(text);
  }
});

module.exports = $.gl.editUName;

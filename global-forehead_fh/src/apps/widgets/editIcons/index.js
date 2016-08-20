"use strict";

$.widget('gl.editIcons', {

  options: {
    id: '',
    namespace: 'tip',
    title: '更换头像'
  },

  _create: function() {
    var self = this;
    
    var body = [];
    body.push('<div class="text-center margin-sm julien-dialog">');
    body.push('<div class="uc-bank-manage-lock">');
    body.push('<div class="control-group uc-cm-fund-pwd-div">');
    body.push('<div class="julien-images">');
    body.push('<span class="iconsImage8 js-image8" data-headid="8"></span>');
    for (var i = 1; i <= 12; i++) {
      if (i != 8) {
        body.push('<span class="iconsImage' + i + ' js-image' + i + '" data-headid="' + i + '"></span>');
      }
    }
    body.push('</div>');
    body.push('</div>');
    body.push('<hr>');
    body.push('<div class="control-group">');
    body.push('<button type="button" class="js-uc-changeIcons julien-btn">替换</button>');
    body.push('<button type="button" class="julien-btn2" data-dismiss="modal">取消</button>');
    body.push('</div>');
    body.push('</div>');
    body.push('</div>');

    this.uuid = this.options.id || this.options.namespace + _.now();

    this.$dialog = Global.ui.dialog.show({
      id: this.uuid,
      title: this.options.title,
      size: 'modal-lg',
      body: body.join('')
    });
    this.$validateError = this.$dialog.find('.js-uc-cmValPayPwdNotice');
    this.$dialog.on('hidden.bs.modal', function (e) {
      $(this).remove();
      self.destroy();
    });

    this._bindEvents();

    if (sessionStorage.getItem('headId') == null) {
      var acctInfo = Global.memoryCache.get('acctInfo');

      if (acctInfo.headId == 8) {
        $('.julien-images span').eq(0).addClass('sd');
      }
      else if( acctInfo.headId > 8 ){
        $('.julien-images span').eq(acctInfo.headId - 1).addClass('sd');
      }
      else{
        $('.julien-images span').eq(acctInfo.headId).addClass('sd');
      }

      sessionStorage.setItem('headId', acctInfo.headId);
    }
    else{
      if ( sessionStorage.getItem('headId') == 8 ) {
        $('.julien-images span').eq(0).addClass('sd');
      }
      else if( sessionStorage.getItem('headId') > 8 ){
        $('.julien-images span').eq( sessionStorage.getItem('headId') - 1 ).addClass('sd');
      }
      else{
        $('.julien-images span').eq( sessionStorage.getItem('headId') ).addClass('sd');
      }
    }
  },

  _bindEvents: function() {
    var self = this;

    $('.julien-images span').on('click',function () {
      $('.julien-images span').removeClass('sd');
      $(this).addClass('sd');
      sessionStorage.setItem('headId', $(this).data('headid'));
    });

    $('.js-uc-changeIcons').on('click',function (e) {
      
      var $target = $(e.currentTarget);
      var type = $target.data('type');

      $target.button('loading');
      self.updateuserhead().always(function () {
        $target.button('reset');
      }).fail(function () {
        Global.ui.notification.show('修改头像请求失败');
      }).done(function (res) {
        if (res && res.result === 0) {
          for (var i = 1; i <= 12; i++) {
             $('.js-editIcons span').removeClass('iconsImage' + i)
          }

          $('.js-editIcons span').addClass('iconsImage' + sessionStorage.getItem('headId'));

          Global.ui.notification.show('修改成功');

          self.$dialog.modal('hide');
        } else {
          Global.ui.notification.show(res.msg);
        }
      })
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

  updateuserhead: function() {
    var data = {
      headId: sessionStorage.getItem('headId')
    };
    return Global.sync.ajax({
      url: '/acct/userinfo/updateuserhead.json',
      data: data
    });
  },

  renderError: function(text) {
    this.$validateError.closest('.control-group').removeClass('hidden');
    this.$validateError.html(text);
  }
});

module.exports = $.gl.editIcons;

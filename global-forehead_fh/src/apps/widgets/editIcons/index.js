"use strict";

require('./index.scss');

$.widget('gl.editIcons', {

  options: {
    id: '',
    namespace: 'editIcons',
    title: '更换头像'
  },

  updateUserHeadXhr: function(headId) {
    var data = {
      headId: headId
    };
    return Global.sync.ajax({
      url: '/acct/userinfo/updateuserhead.json',
      data: data
    });
  },

  _create: function() {
    var self = this;
    
    var body = [];
    body.push('<div class="text-center margin-sm">');
    body.push('<div class="control-group">');
    body.push('<div class="user-avatars">');
    for (var i = 12; i >= 1; --i) {
      body.push('<span class="js-user-avatar js-user-avatar-' + i + ' user-avatar avatar-' + i + '" data-head-id="' + i + '"></span>');
    }
    body.push('</div>');
    body.push('</div>');
    body.push('</div>');

    var footer = [];
    footer.push('<div class="control-group">');
    footer.push('<button type="button" class="js-uc-changeIcons btn btn-pink btn-linear">替换</button>');
    footer.push('<button type="button" class="btn btn-linear" data-dismiss="modal">取消</button>');
    footer.push('</div>');

    this.$dialog = Global.ui.dialog.show({
      title: this.options.title,
      size: 'modal-lg',
      body: body.join(''),
      footer: footer.join('')
    });

    this.$dialog.on('hidden.modal', function (e) {
      $(this).remove();
      self.destroy();
    });

    this.$icons = this.$dialog.find('.js-user-avatar');

    this._bindEvents();

    this.$icons.filter('.js-user-avatar-' + (Global.memoryCache.get('acctInfo').headId)).addClass('sd');
  },

  _bindEvents: function() {
    var self = this;

    var headId;

    this.$icons.on('click',function () {
      self.$icons.removeClass('sd');
      $(this).addClass('sd');
      headId = $(this).data('headId');
    });

    this.$dialog.find('.js-uc-changeIcons').on('click',function (e) {
      var $target = $(e.currentTarget);

      $target.button('loading');

      self.updateUserHeadXhr(headId).always(function () {
        $target.button('reset');
      }).fail(function () {
        Global.ui.notification.show('修改头像请求失败');
      }).done(function (res) {
        if (res && res.result === 0) {

          Global.ui.notification.show('修改成功');
          Global.m.oauth.check();

          self.$dialog.modal('hide');
        } else {
          Global.ui.notification.show(res.msg);
        }
      })
    });
  }
});

module.exports = $.gl.editIcons;

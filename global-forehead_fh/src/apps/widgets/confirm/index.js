"use strict";

$.widget('gl.confirm', {

  _currentSelItemMeta: {},

  options: {
    id: '',
    size: '',
    namespace: 'confirm',
    agreeCallback: _.noop,
    rejectCallback: _.noop,
    title: '操作确认',
    noFooter: false,
    content: '确定进行当前操作？',
    btnLeftText: '确定',
    btnRightText: '取消'
  },

  _create: function () {

    var self = this;

    this.uuid = this.options.id || 'confirm-' + _.now();
    var body = [];
    var footer = '<div class="text-center">' +
      '<button type="button" class="js-confirm-agree btn btn-pink btn-linear" data-loading-text="保存中">' + this.options.btnLeftText + '</button>' +
      '<button type="button" class="js-confirm-reject btn btn-linear" data-dismiss="modal">' + this.options.btnRightText + '</button></div>';

    var data = {
      id: this.uuid,
      title: this.options.title,
      body: this.options.content,
      size: this.options.size,
      footer: this.options.noFooter ? '' : footer
    };

    if (this.options.type === 'exit') {
      body.push('<div class="m-TB-md text-center"><span class="sfa sfa-dialog-info"></span></div>');
      body.push('<div class="text-center font-md">' + this.options.content + '</div>');

      footer = '<div class="text-center">' +
        '<button type="button" class="js-confirm-agree btn btn-pink btn-linear" data-loading-text="处理中">' + this.options.btnLeftText + '</button>' +
        '<button type="button" class="js-confirm-reject btn btn-linear" data-dismiss="modal">' + this.options.btnRightText + '</button></div>';
      // body.push(footer);

      data = {
        size: 'modal-sm',
        modalClass: 'modal-notification',
        id: this.uuid,
        body: body.join(''),
        footer: footer
      };
    }

    this.$dialog = Global.ui.dialog.show(data);

    this.$dialog.on('hidden.modal', function (e) {
      $(this).remove();
      self.destroy();
    });

    this._bindEvents();
  },

  _bindEvents: function () {

    this._on({
      'click .js-confirm-agree': 'agreeConfirmHandler',
      'click .js-confirm-reject': 'rejectConfirmHandler'
    });
  },

  show: function () {
    Global.ui.dialog.show({
      id: this.uuid
    });
  },

  hide: function () {
    this.$dialog.modal('hide');
  },

  agreeConfirmHandler: function (e) {

    this.options.agreeCallback(e);

    Global.ui.dialog.hide(this.uuid);

    return false;

  },
  rejectConfirmHandler: function (e) {

    this.options.rejectCallback();

    Global.ui.dialog.hide(this.uuid);
    return false;

  }

});

module.exports = $.gl.confirm;

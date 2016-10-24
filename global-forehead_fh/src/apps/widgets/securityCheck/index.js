"use strict";

require('./index.scss');

$.widget('gl.securityCheck', {

  template: _(require('./index.html')).template(),

  options: {
    id: '',
    namespace: 'tip',
    title: '安全提示',
    hasMoneyPwd: false,
    hasBankCard: false
  },

  _create: function() {

    var self = this;

    // var footer = [];
    // footer.push('<div class="border-top p-top-md"><button class="btn btn-pink btn-linear" data-dismiss="modal">确认</button></div>');

    this.uuid = this.options.id || this.options.namespace + _.now();

    if(this.options.body) {
      this.options.body.html(body.join(''));
    } else {
      this.$dialog = Global.ui.dialog.show({
        id: this.uuid,
        title: this.options.title,
        size: 'modal-md',
        body: this.template(this.options)
        // footer: footer.join('')
      });

      this.$dialog.on('hidden.modal', function(e) {
        $(this).remove();
        self.destroy();
      });
    }

    this._bindEvents();
  },

  _bindEvents: function() {
    this._on({
      'click .js-fc-aHref': 'changeHrefHandler'
    });
  },

  changeHrefHandler: function(e) {
    if(this.$dialog) {
      this.$dialog.modal('hide');
    }
  },

  show: function() {
    Global.ui.dialog.show({
      id: this.uuid
    });
  }
});

module.exports = $.gl.securityCheck;
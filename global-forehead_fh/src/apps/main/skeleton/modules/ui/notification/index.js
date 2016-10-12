"use strict";

var NotificationModule = Base.Module.extend({

  startWithParent: false,

  prevent: false,

  show: function(content, options) {
    if (this.prevent && !options.force) {
      return;
    }

    options = _(options || {}).defaults({
      type: 'info',
      size: 'modal-sm',
      id: 'notification',
      modalClass: 'modal-notification modal-notification-tip',
      bodyClass: 'text-center font-md',
      backdrop: true,
      event: _.noop
      //btnContent: '确认'
    });

    var timer = null;

    var $dialog = Global.ui.dialog.show(_({
      id: this.options.id,
      body: content
    }).extend(options));

    timer = setTimeout(function() {
      $dialog.modal('hide');
    }, 3000);

    $dialog.on('hidden.modal', function(e) {
      if(_(options.event).isFunction()) {
        options.event();
      }
      window.clearTimeout(timer);
      $(this).remove();
    });
  },

  setPrevent: function(bool) {
    this.prevent = bool;
  }
});

module.exports = NotificationModule;

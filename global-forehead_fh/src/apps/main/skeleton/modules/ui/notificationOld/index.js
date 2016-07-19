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
      modalClass: 'modal-notification',
      event: _.noop,
      btnContent: '确认'
    });

    var body = [];

    body.push('<div class="m-TB-md text-center"><span class="sfa sfa-dialog-' + options.type + '"></span></div>');
    body.push('<div class="text-center font-md">' + content + '</div>');

    var footer;
    if (options.type === 'success') {
      footer = '<div class="m-TB-md text-center"><button type="button" class="js-pf-notification-btn btn btn-lg p-LR-lg" data-dismiss="modal">'+options.btnContent+'</button></div>';
    } else {
      footer = '<div class="m-TB-md text-center"><button type="button" class="js-pf-notification-btn btn btn-lg btn-cool p-LR-lg" data-dismiss="modal">'+options.btnContent+'</button></div>';
    }

    body.push(footer);

    var $dialog = Global.ui.dialog.show(_({
      id: this.options.id,
      body: body.join('')
    }).extend(options));

    $dialog.on('hidden.modal', function(e) {
      $(this).remove();
    });

    if(_(options.event).isFunction()) {
      $dialog.off('click.clickBtn')
        .on('click.clickBtn', '.js-pf-notification-btn', options.event);
    }
  },

  setPrevent: function(bool) {
    this.prevent = bool;
  }
});

module.exports = NotificationModule;

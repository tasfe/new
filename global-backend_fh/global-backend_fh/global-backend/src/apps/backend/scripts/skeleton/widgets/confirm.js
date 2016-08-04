define(function(require, exports, module) {

  $.widget('gl.confirm', {

    _currentSelItemMeta: {},

    options: {
      id: '',
      namespace: 'confirm',
      agreeCallback: _.noop,
      rejectCallback: _.noop,
      content: '',
      footer:''
    },

    _create: function() {

      var self = this;

      this.uuid = this.options.id || 'confirm-' + _.now();
      var footer =  '<button type="button" class="btn btn-primary confirm-agree" style="width: 100px; margin-right: 20px;">确定</button>'+
      '<button type="button" class="btn" style="width: 100px;" data-dismiss="modal">取消</button>';

      this.$dialog = Global.ui.dialog.show({
        id: this.uuid,
        title: this.options.title ||'操作确认',
        body: this.options.content || '确定进行当前操作？',
        footer: footer
      });

      this.$dialog.on('hidden.bs.modal', function (e) {
        $(this).remove();
        self.destroy();
      });

      this._bindEvents();
    },

    _bindEvents: function() {

      this._on({
        'click .confirm-agree': 'agreeConfirmHandler',
        'click .confirm-reject': 'rejectConfirmHandler'
      });
    },

    show: function() {
      Global.ui.dialog.show({
        id: this.uuid
      });
    },

    agreeConfirmHandler: function(e) {

      this.options.agreeCallback(e);

      Global.ui.dialog.hide(this.uuid);
      return false;

    },
    rejectConfirmHandler: function(e) {

      this.options.rejectCallback();

      Global.ui.dialog.hide(this.uuid);
      return false;

    }

  });

  module.exports = $.gl.confirm;

});
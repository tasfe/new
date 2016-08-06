define(function(require, exports, module) {

  ZeroClipboard.config({swfPath: 'assets/ZeroClipboard.swf'});

  $.widget('gl.textCopy', {

    options: {
      textEl: null,
      type: ''
    },

    _create: function() {

      if (!this.options.textEl) {
        this.options.textEl = this.element;
      }

      this.options.textEl = $(this.options.textEl);

      if (this.options.type == 'dblclick') {
        this._initDblClickCopy();
      } else {
        this._initCopy();
      }

    },

    _initCopy: function() {
      var self = this;
      var clip = new ZeroClipboard(this.element);

      this.element.tooltip({
        title: '复制到剪贴板'
      });

      clip.on('copy', function(event) {
        var clipboard = event.clipboardData;
        clipboard.setData('text/plain', self.options.textEl.is('input') ?  self.options.textEl.val() : self.options.textEl.text());

        self.element.data('tooltip').options.title = '完成复制!';
        self.element.tooltip('show');
        self.element.on('hide.tooltip', function() {
          self.element.data('tooltip').options.title = '复制到剪贴板';
          self.element.off('hide.tooltip');
        });
      });
    },

    _initDblClickCopy: function() {
      var self = this;
      var clip = new ZeroClipboard(this.element);

      this.element.tooltip({
        title: '单击复制'
      });

      clip.on('copy', function(event) {
        var clipboard = event.clipboardData;
        clipboard.setData('text/plain', self.options.textEl.is('input') ?  self.options.textEl.val() : self.options.textEl.text());

        self.element.data('bs.tooltip').options.title = '复制成功';
        self.element.tooltip('show');
        self.element.on('hide.bs.tooltip', function() {
          self.element.data('bs.tooltip').options.title = '单击复制';
          self.element.off('hide.bs.tooltip');
        });
      });
    }
  });

  module.exports = $.gl.qrPreview;
});
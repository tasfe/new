"use strict";

var swfUrl = require('vendor/assets/ZeroClipboard.swf');
var ZeroClipboard = require('vendor/scripts/ZeroClipboard');

ZeroClipboard.config({swfPath: swfUrl});

$.widget('gl.textCopy', {

  options: {
    textEl: null
  },

  _create: function() {

    if (!this.options.textEl) {
      this.options.textEl = this.element;
    }

    this.options.textEl = $(this.options.textEl);

    this._initCopy();
  },

  _initCopy: function() {
    var self = this;
    var clip = new ZeroClipboard(this.element);

    if(!this.options.notShowToolTip){
      this.element.tooltip({
        title: '复制到剪贴板'
      });
    }


    clip.on('copy', function(event) {
      var clipboard = event.clipboardData;
      var text = self.options.textEl.is('input') ?  self.options.textEl.val() : self.options.textEl.text();
      if(self.options.text!==undefined){
        text = self.options.text;
      }
      clipboard.setData('text/plain', text);
      if(!self.options.notShowToolTip){
        self.element.data('tooltip').options.title = '完成复制!';
        self.element.tooltip('show');
        self.element.on('hide.tooltip', function() {
          self.element.data('tooltip').options.title = '复制到剪贴板';
          self.element.off('hide.tooltip');
        });
      }
    });
  }
});

module.exports = $.gl.qrPreview;

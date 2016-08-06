define(function(require, exports, module) {

  $.widget('gl.richEditor', {

    _currentSelItemMeta: {},

    options: {
    },

    _create: function() {
      var self = this;
      //获取dom节点
      var $uploadContainer = $('<div></div>');

      this.editor = this.element.wangEditor(_(this.options).extend({
        uploadImgComponent: $uploadContainer
      }));

      $uploadContainer.imgText({
        size: 10,
        success: function(data) {
          self.editor.command(null, 'insertHTML', '<img src="' + data + '"/>');
        }
      });
    }

  });

  module.exports = $.gl.confirm;
});
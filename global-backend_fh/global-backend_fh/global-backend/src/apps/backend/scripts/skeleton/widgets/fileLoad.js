define(function(require, exports, module) {

  $.widget('gl.fileLoad', {

    template: '' +
    '<span class="btn btn-success fileinput-button">' +
    '<i class="fa fa-plus-circle"></i>' +
    '<span><%=title %></span>' +
    '<input class="js-wt-fileLoad-btn" type="file" name="files[]" multiple>' +
    '</span>' +
    '</div>',

    options: {
      title: '读取文件',
      paramName: 'txtFile',
      url: '/info/txt/dotxt.json',
      namespace: 'fileLoad',
      done: _.noop,
      fail: _.noop
    },

    _create: function() {
      if (window.File && window.FileReader) {
        //使用File API
        this.element.html(_(this.template).template()({
          title: this.options.title
        }));

        this._bindEvents();
      } else {
        //使用文件上传
        this.element.upload({
          url: this.options.url,
          process: false,
          paramName: this.options.paramName,
          title: this.options.title,
          done: this.options.done,
          fail: this.options.done
        });
      }
    },

    _bindEvents: function() {
      this._on({
        'change .js-wt-fileLoad-btn': 'fileSelectHandler'
      });
    },

    fileSelectHandler: function(e) {
      var self = this;
      var files = e.target.files;

      var file = files[0];

      var reader = new FileReader();

      reader.onloadend = function(evt) {
        if (evt.target.readyState === FileReader.DONE) { // DONE == 2
          self.options.done({
            result: 0,
            root: evt.target.result
          });
        }
      };

      var blob = file.slice(0, file.size);
      reader.readAsBinaryString(blob);

      $(e.currentTarget).replaceWith('<input class="js-wt-fileLoad-btn" type="file" name="files[]" multiple>');
    }
  });

  module.exports = $.gl.fileLoad;

});
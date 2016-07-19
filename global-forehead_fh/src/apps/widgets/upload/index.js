"use strict";

require('./index.scss');
require('./jquery.fileupload-5.42.3');

$.widget('gl.upload', {

  template: '' +
  '<span class="btn <%=btnClass %> fileinput-button box-sizing">' +
  '<span><%=title %></span>' +
  '<input class="js-wt-upload-btn" type="file" name="files[]" multiple>' +
  '</span>' +
  '<div class="js-wt-upload-progress-container progress hidden">' +
  '<div class="js-wt-upload-progress progress-bar progress-bar-success"></div>' +
  '</div>',

  options: {
    title: '上传附件',
    url: '/info/txt/dotxt.json',
    btnClass: 'btn-sun',
    namespace: 'upload',
    paramName: 'imgFile',
    process: true,
    done: _.noop,
    fail: _.noop
  },

  _create: function() {
    var self = this;

    this.element.html(_(this.template).template()({
      btnClass: this.options.btnClass,
      title: this.options.title
    }));

    var $processContainer = self.element.find('.js-wt-upload-progress-container');
    var $process = self.element.find('.js-wt-upload-progress');
    var $uploadBtn = this.element.find('.js-wt-upload-btn');

    $uploadBtn.fileupload({
      url: this.options.url,
      dataType: 'json',
      paramName: this.options.paramName
    })
      .on('fileuploadadd', function() {
        if (self.options.process) {
          $processContainer.removeClass('hidden');
        }
      })
      .on('fileuploaddone', function(e, res) {
        self.options.done(res.result);

        if (self.options.process) {
          $processContainer.addClass('hidden');
          $process.css('width', 0);
        }
      })
      .prop('disabled', !$.support.fileInput)
      .parent().addClass($.support.fileInput ? undefined : 'disabled');

    if (self.options.process) {
      $uploadBtn.fileupload()
        .on('fileuploadprogressall', function (e, res) {
          var progress = parseInt(res.loaded / res.total * 100, 10);
          $process.css('width', progress + '%');
        })
        .on('fileuploadfail', function (e, data) {
          $processContainer.addClass('hidden');
        });
    }
  }
});

module.exports = $.gl.upload;

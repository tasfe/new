define(function(require, exports, module) {

  $.widget('gl.upload', {

    template: '' +
    '<span class="btn btn-success fileinput-button">' +
    '<i class="fa fa-plus"></i>' +
    '<span><%=title %></span>' +
    '<input class="js-wt-upload-btn" type="file" name="files[]" multiple="">' +
    '</span>' +
    '<div class="js-wt-upload-progress-container progress hidden">' +
    '<div class="js-wt-upload-progress progress-bar progress-bar-success"></div>' +
    '</div>',

    options: {
      title: '上传附件',
      url: '',
      namespace: 'upload',
      paramName: 'imgFile',
      process: true,
      done: _.noop,
      fail: _.noop

    },

    _create: function() {
      var self = this;

      this.element.html(_(this.template).template()(this.options));

      var $processContainer = self.element.find('.js-wt-upload-progress-container');
      var $process = self.element.find('.js-wt-upload-progress');
      var $uploadBtn = this.element.find('.js-wt-upload-btn');
      var $uploadUrl=this.element.find('.js-wt-upload-url');

      $uploadBtn.fileupload({
        url: this.options.url,
        dataType: 'json',
        paramName: this.options.paramName,
        acceptFileTypes: this.options.acceptFileTypes,
        maxFileSize: this.options.maxFileSize,
        autoUpload:false
      })
        .on('fileuploadadd', function(e,data) {
          var uploadErrors = [];
          var acceptFileTypes = self.options.acceptFileTypes;
          if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
            uploadErrors.push('非法的文件类型！');
          }
          if(data.originalFiles[0]['size'] && data.originalFiles[0]['size'] > self.options.maxFileSize) {
            uploadErrors.push('文件太大！');
          }
          if(uploadErrors.length > 0) {
            Global.ui.notification.show(uploadErrors.join(''));
          } else {
            if (self.options.process) {
              $processContainer.removeClass('hidden');
            }
            data.submit();
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
            Global.ui.notification.show('上传失败！');
          })
      }
    }
  });

  module.exports = $.gl.upload;

});
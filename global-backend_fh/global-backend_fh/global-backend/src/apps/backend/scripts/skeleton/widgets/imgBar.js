define(function(require, exports, module) {

  require('skeleton/widgets/upload');

  $.widget('gl.imgBar', $.gl.upload, {

    template: '' +
    '<input type="hidden" name="uploadUrl" class="js-wt-upload-url">'+
    '<span class="btn btn-success fileinput-button m-right-sm">' +
    '<i class="fa fa-plus"></i>' +
    '<span><%=title %></span>' +
    '<input class="js-wt-upload-btn" type="file" name="files[]" multiple="">' +
    '</span>' +
    '<div class="js-wt-upload-progress-container progress hidden">' +
    '<div class="js-wt-upload-progress progress-bar progress-bar-success"></div>' +
    '</div>' +
    '<span class="js-wt-upload-tip tip"><%=tip %></span>' +

    '<div class="js-wt-attach gallery-list js-masonry m-top-md">' +
    '</div>',

    imgItemTpl: _('<div class="js-wt-img-item gallery-item no-rotate width-sm m-right-sm">' +
    '<div class="gallery-wrapper width-sm"><a class="js-wt-img-remove gallery-remove"><i class="fa fa-times"></i></a>' +
    '<img src="<%=url %>" class="js-wt-img-attach square-sm">' +
    '</div></div>').template(),

    options: {
      title: '上传图片',
      tip: '',
      url: '/intra/imgmng/uploadimg.json',
      namespace: 'imgBar',
      paramName: 'imgFile',
      imgList: [],
      process: true,
      size: 1,
      acceptFileTypes:/(\.|\/)(gif|jpe?g|png)$/i,
      maxFileSize: 2000000,
      success: _.noop
    },

    _create: function() {
      var self = this;
      this.options.done = function(res) {
        if(res.result===0) {
          self.generateImageArea(res.root);
          self.options.success(res.root);
          //显示图片
          if (_(self.element.find('.js-wt-img-attach') || []).size() == self.options.size) {
            self.element.find('.js-wt-upload-btn').prop('disabled', true);
            self.element.find('.js-wt-upload-tip').html('<label class="control-label">附件数量已达上限</label>');
            self.element.find('.js-wt-upload-url').val(res.root);
          }
        } else {
          Global.ui.notification.show('操作失败。');
        }
      };

      this.options.fail = function(){
        Global.ui.notification.show('操作失败。');
      };

      this._super();

      this._bindEvents();

      this.$attachContainer = this.element.find('.js-wt-attach');

      this.setImgs(this.options.imgList);
    },

    _bindEvents: function() {
      this._on({
        'click .js-wt-img-remove': 'imgRemoveHandler'
      });
    },

    //上传附件
    generateImageArea: function(url, name) {
      this.$attachContainer.append(this.imgItemTpl({
        url: url
      }));
    },

    //common APIs

    setImgs: function(imgList) {
      var self = this;

      var html = [];
      _(imgList).each(function(url) {
        html.push(self.imgItemTpl({
          url: url
        }));
      });

      this.$attachContainer.html(html.join(''));
    },

    getAll: function() {
      var urlList = [];

      this.element.find('.js-wt-img-attach').each(function(index, img) {
        urlList.push($(img).attr('src'));
      });

      return urlList;
    },

    //event handlers

    imgRemoveHandler: function(e) {
      var $target = $(e.currentTarget);
      var $img = $target.closest('.js-wt-img-item');
      $img.remove();
      if(_(this.element.find('.js-wt-img-attach')).size()<this.options.size){
        this.element.find('.js-wt-upload-btn').prop('disabled',false);
        this.element.find('.js-wt-upload-tip').html(this.options.tip);
      }
    }
  });

  module.exports = $.gl.imgBar;

});
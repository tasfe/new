define(function (require, exports, module) {

  var bankManagementAddOrEditMobileView = Base.ItemView.extend({

    template: require('text!./edit.html'),

    events: {

    },

    initialize: function () {
    },
    saveAuxiliaryRechargeInfoXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/exceptioncheck.json',
        data: data
      });
    },
    uploadImageXhr: function(data){
      return Global.sync.ajax({
        url: '',
        data: data
      });
    },

    onRender: function(){
      var self = this;
      var acctInfo = Global.memoryCache.get('acctInfo');

      if(this.options.type==='edit'){
        this.$('.js-fc-tpm-AOE-paymentId').val(this.options.paymentId);
        this.$('.js-fc-third-pm').find('option[value='+this.options.platformId+']').prop('selected',true);
        this.$('.js-fc-tpm-AOE-platformName').val(this.options.platformName);
        this.$('.js-fc-tpm-AOE-platformName').attr('readonly',true);

        this.$('.js-fc-tpm-AOE-merchantCode').val(this.options.merchantCode);
        this.$('.js-fc-tpm-AOE-publicKey').val(this.options.publicKey);
        this.$('.js-fc-tpm-AOE-privateKey').val(this.options.privateKey);
        this.$('.js-fc-tpm-AOE-payUrl').val(this.options.payUrl);
        this.$('.js-fc-tpm-AOE-notifyUrl').val(this.options.notifyUrl);
        this.$('.js-fc-tpm-AOE-remark').val(this.options.remark);
      }
      this.$('.js-fc-tpm-AOE-Upload-btn').upload({
        done: function (res) {
          //显示图片
          self.generateImageArea(res.root);
        },
        fail: function(){
          self.insertNotice( '服务器未响应，保存失败');
        }
      });

      this.$('.js-fc-arManageUpload-btn').upload({
        done: function (res) {
          //显示图片
          self.generateImageArea(res.root);
        },
        fail: function(){
          self.insertNotice( '服务器未响应，保存失败');
        }
      });

    },

    generateImageArea: function(url,name){
      this.$('.js-fc-tpm-AOE-attach-container').html($('<div class="gallery-item no-rotate width-sm m-right-sm">' +
        '<div class="gallery-wrapper width-sm"><a class="gallery-remove"><i class="fa fa-times"></i></a><img src="' +
        url+'" class="js-fc-tpm-AOE-attach square-sm">'+(name?'<div class="gallery-title">'+ name + '</div>':'')+'</div></div>'));
    },

    insertNotice: function ( html) {
      this.$('.js-fc-arManage-notice').html(this._getErrorMsg(html));
    },
    //组装错误提示框
    _getErrorMsg: function (text) {
      return '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' +
        '<i class="fa fa-times-circle m-right-xs"></i>' +
        '<strong>提示！</strong> ' + text +
        '</div>';
    }

  });

  module.exports = bankManagementAddOrEditMobileView;
});
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
      if(this.options.payType==0 || this.options.payType==1||this.options.payType==2||this.options.payType==3){
        this.$('.js-fc-tp-AOE-pm-View').html('<div class="form-group form-inline">'+
            '<label class="col-sm-3 control-label">平台名字：</label>'+
            '<div class="col-sm-9"><select class="js-fc-third-pm form-control input-sm" name="platformId" style="width: 200px;" required>'+
            '<option value="">全部</option> ' +
            '<option value="1">宝付支付</option> ' +
            '<option value="2">聚宝支付</option>' +
            '<option value="3">易宝支付</option> ' +
            '<option value="4">魔宝支付</option>' +
            '<option value="5">快汇通</option>' +
            '<option value="6">易优付</option>' +
            '<option value="7">智付</option>' +
            '<option value="8">国付宝</option>' +
            '<option value="10">盈宝</option>' +
            '<option value="11">新生</option>' +
            '<option value="12">优付</option>' +
            '<option value="13">威富通</option>' +
            '<option value="14">汇潮</option>' +
            '<option value="15">快捷通</option>' +
            '<option value="16">6付</option>' +
            '<option value="17">银盛</option>' +
            '<option value="18">易汇金</option>' +
            '</select></div></div>');
        this.$('.js-fc-tp-AOE-merchantName-View').html();
        this.$('.js-fc-tp-AOE-publicKey-View').html('<div class="form-group form-inline">'+
            '<label class="col-sm-3 control-label">公钥：</label>'+
            '<div class="col-sm-9">'+
            '<input type="text" class="js-fc-tp-AOE-publicKey form-control" data-parsley-somespecialchar data-parsley-maxlength="5000" style="width: 400px;" required>'+
            '</div> </div>');
        this.$('.js-fc-tp-AOE-pic-View').html('');
        this.$('.js-fc-tp-AOE-tip-View').html('');
      }
      if(this.options.payType==4||this.options.payType==5){
        this.$('.js-fc-tp-AOE-pm-View').html('<div class="form-group form-inline">'+
            '<label class="col-sm-3 control-label">平台名字：</label>'+
            '<div class="col-sm-9"><select class="js-fc-third-pm form-control input-sm" name="platformId" style="width: 200px;" required>'+
            '<option value="">全部</option> '+
            '<option value="9">同略云</option>' +
            '</select></div></div>');
        this.$('.js-fc-tp-AOE-merchantName-View').html('<div class="form-group form-inline"><label class="col-sm-3 control-label">商户名：</label>'+
            '<div class="col-sm-9">'+
            '<input type="text" class="js-fc-tp-AOE-merchantName form-control" data-parsley-somespecialchar data-parsley-maxlength="1000"  style="width: 200px;" required>'+
             '</div></div>');
        this.$('.js-fc-tp-AOE-publicKey-View').html('<div class="form-group form-inline"><label class="col-sm-3 control-label">上传二维码：</label>'+
            '<div class="col-sm-9"><div class="js-fc-tp-AOE-publicKey">'+
            '</div></div></div>');

        this.$('.js-fc-tp-AOE-tip-View').html('<div class="form-group form-inline"><label class="col-sm-3 control-label text-danger">注：</label>'+
        '<div class="col-sm-9"><label class="control-label">上传图片当前支持gif、jpg、png格式</label></div></div' +
            '<div class="form-group form-inline"><label class="col-sm-3 control-label text-danger"></label><div class="col-sm-9"><label class="control-label">同时只能添加一张大小不超过2M的图片。</label></div></div>');
      }
      if(this.options.type==='add'){
        this.$('.js-fc-tp-AOE-payUrl').val(this.options.payUrl);

          if(this.options.payType==4||this.options.payType==5){
              this.$('.js-fc-tp-AOE-publicKey').imgBar();
          }else{
              this.$('.js-fc-tp-AOE-publicKey').val(this.options.publicKey);
          }
      }
      if(this.options.type==='edit'){
        this.$('.js-fc-tp-AOE-paymentId').val(this.options.paymentId);
        this.$('.js-fc-third-pm').find('option[value='+this.options.platformId+']').prop('selected',true);
        this.$('.js-fc-tp-AOE-platformName').val(this.options.platformName);
        this.$('.js-fc-tp-AOE-platformName').attr('readonly',true);
        this.$('.js-fc-tp-AOE-merchantCode').val(this.options.merchantCode);
        //this.$('.js-fc-tp-AOE-publicKey').val(this.options.publicKey);
        this.$('.js-fc-tp-AOE-privateKey').val(this.options.privateKey);
        this.$('.js-fc-tp-AOE-payUrl').val(this.options.payUrl);
        this.$('.js-fc-tp-AOE-notifyUrl').val(this.options.notifyUrl);
        this.$('.js-fc-tp-AOE-remark').val(this.options.remark);
          this.$('.js-fc-tp-AOE-merchantName').val(this.options.merchantName);
          if(this.options.payType==4||this.options.payType==5){
              this.$('.js-fc-tp-AOE-publicKey').imgBar({imgList:(this.options.publicKey).split(',')});
          }else{
              this.$('.js-fc-tp-AOE-publicKey').val(this.options.publicKey);
          }

      }

      this.$('.js-fc-tp-AOE-Upload-btn').upload({
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
    //上传附件
      generateImageArea: function(url,name){
          this.$('.js-cm-attach').append($('<div class="gallery-item no-rotate width-sm m-right-sm">' +
              '<div class="gallery-wrapper width-sm"><a class="gallery-remove"><i class="fa fa-times"></i></a><img src="' +
              url+'" class="js-cm-arManage-attach square-sm">'+(name?'<div class="gallery-title">'+ name + '</div>':'')+'</div></div>'));
      },
    /*generateImageArea: function(url,name){
      this.$('.js-fc-tp-AOE-attach-container').html($('<div class="gallery-item no-rotate width-sm m-right-sm">' +
        '<div class="gallery-wrapper width-sm"><a class="gallery-remove"><i class="fa fa-times"></i></a><img src="' +
        url+'" class="js-fc-tp-AOE-attach square-sm">'+(name?'<div class="gallery-title">'+ name + '</div>':'')+'</div></div>'));
    },*/

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
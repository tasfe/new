define(function (require, exports, module) {

  var bankManagementAddOrEditView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bank-BankManagement-Recharge-AddOrEdit.html'),

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

      var options = {
        size:1,
        tip:'支持gif、jpg、png格式，大小不超过2M。'
      };
      if(this.options.type==='edit'){
        this.$('.js-fc-bmr-AOE-bankId').val(this.options.bankId);
        this.$('.js-fc-bmr-AOE-bankName').val(this.options.bankName);
        this.$('.js-fc-bmr-AOE-bankName').attr('readonly',true);

        this.$('.js-fc-bmr-AOE-bankCode').val(this.options.bankCode);
        this.$('.js-fc-bmr-AOE-url').val(this.options.url);
        _(options).extend({imgList:this.options.bankLogo.split(',')||[]});
        this.$('.js-fc-bmr-AOE-sort').val(this.options.sort);
      }
      self.$('.js-fc-bmr-AOE-Upload-btn').imgBar(options);
      //this.$('.js-fc-bmr-AOE-Upload-btn').upload({
      //  done: function (res) {
      //    //显示图片
      //    self.generateImageArea(res.root);
      //  },
      //  fail: function(){
      //    self.insertNotice( '图片添加失败');
      //  }
      //});

    },

    generateImageArea: function(url,name){
      this.$('.js-fc-bmr-AOE-attach-container').html($('<div class="gallery-item no-rotate width-sm m-right-sm">' +
        '<div class="gallery-wrapper width-sm"><a class="gallery-remove"><i class="fa fa-times"></i></a><img src="' +
        url+'" class="js-fc-bmr-AOE-attach square-sm">'+(name?'<div class="gallery-title">'+ name + '</div>':'')+'</div></div>'));
    },

    insertNotice: function ( html) {
      this.$('.js-fc-bmr-AOE-notice').html(this._getErrorMsg(html));
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

  module.exports = bankManagementAddOrEditView;
});
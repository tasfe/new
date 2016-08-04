define(function (require, exports, module) {

  var operateCheckView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/recharge-AbnormalRecharge-Manage.html'),

    events: {
      'blur .js-fc-arManageUserName': 'checkUserExistHandler'
    },

    initialize: function () {
    },
    saveAuxiliaryRechargeInfoXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/exceptioncheck.json',
        data: data
      });
    },

    checkUserExistXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/usermanager/userexist.json',
        data: data
      });
    },

    uploadImageXhr: function(data){
      return Global.sync.ajax({
        url: '',
        data: data
      });
    },

    checkUserExistHandler: function(e){
      var self = this;
      var data = {
        username:$(e.currentTarget).val()
      };
      this.checkUserExistXhr(data).fail(function(){
      }).done(function(res){
        if(res.result===0){
          self.$('.js-fc-re-am-tip').addClass('hidden');
        }else{
          self.$('.js-fc-re-am-tip').removeClass('hidden');
        }
      });

    },

    onRender: function(){
      var self = this;
      var acctInfo = Global.memoryCache.get('acctInfo');
      //var acctInfo = Global.memoryCache.get('acctInfo');
      //this.$('.js-fc-arManageUserName').val(acctInfo.username);

      self.$('.js-fc-arManageUpload-btn').imgBar({size:3,tip:'支持gif、jpg、png格式，大小不超过2M，最多可添加三条。'});
      //this.$('.js-fc-arManageUpload-btn').upload({
      //  done: function (res) {
      //    //显示图片
      //    self.generateImageArea(res.root);
      //  },
      //  fail: function(){
      //    self.insertNotice( '服务器未响应，保存失败');
      //  }
      //});

    },

    generateImageArea: function(url,name){
      this.$('.js-fc-attach').append($('<div class="gallery-item no-rotate width-sm m-right-sm">' +
        '<div class="gallery-wrapper width-sm"><a class="gallery-remove"><i class="fa fa-times"></i></a><img src="' +
        url+'" class="js-fc-arManage-attach square-sm">'+(name?'<div class="gallery-title">'+ name + '</div>':'')+'</div></div>'));
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

  module.exports = operateCheckView;
});
define(function (require, exports, module) {

  var operateCheckView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/recharge-AbnormalRecharge-Check.html'),

    events: {},

    initialize: function () {
    },
    getAbnormalRechargeManageInfoXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/rechargemanage/checkdata.json',
        data: data
      })
    },
    onRender: function(){
      var self = this;
      var data={exceptionId:this.options.exceptionId};
      this.getAbnormalRechargeManageInfoXhr(data)
        .fail(function(){
        })
        .done(function(res){
          if(res.result===0){
            _((res.root.attach).split(',')).each(function(url,index,urlArr){
              self.generateImageArea(url);
            });
            self.$('.js-fc-arCheckUserName').val(res.root.operatorName);
            self.$('.js-fc-arCheckOperateTime').val(_(res.root.createTime).toTime());
            self.$('.js-fc-arCheckRemark').val(res.root.remark);
          }else{
            this.insertNotice('处理信息获取失败'+res.msg);
          }
      });
    },
    generateImageArea: function(url,name){
      this.$('.js-fc-arCheckAttach').append($('<div class="gallery-item no-rotate width-sm m-right-sm">' +
        '<div class="gallery-wrapper width-sm"><img src="' +
        url+'" class="js-fc-arManage-attach square-sm">'+(name?'<div class="gallery-title">'+ name + '</div>':'')+'</div></div>'));
    },
    insertNotice: function ( html) {
      this.$('.js-fc-arCheck-notice').html(this._getErrorMsg(html));
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
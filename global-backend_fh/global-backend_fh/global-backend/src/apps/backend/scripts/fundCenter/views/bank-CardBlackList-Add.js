define(function (require, exports, module) {

  var AddBlackCardView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bank-CardBlackList-Add.html'),

    events: {
      'blur .js-fc-cbl-add-cardNo': 'checkBankCardExistHandler'
    },

    initialize: function () {
    },
    checkBankCardExistXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/usermanager/userexist.json',
        data: data
      });
    },
    onRender: function(){

    },
    checkBankCardExistHandler: function(e){
      var self = this;
      var data = {
        cardNo:$(e.currentTarget).val()
      };
      this.checkBankCardExistXhr(data).fail(function(){
      }).done(function(res){
        if(res.result===0){
          self.$('.js-fc-cbl-tip').addClass('hidden');
        }else{
          self.$('.js-fc-cbl-tip').removeClass('hidden');
        }
      });

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

  module.exports = AddBlackCardView;
});
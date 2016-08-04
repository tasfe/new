define(function (require, exports, module) {

  var operateCheckView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/bank-UserCardManagement-History.html'),

    events: {},

    initialize: function () {
    },
    findUserBankHistoryXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/usercardmanage/history.json',
        data: data
      });
    },
    onRender: function(){
      var $table = this.$('.js-fc-ucm-history-table');
      var self = this;
      var data={userId:this.options.userId};
      this.findUserBankHistoryXhr(data)
        .fail(function(){
        }).done(function(res){
          if(res.result===0){
            _(res.root).each(function(history){
              self.generateGridTr(history);
            });
          }else{
            this.insertNotice('处理信息获取失败'+res.msg);
          }
        });
    },
    generateGridTr: function(history){
      var tr = '<tr><td>'+history.optType+'</td><td>'+_(history.optTime).toTime()+'</td><td>'+history.bankName+'</td><td>'+history.bankBranchName+'</td><td>'+history.name+'</td><td>'+history.cardNo+'</td></tr>';
      this.$('.js-fc-ucm-history-table').append(tr);
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
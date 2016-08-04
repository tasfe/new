define(function (require, exports, module) {

  var operateCheckView = Base.ItemView.extend({

    template: require('text!fundCenter/templates/recharge-LargeRecharge-addOrEditUser.html'),

    events: {
      'blur .js-fc-largeRecharge-username': 'checkUserExistHandler'
    },

    initialize: function () {
    },
    checkUserExistXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/usermanager/userexist.json',
        data: data
      });
    },
    findLargeUserDetailXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/largeusermanage/detail.json',
        data: data
      });
    },

    getUserAddHistoryXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/largeusermanage/history.json',
        data: data
      });
    },

    onRender: function(){
      var self = this;
      var type = this.options.type;
      this.$username = this.$('.js-fc-largeRecharge-username');

      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-fc-largeUser-timeSet'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate:moment().add(1, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
        //startDate:moment()
      }).render();

      this.$('.js-fc-recharge-saveUser').data('type',type);

      if(type==='edit'){
        this.$('.js-fc-largeRecharge-userId').val(this.options.largeUserId);
        var data1 = {
          largeUserId: this.options.largeUserId
        };
        this.findLargeUserDetailXhr(data1).fail(function () {
        }).done(function (res) {
          if(res.result===0){
            //todo 设置原信息
            self.$username.val(res.root.userName);
            self.$username.prop('readonly',true);
            self.$('.js-start-time').val(_(res.root.startTime).toTime());
            self.$('.js-end-time').val(_(res.root.endTime).toTime());
            self.$('.js-fc-largeRecharge-reason').val(res.root.reason);

            var data2 = {
              username: res.root.userName
            };
            self.getUserAddHistoryXhr(data2).fail(function(){
            }).done(
              function(res){
                if(res.result===0){
                  self.showHistoryInfo(res.root);
                }else{
                  Global.ui.notification.show('数据异常。');
                }
              }
            );
          }else{
            Global.ui.notification.show('数据异常。');
          }
        });
      }
    },
    checkUserExistHandler: function(e){
      var self = this;
      var data = {
        username:$(e.currentTarget).val()
      };
      this.checkUserExistXhr(data).fail(function(){
      }).done(function(res){
        if(res.result===0){
          self.$('.js-fc-lr-tip').addClass('hidden');
        }else{
          self.$('.js-fc-lr-tip').removeClass('hidden');
        }
      });

    },

    showHistoryInfo:function(root){
      _(root.historyList).each(function(history,index,historyList){
        var html = '<p>'+_(history.createTime).toTime()+'</p>'+'&nbsp;&nbsp;&nbsp;&nbsp;'+history.createUser+'<br>'+ history.reason + '<br><br>';
        $('.js-fc-recharge-largeRechargeRecord-container').append(html);
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

  module.exports = operateCheckView;
});
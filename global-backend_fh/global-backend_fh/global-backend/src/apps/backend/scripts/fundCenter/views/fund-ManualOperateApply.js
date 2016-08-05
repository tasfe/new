define(function (require, exports, module) {

  var OperateApplyView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!fundCenter/templates/fund-ManualOperateApply.html'),

    //所有的事件绑定全部写在这！
    events: {
      //绑定用户类型被切换时触发事件
      'change .js-fc-userType': 'userTypeChangeHandler',
      //表单被提交时触发事件（无论是怎么被触发）
      'click .js-fc-fundApply-submit': 'formSubmitHandler',
      'blur .js-fc-fundApply-username': 'checkUserExistHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function () {
    },
    checkUserExistXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/usermanager/userexist.json',
        data: data
      });
    },

    saveFundApplyXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/rechargemanage/sysrecharge.json',
        data: data
      });
    },

    //在页面被渲染出来的时候自动调用
    onRender: function () {
      var self = this;
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      this.$singleUserContainer = this.$('.js-fc-singleUser-container');
      this.$multiUserContainer = this.$('.js-fc-multiUser-container');
      this.$btnSumbit = this.$('.js-ac-btn-submit');
      this.$username  = this.$('.js-fc-fundApply-username');
      this.$usernameList  = this.$('.js-fc-funcApply-usernameList');

      //文本导入
      this.$('.js-fc-fundApply-fileUpload-btn').fileLoad({
        title: '批量导入用户名',
        done: function (res) {
          //显示图片
          self.$('.js-fc-funcApply-usernameList').val(res.root);
        },
        fail: function(){
          Global.ui.notification.show('操作失败。');
        }
      });

      //图片上传
      var options = {
        size:3,
        tip:'支持gif、jpg、png格式，大小不超过2M，最多可添加三条。'
      };
      this.$imgUpload = self.$('.js-fc-fundApply-imgUpload-btn').imgBar(options);
      this.imgUpload = this.$imgUpload.imgBar('instance');
    },

    //event handlers

    //用户类型变化时触发的handler
    userTypeChangeHandler: function (e) {
      var $target = $(e.currentTarget);
      var val = $target.val();

      //隐藏/显示dom，不要使用jquery的show和hide方法，使用addClass('hidden')和removeClass('hidden');
      this.$singleUserContainer.toggleClass('hidden', val !== '0');
      this.$multiUserContainer.toggleClass('hidden', val !== '1');
      if(val==='0'){
        this.$username.prop('disabled','');
        this.$usernameList.prop('disabled','disabled');
      }else{
        this.$username.prop('disabled','disabled');
        this.$usernameList.prop('disabled',false);
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
          self.$('.js-fc-fu-ma-tip').addClass('hidden');
        }else{
          self.$('.js-fc-fu-ma-tip').removeClass('hidden');
        }
      });

    },

    //表单被提交时触发的handler
    formSubmitHandler: function (e) {
      var userType = this.$('.js-fc-userType:checked').val();

      var self = this;
      var $target = $(e.currentTarget);

      var $currContainer = this.$('.js-fc-fundApply-form');
      var clpValidate = $currContainer.parsley().validate();
      if (userType === '0') {
        if (!this.$('.js-fc-fu-ma-tip').hasClass('hidden')) {
          //window.confirm('请输入有效的用户名！');
          $(document).confirm({
            content: '请输入有效的用户名！',
            agreeCallback: function () {
            }
          });
          return false;
        }
      }
      if (clpValidate) {
        $target.button('loading');

        var username;
        if (userType === '0') {
          username = this.$('.js-fc-fundApply-username').val();
        } else {
          username = this.$('.js-fc-fundApply-usernameList').val();
        }
        var attachment = _(this.$('.js-wt-img-attach')).map(function(attach,index){
          return $(attach).attr('src');
        });

        var data = {
          username: username,
          rechargeType: this.$('.js-fc-fundApply-type').val(),
          amount: this.$('.js-fc-funcApply-amount').val(),
          reason: this.$('.js-fc-funcApply-reason').val(),
          attachment: this.imgUpload.getAll().join(',')

        };
        this.saveFundApplyXhr(data).always(function(){
          $target.button('reset');
        }).fail(function () {
        }).done(function (res) {
          if (res.result === 0) {
            Global.ui.notification.show('操作成功。');
            self.render();
          } else {
            self.insertNotice('保存资金操作申请失败，' + res.msg);
          }
        });
      }


      //setTimeout(function () {
      //  self.$btnSumbit.button('reset');
      //}, 1000);
    },

    generateImageArea: function (url, name) {
      this.$('.js-fc-fundApply-attach-container').append($('<div class="gallery-item no-rotate width-sm m-right-sm">' +
        '<div class="gallery-wrapper width-sm"><a class="gallery-remove"><i class="fa fa-times"></i></a><img src="' +
        url + '" class="js-fc-fundApply-attach square-sm">' + (name ? '<div class="gallery-title">' + name + '</div>' : '') + '</div></div>'));
    },

    insertNotice: function (html) {
      this.$('.js-fc-fundApply-notice').html(this._getErrorMsg(html));
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

  module.exports = OperateApplyView;
});
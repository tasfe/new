define(function (require, exports, module) {

    var CreateUserView = Base.ItemView.extend({

      template: require('text!authorityCenter/templates/createUser.html'),

      events: {
        'click .js-cu-btn-submit': 'newUserHandler',
        'blur .js-cu-username': 'checkUserExistHandler'
      },
      initialize: function () {
      },
      getUserGroupXhr: function (data) {
        return Global.sync.ajax({
          url: '/intra/grpmng/allgrplist.json',
          data:data
        });
      },
      checkUserExistXhr: function(data){
        return Global.sync.ajax({
          url: '/intra/sysusermng/superuserexist.json',
          data: data
        });
      },
      onRender: function () {
        var self=this;
        self.getUserGroupXhr().always(function () {
        }).fail(function () {
          // 处理失败
        }).done(function (res) {
          if (res && res.result === 0) {
            var groupData =_(res.root).map(function (group) {
                return self._groupHandler(group,'');
            });
            self.$('.js-cu-userGroup').html('<option value="">请选择</option>'+groupData.join(''));
          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
      },
      _groupHandler: function(groups, space) {
        var options = '<option value="' + groups.groupId + '">' + space + groups.groupName + '</option>';
        if(groups.groupList){
        if (groups.groupList.length > 0) {
          space += '&nbsp;&nbsp;';
          for (var i = 0; i < groups.groupList.length; i++) {
            options += this._groupHandler(groups.groupList[i], space);
          }
        }
        }

        return options;
      },
      newUserHandler: function (e) {
        var self = this;
        var $target = $(e.currentTarget);
        $target.button('loading');
        var $currContainer = this.$('.js-cc-new-user-form');
        var clpValidate = $currContainer.parsley().validate();
        if (clpValidate) {
          Global.sync.ajax({
            url: '/intra/sysusermng/usersave.json',
            data: {
              username:this.$('.js-cu-username').val(),
              password: this.$('.js-cu-repeatPassword ').val(),
              groupId:this.$('.js-cu-userGroup').val()
            }
            ,
            tradition:true
          })
              .always(function () {
                $target.button('reset');
              })
              .fail(function () {
                // 处理失败
              })
              .done(function (res) {
                if (res && res.result === 0) {
                  Global.ui.notification.show('操作成功。');
                  Global.appRouter.navigate(_('#am/cu').addHrefArgs({_t: _.now()}), {
                    trigger: true,
                    replace: false
                  });
                } else {
                  Global.ui.notification.show(res.msg!=='fail'?res.msg:'操作失败。');
                }
              });
        }else{
          $target.button('reset');
        }
      },
      checkUserExistHandler: function(e){
        var self = this;
        var data = {
          username:$(e.currentTarget).val()
        };
        if($(e.currentTarget).val()==''){
          self.$('.js-cu-tip').removeClass('hidden').html("用户名不能为空");
          return;
        }
        this.checkUserExistXhr(data).fail(function(){
        }).done(function(res){
          if(res.result===0){
            self.$('.js-cu-tip').addClass('hidden');
          }else{
            self.$('.js-cu-tip').removeClass('hidden').html(res.msg);
          }
        });

      }

    });

    module.exports = CreateUserView;
  });
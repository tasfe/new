define(function (require, exports, module) {

  var UserModifyView = Base.ItemView.extend({

    template: require('text!authorityCenter/templates/userModify.html'),

    events: {},
    initialize: function () {
    },
    getUserGroupXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/grpmng/allgrplist.json',
        data:data
      });
    },
    getUserDetailXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/sysusermng/userdetail.json',
        data:data
      });
    },
    onRender: function () {
      var self=this;
      var subGroupID;
      self.getUserDetailXhr({userId: self.options.userId}).always(function () {
      }).fail(function () {
        // 处理失败
      }).done(function (res) {
        if (res && res.result === 0) {
          self.$('.js-um-modify-username').html('<label class="control-label" >'+res.root.username+'</label>');
          subGroupID=res.root.groupId;
        } else {
          Global.ui.notification.show('数据异常。');
        }
      });

      self.getUserGroupXhr().always(function () {
      }).fail(function () {
        // 处理失败
      }).done(function (res) {
        if (res && res.result === 0) {
          var groupData =_(res.root).map(function (group) {
            return self._groupHandler(group,'');
          });
          self.$('.js-um-modify-userGroup').html(groupData.join(''));
          self.$('.js-um-modify-userGroup option[value="'+subGroupID+'"]').prop('selected',true);
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
    }

  });

  module.exports = UserModifyView;
});
//56250
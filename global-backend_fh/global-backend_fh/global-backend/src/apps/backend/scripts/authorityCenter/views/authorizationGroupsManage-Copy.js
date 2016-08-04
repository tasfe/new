define(function (require, exports, module) {

  var CopyAuthorizationGroupView = Base.ItemView.extend({

    template: require('text!authorityCenter/templates/authorizationGroupsManage-Copy.html'),

    events: {
      'click .js-ac-cg-save': 'saveGroupInfoHandler'
    }
    ,
    saveGroupXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/grpmng/grpsave.json',
        data: data,
        tradition: true
      });
    },
    getAllGroupXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/grpmng/allgrplist.json',
        data: data
      });
    },

    onRender: function () {
      var self = this;
      var copyGroupId = this.options.copyGroupId;
      var copyGroupName = this.options.copyGroupName;
      var parentGroupId = this.options.parentGroupId;
      this.$parentGroupId = this.$('.js-ac-gm-copy-parentGroupId');


      this.$('.js-ac-gm-copy-copyGroupName').html(copyGroupName);
      this.$('.js-ac-gm-copy-copyGroupId').val(copyGroupId);

      //初始化菜单组下拉框
      self.getAllGroupXhr().always(function () {
      }).fail(function () {
        // 处理失败
      }).done(function (res) {
        if (res && res.result === 0) {
          var groupData = _(res.root).map(function (group) {
            return self._groupHandler(group, '');
          });
          self.$parentGroupId.html('<option value="0">顶级组</option>' + groupData.join(''));
          self.$parentGroupId.find('option[value=' + parentGroupId + ']').prop('selected', true);
          self.$parentGroupId.prop('disabled',true);
        } else {
          Global.ui.notification.show('数据异常。');
        }

      });
    },
    _groupHandler: function (groups, space) {
      var options = '<option value="' + groups.groupId + '">' + space + groups.groupName + '</option>';
      if (groups.groupList) {
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

  module.exports = CopyAuthorizationGroupView;
});

define(function (require, exports, module) {

  var CopyAuthorizationGroupView = require('authorityCenter/views/authorizationGroupsManage-Copy');

  var AuthorizationGroupsManageView = Base.ItemView.extend({

    template: require('text!authorityCenter/templates/authorizationGroupsManage.html'),

    events: {
      'click .js-ac-gm-viewGroup': 'viewGroupHandler',
      'click .js-ac-gm-viewGroupUser': 'viewGroupUserHandler',
      'click .js-ac-gm-copyGroup': 'copyGroupHandler',
      'click .js-ac-gm-updGroup': 'updGroupHandler',
      'click .js-ac-gm-addGroup': 'addGroupHandler',
      'click .js-ac-gm-disGroup': 'disGroupHandler',
      'click .js-ac-gm-enGroup': 'enGroupHandler',
      'click .js-ac-gm-delGroup': 'delGroupHandler'
    }
    ,
    copyGroupXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/grpmng/grpcopy.json',
        data: data
      });
    },
    deleteGroupXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/grpmng/grpdelete.json',
        data: data
      });
    },
    enableGroupXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/grpmng/grpenable.json',
        data: data
      });
    },
    disableGroupXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/grpmng/grpdisable.json',
        data: data
      });
    },
    onRender: function () {

      var self = this;
      this.treetable = this.$("#treetable");
      if (self.treetable.data('ui-fancytree')) {
        self.treetable.fancytree('destroy');
      }
      this.treetable.fancytree({
        ajax: {
          type: "POST"
        },
        extensions: ["dnd", "edit", "glyph", "table"],
        checkbox: false,
        icons: false,
        dnd: {
          focusOnClick: true,
          dragStart: function (node, data) {
            return true;
          },
          dragEnter: function (node, data) {
            return true;
          },
          dragDrop: function (node, data) {
            data.otherNode.copyTo(node, data.hitMode);
          }
        },

        source: {
          url: '/intra/grpmng/grplist.json',
          dataType: 'json'
        },
        postProcess: function (e, data) {
          var res = data.response;
          data.result = self.formatData(res.root);
        },
        table: {
          //  checkboxColumnIdx: 1,
          nodeColumnIdx: 0
        },

        activate: function (event, data) {
        },
        lazyLoad: function (event, data) {
          data.result = {url: "/intra/grpmng/grplist.json", debugDelay: 1000, data: {groupId: data.node.data.groupId}};
        },
        renderColumns: function (event, data) {
          var node = data.node,
            $tdList = $(node.tr).find(">td"),
            group = node.data;
          $tdList.eq(1).text(group.creator);
          $tdList.eq(2).html(_(group.createTime).toTime());
          $tdList.eq(3).html(group.operator);
          $tdList.eq(4).html(_(group.updateTime).toTime());
          $tdList.eq(5).html(group.status === 0 ? '正常' : '<span class="text-danger">禁用</span>');
          var operateHtml = self.generateHtml(group.groupId, group.groupName, group.parentGroupId,group.status,group.userCount,group.restricted);
          $tdList.eq(6).html(operateHtml);
        }

      });

    },
    formatData: function (groupList) {
      var self = this;
      return _(groupList).map(function (group) {
        var folder = false;
        if (group.hasSubGroup) {
          folder = true;
          _(group).extend({
            lazy: true
          });
        }
        return _(group).extend({
          title: group.groupName,
          folder: folder,
          expanded: false
        });
      });
    },

    generateHtml: function (groupId, groupName, parentGroupId,status,userCount,restricted) {
      var html = [];
      var param = 'data-groupid="' + groupId + '" data-groupname="' + groupName + '" data-parentgroupid="' + parentGroupId + '" data-usercount="'+userCount+'" data-restricted="'+restricted+'"';
      if(Global.authority.am && Global.authority.am.gm && Global.authority.am.gm.viewGroup){
        html.push('<button type="button" class="js-ac-gm-viewGroup btn btn-link" ' + param + '>查看组权限</button> ');
      }
      if(Global.authority.am && Global.authority.am.gm && Global.authority.am.gm.viewUser && Global.authority.am.um && Global.authority.am.um.page){
        html.push('<button type="button" class="js-ac-gm-viewGroupUser btn btn-link" ' + param + '>查看组成员</button> ');
      }
      if(Global.authority.am && Global.authority.am.gm && Global.authority.am.gm.copyGroup){
        html.push('<button type="button" class="js-ac-gm-copyGroup btn btn-link" ' + param + '>复制组</button> ');
      }
      if(Global.authority.am && Global.authority.am.gm && Global.authority.am.gm.update){
        html.push('<button type="button" class="js-ac-gm-updGroup btn btn-link" ' + param + '>修改组</button> ');
      }
      if(Global.authority.am && Global.authority.am.gm && Global.authority.am.gm.addSub){
        html.push('<button type="button" class="js-ac-gm-addGroup btn btn-link" ' + param + '>增加子组</button> ');
      }
      if(Global.authority.am && Global.authority.am.gm && Global.authority.am.gm.disable){
        if(status===0){
          html.push('<button type="button" class="js-ac-gm-disGroup btn btn-link" ' + param + '>禁用组</button> ');
        }else{
          html.push('<button type="button" class="js-ac-gm-enGroup btn btn-link" ' + param + '>启用组</button> ');
        }
      }
      if(Global.authority.am && Global.authority.am.gm && Global.authority.am.gm.del){
        html.push('<button type="button" class="js-ac-gm-delGroup btn btn-link" ' + param + '>删除组</button> ');
      }
      return html.join('');
    },
    //组查组，跳新增页面？锁定父组与组名及点击事件与保存事件？
    viewGroupHandler: function (e) {
      var groupId = $(e.currentTarget).data('groupid');
      var parentGroupId = $(e.currentTarget).data('parentgroupid');
      var groupName = $(e.currentTarget).data('groupname');
      Global.appRouter.navigate(_('#am/gm/view').addHrefArgs({
        _t: _.now(),
        type: 'view',
        groupId: groupId,
        groupName: groupName,
        parentGroupId: parentGroupId,
        switch: $(e.currentTarget).data('restricted')
      }), {trigger: true, replace: false});

    },
    //修改组，跳新增页面？锁定"所属组"与"组名"？
    updGroupHandler: function (e) {
      var groupId = $(e.currentTarget).data('groupid');
      var parentGroupId = $(e.currentTarget).data('parentgroupid');
      var groupName = $(e.currentTarget).data('groupname');
      Global.appRouter.navigate(_('#am/gm/update').addHrefArgs({
        _t: _.now(),
        type: 'update',
        groupId: groupId,
        groupName: groupName,
        parentGroupId: parentGroupId,
        switch: $(e.currentTarget).data('restricted')
      }), {trigger: true, replace: false});
    },
    //添加子组，跳新增页面？锁定"所属组"
    addGroupHandler: function (e) {
      var groupId = $(e.currentTarget).data('groupid');
      Global.appRouter.navigate(_('#am/gm/add').addHrefArgs({
        _t: _.now(),
        type: 'addSubGroup',
        groupId: groupId,
        switch: $(e.currentTarget).data('restricted')
      }), {trigger: true, replace: false});
    },
    //进入权限组下的用户查看页面
    viewGroupUserHandler: function (e) {
      var groupId = $(e.currentTarget).data('groupid');
      Global.appRouter.navigate(_('#am/um').addHrefArgs({
        _t: _.now(),
        userGroup: groupId
      }), {trigger: true, replace: false});
    },
    //复制组，弹窗操作
    copyGroupHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      var groupId = $target.data('groupid');
      var groupName = $target.data('groupname');
      var parentGroupId = $target.data('parentgroupid');
      var $dialog = Global.ui.dialog.show(
        {
          title: '',
          body: '<div class="js-ac-gm-copy-container"></div>',
          footer: '<button class="js-ac-gm-copy-confirm btn btn-primary" type="button"  style="width: 100px; margin-right: 20px;" data-loading-text="保存中">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button>'
        }
      );

      var $copyContainer = $dialog.find('.js-ac-gm-copy-container');
      var option = {
        copyGroupId: groupId,
        copyGroupName: groupName,
        parentGroupId: parentGroupId
      };

      var copyAuthorizationGroupView = new CopyAuthorizationGroupView(option);
      $copyContainer.html(copyAuthorizationGroupView.render().el);

      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });

      $dialog.off('click.copyGroup')
        .on('click.copyGroup', '.js-ac-gm-copy-confirm', function (ev) {
          var $target2 = $(ev.currentTarget);
          $target2.button('loading');
          var clpValidate = $dialog.find('.js-ac-agm-copy-form').parsley().validate();
          if (clpValidate) {
            var groupName = $dialog.find('.js-ac-gm-copy-groupName').val();
            var copyGroupId = $dialog.find('.js-ac-gm-copy-copyGroupId').val();
            var data = {
              groupId: copyGroupId,
              groupName: groupName
            };

            self.copyGroupXhr(data).always(function(){
              $target2.button('reset');
            })
              .fail(function () {
              })
              .done(function (res) {
                if (res.result === 0) {
                  $dialog.modal('hide');
                  self.onRender();//刷新表格中的
                  Global.ui.notification.show('操作成功。');
                } else {
                  Global.ui.notification.show('操作失败。');
                }
              });
          }else{
            $target2.button('reset');
          }
        });
    },
    //禁用组，弹窗
    disGroupHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      var groupId = $target.data('groupid');
      var groupName = $target.data('groupname');
      $(document).confirm({
        content: '<div class="text-center"><span style="font-size: 16px !important;">确认禁用<strong>”'+groupName+'“</strong>吗？</span><br><span style="color: #999;">提示：禁用后该组成员均不能再操作系统</span></div>',
        agreeCallback: function () {
          self.disableGroupXhr({groupId: groupId}).fail(function () {
          }).done(function (res) {
            if (res.result === 0) {
              self.onRender();//刷新表格中的
              Global.ui.notification.show('操作成功。');
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
        }
      });
    },
    enGroupHandler: function(e){
      var self = this;
      var $target = $(e.currentTarget);
      var groupId = $target.data('groupid');
      $(document).confirm({
        content: '确认启用组？',
        agreeCallback: function () {
          self.enableGroupXhr({groupId: groupId}).fail(function () {
          }).done(function (res) {
            if (res.result === 0) {
              self.onRender();//刷新表格中的
              Global.ui.notification.show('操作成功。');
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
        }
      });
    },
    //删除组，弹窗
    delGroupHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      var groupId = $target.data('groupid');
      var groupName = $target.data('groupname');
      var userCount =  $target.data('usercount');
      var spanClass='text-danger';
      if(userCount===0){
        spanClass='hidden ';
      }
      $(document).confirm({
        content: '<div class="text-center"><span style="font-size: 16px !important;">确认删除<strong>”'+groupName+'“</strong>吗？</span><br><span style="color: #999;">提示：如果该组有成员请先移除后再操作，否则删除不成功</span></div>',

        agreeCallback: function () {
          self.deleteGroupXhr({groupId: groupId}).fail(function () {
          }).done(function (res) {
            if (res.result === 0) {
              self.onRender();//刷新表格中的
              Global.ui.notification.show('操作成功。');
            } else {
              Global.ui.notification.show('操作失败。');
            }

          });
        }
      });
    }

  });


  module.exports = AuthorizationGroupsManageView;
});
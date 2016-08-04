define(function (require, exports, module) {

  var CreateAuthorizationGroupView = Base.ItemView.extend({

    template: require('text!authorityCenter/templates/createAuthorizationGroup.html'),

    events: {
      'click .js-ac-cg-save': 'saveGroupInfoHandler',
      'change .js-ac-cg-parentGroupId': 'changeParentGroupHandler',
      'click .js-ac-cg-cancel': 'cancelHandler'

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
    getMenuByGroupIdXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/menumng/grpmenulist.json',
        data: data
      });
    },

    onRender: function () {
      var self = this;
      this.menuList = [];
      this.selectedMenuList = [];
      this.selectedNode = [];
      this.$parentGroupId = this.$('.js-ac-cg-parentGroupId');
      this.$groupName = this.$('.js-ac-new-groupName');
      this.$groupNameLan = this.$('.js-ac-cg-groupName');
      this.$tree2 = this.$("#tree2");
      this.$tree1 = this.$("#tree1");
      this.$switch = this.$('.js-ac-cag-switch');
      var groupId =  _.getUrlParam('groupId');
      var groupName = _.getUrlParam('groupName');
      if(!_(groupName).isUndefined()){
        this.$groupName.val(groupName);
      }
      this.$groupNameLan.html('<label class="control-label m-right-sm">组名称：</label><input class="js-ac-new-groupName" data-parsley-zhAndLetNumMaxLen="20" required>');
      var source ;
      if(_(groupId).isNull()){
        source = {
          url: '/intra/menumng/menulist.json'
        };
      }else{
        source ={
          url: '/intra/menumng/grpmenulist.json',
          data: {
            groupId:groupId
          }
        };
      }

      this.resetTree1(source);

      self.getAllGroupXhr().always(function () {
      }).fail(function () {
        // 处理失败
      }).done(function (res) {
        if (res && res.result === 0) {
          var groupData = _(res.root).map(function (group) {
            return self._groupHandler(group, '');
          });
          self.$parentGroupId.html('<option value="0" selected>顶级组</option>'+groupData.join(''));
          self.$parentGroupId.val();
        } else {
          Global.ui.notification.show('数据异常。');
        }
      });
    },

    //勾选左侧复选框时获取所有关联的节点
    findRelatedNode: function (selectedNode) {
      var self = this;
      var selectedMenuId = _(_(selectedNode).map(function (node) {
        return node.data;
      })).pluck('menuId');
      var menuListCopy = this.cloneObj(this.menuList);
      return self.filterMenuList4Mode2(menuListCopy, selectedMenuId);
    },
    //fancytree: selectMode:3
    filterMenuList: function (menuList, selectedMenuId) {
      var self = this;
      _(menuList).each(function (menu, index) {
        //当前节点不是选中的节点
        if (_(selectedMenuId).indexOf(menu.menuId) === -1) {
          if (_(menu.children).isEmpty()) {
            menuList = _(menuList).without(menu);
          } else {
            menu.children = self.filterMenuList(menu.children, selectedMenuId);
            if (_(menu.children).isEmpty()) {
              menuList = _(menuList).without(menu);
            }
          }
        }
        if (!_(menu.children).isEmpty()) {
          _(menu).extend({expanded: true});
        }
      });
      return menuList;
    },
    //fancytree: selectMode:2,
    filterMenuList4Mode2: function (menuList, selectedMenuId) {
      var self = this;
      _(menuList).each(function (menu, index) {
        //当前节点不是选中的节点
        if (_(selectedMenuId).indexOf(menu.menuId) === -1) {
          //当前节点未被选中，子节点一定不会被选中
          menuList = _(menuList).without(menu);
        }else{//当前节点是选中的节点，但是其子节点不一定被选中
          if (!_(menu.children).isEmpty()) {
            menu.children = self.filterMenuList4Mode2(menu.children, selectedMenuId);
          }
        }
        if (!_(menu.children).isEmpty()) {
          _(menu).extend({expanded: true});
        }
      });
      return menuList;
    },
    changeParentGroupHandler: function(e){
      var $target = $(e.currentTarget);
      var parentGroupId = $target.val();
      var source ={
        url: '/intra/menumng/grpmenulist.json',
        data: {
          groupId:$(e.currentTarget).val()
        }
      };
      if(parentGroupId==='0'){
        source = {
          url: '/intra/menumng/menulist.json'
        };
      }
      this.menuList = [];//清空基础数据
      this.selectedMenuList = [];//清空选中的数据
      this.selectedNode = [];
      if (this.$tree2.data('ui-fancytree')) {
        this.$tree2.fancytree('destroy');
      }
      this.resetTree1(source);

    },
    saveGroupInfoHandler: function (e) {
      var $target = $(e.currentTarget);
      if(_(this.selectedNode).size()===0){
        this.insertNotice('请选择需要添加的菜单。');
        return false;
      }
      $target.button('loading');
      var $form = this.$('.js-ac-cag-form');
      var clpValidate = $form.parsley().validate();
      if(!clpValidate){
        $target.button('reset');
        return false;
      }
      var selectedMenuId = _(_(this.selectedNode).map(function (node) {
        return node.data;
      })).pluck('menuId');

      var data = {
        groupName: this.$('.js-ac-new-groupName').val(),
        parentGroupId: this.$parentGroupId.val(),
        menuList: selectedMenuId,
        restricted: this.$switch.prop('checked')?this.$switch.val():'0'
      };
      this.saveGroupXhr(data).always(function(){
        $target.button('reset');
      }).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          Global.ui.notification.show('操作成功。')
        } else {
          Global.ui.notification.show('操作失败。')
        }
      });
    },
    getAllRelatedMenuId: function(menuList){
      var self = this;
      var menuIds = [];
      _(menuList).each(function(menu){
        menuIds.push(menu.menuId);
        if(!_(menu.menuList).isEmpty()){
          menuIds = _(menuIds).union(self.getAllRelatedMenuId(menu.menuList));
        }
      });
      return menuIds;
    },

    formatData: function (menuList) {
      var self = this;
      return _(menuList).map(function (menu) {
        var hasChild = false;
        var children = [];
        if (!_(menu.menuList).isEmpty()) {
          hasChild = true;
          children = self.formatData(menu.menuList);
          _(menu).extend({
            children: children
          });
        }
        return _(menu).extend({
          title: menu.menuName,
          folder: hasChild,
          expanded: false
        });
      });
    },
    resetTree1: function(source){
      var self = this;
      if (self.$tree1.data('ui-fancytree')) {
        self.$tree1.fancytree('destroy');
      }
      self.$tree1.fancytree({
        ajax: {
          type: "POST"
        },
        extensions: ["glyph"],
        checkbox: true,
        selectMode: 2,
        source:source,
        icons: false,
        postProcess: function (e, data) {
          var res = data.response;
          data.result = self.formatData(res.root);
          self.menuList = data.result;
        },
        //需要绑定选中事件
        select: function (event, data) {
          var node = data.node;
          self.setRelatedSelected(node,true);
          self.selectedNode = data.tree.getSelectedNodes();
          self.selectedMenuList = self.findRelatedNode(self.selectedNode);
          if (self.$tree2.data('ui-fancytree')) {
            self.$tree2.fancytree('destroy');
          }
          self.$tree2.fancytree({
            extensions: ["glyph"],
            checkbox: false,
            selectMode: 2,
            icons: false,
            source: self.selectedMenuList
          });
        }

      });
    },

    setRelatedSelected: function(node,flag){
      if(node.selected===true){
        if(_(node.parent).isNull()){
          return false;
        }else{
          if(!node.parent.selected){
            node.parent.setSelected(true);//在此方法中调用setSelected方法时就相当于已经发生了递归
          }
        }
      }
      if(node.selected===false){
        if(_(node.children).isUndefined()||_(node.children).isNull()){
          return false;
        }else{
          _(node.children).each(function(subNode){
            if(subNode.selected===true) {
              subNode.setSelected(false);//在此方法中调用setSelected方法时就相当于已经发生了递归
            }
          });

        }
      }
    },
    resetTree2: function(data){

    },
    cloneObj: function (obj) {
      var str, newobj = obj.constructor === Array ? [] : {};
      if (typeof obj !== 'object') {
        return;
      } else if (window.JSON) {
        str = JSON.stringify(obj), //系列化对象
          newobj = JSON.parse(str); //还原
      } else {
        for (var i in obj) {
          newobj[i] = typeof obj[i] === 'object' ?
            cloneObj(obj[i]) : obj[i];
        }
      }
      return newobj;
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
    },
    insertNotice: function ( html) {
      this.$('.js-ac-cg-notice').html(this._getErrorMsg(html));
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
    },
    cancelHandler: function(){
      this.render();
    }

  });

  module.exports = CreateAuthorizationGroupView;
});

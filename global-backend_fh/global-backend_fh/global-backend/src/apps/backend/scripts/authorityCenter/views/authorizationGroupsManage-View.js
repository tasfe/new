define(function (require, exports, module) {

    var ViewAuthorizationGroupView = Base.ItemView.extend({

        template: require('text!authorityCenter/templates/authorizationGroupsManage-View.html'),

        events: {}
        ,
        getAllGroupXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/grpmng/allgrplist.json',
                data: data
            });
        },
        getMenuByGroupIdXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/menumng/grpmenulist.json',
                data: data,
                abort: false
            });
        },

        onRender: function () {
            var self = this;
            this.improveSpeed = false;//用于控制左侧每个菜单轮流被选中时右侧菜单列表构造多次被触发显示的次数
            this.setNodeData = false;
            this.menuList = [];
            this.selectedMenuList = [];
            this.selectedNode = [];

            this.$parentGroupId = this.$('.js-ac-cg-parentGroupId');
            this.$parentGroupId.prop('disabled', true);
            this.$groupName = this.$('.js-ac-cg-groupName');
            this.$tree2 = this.$("#viewTree2");
            this.$tree1 = this.$("#viewTree1");
            this.$switch = this.$('.js-ac-vag-switch');
            this.$switch.prop('checked', _.getUrlParam('switch')==='0'?false: true);
            this.$switch.attr('disabled','disabled');
            this.groupId = _.getUrlParam('groupId');
            var groupName = _.getUrlParam('groupName');
            var parentGroupId = _.getUrlParam('parentGroupId');
            this.parentGroupId = parentGroupId;
            this.parentGroupName = '顶级组';

            this.$groupName.html('<label class="control-label m-right-sm">组名称：</label><label class="control-label m-right-sm">'+groupName+'</label>');

            //1 初始化左侧树形菜单
            var source;
            if (_(this.groupId).isNull() || parentGroupId === '0') {
                source = {
                    url: '/intra/menumng/menulist.json'
                };
            } else {
                source = {
                    url: '/intra/menumng/grpmenulist.json',
                    data: {
                        groupId: parentGroupId
                    }
                };
            }
            this.resetTree1(source);

            //2 初始化菜单组下拉框
            self.getAllGroupXhr().always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    self._getParentName(res.root);
                    self.$('.js-ac-cg-parentGroupId').html('<label class="control-label m-right-sm" style="height: 25px;width: 200px;">所属组：</label><label class="control-label m-right-sm">'+self.parentGroupName+'</label>');
                } else {
                    Global.ui.notification.show('数据异常。');
                }

            });

        },
        //3 初始化被选中的项目
        initSelectItem: function () {
            var self = this;
            var data = {
                groupId: this.groupId
            };
            this.getMenuByGroupIdXhr(data).fail(function () {
            }).done(function (res) {
                if (res.result === 0) {
                    self.improveSpeed = true;
                    self.initSelected(res.root);
                }
            });
        },
        unSelectOption: function () {
            this.$tree1.fancytree("getTree").visit(function (node) {
                $(node.span).addClass('fancytree-unselectable');
            });
        },
        initSelected: function (selectedList) {
            var self = this;
            var menuList = _(this.getAllMenuObj(selectedList)).pluck('menuId');
            var num = _(menuList).size();
            this.$tree1.fancytree("getTree").visit(function (node) {
                var menuId = node.data.menuId;
                if (_(menuList).contains(menuId)) {
                    if (num-- === 1) {
                        self.improveSpeed = false;
                    }
                    node.setSelected(true);
                }
            });
        },
        getAllMenuObj: function (menuList) {
            var self = this;
            var menuArr = [];
            _(menuList || []).each(function (menu) {
                menuArr.push(menu);
                if (!_(menu.menuList).isNull()) {
                    menuArr = _(menuArr).union(self.getAllMenuObj(menu.menuList));
                }
            });
            return menuArr;
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
            var size = _(menuList).size();
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
                } else {//当前节点是选中的节点，但是其子节点不一定被选中
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
        resetTree1: function (source) {
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
                source: source,
                icons: false,
                postProcess: function (e, data) {
                    var res = data.response;
                    data.result = self.formatData(res.root);
                    self.menuList = data.result;
                    self.initSelectItem();
                },

                //需要绑定选中事件
                select: function (event, data) {
                    if (!self.improveSpeed) {
                        var node = data.node;
                        self.setRelatedSelected(node, true);
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
                }

            });
        },
        setRelatedSelected: function (node) {
            if (node.selected === true) {
                if (_(node.parent).isNull()) {
                    return false;
                } else {
                    if (!node.parent.selected) {
                        node.parent.setSelected(true);//在此方法中调用setSelected方法时就相当于已经发生了递归
                    }
                }
            }
            if (node.selected === false) {
                if (_(node.children).isUndefined() || _(node.children).isNull()) {
                    return false;
                } else {
                    _(node.children).each(function (subNode) {
                        if (subNode.selected === true) {
                            subNode.setSelected(false);//在此方法中调用setSelected方法时就相当于已经发生了递归
                        }
                    });

                }
            }
        },
        resetTree2: function (data) {

        },
        cloneObj: function (obj) {
            var str, newobj = obj.constructor === Array ? [] : {};
            if (typeof obj !== 'object') {
                return;
            } else if (window.JSON) {
                str = JSON.stringify(obj);//系列化对象
                    newobj = JSON.parse(str); //还原
            } else {
                for (var i in obj) {
                    newobj[i] = typeof obj[i] === 'object' ?
                        cloneObj(obj[i]) : obj[i];
                }
            }
            return newobj;
        },
        _getParentName: function (groups) {
            if(this.parentGroupId==='0'){
                return ;
            }
            if(!_(groups).isArray()){
                if (this.parentGroupId === groups.groupId) {
                    this.parentGroupName = groups.groupName;
                    return true;
                } else {
                    if (groups.groupList) {
                        if (groups.groupList.length > 0) {
                            for (var j = 0; j < groups.groupList.length; j++) {
                                if (this._getParentName(groups.groupList[j])) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            }else{
                var size = _(groups).size();
                for (var i = 0; i < size; i++) {
                    var group = groups[i];
                    if (this.parentGroupId === group.groupId+'') {
                        this.parentGroupName = group.groupName;
                        return true;
                    } else {
                        if (group.groupList) {
                            if (group.groupList.length > 0) {
                                for (var j = 0; j < group.groupList.length; j++) {
                                    if (this._getParentName(group.groupList[j])) {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    return false;
                }
            }

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

    module.exports = ViewAuthorizationGroupView;
});

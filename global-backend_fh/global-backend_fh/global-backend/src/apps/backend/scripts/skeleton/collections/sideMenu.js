define(function (require, exports, module) {

  var Collection = require('skeleton/collection');
  var SideMenuModel = require('skeleton/models/sideMenu');

  var sidemenuConfig = require('skeleton/misc/sidemenuConfig');

  var SideMenuCollection = Collection.extend({

    model: SideMenuModel,

    url: '/intra/menumng/usermenulist.json',

    parse: function(res) {
      var sideMenuList;
      if (res && res.result === 0) {
        sideMenuList = res.root || [];
        sideMenuList = this.formatMenu(sideMenuList);
        this.reset(sideMenuList);
      } else {
        sideMenuList = [];
      }
      return sideMenuList;
    },

    formatMenu: function(menuList){
      var self = this;
      var menuArr = [];
      _(menuList||{}).each(function(menu){
          var newMenu = {
            comments: menu.comment,
            funcName: menu.menuName,
            funcUrllink: menu.action,
            id: menu.menuId,
            identifier: menu.identifier,
            type: menu.type
          };
          if(!_(menu.menuList).isNull()){
            var subMenuList = self.formatMenu(menu.menuList);
            _(newMenu).extend({
              subFuncList:subMenuList
            });
          }
          menuArr.push(newMenu);
      });
      return menuArr;
    },

    initialize: function() {
     // this.reset(sidemenuConfig);
    }

  });

  module.exports = SideMenuCollection;

});

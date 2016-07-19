"use strict";

var menuConfig = require('skeleton/misc/menuConfig');
var ticketConfig = require('skeleton/misc/ticketConfig');

var Model = require('skeleton/model');

var EntryModel = Model.extend({

  url: '/acct/shortcut/info.json',

  defaults: {
    functionInfo: {},
    ticketList: {}
  },

  parse: function(res) {
    if (res && res.result === 0) {
      return res.root || {
          functionId: 13,
          ticketId: [1]
        };
    }
  },

  saveSettingXhr: function(data) {
    var self = this;
    return Global.sync.ajax({
      url: '/acct/shortcut/save.json',
      data: data,
      traditional: true
    })
      .done(function(res) {
        if (res && res.result === 0) {
          self.set({
            functionId: Number(data.functionId),
            ticketId: _(data.ticketId).map(Number)
          });
        }
      });
  },

  initialize: function() {
    var self = this;
    this.on('change:ticketId', function(model, ticketIds) {
      var ticketList = [];

      _(ticketIds).each(function(id) {
        ticketList.push(self.getEntryInfo({
          id: id
        }));
      });

      this.set('ticketList', ticketList);
      this.trigger('change:entry');
    });
  },

  getEntryInfo: function(ops) {
    var find;

    if (ops.id) {
      find = ticketConfig.getComplete(ops.id);

      if (find) {
        return {
          type: 'ticket',
          initId: Number(_.uniqueId()),
          id: find.info.id,
          router: 'bc/' + find.info.id,
          name: find.info.zhName
        };
      } else {
        _(menuConfig.getAll()).each(function(menu) {
          var findMenu;
          if (!find) {
            findMenu = _(menu.sub).findWhere({
              id: ops.id
            });
            if (findMenu) {
              find = {
                menu: findMenu,
                menus: menu
              }
            }
          }
        });

        return _({}).extend(find.menu, {
          type: 'normal',
          backStyle: find.menus.backStyle,
          iconType: find.menus.iconType,
          icon: find.menus.icon
        });
      }
    } else {
      find = menuConfig.getByRouter(ops.router);
      if (find) {
        return _({}).extend(find.menu, {
          type: 'normal',
          backStyle: find.menus.backStyle,
          iconType: find.menus.iconType,
          icon: find.menus.icon
        });
      } else {
        find = ticketConfig.getComplete(Number(ops.router.match(/\d+/)[0]));

        return {
          type: 'ticket',
          initId: ops.initId,
          id: find.info.id,
          router: 'bc/' + find.info.id,
          name: find.info.zhName
        };
      }
    }
  },

  isQuick: function(router) {
    return !!_(this.get('ticketList')).findWhere({
      router: router
    });
  },

  getEntryList: function() {
    var entryList = [this.get('functionInfo')];

    entryList = this.get('ticketList');

    return entryList;
  }
});

module.exports = EntryModel;

"use strict";

require('./index.scss');

var LowMultiSelect = Base.PrefabView.extend({

  template: require('./index.html'),

  className: 'low-multi-select',

  options: {
    prevClass: 'js-pf',
    update: true,
    showUnread: false,
    showParent: true,
    selectAll: true,
    showMulti: false,
    select: true
  },

  isSearching: false,

  events: {
    'keyup .js-pf-input-search-user': 'searchHandler',
    'click .js-pf-select-superior': 'toggleSelectUserHandler',
    'click .js-pf-circle-un-select': 'unSelectUserHandler',
    'click .js-wt-title': 'toggleSelectUserHandler',
    'click .js-pf-selectAll': 'toggleSelectAllHandler'
  },

  getLowLevelXhr: function() {
    return Global.sync.ajax({
      url: '/acct/usermsg/msgstat.json',
      abort: false
    });
  },

  initialize: function() {
    this.selectedUsers = [];
  },

  serializeData: function() {
    return this.options;
  },

  onRender: function() {
    // this.$searchContainer = this.$('.js-pf-search-container');
    this.$selectContainer = this.$('.js-pf-select-container');
    this.$searchUser = this.$('.js-pf-input-search-user');
    this.$selectAll = this.$('.js-pf-selectAll');

    if (this.options.selectAll) {
      this.$selectAll.removeClass('hidden');
    }

    this._initLowLevelTree();

    return this;
  },

  getAll: function() {
    return this.selectedUsers;
  },

  _initLowLevelTree: function() {
    var self = this;

    this.treeView = this.$('.js-pf-jstree').treeView({
      select: this.options.select
      // onClick: function(e, id, data) {
      //   self.selectUser(id, data);
      // }
    }).treeView('instance');

    if (!this.options.update) {
      // this.getLowLevelXhr()
      //   .done(function(res) {
      //     var data = res.root || {};
      //     if (res && res.result === 0) {
      //       self.refresh(data);
      //     }
      //   });
      this.subscribe('message', 'message:updating', function onceSubscribe(model) {
        self.refresh(model.toJSON());

        if (self.isSearching) {
          self.$searchUser.trigger('keyup');
        }
        self.unSubscribe('message', 'message:updating', onceSubscribe);
      });
    } else {
      this.subscribe('message', 'message:updating', function(model) {
        self.refresh(model.toJSON());

        if (self.isSearching) {
          self.$searchUser.trigger('keyup');
        }
      });
    }
  },

  refresh: function(data) {
    var self = this;

    if (this.options.showParent && data.parent) {
      var parent = data.parent;
      parent.username = '我的上级';
      this.$('.js-fc-parent').removeClass('hidden');
      this.$('.js-pf-select-superior').data('data', parent);

      this.$('.js-pf-superior-unread').text(parent.newMsgNum).toggleClass('hidden', !parent.newMsgNum);
      // if (parent.online) {
      //   this.$('.online-tip').removeClass('hidden');
      // }
    }
    if(data.subList) {
      this.$('.js-pf-input-search-user').removeClass('hidden');
      this.treeView.insertNode(_(data.subList).chain().sortBy(function(sub) {
        return sub.newMsgNum ? 0 : sub.online ? 1 : 2;
      }).map(function(sub) {
        var nameHtml = ['<span class="low-multi-avatar avatar-' + sub.headId];
        var extraHtml = [];
        if (!sub.online) {
          nameHtml.push(' gray');
        }

        if (self.options.showUnread && sub.newMsgNum) {
          nameHtml.push(' flash');
        }

        if (self.options.showUnread && sub.newMsgNum !== 0) {
          extraHtml.push('<span class="spot spot-lg spot-pink">' + sub.newMsgNum + '</span>');
        }

        if (self.options.select) {
          extraHtml.push('<span class="js-pf-circle-un-select circle-un-select">X</span>');
        }

        nameHtml.push('"></span><span class="low-username ellipsis" title="' + sub.username + '">' + sub.username + '</span>');

        return {
          text: nameHtml.join(''),
          value: sub.userId,
          subItem: false,
          extra: extraHtml,
          data: sub
        };
      }).value());
    }
  },

  selectUser: function(id, data) {

    if (this.options.select) {
      var find = _(this.selectedUsers).findWhere(user);
      if (!find) {
        this.selectedUsers.push(data);
      }
    } else {
      this.selectedUsers = [data];

      this.trigger('select:change', this.selectedUsers);
    }
  },

  openByUserId: function(userId) {
    this.treeView.clickByNo(userId);
  },

  //event handlers

  searchHandler: function(e) {
    var $target = $(e.currentTarget);
    var $allSubUsers;

    var val = _($target.val()).trim();

    if (val) {
      this.isSearching = true;
      this.$selectContainer.find('.js-wt-title').addClass('hidden');
      $allSubUsers = this.$selectContainer.find('.js-wt-title').filter(function() {
        var username = $(this).data('data').username;
        return username.indexOf(val) !== -1;
      });
      $allSubUsers.removeClass('hidden');
    } else {
      this.isSearching = false;
      this.$selectContainer.find('.js-wt-title').removeClass('hidden');
    }
  },

  toggleSelectUserHandler: function(e) {
    var $target = $(e.currentTarget);

    var data = $target.data('data');
    if (this.options.select) {
      if (!$target.hasClass('selected')) {
        $target.addClass('selected');

        var find = _(this.selectedUsers).findWhere({
          userId: data.userId
        });
        if (!find) {
          this.selectedUsers.push(data);
        }
        // $('.js-pf-selectAll-input').prop('checked', false);

        // this.selectedUsers = _(this.selectedUsers).without(_(this.selectedUsers).findWhere({
        //   userId: $target.data('data').userId
        // }));
      }
    } else {
      this.selectedUsers = [data];
    }

    this.trigger('select:change', this.selectedUsers);
  },

  unSelectUserHandler: function(e) {
    var $target = $(e.currentTarget);
    var $a = $target.closest('.js-wt-title');

    $a.removeClass('selected');

    this.selectedUsers = _(this.selectedUsers).without(_(this.selectedUsers).findWhere({
      userId: $a.data('data').userId
    }));

    this.trigger('select:change', this.selectedUsers);

    return false;
  },

  toggleSelectAllHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $tree = this.$('.js-pf-jstree');

    if ($target.find('.js-pf-selectAll-input:checked').length) {

      _($tree.find('.js-wt-title')).each(function(user) {
        $(user).removeClass('selected');
        self.selectedUsers = [];
      });
      $target.find('.js-pf-selectAll-input').prop('checked', false);

    } else {
      _($tree.find('.js-wt-title')).each(function(user) {
        $(user).addClass('selected');
        self.selectUser($(user).data('no'), $(user).data('data'));
      });

      $target.find('.js-pf-selectAll-input').prop('checked', true);
    }

    this.trigger('select:change', this.selectedUsers);
    return false;
  }
});

module.exports = LowMultiSelect;

"use strict";

require('./index.scss');

var LowMultiSelect = Base.PrefabView.extend({

  template: require('./index.html'),

  className: 'low-multi-select',

  options: {
    prevClass: 'js-pf',
    useMediator: true,
    showUnread: false,
    selectAll: true,
    select: true
  },

  events: {
    'keyup .js-pf-input-search-user': 'searchHandler',
    // 'click .js-pf-select-search-user': 'toggleSelectUserHandler',
    'click .js-wt-title': 'toggleSelectUserHandler',
    'click .js-pf-selectAll': 'toggleSelectAllHandler'
  },

  getSearchXhr: function(data) {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getsubacctnamebyname.json',
      data: data
    });
  },

  getLowLevelXhr: function() {
    return Global.sync.ajax({
      url: '/acct/usermsg/msgstat.json',
      abort: false
    });
  },

  // getLowLevelByIdXhr: function(data) {
  //   return Global.sync.ajax({
  //     url: '/acct/subacctinfo/getsubacctnamebyid.json',
  //     data: data
  //   });
  // },

  initialize: function() {
    this.selectedUsers = [];
  },

  onRender: function() {
    this.$searchContainer = this.$('.js-pf-search-container');
    this.$selectContainer = this.$('.js-pf-select-container');
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
      onClick: function(e, id, data) {
        self.selectUser(id, data);
      }
    }).treeView('instance');

    if (!this.options.useMediator) {
      this.getLowLevelXhr()
        .done(function(res) {
          var data = res.root || {};
          if (res && res.result === 0) {
            self.refresh(data);
          }
        });
    } else {
      this.subscribe('message', 'message:updating', function(model) {
        self.refresh(model.toJSON());
      });
    }
  },

  refresh: function(data) {
    var self = this;

    if (data.parent) {
      var parent = data.parent;
      this.$('.js-fc-parent').removeClass('hidden');
      this.$('.js-pf-select-superior').data('no', parent.userId);
      this.$('input[name=parentId]').val(parent.userId);

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
        if (!sub.online) {
          nameHtml.push(' gray');
        }

        if (sub.newMsgNum) {
          nameHtml.push(' flash');
        }

        nameHtml.push('"></span><span class="low-username ellipsis" title="' + sub.username + '">' + sub.username + '</span>');

        return {
          text: nameHtml.join(''),
          value: sub.userId,
          subItem: false,
          extra: (self.options.showUnread && sub.newMsgNum !== 0) ? '<span class="spot spot-lg spot-pink">' + sub.newMsgNum + '</span>' : '',
          data: sub
        };
      }).value());
      this.renderSelectedUsers();
    }
  },

  selectUser: function(id, data) {

    if (this.options.select) {
      var find = _(this.selectedUsers).findWhere(user);
      if (!find) {
        this.selectedUsers.push(data);
        if (!treeview) {
          this.renderSelectedUsers();
        }
      }
    } else {
      this.selectedUsers = [data];

      this.trigger('select:change', this.selectedUsers);
    }
  },

  renderSelectedUsers: function() {
    var $tree = this.$('.js-pf-jstree');

    if(_(this.selectedUsers).size() > 0 && this.options.select) {
      _(this.selectedUsers).each(function(user) {
        $tree.find('a[data-no='+ user.id + '] .js-wt-title').addClass('selected-user');
      });
    } else {
      $tree.find('.js-wt-title').removeClass('selected-user');
    }
  },

  //event handlers

  searchHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

    var val = _($target.val()).trim();

    if (val) {
      this.$searchContainer.removeClass('hidden');
      this.$selectContainer.addClass('hidden');

      this.getSearchXhr({
        subAcctName: val
      })
        .done(function(res) {
          var data = res.root || [];
          if (res && res.result === 0) {
            if (_(data).isEmpty()) {
              self.$searchContainer.html('没有匹配用户');
            } else {
              self.$searchContainer.html('<a href="javascript:void(0);" ' +
                'data-no="' + data.subAcctId + '" data-name="' + data.subAcctName + '">' +
                '<span class="js-wt-title">' + data.subAcctName + '</span></a>');
            }
          } else {
            self.$searchContainer.html('没有匹配用户');
          }
        });
    } else {
      this.$searchContainer.addClass('hidden');
      this.$selectContainer.removeClass('hidden');
    }
    this.selectedUsers = [];
    $('.js-pf-selectAll-input').prop('checked', false);
    this.renderSelectedUsers();
  },

  // toggleSelectUserHandler: function(e) {
  //   var $target = $(e.currentTarget);
  //
  //   if (this.options.select) {
  //     if ($target.hasClass('selected-user')) {
  //
  //       $target.removeClass('selected-user');
  //       $('.js-pf-selectAll-input').prop('checked', false);
  //       this.selectedUsers = _(this.selectedUsers).without(_(this.selectedUsers).findWhere({
  //         id: $target.closest('a').data('no')
  //       }));
  //     } else {
  //       $target.addClass('selected-user');
  //     }
  //   } else {
  //     var data = $target.closest('a').data();
  //     this.selectedUsers = [{
  //       name: data.name || data.data.name,
  //       id: data.no
  //     }];
  //   }
  //
  //   this.trigger('select:change', this.selectedUsers);
  // },

  toggleSelectAllHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $tree = this.$('.js-pf-jstree');

    if ($target.find('.js-pf-selectAll-input:checked').length) {

      _($tree.find('.js-wt-title')).each(function(user) {
        $(user).removeClass('selected-user');
        self.selectedUsers = [];
      });
      $target.find('.js-pf-selectAll-input').prop('checked', false);

    } else {
      _($tree.find('.js-wt-title')).each(function(user) {
        $(user).addClass('selected-user');
        self.selectUser($(user).closest('a').data('no'), $(user).data('data'));
      });

      $target.find('.js-pf-selectAll-input').prop('checked', true);
    }

    this.trigger('select:change', this.selectedUsers);
    return false;
  }
});

module.exports = LowMultiSelect;

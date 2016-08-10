"use strict";

require('./index.scss');

var LowMultiSelect = Base.PrefabView.extend({

  template: require('./index.html'),

  className: 'low-multi-select',

  options: {
    prevClass: 'js-pf'
  },

  events: {
    'keyup .js-pf-input-search-user': 'searchHandler',
    'click .js-pf-select-search-user': 'selectUserHandler',
    'click .js-pf-selected-user': 'cancelSelectHandler'
  },

  getSearchXhr: function(data) {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getsubacctnamebyname.json',
      data: data
    });
  },

  getLowLevelXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getuserrelation.json',
      abort: false
    });
  },

  getLowLevelByIdXhr: function(data) {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getsubacctnamebyid.json',
      data: data
    });
  },

  initialize: function() {
    this.selectedUsers = [];
  },

  onRender: function() {
    this.$selectedContainer = this.$('.js-selected-container');
    this.$searchContainer = this.$('.js-pf-search-container');
    this.$selectContainer = this.$('.js-pf-select-container');

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
        self.selectUser(id, data.text);
      },
      onCollapsed: function(e, id, data, collapsed) {
        if (!collapsed) {
          self.renderLowLevel(e, id);
        }
      }
    }).treeView('instance');

    this.getLowLevelXhr()
        .done(function(res) {
          var data = res.root || {};
          if (res && res.result === 0) {
            if(res.root.pStatus === 0) {
              if (data.parentId) {
                self.$('.js-fc-parent').removeClass('hidden');
                self.$('.js-pf-select-superior').data('id',data.parentId);
                self.$('input[name=parentId]').val(data.parentId);
              }
            }
            if(res.root.sStatus === 0){
              self.$('.js-pf-input-search-user').removeClass('hidden');
              self.treeView.insertNode(_(data.subNameList).map(function (sub) {
                return {
                  text: sub.subAcctName,
                  value: sub.subAcctId,
                  subItem: false
                  //text: sub.subAcctName+ ((sub.subNo !== 0)? ('('+sub.subNo+')') :''),
                  //value: sub.subAcctId,
                  //subItem: sub.subNo !== 0
                };
              }));
            }
          }
        });
  },

  renderLowLevel: function(e, parentId) {
    var self = this;

    this.getLowLevelByIdXhr({
          subAcctId: parentId
        })
        .done(function(res) {
          var data = res.root || {};
          if (res && res.result === 0) {
            self.treeView.insertNode(_(data).map(function(sub) {
              return {
                text: sub.subAcctName+ ((sub.subNo !== 0)? ('('+sub.subNo+')') :''),
                value: sub.subAcctId,
                subItem: sub.subNo !== 0
              };
            }), e.currentTarget);
          }
        });
  },

  selectUser: function(id, name) {
    var user = {
      id: id,
      name: name
    };

    var find = _(this.selectedUsers).findWhere(user);
    if (!find) {
      this.selectedUsers.push(user);

      this.renderSelectedUsers();
    }
  },

  renderSelectedUsers: function() {
    if(_(this.selectedUsers).size()<1){
      this.$('.js-lms-empty-container').removeClass('hidden');
      this.$selectedContainer.html('');
    }else{
      this.$('.js-lms-empty-container').addClass('hidden');
      this.$selectedContainer.html(_(this.selectedUsers).map(function(user) {
        return '<li class="js-pf-selected-user cursor-pointer text-pleasant m-left-sm" data-id="' + user.id + '">' + user.name + '</li>';
      }));
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
                self.$searchContainer.html('<p class="js-pf-select-search-user cursor-pointer" ' +
                    'data-id="' + data.subAcctId + '" data-name="' + data.subAcctName + '">' + data.subAcctName + '</p>');
                //self.$searchContainer.html(_(data).map(function(info) {
                //  return '<p class="js-pf-select-search-user pointer" ' +
                //    'data-id="' + info.subAcctId + '" data-name="' + info.subAcctName + '">' + info.subAcctName + '</p>';
                //}));
              }
            } else {
              self.$searchContainer.html('没有匹配用户');
            }
          });
    } else {
      this.$searchContainer.addClass('hidden');
      this.$selectContainer.removeClass('hidden');
    }
  },

  selectUserHandler: function(e) {
    var $target = $(e.currentTarget);
    this.selectUser($target.data('id'), $target.data('name'));
  },

  cancelSelectHandler: function(e) {
    var $target = $(e.currentTarget);

    this.selectedUsers = _(this.selectedUsers).without(_(this.selectedUsers).findWhere({
      id: $target.data('id')
    }));

    this.renderSelectedUsers();
  }
});

module.exports = LowMultiSelect;

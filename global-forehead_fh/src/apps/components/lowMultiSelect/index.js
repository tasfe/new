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
    'click .js-pf-select-superior-close': 'selectUserHandlerClose',
    'click .js-pf-selected-user': 'selectedUsersMessage',
    'click .js-pf-close-user': 'cancelSelectHandler',
    'click .js-subordinate': 'subordinate'
  },

  selectedUsersMessage: function (e) {
    var self = this;
    var $target = $(e.currentTarget);

    sessionStorage.setItem('selectUserId', $target.parent().data('id'));
    $('.js-single-to-user').change();
  },

  subordinate: function () {
    var obj = $('.julien-user-list ul li a');
    var num = this.selectedUsers.length;
    sessionStorage.setItem('selectUserId', -1);

    $('.js-pf-select-superior b').addClass('hidden');

    if ($('.js-pf-select-superior').hasClass('pf-select-superior-sd')) {
      num--;
    }

    if (num == obj.length) {
      if ($('.js-pf-select-superior').hasClass('pf-select-superior-sd')) {
        this.selectedUsers = _.filter(this.selectedUsers, function(obj){ return obj.id == $('.js-pf-select-superior').data('id'); });
      }
      else{
        this.selectedUsers = [];
        $('.julien-low-multi-selected2 h3').removeClass('hidden');
      }
      $('.low-multi-select .subordinate').removeClass('subordinate-sd');
      $('.js-pf-jstree ul li a').removeClass('sd');
      $('.js-wt-title-close').addClass('hidden');
    }
    else{
      if ($('.js-pf-select-superior').hasClass('pf-select-superior-sd')) {
        this.selectedUsers = _.filter(this.selectedUsers, function(obj){ return obj.id == $('.js-pf-select-superior').data('id'); });
      }
      else{
        this.selectedUsers = [];
      }

      for (var i = 0; i < obj.length; i++) {
        this.selectedUsers.push({
          id: obj.eq(i).data('no'),
          name: obj.eq(i).data('data').text
        })
      }
      $('.julien-low-multi-selected2 h3').addClass('hidden');
      $('.low-multi-select .subordinate').addClass('subordinate-sd');
      $('.js-wt-title').addClass('sd');
      $('.js-wt-title-close').removeClass('hidden');
    }

    this.renderSelectedUsers();
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

    this._initLowLevelTree();

    return this;
  },

  getAll: function() {
    return this.selectedUsers;
  },

  _initLowLevelTree: function() {
    var self = this;

    this.treeView2 = this.$('.js-pf-jstree').treeView2({
      onClick: function(e, id, data,iIs) {
        if(iIs == 1){
          $('.low-multi-select .subordinate').addClass('subordinate-sd');
          self.selectUser(id, data.text);
        }
        else{
          sessionStorage.setItem('selectUserId', id );
          $('.js-single-to-user').change();
        }
      },
      onClick2: function(e, id, data) {
        $('.low-multi-select .subordinate').removeClass('subordinate-sd');
        self.deleteUser(id, data.text);
      },
      onCollapsed: function(e, id, data, collapsed) {
        if (!collapsed) {
          self.renderLowLevel(e, id);
        }
      }
    }).treeView2('instance');

    this.getLowLevelXhr()
    .always(function() {
      $('.js-julien-loading').addClass('hidden');
      $('.js-julien-loading').addClass('julien-loading-content');
    })
    .done(function(res) {
      var data = res.root || {};
      if (res && res.result === 0) {
        if(res.root.parent != null) {
          self.$('.js-fc-parent').removeClass('hidden');
          self.$('.js-pf-select-superior').attr('data-id',data.parent.userId);
          self.$('.js-pf-select-superior').attr('data-headid',data.parent.headId);
          self.$('input[name=parentId]').val(data.parent.userId);

          if (data.parent.newMsgNum == 0) {
            self.$('.js-pf-select-superior big').addClass('hidden');
          }
          if (data.parent != null) {
            self.$('.js-pf-select-superior big').text(data.parent.newMsgNum);
          }
        }

        if(res.root.subList != null){
          self.$('.js-pf-input-search-user').removeClass('hidden');
          self.treeView2.insertNode(_(data.subList).map(function (sub) {
            return {
              text: sub.username,
              value: sub.userId,
              subItem: false,
              online: sub.online,
              headId: sub.headId,
              newMsgNum: sub.newMsgNum
            };
          }));
        }
      }

      if ($('.js-selected-container li').length == 1) {
        var id = $('.js-selected-container li').eq(0).data('id');

        for (var i = $('.js-wt-title').length - 1; i >= 0; i--) {
          if ($('.js-wt-title').eq(i).data('no') == id) {
            $('.js-wt-title').eq(i).addClass('sd');
            $('.js-wt-title-close').eq(i).removeClass('hidden');
          }
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
        self.treeView2.insertNode(_(data).map(function(sub) {
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
    $('.julien-low-multi-selected2 h3').addClass('hidden');
    var user = {
      id: id,
      name: name
    };

    sessionStorage.setItem('selectUserId', id);

    var find = _(this.selectedUsers).findWhere(user);
    if (!find) {
      this.selectedUsers.push(user);

      this.renderSelectedUsers();
    }

  },

  deleteUser: function(id, name) {
    var user = {
      id: id,
      name: name
    };

    if ( sessionStorage.getItem('selectUserId') ==  id) {
      sessionStorage.setItem('selectUserId', 0);
    }

    var find = _(this.selectedUsers).findWhere(user);
    if (find) {
      var num =_.findIndex(this.selectedUsers, user);
      this.selectedUsers.splice(num,1);
      if (this.selectedUsers.length == 0) {
        $('.julien-low-multi-selected2 h3').removeClass('hidden');
        $('.low-multi-select .subordinate').removeClass('subordinate-sd');
      }
      this.renderSelectedUsers();
    }
  },

  renderSelectedUsers: function() {

    if(_(this.selectedUsers).size()<1){
      this.$selectedContainer.html('');
    }else{
      this.$selectedContainer.html(_(this.selectedUsers).map(function(user) {
        return '<li data-id="' + user.id + '"><b></b><span class="js-pf-selected-user" >' + user.name + '</span><i class="js-pf-close-user fa fa-remove" ></i></li>';
      }));
    }

    $('.js-single-to-user').change();
  },

  //event handlers
  searchHandler: function(e) {
   
    var self = this;
    var $target = $(e.currentTarget);
    var val = _($target.val()).trim();

    var obj = $('.julien-user-list ul li span');
    if (obj.length != 0) {
      var myReg = new RegExp(val)
      $('.julien-user-list ul li').addClass('hidden');

      for (var i = 0; i < obj.length; i++) {
        if (myReg.test(obj.eq(i).text())) {
          $('.julien-user-list ul li').eq(i).removeClass('hidden');
        }
      }
    }
    else{
      $('.julien-user-list ul li').removeClass('hidden');
    }
  },

  selectUserHandler: function(e) {
    var $target = $(e.currentTarget);

    $('.js-pf-select-superior big').addClass('hidden');
    $('.js-info-window').fadeIn("slow");
    $('.js-selected-container').fadeIn("slow");
    
    if ($target.parent().hasClass('pf-select-superior-sd')) {
      sessionStorage.setItem('selectUserId', $target.parent().data('id') );
      $('.js-single-to-user').change();
    }
    else{
      $target.parent().addClass('pf-select-superior-sd');
      this.selectUser($target.parent().data('id'), $target.parent().data('name'));
    }
  },

  selectUserHandlerClose: function(e) {
    var $target = $(e.currentTarget);
    
    if ($target.parent().hasClass('pf-select-superior-sd')) {
      $target.parent().removeClass('pf-select-superior-sd');
      this.deleteUser($target.parent().data('id'), $target.parent().data('name'));
    }
  },

  cancelSelectHandler: function(e) {
    var $target = $(e.currentTarget);

    if ( $target.parent().data('id') == $('.js-selected-container .sd').data('id') ) {
      sessionStorage.setItem('selectUserId',0);
    }

    this.selectedUsers = _(this.selectedUsers).without(_(this.selectedUsers).findWhere({
      id: $target.parent().data('id')
    }));

    this.renderSelectedUsers();

    if ($target.parent().children('span').text() == '我的上级') {
      $('.js-pf-select-superior').removeClass('pf-select-superior-sd');
    }
    else{
      var obj = $('.js-pf-jstree ul li a');
      for (var i = 0; i < obj.length; i++) {
        if ($target.parent().data('id') == $('.js-pf-jstree ul li a').eq(i).data('no')) {
          $('.js-wt-title').eq(i).removeClass('sd');
          $('.js-wt-title-close').eq(i).addClass('hidden');
        }
      }

      if ($('.js-wt-title sd').length == 0) {
        $('.js-subordinate').removeClass('subordinate-sd');
      }
    }
  }
});

module.exports = LowMultiSelect;

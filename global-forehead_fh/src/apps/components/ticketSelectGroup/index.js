"use strict";

var TicketSelectGroup = Base.PrefabView.extend({

  options: {
    prevClass: 'js-pf',
    listClass: 'js-pf-select-ticket-list',
    levelClass: 'js-pf-select-ticket-level',
    groupClass: 'js-pf-select-ticket-group',
    playClass: 'js-pf-select-ticket-play',
    defaultList: {
      list: {
        label: '所有彩种',
        value: ''
      },
      level: {
        label: '所有玩法群',
        value: ''
      },
      group: {
        label: '所有玩法组',
        value: ''
      },
      play: {
        label: '所有玩法',
        value: ''
      }
    }
  },

  events: function() {
    var events = {};

    events['change .' + this.options.listClass] = 'listChangeHandler';
    events['change .' + this.options.levelClass] = 'levelChangeHandler';
    events['change .' + this.options.groupClass] = 'groupChangeHandler';

    return events;
  },

  initialize: function() {
    //this.on('ticketList:init', this.ticketListChange);
    this.on('list:change', this.listChange);
    this.on('level:change', this.levelChange);
    this.on('group:change', this.groupChange);

    this._initList();
  },

  //获取所有彩种
  _initListXhr: function() {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketlist.json'
    });
  },

  //获取玩法群
  _initLevelXhr: function(data) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketlevel.json',
      data: data
    });
  },

  //获取玩法组
  _initGroupXhr: function(data) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketgroup.json',
      data: data
    });
  },

  //获取玩法
  _initPlayXhr: function(data) {
    return Global.sync.ajax({
      url: '/ticket/ticketmod/ticketplay.json',
      data: data
    });
  },

  _initList: function() {
    var self = this;

    var html = ['<option value="' + this.options.defaultList.list.value + '">' + this.options.defaultList.list.label + '</option>'];

    this._initListXhr()
      .done(function(res) {
        if (res && res.result === 0) {
          self.$('.' + self.options.listClass).html(_(res.root).reduce(function(html, ticket) {
            html.push('<option value="' + ticket.ticketId + '">' + ticket.ticketName + '</option>');
            return html;
          }, html));
        }
        //self.trigger('ticketList:init', 0);
      });

    this.$('.' + self.options.listClass).html(html.join(''));

    this.$('.' + self.options.levelClass).html('<option value="' + this.options.defaultList.level.value + '">' + this.options.defaultList.level.label + '</option>');
    this.$('.' + self.options.groupClass).html('<option value="' + this.options.defaultList.group.value + '">' + this.options.defaultList.group.label + '</option>');
    this.$('.' + self.options.playClass).html('<option value="' + this.options.defaultList.play.value + '">' + this.options.defaultList.play.label + '</option>');
  },

  _initLevel: function(ticketId) {
    var self = this;

    ticketId = Number(ticketId);
    var html = ['<option value="' + this.options.defaultList.level.value + '">' + this.options.defaultList.level.label + '</option>'];

    this.trigger('level:change');

    if (!_(ticketId).isNaN()) {
      this._initLevelXhr({
        ticketId: ticketId
      })
        .done(function(res) {
          if (res && res.result === 0) {
            self.$('.' + self.options.levelClass).html(_(res.root).reduce(function(html, ticket) {
              html.push('<option value="' + ticket.ticketLevelId + '">' + ticket.ticketLevelName + '</option>');
              return html;
            }, html).join(''));
          }
        });
    }

    this.$('.' + self.options.levelClass).html(html.join(''));
  },

  _initGroup: function(ticketLevelId) {
    var self = this;

    ticketLevelId = Number(ticketLevelId);

    var html = ['<option value="' + this.options.defaultList.group.value + '">' + this.options.defaultList.group.label + '</option>'];

    this.trigger('group:change');

    if (!_(ticketLevelId).isNaN()) {
      this._initGroupXhr({
        ticketLevelId: ticketLevelId
      })
        .done(function(res) {
          if (res && res.result === 0) {
            self.$('.' + self.options.groupClass).html(_(res.root).reduce(function(html, ticket) {
              html.push('<option value="' + ticket.ticketGroupId + '">' + ticket.ticketGroupName + '</option>');
              return html;
            }, html).join(''));
          }
        });
    }

    this.$('.' + self.options.groupClass).html(html.join(''));
  },

  _initPlay: function(ticketGroupId) {
    var self = this;

    ticketGroupId = Number(ticketGroupId);

    var html = ['<option value="' + this.options.defaultList.play.value + '">' + this.options.defaultList.play.label + '</option>'];

    if (!_(ticketGroupId).isNaN()) {
      this._initPlayXhr({
        ticketGroupId: ticketGroupId
      })
        .done(function(res) {
          if (res && res.result === 0) {
            self.$('.' + self.options.playClass).html(_(res.root).reduce(function(html, ticket) {
              html.push('<option value="' + ticket.ticketPlayId + '">' + ticket.ticketPlayName + '</option>');
              return html;
            }, html).join(''));
          }
        });
    }

    this.$('.' + self.options.playClass).html(html.join(''));
  },

  listChange: function(ticketId) {
    this._initLevel(ticketId);
  },

  levelChange: function(ticketLevelId) {
    this._initGroup(ticketLevelId);
  },

  groupChange: function(ticketGroupId) {
    this._initPlay(ticketGroupId);
  },

  listChangeHandler: function(e) {
    var $target = $(e.currentTarget);

    if (this.$el.find('.' + this.options.levelClass).length) {
      this.trigger('list:change', $target.val());
    }
  },

  levelChangeHandler: function(e) {
    var $target = $(e.currentTarget);

    if (this.$el.find('.' + this.options.groupClass).length) {
      this.trigger('level:change', $target.val());
    }
  },

  groupChangeHandler: function(e) {
    var $target = $(e.currentTarget);

    if (this.$el.find('.' + this.options.playClass).length) {
      this.trigger('group:change', $target.val());
    }
  }
});

module.exports = TicketSelectGroup;

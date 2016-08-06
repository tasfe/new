define(function(require, exports, module) {

  Base.Prefab.Chat = Base.PrefabView.extend({
    template: require('text!prefab/templates/chat.html'),

    className: 'chat',

    tagName: 'ul',

    options: {
      prevClass: 'js-pf'
    },

    initialize: function() {

    },

    render: function(chatData) {
      this.$el.html(_(this.template).template()({
        chatData: chatData
      }));

      return this;
    },

    add: function(chatInfo) {
      this.$el.append(_(this.template).template()({
        chatData: [chatInfo]
      }));

      return this;
    },

    empty: function() {
      return this.$el.empty();
    },

    height: function() {
      return this.$el.height();
    }
  });
});
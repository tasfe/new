"use strict";

require('./index.scss');

var menuConfig = require('skeleton/misc/menuConfig');
var ticketConfig = require('skeleton/misc/ticketConfig');

var EntrySettingView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-gl-function': 'functionChangeHandler'
  },

  serializeData: function() {
    return {
      menuList: menuConfig.getAll(),
      ticketList: ticketConfig.getCompleteAll(),
      functionId: this.options.functionId,
      ticketId: this.options.ticketId
    };
  },

  onRender: function() {
    this.$form = this.$el.find('.js-gl-setting-main');
    this.$function = this.$('.js-gl-function');

    this._checkChecked();
  },

  getSelected: function() {
    return {
      ticketId: _(this.$('.js-gl-function:checked')).map(function(checkbox) {
        return Number($(checkbox).val());
      }),
      functionId: ''
    };
  },

  _checkChecked: function() {
    var $checked = this.$function.filter(':checked');
    $checked.prop('disabled', $checked.length <= 1);
    this.$function.not(':checked').prop('disabled', $checked.length >= 4);
  },

  //event handlers

  functionChangeHandler: function(e) {
    this._checkChecked();
  }
});

module.exports = EntrySettingView;

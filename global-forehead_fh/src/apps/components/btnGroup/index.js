/**
 * 选择按钮Prefab
 */

"use strict";

var BtnGroup = Base.PrefabView.extend({

  template: require('./index.html'),

  className: 'btn-group',

  events: function() {
    var events = {};

    events['click .' + this.options.prevClass + '-btn-group'] = 'btnClickHandler';

    return events;
  },

  initialize: function() {
    _.defaults(this.options, {
      inputName: 'dateOffset',
      btnStyle: 'btn-silent btn-xs',
      btnGroup: [
        {
          title: '今日',
          value: 0,
          active: true
        },
        {
          title: '昨日',
          value: -1
        },
        {
          title: '过去7天',
          value: -7
        },
        {
          title: '过去30天',
          value: -30
        }
      ],
      onBtnClick: _.noop
    });
  },

  render: function(options) {
    options = options || this.options;

    this.$el.html(_(this.template).template()(_(options).pick(
      'prevClass',
      'inputName',
      'btnStyle',
      'btnGroup'
    )));

    this.$hiddenInput = this.$('.' + options.prevClass + '-hidden-input');

    this._init(options);

    return this;
  },

  //common APIs

  val: function() {
    return this.$('.' + this.options.prevClass + '-btn-group').filter('.active').attr('data-' + this.options.inputName);
  },

  select: function(id) {
    this.$('.' + this.options.prevClass + '-btn-group').filter('[data-' + this.options.inputName + '=' + id + ']').trigger('click');
  },

  clearSelect: function() {
    this.$hiddenInput.val('');
    this.$('.' + this.options.prevClass + '-btn-group').removeClass('active');
  },

  _init: function(options) {
    var activeBtn = _(options.btnGroup).findWhere({active: true});

    if (activeBtn) {
      this.$('[data-' + this.options.inputName.toLowerCase() + '=' + activeBtn.value + ']').trigger('click');
    }
  },

  btnClickHandler: function(e) {
    var $target = $(e.currentTarget);
    var value = $target.data(this.options.inputName.toLowerCase());

    this.$hiddenInput.val(value);

    this.options.onBtnClick(value);

    $target.addClass('active').siblings().removeClass('active');

    this.trigger('onBtnClick', value);
  }
});

module.exports = BtnGroup;

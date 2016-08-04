/**
 * ViewPrefab view预设 可以是大的页面prefab，也可以小到按钮
 * 目的在于简化在本项目中经常出现的特定组合代码
 */

Base.PrefabView = Base.ItemView.extend({

  className: '',

  options: {
    prevClass: 'js'
  },

  constructor: function(options) {
    options = options || {};

    if (options.className) {
      this.className += ' ' + options.className;
      delete options.className;
    }

    this.events = _((_(this.__events).isFunction() ? this.__events() : this.__events || {})).extend(
      _(this.events).isFunction() ? this.events() : this.events || {}
    );

    Base.View.apply(this, arguments);
  }
});

Base.Prefab = {};

/**
 * 选择按钮Prefab
 */

define(function(require, exports, module) {


  Base.Prefab.BtnGroup = Base.PrefabView.extend({
    template: require('text!prefab/templates/btnGroup.html'),

    className: 'btn-group',

    tagName: 'div',

    events: function() {
      var events = {};

      events['click .' + this.options.prevClass + '-btn-group'] = 'btnClickHandler';

      return events;
    },

    initialize: function() {

      _.defaults(this.options, {
        inputName: 'dateOffset',
        btnGroup: [
          {
            title: '今天',
            value: 1,
            active: true
          },
          {
            title: '昨天',
            value: -0
          },
          {
            title: '最近7天',
            value: -6
          },
          {
            title: '最近30天',
            value: -29
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

      $target.addClass('active').siblings().removeClass('active');

      this.$hiddenInput.val(value);

      this.options.onBtnClick(value);

      this.trigger('onBtnClick', value);
    }

  });
});
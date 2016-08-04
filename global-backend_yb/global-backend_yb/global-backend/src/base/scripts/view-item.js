/**
 * `ItemView` 对应一个Entity Item，该 Entity 为 Backbone.Model 或者为 Backbone.Collection
 *
 * `single item view`实现了:
 * 使用`underscore.js templates`渲染，序列化view的`model`或者`collection`，调用继承自view的方法，
 * 比如 `onRender`
 *
 */
Base.ItemView = Base.View.extend({

  // 设置继承链
  constructor: function() {
    Base.View.apply(this, arguments);
  },

  /**
   * 序列化view的`model`或者`collection`
   * 你可以在你的View中，重写`serializeData`，定制化View的数据
   */
  serializeData: function() {
    if (!this.model && !this.collection) {
      return {};
    }

    var args = [this.model || this.collection];
    if (arguments.length) {
      args.push.apply(args, arguments);
    }

    if (this.model) {
      return this.serializeModel.apply(this, args);
    } else {
      return {
        items: this.serializeCollection.apply(this, args)
      };
    }
  },

  /**
   * 序列化`collection`，序列化collection所有的model
   */
  serializeCollection: function(collection) {
    return collection.toJSON.apply(collection, _.rest(arguments));
  },

  /**
   * 渲染view，可重写
   */
  render: function() {
    this._ensureViewIsIntact();

    this.triggerMethod('before:render', this);

    this._renderTemplate();

    this.triggerMethod('render', this);

    return this;
  },

  _renderTemplate: function() {
    var template = this.getTemplate();

    if (template === false) {
      return;
    }

    if (_.isUndefined(template)) {
      throw new Base.Error({
        name: 'UndefinedTemplateError',
        message: 'template为空，不能渲染。'
      });
    }

    var data = this.serializeData();
    data = this.mixinTemplateHelpers(data);

    var compiledTpl = _.template(template);
    var html = compiledTpl(data);

    this.attachElContent(html);

    return this;
  },

  /**
   * 将内容渲染到页面上
   */
  attachElContent: function(html) {
    this.$el.html(html);

    return this;
  }

});
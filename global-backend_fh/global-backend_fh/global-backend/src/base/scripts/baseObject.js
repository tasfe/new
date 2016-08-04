/**
 * 用作其它`classes`的基类
 * `BaseObject`采用了`backbone`很多有用的方法，比如`initialize`和`Backbone.Events`
 *
 */
Base.BaseObject = function(options) {
  this.options = _.extend({}, _.result(this, 'options'), options);
  this.initialize.apply(this, arguments);
};

Base.BaseObject.extend = Base.extend;

_.extend(Base.BaseObject.prototype, Backbone.Events, {

  /**
   * 当实例化`BaseObject`时，`initialize`方法被调用
   */
  initialize: function(options) {},

  /**
   * 用于解除`unbind`直接绑定在实例上的所有事件
   *
   * 调用`destroy`方法会触发"before:destroy"事件，以及相应地`onBeforeDestroy`方法。
   * 这些调用都会接受调用`destroy`方法时，传递的参数.
   *
   */
  destroy: function() {
    this.triggerMethod('before:destroy');
    this.triggerMethod('destroy');
    this.stopListening();
  },

  /**
   * 用于触发`on`或者`listenTo`监听的事件
   */
  triggerMethod: Base.triggerMethod,

  /**
   * 用于获取对象或者对象的`this.options`属性`attribute`
   *
   */
  getOption: Base.proxyGetOption,

  /**
   * 用于绑定`Backbone`的collection或model到目标对象的方法上
   */
  bindEntityEvents: Base.proxyBindEntityEvents,

  /**
   * 用于解除目标对象的方法上绑定的`Backbone`的collection或model
   */
  unbindEntityEvents: Base.proxyUnbindEntityEvents

});
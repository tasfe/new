/**
 * `controller`用于松耦合
 *   modules <==> routers
 *   对象和对象之间
 *   views <==> routers
 *   ...
 */
Base.Controller = function(options) {
  this.options = options || {};

  if (_.isFunction(this.initialize)) {
    this.initialize(this.options);
  }
};

Base.Controller.extend = Base.extend;

_.extend(Base.Controller.prototype, Backbone.Events, {

  /**
   * 用于解除`unbind`直接绑定在实例上的所有事件
   */
  destroy: function() {
    Base._triggerMethod(this, 'before:destroy', arguments);
    Base._triggerMethod(this, 'destroy', arguments);

    this.stopListening();
    this.off();
    return this;
  },

  triggerMethod: Base.triggerMethod,

  getOption: Base.proxyGetOption

});
/**
 * 用于绑定`Entity`事件或者解除绑定`Entity`事件
 * `entity` => Backbone的Model或Collection
 *
 * 以下方法中:
 *   `target`参数，必须是`Mixed in`Backbone.Events的对象
 *   `entity`参数，必须是Backbone.Model, Backbone.Collection或者任何`Mixed in`Backbone.Events的对象
 *   `evt`参数，是一个 { "event:name": "eventHandler" } 的hash键值对
 *
 */
(function(Base) {

  // 用于绑定目标对象`target`上的`handlers`中以字符串形式指定的事件
  function bindFromStrings(target, entity, evt, methods) {
    var methodNames = methods.split(/\s+/);

    _.each(methodNames, function(methodName) {

      var method = target[methodName];
      if (!method) {
        throw new Base.Error('方法 "' + methodName + '" 在`event handler`中被指定，但是却不存在.');
      }

      target.listenTo(entity, evt, method);
    });
  }

  // 用于将事件绑定到callback函数上
  function bindToFunction(target, entity, evt, method) {
    target.listenTo(entity, evt, method);
  }

  // 用于解除绑定目标对象`target`上的`handlers`中以字符串形式指定的事件
  function unbindFromStrings(target, entity, evt, methods) {
    var methodNames = methods.split(/\s+/);

    _.each(methodNames, function(methodName) {
      var method = target[methodName];
      target.stopListening(entity, evt, method);
    });
  }

  // 用于解除绑定到callback函数上的事件
  function unbindToFunction(target, entity, evt, method) {
    target.stopListening(entity, evt, method);
  }

  function iterateEvents(target, entity, bindings, functionCallback, stringCallback) {
    if (!entity || !bindings) { return; }

    if (!_.isObject(bindings)) {
      throw new Base.Error('`Bindings`必须是一个对象或者函数');
    }

    bindings = Base._getValue(bindings, target);

    _.each(bindings, function(methods, evt) {

      if (_.isFunction(methods)) {
        functionCallback(target, entity, evt, methods);
      } else {
        stringCallback(target, entity, evt, methods);
      }

    });
  }

  /**
   * 用于绑定`Backbone`的collection或model到目标对象的方法上
   */
  Base.bindEntityEvents = function(target, entity, bindings) {
    iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
  };

  /**
   * 用于解除目标对象的方法上绑定的`Backbone`的collection或model
   */
  Base.unbindEntityEvents = function(target, entity, bindings) {
    iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
  };

  /**
   * 用于绑定`Backbone`的collection或model到该对象的方法上
   */
  Base.proxyBindEntityEvents = function(entity, bindings) {
    return Base.bindEntityEvents(this, entity, bindings);
  };

  /**
   * 用于解除该对象的方法上绑定的`Backbone`的collection或model
   */
  Base.proxyUnbindEntityEvents = function(entity, bindings) {
    return Base.unbindEntityEvents(this, entity, bindings);
  };

})(Base);
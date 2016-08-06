Base._triggerMethod = (function() {
  // 以":"分隔事件名 ("e1:e2:e3")
  var splitter = /(^|:)(\w)/gi;

  function getEventName(match, prefix, eventName) {
    return eventName.toUpperCase();
  }

  return function(context, event, args) {
    var noEventArg = arguments.length < 3;
    if (noEventArg) {
      args = event;
      event = args[0];
    }

    var methodName = 'on' + event.replace(splitter, getEventName);
    var method = context[methodName];
    var result;

    if (_.isFunction(method)) {
      result = method.apply(context, noEventArg ? _.rest(args) : args);
    }

    if (_.isFunction(context.trigger)) {
      if (noEventArg + args.length > 1) {
        context.trigger.apply(context, noEventArg ? args : [event].concat(_.rest(args, 0)));
      } else {
        context.trigger(event);
      }
    }

    return result;
  };
})();

/**
 * 触发一个事件 and/or 执行一个方法，例如：
 * `this.triggerMethod('method1')` 会触发 'method1' 事件，并且执行 `onMethod1`
 * `this.triggerMethod('method1:method2')` 会触发 'method1:method2' 事件，并执行'onMethod1Method2'
 */
Base.triggerMethod = function(event) {
  return Base._triggerMethod(this, arguments);
};

/**
 * 在一个给定的上下文中，触发一个事件，例如：
 * Base.triggerMethodOn(view, 'show'); 会触发一个 "show"事件 或 调用 view 里面的 onShow 方法
 *
 */
Base.triggerMethodOn = function(context) {
  var fnc = _.isFunction(context.triggerMethod) ? context.triggerMethod : Base.triggerMethod;

  return fnc.apply(context, _.rest(arguments));
};
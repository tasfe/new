/**
 * Determine if `el` is a child of the document
 */
Base.isNodeAttached = function(el) {
  return Backbone.$.contains(document.documentElement, el);
};

/**
 * Retrieve an object, function or other value from a target object or its `options`, with `options` taking precedence.
 */
Base.getOption = function(target, optionName) {
  if (!target || !optionName) {
    return;
  }
  if (target.options && (target.options[optionName] !== undefined)) {
    return target.options[optionName];
  } else {
    return target[optionName];
  }
};

/**
 * Proxy `Base.getOption`
 */
Base.proxyGetOption = function(optionName) {
  return Base.getOption(this, optionName);
};

// Similar to `_.result`, this is a simple helper
// If a function is provided we call it with context
// otherwise just return the value. If the value is
// undefined return a default value
Base._getValue = function(value, context, params) {
  if (_.isFunction(value)) {
    // We need to ensure that params is not undefined
    // to prevent `apply` from failing in ie8
    params = params || [];

    value = value.apply(context, params);
  }
  return value;
};

Base.actAsCollection = function(object, listProperty) {
  var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
    'select', 'reject', 'every', 'all', 'some', 'any', 'include',
    'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
    'last', 'without', 'isEmpty', 'pluck'];

  _.each(methods, function(method) {
    object[method] = function() {
      var list = _.values(_.result(this, listProperty));
      var args = [list].concat(_.toArray(arguments));
      return _[method].apply(_, args);
    };
  });
};
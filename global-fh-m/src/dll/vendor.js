var vendor_library =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

  module.exports = __webpack_require__;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  module.exports = __webpack_require__(2);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule React
   */

  'use strict';

  var _assign = __webpack_require__(4);

  var ReactChildren = __webpack_require__(5);
  var ReactComponent = __webpack_require__(17);
  var ReactPureComponent = __webpack_require__(20);
  var ReactClass = __webpack_require__(21);
  var ReactDOMFactories = __webpack_require__(26);
  var ReactElement = __webpack_require__(9);
  var ReactPropTypes = __webpack_require__(31);
  var ReactVersion = __webpack_require__(32);

  var onlyChild = __webpack_require__(33);
  var warning = __webpack_require__(11);

  var createElement = ReactElement.createElement;
  var createFactory = ReactElement.createFactory;
  var cloneElement = ReactElement.cloneElement;

  if (process.env.NODE_ENV !== 'production') {
    var ReactElementValidator = __webpack_require__(27);
    createElement = ReactElementValidator.createElement;
    createFactory = ReactElementValidator.createFactory;
    cloneElement = ReactElementValidator.cloneElement;
  }

  var __spread = _assign;

  if (process.env.NODE_ENV !== 'production') {
    var warned = false;
    __spread = function () {
      process.env.NODE_ENV !== 'production' ? warning(warned, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.') : void 0;
      warned = true;
      return _assign.apply(null, arguments);
    };
  }

  var React = {

    // Modern

    Children: {
      map: ReactChildren.map,
      forEach: ReactChildren.forEach,
      count: ReactChildren.count,
      toArray: ReactChildren.toArray,
      only: onlyChild
    },

    Component: ReactComponent,
    PureComponent: ReactPureComponent,

    createElement: createElement,
    cloneElement: cloneElement,
    isValidElement: ReactElement.isValidElement,

    // Classic

    PropTypes: ReactPropTypes,
    createClass: ReactClass.createClass,
    createFactory: createFactory,
    createMixin: function (mixin) {
      // Currently a noop. Will be used to validate and trace mixins.
      return mixin;
    },

    // This looks DOM specific but these are actually isomorphic helpers
    // since they are just generating DOM strings.
    DOM: ReactDOMFactories,

    version: ReactVersion,

    // Deprecated hook for JSX spread, don't use this for anything.
    __spread: __spread
  };

  module.exports = React;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 3 */
/***/ function(module, exports) {

  // shim for using process in browser
  var process = module.exports = {};

  // cached from whatever global is present so that test runners that stub it
  // don't break things.  But we need to wrap it in a try catch in case it is
  // wrapped in strict mode code which doesn't define any globals.  It's inside a
  // function because try/catches deoptimize in certain engines.

  var cachedSetTimeout;
  var cachedClearTimeout;

  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  (function () {
      try {
          if (typeof setTimeout === 'function') {
              cachedSetTimeout = setTimeout;
          } else {
              cachedSetTimeout = defaultSetTimout;
          }
      } catch (e) {
          cachedSetTimeout = defaultSetTimout;
      }
      try {
          if (typeof clearTimeout === 'function') {
              cachedClearTimeout = clearTimeout;
          } else {
              cachedClearTimeout = defaultClearTimeout;
          }
      } catch (e) {
          cachedClearTimeout = defaultClearTimeout;
      }
  } ())
  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }


  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }



  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;

  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }

  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }

  process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  };

  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  process.title = 'browser';
  process.browser = true;
  process.env = {};
  process.argv = [];
  process.version = ''; // empty string to avoid regexp issues
  process.versions = {};

  function noop() {}

  process.on = noop;
  process.addListener = noop;
  process.once = noop;
  process.off = noop;
  process.removeListener = noop;
  process.removeAllListeners = noop;
  process.emit = noop;

  process.binding = function (name) {
      throw new Error('process.binding is not supported');
  };

  process.cwd = function () { return '/' };
  process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
  };
  process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports) {

  'use strict';
  /* eslint-disable no-unused-vars */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (e) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  module.exports = shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (Object.getOwnPropertySymbols) {
  			symbols = Object.getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactChildren
   */

  'use strict';

  var PooledClass = __webpack_require__(6);
  var ReactElement = __webpack_require__(9);

  var emptyFunction = __webpack_require__(12);
  var traverseAllChildren = __webpack_require__(14);

  var twoArgumentPooler = PooledClass.twoArgumentPooler;
  var fourArgumentPooler = PooledClass.fourArgumentPooler;

  var userProvidedKeyEscapeRegex = /\/+/g;
  function escapeUserProvidedKey(text) {
    return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
  }

  /**
   * PooledClass representing the bookkeeping associated with performing a child
   * traversal. Allows avoiding binding callbacks.
   *
   * @constructor ForEachBookKeeping
   * @param {!function} forEachFunction Function to perform traversal with.
   * @param {?*} forEachContext Context to perform context with.
   */
  function ForEachBookKeeping(forEachFunction, forEachContext) {
    this.func = forEachFunction;
    this.context = forEachContext;
    this.count = 0;
  }
  ForEachBookKeeping.prototype.destructor = function () {
    this.func = null;
    this.context = null;
    this.count = 0;
  };
  PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

  function forEachSingleChild(bookKeeping, child, name) {
    var func = bookKeeping.func;
    var context = bookKeeping.context;

    func.call(context, child, bookKeeping.count++);
  }

  /**
   * Iterates through children that are typically specified as `props.children`.
   *
   * See https://facebook.github.io/react/docs/top-level-api.html#react.children.foreach
   *
   * The provided forEachFunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} forEachFunc
   * @param {*} forEachContext Context for forEachContext.
   */
  function forEachChildren(children, forEachFunc, forEachContext) {
    if (children == null) {
      return children;
    }
    var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
    traverseAllChildren(children, forEachSingleChild, traverseContext);
    ForEachBookKeeping.release(traverseContext);
  }

  /**
   * PooledClass representing the bookkeeping associated with performing a child
   * mapping. Allows avoiding binding callbacks.
   *
   * @constructor MapBookKeeping
   * @param {!*} mapResult Object containing the ordered map of results.
   * @param {!function} mapFunction Function to perform mapping with.
   * @param {?*} mapContext Context to perform mapping with.
   */
  function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
    this.result = mapResult;
    this.keyPrefix = keyPrefix;
    this.func = mapFunction;
    this.context = mapContext;
    this.count = 0;
  }
  MapBookKeeping.prototype.destructor = function () {
    this.result = null;
    this.keyPrefix = null;
    this.func = null;
    this.context = null;
    this.count = 0;
  };
  PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);

  function mapSingleChildIntoContext(bookKeeping, child, childKey) {
    var result = bookKeeping.result;
    var keyPrefix = bookKeeping.keyPrefix;
    var func = bookKeeping.func;
    var context = bookKeeping.context;


    var mappedChild = func.call(context, child, bookKeeping.count++);
    if (Array.isArray(mappedChild)) {
      mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
    } else if (mappedChild != null) {
      if (ReactElement.isValidElement(mappedChild)) {
        mappedChild = ReactElement.cloneAndReplaceKey(mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
      }
      result.push(mappedChild);
    }
  }

  function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
    var escapedPrefix = '';
    if (prefix != null) {
      escapedPrefix = escapeUserProvidedKey(prefix) + '/';
    }
    var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
    traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
    MapBookKeeping.release(traverseContext);
  }

  /**
   * Maps children that are typically specified as `props.children`.
   *
   * See https://facebook.github.io/react/docs/top-level-api.html#react.children.map
   *
   * The provided mapFunction(child, key, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} func The map function.
   * @param {*} context Context for mapFunction.
   * @return {object} Object containing the ordered map of results.
   */
  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, func, context);
    return result;
  }

  function forEachSingleChildDummy(traverseContext, child, name) {
    return null;
  }

  /**
   * Count the number of children that are typically specified as
   * `props.children`.
   *
   * See https://facebook.github.io/react/docs/top-level-api.html#react.children.count
   *
   * @param {?*} children Children tree container.
   * @return {number} The number of children.
   */
  function countChildren(children, context) {
    return traverseAllChildren(children, forEachSingleChildDummy, null);
  }

  /**
   * Flatten a children object (typically specified as `props.children`) and
   * return an array with appropriately re-keyed children.
   *
   * See https://facebook.github.io/react/docs/top-level-api.html#react.children.toarray
   */
  function toArray(children) {
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
    return result;
  }

  var ReactChildren = {
    forEach: forEachChildren,
    map: mapChildren,
    mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
    count: countChildren,
    toArray: toArray
  };

  module.exports = ReactChildren;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule PooledClass
   */

  'use strict';

  var _prodInvariant = __webpack_require__(7);

  var invariant = __webpack_require__(8);

  /**
   * Static poolers. Several custom versions for each potential number of
   * arguments. A completely generic pooler is easy to implement, but would
   * require accessing the `arguments` object. In each of these, `this` refers to
   * the Class itself, not an instance. If any others are needed, simply add them
   * here, or in their own files.
   */
  var oneArgumentPooler = function (copyFieldsFrom) {
    var Klass = this;
    if (Klass.instancePool.length) {
      var instance = Klass.instancePool.pop();
      Klass.call(instance, copyFieldsFrom);
      return instance;
    } else {
      return new Klass(copyFieldsFrom);
    }
  };

  var twoArgumentPooler = function (a1, a2) {
    var Klass = this;
    if (Klass.instancePool.length) {
      var instance = Klass.instancePool.pop();
      Klass.call(instance, a1, a2);
      return instance;
    } else {
      return new Klass(a1, a2);
    }
  };

  var threeArgumentPooler = function (a1, a2, a3) {
    var Klass = this;
    if (Klass.instancePool.length) {
      var instance = Klass.instancePool.pop();
      Klass.call(instance, a1, a2, a3);
      return instance;
    } else {
      return new Klass(a1, a2, a3);
    }
  };

  var fourArgumentPooler = function (a1, a2, a3, a4) {
    var Klass = this;
    if (Klass.instancePool.length) {
      var instance = Klass.instancePool.pop();
      Klass.call(instance, a1, a2, a3, a4);
      return instance;
    } else {
      return new Klass(a1, a2, a3, a4);
    }
  };

  var fiveArgumentPooler = function (a1, a2, a3, a4, a5) {
    var Klass = this;
    if (Klass.instancePool.length) {
      var instance = Klass.instancePool.pop();
      Klass.call(instance, a1, a2, a3, a4, a5);
      return instance;
    } else {
      return new Klass(a1, a2, a3, a4, a5);
    }
  };

  var standardReleaser = function (instance) {
    var Klass = this;
    !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
    instance.destructor();
    if (Klass.instancePool.length < Klass.poolSize) {
      Klass.instancePool.push(instance);
    }
  };

  var DEFAULT_POOL_SIZE = 10;
  var DEFAULT_POOLER = oneArgumentPooler;

  /**
   * Augments `CopyConstructor` to be a poolable class, augmenting only the class
   * itself (statically) not adding any prototypical fields. Any CopyConstructor
   * you give this may have a `poolSize` property, and will look for a
   * prototypical `destructor` on instances.
   *
   * @param {Function} CopyConstructor Constructor that can be used to reset.
   * @param {Function} pooler Customizable pooler.
   */
  var addPoolingTo = function (CopyConstructor, pooler) {
    var NewKlass = CopyConstructor;
    NewKlass.instancePool = [];
    NewKlass.getPooled = pooler || DEFAULT_POOLER;
    if (!NewKlass.poolSize) {
      NewKlass.poolSize = DEFAULT_POOL_SIZE;
    }
    NewKlass.release = standardReleaser;
    return NewKlass;
  };

  var PooledClass = {
    addPoolingTo: addPoolingTo,
    oneArgumentPooler: oneArgumentPooler,
    twoArgumentPooler: twoArgumentPooler,
    threeArgumentPooler: threeArgumentPooler,
    fourArgumentPooler: fourArgumentPooler,
    fiveArgumentPooler: fiveArgumentPooler
  };

  module.exports = PooledClass;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 7 */
/***/ function(module, exports) {

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule reactProdInvariant
   * 
   */
  'use strict';

  /**
   * WARNING: DO NOT manually require this module.
   * This is a replacement for `invariant(...)` used by the error code system
   * and will _only_ be required by the corresponding babel pass.
   * It always throws.
   */

  function reactProdInvariant(code) {
    var argCount = arguments.length - 1;

    var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

    for (var argIdx = 0; argIdx < argCount; argIdx++) {
      message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
    }

    message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

    var error = new Error(message);
    error.name = 'Invariant Violation';
    error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

    throw error;
  }

  module.exports = reactProdInvariant;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright (c) 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   */

  'use strict';

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */

  function invariant(condition, format, a, b, c, d, e, f) {
    if (process.env.NODE_ENV !== 'production') {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    }

    if (!condition) {
      var error;
      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function () {
          return args[argIndex++];
        }));
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  }

  module.exports = invariant;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2014-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactElement
   */

  'use strict';

  var _assign = __webpack_require__(4);

  var ReactCurrentOwner = __webpack_require__(10);

  var warning = __webpack_require__(11);
  var canDefineProperty = __webpack_require__(13);
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  // The Symbol used to tag the ReactElement type. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };

  var specialPropKeyWarningShown, specialPropRefWarningShown;

  function hasValidRef(config) {
    if (process.env.NODE_ENV !== 'production') {
      if (hasOwnProperty.call(config, 'ref')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.ref !== undefined;
  }

  function hasValidKey(config) {
    if (process.env.NODE_ENV !== 'production') {
      if (hasOwnProperty.call(config, 'key')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.key !== undefined;
  }

  function defineKeyPropWarningGetter(props, displayName) {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;
        process.env.NODE_ENV !== 'production' ? warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
      }
    };
    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }

  function defineRefPropWarningGetter(props, displayName) {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;
        process.env.NODE_ENV !== 'production' ? warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
      }
    };
    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }

  /**
   * Factory method to create a new React element. This no longer adheres to
   * the class pattern, so do not use new to call it. Also, no instanceof check
   * will work. Instead test $$typeof field against Symbol.for('react.element') to check
   * if something is a React Element.
   *
   * @param {*} type
   * @param {*} key
   * @param {string|object} ref
   * @param {*} self A *temporary* helper to detect places where `this` is
   * different from the `owner` when React.createElement is called, so that we
   * can warn. We want to get rid of owner and replace string `ref`s with arrow
   * functions, and as long as `this` and owner are the same, there will be no
   * change in behavior.
   * @param {*} source An annotation object (added by a transpiler or otherwise)
   * indicating filename, line number, and/or other information.
   * @param {*} owner
   * @param {*} props
   * @internal
   */
  var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allow us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,

      // Record the component responsible for creating this element.
      _owner: owner
    };

    if (process.env.NODE_ENV !== 'production') {
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      element._store = {};
      var shadowChildren = Array.isArray(props.children) ? props.children.slice(0) : props.children;

      // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.
      if (canDefineProperty) {
        Object.defineProperty(element._store, 'validated', {
          configurable: false,
          enumerable: false,
          writable: true,
          value: false
        });
        // self and source are DEV only properties.
        Object.defineProperty(element, '_self', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: self
        });
        Object.defineProperty(element, '_shadowChildren', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: shadowChildren
        });
        // Two elements created in two different places should be considered
        // equal for testing purposes and therefore we hide it from enumeration.
        Object.defineProperty(element, '_source', {
          configurable: false,
          enumerable: false,
          writable: false,
          value: source
        });
      } else {
        element._store.validated = false;
        element._self = self;
        element._shadowChildren = shadowChildren;
        element._source = source;
      }
      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }

    return element;
  };

  /**
   * Create and return a new ReactElement of the given type.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
   */
  ReactElement.createElement = function (type, config, children) {
    var propName;

    // Reserved names are extracted
    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {
      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning(
        /* eslint-disable no-proto */
        config.__proto__ == null || config.__proto__ === Object.prototype,
        /* eslint-enable no-proto */
        'React.createElement(...): Expected props argument to be a plain object. ' + 'Properties defined in its prototype chain will be ignored.') : void 0;
      }

      if (hasValidRef(config)) {
        ref = config.ref;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source;
      // Remaining properties are added to a new props object
      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }

    // Resolve default props
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }
    if (process.env.NODE_ENV !== 'production') {
      if (key || ref) {
        if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
          var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
          if (key) {
            defineKeyPropWarningGetter(props, displayName);
          }
          if (ref) {
            defineRefPropWarningGetter(props, displayName);
          }
        }
      }
    }
    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  };

  /**
   * Return a function that produces ReactElements of a given type.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
   */
  ReactElement.createFactory = function (type) {
    var factory = ReactElement.createElement.bind(null, type);
    // Expose the type on the factory and the prototype so that it can be
    // easily accessed on elements. E.g. `<Foo />.type === Foo`.
    // This should not be named `constructor` since this may not be the function
    // that created the element, and it may not even be a constructor.
    // Legacy hook TODO: Warn if this is accessed
    factory.type = type;
    return factory;
  };

  ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
    var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

    return newElement;
  };

  /**
   * Clone and return a new ReactElement using element as the starting point.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
   */
  ReactElement.cloneElement = function (element, config, children) {
    var propName;

    // Original props are copied
    var props = _assign({}, element.props);

    // Reserved names are extracted
    var key = element.key;
    var ref = element.ref;
    // Self is preserved since the owner is preserved.
    var self = element._self;
    // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.
    var source = element._source;

    // Owner will be preserved, unless ref is overridden
    var owner = element._owner;

    if (config != null) {
      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning(
        /* eslint-disable no-proto */
        config.__proto__ == null || config.__proto__ === Object.prototype,
        /* eslint-enable no-proto */
        'React.cloneElement(...): Expected props argument to be a plain object. ' + 'Properties defined in its prototype chain will be ignored.') : void 0;
      }

      if (hasValidRef(config)) {
        // Silently steal the ref from the parent.
        ref = config.ref;
        owner = ReactCurrentOwner.current;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      // Remaining properties override existing props
      var defaultProps;
      if (element.type && element.type.defaultProps) {
        defaultProps = element.type.defaultProps;
      }
      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          if (config[propName] === undefined && defaultProps !== undefined) {
            // Resolve default props
            props[propName] = defaultProps[propName];
          } else {
            props[propName] = config[propName];
          }
        }
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }

    return ReactElement(element.type, key, ref, self, source, owner, props);
  };

  /**
   * Verifies the object is a ReactElement.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a valid component.
   * @final
   */
  ReactElement.isValidElement = function (object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  };

  ReactElement.REACT_ELEMENT_TYPE = REACT_ELEMENT_TYPE;

  module.exports = ReactElement;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 10 */
/***/ function(module, exports) {

  /**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactCurrentOwner
   */

  'use strict';

  /**
   * Keeps track of the current owner.
   *
   * The current owner is the component who should own any components that are
   * currently being constructed.
   */

  var ReactCurrentOwner = {

    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null

  };

  module.exports = ReactCurrentOwner;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2014-2015, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   */

  'use strict';

  var emptyFunction = __webpack_require__(12);

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warning = emptyFunction;

  if (process.env.NODE_ENV !== 'production') {
    (function () {
      var printWarning = function printWarning(format) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        if (typeof console !== 'undefined') {
          console.error(message);
        }
        try {
          // --- Welcome to debugging React ---
          // This error was thrown as a convenience so that you can use this stack
          // to find the callsite that caused this warning to fire.
          throw new Error(message);
        } catch (x) {}
      };

      warning = function warning(condition, format) {
        if (format === undefined) {
          throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
        }

        if (format.indexOf('Failed Composite propType: ') === 0) {
          return; // Ignore CompositeComponent proptype check.
        }

        if (!condition) {
          for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            args[_key2 - 2] = arguments[_key2];
          }

          printWarning.apply(undefined, [format].concat(args));
        }
      };
    })();
  }

  module.exports = warning;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 12 */
/***/ function(module, exports) {

  "use strict";

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * 
   */

  function makeEmptyFunction(arg) {
    return function () {
      return arg;
    };
  }

  /**
   * This function accepts and discards inputs; it has no side effects. This is
   * primarily useful idiomatically for overridable function endpoints which
   * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
   */
  var emptyFunction = function emptyFunction() {};

  emptyFunction.thatReturns = makeEmptyFunction;
  emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
  emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
  emptyFunction.thatReturnsNull = makeEmptyFunction(null);
  emptyFunction.thatReturnsThis = function () {
    return this;
  };
  emptyFunction.thatReturnsArgument = function (arg) {
    return arg;
  };

  module.exports = emptyFunction;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule canDefineProperty
   */

  'use strict';

  var canDefineProperty = false;
  if (process.env.NODE_ENV !== 'production') {
    try {
      Object.defineProperty({}, 'x', { get: function () {} });
      canDefineProperty = true;
    } catch (x) {
      // IE will fail on defineProperty
    }
  }

  module.exports = canDefineProperty;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule traverseAllChildren
   */

  'use strict';

  var _prodInvariant = __webpack_require__(7);

  var ReactCurrentOwner = __webpack_require__(10);
  var ReactElement = __webpack_require__(9);

  var getIteratorFn = __webpack_require__(15);
  var invariant = __webpack_require__(8);
  var KeyEscapeUtils = __webpack_require__(16);
  var warning = __webpack_require__(11);

  var SEPARATOR = '.';
  var SUBSEPARATOR = ':';

  /**
   * TODO: Test that a single child and an array with one item have the same key
   * pattern.
   */

  var didWarnAboutMaps = false;

  /**
   * Generate a key string that identifies a component within a set.
   *
   * @param {*} component A component that could contain a manual key.
   * @param {number} index Index that is used if a manual key is not provided.
   * @return {string}
   */
  function getComponentKey(component, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (component && typeof component === 'object' && component.key != null) {
      // Explicit key
      return KeyEscapeUtils.escape(component.key);
    }
    // Implicit key determined by the index in the set
    return index.toString(36);
  }

  /**
   * @param {?*} children Children tree container.
   * @param {!string} nameSoFar Name of the key path so far.
   * @param {!function} callback Callback to invoke with each child found.
   * @param {?*} traverseContext Used to pass information throughout the traversal
   * process.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
    var type = typeof children;

    if (type === 'undefined' || type === 'boolean') {
      // All of the above are perceived as null.
      children = null;
    }

    if (children === null || type === 'string' || type === 'number' || ReactElement.isValidElement(children)) {
      callback(traverseContext, children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
      return 1;
    }

    var child;
    var nextName;
    var subtreeCount = 0; // Count of children found in the current subtree.
    var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getComponentKey(child, i);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else {
      var iteratorFn = getIteratorFn(children);
      if (iteratorFn) {
        var iterator = iteratorFn.call(children);
        var step;
        if (iteratorFn !== children.entries) {
          var ii = 0;
          while (!(step = iterator.next()).done) {
            child = step.value;
            nextName = nextNamePrefix + getComponentKey(child, ii++);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        } else {
          if (process.env.NODE_ENV !== 'production') {
            var mapsAsChildrenAddendum = '';
            if (ReactCurrentOwner.current) {
              var mapsAsChildrenOwnerName = ReactCurrentOwner.current.getName();
              if (mapsAsChildrenOwnerName) {
                mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
              }
            }
            process.env.NODE_ENV !== 'production' ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.%s', mapsAsChildrenAddendum) : void 0;
            didWarnAboutMaps = true;
          }
          // Iterator will provide entry [k,v] tuples rather than values.
          while (!(step = iterator.next()).done) {
            var entry = step.value;
            if (entry) {
              child = entry[1];
              nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
              subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
            }
          }
        }
      } else if (type === 'object') {
        var addendum = '';
        if (process.env.NODE_ENV !== 'production') {
          addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
          if (children._isReactElement) {
            addendum = ' It looks like you\'re using an element created by a different ' + 'version of React. Make sure to use only one copy of React.';
          }
          if (ReactCurrentOwner.current) {
            var name = ReactCurrentOwner.current.getName();
            if (name) {
              addendum += ' Check the render method of `' + name + '`.';
            }
          }
        }
        var childrenString = String(children);
         true ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : void 0;
      }
    }

    return subtreeCount;
  }

  /**
   * Traverses children that are typically specified as `props.children`, but
   * might also be specified through attributes:
   *
   * - `traverseAllChildren(this.props.children, ...)`
   * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
   *
   * The `traverseContext` is an optional argument that is passed through the
   * entire traversal. It can be used to store accumulations or anything else that
   * the callback might find relevant.
   *
   * @param {?*} children Children tree object.
   * @param {!function} callback To invoke upon traversing each child.
   * @param {?*} traverseContext Context for traversal.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildren(children, callback, traverseContext) {
    if (children == null) {
      return 0;
    }

    return traverseAllChildrenImpl(children, '', callback, traverseContext);
  }

  module.exports = traverseAllChildren;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 15 */
/***/ function(module, exports) {

  /**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule getIteratorFn
   * 
   */

  'use strict';

  /* global Symbol */

  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  module.exports = getIteratorFn;

/***/ },
/* 16 */
/***/ function(module, exports) {

  /**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule KeyEscapeUtils
   * 
   */

  'use strict';

  /**
   * Escape and wrap key so it is safe to use as a reactid
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */

  function escape(key) {
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
      '=': '=0',
      ':': '=2'
    };
    var escapedString = ('' + key).replace(escapeRegex, function (match) {
      return escaperLookup[match];
    });

    return '$' + escapedString;
  }

  /**
   * Unescape and unwrap key for human-readable display
   *
   * @param {string} key to unescape.
   * @return {string} the unescaped key.
   */
  function unescape(key) {
    var unescapeRegex = /(=0|=2)/g;
    var unescaperLookup = {
      '=0': '=',
      '=2': ':'
    };
    var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);

    return ('' + keySubstring).replace(unescapeRegex, function (match) {
      return unescaperLookup[match];
    });
  }

  var KeyEscapeUtils = {
    escape: escape,
    unescape: unescape
  };

  module.exports = KeyEscapeUtils;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactComponent
   */

  'use strict';

  var _prodInvariant = __webpack_require__(7);

  var ReactNoopUpdateQueue = __webpack_require__(18);

  var canDefineProperty = __webpack_require__(13);
  var emptyObject = __webpack_require__(19);
  var invariant = __webpack_require__(8);
  var warning = __webpack_require__(11);

  /**
   * Base class helpers for the updating state of a component.
   */
  function ReactComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    // We initialize the default updater but the real one gets injected by the
    // renderer.
    this.updater = updater || ReactNoopUpdateQueue;
  }

  ReactComponent.prototype.isReactComponent = {};

  /**
   * Sets a subset of the state. Always use this to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * When a function is provided to setState, it will be called at some point in
   * the future (not synchronously). It will be called with the up to date
   * component arguments (state, props, context). These values can be different
   * from this.* because your function may be called after receiveProps but before
   * shouldComponentUpdate, and this new state, props, and context will not yet be
   * assigned to this.
   *
   * @param {object|function} partialState Next partial state or function to
   *        produce next partial state to be merged with current state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  ReactComponent.prototype.setState = function (partialState, callback) {
    !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : _prodInvariant('85') : void 0;
    this.updater.enqueueSetState(this, partialState);
    if (callback) {
      this.updater.enqueueCallback(this, callback, 'setState');
    }
  };

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */
  ReactComponent.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this);
    if (callback) {
      this.updater.enqueueCallback(this, callback, 'forceUpdate');
    }
  };

  /**
   * Deprecated APIs. These APIs used to exist on classic React classes but since
   * we would like to deprecate them, we're not going to move them over to this
   * modern base class. Instead, we define a getter that warns if it's accessed.
   */
  if (process.env.NODE_ENV !== 'production') {
    var deprecatedAPIs = {
      isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
      replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };
    var defineDeprecationWarning = function (methodName, info) {
      if (canDefineProperty) {
        Object.defineProperty(ReactComponent.prototype, methodName, {
          get: function () {
            process.env.NODE_ENV !== 'production' ? warning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]) : void 0;
            return undefined;
          }
        });
      }
    };
    for (var fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }

  module.exports = ReactComponent;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2015-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactNoopUpdateQueue
   */

  'use strict';

  var warning = __webpack_require__(11);

  function warnNoop(publicInstance, callerName) {
    if (process.env.NODE_ENV !== 'production') {
      var constructor = publicInstance.constructor;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
    }
  }

  /**
   * This is the abstract API for an update queue.
   */
  var ReactNoopUpdateQueue = {

    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function (publicInstance) {
      return false;
    },

    /**
     * Enqueue a callback that will be executed after all the pending updates
     * have processed.
     *
     * @param {ReactClass} publicInstance The instance to use as `this` context.
     * @param {?function} callback Called after state is updated.
     * @internal
     */
    enqueueCallback: function (publicInstance, callback) {},

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @internal
     */
    enqueueForceUpdate: function (publicInstance) {
      warnNoop(publicInstance, 'forceUpdate');
    },

    /**
     * Replaces all of the state. Always use this or `setState` to mutate state.
     * You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} completeState Next state.
     * @internal
     */
    enqueueReplaceState: function (publicInstance, completeState) {
      warnNoop(publicInstance, 'replaceState');
    },

    /**
     * Sets a subset of the state. This only exists because _pendingState is
     * internal. This provides a merging strategy that is not available to deep
     * properties which is confusing. TODO: Expose pendingState or don't use it
     * during the merge.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} partialState Next partial state to be merged with state.
     * @internal
     */
    enqueueSetState: function (publicInstance, partialState) {
      warnNoop(publicInstance, 'setState');
    }
  };

  module.exports = ReactNoopUpdateQueue;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright (c) 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   */

  'use strict';

  var emptyObject = {};

  if (process.env.NODE_ENV !== 'production') {
    Object.freeze(emptyObject);
  }

  module.exports = emptyObject;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactPureComponent
   */

  'use strict';

  var _assign = __webpack_require__(4);

  var ReactComponent = __webpack_require__(17);
  var ReactNoopUpdateQueue = __webpack_require__(18);

  var emptyObject = __webpack_require__(19);

  /**
   * Base class helpers for the updating state of a component.
   */
  function ReactPureComponent(props, context, updater) {
    // Duplicated from ReactComponent.
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    // We initialize the default updater but the real one gets injected by the
    // renderer.
    this.updater = updater || ReactNoopUpdateQueue;
  }

  function ComponentDummy() {}
  ComponentDummy.prototype = ReactComponent.prototype;
  ReactPureComponent.prototype = new ComponentDummy();
  ReactPureComponent.prototype.constructor = ReactPureComponent;
  // Avoid an extra prototype jump for these methods.
  _assign(ReactPureComponent.prototype, ReactComponent.prototype);
  ReactPureComponent.prototype.isPureReactComponent = true;

  module.exports = ReactPureComponent;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactClass
   */

  'use strict';

  var _prodInvariant = __webpack_require__(7),
      _assign = __webpack_require__(4);

  var ReactComponent = __webpack_require__(17);
  var ReactElement = __webpack_require__(9);
  var ReactPropTypeLocations = __webpack_require__(22);
  var ReactPropTypeLocationNames = __webpack_require__(24);
  var ReactNoopUpdateQueue = __webpack_require__(18);

  var emptyObject = __webpack_require__(19);
  var invariant = __webpack_require__(8);
  var keyMirror = __webpack_require__(23);
  var keyOf = __webpack_require__(25);
  var warning = __webpack_require__(11);

  var MIXINS_KEY = keyOf({ mixins: null });

  /**
   * Policies that describe methods in `ReactClassInterface`.
   */
  var SpecPolicy = keyMirror({
    /**
     * These methods may be defined only once by the class specification or mixin.
     */
    DEFINE_ONCE: null,
    /**
     * These methods may be defined by both the class specification and mixins.
     * Subsequent definitions will be chained. These methods must return void.
     */
    DEFINE_MANY: null,
    /**
     * These methods are overriding the base class.
     */
    OVERRIDE_BASE: null,
    /**
     * These methods are similar to DEFINE_MANY, except we assume they return
     * objects. We try to merge the keys of the return values of all the mixed in
     * functions. If there is a key conflict we throw.
     */
    DEFINE_MANY_MERGED: null
  });

  var injectedMixins = [];

  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */
  var ReactClassInterface = {

    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: SpecPolicy.DEFINE_MANY,

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: SpecPolicy.DEFINE_MANY,

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: SpecPolicy.DEFINE_MANY,

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: SpecPolicy.DEFINE_MANY,

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: SpecPolicy.DEFINE_MANY,

    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: SpecPolicy.DEFINE_MANY_MERGED,

    /**
     * @return {object}
     * @optional
     */
    getChildContext: SpecPolicy.DEFINE_MANY_MERGED,

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @nosideeffects
     * @required
     */
    render: SpecPolicy.DEFINE_ONCE,

    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: SpecPolicy.DEFINE_MANY,

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: SpecPolicy.DEFINE_MANY,

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: SpecPolicy.DEFINE_MANY,

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: SpecPolicy.DEFINE_MANY,

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: SpecPolicy.DEFINE_MANY,

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: SpecPolicy.DEFINE_MANY,

    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: SpecPolicy.OVERRIDE_BASE

  };

  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */
  var RESERVED_SPEC_KEYS = {
    displayName: function (Constructor, displayName) {
      Constructor.displayName = displayName;
    },
    mixins: function (Constructor, mixins) {
      if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
          mixSpecIntoComponent(Constructor, mixins[i]);
        }
      }
    },
    childContextTypes: function (Constructor, childContextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, childContextTypes, ReactPropTypeLocations.childContext);
      }
      Constructor.childContextTypes = _assign({}, Constructor.childContextTypes, childContextTypes);
    },
    contextTypes: function (Constructor, contextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, contextTypes, ReactPropTypeLocations.context);
      }
      Constructor.contextTypes = _assign({}, Constructor.contextTypes, contextTypes);
    },
    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function (Constructor, getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps);
      } else {
        Constructor.getDefaultProps = getDefaultProps;
      }
    },
    propTypes: function (Constructor, propTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, propTypes, ReactPropTypeLocations.prop);
      }
      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
    },
    statics: function (Constructor, statics) {
      mixStaticSpecIntoComponent(Constructor, statics);
    },
    autobind: function () {} };

  // noop
  function validateTypeDef(Constructor, typeDef, location) {
    for (var propName in typeDef) {
      if (typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an invariant so components
        // don't show up in prod but only in __DEV__
        process.env.NODE_ENV !== 'production' ? warning(typeof typeDef[propName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', Constructor.displayName || 'ReactClass', ReactPropTypeLocationNames[location], propName) : void 0;
      }
    }
  }

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;

    // Disallow overriding of base class methods unless explicitly allowed.
    if (ReactClassMixin.hasOwnProperty(name)) {
      !(specPolicy === SpecPolicy.OVERRIDE_BASE) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.', name) : _prodInvariant('73', name) : void 0;
    }

    // Disallow defining methods more than once unless explicitly allowed.
    if (isAlreadyDefined) {
      !(specPolicy === SpecPolicy.DEFINE_MANY || specPolicy === SpecPolicy.DEFINE_MANY_MERGED) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('74', name) : void 0;
    }
  }

  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */
  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      if (process.env.NODE_ENV !== 'production') {
        var typeofSpec = typeof spec;
        var isMixinValid = typeofSpec === 'object' && spec !== null;

        process.env.NODE_ENV !== 'production' ? warning(isMixinValid, '%s: You\'re attempting to include a mixin that is either null ' + 'or not an object. Check the mixins included by the component, ' + 'as well as any mixins they include themselves. ' + 'Expected object but got %s.', Constructor.displayName || 'ReactClass', spec === null ? null : typeofSpec) : void 0;
      }

      return;
    }

    !(typeof spec !== 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component class or function as a mixin. Instead, just use a regular object.') : _prodInvariant('75') : void 0;
    !!ReactElement.isValidElement(spec) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component as a mixin. Instead, just use a regular object.') : _prodInvariant('76') : void 0;

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs;

    // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.
    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name];

            // These cases should already be caught by validateMethodOverride.
            !(isReactClassMethod && (specPolicy === SpecPolicy.DEFINE_MANY_MERGED || specPolicy === SpecPolicy.DEFINE_MANY)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.', specPolicy, name) : _prodInvariant('77', specPolicy, name) : void 0;

            // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.
            if (specPolicy === SpecPolicy.DEFINE_MANY_MERGED) {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === SpecPolicy.DEFINE_MANY) {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;
            if (process.env.NODE_ENV !== 'production') {
              // Add verbose displayName to the function, which helps when looking
              // at profiling tools.
              if (typeof property === 'function' && spec.displayName) {
                proto[name].displayName = spec.displayName + '_' + name;
              }
            }
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }
    for (var name in statics) {
      var property = statics[name];
      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;
      !!isReserved ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.', name) : _prodInvariant('78', name) : void 0;

      var isInherited = name in Constructor;
      !!isInherited ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('79', name) : void 0;
      Constructor[name] = property;
    }
  }

  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */
  function mergeIntoWithNoDuplicateKeys(one, two) {
    !(one && two && typeof one === 'object' && typeof two === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.') : _prodInvariant('80') : void 0;

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        !(one[key] === undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.', key) : _prodInvariant('81', key) : void 0;
        one[key] = two[key];
      }
    }
    return one;
  }

  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);
      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }
      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }

  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }

  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */
  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);
    if (process.env.NODE_ENV !== 'production') {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function (newThis) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): React component methods may only be bound to the ' + 'component instance. See %s', componentName) : void 0;
        } else if (!args.length) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See %s', componentName) : void 0;
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }

  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */
  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;
    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */
  var ReactClassMixin = {

    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function (newState, callback) {
      this.updater.enqueueReplaceState(this, newState);
      if (callback) {
        this.updater.enqueueCallback(this, callback, 'replaceState');
      }
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function () {
      return this.updater.isMounted(this);
    }
  };

  var ReactClassComponent = function () {};
  _assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);

  /**
   * Module for creating composite components.
   *
   * @class ReactClass
   */
  var ReactClass = {

    /**
     * Creates a composite component class given a class specification.
     * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
     *
     * @param {object} spec Class specification (which must define `render`).
     * @return {function} Component constructor function.
     * @public
     */
    createClass: function (spec) {
      var Constructor = function (props, context, updater) {
        // This constructor gets overridden by mocks. The argument is used
        // by mocks to assert on what gets mounted.

        if (process.env.NODE_ENV !== 'production') {
          process.env.NODE_ENV !== 'production' ? warning(this instanceof Constructor, 'Something is calling a React component directly. Use a factory or ' + 'JSX instead. See: https://fb.me/react-legacyfactory') : void 0;
        }

        // Wire up auto-binding
        if (this.__reactAutoBindPairs.length) {
          bindAutoBindMethods(this);
        }

        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;

        this.state = null;

        // ReactClasses doesn't have constructors. Instead, they use the
        // getInitialState and componentWillMount methods for initialization.

        var initialState = this.getInitialState ? this.getInitialState() : null;
        if (process.env.NODE_ENV !== 'production') {
          // We allow auto-mocks to proceed as if they're returning null.
          if (initialState === undefined && this.getInitialState._isMockFunction) {
            // This is probably bad practice. Consider warning here and
            // deprecating this convenience.
            initialState = null;
          }
        }
        !(typeof initialState === 'object' && !Array.isArray(initialState)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent') : _prodInvariant('82', Constructor.displayName || 'ReactCompositeComponent') : void 0;

        this.state = initialState;
      };
      Constructor.prototype = new ReactClassComponent();
      Constructor.prototype.constructor = Constructor;
      Constructor.prototype.__reactAutoBindPairs = [];

      injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

      mixSpecIntoComponent(Constructor, spec);

      // Initialize the defaultProps property after all mixins have been merged.
      if (Constructor.getDefaultProps) {
        Constructor.defaultProps = Constructor.getDefaultProps();
      }

      if (process.env.NODE_ENV !== 'production') {
        // This is a tag to indicate that the use of these method names is ok,
        // since it's used with createClass. If it's not, then it's likely a
        // mistake so we'll warn you to use the static property, property
        // initializer or constructor respectively.
        if (Constructor.getDefaultProps) {
          Constructor.getDefaultProps.isReactClassApproved = {};
        }
        if (Constructor.prototype.getInitialState) {
          Constructor.prototype.getInitialState.isReactClassApproved = {};
        }
      }

      !Constructor.prototype.render ? process.env.NODE_ENV !== 'production' ? invariant(false, 'createClass(...): Class specification must implement a `render` method.') : _prodInvariant('83') : void 0;

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', spec.displayName || 'A component') : void 0;
        process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', spec.displayName || 'A component') : void 0;
      }

      // Reduce time spent doing lookups by setting these on the prototype.
      for (var methodName in ReactClassInterface) {
        if (!Constructor.prototype[methodName]) {
          Constructor.prototype[methodName] = null;
        }
      }

      return Constructor;
    },

    injection: {
      injectMixin: function (mixin) {
        injectedMixins.push(mixin);
      }
    }

  };

  module.exports = ReactClass;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

  /**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactPropTypeLocations
   */

  'use strict';

  var keyMirror = __webpack_require__(23);

  var ReactPropTypeLocations = keyMirror({
    prop: null,
    context: null,
    childContext: null
  });

  module.exports = ReactPropTypeLocations;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright (c) 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @typechecks static-only
   */

  'use strict';

  var invariant = __webpack_require__(8);

  /**
   * Constructs an enumeration with keys equal to their value.
   *
   * For example:
   *
   *   var COLORS = keyMirror({blue: null, red: null});
   *   var myColor = COLORS.blue;
   *   var isColorValid = !!COLORS[myColor];
   *
   * The last line could not be performed if the values of the generated enum were
   * not equal to their keys.
   *
   *   Input:  {key1: val1, key2: val2}
   *   Output: {key1: key1, key2: key2}
   *
   * @param {object} obj
   * @return {object}
   */
  var keyMirror = function keyMirror(obj) {
    var ret = {};
    var key;
    !(obj instanceof Object && !Array.isArray(obj)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'keyMirror(...): Argument must be an object.') : invariant(false) : void 0;
    for (key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      ret[key] = key;
    }
    return ret;
  };

  module.exports = keyMirror;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactPropTypeLocationNames
   */

  'use strict';

  var ReactPropTypeLocationNames = {};

  if (process.env.NODE_ENV !== 'production') {
    ReactPropTypeLocationNames = {
      prop: 'prop',
      context: 'context',
      childContext: 'child context'
    };
  }

  module.exports = ReactPropTypeLocationNames;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 25 */
/***/ function(module, exports) {

  "use strict";

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   */

  /**
   * Allows extraction of a minified key. Let's the build system minify keys
   * without losing the ability to dynamically use key strings as values
   * themselves. Pass in an object with a single key/val pair and it will return
   * you the string key of that single record. Suppose you want to grab the
   * value for a key 'className' inside of an object. Key/val minification may
   * have aliased that key to be 'xa12'. keyOf({className: null}) will return
   * 'xa12' in that case. Resolve keys you want to use once at startup time, then
   * reuse those resolutions.
   */
  var keyOf = function keyOf(oneKeyObj) {
    var key;
    for (key in oneKeyObj) {
      if (!oneKeyObj.hasOwnProperty(key)) {
        continue;
      }
      return key;
    }
    return null;
  };

  module.exports = keyOf;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactDOMFactories
   */

  'use strict';

  var ReactElement = __webpack_require__(9);

  /**
   * Create a factory that creates HTML tag elements.
   *
   * @private
   */
  var createDOMFactory = ReactElement.createFactory;
  if (process.env.NODE_ENV !== 'production') {
    var ReactElementValidator = __webpack_require__(27);
    createDOMFactory = ReactElementValidator.createFactory;
  }

  /**
   * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
   * This is also accessible via `React.DOM`.
   *
   * @public
   */
  var ReactDOMFactories = {
    a: createDOMFactory('a'),
    abbr: createDOMFactory('abbr'),
    address: createDOMFactory('address'),
    area: createDOMFactory('area'),
    article: createDOMFactory('article'),
    aside: createDOMFactory('aside'),
    audio: createDOMFactory('audio'),
    b: createDOMFactory('b'),
    base: createDOMFactory('base'),
    bdi: createDOMFactory('bdi'),
    bdo: createDOMFactory('bdo'),
    big: createDOMFactory('big'),
    blockquote: createDOMFactory('blockquote'),
    body: createDOMFactory('body'),
    br: createDOMFactory('br'),
    button: createDOMFactory('button'),
    canvas: createDOMFactory('canvas'),
    caption: createDOMFactory('caption'),
    cite: createDOMFactory('cite'),
    code: createDOMFactory('code'),
    col: createDOMFactory('col'),
    colgroup: createDOMFactory('colgroup'),
    data: createDOMFactory('data'),
    datalist: createDOMFactory('datalist'),
    dd: createDOMFactory('dd'),
    del: createDOMFactory('del'),
    details: createDOMFactory('details'),
    dfn: createDOMFactory('dfn'),
    dialog: createDOMFactory('dialog'),
    div: createDOMFactory('div'),
    dl: createDOMFactory('dl'),
    dt: createDOMFactory('dt'),
    em: createDOMFactory('em'),
    embed: createDOMFactory('embed'),
    fieldset: createDOMFactory('fieldset'),
    figcaption: createDOMFactory('figcaption'),
    figure: createDOMFactory('figure'),
    footer: createDOMFactory('footer'),
    form: createDOMFactory('form'),
    h1: createDOMFactory('h1'),
    h2: createDOMFactory('h2'),
    h3: createDOMFactory('h3'),
    h4: createDOMFactory('h4'),
    h5: createDOMFactory('h5'),
    h6: createDOMFactory('h6'),
    head: createDOMFactory('head'),
    header: createDOMFactory('header'),
    hgroup: createDOMFactory('hgroup'),
    hr: createDOMFactory('hr'),
    html: createDOMFactory('html'),
    i: createDOMFactory('i'),
    iframe: createDOMFactory('iframe'),
    img: createDOMFactory('img'),
    input: createDOMFactory('input'),
    ins: createDOMFactory('ins'),
    kbd: createDOMFactory('kbd'),
    keygen: createDOMFactory('keygen'),
    label: createDOMFactory('label'),
    legend: createDOMFactory('legend'),
    li: createDOMFactory('li'),
    link: createDOMFactory('link'),
    main: createDOMFactory('main'),
    map: createDOMFactory('map'),
    mark: createDOMFactory('mark'),
    menu: createDOMFactory('menu'),
    menuitem: createDOMFactory('menuitem'),
    meta: createDOMFactory('meta'),
    meter: createDOMFactory('meter'),
    nav: createDOMFactory('nav'),
    noscript: createDOMFactory('noscript'),
    object: createDOMFactory('object'),
    ol: createDOMFactory('ol'),
    optgroup: createDOMFactory('optgroup'),
    option: createDOMFactory('option'),
    output: createDOMFactory('output'),
    p: createDOMFactory('p'),
    param: createDOMFactory('param'),
    picture: createDOMFactory('picture'),
    pre: createDOMFactory('pre'),
    progress: createDOMFactory('progress'),
    q: createDOMFactory('q'),
    rp: createDOMFactory('rp'),
    rt: createDOMFactory('rt'),
    ruby: createDOMFactory('ruby'),
    s: createDOMFactory('s'),
    samp: createDOMFactory('samp'),
    script: createDOMFactory('script'),
    section: createDOMFactory('section'),
    select: createDOMFactory('select'),
    small: createDOMFactory('small'),
    source: createDOMFactory('source'),
    span: createDOMFactory('span'),
    strong: createDOMFactory('strong'),
    style: createDOMFactory('style'),
    sub: createDOMFactory('sub'),
    summary: createDOMFactory('summary'),
    sup: createDOMFactory('sup'),
    table: createDOMFactory('table'),
    tbody: createDOMFactory('tbody'),
    td: createDOMFactory('td'),
    textarea: createDOMFactory('textarea'),
    tfoot: createDOMFactory('tfoot'),
    th: createDOMFactory('th'),
    thead: createDOMFactory('thead'),
    time: createDOMFactory('time'),
    title: createDOMFactory('title'),
    tr: createDOMFactory('tr'),
    track: createDOMFactory('track'),
    u: createDOMFactory('u'),
    ul: createDOMFactory('ul'),
    'var': createDOMFactory('var'),
    video: createDOMFactory('video'),
    wbr: createDOMFactory('wbr'),

    // SVG
    circle: createDOMFactory('circle'),
    clipPath: createDOMFactory('clipPath'),
    defs: createDOMFactory('defs'),
    ellipse: createDOMFactory('ellipse'),
    g: createDOMFactory('g'),
    image: createDOMFactory('image'),
    line: createDOMFactory('line'),
    linearGradient: createDOMFactory('linearGradient'),
    mask: createDOMFactory('mask'),
    path: createDOMFactory('path'),
    pattern: createDOMFactory('pattern'),
    polygon: createDOMFactory('polygon'),
    polyline: createDOMFactory('polyline'),
    radialGradient: createDOMFactory('radialGradient'),
    rect: createDOMFactory('rect'),
    stop: createDOMFactory('stop'),
    svg: createDOMFactory('svg'),
    text: createDOMFactory('text'),
    tspan: createDOMFactory('tspan')
  };

  module.exports = ReactDOMFactories;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2014-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactElementValidator
   */

  /**
   * ReactElementValidator provides a wrapper around a element factory
   * which validates the props passed to the element. This is intended to be
   * used only in DEV and could be replaced by a static type checker for languages
   * that support it.
   */

  'use strict';

  var ReactCurrentOwner = __webpack_require__(10);
  var ReactComponentTreeHook = __webpack_require__(28);
  var ReactElement = __webpack_require__(9);
  var ReactPropTypeLocations = __webpack_require__(22);

  var checkReactTypeSpec = __webpack_require__(29);

  var canDefineProperty = __webpack_require__(13);
  var getIteratorFn = __webpack_require__(15);
  var warning = __webpack_require__(11);

  function getDeclarationErrorAddendum() {
    if (ReactCurrentOwner.current) {
      var name = ReactCurrentOwner.current.getName();
      if (name) {
        return ' Check the render method of `' + name + '`.';
      }
    }
    return '';
  }

  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */
  var ownerHasKeyUseWarning = {};

  function getCurrentComponentErrorInfo(parentType) {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
      if (parentName) {
        info = ' Check the top-level render call using <' + parentName + '>.';
      }
    }
    return info;
  }

  /**
   * Warn if the element doesn't have an explicit key assigned to it.
   * This element is in an array. The array could grow and shrink or be
   * reordered. All children that haven't already been validated are required to
   * have a "key" property assigned to it. Error statuses are cached so a warning
   * will only be shown once.
   *
   * @internal
   * @param {ReactElement} element Element that requires a key.
   * @param {*} parentType element's parent's type.
   */
  function validateExplicitKey(element, parentType) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }
    element._store.validated = true;

    var memoizer = ownerHasKeyUseWarning.uniqueKey || (ownerHasKeyUseWarning.uniqueKey = {});

    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
    if (memoizer[currentComponentErrorInfo]) {
      return;
    }
    memoizer[currentComponentErrorInfo] = true;

    // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.
    var childOwner = '';
    if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
      // Give the component that originally created this child.
      childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
    }

    process.env.NODE_ENV !== 'production' ? warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, ReactComponentTreeHook.getCurrentStackAddendum(element)) : void 0;
  }

  /**
   * Ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {ReactNode} node Statically passed child of any type.
   * @param {*} parentType node's parent's type.
   */
  function validateChildKeys(node, parentType) {
    if (typeof node !== 'object') {
      return;
    }
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];
        if (ReactElement.isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (ReactElement.isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);
      // Entry iterators provide implicit keys.
      if (iteratorFn) {
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step;
          while (!(step = iterator.next()).done) {
            if (ReactElement.isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }

  /**
   * Given an element, validate that its props follow the propTypes definition,
   * provided by the type.
   *
   * @param {ReactElement} element
   */
  function validatePropTypes(element) {
    var componentClass = element.type;
    if (typeof componentClass !== 'function') {
      return;
    }
    var name = componentClass.displayName || componentClass.name;
    if (componentClass.propTypes) {
      checkReactTypeSpec(componentClass.propTypes, element.props, ReactPropTypeLocations.prop, name, element, null);
    }
    if (typeof componentClass.getDefaultProps === 'function') {
      process.env.NODE_ENV !== 'production' ? warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
    }
  }

  var ReactElementValidator = {

    createElement: function (type, props, children) {
      var validType = typeof type === 'string' || typeof type === 'function';
      // We warn in this case but don't throw. We expect the element creation to
      // succeed and there will likely be errors in render.
      if (!validType) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'React.createElement: type should not be null, undefined, boolean, or ' + 'number. It should be a string (for DOM elements) or a ReactClass ' + '(for composite components).%s', getDeclarationErrorAddendum()) : void 0;
      }

      var element = ReactElement.createElement.apply(this, arguments);

      // The result can be nullish if a mock or a custom function is used.
      // TODO: Drop this when these are no longer allowed as the type argument.
      if (element == null) {
        return element;
      }

      // Skip key warning if the type isn't valid since our key validation logic
      // doesn't expect a non-string/function type and can throw confusing errors.
      // We don't want exception behavior to differ between dev and prod.
      // (Rendering will throw with a helpful message and as soon as the type is
      // fixed, the key warnings will appear.)
      if (validType) {
        for (var i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], type);
        }
      }

      validatePropTypes(element);

      return element;
    },

    createFactory: function (type) {
      var validatedFactory = ReactElementValidator.createElement.bind(null, type);
      // Legacy hook TODO: Warn if this is accessed
      validatedFactory.type = type;

      if (process.env.NODE_ENV !== 'production') {
        if (canDefineProperty) {
          Object.defineProperty(validatedFactory, 'type', {
            enumerable: false,
            get: function () {
              process.env.NODE_ENV !== 'production' ? warning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.') : void 0;
              Object.defineProperty(this, 'type', {
                value: type
              });
              return type;
            }
          });
        }
      }

      return validatedFactory;
    },

    cloneElement: function (element, props, children) {
      var newElement = ReactElement.cloneElement.apply(this, arguments);
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], newElement.type);
      }
      validatePropTypes(newElement);
      return newElement;
    }

  };

  module.exports = ReactElementValidator;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2016-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactComponentTreeHook
   */

  'use strict';

  var _prodInvariant = __webpack_require__(7);

  var ReactCurrentOwner = __webpack_require__(10);

  var invariant = __webpack_require__(8);
  var warning = __webpack_require__(11);

  function isNative(fn) {
    // Based on isNative() from Lodash
    var funcToString = Function.prototype.toString;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var reIsNative = RegExp('^' + funcToString
    // Take an example native function source for comparison
    .call(hasOwnProperty)
    // Strip regex characters so we can use it for regex
    .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
    // Remove hasOwnProperty from the template to make it generic
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
    try {
      var source = funcToString.call(fn);
      return reIsNative.test(source);
    } catch (err) {
      return false;
    }
  }

  var canUseCollections =
  // Array.from
  typeof Array.from === 'function' &&
  // Map
  typeof Map === 'function' && isNative(Map) &&
  // Map.prototype.keys
  Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
  // Set
  typeof Set === 'function' && isNative(Set) &&
  // Set.prototype.keys
  Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

  var itemMap;
  var rootIDSet;

  var itemByKey;
  var rootByKey;

  if (canUseCollections) {
    itemMap = new Map();
    rootIDSet = new Set();
  } else {
    itemByKey = {};
    rootByKey = {};
  }

  var unmountedIDs = [];

  // Use non-numeric keys to prevent V8 performance issues:
  // https://github.com/facebook/react/pull/7232
  function getKeyFromID(id) {
    return '.' + id;
  }
  function getIDFromKey(key) {
    return parseInt(key.substr(1), 10);
  }

  function get(id) {
    if (canUseCollections) {
      return itemMap.get(id);
    } else {
      var key = getKeyFromID(id);
      return itemByKey[key];
    }
  }

  function remove(id) {
    if (canUseCollections) {
      itemMap['delete'](id);
    } else {
      var key = getKeyFromID(id);
      delete itemByKey[key];
    }
  }

  function create(id, element, parentID) {
    var item = {
      element: element,
      parentID: parentID,
      text: null,
      childIDs: [],
      isMounted: false,
      updateCount: 0
    };

    if (canUseCollections) {
      itemMap.set(id, item);
    } else {
      var key = getKeyFromID(id);
      itemByKey[key] = item;
    }
  }

  function addRoot(id) {
    if (canUseCollections) {
      rootIDSet.add(id);
    } else {
      var key = getKeyFromID(id);
      rootByKey[key] = true;
    }
  }

  function removeRoot(id) {
    if (canUseCollections) {
      rootIDSet['delete'](id);
    } else {
      var key = getKeyFromID(id);
      delete rootByKey[key];
    }
  }

  function getRegisteredIDs() {
    if (canUseCollections) {
      return Array.from(itemMap.keys());
    } else {
      return Object.keys(itemByKey).map(getIDFromKey);
    }
  }

  function getRootIDs() {
    if (canUseCollections) {
      return Array.from(rootIDSet.keys());
    } else {
      return Object.keys(rootByKey).map(getIDFromKey);
    }
  }

  function purgeDeep(id) {
    var item = get(id);
    if (item) {
      var childIDs = item.childIDs;

      remove(id);
      childIDs.forEach(purgeDeep);
    }
  }

  function describeComponentFrame(name, source, ownerName) {
    return '\n    in ' + name + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
  }

  function getDisplayName(element) {
    if (element == null) {
      return '#empty';
    } else if (typeof element === 'string' || typeof element === 'number') {
      return '#text';
    } else if (typeof element.type === 'string') {
      return element.type;
    } else {
      return element.type.displayName || element.type.name || 'Unknown';
    }
  }

  function describeID(id) {
    var name = ReactComponentTreeHook.getDisplayName(id);
    var element = ReactComponentTreeHook.getElement(id);
    var ownerID = ReactComponentTreeHook.getOwnerID(id);
    var ownerName;
    if (ownerID) {
      ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
    }
    process.env.NODE_ENV !== 'production' ? warning(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id) : void 0;
    return describeComponentFrame(name, element && element._source, ownerName);
  }

  var ReactComponentTreeHook = {
    onSetChildren: function (id, nextChildIDs) {
      var item = get(id);
      item.childIDs = nextChildIDs;

      for (var i = 0; i < nextChildIDs.length; i++) {
        var nextChildID = nextChildIDs[i];
        var nextChild = get(nextChildID);
        !nextChild ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('140') : void 0;
        !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : _prodInvariant('141') : void 0;
        !nextChild.isMounted ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('71') : void 0;
        if (nextChild.parentID == null) {
          nextChild.parentID = id;
          // TODO: This shouldn't be necessary but mounting a new root during in
          // componentWillMount currently causes not-yet-mounted components to
          // be purged from our tree data so their parent ID is missing.
        }
        !(nextChild.parentID === id) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : _prodInvariant('142', nextChildID, nextChild.parentID, id) : void 0;
      }
    },
    onBeforeMountComponent: function (id, element, parentID) {
      create(id, element, parentID);
    },
    onBeforeUpdateComponent: function (id, element) {
      var item = get(id);
      if (!item || !item.isMounted) {
        // We may end up here as a result of setState() in componentWillUnmount().
        // In this case, ignore the element.
        return;
      }
      item.element = element;
    },
    onMountComponent: function (id) {
      var item = get(id);
      item.isMounted = true;
      var isRoot = item.parentID === 0;
      if (isRoot) {
        addRoot(id);
      }
    },
    onUpdateComponent: function (id) {
      var item = get(id);
      if (!item || !item.isMounted) {
        // We may end up here as a result of setState() in componentWillUnmount().
        // In this case, ignore the element.
        return;
      }
      item.updateCount++;
    },
    onUnmountComponent: function (id) {
      var item = get(id);
      if (item) {
        // We need to check if it exists.
        // `item` might not exist if it is inside an error boundary, and a sibling
        // error boundary child threw while mounting. Then this instance never
        // got a chance to mount, but it still gets an unmounting event during
        // the error boundary cleanup.
        item.isMounted = false;
        var isRoot = item.parentID === 0;
        if (isRoot) {
          removeRoot(id);
        }
      }
      unmountedIDs.push(id);
    },
    purgeUnmountedComponents: function () {
      if (ReactComponentTreeHook._preventPurging) {
        // Should only be used for testing.
        return;
      }

      for (var i = 0; i < unmountedIDs.length; i++) {
        var id = unmountedIDs[i];
        purgeDeep(id);
      }
      unmountedIDs.length = 0;
    },
    isMounted: function (id) {
      var item = get(id);
      return item ? item.isMounted : false;
    },
    getCurrentStackAddendum: function (topElement) {
      var info = '';
      if (topElement) {
        var type = topElement.type;
        var name = typeof type === 'function' ? type.displayName || type.name : type;
        var owner = topElement._owner;
        info += describeComponentFrame(name || 'Unknown', topElement._source, owner && owner.getName());
      }

      var currentOwner = ReactCurrentOwner.current;
      var id = currentOwner && currentOwner._debugID;

      info += ReactComponentTreeHook.getStackAddendumByID(id);
      return info;
    },
    getStackAddendumByID: function (id) {
      var info = '';
      while (id) {
        info += describeID(id);
        id = ReactComponentTreeHook.getParentID(id);
      }
      return info;
    },
    getChildIDs: function (id) {
      var item = get(id);
      return item ? item.childIDs : [];
    },
    getDisplayName: function (id) {
      var element = ReactComponentTreeHook.getElement(id);
      if (!element) {
        return null;
      }
      return getDisplayName(element);
    },
    getElement: function (id) {
      var item = get(id);
      return item ? item.element : null;
    },
    getOwnerID: function (id) {
      var element = ReactComponentTreeHook.getElement(id);
      if (!element || !element._owner) {
        return null;
      }
      return element._owner._debugID;
    },
    getParentID: function (id) {
      var item = get(id);
      return item ? item.parentID : null;
    },
    getSource: function (id) {
      var item = get(id);
      var element = item ? item.element : null;
      var source = element != null ? element._source : null;
      return source;
    },
    getText: function (id) {
      var element = ReactComponentTreeHook.getElement(id);
      if (typeof element === 'string') {
        return element;
      } else if (typeof element === 'number') {
        return '' + element;
      } else {
        return null;
      }
    },
    getUpdateCount: function (id) {
      var item = get(id);
      return item ? item.updateCount : 0;
    },


    getRegisteredIDs: getRegisteredIDs,

    getRootIDs: getRootIDs
  };

  module.exports = ReactComponentTreeHook;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule checkReactTypeSpec
   */

  'use strict';

  var _prodInvariant = __webpack_require__(7);

  var ReactPropTypeLocationNames = __webpack_require__(24);
  var ReactPropTypesSecret = __webpack_require__(30);

  var invariant = __webpack_require__(8);
  var warning = __webpack_require__(11);

  var ReactComponentTreeHook;

  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
    // Temporary hack.
    // Inline requires don't work well with Jest:
    // https://github.com/facebook/react/issues/7240
    // Remove the inline requires when we don't need them anymore:
    // https://github.com/facebook/react/pull/7178
    ReactComponentTreeHook = __webpack_require__(28);
  }

  var loggedTypeFailures = {};

  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?object} element The React element that is being type-checked
   * @param {?number} debugID The React component instance that is being type-checked
   * @private
   */
  function checkReactTypeSpec(typeSpecs, values, location, componentName, element, debugID) {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          !(typeof typeSpecs[typeSpecName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : _prodInvariant('84', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : void 0;
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        process.env.NODE_ENV !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName, typeof error) : void 0;
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var componentStackInfo = '';

          if (process.env.NODE_ENV !== 'production') {
            if (!ReactComponentTreeHook) {
              ReactComponentTreeHook = __webpack_require__(28);
            }
            if (debugID !== null) {
              componentStackInfo = ReactComponentTreeHook.getStackAddendumByID(debugID);
            } else if (element !== null) {
              componentStackInfo = ReactComponentTreeHook.getCurrentStackAddendum(element);
            }
          }

          process.env.NODE_ENV !== 'production' ? warning(false, 'Failed %s type: %s%s', location, error.message, componentStackInfo) : void 0;
        }
      }
    }
  }

  module.exports = checkReactTypeSpec;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 30 */
/***/ function(module, exports) {

  /**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactPropTypesSecret
   */

  'use strict';

  var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  module.exports = ReactPropTypesSecret;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactPropTypes
   */

  'use strict';

  var ReactElement = __webpack_require__(9);
  var ReactPropTypeLocationNames = __webpack_require__(24);
  var ReactPropTypesSecret = __webpack_require__(30);

  var emptyFunction = __webpack_require__(12);
  var getIteratorFn = __webpack_require__(15);
  var warning = __webpack_require__(11);

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;
      if (process.env.NODE_ENV !== 'production') {
        if (secret !== ReactPropTypesSecret && typeof console !== 'undefined') {
          var cacheKey = componentName + ':' + propName;
          if (!manualPropTypeCallCache[cacheKey]) {
            process.env.NODE_ENV !== 'production' ? warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will not work in the next major version. You may be ' + 'seeing this warning due to a third-party PropTypes library. ' + 'See https://fb.me/react-warning-dont-call-proptypes for details.', propFullName, componentName) : void 0;
            manualPropTypeCallCache[cacheKey] = true;
          }
        }
      }
      if (props[propName] == null) {
        var locationName = ReactPropTypeLocationNames[location];
        if (isRequired) {
          return new PropTypeError('Required ' + locationName + ' `' + propFullName + '` was not specified in ' + ('`' + componentName + '`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        var locationName = ReactPropTypeLocationNames[location];
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturns(null));
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var locationName = ReactPropTypeLocationNames[location];
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!ReactElement.isValidElement(propValue)) {
        var locationName = ReactPropTypeLocationNames[location];
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var locationName = ReactPropTypeLocationNames[location];
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var locationName = ReactPropTypeLocationNames[location];
      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        var locationName = ReactPropTypeLocationNames[location];
        return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        var locationName = ReactPropTypeLocationNames[location];
        return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        var locationName = ReactPropTypeLocationNames[location];
        return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || ReactElement.isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  module.exports = ReactPropTypes;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 32 */
/***/ function(module, exports) {

  /**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule ReactVersion
   */

  'use strict';

  module.exports = '15.3.1';

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {/**
   * Copyright 2013-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule onlyChild
   */
  'use strict';

  var _prodInvariant = __webpack_require__(7);

  var ReactElement = __webpack_require__(9);

  var invariant = __webpack_require__(8);

  /**
   * Returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * See https://facebook.github.io/react/docs/top-level-api.html#react.children.only
   *
   * The current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children Child collection structure.
   * @return {ReactElement} The first and only `ReactElement` contained in the
   * structure.
   */
  function onlyChild(children) {
    !ReactElement.isValidElement(children) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'React.Children.only expected to receive a single React element child.') : _prodInvariant('143') : void 0;
    return children;
  }

  module.exports = onlyChild;
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {'use strict';

  exports.__esModule = true;
  exports.compose = exports.applyMiddleware = exports.bindActionCreators = exports.combineReducers = exports.createStore = undefined;

  var _createStore = __webpack_require__(35);

  var _createStore2 = _interopRequireDefault(_createStore);

  var _combineReducers = __webpack_require__(43);

  var _combineReducers2 = _interopRequireDefault(_combineReducers);

  var _bindActionCreators = __webpack_require__(45);

  var _bindActionCreators2 = _interopRequireDefault(_bindActionCreators);

  var _applyMiddleware = __webpack_require__(46);

  var _applyMiddleware2 = _interopRequireDefault(_applyMiddleware);

  var _compose = __webpack_require__(47);

  var _compose2 = _interopRequireDefault(_compose);

  var _warning = __webpack_require__(44);

  var _warning2 = _interopRequireDefault(_warning);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  /*
  * This is a dummy function to check if the function name has been altered by minification.
  * If the function has been minified and NODE_ENV !== 'production', warn the user.
  */
  function isCrushed() {}

  if (process.env.NODE_ENV !== 'production' && typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
    (0, _warning2["default"])('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
  }

  exports.createStore = _createStore2["default"];
  exports.combineReducers = _combineReducers2["default"];
  exports.bindActionCreators = _bindActionCreators2["default"];
  exports.applyMiddleware = _applyMiddleware2["default"];
  exports.compose = _compose2["default"];
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  exports.__esModule = true;
  exports.ActionTypes = undefined;
  exports["default"] = createStore;

  var _isPlainObject = __webpack_require__(36);

  var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

  var _symbolObservable = __webpack_require__(41);

  var _symbolObservable2 = _interopRequireDefault(_symbolObservable);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  /**
   * These are private action types reserved by Redux.
   * For any unknown actions, you must return the current state.
   * If the current state is undefined, you must return the initial state.
   * Do not reference these action types directly in your code.
   */
  var ActionTypes = exports.ActionTypes = {
    INIT: '@@redux/INIT'
  };

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [initialState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} enhancer The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
  function createStore(reducer, initialState, enhancer) {
    var _ref2;

    if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
      enhancer = initialState;
      initialState = undefined;
    }

    if (typeof enhancer !== 'undefined') {
      if (typeof enhancer !== 'function') {
        throw new Error('Expected the enhancer to be a function.');
      }

      return enhancer(createStore)(reducer, initialState);
    }

    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.');
    }

    var currentReducer = reducer;
    var currentState = initialState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;

    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }

    /**
     * Reads the state tree managed by the store.
     *
     * @returns {any} The current state tree of your application.
     */
    function getState() {
      return currentState;
    }

    /**
     * Adds a change listener. It will be called any time an action is dispatched,
     * and some part of the state tree may potentially have changed. You may then
     * call `getState()` to read the current state tree inside the callback.
     *
     * You may call `dispatch()` from a change listener, with the following
     * caveats:
     *
     * 1. The subscriptions are snapshotted just before every `dispatch()` call.
     * If you subscribe or unsubscribe while the listeners are being invoked, this
     * will not have any effect on the `dispatch()` that is currently in progress.
     * However, the next `dispatch()` call, whether nested or not, will use a more
     * recent snapshot of the subscription list.
     *
     * 2. The listener should not expect to see all state changes, as the state
     * might have been updated multiple times during a nested `dispatch()` before
     * the listener is called. It is, however, guaranteed that all subscribers
     * registered before the `dispatch()` started will be called with the latest
     * state by the time it exits.
     *
     * @param {Function} listener A callback to be invoked on every dispatch.
     * @returns {Function} A function to remove this change listener.
     */
    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected listener to be a function.');
      }

      var isSubscribed = true;

      ensureCanMutateNextListeners();
      nextListeners.push(listener);

      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }

        isSubscribed = false;

        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
      };
    }

    /**
     * Dispatches an action. It is the only way to trigger a state change.
     *
     * The `reducer` function, used to create the store, will be called with the
     * current state tree and the given `action`. Its return value will
     * be considered the **next** state of the tree, and the change listeners
     * will be notified.
     *
     * The base implementation only supports plain object actions. If you want to
     * dispatch a Promise, an Observable, a thunk, or something else, you need to
     * wrap your store creating function into the corresponding middleware. For
     * example, see the documentation for the `redux-thunk` package. Even the
     * middleware will eventually dispatch plain object actions using this method.
     *
     * @param {Object} action A plain object representing “what changed”. It is
     * a good idea to keep actions serializable so you can record and replay user
     * sessions, or use the time travelling `redux-devtools`. An action must have
     * a `type` property which may not be `undefined`. It is a good idea to use
     * string constants for action types.
     *
     * @returns {Object} For convenience, the same action object you dispatched.
     *
     * Note that, if you use a custom middleware, it may wrap `dispatch()` to
     * return something else (for example, a Promise you can await).
     */
    function dispatch(action) {
      if (!(0, _isPlainObject2["default"])(action)) {
        throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
      }

      if (typeof action.type === 'undefined') {
        throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
      }

      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.');
      }

      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }

      var listeners = currentListeners = nextListeners;
      for (var i = 0; i < listeners.length; i++) {
        listeners[i]();
      }

      return action;
    }

    /**
     * Replaces the reducer currently used by the store to calculate the state.
     *
     * You might need this if your app implements code splitting and you want to
     * load some of the reducers dynamically. You might also need this if you
     * implement a hot reloading mechanism for Redux.
     *
     * @param {Function} nextReducer The reducer for the store to use instead.
     * @returns {void}
     */
    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== 'function') {
        throw new Error('Expected the nextReducer to be a function.');
      }

      currentReducer = nextReducer;
      dispatch({ type: ActionTypes.INIT });
    }

    /**
     * Interoperability point for observable/reactive libraries.
     * @returns {observable} A minimal observable of state changes.
     * For more information, see the observable proposal:
     * https://github.com/zenparsing/es-observable
     */
    function observable() {
      var _ref;

      var outerSubscribe = subscribe;
      return _ref = {
        /**
         * The minimal observable subscription method.
         * @param {Object} observer Any object that can be used as an observer.
         * The observer object should have a `next` method.
         * @returns {subscription} An object with an `unsubscribe` method that can
         * be used to unsubscribe the observable from the store, and prevent further
         * emission of values from the observable.
         */

        subscribe: function subscribe(observer) {
          if (typeof observer !== 'object') {
            throw new TypeError('Expected the observer to be an object.');
          }

          function observeState() {
            if (observer.next) {
              observer.next(getState());
            }
          }

          observeState();
          var unsubscribe = outerSubscribe(observeState);
          return { unsubscribe: unsubscribe };
        }
      }, _ref[_symbolObservable2["default"]] = function () {
        return this;
      }, _ref;
    }

    // When a store is created, an "INIT" action is dispatched so that every
    // reducer returns their initial state. This effectively populates
    // the initial state tree.
    dispatch({ type: ActionTypes.INIT });

    return _ref2 = {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer
    }, _ref2[_symbolObservable2["default"]] = observable, _ref2;
  }

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

  var getPrototype = __webpack_require__(37),
      isHostObject = __webpack_require__(39),
      isObjectLike = __webpack_require__(40);

  /** `Object#toString` result references. */
  var objectTag = '[object Object]';

  /** Used for built-in method references. */
  var funcProto = Function.prototype,
      objectProto = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString.call(Object);

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  function isPlainObject(value) {
    if (!isObjectLike(value) ||
        objectToString.call(value) != objectTag || isHostObject(value)) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return (typeof Ctor == 'function' &&
      Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
  }

  module.exports = isPlainObject;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

  var overArg = __webpack_require__(38);

  /** Built-in value references. */
  var getPrototype = overArg(Object.getPrototypeOf, Object);

  module.exports = getPrototype;


/***/ },
/* 38 */
/***/ function(module, exports) {

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  module.exports = overArg;


/***/ },
/* 39 */
/***/ function(module, exports) {

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != 'function') {
      try {
        result = !!(value + '');
      } catch (e) {}
    }
    return result;
  }

  module.exports = isHostObject;


/***/ },
/* 40 */
/***/ function(module, exports) {

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  module.exports = isObjectLike;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global) {/* global window */
  'use strict';

  module.exports = __webpack_require__(42)(global || window || this);

  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 42 */
/***/ function(module, exports) {

  'use strict';

  module.exports = function symbolObservablePonyfill(root) {
  	var result;
  	var Symbol = root.Symbol;

  	if (typeof Symbol === 'function') {
  		if (Symbol.observable) {
  			result = Symbol.observable;
  		} else {
  			result = Symbol('observable');
  			Symbol.observable = result;
  		}
  	} else {
  		result = '@@observable';
  	}

  	return result;
  };


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(process) {'use strict';

  exports.__esModule = true;
  exports["default"] = combineReducers;

  var _createStore = __webpack_require__(35);

  var _isPlainObject = __webpack_require__(36);

  var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

  var _warning = __webpack_require__(44);

  var _warning2 = _interopRequireDefault(_warning);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function getUndefinedStateErrorMessage(key, action) {
    var actionType = action && action.type;
    var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

    return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state.';
  }

  function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
    var reducerKeys = Object.keys(reducers);
    var argumentName = action && action.type === _createStore.ActionTypes.INIT ? 'initialState argument passed to createStore' : 'previous state received by the reducer';

    if (reducerKeys.length === 0) {
      return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
    }

    if (!(0, _isPlainObject2["default"])(inputState)) {
      return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
    }

    var unexpectedKeys = Object.keys(inputState).filter(function (key) {
      return !reducers.hasOwnProperty(key);
    });

    if (unexpectedKeys.length > 0) {
      return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
    }
  }

  function assertReducerSanity(reducers) {
    Object.keys(reducers).forEach(function (key) {
      var reducer = reducers[key];
      var initialState = reducer(undefined, { type: _createStore.ActionTypes.INIT });

      if (typeof initialState === 'undefined') {
        throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined.');
      }

      var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
      if (typeof reducer(undefined, { type: type }) === 'undefined') {
        throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + _createStore.ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined.');
      }
    });
  }

  /**
   * Turns an object whose values are different reducer functions, into a single
   * reducer function. It will call every child reducer, and gather their results
   * into a single state object, whose keys correspond to the keys of the passed
   * reducer functions.
   *
   * @param {Object} reducers An object whose values correspond to different
   * reducer functions that need to be combined into one. One handy way to obtain
   * it is to use ES6 `import * as reducers` syntax. The reducers may never return
   * undefined for any action. Instead, they should return their initial state
   * if the state passed to them was undefined, and the current state for any
   * unrecognized action.
   *
   * @returns {Function} A reducer function that invokes every reducer inside the
   * passed object, and builds a state object with the same shape.
   */
  function combineReducers(reducers) {
    var reducerKeys = Object.keys(reducers);
    var finalReducers = {};
    for (var i = 0; i < reducerKeys.length; i++) {
      var key = reducerKeys[i];
      if (typeof reducers[key] === 'function') {
        finalReducers[key] = reducers[key];
      }
    }
    var finalReducerKeys = Object.keys(finalReducers);

    var sanityError;
    try {
      assertReducerSanity(finalReducers);
    } catch (e) {
      sanityError = e;
    }

    return function combination() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var action = arguments[1];

      if (sanityError) {
        throw sanityError;
      }

      if (process.env.NODE_ENV !== 'production') {
        var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action);
        if (warningMessage) {
          (0, _warning2["default"])(warningMessage);
        }
      }

      var hasChanged = false;
      var nextState = {};
      for (var i = 0; i < finalReducerKeys.length; i++) {
        var key = finalReducerKeys[i];
        var reducer = finalReducers[key];
        var previousStateForKey = state[key];
        var nextStateForKey = reducer(previousStateForKey, action);
        if (typeof nextStateForKey === 'undefined') {
          var errorMessage = getUndefinedStateErrorMessage(key, action);
          throw new Error(errorMessage);
        }
        nextState[key] = nextStateForKey;
        hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      }
      return hasChanged ? nextState : state;
    };
  }
  /* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ },
/* 44 */
/***/ function(module, exports) {

  'use strict';

  exports.__esModule = true;
  exports["default"] = warning;
  /**
   * Prints a warning in the console if it exists.
   *
   * @param {String} message The warning message.
   * @returns {void}
   */
  function warning(message) {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error(message);
    }
    /* eslint-enable no-console */
    try {
      // This error was thrown as a convenience so that if you enable
      // "break on all exceptions" in your console,
      // it would pause the execution at this line.
      throw new Error(message);
      /* eslint-disable no-empty */
    } catch (e) {}
    /* eslint-enable no-empty */
  }

/***/ },
/* 45 */
/***/ function(module, exports) {

  'use strict';

  exports.__esModule = true;
  exports["default"] = bindActionCreators;
  function bindActionCreator(actionCreator, dispatch) {
    return function () {
      return dispatch(actionCreator.apply(undefined, arguments));
    };
  }

  /**
   * Turns an object whose values are action creators, into an object with the
   * same keys, but with every function wrapped into a `dispatch` call so they
   * may be invoked directly. This is just a convenience method, as you can call
   * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
   *
   * For convenience, you can also pass a single function as the first argument,
   * and get a function in return.
   *
   * @param {Function|Object} actionCreators An object whose values are action
   * creator functions. One handy way to obtain it is to use ES6 `import * as`
   * syntax. You may also pass a single function.
   *
   * @param {Function} dispatch The `dispatch` function available on your Redux
   * store.
   *
   * @returns {Function|Object} The object mimicking the original object, but with
   * every action creator wrapped into the `dispatch` call. If you passed a
   * function as `actionCreators`, the return value will also be a single
   * function.
   */
  function bindActionCreators(actionCreators, dispatch) {
    if (typeof actionCreators === 'function') {
      return bindActionCreator(actionCreators, dispatch);
    }

    if (typeof actionCreators !== 'object' || actionCreators === null) {
      throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
    }

    var keys = Object.keys(actionCreators);
    var boundActionCreators = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var actionCreator = actionCreators[key];
      if (typeof actionCreator === 'function') {
        boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
      }
    }
    return boundActionCreators;
  }

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  exports.__esModule = true;

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  exports["default"] = applyMiddleware;

  var _compose = __webpack_require__(47);

  var _compose2 = _interopRequireDefault(_compose);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  /**
   * Creates a store enhancer that applies middleware to the dispatch method
   * of the Redux store. This is handy for a variety of tasks, such as expressing
   * asynchronous actions in a concise manner, or logging every action payload.
   *
   * See `redux-thunk` package as an example of the Redux middleware.
   *
   * Because middleware is potentially asynchronous, this should be the first
   * store enhancer in the composition chain.
   *
   * Note that each middleware will be given the `dispatch` and `getState` functions
   * as named arguments.
   *
   * @param {...Function} middlewares The middleware chain to be applied.
   * @returns {Function} A store enhancer applying the middleware.
   */
  function applyMiddleware() {
    for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
      middlewares[_key] = arguments[_key];
    }

    return function (createStore) {
      return function (reducer, initialState, enhancer) {
        var store = createStore(reducer, initialState, enhancer);
        var _dispatch = store.dispatch;
        var chain = [];

        var middlewareAPI = {
          getState: store.getState,
          dispatch: function dispatch(action) {
            return _dispatch(action);
          }
        };
        chain = middlewares.map(function (middleware) {
          return middleware(middlewareAPI);
        });
        _dispatch = _compose2["default"].apply(undefined, chain)(store.dispatch);

        return _extends({}, store, {
          dispatch: _dispatch
        });
      };
    };
  }

/***/ },
/* 47 */
/***/ function(module, exports) {

  "use strict";

  exports.__esModule = true;
  exports["default"] = compose;
  /**
   * Composes single-argument functions from right to left. The rightmost
   * function can take multiple arguments as it provides the signature for
   * the resulting composite function.
   *
   * @param {...Function} funcs The functions to compose.
   * @returns {Function} A function obtained by composing the argument functions
   * from right to left. For example, compose(f, g, h) is identical to doing
   * (...args) => f(g(h(...args))).
   */

  function compose() {
    for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
      funcs[_key] = arguments[_key];
    }

    if (funcs.length === 0) {
      return function (arg) {
        return arg;
      };
    } else {
      var _ret = function () {
        var last = funcs[funcs.length - 1];
        var rest = funcs.slice(0, -1);
        return {
          v: function v() {
            return rest.reduceRight(function (composed, f) {
              return f(composed);
            }, last.apply(undefined, arguments));
          }
        };
      }();

      if (typeof _ret === "object") return _ret.v;
    }
  }

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  __webpack_require__(49);

  __webpack_require__(51);

  __webpack_require__(52);

  __webpack_require__(53);

  __webpack_require__(54);

  // import './css/bootstrap-material-design.css'
  // import './css/normalize.css'
  ;

  var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;
  ;

  var _temp2 = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;

/***/ },
/* 49 */
/***/ function(module, exports) {

  // removed by extract-text-webpack-plugin

/***/ },
/* 50 */,
/* 51 */
/***/ function(module, exports) {

  // removed by extract-text-webpack-plugin

/***/ },
/* 52 */
/***/ function(module, exports) {

  // removed by extract-text-webpack-plugin

/***/ },
/* 53 */
/***/ function(module, exports) {

  // removed by extract-text-webpack-plugin

/***/ },
/* 54 */
/***/ function(module, exports) {

  // removed by extract-text-webpack-plugin

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

  var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
   * jQuery JavaScript Library v2.2.4
   * http://jquery.com/
   *
   * Includes Sizzle.js
   * http://sizzlejs.com/
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license
   * http://jquery.org/license
   *
   * Date: 2016-05-20T17:23Z
   */

  (function( global, factory ) {

  	if ( typeof module === "object" && typeof module.exports === "object" ) {
  		// For CommonJS and CommonJS-like environments where a proper `window`
  		// is present, execute the factory and get jQuery.
  		// For environments that do not have a `window` with a `document`
  		// (such as Node.js), expose a factory as module.exports.
  		// This accentuates the need for the creation of a real `window`.
  		// e.g. var jQuery = require("jquery")(window);
  		// See ticket #14549 for more info.
  		module.exports = global.document ?
  			factory( global, true ) :
  			function( w ) {
  				if ( !w.document ) {
  					throw new Error( "jQuery requires a window with a document" );
  				}
  				return factory( w );
  			};
  	} else {
  		factory( global );
  	}

  // Pass this if window is not defined yet
  }(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

  // Support: Firefox 18+
  // Can't be in strict mode, several libs including ASP.NET trace
  // the stack via arguments.caller.callee and Firefox dies if
  // you try to trace through "use strict" call chains. (#13335)
  //"use strict";
  var arr = [];

  var document = window.document;

  var slice = arr.slice;

  var concat = arr.concat;

  var push = arr.push;

  var indexOf = arr.indexOf;

  var class2type = {};

  var toString = class2type.toString;

  var hasOwn = class2type.hasOwnProperty;

  var support = {};



  var
  	version = "2.2.4",

  	// Define a local copy of jQuery
  	jQuery = function( selector, context ) {

  		// The jQuery object is actually just the init constructor 'enhanced'
  		// Need init if jQuery is called (just allow error to be thrown if not included)
  		return new jQuery.fn.init( selector, context );
  	},

  	// Support: Android<4.1
  	// Make sure we trim BOM and NBSP
  	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

  	// Matches dashed string for camelizing
  	rmsPrefix = /^-ms-/,
  	rdashAlpha = /-([\da-z])/gi,

  	// Used by jQuery.camelCase as callback to replace()
  	fcamelCase = function( all, letter ) {
  		return letter.toUpperCase();
  	};

  jQuery.fn = jQuery.prototype = {

  	// The current version of jQuery being used
  	jquery: version,

  	constructor: jQuery,

  	// Start with an empty selector
  	selector: "",

  	// The default length of a jQuery object is 0
  	length: 0,

  	toArray: function() {
  		return slice.call( this );
  	},

  	// Get the Nth element in the matched element set OR
  	// Get the whole matched element set as a clean array
  	get: function( num ) {
  		return num != null ?

  			// Return just the one element from the set
  			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

  			// Return all the elements in a clean array
  			slice.call( this );
  	},

  	// Take an array of elements and push it onto the stack
  	// (returning the new matched element set)
  	pushStack: function( elems ) {

  		// Build a new jQuery matched element set
  		var ret = jQuery.merge( this.constructor(), elems );

  		// Add the old object onto the stack (as a reference)
  		ret.prevObject = this;
  		ret.context = this.context;

  		// Return the newly-formed element set
  		return ret;
  	},

  	// Execute a callback for every element in the matched set.
  	each: function( callback ) {
  		return jQuery.each( this, callback );
  	},

  	map: function( callback ) {
  		return this.pushStack( jQuery.map( this, function( elem, i ) {
  			return callback.call( elem, i, elem );
  		} ) );
  	},

  	slice: function() {
  		return this.pushStack( slice.apply( this, arguments ) );
  	},

  	first: function() {
  		return this.eq( 0 );
  	},

  	last: function() {
  		return this.eq( -1 );
  	},

  	eq: function( i ) {
  		var len = this.length,
  			j = +i + ( i < 0 ? len : 0 );
  		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
  	},

  	end: function() {
  		return this.prevObject || this.constructor();
  	},

  	// For internal use only.
  	// Behaves like an Array's method, not like a jQuery method.
  	push: push,
  	sort: arr.sort,
  	splice: arr.splice
  };

  jQuery.extend = jQuery.fn.extend = function() {
  	var options, name, src, copy, copyIsArray, clone,
  		target = arguments[ 0 ] || {},
  		i = 1,
  		length = arguments.length,
  		deep = false;

  	// Handle a deep copy situation
  	if ( typeof target === "boolean" ) {
  		deep = target;

  		// Skip the boolean and the target
  		target = arguments[ i ] || {};
  		i++;
  	}

  	// Handle case when target is a string or something (possible in deep copy)
  	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
  		target = {};
  	}

  	// Extend jQuery itself if only one argument is passed
  	if ( i === length ) {
  		target = this;
  		i--;
  	}

  	for ( ; i < length; i++ ) {

  		// Only deal with non-null/undefined values
  		if ( ( options = arguments[ i ] ) != null ) {

  			// Extend the base object
  			for ( name in options ) {
  				src = target[ name ];
  				copy = options[ name ];

  				// Prevent never-ending loop
  				if ( target === copy ) {
  					continue;
  				}

  				// Recurse if we're merging plain objects or arrays
  				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
  					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

  					if ( copyIsArray ) {
  						copyIsArray = false;
  						clone = src && jQuery.isArray( src ) ? src : [];

  					} else {
  						clone = src && jQuery.isPlainObject( src ) ? src : {};
  					}

  					// Never move original objects, clone them
  					target[ name ] = jQuery.extend( deep, clone, copy );

  				// Don't bring in undefined values
  				} else if ( copy !== undefined ) {
  					target[ name ] = copy;
  				}
  			}
  		}
  	}

  	// Return the modified object
  	return target;
  };

  jQuery.extend( {

  	// Unique for each copy of jQuery on the page
  	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

  	// Assume jQuery is ready without the ready module
  	isReady: true,

  	error: function( msg ) {
  		throw new Error( msg );
  	},

  	noop: function() {},

  	isFunction: function( obj ) {
  		return jQuery.type( obj ) === "function";
  	},

  	isArray: Array.isArray,

  	isWindow: function( obj ) {
  		return obj != null && obj === obj.window;
  	},

  	isNumeric: function( obj ) {

  		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
  		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
  		// subtraction forces infinities to NaN
  		// adding 1 corrects loss of precision from parseFloat (#15100)
  		var realStringObj = obj && obj.toString();
  		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
  	},

  	isPlainObject: function( obj ) {
  		var key;

  		// Not plain objects:
  		// - Any object or value whose internal [[Class]] property is not "[object Object]"
  		// - DOM nodes
  		// - window
  		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
  			return false;
  		}

  		// Not own constructor property must be Object
  		if ( obj.constructor &&
  				!hasOwn.call( obj, "constructor" ) &&
  				!hasOwn.call( obj.constructor.prototype || {}, "isPrototypeOf" ) ) {
  			return false;
  		}

  		// Own properties are enumerated firstly, so to speed up,
  		// if last one is own, then all properties are own
  		for ( key in obj ) {}

  		return key === undefined || hasOwn.call( obj, key );
  	},

  	isEmptyObject: function( obj ) {
  		var name;
  		for ( name in obj ) {
  			return false;
  		}
  		return true;
  	},

  	type: function( obj ) {
  		if ( obj == null ) {
  			return obj + "";
  		}

  		// Support: Android<4.0, iOS<6 (functionish RegExp)
  		return typeof obj === "object" || typeof obj === "function" ?
  			class2type[ toString.call( obj ) ] || "object" :
  			typeof obj;
  	},

  	// Evaluates a script in a global context
  	globalEval: function( code ) {
  		var script,
  			indirect = eval;

  		code = jQuery.trim( code );

  		if ( code ) {

  			// If the code includes a valid, prologue position
  			// strict mode pragma, execute code by injecting a
  			// script tag into the document.
  			if ( code.indexOf( "use strict" ) === 1 ) {
  				script = document.createElement( "script" );
  				script.text = code;
  				document.head.appendChild( script ).parentNode.removeChild( script );
  			} else {

  				// Otherwise, avoid the DOM node creation, insertion
  				// and removal by using an indirect global eval

  				indirect( code );
  			}
  		}
  	},

  	// Convert dashed to camelCase; used by the css and data modules
  	// Support: IE9-11+
  	// Microsoft forgot to hump their vendor prefix (#9572)
  	camelCase: function( string ) {
  		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
  	},

  	nodeName: function( elem, name ) {
  		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
  	},

  	each: function( obj, callback ) {
  		var length, i = 0;

  		if ( isArrayLike( obj ) ) {
  			length = obj.length;
  			for ( ; i < length; i++ ) {
  				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
  					break;
  				}
  			}
  		} else {
  			for ( i in obj ) {
  				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
  					break;
  				}
  			}
  		}

  		return obj;
  	},

  	// Support: Android<4.1
  	trim: function( text ) {
  		return text == null ?
  			"" :
  			( text + "" ).replace( rtrim, "" );
  	},

  	// results is for internal usage only
  	makeArray: function( arr, results ) {
  		var ret = results || [];

  		if ( arr != null ) {
  			if ( isArrayLike( Object( arr ) ) ) {
  				jQuery.merge( ret,
  					typeof arr === "string" ?
  					[ arr ] : arr
  				);
  			} else {
  				push.call( ret, arr );
  			}
  		}

  		return ret;
  	},

  	inArray: function( elem, arr, i ) {
  		return arr == null ? -1 : indexOf.call( arr, elem, i );
  	},

  	merge: function( first, second ) {
  		var len = +second.length,
  			j = 0,
  			i = first.length;

  		for ( ; j < len; j++ ) {
  			first[ i++ ] = second[ j ];
  		}

  		first.length = i;

  		return first;
  	},

  	grep: function( elems, callback, invert ) {
  		var callbackInverse,
  			matches = [],
  			i = 0,
  			length = elems.length,
  			callbackExpect = !invert;

  		// Go through the array, only saving the items
  		// that pass the validator function
  		for ( ; i < length; i++ ) {
  			callbackInverse = !callback( elems[ i ], i );
  			if ( callbackInverse !== callbackExpect ) {
  				matches.push( elems[ i ] );
  			}
  		}

  		return matches;
  	},

  	// arg is for internal usage only
  	map: function( elems, callback, arg ) {
  		var length, value,
  			i = 0,
  			ret = [];

  		// Go through the array, translating each of the items to their new values
  		if ( isArrayLike( elems ) ) {
  			length = elems.length;
  			for ( ; i < length; i++ ) {
  				value = callback( elems[ i ], i, arg );

  				if ( value != null ) {
  					ret.push( value );
  				}
  			}

  		// Go through every key on the object,
  		} else {
  			for ( i in elems ) {
  				value = callback( elems[ i ], i, arg );

  				if ( value != null ) {
  					ret.push( value );
  				}
  			}
  		}

  		// Flatten any nested arrays
  		return concat.apply( [], ret );
  	},

  	// A global GUID counter for objects
  	guid: 1,

  	// Bind a function to a context, optionally partially applying any
  	// arguments.
  	proxy: function( fn, context ) {
  		var tmp, args, proxy;

  		if ( typeof context === "string" ) {
  			tmp = fn[ context ];
  			context = fn;
  			fn = tmp;
  		}

  		// Quick check to determine if target is callable, in the spec
  		// this throws a TypeError, but we will just return undefined.
  		if ( !jQuery.isFunction( fn ) ) {
  			return undefined;
  		}

  		// Simulated bind
  		args = slice.call( arguments, 2 );
  		proxy = function() {
  			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
  		};

  		// Set the guid of unique handler to the same of original handler, so it can be removed
  		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

  		return proxy;
  	},

  	now: Date.now,

  	// jQuery.support is not used in Core but other projects attach their
  	// properties to it so it needs to exist.
  	support: support
  } );

  // JSHint would error on this code due to the Symbol not being defined in ES5.
  // Defining this global in .jshintrc would create a danger of using the global
  // unguarded in another place, it seems safer to just disable JSHint for these
  // three lines.
  /* jshint ignore: start */
  if ( typeof Symbol === "function" ) {
  	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
  }
  /* jshint ignore: end */

  // Populate the class2type map
  jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
  function( i, name ) {
  	class2type[ "[object " + name + "]" ] = name.toLowerCase();
  } );

  function isArrayLike( obj ) {

  	// Support: iOS 8.2 (not reproducible in simulator)
  	// `in` check used to prevent JIT error (gh-2145)
  	// hasOwn isn't used here due to false negatives
  	// regarding Nodelist length in IE
  	var length = !!obj && "length" in obj && obj.length,
  		type = jQuery.type( obj );

  	if ( type === "function" || jQuery.isWindow( obj ) ) {
  		return false;
  	}

  	return type === "array" || length === 0 ||
  		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
  }
  var Sizzle =
  /*!
   * Sizzle CSS Selector Engine v2.2.1
   * http://sizzlejs.com/
   *
   * Copyright jQuery Foundation and other contributors
   * Released under the MIT license
   * http://jquery.org/license
   *
   * Date: 2015-10-17
   */
  (function( window ) {

  var i,
  	support,
  	Expr,
  	getText,
  	isXML,
  	tokenize,
  	compile,
  	select,
  	outermostContext,
  	sortInput,
  	hasDuplicate,

  	// Local document vars
  	setDocument,
  	document,
  	docElem,
  	documentIsHTML,
  	rbuggyQSA,
  	rbuggyMatches,
  	matches,
  	contains,

  	// Instance-specific data
  	expando = "sizzle" + 1 * new Date(),
  	preferredDoc = window.document,
  	dirruns = 0,
  	done = 0,
  	classCache = createCache(),
  	tokenCache = createCache(),
  	compilerCache = createCache(),
  	sortOrder = function( a, b ) {
  		if ( a === b ) {
  			hasDuplicate = true;
  		}
  		return 0;
  	},

  	// General-purpose constants
  	MAX_NEGATIVE = 1 << 31,

  	// Instance methods
  	hasOwn = ({}).hasOwnProperty,
  	arr = [],
  	pop = arr.pop,
  	push_native = arr.push,
  	push = arr.push,
  	slice = arr.slice,
  	// Use a stripped-down indexOf as it's faster than native
  	// http://jsperf.com/thor-indexof-vs-for/5
  	indexOf = function( list, elem ) {
  		var i = 0,
  			len = list.length;
  		for ( ; i < len; i++ ) {
  			if ( list[i] === elem ) {
  				return i;
  			}
  		}
  		return -1;
  	},

  	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

  	// Regular expressions

  	// http://www.w3.org/TR/css3-selectors/#whitespace
  	whitespace = "[\\x20\\t\\r\\n\\f]",

  	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
  	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

  	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
  	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
  		// Operator (capture 2)
  		"*([*^$|!~]?=)" + whitespace +
  		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
  		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
  		"*\\]",

  	pseudos = ":(" + identifier + ")(?:\\((" +
  		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
  		// 1. quoted (capture 3; capture 4 or capture 5)
  		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
  		// 2. simple (capture 6)
  		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
  		// 3. anything else (capture 2)
  		".*" +
  		")\\)|)",

  	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
  	rwhitespace = new RegExp( whitespace + "+", "g" ),
  	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

  	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
  	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

  	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

  	rpseudo = new RegExp( pseudos ),
  	ridentifier = new RegExp( "^" + identifier + "$" ),

  	matchExpr = {
  		"ID": new RegExp( "^#(" + identifier + ")" ),
  		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
  		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
  		"ATTR": new RegExp( "^" + attributes ),
  		"PSEUDO": new RegExp( "^" + pseudos ),
  		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
  			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
  			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
  		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
  		// For use in libraries implementing .is()
  		// We use this for POS matching in `select`
  		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
  			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
  	},

  	rinputs = /^(?:input|select|textarea|button)$/i,
  	rheader = /^h\d$/i,

  	rnative = /^[^{]+\{\s*\[native \w/,

  	// Easily-parseable/retrievable ID or TAG or CLASS selectors
  	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

  	rsibling = /[+~]/,
  	rescape = /'|\\/g,

  	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
  	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
  	funescape = function( _, escaped, escapedWhitespace ) {
  		var high = "0x" + escaped - 0x10000;
  		// NaN means non-codepoint
  		// Support: Firefox<24
  		// Workaround erroneous numeric interpretation of +"0x"
  		return high !== high || escapedWhitespace ?
  			escaped :
  			high < 0 ?
  				// BMP codepoint
  				String.fromCharCode( high + 0x10000 ) :
  				// Supplemental Plane codepoint (surrogate pair)
  				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
  	},

  	// Used for iframes
  	// See setDocument()
  	// Removing the function wrapper causes a "Permission Denied"
  	// error in IE
  	unloadHandler = function() {
  		setDocument();
  	};

  // Optimize for push.apply( _, NodeList )
  try {
  	push.apply(
  		(arr = slice.call( preferredDoc.childNodes )),
  		preferredDoc.childNodes
  	);
  	// Support: Android<4.0
  	// Detect silently failing push.apply
  	arr[ preferredDoc.childNodes.length ].nodeType;
  } catch ( e ) {
  	push = { apply: arr.length ?

  		// Leverage slice if possible
  		function( target, els ) {
  			push_native.apply( target, slice.call(els) );
  		} :

  		// Support: IE<9
  		// Otherwise append directly
  		function( target, els ) {
  			var j = target.length,
  				i = 0;
  			// Can't trust NodeList.length
  			while ( (target[j++] = els[i++]) ) {}
  			target.length = j - 1;
  		}
  	};
  }

  function Sizzle( selector, context, results, seed ) {
  	var m, i, elem, nid, nidselect, match, groups, newSelector,
  		newContext = context && context.ownerDocument,

  		// nodeType defaults to 9, since context defaults to document
  		nodeType = context ? context.nodeType : 9;

  	results = results || [];

  	// Return early from calls with invalid selector or context
  	if ( typeof selector !== "string" || !selector ||
  		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

  		return results;
  	}

  	// Try to shortcut find operations (as opposed to filters) in HTML documents
  	if ( !seed ) {

  		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
  			setDocument( context );
  		}
  		context = context || document;

  		if ( documentIsHTML ) {

  			// If the selector is sufficiently simple, try using a "get*By*" DOM method
  			// (excepting DocumentFragment context, where the methods don't exist)
  			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

  				// ID selector
  				if ( (m = match[1]) ) {

  					// Document context
  					if ( nodeType === 9 ) {
  						if ( (elem = context.getElementById( m )) ) {

  							// Support: IE, Opera, Webkit
  							// TODO: identify versions
  							// getElementById can match elements by name instead of ID
  							if ( elem.id === m ) {
  								results.push( elem );
  								return results;
  							}
  						} else {
  							return results;
  						}

  					// Element context
  					} else {

  						// Support: IE, Opera, Webkit
  						// TODO: identify versions
  						// getElementById can match elements by name instead of ID
  						if ( newContext && (elem = newContext.getElementById( m )) &&
  							contains( context, elem ) &&
  							elem.id === m ) {

  							results.push( elem );
  							return results;
  						}
  					}

  				// Type selector
  				} else if ( match[2] ) {
  					push.apply( results, context.getElementsByTagName( selector ) );
  					return results;

  				// Class selector
  				} else if ( (m = match[3]) && support.getElementsByClassName &&
  					context.getElementsByClassName ) {

  					push.apply( results, context.getElementsByClassName( m ) );
  					return results;
  				}
  			}

  			// Take advantage of querySelectorAll
  			if ( support.qsa &&
  				!compilerCache[ selector + " " ] &&
  				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

  				if ( nodeType !== 1 ) {
  					newContext = context;
  					newSelector = selector;

  				// qSA looks outside Element context, which is not what we want
  				// Thanks to Andrew Dupont for this workaround technique
  				// Support: IE <=8
  				// Exclude object elements
  				} else if ( context.nodeName.toLowerCase() !== "object" ) {

  					// Capture the context ID, setting it first if necessary
  					if ( (nid = context.getAttribute( "id" )) ) {
  						nid = nid.replace( rescape, "\\$&" );
  					} else {
  						context.setAttribute( "id", (nid = expando) );
  					}

  					// Prefix every selector in the list
  					groups = tokenize( selector );
  					i = groups.length;
  					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
  					while ( i-- ) {
  						groups[i] = nidselect + " " + toSelector( groups[i] );
  					}
  					newSelector = groups.join( "," );

  					// Expand context for sibling selectors
  					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
  						context;
  				}

  				if ( newSelector ) {
  					try {
  						push.apply( results,
  							newContext.querySelectorAll( newSelector )
  						);
  						return results;
  					} catch ( qsaError ) {
  					} finally {
  						if ( nid === expando ) {
  							context.removeAttribute( "id" );
  						}
  					}
  				}
  			}
  		}
  	}

  	// All others
  	return select( selector.replace( rtrim, "$1" ), context, results, seed );
  }

  /**
   * Create key-value caches of limited size
   * @returns {function(string, object)} Returns the Object data after storing it on itself with
   *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
   *	deleting the oldest entry
   */
  function createCache() {
  	var keys = [];

  	function cache( key, value ) {
  		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
  		if ( keys.push( key + " " ) > Expr.cacheLength ) {
  			// Only keep the most recent entries
  			delete cache[ keys.shift() ];
  		}
  		return (cache[ key + " " ] = value);
  	}
  	return cache;
  }

  /**
   * Mark a function for special use by Sizzle
   * @param {Function} fn The function to mark
   */
  function markFunction( fn ) {
  	fn[ expando ] = true;
  	return fn;
  }

  /**
   * Support testing using an element
   * @param {Function} fn Passed the created div and expects a boolean result
   */
  function assert( fn ) {
  	var div = document.createElement("div");

  	try {
  		return !!fn( div );
  	} catch (e) {
  		return false;
  	} finally {
  		// Remove from its parent by default
  		if ( div.parentNode ) {
  			div.parentNode.removeChild( div );
  		}
  		// release memory in IE
  		div = null;
  	}
  }

  /**
   * Adds the same handler for all of the specified attrs
   * @param {String} attrs Pipe-separated list of attributes
   * @param {Function} handler The method that will be applied
   */
  function addHandle( attrs, handler ) {
  	var arr = attrs.split("|"),
  		i = arr.length;

  	while ( i-- ) {
  		Expr.attrHandle[ arr[i] ] = handler;
  	}
  }

  /**
   * Checks document order of two siblings
   * @param {Element} a
   * @param {Element} b
   * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
   */
  function siblingCheck( a, b ) {
  	var cur = b && a,
  		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
  			( ~b.sourceIndex || MAX_NEGATIVE ) -
  			( ~a.sourceIndex || MAX_NEGATIVE );

  	// Use IE sourceIndex if available on both nodes
  	if ( diff ) {
  		return diff;
  	}

  	// Check if b follows a
  	if ( cur ) {
  		while ( (cur = cur.nextSibling) ) {
  			if ( cur === b ) {
  				return -1;
  			}
  		}
  	}

  	return a ? 1 : -1;
  }

  /**
   * Returns a function to use in pseudos for input types
   * @param {String} type
   */
  function createInputPseudo( type ) {
  	return function( elem ) {
  		var name = elem.nodeName.toLowerCase();
  		return name === "input" && elem.type === type;
  	};
  }

  /**
   * Returns a function to use in pseudos for buttons
   * @param {String} type
   */
  function createButtonPseudo( type ) {
  	return function( elem ) {
  		var name = elem.nodeName.toLowerCase();
  		return (name === "input" || name === "button") && elem.type === type;
  	};
  }

  /**
   * Returns a function to use in pseudos for positionals
   * @param {Function} fn
   */
  function createPositionalPseudo( fn ) {
  	return markFunction(function( argument ) {
  		argument = +argument;
  		return markFunction(function( seed, matches ) {
  			var j,
  				matchIndexes = fn( [], seed.length, argument ),
  				i = matchIndexes.length;

  			// Match elements found at the specified indexes
  			while ( i-- ) {
  				if ( seed[ (j = matchIndexes[i]) ] ) {
  					seed[j] = !(matches[j] = seed[j]);
  				}
  			}
  		});
  	});
  }

  /**
   * Checks a node for validity as a Sizzle context
   * @param {Element|Object=} context
   * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
   */
  function testContext( context ) {
  	return context && typeof context.getElementsByTagName !== "undefined" && context;
  }

  // Expose support vars for convenience
  support = Sizzle.support = {};

  /**
   * Detects XML nodes
   * @param {Element|Object} elem An element or a document
   * @returns {Boolean} True iff elem is a non-HTML XML node
   */
  isXML = Sizzle.isXML = function( elem ) {
  	// documentElement is verified for cases where it doesn't yet exist
  	// (such as loading iframes in IE - #4833)
  	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
  	return documentElement ? documentElement.nodeName !== "HTML" : false;
  };

  /**
   * Sets document-related variables once based on the current document
   * @param {Element|Object} [doc] An element or document object to use to set the document
   * @returns {Object} Returns the current document
   */
  setDocument = Sizzle.setDocument = function( node ) {
  	var hasCompare, parent,
  		doc = node ? node.ownerDocument || node : preferredDoc;

  	// Return early if doc is invalid or already selected
  	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
  		return document;
  	}

  	// Update global variables
  	document = doc;
  	docElem = document.documentElement;
  	documentIsHTML = !isXML( document );

  	// Support: IE 9-11, Edge
  	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
  	if ( (parent = document.defaultView) && parent.top !== parent ) {
  		// Support: IE 11
  		if ( parent.addEventListener ) {
  			parent.addEventListener( "unload", unloadHandler, false );

  		// Support: IE 9 - 10 only
  		} else if ( parent.attachEvent ) {
  			parent.attachEvent( "onunload", unloadHandler );
  		}
  	}

  	/* Attributes
  	---------------------------------------------------------------------- */

  	// Support: IE<8
  	// Verify that getAttribute really returns attributes and not properties
  	// (excepting IE8 booleans)
  	support.attributes = assert(function( div ) {
  		div.className = "i";
  		return !div.getAttribute("className");
  	});

  	/* getElement(s)By*
  	---------------------------------------------------------------------- */

  	// Check if getElementsByTagName("*") returns only elements
  	support.getElementsByTagName = assert(function( div ) {
  		div.appendChild( document.createComment("") );
  		return !div.getElementsByTagName("*").length;
  	});

  	// Support: IE<9
  	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

  	// Support: IE<10
  	// Check if getElementById returns elements by name
  	// The broken getElementById methods don't pick up programatically-set names,
  	// so use a roundabout getElementsByName test
  	support.getById = assert(function( div ) {
  		docElem.appendChild( div ).id = expando;
  		return !document.getElementsByName || !document.getElementsByName( expando ).length;
  	});

  	// ID find and filter
  	if ( support.getById ) {
  		Expr.find["ID"] = function( id, context ) {
  			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
  				var m = context.getElementById( id );
  				return m ? [ m ] : [];
  			}
  		};
  		Expr.filter["ID"] = function( id ) {
  			var attrId = id.replace( runescape, funescape );
  			return function( elem ) {
  				return elem.getAttribute("id") === attrId;
  			};
  		};
  	} else {
  		// Support: IE6/7
  		// getElementById is not reliable as a find shortcut
  		delete Expr.find["ID"];

  		Expr.filter["ID"] =  function( id ) {
  			var attrId = id.replace( runescape, funescape );
  			return function( elem ) {
  				var node = typeof elem.getAttributeNode !== "undefined" &&
  					elem.getAttributeNode("id");
  				return node && node.value === attrId;
  			};
  		};
  	}

  	// Tag
  	Expr.find["TAG"] = support.getElementsByTagName ?
  		function( tag, context ) {
  			if ( typeof context.getElementsByTagName !== "undefined" ) {
  				return context.getElementsByTagName( tag );

  			// DocumentFragment nodes don't have gEBTN
  			} else if ( support.qsa ) {
  				return context.querySelectorAll( tag );
  			}
  		} :

  		function( tag, context ) {
  			var elem,
  				tmp = [],
  				i = 0,
  				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
  				results = context.getElementsByTagName( tag );

  			// Filter out possible comments
  			if ( tag === "*" ) {
  				while ( (elem = results[i++]) ) {
  					if ( elem.nodeType === 1 ) {
  						tmp.push( elem );
  					}
  				}

  				return tmp;
  			}
  			return results;
  		};

  	// Class
  	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
  		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
  			return context.getElementsByClassName( className );
  		}
  	};

  	/* QSA/matchesSelector
  	---------------------------------------------------------------------- */

  	// QSA and matchesSelector support

  	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
  	rbuggyMatches = [];

  	// qSa(:focus) reports false when true (Chrome 21)
  	// We allow this because of a bug in IE8/9 that throws an error
  	// whenever `document.activeElement` is accessed on an iframe
  	// So, we allow :focus to pass through QSA all the time to avoid the IE error
  	// See http://bugs.jquery.com/ticket/13378
  	rbuggyQSA = [];

  	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
  		// Build QSA regex
  		// Regex strategy adopted from Diego Perini
  		assert(function( div ) {
  			// Select is set to empty string on purpose
  			// This is to test IE's treatment of not explicitly
  			// setting a boolean content attribute,
  			// since its presence should be enough
  			// http://bugs.jquery.com/ticket/12359
  			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
  				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
  				"<option selected=''></option></select>";

  			// Support: IE8, Opera 11-12.16
  			// Nothing should be selected when empty strings follow ^= or $= or *=
  			// The test attribute must be unknown in Opera but "safe" for WinRT
  			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
  			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
  				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
  			}

  			// Support: IE8
  			// Boolean attributes and "value" are not treated correctly
  			if ( !div.querySelectorAll("[selected]").length ) {
  				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
  			}

  			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
  			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
  				rbuggyQSA.push("~=");
  			}

  			// Webkit/Opera - :checked should return selected option elements
  			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
  			// IE8 throws error here and will not see later tests
  			if ( !div.querySelectorAll(":checked").length ) {
  				rbuggyQSA.push(":checked");
  			}

  			// Support: Safari 8+, iOS 8+
  			// https://bugs.webkit.org/show_bug.cgi?id=136851
  			// In-page `selector#id sibing-combinator selector` fails
  			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
  				rbuggyQSA.push(".#.+[+~]");
  			}
  		});

  		assert(function( div ) {
  			// Support: Windows 8 Native Apps
  			// The type and name attributes are restricted during .innerHTML assignment
  			var input = document.createElement("input");
  			input.setAttribute( "type", "hidden" );
  			div.appendChild( input ).setAttribute( "name", "D" );

  			// Support: IE8
  			// Enforce case-sensitivity of name attribute
  			if ( div.querySelectorAll("[name=d]").length ) {
  				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
  			}

  			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
  			// IE8 throws error here and will not see later tests
  			if ( !div.querySelectorAll(":enabled").length ) {
  				rbuggyQSA.push( ":enabled", ":disabled" );
  			}

  			// Opera 10-11 does not throw on post-comma invalid pseudos
  			div.querySelectorAll("*,:x");
  			rbuggyQSA.push(",.*:");
  		});
  	}

  	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
  		docElem.webkitMatchesSelector ||
  		docElem.mozMatchesSelector ||
  		docElem.oMatchesSelector ||
  		docElem.msMatchesSelector) )) ) {

  		assert(function( div ) {
  			// Check to see if it's possible to do matchesSelector
  			// on a disconnected node (IE 9)
  			support.disconnectedMatch = matches.call( div, "div" );

  			// This should fail with an exception
  			// Gecko does not error, returns false instead
  			matches.call( div, "[s!='']:x" );
  			rbuggyMatches.push( "!=", pseudos );
  		});
  	}

  	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
  	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

  	/* Contains
  	---------------------------------------------------------------------- */
  	hasCompare = rnative.test( docElem.compareDocumentPosition );

  	// Element contains another
  	// Purposefully self-exclusive
  	// As in, an element does not contain itself
  	contains = hasCompare || rnative.test( docElem.contains ) ?
  		function( a, b ) {
  			var adown = a.nodeType === 9 ? a.documentElement : a,
  				bup = b && b.parentNode;
  			return a === bup || !!( bup && bup.nodeType === 1 && (
  				adown.contains ?
  					adown.contains( bup ) :
  					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
  			));
  		} :
  		function( a, b ) {
  			if ( b ) {
  				while ( (b = b.parentNode) ) {
  					if ( b === a ) {
  						return true;
  					}
  				}
  			}
  			return false;
  		};

  	/* Sorting
  	---------------------------------------------------------------------- */

  	// Document order sorting
  	sortOrder = hasCompare ?
  	function( a, b ) {

  		// Flag for duplicate removal
  		if ( a === b ) {
  			hasDuplicate = true;
  			return 0;
  		}

  		// Sort on method existence if only one input has compareDocumentPosition
  		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
  		if ( compare ) {
  			return compare;
  		}

  		// Calculate position if both inputs belong to the same document
  		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
  			a.compareDocumentPosition( b ) :

  			// Otherwise we know they are disconnected
  			1;

  		// Disconnected nodes
  		if ( compare & 1 ||
  			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

  			// Choose the first element that is related to our preferred document
  			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
  				return -1;
  			}
  			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
  				return 1;
  			}

  			// Maintain original order
  			return sortInput ?
  				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
  				0;
  		}

  		return compare & 4 ? -1 : 1;
  	} :
  	function( a, b ) {
  		// Exit early if the nodes are identical
  		if ( a === b ) {
  			hasDuplicate = true;
  			return 0;
  		}

  		var cur,
  			i = 0,
  			aup = a.parentNode,
  			bup = b.parentNode,
  			ap = [ a ],
  			bp = [ b ];

  		// Parentless nodes are either documents or disconnected
  		if ( !aup || !bup ) {
  			return a === document ? -1 :
  				b === document ? 1 :
  				aup ? -1 :
  				bup ? 1 :
  				sortInput ?
  				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
  				0;

  		// If the nodes are siblings, we can do a quick check
  		} else if ( aup === bup ) {
  			return siblingCheck( a, b );
  		}

  		// Otherwise we need full lists of their ancestors for comparison
  		cur = a;
  		while ( (cur = cur.parentNode) ) {
  			ap.unshift( cur );
  		}
  		cur = b;
  		while ( (cur = cur.parentNode) ) {
  			bp.unshift( cur );
  		}

  		// Walk down the tree looking for a discrepancy
  		while ( ap[i] === bp[i] ) {
  			i++;
  		}

  		return i ?
  			// Do a sibling check if the nodes have a common ancestor
  			siblingCheck( ap[i], bp[i] ) :

  			// Otherwise nodes in our document sort first
  			ap[i] === preferredDoc ? -1 :
  			bp[i] === preferredDoc ? 1 :
  			0;
  	};

  	return document;
  };

  Sizzle.matches = function( expr, elements ) {
  	return Sizzle( expr, null, null, elements );
  };

  Sizzle.matchesSelector = function( elem, expr ) {
  	// Set document vars if needed
  	if ( ( elem.ownerDocument || elem ) !== document ) {
  		setDocument( elem );
  	}

  	// Make sure that attribute selectors are quoted
  	expr = expr.replace( rattributeQuotes, "='$1']" );

  	if ( support.matchesSelector && documentIsHTML &&
  		!compilerCache[ expr + " " ] &&
  		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
  		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

  		try {
  			var ret = matches.call( elem, expr );

  			// IE 9's matchesSelector returns false on disconnected nodes
  			if ( ret || support.disconnectedMatch ||
  					// As well, disconnected nodes are said to be in a document
  					// fragment in IE 9
  					elem.document && elem.document.nodeType !== 11 ) {
  				return ret;
  			}
  		} catch (e) {}
  	}

  	return Sizzle( expr, document, null, [ elem ] ).length > 0;
  };

  Sizzle.contains = function( context, elem ) {
  	// Set document vars if needed
  	if ( ( context.ownerDocument || context ) !== document ) {
  		setDocument( context );
  	}
  	return contains( context, elem );
  };

  Sizzle.attr = function( elem, name ) {
  	// Set document vars if needed
  	if ( ( elem.ownerDocument || elem ) !== document ) {
  		setDocument( elem );
  	}

  	var fn = Expr.attrHandle[ name.toLowerCase() ],
  		// Don't get fooled by Object.prototype properties (jQuery #13807)
  		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
  			fn( elem, name, !documentIsHTML ) :
  			undefined;

  	return val !== undefined ?
  		val :
  		support.attributes || !documentIsHTML ?
  			elem.getAttribute( name ) :
  			(val = elem.getAttributeNode(name)) && val.specified ?
  				val.value :
  				null;
  };

  Sizzle.error = function( msg ) {
  	throw new Error( "Syntax error, unrecognized expression: " + msg );
  };

  /**
   * Document sorting and removing duplicates
   * @param {ArrayLike} results
   */
  Sizzle.uniqueSort = function( results ) {
  	var elem,
  		duplicates = [],
  		j = 0,
  		i = 0;

  	// Unless we *know* we can detect duplicates, assume their presence
  	hasDuplicate = !support.detectDuplicates;
  	sortInput = !support.sortStable && results.slice( 0 );
  	results.sort( sortOrder );

  	if ( hasDuplicate ) {
  		while ( (elem = results[i++]) ) {
  			if ( elem === results[ i ] ) {
  				j = duplicates.push( i );
  			}
  		}
  		while ( j-- ) {
  			results.splice( duplicates[ j ], 1 );
  		}
  	}

  	// Clear input after sorting to release objects
  	// See https://github.com/jquery/sizzle/pull/225
  	sortInput = null;

  	return results;
  };

  /**
   * Utility function for retrieving the text value of an array of DOM nodes
   * @param {Array|Element} elem
   */
  getText = Sizzle.getText = function( elem ) {
  	var node,
  		ret = "",
  		i = 0,
  		nodeType = elem.nodeType;

  	if ( !nodeType ) {
  		// If no nodeType, this is expected to be an array
  		while ( (node = elem[i++]) ) {
  			// Do not traverse comment nodes
  			ret += getText( node );
  		}
  	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
  		// Use textContent for elements
  		// innerText usage removed for consistency of new lines (jQuery #11153)
  		if ( typeof elem.textContent === "string" ) {
  			return elem.textContent;
  		} else {
  			// Traverse its children
  			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
  				ret += getText( elem );
  			}
  		}
  	} else if ( nodeType === 3 || nodeType === 4 ) {
  		return elem.nodeValue;
  	}
  	// Do not include comment or processing instruction nodes

  	return ret;
  };

  Expr = Sizzle.selectors = {

  	// Can be adjusted by the user
  	cacheLength: 50,

  	createPseudo: markFunction,

  	match: matchExpr,

  	attrHandle: {},

  	find: {},

  	relative: {
  		">": { dir: "parentNode", first: true },
  		" ": { dir: "parentNode" },
  		"+": { dir: "previousSibling", first: true },
  		"~": { dir: "previousSibling" }
  	},

  	preFilter: {
  		"ATTR": function( match ) {
  			match[1] = match[1].replace( runescape, funescape );

  			// Move the given value to match[3] whether quoted or unquoted
  			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

  			if ( match[2] === "~=" ) {
  				match[3] = " " + match[3] + " ";
  			}

  			return match.slice( 0, 4 );
  		},

  		"CHILD": function( match ) {
  			/* matches from matchExpr["CHILD"]
  				1 type (only|nth|...)
  				2 what (child|of-type)
  				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
  				4 xn-component of xn+y argument ([+-]?\d*n|)
  				5 sign of xn-component
  				6 x of xn-component
  				7 sign of y-component
  				8 y of y-component
  			*/
  			match[1] = match[1].toLowerCase();

  			if ( match[1].slice( 0, 3 ) === "nth" ) {
  				// nth-* requires argument
  				if ( !match[3] ) {
  					Sizzle.error( match[0] );
  				}

  				// numeric x and y parameters for Expr.filter.CHILD
  				// remember that false/true cast respectively to 0/1
  				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
  				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

  			// other types prohibit arguments
  			} else if ( match[3] ) {
  				Sizzle.error( match[0] );
  			}

  			return match;
  		},

  		"PSEUDO": function( match ) {
  			var excess,
  				unquoted = !match[6] && match[2];

  			if ( matchExpr["CHILD"].test( match[0] ) ) {
  				return null;
  			}

  			// Accept quoted arguments as-is
  			if ( match[3] ) {
  				match[2] = match[4] || match[5] || "";

  			// Strip excess characters from unquoted arguments
  			} else if ( unquoted && rpseudo.test( unquoted ) &&
  				// Get excess from tokenize (recursively)
  				(excess = tokenize( unquoted, true )) &&
  				// advance to the next closing parenthesis
  				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

  				// excess is a negative index
  				match[0] = match[0].slice( 0, excess );
  				match[2] = unquoted.slice( 0, excess );
  			}

  			// Return only captures needed by the pseudo filter method (type and argument)
  			return match.slice( 0, 3 );
  		}
  	},

  	filter: {

  		"TAG": function( nodeNameSelector ) {
  			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
  			return nodeNameSelector === "*" ?
  				function() { return true; } :
  				function( elem ) {
  					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
  				};
  		},

  		"CLASS": function( className ) {
  			var pattern = classCache[ className + " " ];

  			return pattern ||
  				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
  				classCache( className, function( elem ) {
  					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
  				});
  		},

  		"ATTR": function( name, operator, check ) {
  			return function( elem ) {
  				var result = Sizzle.attr( elem, name );

  				if ( result == null ) {
  					return operator === "!=";
  				}
  				if ( !operator ) {
  					return true;
  				}

  				result += "";

  				return operator === "=" ? result === check :
  					operator === "!=" ? result !== check :
  					operator === "^=" ? check && result.indexOf( check ) === 0 :
  					operator === "*=" ? check && result.indexOf( check ) > -1 :
  					operator === "$=" ? check && result.slice( -check.length ) === check :
  					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
  					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
  					false;
  			};
  		},

  		"CHILD": function( type, what, argument, first, last ) {
  			var simple = type.slice( 0, 3 ) !== "nth",
  				forward = type.slice( -4 ) !== "last",
  				ofType = what === "of-type";

  			return first === 1 && last === 0 ?

  				// Shortcut for :nth-*(n)
  				function( elem ) {
  					return !!elem.parentNode;
  				} :

  				function( elem, context, xml ) {
  					var cache, uniqueCache, outerCache, node, nodeIndex, start,
  						dir = simple !== forward ? "nextSibling" : "previousSibling",
  						parent = elem.parentNode,
  						name = ofType && elem.nodeName.toLowerCase(),
  						useCache = !xml && !ofType,
  						diff = false;

  					if ( parent ) {

  						// :(first|last|only)-(child|of-type)
  						if ( simple ) {
  							while ( dir ) {
  								node = elem;
  								while ( (node = node[ dir ]) ) {
  									if ( ofType ?
  										node.nodeName.toLowerCase() === name :
  										node.nodeType === 1 ) {

  										return false;
  									}
  								}
  								// Reverse direction for :only-* (if we haven't yet done so)
  								start = dir = type === "only" && !start && "nextSibling";
  							}
  							return true;
  						}

  						start = [ forward ? parent.firstChild : parent.lastChild ];

  						// non-xml :nth-child(...) stores cache data on `parent`
  						if ( forward && useCache ) {

  							// Seek `elem` from a previously-cached index

  							// ...in a gzip-friendly way
  							node = parent;
  							outerCache = node[ expando ] || (node[ expando ] = {});

  							// Support: IE <9 only
  							// Defend against cloned attroperties (jQuery gh-1709)
  							uniqueCache = outerCache[ node.uniqueID ] ||
  								(outerCache[ node.uniqueID ] = {});

  							cache = uniqueCache[ type ] || [];
  							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
  							diff = nodeIndex && cache[ 2 ];
  							node = nodeIndex && parent.childNodes[ nodeIndex ];

  							while ( (node = ++nodeIndex && node && node[ dir ] ||

  								// Fallback to seeking `elem` from the start
  								(diff = nodeIndex = 0) || start.pop()) ) {

  								// When found, cache indexes on `parent` and break
  								if ( node.nodeType === 1 && ++diff && node === elem ) {
  									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
  									break;
  								}
  							}

  						} else {
  							// Use previously-cached element index if available
  							if ( useCache ) {
  								// ...in a gzip-friendly way
  								node = elem;
  								outerCache = node[ expando ] || (node[ expando ] = {});

  								// Support: IE <9 only
  								// Defend against cloned attroperties (jQuery gh-1709)
  								uniqueCache = outerCache[ node.uniqueID ] ||
  									(outerCache[ node.uniqueID ] = {});

  								cache = uniqueCache[ type ] || [];
  								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
  								diff = nodeIndex;
  							}

  							// xml :nth-child(...)
  							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
  							if ( diff === false ) {
  								// Use the same loop as above to seek `elem` from the start
  								while ( (node = ++nodeIndex && node && node[ dir ] ||
  									(diff = nodeIndex = 0) || start.pop()) ) {

  									if ( ( ofType ?
  										node.nodeName.toLowerCase() === name :
  										node.nodeType === 1 ) &&
  										++diff ) {

  										// Cache the index of each encountered element
  										if ( useCache ) {
  											outerCache = node[ expando ] || (node[ expando ] = {});

  											// Support: IE <9 only
  											// Defend against cloned attroperties (jQuery gh-1709)
  											uniqueCache = outerCache[ node.uniqueID ] ||
  												(outerCache[ node.uniqueID ] = {});

  											uniqueCache[ type ] = [ dirruns, diff ];
  										}

  										if ( node === elem ) {
  											break;
  										}
  									}
  								}
  							}
  						}

  						// Incorporate the offset, then check against cycle size
  						diff -= last;
  						return diff === first || ( diff % first === 0 && diff / first >= 0 );
  					}
  				};
  		},

  		"PSEUDO": function( pseudo, argument ) {
  			// pseudo-class names are case-insensitive
  			// http://www.w3.org/TR/selectors/#pseudo-classes
  			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
  			// Remember that setFilters inherits from pseudos
  			var args,
  				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
  					Sizzle.error( "unsupported pseudo: " + pseudo );

  			// The user may use createPseudo to indicate that
  			// arguments are needed to create the filter function
  			// just as Sizzle does
  			if ( fn[ expando ] ) {
  				return fn( argument );
  			}

  			// But maintain support for old signatures
  			if ( fn.length > 1 ) {
  				args = [ pseudo, pseudo, "", argument ];
  				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
  					markFunction(function( seed, matches ) {
  						var idx,
  							matched = fn( seed, argument ),
  							i = matched.length;
  						while ( i-- ) {
  							idx = indexOf( seed, matched[i] );
  							seed[ idx ] = !( matches[ idx ] = matched[i] );
  						}
  					}) :
  					function( elem ) {
  						return fn( elem, 0, args );
  					};
  			}

  			return fn;
  		}
  	},

  	pseudos: {
  		// Potentially complex pseudos
  		"not": markFunction(function( selector ) {
  			// Trim the selector passed to compile
  			// to avoid treating leading and trailing
  			// spaces as combinators
  			var input = [],
  				results = [],
  				matcher = compile( selector.replace( rtrim, "$1" ) );

  			return matcher[ expando ] ?
  				markFunction(function( seed, matches, context, xml ) {
  					var elem,
  						unmatched = matcher( seed, null, xml, [] ),
  						i = seed.length;

  					// Match elements unmatched by `matcher`
  					while ( i-- ) {
  						if ( (elem = unmatched[i]) ) {
  							seed[i] = !(matches[i] = elem);
  						}
  					}
  				}) :
  				function( elem, context, xml ) {
  					input[0] = elem;
  					matcher( input, null, xml, results );
  					// Don't keep the element (issue #299)
  					input[0] = null;
  					return !results.pop();
  				};
  		}),

  		"has": markFunction(function( selector ) {
  			return function( elem ) {
  				return Sizzle( selector, elem ).length > 0;
  			};
  		}),

  		"contains": markFunction(function( text ) {
  			text = text.replace( runescape, funescape );
  			return function( elem ) {
  				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
  			};
  		}),

  		// "Whether an element is represented by a :lang() selector
  		// is based solely on the element's language value
  		// being equal to the identifier C,
  		// or beginning with the identifier C immediately followed by "-".
  		// The matching of C against the element's language value is performed case-insensitively.
  		// The identifier C does not have to be a valid language name."
  		// http://www.w3.org/TR/selectors/#lang-pseudo
  		"lang": markFunction( function( lang ) {
  			// lang value must be a valid identifier
  			if ( !ridentifier.test(lang || "") ) {
  				Sizzle.error( "unsupported lang: " + lang );
  			}
  			lang = lang.replace( runescape, funescape ).toLowerCase();
  			return function( elem ) {
  				var elemLang;
  				do {
  					if ( (elemLang = documentIsHTML ?
  						elem.lang :
  						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

  						elemLang = elemLang.toLowerCase();
  						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
  					}
  				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
  				return false;
  			};
  		}),

  		// Miscellaneous
  		"target": function( elem ) {
  			var hash = window.location && window.location.hash;
  			return hash && hash.slice( 1 ) === elem.id;
  		},

  		"root": function( elem ) {
  			return elem === docElem;
  		},

  		"focus": function( elem ) {
  			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
  		},

  		// Boolean properties
  		"enabled": function( elem ) {
  			return elem.disabled === false;
  		},

  		"disabled": function( elem ) {
  			return elem.disabled === true;
  		},

  		"checked": function( elem ) {
  			// In CSS3, :checked should return both checked and selected elements
  			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
  			var nodeName = elem.nodeName.toLowerCase();
  			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
  		},

  		"selected": function( elem ) {
  			// Accessing this property makes selected-by-default
  			// options in Safari work properly
  			if ( elem.parentNode ) {
  				elem.parentNode.selectedIndex;
  			}

  			return elem.selected === true;
  		},

  		// Contents
  		"empty": function( elem ) {
  			// http://www.w3.org/TR/selectors/#empty-pseudo
  			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
  			//   but not by others (comment: 8; processing instruction: 7; etc.)
  			// nodeType < 6 works because attributes (2) do not appear as children
  			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
  				if ( elem.nodeType < 6 ) {
  					return false;
  				}
  			}
  			return true;
  		},

  		"parent": function( elem ) {
  			return !Expr.pseudos["empty"]( elem );
  		},

  		// Element/input types
  		"header": function( elem ) {
  			return rheader.test( elem.nodeName );
  		},

  		"input": function( elem ) {
  			return rinputs.test( elem.nodeName );
  		},

  		"button": function( elem ) {
  			var name = elem.nodeName.toLowerCase();
  			return name === "input" && elem.type === "button" || name === "button";
  		},

  		"text": function( elem ) {
  			var attr;
  			return elem.nodeName.toLowerCase() === "input" &&
  				elem.type === "text" &&

  				// Support: IE<8
  				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
  				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
  		},

  		// Position-in-collection
  		"first": createPositionalPseudo(function() {
  			return [ 0 ];
  		}),

  		"last": createPositionalPseudo(function( matchIndexes, length ) {
  			return [ length - 1 ];
  		}),

  		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
  			return [ argument < 0 ? argument + length : argument ];
  		}),

  		"even": createPositionalPseudo(function( matchIndexes, length ) {
  			var i = 0;
  			for ( ; i < length; i += 2 ) {
  				matchIndexes.push( i );
  			}
  			return matchIndexes;
  		}),

  		"odd": createPositionalPseudo(function( matchIndexes, length ) {
  			var i = 1;
  			for ( ; i < length; i += 2 ) {
  				matchIndexes.push( i );
  			}
  			return matchIndexes;
  		}),

  		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
  			var i = argument < 0 ? argument + length : argument;
  			for ( ; --i >= 0; ) {
  				matchIndexes.push( i );
  			}
  			return matchIndexes;
  		}),

  		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
  			var i = argument < 0 ? argument + length : argument;
  			for ( ; ++i < length; ) {
  				matchIndexes.push( i );
  			}
  			return matchIndexes;
  		})
  	}
  };

  Expr.pseudos["nth"] = Expr.pseudos["eq"];

  // Add button/input type pseudos
  for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
  	Expr.pseudos[ i ] = createInputPseudo( i );
  }
  for ( i in { submit: true, reset: true } ) {
  	Expr.pseudos[ i ] = createButtonPseudo( i );
  }

  // Easy API for creating new setFilters
  function setFilters() {}
  setFilters.prototype = Expr.filters = Expr.pseudos;
  Expr.setFilters = new setFilters();

  tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
  	var matched, match, tokens, type,
  		soFar, groups, preFilters,
  		cached = tokenCache[ selector + " " ];

  	if ( cached ) {
  		return parseOnly ? 0 : cached.slice( 0 );
  	}

  	soFar = selector;
  	groups = [];
  	preFilters = Expr.preFilter;

  	while ( soFar ) {

  		// Comma and first run
  		if ( !matched || (match = rcomma.exec( soFar )) ) {
  			if ( match ) {
  				// Don't consume trailing commas as valid
  				soFar = soFar.slice( match[0].length ) || soFar;
  			}
  			groups.push( (tokens = []) );
  		}

  		matched = false;

  		// Combinators
  		if ( (match = rcombinators.exec( soFar )) ) {
  			matched = match.shift();
  			tokens.push({
  				value: matched,
  				// Cast descendant combinators to space
  				type: match[0].replace( rtrim, " " )
  			});
  			soFar = soFar.slice( matched.length );
  		}

  		// Filters
  		for ( type in Expr.filter ) {
  			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
  				(match = preFilters[ type ]( match ))) ) {
  				matched = match.shift();
  				tokens.push({
  					value: matched,
  					type: type,
  					matches: match
  				});
  				soFar = soFar.slice( matched.length );
  			}
  		}

  		if ( !matched ) {
  			break;
  		}
  	}

  	// Return the length of the invalid excess
  	// if we're just parsing
  	// Otherwise, throw an error or return tokens
  	return parseOnly ?
  		soFar.length :
  		soFar ?
  			Sizzle.error( selector ) :
  			// Cache the tokens
  			tokenCache( selector, groups ).slice( 0 );
  };

  function toSelector( tokens ) {
  	var i = 0,
  		len = tokens.length,
  		selector = "";
  	for ( ; i < len; i++ ) {
  		selector += tokens[i].value;
  	}
  	return selector;
  }

  function addCombinator( matcher, combinator, base ) {
  	var dir = combinator.dir,
  		checkNonElements = base && dir === "parentNode",
  		doneName = done++;

  	return combinator.first ?
  		// Check against closest ancestor/preceding element
  		function( elem, context, xml ) {
  			while ( (elem = elem[ dir ]) ) {
  				if ( elem.nodeType === 1 || checkNonElements ) {
  					return matcher( elem, context, xml );
  				}
  			}
  		} :

  		// Check against all ancestor/preceding elements
  		function( elem, context, xml ) {
  			var oldCache, uniqueCache, outerCache,
  				newCache = [ dirruns, doneName ];

  			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
  			if ( xml ) {
  				while ( (elem = elem[ dir ]) ) {
  					if ( elem.nodeType === 1 || checkNonElements ) {
  						if ( matcher( elem, context, xml ) ) {
  							return true;
  						}
  					}
  				}
  			} else {
  				while ( (elem = elem[ dir ]) ) {
  					if ( elem.nodeType === 1 || checkNonElements ) {
  						outerCache = elem[ expando ] || (elem[ expando ] = {});

  						// Support: IE <9 only
  						// Defend against cloned attroperties (jQuery gh-1709)
  						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

  						if ( (oldCache = uniqueCache[ dir ]) &&
  							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

  							// Assign to newCache so results back-propagate to previous elements
  							return (newCache[ 2 ] = oldCache[ 2 ]);
  						} else {
  							// Reuse newcache so results back-propagate to previous elements
  							uniqueCache[ dir ] = newCache;

  							// A match means we're done; a fail means we have to keep checking
  							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
  								return true;
  							}
  						}
  					}
  				}
  			}
  		};
  }

  function elementMatcher( matchers ) {
  	return matchers.length > 1 ?
  		function( elem, context, xml ) {
  			var i = matchers.length;
  			while ( i-- ) {
  				if ( !matchers[i]( elem, context, xml ) ) {
  					return false;
  				}
  			}
  			return true;
  		} :
  		matchers[0];
  }

  function multipleContexts( selector, contexts, results ) {
  	var i = 0,
  		len = contexts.length;
  	for ( ; i < len; i++ ) {
  		Sizzle( selector, contexts[i], results );
  	}
  	return results;
  }

  function condense( unmatched, map, filter, context, xml ) {
  	var elem,
  		newUnmatched = [],
  		i = 0,
  		len = unmatched.length,
  		mapped = map != null;

  	for ( ; i < len; i++ ) {
  		if ( (elem = unmatched[i]) ) {
  			if ( !filter || filter( elem, context, xml ) ) {
  				newUnmatched.push( elem );
  				if ( mapped ) {
  					map.push( i );
  				}
  			}
  		}
  	}

  	return newUnmatched;
  }

  function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
  	if ( postFilter && !postFilter[ expando ] ) {
  		postFilter = setMatcher( postFilter );
  	}
  	if ( postFinder && !postFinder[ expando ] ) {
  		postFinder = setMatcher( postFinder, postSelector );
  	}
  	return markFunction(function( seed, results, context, xml ) {
  		var temp, i, elem,
  			preMap = [],
  			postMap = [],
  			preexisting = results.length,

  			// Get initial elements from seed or context
  			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

  			// Prefilter to get matcher input, preserving a map for seed-results synchronization
  			matcherIn = preFilter && ( seed || !selector ) ?
  				condense( elems, preMap, preFilter, context, xml ) :
  				elems,

  			matcherOut = matcher ?
  				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
  				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

  					// ...intermediate processing is necessary
  					[] :

  					// ...otherwise use results directly
  					results :
  				matcherIn;

  		// Find primary matches
  		if ( matcher ) {
  			matcher( matcherIn, matcherOut, context, xml );
  		}

  		// Apply postFilter
  		if ( postFilter ) {
  			temp = condense( matcherOut, postMap );
  			postFilter( temp, [], context, xml );

  			// Un-match failing elements by moving them back to matcherIn
  			i = temp.length;
  			while ( i-- ) {
  				if ( (elem = temp[i]) ) {
  					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
  				}
  			}
  		}

  		if ( seed ) {
  			if ( postFinder || preFilter ) {
  				if ( postFinder ) {
  					// Get the final matcherOut by condensing this intermediate into postFinder contexts
  					temp = [];
  					i = matcherOut.length;
  					while ( i-- ) {
  						if ( (elem = matcherOut[i]) ) {
  							// Restore matcherIn since elem is not yet a final match
  							temp.push( (matcherIn[i] = elem) );
  						}
  					}
  					postFinder( null, (matcherOut = []), temp, xml );
  				}

  				// Move matched elements from seed to results to keep them synchronized
  				i = matcherOut.length;
  				while ( i-- ) {
  					if ( (elem = matcherOut[i]) &&
  						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

  						seed[temp] = !(results[temp] = elem);
  					}
  				}
  			}

  		// Add elements to results, through postFinder if defined
  		} else {
  			matcherOut = condense(
  				matcherOut === results ?
  					matcherOut.splice( preexisting, matcherOut.length ) :
  					matcherOut
  			);
  			if ( postFinder ) {
  				postFinder( null, results, matcherOut, xml );
  			} else {
  				push.apply( results, matcherOut );
  			}
  		}
  	});
  }

  function matcherFromTokens( tokens ) {
  	var checkContext, matcher, j,
  		len = tokens.length,
  		leadingRelative = Expr.relative[ tokens[0].type ],
  		implicitRelative = leadingRelative || Expr.relative[" "],
  		i = leadingRelative ? 1 : 0,

  		// The foundational matcher ensures that elements are reachable from top-level context(s)
  		matchContext = addCombinator( function( elem ) {
  			return elem === checkContext;
  		}, implicitRelative, true ),
  		matchAnyContext = addCombinator( function( elem ) {
  			return indexOf( checkContext, elem ) > -1;
  		}, implicitRelative, true ),
  		matchers = [ function( elem, context, xml ) {
  			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
  				(checkContext = context).nodeType ?
  					matchContext( elem, context, xml ) :
  					matchAnyContext( elem, context, xml ) );
  			// Avoid hanging onto element (issue #299)
  			checkContext = null;
  			return ret;
  		} ];

  	for ( ; i < len; i++ ) {
  		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
  			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
  		} else {
  			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

  			// Return special upon seeing a positional matcher
  			if ( matcher[ expando ] ) {
  				// Find the next relative operator (if any) for proper handling
  				j = ++i;
  				for ( ; j < len; j++ ) {
  					if ( Expr.relative[ tokens[j].type ] ) {
  						break;
  					}
  				}
  				return setMatcher(
  					i > 1 && elementMatcher( matchers ),
  					i > 1 && toSelector(
  						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
  						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
  					).replace( rtrim, "$1" ),
  					matcher,
  					i < j && matcherFromTokens( tokens.slice( i, j ) ),
  					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
  					j < len && toSelector( tokens )
  				);
  			}
  			matchers.push( matcher );
  		}
  	}

  	return elementMatcher( matchers );
  }

  function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
  	var bySet = setMatchers.length > 0,
  		byElement = elementMatchers.length > 0,
  		superMatcher = function( seed, context, xml, results, outermost ) {
  			var elem, j, matcher,
  				matchedCount = 0,
  				i = "0",
  				unmatched = seed && [],
  				setMatched = [],
  				contextBackup = outermostContext,
  				// We must always have either seed elements or outermost context
  				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
  				// Use integer dirruns iff this is the outermost matcher
  				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
  				len = elems.length;

  			if ( outermost ) {
  				outermostContext = context === document || context || outermost;
  			}

  			// Add elements passing elementMatchers directly to results
  			// Support: IE<9, Safari
  			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
  			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
  				if ( byElement && elem ) {
  					j = 0;
  					if ( !context && elem.ownerDocument !== document ) {
  						setDocument( elem );
  						xml = !documentIsHTML;
  					}
  					while ( (matcher = elementMatchers[j++]) ) {
  						if ( matcher( elem, context || document, xml) ) {
  							results.push( elem );
  							break;
  						}
  					}
  					if ( outermost ) {
  						dirruns = dirrunsUnique;
  					}
  				}

  				// Track unmatched elements for set filters
  				if ( bySet ) {
  					// They will have gone through all possible matchers
  					if ( (elem = !matcher && elem) ) {
  						matchedCount--;
  					}

  					// Lengthen the array for every element, matched or not
  					if ( seed ) {
  						unmatched.push( elem );
  					}
  				}
  			}

  			// `i` is now the count of elements visited above, and adding it to `matchedCount`
  			// makes the latter nonnegative.
  			matchedCount += i;

  			// Apply set filters to unmatched elements
  			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
  			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
  			// no element matchers and no seed.
  			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
  			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
  			// numerically zero.
  			if ( bySet && i !== matchedCount ) {
  				j = 0;
  				while ( (matcher = setMatchers[j++]) ) {
  					matcher( unmatched, setMatched, context, xml );
  				}

  				if ( seed ) {
  					// Reintegrate element matches to eliminate the need for sorting
  					if ( matchedCount > 0 ) {
  						while ( i-- ) {
  							if ( !(unmatched[i] || setMatched[i]) ) {
  								setMatched[i] = pop.call( results );
  							}
  						}
  					}

  					// Discard index placeholder values to get only actual matches
  					setMatched = condense( setMatched );
  				}

  				// Add matches to results
  				push.apply( results, setMatched );

  				// Seedless set matches succeeding multiple successful matchers stipulate sorting
  				if ( outermost && !seed && setMatched.length > 0 &&
  					( matchedCount + setMatchers.length ) > 1 ) {

  					Sizzle.uniqueSort( results );
  				}
  			}

  			// Override manipulation of globals by nested matchers
  			if ( outermost ) {
  				dirruns = dirrunsUnique;
  				outermostContext = contextBackup;
  			}

  			return unmatched;
  		};

  	return bySet ?
  		markFunction( superMatcher ) :
  		superMatcher;
  }

  compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
  	var i,
  		setMatchers = [],
  		elementMatchers = [],
  		cached = compilerCache[ selector + " " ];

  	if ( !cached ) {
  		// Generate a function of recursive functions that can be used to check each element
  		if ( !match ) {
  			match = tokenize( selector );
  		}
  		i = match.length;
  		while ( i-- ) {
  			cached = matcherFromTokens( match[i] );
  			if ( cached[ expando ] ) {
  				setMatchers.push( cached );
  			} else {
  				elementMatchers.push( cached );
  			}
  		}

  		// Cache the compiled function
  		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

  		// Save selector and tokenization
  		cached.selector = selector;
  	}
  	return cached;
  };

  /**
   * A low-level selection function that works with Sizzle's compiled
   *  selector functions
   * @param {String|Function} selector A selector or a pre-compiled
   *  selector function built with Sizzle.compile
   * @param {Element} context
   * @param {Array} [results]
   * @param {Array} [seed] A set of elements to match against
   */
  select = Sizzle.select = function( selector, context, results, seed ) {
  	var i, tokens, token, type, find,
  		compiled = typeof selector === "function" && selector,
  		match = !seed && tokenize( (selector = compiled.selector || selector) );

  	results = results || [];

  	// Try to minimize operations if there is only one selector in the list and no seed
  	// (the latter of which guarantees us context)
  	if ( match.length === 1 ) {

  		// Reduce context if the leading compound selector is an ID
  		tokens = match[0] = match[0].slice( 0 );
  		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
  				support.getById && context.nodeType === 9 && documentIsHTML &&
  				Expr.relative[ tokens[1].type ] ) {

  			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
  			if ( !context ) {
  				return results;

  			// Precompiled matchers will still verify ancestry, so step up a level
  			} else if ( compiled ) {
  				context = context.parentNode;
  			}

  			selector = selector.slice( tokens.shift().value.length );
  		}

  		// Fetch a seed set for right-to-left matching
  		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
  		while ( i-- ) {
  			token = tokens[i];

  			// Abort if we hit a combinator
  			if ( Expr.relative[ (type = token.type) ] ) {
  				break;
  			}
  			if ( (find = Expr.find[ type ]) ) {
  				// Search, expanding context for leading sibling combinators
  				if ( (seed = find(
  					token.matches[0].replace( runescape, funescape ),
  					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
  				)) ) {

  					// If seed is empty or no tokens remain, we can return early
  					tokens.splice( i, 1 );
  					selector = seed.length && toSelector( tokens );
  					if ( !selector ) {
  						push.apply( results, seed );
  						return results;
  					}

  					break;
  				}
  			}
  		}
  	}

  	// Compile and execute a filtering function if one is not provided
  	// Provide `match` to avoid retokenization if we modified the selector above
  	( compiled || compile( selector, match ) )(
  		seed,
  		context,
  		!documentIsHTML,
  		results,
  		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
  	);
  	return results;
  };

  // One-time assignments

  // Sort stability
  support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

  // Support: Chrome 14-35+
  // Always assume duplicates if they aren't passed to the comparison function
  support.detectDuplicates = !!hasDuplicate;

  // Initialize against the default document
  setDocument();

  // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
  // Detached nodes confoundingly follow *each other*
  support.sortDetached = assert(function( div1 ) {
  	// Should return 1, but returns 4 (following)
  	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
  });

  // Support: IE<8
  // Prevent attribute/property "interpolation"
  // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
  if ( !assert(function( div ) {
  	div.innerHTML = "<a href='#'></a>";
  	return div.firstChild.getAttribute("href") === "#" ;
  }) ) {
  	addHandle( "type|href|height|width", function( elem, name, isXML ) {
  		if ( !isXML ) {
  			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
  		}
  	});
  }

  // Support: IE<9
  // Use defaultValue in place of getAttribute("value")
  if ( !support.attributes || !assert(function( div ) {
  	div.innerHTML = "<input/>";
  	div.firstChild.setAttribute( "value", "" );
  	return div.firstChild.getAttribute( "value" ) === "";
  }) ) {
  	addHandle( "value", function( elem, name, isXML ) {
  		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
  			return elem.defaultValue;
  		}
  	});
  }

  // Support: IE<9
  // Use getAttributeNode to fetch booleans when getAttribute lies
  if ( !assert(function( div ) {
  	return div.getAttribute("disabled") == null;
  }) ) {
  	addHandle( booleans, function( elem, name, isXML ) {
  		var val;
  		if ( !isXML ) {
  			return elem[ name ] === true ? name.toLowerCase() :
  					(val = elem.getAttributeNode( name )) && val.specified ?
  					val.value :
  				null;
  		}
  	});
  }

  return Sizzle;

  })( window );



  jQuery.find = Sizzle;
  jQuery.expr = Sizzle.selectors;
  jQuery.expr[ ":" ] = jQuery.expr.pseudos;
  jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
  jQuery.text = Sizzle.getText;
  jQuery.isXMLDoc = Sizzle.isXML;
  jQuery.contains = Sizzle.contains;



  var dir = function( elem, dir, until ) {
  	var matched = [],
  		truncate = until !== undefined;

  	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
  		if ( elem.nodeType === 1 ) {
  			if ( truncate && jQuery( elem ).is( until ) ) {
  				break;
  			}
  			matched.push( elem );
  		}
  	}
  	return matched;
  };


  var siblings = function( n, elem ) {
  	var matched = [];

  	for ( ; n; n = n.nextSibling ) {
  		if ( n.nodeType === 1 && n !== elem ) {
  			matched.push( n );
  		}
  	}

  	return matched;
  };


  var rneedsContext = jQuery.expr.match.needsContext;

  var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



  var risSimple = /^.[^:#\[\.,]*$/;

  // Implement the identical functionality for filter and not
  function winnow( elements, qualifier, not ) {
  	if ( jQuery.isFunction( qualifier ) ) {
  		return jQuery.grep( elements, function( elem, i ) {
  			/* jshint -W018 */
  			return !!qualifier.call( elem, i, elem ) !== not;
  		} );

  	}

  	if ( qualifier.nodeType ) {
  		return jQuery.grep( elements, function( elem ) {
  			return ( elem === qualifier ) !== not;
  		} );

  	}

  	if ( typeof qualifier === "string" ) {
  		if ( risSimple.test( qualifier ) ) {
  			return jQuery.filter( qualifier, elements, not );
  		}

  		qualifier = jQuery.filter( qualifier, elements );
  	}

  	return jQuery.grep( elements, function( elem ) {
  		return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
  	} );
  }

  jQuery.filter = function( expr, elems, not ) {
  	var elem = elems[ 0 ];

  	if ( not ) {
  		expr = ":not(" + expr + ")";
  	}

  	return elems.length === 1 && elem.nodeType === 1 ?
  		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
  		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
  			return elem.nodeType === 1;
  		} ) );
  };

  jQuery.fn.extend( {
  	find: function( selector ) {
  		var i,
  			len = this.length,
  			ret = [],
  			self = this;

  		if ( typeof selector !== "string" ) {
  			return this.pushStack( jQuery( selector ).filter( function() {
  				for ( i = 0; i < len; i++ ) {
  					if ( jQuery.contains( self[ i ], this ) ) {
  						return true;
  					}
  				}
  			} ) );
  		}

  		for ( i = 0; i < len; i++ ) {
  			jQuery.find( selector, self[ i ], ret );
  		}

  		// Needed because $( selector, context ) becomes $( context ).find( selector )
  		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
  		ret.selector = this.selector ? this.selector + " " + selector : selector;
  		return ret;
  	},
  	filter: function( selector ) {
  		return this.pushStack( winnow( this, selector || [], false ) );
  	},
  	not: function( selector ) {
  		return this.pushStack( winnow( this, selector || [], true ) );
  	},
  	is: function( selector ) {
  		return !!winnow(
  			this,

  			// If this is a positional/relative selector, check membership in the returned set
  			// so $("p:first").is("p:last") won't return true for a doc with two "p".
  			typeof selector === "string" && rneedsContext.test( selector ) ?
  				jQuery( selector ) :
  				selector || [],
  			false
  		).length;
  	}
  } );


  // Initialize a jQuery object


  // A central reference to the root jQuery(document)
  var rootjQuery,

  	// A simple way to check for HTML strings
  	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
  	// Strict HTML recognition (#11290: must start with <)
  	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

  	init = jQuery.fn.init = function( selector, context, root ) {
  		var match, elem;

  		// HANDLE: $(""), $(null), $(undefined), $(false)
  		if ( !selector ) {
  			return this;
  		}

  		// Method init() accepts an alternate rootjQuery
  		// so migrate can support jQuery.sub (gh-2101)
  		root = root || rootjQuery;

  		// Handle HTML strings
  		if ( typeof selector === "string" ) {
  			if ( selector[ 0 ] === "<" &&
  				selector[ selector.length - 1 ] === ">" &&
  				selector.length >= 3 ) {

  				// Assume that strings that start and end with <> are HTML and skip the regex check
  				match = [ null, selector, null ];

  			} else {
  				match = rquickExpr.exec( selector );
  			}

  			// Match html or make sure no context is specified for #id
  			if ( match && ( match[ 1 ] || !context ) ) {

  				// HANDLE: $(html) -> $(array)
  				if ( match[ 1 ] ) {
  					context = context instanceof jQuery ? context[ 0 ] : context;

  					// Option to run scripts is true for back-compat
  					// Intentionally let the error be thrown if parseHTML is not present
  					jQuery.merge( this, jQuery.parseHTML(
  						match[ 1 ],
  						context && context.nodeType ? context.ownerDocument || context : document,
  						true
  					) );

  					// HANDLE: $(html, props)
  					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
  						for ( match in context ) {

  							// Properties of context are called as methods if possible
  							if ( jQuery.isFunction( this[ match ] ) ) {
  								this[ match ]( context[ match ] );

  							// ...and otherwise set as attributes
  							} else {
  								this.attr( match, context[ match ] );
  							}
  						}
  					}

  					return this;

  				// HANDLE: $(#id)
  				} else {
  					elem = document.getElementById( match[ 2 ] );

  					// Support: Blackberry 4.6
  					// gEBID returns nodes no longer in the document (#6963)
  					if ( elem && elem.parentNode ) {

  						// Inject the element directly into the jQuery object
  						this.length = 1;
  						this[ 0 ] = elem;
  					}

  					this.context = document;
  					this.selector = selector;
  					return this;
  				}

  			// HANDLE: $(expr, $(...))
  			} else if ( !context || context.jquery ) {
  				return ( context || root ).find( selector );

  			// HANDLE: $(expr, context)
  			// (which is just equivalent to: $(context).find(expr)
  			} else {
  				return this.constructor( context ).find( selector );
  			}

  		// HANDLE: $(DOMElement)
  		} else if ( selector.nodeType ) {
  			this.context = this[ 0 ] = selector;
  			this.length = 1;
  			return this;

  		// HANDLE: $(function)
  		// Shortcut for document ready
  		} else if ( jQuery.isFunction( selector ) ) {
  			return root.ready !== undefined ?
  				root.ready( selector ) :

  				// Execute immediately if ready is not present
  				selector( jQuery );
  		}

  		if ( selector.selector !== undefined ) {
  			this.selector = selector.selector;
  			this.context = selector.context;
  		}

  		return jQuery.makeArray( selector, this );
  	};

  // Give the init function the jQuery prototype for later instantiation
  init.prototype = jQuery.fn;

  // Initialize central reference
  rootjQuery = jQuery( document );


  var rparentsprev = /^(?:parents|prev(?:Until|All))/,

  	// Methods guaranteed to produce a unique set when starting from a unique set
  	guaranteedUnique = {
  		children: true,
  		contents: true,
  		next: true,
  		prev: true
  	};

  jQuery.fn.extend( {
  	has: function( target ) {
  		var targets = jQuery( target, this ),
  			l = targets.length;

  		return this.filter( function() {
  			var i = 0;
  			for ( ; i < l; i++ ) {
  				if ( jQuery.contains( this, targets[ i ] ) ) {
  					return true;
  				}
  			}
  		} );
  	},

  	closest: function( selectors, context ) {
  		var cur,
  			i = 0,
  			l = this.length,
  			matched = [],
  			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
  				jQuery( selectors, context || this.context ) :
  				0;

  		for ( ; i < l; i++ ) {
  			for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

  				// Always skip document fragments
  				if ( cur.nodeType < 11 && ( pos ?
  					pos.index( cur ) > -1 :

  					// Don't pass non-elements to Sizzle
  					cur.nodeType === 1 &&
  						jQuery.find.matchesSelector( cur, selectors ) ) ) {

  					matched.push( cur );
  					break;
  				}
  			}
  		}

  		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
  	},

  	// Determine the position of an element within the set
  	index: function( elem ) {

  		// No argument, return index in parent
  		if ( !elem ) {
  			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
  		}

  		// Index in selector
  		if ( typeof elem === "string" ) {
  			return indexOf.call( jQuery( elem ), this[ 0 ] );
  		}

  		// Locate the position of the desired element
  		return indexOf.call( this,

  			// If it receives a jQuery object, the first element is used
  			elem.jquery ? elem[ 0 ] : elem
  		);
  	},

  	add: function( selector, context ) {
  		return this.pushStack(
  			jQuery.uniqueSort(
  				jQuery.merge( this.get(), jQuery( selector, context ) )
  			)
  		);
  	},

  	addBack: function( selector ) {
  		return this.add( selector == null ?
  			this.prevObject : this.prevObject.filter( selector )
  		);
  	}
  } );

  function sibling( cur, dir ) {
  	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
  	return cur;
  }

  jQuery.each( {
  	parent: function( elem ) {
  		var parent = elem.parentNode;
  		return parent && parent.nodeType !== 11 ? parent : null;
  	},
  	parents: function( elem ) {
  		return dir( elem, "parentNode" );
  	},
  	parentsUntil: function( elem, i, until ) {
  		return dir( elem, "parentNode", until );
  	},
  	next: function( elem ) {
  		return sibling( elem, "nextSibling" );
  	},
  	prev: function( elem ) {
  		return sibling( elem, "previousSibling" );
  	},
  	nextAll: function( elem ) {
  		return dir( elem, "nextSibling" );
  	},
  	prevAll: function( elem ) {
  		return dir( elem, "previousSibling" );
  	},
  	nextUntil: function( elem, i, until ) {
  		return dir( elem, "nextSibling", until );
  	},
  	prevUntil: function( elem, i, until ) {
  		return dir( elem, "previousSibling", until );
  	},
  	siblings: function( elem ) {
  		return siblings( ( elem.parentNode || {} ).firstChild, elem );
  	},
  	children: function( elem ) {
  		return siblings( elem.firstChild );
  	},
  	contents: function( elem ) {
  		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
  	}
  }, function( name, fn ) {
  	jQuery.fn[ name ] = function( until, selector ) {
  		var matched = jQuery.map( this, fn, until );

  		if ( name.slice( -5 ) !== "Until" ) {
  			selector = until;
  		}

  		if ( selector && typeof selector === "string" ) {
  			matched = jQuery.filter( selector, matched );
  		}

  		if ( this.length > 1 ) {

  			// Remove duplicates
  			if ( !guaranteedUnique[ name ] ) {
  				jQuery.uniqueSort( matched );
  			}

  			// Reverse order for parents* and prev-derivatives
  			if ( rparentsprev.test( name ) ) {
  				matched.reverse();
  			}
  		}

  		return this.pushStack( matched );
  	};
  } );
  var rnotwhite = ( /\S+/g );



  // Convert String-formatted options into Object-formatted ones
  function createOptions( options ) {
  	var object = {};
  	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
  		object[ flag ] = true;
  	} );
  	return object;
  }

  /*
   * Create a callback list using the following parameters:
   *
   *	options: an optional list of space-separated options that will change how
   *			the callback list behaves or a more traditional option object
   *
   * By default a callback list will act like an event callback list and can be
   * "fired" multiple times.
   *
   * Possible options:
   *
   *	once:			will ensure the callback list can only be fired once (like a Deferred)
   *
   *	memory:			will keep track of previous values and will call any callback added
   *					after the list has been fired right away with the latest "memorized"
   *					values (like a Deferred)
   *
   *	unique:			will ensure a callback can only be added once (no duplicate in the list)
   *
   *	stopOnFalse:	interrupt callings when a callback returns false
   *
   */
  jQuery.Callbacks = function( options ) {

  	// Convert options from String-formatted to Object-formatted if needed
  	// (we check in cache first)
  	options = typeof options === "string" ?
  		createOptions( options ) :
  		jQuery.extend( {}, options );

  	var // Flag to know if list is currently firing
  		firing,

  		// Last fire value for non-forgettable lists
  		memory,

  		// Flag to know if list was already fired
  		fired,

  		// Flag to prevent firing
  		locked,

  		// Actual callback list
  		list = [],

  		// Queue of execution data for repeatable lists
  		queue = [],

  		// Index of currently firing callback (modified by add/remove as needed)
  		firingIndex = -1,

  		// Fire callbacks
  		fire = function() {

  			// Enforce single-firing
  			locked = options.once;

  			// Execute callbacks for all pending executions,
  			// respecting firingIndex overrides and runtime changes
  			fired = firing = true;
  			for ( ; queue.length; firingIndex = -1 ) {
  				memory = queue.shift();
  				while ( ++firingIndex < list.length ) {

  					// Run callback and check for early termination
  					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
  						options.stopOnFalse ) {

  						// Jump to end and forget the data so .add doesn't re-fire
  						firingIndex = list.length;
  						memory = false;
  					}
  				}
  			}

  			// Forget the data if we're done with it
  			if ( !options.memory ) {
  				memory = false;
  			}

  			firing = false;

  			// Clean up if we're done firing for good
  			if ( locked ) {

  				// Keep an empty list if we have data for future add calls
  				if ( memory ) {
  					list = [];

  				// Otherwise, this object is spent
  				} else {
  					list = "";
  				}
  			}
  		},

  		// Actual Callbacks object
  		self = {

  			// Add a callback or a collection of callbacks to the list
  			add: function() {
  				if ( list ) {

  					// If we have memory from a past run, we should fire after adding
  					if ( memory && !firing ) {
  						firingIndex = list.length - 1;
  						queue.push( memory );
  					}

  					( function add( args ) {
  						jQuery.each( args, function( _, arg ) {
  							if ( jQuery.isFunction( arg ) ) {
  								if ( !options.unique || !self.has( arg ) ) {
  									list.push( arg );
  								}
  							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

  								// Inspect recursively
  								add( arg );
  							}
  						} );
  					} )( arguments );

  					if ( memory && !firing ) {
  						fire();
  					}
  				}
  				return this;
  			},

  			// Remove a callback from the list
  			remove: function() {
  				jQuery.each( arguments, function( _, arg ) {
  					var index;
  					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
  						list.splice( index, 1 );

  						// Handle firing indexes
  						if ( index <= firingIndex ) {
  							firingIndex--;
  						}
  					}
  				} );
  				return this;
  			},

  			// Check if a given callback is in the list.
  			// If no argument is given, return whether or not list has callbacks attached.
  			has: function( fn ) {
  				return fn ?
  					jQuery.inArray( fn, list ) > -1 :
  					list.length > 0;
  			},

  			// Remove all callbacks from the list
  			empty: function() {
  				if ( list ) {
  					list = [];
  				}
  				return this;
  			},

  			// Disable .fire and .add
  			// Abort any current/pending executions
  			// Clear all callbacks and values
  			disable: function() {
  				locked = queue = [];
  				list = memory = "";
  				return this;
  			},
  			disabled: function() {
  				return !list;
  			},

  			// Disable .fire
  			// Also disable .add unless we have memory (since it would have no effect)
  			// Abort any pending executions
  			lock: function() {
  				locked = queue = [];
  				if ( !memory ) {
  					list = memory = "";
  				}
  				return this;
  			},
  			locked: function() {
  				return !!locked;
  			},

  			// Call all callbacks with the given context and arguments
  			fireWith: function( context, args ) {
  				if ( !locked ) {
  					args = args || [];
  					args = [ context, args.slice ? args.slice() : args ];
  					queue.push( args );
  					if ( !firing ) {
  						fire();
  					}
  				}
  				return this;
  			},

  			// Call all the callbacks with the given arguments
  			fire: function() {
  				self.fireWith( this, arguments );
  				return this;
  			},

  			// To know if the callbacks have already been called at least once
  			fired: function() {
  				return !!fired;
  			}
  		};

  	return self;
  };


  jQuery.extend( {

  	Deferred: function( func ) {
  		var tuples = [

  				// action, add listener, listener list, final state
  				[ "resolve", "done", jQuery.Callbacks( "once memory" ), "resolved" ],
  				[ "reject", "fail", jQuery.Callbacks( "once memory" ), "rejected" ],
  				[ "notify", "progress", jQuery.Callbacks( "memory" ) ]
  			],
  			state = "pending",
  			promise = {
  				state: function() {
  					return state;
  				},
  				always: function() {
  					deferred.done( arguments ).fail( arguments );
  					return this;
  				},
  				then: function( /* fnDone, fnFail, fnProgress */ ) {
  					var fns = arguments;
  					return jQuery.Deferred( function( newDefer ) {
  						jQuery.each( tuples, function( i, tuple ) {
  							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

  							// deferred[ done | fail | progress ] for forwarding actions to newDefer
  							deferred[ tuple[ 1 ] ]( function() {
  								var returned = fn && fn.apply( this, arguments );
  								if ( returned && jQuery.isFunction( returned.promise ) ) {
  									returned.promise()
  										.progress( newDefer.notify )
  										.done( newDefer.resolve )
  										.fail( newDefer.reject );
  								} else {
  									newDefer[ tuple[ 0 ] + "With" ](
  										this === promise ? newDefer.promise() : this,
  										fn ? [ returned ] : arguments
  									);
  								}
  							} );
  						} );
  						fns = null;
  					} ).promise();
  				},

  				// Get a promise for this deferred
  				// If obj is provided, the promise aspect is added to the object
  				promise: function( obj ) {
  					return obj != null ? jQuery.extend( obj, promise ) : promise;
  				}
  			},
  			deferred = {};

  		// Keep pipe for back-compat
  		promise.pipe = promise.then;

  		// Add list-specific methods
  		jQuery.each( tuples, function( i, tuple ) {
  			var list = tuple[ 2 ],
  				stateString = tuple[ 3 ];

  			// promise[ done | fail | progress ] = list.add
  			promise[ tuple[ 1 ] ] = list.add;

  			// Handle state
  			if ( stateString ) {
  				list.add( function() {

  					// state = [ resolved | rejected ]
  					state = stateString;

  				// [ reject_list | resolve_list ].disable; progress_list.lock
  				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
  			}

  			// deferred[ resolve | reject | notify ]
  			deferred[ tuple[ 0 ] ] = function() {
  				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
  				return this;
  			};
  			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
  		} );

  		// Make the deferred a promise
  		promise.promise( deferred );

  		// Call given func if any
  		if ( func ) {
  			func.call( deferred, deferred );
  		}

  		// All done!
  		return deferred;
  	},

  	// Deferred helper
  	when: function( subordinate /* , ..., subordinateN */ ) {
  		var i = 0,
  			resolveValues = slice.call( arguments ),
  			length = resolveValues.length,

  			// the count of uncompleted subordinates
  			remaining = length !== 1 ||
  				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

  			// the master Deferred.
  			// If resolveValues consist of only a single Deferred, just use that.
  			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

  			// Update function for both resolve and progress values
  			updateFunc = function( i, contexts, values ) {
  				return function( value ) {
  					contexts[ i ] = this;
  					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
  					if ( values === progressValues ) {
  						deferred.notifyWith( contexts, values );
  					} else if ( !( --remaining ) ) {
  						deferred.resolveWith( contexts, values );
  					}
  				};
  			},

  			progressValues, progressContexts, resolveContexts;

  		// Add listeners to Deferred subordinates; treat others as resolved
  		if ( length > 1 ) {
  			progressValues = new Array( length );
  			progressContexts = new Array( length );
  			resolveContexts = new Array( length );
  			for ( ; i < length; i++ ) {
  				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
  					resolveValues[ i ].promise()
  						.progress( updateFunc( i, progressContexts, progressValues ) )
  						.done( updateFunc( i, resolveContexts, resolveValues ) )
  						.fail( deferred.reject );
  				} else {
  					--remaining;
  				}
  			}
  		}

  		// If we're not waiting on anything, resolve the master
  		if ( !remaining ) {
  			deferred.resolveWith( resolveContexts, resolveValues );
  		}

  		return deferred.promise();
  	}
  } );


  // The deferred used on DOM ready
  var readyList;

  jQuery.fn.ready = function( fn ) {

  	// Add the callback
  	jQuery.ready.promise().done( fn );

  	return this;
  };

  jQuery.extend( {

  	// Is the DOM ready to be used? Set to true once it occurs.
  	isReady: false,

  	// A counter to track how many items to wait for before
  	// the ready event fires. See #6781
  	readyWait: 1,

  	// Hold (or release) the ready event
  	holdReady: function( hold ) {
  		if ( hold ) {
  			jQuery.readyWait++;
  		} else {
  			jQuery.ready( true );
  		}
  	},

  	// Handle when the DOM is ready
  	ready: function( wait ) {

  		// Abort if there are pending holds or we're already ready
  		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
  			return;
  		}

  		// Remember that the DOM is ready
  		jQuery.isReady = true;

  		// If a normal DOM Ready event fired, decrement, and wait if need be
  		if ( wait !== true && --jQuery.readyWait > 0 ) {
  			return;
  		}

  		// If there are functions bound, to execute
  		readyList.resolveWith( document, [ jQuery ] );

  		// Trigger any bound ready events
  		if ( jQuery.fn.triggerHandler ) {
  			jQuery( document ).triggerHandler( "ready" );
  			jQuery( document ).off( "ready" );
  		}
  	}
  } );

  /**
   * The ready event handler and self cleanup method
   */
  function completed() {
  	document.removeEventListener( "DOMContentLoaded", completed );
  	window.removeEventListener( "load", completed );
  	jQuery.ready();
  }

  jQuery.ready.promise = function( obj ) {
  	if ( !readyList ) {

  		readyList = jQuery.Deferred();

  		// Catch cases where $(document).ready() is called
  		// after the browser event has already occurred.
  		// Support: IE9-10 only
  		// Older IE sometimes signals "interactive" too soon
  		if ( document.readyState === "complete" ||
  			( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

  			// Handle it asynchronously to allow scripts the opportunity to delay ready
  			window.setTimeout( jQuery.ready );

  		} else {

  			// Use the handy event callback
  			document.addEventListener( "DOMContentLoaded", completed );

  			// A fallback to window.onload, that will always work
  			window.addEventListener( "load", completed );
  		}
  	}
  	return readyList.promise( obj );
  };

  // Kick off the DOM ready check even if the user does not
  jQuery.ready.promise();




  // Multifunctional method to get and set values of a collection
  // The value/s can optionally be executed if it's a function
  var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
  	var i = 0,
  		len = elems.length,
  		bulk = key == null;

  	// Sets many values
  	if ( jQuery.type( key ) === "object" ) {
  		chainable = true;
  		for ( i in key ) {
  			access( elems, fn, i, key[ i ], true, emptyGet, raw );
  		}

  	// Sets one value
  	} else if ( value !== undefined ) {
  		chainable = true;

  		if ( !jQuery.isFunction( value ) ) {
  			raw = true;
  		}

  		if ( bulk ) {

  			// Bulk operations run against the entire set
  			if ( raw ) {
  				fn.call( elems, value );
  				fn = null;

  			// ...except when executing function values
  			} else {
  				bulk = fn;
  				fn = function( elem, key, value ) {
  					return bulk.call( jQuery( elem ), value );
  				};
  			}
  		}

  		if ( fn ) {
  			for ( ; i < len; i++ ) {
  				fn(
  					elems[ i ], key, raw ?
  					value :
  					value.call( elems[ i ], i, fn( elems[ i ], key ) )
  				);
  			}
  		}
  	}

  	return chainable ?
  		elems :

  		// Gets
  		bulk ?
  			fn.call( elems ) :
  			len ? fn( elems[ 0 ], key ) : emptyGet;
  };
  var acceptData = function( owner ) {

  	// Accepts only:
  	//  - Node
  	//    - Node.ELEMENT_NODE
  	//    - Node.DOCUMENT_NODE
  	//  - Object
  	//    - Any
  	/* jshint -W018 */
  	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
  };




  function Data() {
  	this.expando = jQuery.expando + Data.uid++;
  }

  Data.uid = 1;

  Data.prototype = {

  	register: function( owner, initial ) {
  		var value = initial || {};

  		// If it is a node unlikely to be stringify-ed or looped over
  		// use plain assignment
  		if ( owner.nodeType ) {
  			owner[ this.expando ] = value;

  		// Otherwise secure it in a non-enumerable, non-writable property
  		// configurability must be true to allow the property to be
  		// deleted with the delete operator
  		} else {
  			Object.defineProperty( owner, this.expando, {
  				value: value,
  				writable: true,
  				configurable: true
  			} );
  		}
  		return owner[ this.expando ];
  	},
  	cache: function( owner ) {

  		// We can accept data for non-element nodes in modern browsers,
  		// but we should not, see #8335.
  		// Always return an empty object.
  		if ( !acceptData( owner ) ) {
  			return {};
  		}

  		// Check if the owner object already has a cache
  		var value = owner[ this.expando ];

  		// If not, create one
  		if ( !value ) {
  			value = {};

  			// We can accept data for non-element nodes in modern browsers,
  			// but we should not, see #8335.
  			// Always return an empty object.
  			if ( acceptData( owner ) ) {

  				// If it is a node unlikely to be stringify-ed or looped over
  				// use plain assignment
  				if ( owner.nodeType ) {
  					owner[ this.expando ] = value;

  				// Otherwise secure it in a non-enumerable property
  				// configurable must be true to allow the property to be
  				// deleted when data is removed
  				} else {
  					Object.defineProperty( owner, this.expando, {
  						value: value,
  						configurable: true
  					} );
  				}
  			}
  		}

  		return value;
  	},
  	set: function( owner, data, value ) {
  		var prop,
  			cache = this.cache( owner );

  		// Handle: [ owner, key, value ] args
  		if ( typeof data === "string" ) {
  			cache[ data ] = value;

  		// Handle: [ owner, { properties } ] args
  		} else {

  			// Copy the properties one-by-one to the cache object
  			for ( prop in data ) {
  				cache[ prop ] = data[ prop ];
  			}
  		}
  		return cache;
  	},
  	get: function( owner, key ) {
  		return key === undefined ?
  			this.cache( owner ) :
  			owner[ this.expando ] && owner[ this.expando ][ key ];
  	},
  	access: function( owner, key, value ) {
  		var stored;

  		// In cases where either:
  		//
  		//   1. No key was specified
  		//   2. A string key was specified, but no value provided
  		//
  		// Take the "read" path and allow the get method to determine
  		// which value to return, respectively either:
  		//
  		//   1. The entire cache object
  		//   2. The data stored at the key
  		//
  		if ( key === undefined ||
  				( ( key && typeof key === "string" ) && value === undefined ) ) {

  			stored = this.get( owner, key );

  			return stored !== undefined ?
  				stored : this.get( owner, jQuery.camelCase( key ) );
  		}

  		// When the key is not a string, or both a key and value
  		// are specified, set or extend (existing objects) with either:
  		//
  		//   1. An object of properties
  		//   2. A key and value
  		//
  		this.set( owner, key, value );

  		// Since the "set" path can have two possible entry points
  		// return the expected data based on which path was taken[*]
  		return value !== undefined ? value : key;
  	},
  	remove: function( owner, key ) {
  		var i, name, camel,
  			cache = owner[ this.expando ];

  		if ( cache === undefined ) {
  			return;
  		}

  		if ( key === undefined ) {
  			this.register( owner );

  		} else {

  			// Support array or space separated string of keys
  			if ( jQuery.isArray( key ) ) {

  				// If "name" is an array of keys...
  				// When data is initially created, via ("key", "val") signature,
  				// keys will be converted to camelCase.
  				// Since there is no way to tell _how_ a key was added, remove
  				// both plain key and camelCase key. #12786
  				// This will only penalize the array argument path.
  				name = key.concat( key.map( jQuery.camelCase ) );
  			} else {
  				camel = jQuery.camelCase( key );

  				// Try the string as a key before any manipulation
  				if ( key in cache ) {
  					name = [ key, camel ];
  				} else {

  					// If a key with the spaces exists, use it.
  					// Otherwise, create an array by matching non-whitespace
  					name = camel;
  					name = name in cache ?
  						[ name ] : ( name.match( rnotwhite ) || [] );
  				}
  			}

  			i = name.length;

  			while ( i-- ) {
  				delete cache[ name[ i ] ];
  			}
  		}

  		// Remove the expando if there's no more data
  		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

  			// Support: Chrome <= 35-45+
  			// Webkit & Blink performance suffers when deleting properties
  			// from DOM nodes, so set to undefined instead
  			// https://code.google.com/p/chromium/issues/detail?id=378607
  			if ( owner.nodeType ) {
  				owner[ this.expando ] = undefined;
  			} else {
  				delete owner[ this.expando ];
  			}
  		}
  	},
  	hasData: function( owner ) {
  		var cache = owner[ this.expando ];
  		return cache !== undefined && !jQuery.isEmptyObject( cache );
  	}
  };
  var dataPriv = new Data();

  var dataUser = new Data();



  //	Implementation Summary
  //
  //	1. Enforce API surface and semantic compatibility with 1.9.x branch
  //	2. Improve the module's maintainability by reducing the storage
  //		paths to a single mechanism.
  //	3. Use the same single mechanism to support "private" and "user" data.
  //	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
  //	5. Avoid exposing implementation details on user objects (eg. expando properties)
  //	6. Provide a clear path for implementation upgrade to WeakMap in 2014

  var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
  	rmultiDash = /[A-Z]/g;

  function dataAttr( elem, key, data ) {
  	var name;

  	// If nothing was found internally, try to fetch any
  	// data from the HTML5 data-* attribute
  	if ( data === undefined && elem.nodeType === 1 ) {
  		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
  		data = elem.getAttribute( name );

  		if ( typeof data === "string" ) {
  			try {
  				data = data === "true" ? true :
  					data === "false" ? false :
  					data === "null" ? null :

  					// Only convert to a number if it doesn't change the string
  					+data + "" === data ? +data :
  					rbrace.test( data ) ? jQuery.parseJSON( data ) :
  					data;
  			} catch ( e ) {}

  			// Make sure we set the data so it isn't changed later
  			dataUser.set( elem, key, data );
  		} else {
  			data = undefined;
  		}
  	}
  	return data;
  }

  jQuery.extend( {
  	hasData: function( elem ) {
  		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
  	},

  	data: function( elem, name, data ) {
  		return dataUser.access( elem, name, data );
  	},

  	removeData: function( elem, name ) {
  		dataUser.remove( elem, name );
  	},

  	// TODO: Now that all calls to _data and _removeData have been replaced
  	// with direct calls to dataPriv methods, these can be deprecated.
  	_data: function( elem, name, data ) {
  		return dataPriv.access( elem, name, data );
  	},

  	_removeData: function( elem, name ) {
  		dataPriv.remove( elem, name );
  	}
  } );

  jQuery.fn.extend( {
  	data: function( key, value ) {
  		var i, name, data,
  			elem = this[ 0 ],
  			attrs = elem && elem.attributes;

  		// Gets all values
  		if ( key === undefined ) {
  			if ( this.length ) {
  				data = dataUser.get( elem );

  				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
  					i = attrs.length;
  					while ( i-- ) {

  						// Support: IE11+
  						// The attrs elements can be null (#14894)
  						if ( attrs[ i ] ) {
  							name = attrs[ i ].name;
  							if ( name.indexOf( "data-" ) === 0 ) {
  								name = jQuery.camelCase( name.slice( 5 ) );
  								dataAttr( elem, name, data[ name ] );
  							}
  						}
  					}
  					dataPriv.set( elem, "hasDataAttrs", true );
  				}
  			}

  			return data;
  		}

  		// Sets multiple values
  		if ( typeof key === "object" ) {
  			return this.each( function() {
  				dataUser.set( this, key );
  			} );
  		}

  		return access( this, function( value ) {
  			var data, camelKey;

  			// The calling jQuery object (element matches) is not empty
  			// (and therefore has an element appears at this[ 0 ]) and the
  			// `value` parameter was not undefined. An empty jQuery object
  			// will result in `undefined` for elem = this[ 0 ] which will
  			// throw an exception if an attempt to read a data cache is made.
  			if ( elem && value === undefined ) {

  				// Attempt to get data from the cache
  				// with the key as-is
  				data = dataUser.get( elem, key ) ||

  					// Try to find dashed key if it exists (gh-2779)
  					// This is for 2.2.x only
  					dataUser.get( elem, key.replace( rmultiDash, "-$&" ).toLowerCase() );

  				if ( data !== undefined ) {
  					return data;
  				}

  				camelKey = jQuery.camelCase( key );

  				// Attempt to get data from the cache
  				// with the key camelized
  				data = dataUser.get( elem, camelKey );
  				if ( data !== undefined ) {
  					return data;
  				}

  				// Attempt to "discover" the data in
  				// HTML5 custom data-* attrs
  				data = dataAttr( elem, camelKey, undefined );
  				if ( data !== undefined ) {
  					return data;
  				}

  				// We tried really hard, but the data doesn't exist.
  				return;
  			}

  			// Set the data...
  			camelKey = jQuery.camelCase( key );
  			this.each( function() {

  				// First, attempt to store a copy or reference of any
  				// data that might've been store with a camelCased key.
  				var data = dataUser.get( this, camelKey );

  				// For HTML5 data-* attribute interop, we have to
  				// store property names with dashes in a camelCase form.
  				// This might not apply to all properties...*
  				dataUser.set( this, camelKey, value );

  				// *... In the case of properties that might _actually_
  				// have dashes, we need to also store a copy of that
  				// unchanged property.
  				if ( key.indexOf( "-" ) > -1 && data !== undefined ) {
  					dataUser.set( this, key, value );
  				}
  			} );
  		}, null, value, arguments.length > 1, null, true );
  	},

  	removeData: function( key ) {
  		return this.each( function() {
  			dataUser.remove( this, key );
  		} );
  	}
  } );


  jQuery.extend( {
  	queue: function( elem, type, data ) {
  		var queue;

  		if ( elem ) {
  			type = ( type || "fx" ) + "queue";
  			queue = dataPriv.get( elem, type );

  			// Speed up dequeue by getting out quickly if this is just a lookup
  			if ( data ) {
  				if ( !queue || jQuery.isArray( data ) ) {
  					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
  				} else {
  					queue.push( data );
  				}
  			}
  			return queue || [];
  		}
  	},

  	dequeue: function( elem, type ) {
  		type = type || "fx";

  		var queue = jQuery.queue( elem, type ),
  			startLength = queue.length,
  			fn = queue.shift(),
  			hooks = jQuery._queueHooks( elem, type ),
  			next = function() {
  				jQuery.dequeue( elem, type );
  			};

  		// If the fx queue is dequeued, always remove the progress sentinel
  		if ( fn === "inprogress" ) {
  			fn = queue.shift();
  			startLength--;
  		}

  		if ( fn ) {

  			// Add a progress sentinel to prevent the fx queue from being
  			// automatically dequeued
  			if ( type === "fx" ) {
  				queue.unshift( "inprogress" );
  			}

  			// Clear up the last queue stop function
  			delete hooks.stop;
  			fn.call( elem, next, hooks );
  		}

  		if ( !startLength && hooks ) {
  			hooks.empty.fire();
  		}
  	},

  	// Not public - generate a queueHooks object, or return the current one
  	_queueHooks: function( elem, type ) {
  		var key = type + "queueHooks";
  		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
  			empty: jQuery.Callbacks( "once memory" ).add( function() {
  				dataPriv.remove( elem, [ type + "queue", key ] );
  			} )
  		} );
  	}
  } );

  jQuery.fn.extend( {
  	queue: function( type, data ) {
  		var setter = 2;

  		if ( typeof type !== "string" ) {
  			data = type;
  			type = "fx";
  			setter--;
  		}

  		if ( arguments.length < setter ) {
  			return jQuery.queue( this[ 0 ], type );
  		}

  		return data === undefined ?
  			this :
  			this.each( function() {
  				var queue = jQuery.queue( this, type, data );

  				// Ensure a hooks for this queue
  				jQuery._queueHooks( this, type );

  				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
  					jQuery.dequeue( this, type );
  				}
  			} );
  	},
  	dequeue: function( type ) {
  		return this.each( function() {
  			jQuery.dequeue( this, type );
  		} );
  	},
  	clearQueue: function( type ) {
  		return this.queue( type || "fx", [] );
  	},

  	// Get a promise resolved when queues of a certain type
  	// are emptied (fx is the type by default)
  	promise: function( type, obj ) {
  		var tmp,
  			count = 1,
  			defer = jQuery.Deferred(),
  			elements = this,
  			i = this.length,
  			resolve = function() {
  				if ( !( --count ) ) {
  					defer.resolveWith( elements, [ elements ] );
  				}
  			};

  		if ( typeof type !== "string" ) {
  			obj = type;
  			type = undefined;
  		}
  		type = type || "fx";

  		while ( i-- ) {
  			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
  			if ( tmp && tmp.empty ) {
  				count++;
  				tmp.empty.add( resolve );
  			}
  		}
  		resolve();
  		return defer.promise( obj );
  	}
  } );
  var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

  var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


  var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

  var isHidden = function( elem, el ) {

  		// isHidden might be called from jQuery#filter function;
  		// in that case, element will be second argument
  		elem = el || elem;
  		return jQuery.css( elem, "display" ) === "none" ||
  			!jQuery.contains( elem.ownerDocument, elem );
  	};



  function adjustCSS( elem, prop, valueParts, tween ) {
  	var adjusted,
  		scale = 1,
  		maxIterations = 20,
  		currentValue = tween ?
  			function() { return tween.cur(); } :
  			function() { return jQuery.css( elem, prop, "" ); },
  		initial = currentValue(),
  		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

  		// Starting value computation is required for potential unit mismatches
  		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
  			rcssNum.exec( jQuery.css( elem, prop ) );

  	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

  		// Trust units reported by jQuery.css
  		unit = unit || initialInUnit[ 3 ];

  		// Make sure we update the tween properties later on
  		valueParts = valueParts || [];

  		// Iteratively approximate from a nonzero starting point
  		initialInUnit = +initial || 1;

  		do {

  			// If previous iteration zeroed out, double until we get *something*.
  			// Use string for doubling so we don't accidentally see scale as unchanged below
  			scale = scale || ".5";

  			// Adjust and apply
  			initialInUnit = initialInUnit / scale;
  			jQuery.style( elem, prop, initialInUnit + unit );

  		// Update scale, tolerating zero or NaN from tween.cur()
  		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
  		} while (
  			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
  		);
  	}

  	if ( valueParts ) {
  		initialInUnit = +initialInUnit || +initial || 0;

  		// Apply relative offset (+=/-=) if specified
  		adjusted = valueParts[ 1 ] ?
  			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
  			+valueParts[ 2 ];
  		if ( tween ) {
  			tween.unit = unit;
  			tween.start = initialInUnit;
  			tween.end = adjusted;
  		}
  	}
  	return adjusted;
  }
  var rcheckableType = ( /^(?:checkbox|radio)$/i );

  var rtagName = ( /<([\w:-]+)/ );

  var rscriptType = ( /^$|\/(?:java|ecma)script/i );



  // We have to close these tags to support XHTML (#13200)
  var wrapMap = {

  	// Support: IE9
  	option: [ 1, "<select multiple='multiple'>", "</select>" ],

  	// XHTML parsers do not magically insert elements in the
  	// same way that tag soup parsers do. So we cannot shorten
  	// this by omitting <tbody> or other required elements.
  	thead: [ 1, "<table>", "</table>" ],
  	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
  	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
  	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

  	_default: [ 0, "", "" ]
  };

  // Support: IE9
  wrapMap.optgroup = wrapMap.option;

  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;


  function getAll( context, tag ) {

  	// Support: IE9-11+
  	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
  	var ret = typeof context.getElementsByTagName !== "undefined" ?
  			context.getElementsByTagName( tag || "*" ) :
  			typeof context.querySelectorAll !== "undefined" ?
  				context.querySelectorAll( tag || "*" ) :
  			[];

  	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
  		jQuery.merge( [ context ], ret ) :
  		ret;
  }


  // Mark scripts as having already been evaluated
  function setGlobalEval( elems, refElements ) {
  	var i = 0,
  		l = elems.length;

  	for ( ; i < l; i++ ) {
  		dataPriv.set(
  			elems[ i ],
  			"globalEval",
  			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
  		);
  	}
  }


  var rhtml = /<|&#?\w+;/;

  function buildFragment( elems, context, scripts, selection, ignored ) {
  	var elem, tmp, tag, wrap, contains, j,
  		fragment = context.createDocumentFragment(),
  		nodes = [],
  		i = 0,
  		l = elems.length;

  	for ( ; i < l; i++ ) {
  		elem = elems[ i ];

  		if ( elem || elem === 0 ) {

  			// Add nodes directly
  			if ( jQuery.type( elem ) === "object" ) {

  				// Support: Android<4.1, PhantomJS<2
  				// push.apply(_, arraylike) throws on ancient WebKit
  				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

  			// Convert non-html into a text node
  			} else if ( !rhtml.test( elem ) ) {
  				nodes.push( context.createTextNode( elem ) );

  			// Convert html into DOM nodes
  			} else {
  				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

  				// Deserialize a standard representation
  				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
  				wrap = wrapMap[ tag ] || wrapMap._default;
  				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

  				// Descend through wrappers to the right content
  				j = wrap[ 0 ];
  				while ( j-- ) {
  					tmp = tmp.lastChild;
  				}

  				// Support: Android<4.1, PhantomJS<2
  				// push.apply(_, arraylike) throws on ancient WebKit
  				jQuery.merge( nodes, tmp.childNodes );

  				// Remember the top-level container
  				tmp = fragment.firstChild;

  				// Ensure the created nodes are orphaned (#12392)
  				tmp.textContent = "";
  			}
  		}
  	}

  	// Remove wrapper from fragment
  	fragment.textContent = "";

  	i = 0;
  	while ( ( elem = nodes[ i++ ] ) ) {

  		// Skip elements already in the context collection (trac-4087)
  		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
  			if ( ignored ) {
  				ignored.push( elem );
  			}
  			continue;
  		}

  		contains = jQuery.contains( elem.ownerDocument, elem );

  		// Append to fragment
  		tmp = getAll( fragment.appendChild( elem ), "script" );

  		// Preserve script evaluation history
  		if ( contains ) {
  			setGlobalEval( tmp );
  		}

  		// Capture executables
  		if ( scripts ) {
  			j = 0;
  			while ( ( elem = tmp[ j++ ] ) ) {
  				if ( rscriptType.test( elem.type || "" ) ) {
  					scripts.push( elem );
  				}
  			}
  		}
  	}

  	return fragment;
  }


  ( function() {
  	var fragment = document.createDocumentFragment(),
  		div = fragment.appendChild( document.createElement( "div" ) ),
  		input = document.createElement( "input" );

  	// Support: Android 4.0-4.3, Safari<=5.1
  	// Check state lost if the name is set (#11217)
  	// Support: Windows Web Apps (WWA)
  	// `name` and `type` must use .setAttribute for WWA (#14901)
  	input.setAttribute( "type", "radio" );
  	input.setAttribute( "checked", "checked" );
  	input.setAttribute( "name", "t" );

  	div.appendChild( input );

  	// Support: Safari<=5.1, Android<4.2
  	// Older WebKit doesn't clone checked state correctly in fragments
  	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

  	// Support: IE<=11+
  	// Make sure textarea (and checkbox) defaultValue is properly cloned
  	div.innerHTML = "<textarea>x</textarea>";
  	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
  } )();


  var
  	rkeyEvent = /^key/,
  	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
  	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

  function returnTrue() {
  	return true;
  }

  function returnFalse() {
  	return false;
  }

  // Support: IE9
  // See #13393 for more info
  function safeActiveElement() {
  	try {
  		return document.activeElement;
  	} catch ( err ) { }
  }

  function on( elem, types, selector, data, fn, one ) {
  	var origFn, type;

  	// Types can be a map of types/handlers
  	if ( typeof types === "object" ) {

  		// ( types-Object, selector, data )
  		if ( typeof selector !== "string" ) {

  			// ( types-Object, data )
  			data = data || selector;
  			selector = undefined;
  		}
  		for ( type in types ) {
  			on( elem, type, selector, data, types[ type ], one );
  		}
  		return elem;
  	}

  	if ( data == null && fn == null ) {

  		// ( types, fn )
  		fn = selector;
  		data = selector = undefined;
  	} else if ( fn == null ) {
  		if ( typeof selector === "string" ) {

  			// ( types, selector, fn )
  			fn = data;
  			data = undefined;
  		} else {

  			// ( types, data, fn )
  			fn = data;
  			data = selector;
  			selector = undefined;
  		}
  	}
  	if ( fn === false ) {
  		fn = returnFalse;
  	} else if ( !fn ) {
  		return elem;
  	}

  	if ( one === 1 ) {
  		origFn = fn;
  		fn = function( event ) {

  			// Can use an empty set, since event contains the info
  			jQuery().off( event );
  			return origFn.apply( this, arguments );
  		};

  		// Use same guid so caller can remove using origFn
  		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
  	}
  	return elem.each( function() {
  		jQuery.event.add( this, types, fn, data, selector );
  	} );
  }

  /*
   * Helper functions for managing events -- not part of the public interface.
   * Props to Dean Edwards' addEvent library for many of the ideas.
   */
  jQuery.event = {

  	global: {},

  	add: function( elem, types, handler, data, selector ) {

  		var handleObjIn, eventHandle, tmp,
  			events, t, handleObj,
  			special, handlers, type, namespaces, origType,
  			elemData = dataPriv.get( elem );

  		// Don't attach events to noData or text/comment nodes (but allow plain objects)
  		if ( !elemData ) {
  			return;
  		}

  		// Caller can pass in an object of custom data in lieu of the handler
  		if ( handler.handler ) {
  			handleObjIn = handler;
  			handler = handleObjIn.handler;
  			selector = handleObjIn.selector;
  		}

  		// Make sure that the handler has a unique ID, used to find/remove it later
  		if ( !handler.guid ) {
  			handler.guid = jQuery.guid++;
  		}

  		// Init the element's event structure and main handler, if this is the first
  		if ( !( events = elemData.events ) ) {
  			events = elemData.events = {};
  		}
  		if ( !( eventHandle = elemData.handle ) ) {
  			eventHandle = elemData.handle = function( e ) {

  				// Discard the second event of a jQuery.event.trigger() and
  				// when an event is called after a page has unloaded
  				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
  					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
  			};
  		}

  		// Handle multiple events separated by a space
  		types = ( types || "" ).match( rnotwhite ) || [ "" ];
  		t = types.length;
  		while ( t-- ) {
  			tmp = rtypenamespace.exec( types[ t ] ) || [];
  			type = origType = tmp[ 1 ];
  			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

  			// There *must* be a type, no attaching namespace-only handlers
  			if ( !type ) {
  				continue;
  			}

  			// If event changes its type, use the special event handlers for the changed type
  			special = jQuery.event.special[ type ] || {};

  			// If selector defined, determine special event api type, otherwise given type
  			type = ( selector ? special.delegateType : special.bindType ) || type;

  			// Update special based on newly reset type
  			special = jQuery.event.special[ type ] || {};

  			// handleObj is passed to all event handlers
  			handleObj = jQuery.extend( {
  				type: type,
  				origType: origType,
  				data: data,
  				handler: handler,
  				guid: handler.guid,
  				selector: selector,
  				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
  				namespace: namespaces.join( "." )
  			}, handleObjIn );

  			// Init the event handler queue if we're the first
  			if ( !( handlers = events[ type ] ) ) {
  				handlers = events[ type ] = [];
  				handlers.delegateCount = 0;

  				// Only use addEventListener if the special events handler returns false
  				if ( !special.setup ||
  					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

  					if ( elem.addEventListener ) {
  						elem.addEventListener( type, eventHandle );
  					}
  				}
  			}

  			if ( special.add ) {
  				special.add.call( elem, handleObj );

  				if ( !handleObj.handler.guid ) {
  					handleObj.handler.guid = handler.guid;
  				}
  			}

  			// Add to the element's handler list, delegates in front
  			if ( selector ) {
  				handlers.splice( handlers.delegateCount++, 0, handleObj );
  			} else {
  				handlers.push( handleObj );
  			}

  			// Keep track of which events have ever been used, for event optimization
  			jQuery.event.global[ type ] = true;
  		}

  	},

  	// Detach an event or set of events from an element
  	remove: function( elem, types, handler, selector, mappedTypes ) {

  		var j, origCount, tmp,
  			events, t, handleObj,
  			special, handlers, type, namespaces, origType,
  			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

  		if ( !elemData || !( events = elemData.events ) ) {
  			return;
  		}

  		// Once for each type.namespace in types; type may be omitted
  		types = ( types || "" ).match( rnotwhite ) || [ "" ];
  		t = types.length;
  		while ( t-- ) {
  			tmp = rtypenamespace.exec( types[ t ] ) || [];
  			type = origType = tmp[ 1 ];
  			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

  			// Unbind all events (on this namespace, if provided) for the element
  			if ( !type ) {
  				for ( type in events ) {
  					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
  				}
  				continue;
  			}

  			special = jQuery.event.special[ type ] || {};
  			type = ( selector ? special.delegateType : special.bindType ) || type;
  			handlers = events[ type ] || [];
  			tmp = tmp[ 2 ] &&
  				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

  			// Remove matching events
  			origCount = j = handlers.length;
  			while ( j-- ) {
  				handleObj = handlers[ j ];

  				if ( ( mappedTypes || origType === handleObj.origType ) &&
  					( !handler || handler.guid === handleObj.guid ) &&
  					( !tmp || tmp.test( handleObj.namespace ) ) &&
  					( !selector || selector === handleObj.selector ||
  						selector === "**" && handleObj.selector ) ) {
  					handlers.splice( j, 1 );

  					if ( handleObj.selector ) {
  						handlers.delegateCount--;
  					}
  					if ( special.remove ) {
  						special.remove.call( elem, handleObj );
  					}
  				}
  			}

  			// Remove generic event handler if we removed something and no more handlers exist
  			// (avoids potential for endless recursion during removal of special event handlers)
  			if ( origCount && !handlers.length ) {
  				if ( !special.teardown ||
  					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

  					jQuery.removeEvent( elem, type, elemData.handle );
  				}

  				delete events[ type ];
  			}
  		}

  		// Remove data and the expando if it's no longer used
  		if ( jQuery.isEmptyObject( events ) ) {
  			dataPriv.remove( elem, "handle events" );
  		}
  	},

  	dispatch: function( event ) {

  		// Make a writable jQuery.Event from the native event object
  		event = jQuery.event.fix( event );

  		var i, j, ret, matched, handleObj,
  			handlerQueue = [],
  			args = slice.call( arguments ),
  			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
  			special = jQuery.event.special[ event.type ] || {};

  		// Use the fix-ed jQuery.Event rather than the (read-only) native event
  		args[ 0 ] = event;
  		event.delegateTarget = this;

  		// Call the preDispatch hook for the mapped type, and let it bail if desired
  		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
  			return;
  		}

  		// Determine handlers
  		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

  		// Run delegates first; they may want to stop propagation beneath us
  		i = 0;
  		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
  			event.currentTarget = matched.elem;

  			j = 0;
  			while ( ( handleObj = matched.handlers[ j++ ] ) &&
  				!event.isImmediatePropagationStopped() ) {

  				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
  				// a subset or equal to those in the bound event (both can have no namespace).
  				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

  					event.handleObj = handleObj;
  					event.data = handleObj.data;

  					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
  						handleObj.handler ).apply( matched.elem, args );

  					if ( ret !== undefined ) {
  						if ( ( event.result = ret ) === false ) {
  							event.preventDefault();
  							event.stopPropagation();
  						}
  					}
  				}
  			}
  		}

  		// Call the postDispatch hook for the mapped type
  		if ( special.postDispatch ) {
  			special.postDispatch.call( this, event );
  		}

  		return event.result;
  	},

  	handlers: function( event, handlers ) {
  		var i, matches, sel, handleObj,
  			handlerQueue = [],
  			delegateCount = handlers.delegateCount,
  			cur = event.target;

  		// Support (at least): Chrome, IE9
  		// Find delegate handlers
  		// Black-hole SVG <use> instance trees (#13180)
  		//
  		// Support: Firefox<=42+
  		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
  		if ( delegateCount && cur.nodeType &&
  			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

  			for ( ; cur !== this; cur = cur.parentNode || this ) {

  				// Don't check non-elements (#13208)
  				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
  				if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
  					matches = [];
  					for ( i = 0; i < delegateCount; i++ ) {
  						handleObj = handlers[ i ];

  						// Don't conflict with Object.prototype properties (#13203)
  						sel = handleObj.selector + " ";

  						if ( matches[ sel ] === undefined ) {
  							matches[ sel ] = handleObj.needsContext ?
  								jQuery( sel, this ).index( cur ) > -1 :
  								jQuery.find( sel, this, null, [ cur ] ).length;
  						}
  						if ( matches[ sel ] ) {
  							matches.push( handleObj );
  						}
  					}
  					if ( matches.length ) {
  						handlerQueue.push( { elem: cur, handlers: matches } );
  					}
  				}
  			}
  		}

  		// Add the remaining (directly-bound) handlers
  		if ( delegateCount < handlers.length ) {
  			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
  		}

  		return handlerQueue;
  	},

  	// Includes some event props shared by KeyEvent and MouseEvent
  	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
  		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

  	fixHooks: {},

  	keyHooks: {
  		props: "char charCode key keyCode".split( " " ),
  		filter: function( event, original ) {

  			// Add which for key events
  			if ( event.which == null ) {
  				event.which = original.charCode != null ? original.charCode : original.keyCode;
  			}

  			return event;
  		}
  	},

  	mouseHooks: {
  		props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
  			"screenX screenY toElement" ).split( " " ),
  		filter: function( event, original ) {
  			var eventDoc, doc, body,
  				button = original.button;

  			// Calculate pageX/Y if missing and clientX/Y available
  			if ( event.pageX == null && original.clientX != null ) {
  				eventDoc = event.target.ownerDocument || document;
  				doc = eventDoc.documentElement;
  				body = eventDoc.body;

  				event.pageX = original.clientX +
  					( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
  					( doc && doc.clientLeft || body && body.clientLeft || 0 );
  				event.pageY = original.clientY +
  					( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) -
  					( doc && doc.clientTop  || body && body.clientTop  || 0 );
  			}

  			// Add which for click: 1 === left; 2 === middle; 3 === right
  			// Note: button is not normalized, so don't use it
  			if ( !event.which && button !== undefined ) {
  				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
  			}

  			return event;
  		}
  	},

  	fix: function( event ) {
  		if ( event[ jQuery.expando ] ) {
  			return event;
  		}

  		// Create a writable copy of the event object and normalize some properties
  		var i, prop, copy,
  			type = event.type,
  			originalEvent = event,
  			fixHook = this.fixHooks[ type ];

  		if ( !fixHook ) {
  			this.fixHooks[ type ] = fixHook =
  				rmouseEvent.test( type ) ? this.mouseHooks :
  				rkeyEvent.test( type ) ? this.keyHooks :
  				{};
  		}
  		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

  		event = new jQuery.Event( originalEvent );

  		i = copy.length;
  		while ( i-- ) {
  			prop = copy[ i ];
  			event[ prop ] = originalEvent[ prop ];
  		}

  		// Support: Cordova 2.5 (WebKit) (#13255)
  		// All events should have a target; Cordova deviceready doesn't
  		if ( !event.target ) {
  			event.target = document;
  		}

  		// Support: Safari 6.0+, Chrome<28
  		// Target should not be a text node (#504, #13143)
  		if ( event.target.nodeType === 3 ) {
  			event.target = event.target.parentNode;
  		}

  		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
  	},

  	special: {
  		load: {

  			// Prevent triggered image.load events from bubbling to window.load
  			noBubble: true
  		},
  		focus: {

  			// Fire native event if possible so blur/focus sequence is correct
  			trigger: function() {
  				if ( this !== safeActiveElement() && this.focus ) {
  					this.focus();
  					return false;
  				}
  			},
  			delegateType: "focusin"
  		},
  		blur: {
  			trigger: function() {
  				if ( this === safeActiveElement() && this.blur ) {
  					this.blur();
  					return false;
  				}
  			},
  			delegateType: "focusout"
  		},
  		click: {

  			// For checkbox, fire native event so checked state will be right
  			trigger: function() {
  				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
  					this.click();
  					return false;
  				}
  			},

  			// For cross-browser consistency, don't fire native .click() on links
  			_default: function( event ) {
  				return jQuery.nodeName( event.target, "a" );
  			}
  		},

  		beforeunload: {
  			postDispatch: function( event ) {

  				// Support: Firefox 20+
  				// Firefox doesn't alert if the returnValue field is not set.
  				if ( event.result !== undefined && event.originalEvent ) {
  					event.originalEvent.returnValue = event.result;
  				}
  			}
  		}
  	}
  };

  jQuery.removeEvent = function( elem, type, handle ) {

  	// This "if" is needed for plain objects
  	if ( elem.removeEventListener ) {
  		elem.removeEventListener( type, handle );
  	}
  };

  jQuery.Event = function( src, props ) {

  	// Allow instantiation without the 'new' keyword
  	if ( !( this instanceof jQuery.Event ) ) {
  		return new jQuery.Event( src, props );
  	}

  	// Event object
  	if ( src && src.type ) {
  		this.originalEvent = src;
  		this.type = src.type;

  		// Events bubbling up the document may have been marked as prevented
  		// by a handler lower down the tree; reflect the correct value.
  		this.isDefaultPrevented = src.defaultPrevented ||
  				src.defaultPrevented === undefined &&

  				// Support: Android<4.0
  				src.returnValue === false ?
  			returnTrue :
  			returnFalse;

  	// Event type
  	} else {
  		this.type = src;
  	}

  	// Put explicitly provided properties onto the event object
  	if ( props ) {
  		jQuery.extend( this, props );
  	}

  	// Create a timestamp if incoming event doesn't have one
  	this.timeStamp = src && src.timeStamp || jQuery.now();

  	// Mark it as fixed
  	this[ jQuery.expando ] = true;
  };

  // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
  // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
  jQuery.Event.prototype = {
  	constructor: jQuery.Event,
  	isDefaultPrevented: returnFalse,
  	isPropagationStopped: returnFalse,
  	isImmediatePropagationStopped: returnFalse,
  	isSimulated: false,

  	preventDefault: function() {
  		var e = this.originalEvent;

  		this.isDefaultPrevented = returnTrue;

  		if ( e && !this.isSimulated ) {
  			e.preventDefault();
  		}
  	},
  	stopPropagation: function() {
  		var e = this.originalEvent;

  		this.isPropagationStopped = returnTrue;

  		if ( e && !this.isSimulated ) {
  			e.stopPropagation();
  		}
  	},
  	stopImmediatePropagation: function() {
  		var e = this.originalEvent;

  		this.isImmediatePropagationStopped = returnTrue;

  		if ( e && !this.isSimulated ) {
  			e.stopImmediatePropagation();
  		}

  		this.stopPropagation();
  	}
  };

  // Create mouseenter/leave events using mouseover/out and event-time checks
  // so that event delegation works in jQuery.
  // Do the same for pointerenter/pointerleave and pointerover/pointerout
  //
  // Support: Safari 7 only
  // Safari sends mouseenter too often; see:
  // https://code.google.com/p/chromium/issues/detail?id=470258
  // for the description of the bug (it existed in older Chrome versions as well).
  jQuery.each( {
  	mouseenter: "mouseover",
  	mouseleave: "mouseout",
  	pointerenter: "pointerover",
  	pointerleave: "pointerout"
  }, function( orig, fix ) {
  	jQuery.event.special[ orig ] = {
  		delegateType: fix,
  		bindType: fix,

  		handle: function( event ) {
  			var ret,
  				target = this,
  				related = event.relatedTarget,
  				handleObj = event.handleObj;

  			// For mouseenter/leave call the handler if related is outside the target.
  			// NB: No relatedTarget if the mouse left/entered the browser window
  			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
  				event.type = handleObj.origType;
  				ret = handleObj.handler.apply( this, arguments );
  				event.type = fix;
  			}
  			return ret;
  		}
  	};
  } );

  jQuery.fn.extend( {
  	on: function( types, selector, data, fn ) {
  		return on( this, types, selector, data, fn );
  	},
  	one: function( types, selector, data, fn ) {
  		return on( this, types, selector, data, fn, 1 );
  	},
  	off: function( types, selector, fn ) {
  		var handleObj, type;
  		if ( types && types.preventDefault && types.handleObj ) {

  			// ( event )  dispatched jQuery.Event
  			handleObj = types.handleObj;
  			jQuery( types.delegateTarget ).off(
  				handleObj.namespace ?
  					handleObj.origType + "." + handleObj.namespace :
  					handleObj.origType,
  				handleObj.selector,
  				handleObj.handler
  			);
  			return this;
  		}
  		if ( typeof types === "object" ) {

  			// ( types-object [, selector] )
  			for ( type in types ) {
  				this.off( type, selector, types[ type ] );
  			}
  			return this;
  		}
  		if ( selector === false || typeof selector === "function" ) {

  			// ( types [, fn] )
  			fn = selector;
  			selector = undefined;
  		}
  		if ( fn === false ) {
  			fn = returnFalse;
  		}
  		return this.each( function() {
  			jQuery.event.remove( this, types, fn, selector );
  		} );
  	}
  } );


  var
  	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

  	// Support: IE 10-11, Edge 10240+
  	// In IE/Edge using regex groups here causes severe slowdowns.
  	// See https://connect.microsoft.com/IE/feedback/details/1736512/
  	rnoInnerhtml = /<script|<style|<link/i,

  	// checked="checked" or checked
  	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
  	rscriptTypeMasked = /^true\/(.*)/,
  	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

  // Manipulating tables requires a tbody
  function manipulationTarget( elem, content ) {
  	return jQuery.nodeName( elem, "table" ) &&
  		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

  		elem.getElementsByTagName( "tbody" )[ 0 ] ||
  			elem.appendChild( elem.ownerDocument.createElement( "tbody" ) ) :
  		elem;
  }

  // Replace/restore the type attribute of script elements for safe DOM manipulation
  function disableScript( elem ) {
  	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
  	return elem;
  }
  function restoreScript( elem ) {
  	var match = rscriptTypeMasked.exec( elem.type );

  	if ( match ) {
  		elem.type = match[ 1 ];
  	} else {
  		elem.removeAttribute( "type" );
  	}

  	return elem;
  }

  function cloneCopyEvent( src, dest ) {
  	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

  	if ( dest.nodeType !== 1 ) {
  		return;
  	}

  	// 1. Copy private data: events, handlers, etc.
  	if ( dataPriv.hasData( src ) ) {
  		pdataOld = dataPriv.access( src );
  		pdataCur = dataPriv.set( dest, pdataOld );
  		events = pdataOld.events;

  		if ( events ) {
  			delete pdataCur.handle;
  			pdataCur.events = {};

  			for ( type in events ) {
  				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
  					jQuery.event.add( dest, type, events[ type ][ i ] );
  				}
  			}
  		}
  	}

  	// 2. Copy user data
  	if ( dataUser.hasData( src ) ) {
  		udataOld = dataUser.access( src );
  		udataCur = jQuery.extend( {}, udataOld );

  		dataUser.set( dest, udataCur );
  	}
  }

  // Fix IE bugs, see support tests
  function fixInput( src, dest ) {
  	var nodeName = dest.nodeName.toLowerCase();

  	// Fails to persist the checked state of a cloned checkbox or radio button.
  	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
  		dest.checked = src.checked;

  	// Fails to return the selected option to the default selected state when cloning options
  	} else if ( nodeName === "input" || nodeName === "textarea" ) {
  		dest.defaultValue = src.defaultValue;
  	}
  }

  function domManip( collection, args, callback, ignored ) {

  	// Flatten any nested arrays
  	args = concat.apply( [], args );

  	var fragment, first, scripts, hasScripts, node, doc,
  		i = 0,
  		l = collection.length,
  		iNoClone = l - 1,
  		value = args[ 0 ],
  		isFunction = jQuery.isFunction( value );

  	// We can't cloneNode fragments that contain checked, in WebKit
  	if ( isFunction ||
  			( l > 1 && typeof value === "string" &&
  				!support.checkClone && rchecked.test( value ) ) ) {
  		return collection.each( function( index ) {
  			var self = collection.eq( index );
  			if ( isFunction ) {
  				args[ 0 ] = value.call( this, index, self.html() );
  			}
  			domManip( self, args, callback, ignored );
  		} );
  	}

  	if ( l ) {
  		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
  		first = fragment.firstChild;

  		if ( fragment.childNodes.length === 1 ) {
  			fragment = first;
  		}

  		// Require either new content or an interest in ignored elements to invoke the callback
  		if ( first || ignored ) {
  			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
  			hasScripts = scripts.length;

  			// Use the original fragment for the last item
  			// instead of the first because it can end up
  			// being emptied incorrectly in certain situations (#8070).
  			for ( ; i < l; i++ ) {
  				node = fragment;

  				if ( i !== iNoClone ) {
  					node = jQuery.clone( node, true, true );

  					// Keep references to cloned scripts for later restoration
  					if ( hasScripts ) {

  						// Support: Android<4.1, PhantomJS<2
  						// push.apply(_, arraylike) throws on ancient WebKit
  						jQuery.merge( scripts, getAll( node, "script" ) );
  					}
  				}

  				callback.call( collection[ i ], node, i );
  			}

  			if ( hasScripts ) {
  				doc = scripts[ scripts.length - 1 ].ownerDocument;

  				// Reenable scripts
  				jQuery.map( scripts, restoreScript );

  				// Evaluate executable scripts on first document insertion
  				for ( i = 0; i < hasScripts; i++ ) {
  					node = scripts[ i ];
  					if ( rscriptType.test( node.type || "" ) &&
  						!dataPriv.access( node, "globalEval" ) &&
  						jQuery.contains( doc, node ) ) {

  						if ( node.src ) {

  							// Optional AJAX dependency, but won't run scripts if not present
  							if ( jQuery._evalUrl ) {
  								jQuery._evalUrl( node.src );
  							}
  						} else {
  							jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
  						}
  					}
  				}
  			}
  		}
  	}

  	return collection;
  }

  function remove( elem, selector, keepData ) {
  	var node,
  		nodes = selector ? jQuery.filter( selector, elem ) : elem,
  		i = 0;

  	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
  		if ( !keepData && node.nodeType === 1 ) {
  			jQuery.cleanData( getAll( node ) );
  		}

  		if ( node.parentNode ) {
  			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
  				setGlobalEval( getAll( node, "script" ) );
  			}
  			node.parentNode.removeChild( node );
  		}
  	}

  	return elem;
  }

  jQuery.extend( {
  	htmlPrefilter: function( html ) {
  		return html.replace( rxhtmlTag, "<$1></$2>" );
  	},

  	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
  		var i, l, srcElements, destElements,
  			clone = elem.cloneNode( true ),
  			inPage = jQuery.contains( elem.ownerDocument, elem );

  		// Fix IE cloning issues
  		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
  				!jQuery.isXMLDoc( elem ) ) {

  			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
  			destElements = getAll( clone );
  			srcElements = getAll( elem );

  			for ( i = 0, l = srcElements.length; i < l; i++ ) {
  				fixInput( srcElements[ i ], destElements[ i ] );
  			}
  		}

  		// Copy the events from the original to the clone
  		if ( dataAndEvents ) {
  			if ( deepDataAndEvents ) {
  				srcElements = srcElements || getAll( elem );
  				destElements = destElements || getAll( clone );

  				for ( i = 0, l = srcElements.length; i < l; i++ ) {
  					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
  				}
  			} else {
  				cloneCopyEvent( elem, clone );
  			}
  		}

  		// Preserve script evaluation history
  		destElements = getAll( clone, "script" );
  		if ( destElements.length > 0 ) {
  			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
  		}

  		// Return the cloned set
  		return clone;
  	},

  	cleanData: function( elems ) {
  		var data, elem, type,
  			special = jQuery.event.special,
  			i = 0;

  		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
  			if ( acceptData( elem ) ) {
  				if ( ( data = elem[ dataPriv.expando ] ) ) {
  					if ( data.events ) {
  						for ( type in data.events ) {
  							if ( special[ type ] ) {
  								jQuery.event.remove( elem, type );

  							// This is a shortcut to avoid jQuery.event.remove's overhead
  							} else {
  								jQuery.removeEvent( elem, type, data.handle );
  							}
  						}
  					}

  					// Support: Chrome <= 35-45+
  					// Assign undefined instead of using delete, see Data#remove
  					elem[ dataPriv.expando ] = undefined;
  				}
  				if ( elem[ dataUser.expando ] ) {

  					// Support: Chrome <= 35-45+
  					// Assign undefined instead of using delete, see Data#remove
  					elem[ dataUser.expando ] = undefined;
  				}
  			}
  		}
  	}
  } );

  jQuery.fn.extend( {

  	// Keep domManip exposed until 3.0 (gh-2225)
  	domManip: domManip,

  	detach: function( selector ) {
  		return remove( this, selector, true );
  	},

  	remove: function( selector ) {
  		return remove( this, selector );
  	},

  	text: function( value ) {
  		return access( this, function( value ) {
  			return value === undefined ?
  				jQuery.text( this ) :
  				this.empty().each( function() {
  					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
  						this.textContent = value;
  					}
  				} );
  		}, null, value, arguments.length );
  	},

  	append: function() {
  		return domManip( this, arguments, function( elem ) {
  			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
  				var target = manipulationTarget( this, elem );
  				target.appendChild( elem );
  			}
  		} );
  	},

  	prepend: function() {
  		return domManip( this, arguments, function( elem ) {
  			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
  				var target = manipulationTarget( this, elem );
  				target.insertBefore( elem, target.firstChild );
  			}
  		} );
  	},

  	before: function() {
  		return domManip( this, arguments, function( elem ) {
  			if ( this.parentNode ) {
  				this.parentNode.insertBefore( elem, this );
  			}
  		} );
  	},

  	after: function() {
  		return domManip( this, arguments, function( elem ) {
  			if ( this.parentNode ) {
  				this.parentNode.insertBefore( elem, this.nextSibling );
  			}
  		} );
  	},

  	empty: function() {
  		var elem,
  			i = 0;

  		for ( ; ( elem = this[ i ] ) != null; i++ ) {
  			if ( elem.nodeType === 1 ) {

  				// Prevent memory leaks
  				jQuery.cleanData( getAll( elem, false ) );

  				// Remove any remaining nodes
  				elem.textContent = "";
  			}
  		}

  		return this;
  	},

  	clone: function( dataAndEvents, deepDataAndEvents ) {
  		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
  		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

  		return this.map( function() {
  			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
  		} );
  	},

  	html: function( value ) {
  		return access( this, function( value ) {
  			var elem = this[ 0 ] || {},
  				i = 0,
  				l = this.length;

  			if ( value === undefined && elem.nodeType === 1 ) {
  				return elem.innerHTML;
  			}

  			// See if we can take a shortcut and just use innerHTML
  			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
  				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

  				value = jQuery.htmlPrefilter( value );

  				try {
  					for ( ; i < l; i++ ) {
  						elem = this[ i ] || {};

  						// Remove element nodes and prevent memory leaks
  						if ( elem.nodeType === 1 ) {
  							jQuery.cleanData( getAll( elem, false ) );
  							elem.innerHTML = value;
  						}
  					}

  					elem = 0;

  				// If using innerHTML throws an exception, use the fallback method
  				} catch ( e ) {}
  			}

  			if ( elem ) {
  				this.empty().append( value );
  			}
  		}, null, value, arguments.length );
  	},

  	replaceWith: function() {
  		var ignored = [];

  		// Make the changes, replacing each non-ignored context element with the new content
  		return domManip( this, arguments, function( elem ) {
  			var parent = this.parentNode;

  			if ( jQuery.inArray( this, ignored ) < 0 ) {
  				jQuery.cleanData( getAll( this ) );
  				if ( parent ) {
  					parent.replaceChild( elem, this );
  				}
  			}

  		// Force callback invocation
  		}, ignored );
  	}
  } );

  jQuery.each( {
  	appendTo: "append",
  	prependTo: "prepend",
  	insertBefore: "before",
  	insertAfter: "after",
  	replaceAll: "replaceWith"
  }, function( name, original ) {
  	jQuery.fn[ name ] = function( selector ) {
  		var elems,
  			ret = [],
  			insert = jQuery( selector ),
  			last = insert.length - 1,
  			i = 0;

  		for ( ; i <= last; i++ ) {
  			elems = i === last ? this : this.clone( true );
  			jQuery( insert[ i ] )[ original ]( elems );

  			// Support: QtWebKit
  			// .get() because push.apply(_, arraylike) throws
  			push.apply( ret, elems.get() );
  		}

  		return this.pushStack( ret );
  	};
  } );


  var iframe,
  	elemdisplay = {

  		// Support: Firefox
  		// We have to pre-define these values for FF (#10227)
  		HTML: "block",
  		BODY: "block"
  	};

  /**
   * Retrieve the actual display of a element
   * @param {String} name nodeName of the element
   * @param {Object} doc Document object
   */

  // Called only from within defaultDisplay
  function actualDisplay( name, doc ) {
  	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

  		display = jQuery.css( elem[ 0 ], "display" );

  	// We don't have any data stored on the element,
  	// so use "detach" method as fast way to get rid of the element
  	elem.detach();

  	return display;
  }

  /**
   * Try to determine the default display value of an element
   * @param {String} nodeName
   */
  function defaultDisplay( nodeName ) {
  	var doc = document,
  		display = elemdisplay[ nodeName ];

  	if ( !display ) {
  		display = actualDisplay( nodeName, doc );

  		// If the simple way fails, read from inside an iframe
  		if ( display === "none" || !display ) {

  			// Use the already-created iframe if possible
  			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
  				.appendTo( doc.documentElement );

  			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
  			doc = iframe[ 0 ].contentDocument;

  			// Support: IE
  			doc.write();
  			doc.close();

  			display = actualDisplay( nodeName, doc );
  			iframe.detach();
  		}

  		// Store the correct default display
  		elemdisplay[ nodeName ] = display;
  	}

  	return display;
  }
  var rmargin = ( /^margin/ );

  var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

  var getStyles = function( elem ) {

  		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
  		// IE throws on elements created in popups
  		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
  		var view = elem.ownerDocument.defaultView;

  		if ( !view || !view.opener ) {
  			view = window;
  		}

  		return view.getComputedStyle( elem );
  	};

  var swap = function( elem, options, callback, args ) {
  	var ret, name,
  		old = {};

  	// Remember the old values, and insert the new ones
  	for ( name in options ) {
  		old[ name ] = elem.style[ name ];
  		elem.style[ name ] = options[ name ];
  	}

  	ret = callback.apply( elem, args || [] );

  	// Revert the old values
  	for ( name in options ) {
  		elem.style[ name ] = old[ name ];
  	}

  	return ret;
  };


  var documentElement = document.documentElement;



  ( function() {
  	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
  		container = document.createElement( "div" ),
  		div = document.createElement( "div" );

  	// Finish early in limited (non-browser) environments
  	if ( !div.style ) {
  		return;
  	}

  	// Support: IE9-11+
  	// Style of cloned element affects source element cloned (#8908)
  	div.style.backgroundClip = "content-box";
  	div.cloneNode( true ).style.backgroundClip = "";
  	support.clearCloneStyle = div.style.backgroundClip === "content-box";

  	container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
  		"padding:0;margin-top:1px;position:absolute";
  	container.appendChild( div );

  	// Executing both pixelPosition & boxSizingReliable tests require only one layout
  	// so they're executed at the same time to save the second computation.
  	function computeStyleTests() {
  		div.style.cssText =

  			// Support: Firefox<29, Android 2.3
  			// Vendor-prefix box-sizing
  			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
  			"position:relative;display:block;" +
  			"margin:auto;border:1px;padding:1px;" +
  			"top:1%;width:50%";
  		div.innerHTML = "";
  		documentElement.appendChild( container );

  		var divStyle = window.getComputedStyle( div );
  		pixelPositionVal = divStyle.top !== "1%";
  		reliableMarginLeftVal = divStyle.marginLeft === "2px";
  		boxSizingReliableVal = divStyle.width === "4px";

  		// Support: Android 4.0 - 4.3 only
  		// Some styles come back with percentage values, even though they shouldn't
  		div.style.marginRight = "50%";
  		pixelMarginRightVal = divStyle.marginRight === "4px";

  		documentElement.removeChild( container );
  	}

  	jQuery.extend( support, {
  		pixelPosition: function() {

  			// This test is executed only once but we still do memoizing
  			// since we can use the boxSizingReliable pre-computing.
  			// No need to check if the test was already performed, though.
  			computeStyleTests();
  			return pixelPositionVal;
  		},
  		boxSizingReliable: function() {
  			if ( boxSizingReliableVal == null ) {
  				computeStyleTests();
  			}
  			return boxSizingReliableVal;
  		},
  		pixelMarginRight: function() {

  			// Support: Android 4.0-4.3
  			// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
  			// since that compresses better and they're computed together anyway.
  			if ( boxSizingReliableVal == null ) {
  				computeStyleTests();
  			}
  			return pixelMarginRightVal;
  		},
  		reliableMarginLeft: function() {

  			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
  			if ( boxSizingReliableVal == null ) {
  				computeStyleTests();
  			}
  			return reliableMarginLeftVal;
  		},
  		reliableMarginRight: function() {

  			// Support: Android 2.3
  			// Check if div with explicit width and no margin-right incorrectly
  			// gets computed margin-right based on width of container. (#3333)
  			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
  			// This support function is only executed once so no memoizing is needed.
  			var ret,
  				marginDiv = div.appendChild( document.createElement( "div" ) );

  			// Reset CSS: box-sizing; display; margin; border; padding
  			marginDiv.style.cssText = div.style.cssText =

  				// Support: Android 2.3
  				// Vendor-prefix box-sizing
  				"-webkit-box-sizing:content-box;box-sizing:content-box;" +
  				"display:block;margin:0;border:0;padding:0";
  			marginDiv.style.marginRight = marginDiv.style.width = "0";
  			div.style.width = "1px";
  			documentElement.appendChild( container );

  			ret = !parseFloat( window.getComputedStyle( marginDiv ).marginRight );

  			documentElement.removeChild( container );
  			div.removeChild( marginDiv );

  			return ret;
  		}
  	} );
  } )();


  function curCSS( elem, name, computed ) {
  	var width, minWidth, maxWidth, ret,
  		style = elem.style;

  	computed = computed || getStyles( elem );
  	ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined;

  	// Support: Opera 12.1x only
  	// Fall back to style even without computed
  	// computed is undefined for elems on document fragments
  	if ( ( ret === "" || ret === undefined ) && !jQuery.contains( elem.ownerDocument, elem ) ) {
  		ret = jQuery.style( elem, name );
  	}

  	// Support: IE9
  	// getPropertyValue is only needed for .css('filter') (#12537)
  	if ( computed ) {

  		// A tribute to the "awesome hack by Dean Edwards"
  		// Android Browser returns percentage for some values,
  		// but width seems to be reliably pixels.
  		// This is against the CSSOM draft spec:
  		// http://dev.w3.org/csswg/cssom/#resolved-values
  		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

  			// Remember the original values
  			width = style.width;
  			minWidth = style.minWidth;
  			maxWidth = style.maxWidth;

  			// Put in the new values to get a computed value out
  			style.minWidth = style.maxWidth = style.width = ret;
  			ret = computed.width;

  			// Revert the changed values
  			style.width = width;
  			style.minWidth = minWidth;
  			style.maxWidth = maxWidth;
  		}
  	}

  	return ret !== undefined ?

  		// Support: IE9-11+
  		// IE returns zIndex value as an integer.
  		ret + "" :
  		ret;
  }


  function addGetHookIf( conditionFn, hookFn ) {

  	// Define the hook, we'll check on the first run if it's really needed.
  	return {
  		get: function() {
  			if ( conditionFn() ) {

  				// Hook not needed (or it's not possible to use it due
  				// to missing dependency), remove it.
  				delete this.get;
  				return;
  			}

  			// Hook needed; redefine it so that the support test is not executed again.
  			return ( this.get = hookFn ).apply( this, arguments );
  		}
  	};
  }


  var

  	// Swappable if display is none or starts with table
  	// except "table", "table-cell", or "table-caption"
  	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
  	rdisplayswap = /^(none|table(?!-c[ea]).+)/,

  	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
  	cssNormalTransform = {
  		letterSpacing: "0",
  		fontWeight: "400"
  	},

  	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
  	emptyStyle = document.createElement( "div" ).style;

  // Return a css property mapped to a potentially vendor prefixed property
  function vendorPropName( name ) {

  	// Shortcut for names that are not vendor prefixed
  	if ( name in emptyStyle ) {
  		return name;
  	}

  	// Check for vendor prefixed names
  	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
  		i = cssPrefixes.length;

  	while ( i-- ) {
  		name = cssPrefixes[ i ] + capName;
  		if ( name in emptyStyle ) {
  			return name;
  		}
  	}
  }

  function setPositiveNumber( elem, value, subtract ) {

  	// Any relative (+/-) values have already been
  	// normalized at this point
  	var matches = rcssNum.exec( value );
  	return matches ?

  		// Guard against undefined "subtract", e.g., when used as in cssHooks
  		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
  		value;
  }

  function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
  	var i = extra === ( isBorderBox ? "border" : "content" ) ?

  		// If we already have the right measurement, avoid augmentation
  		4 :

  		// Otherwise initialize for horizontal or vertical properties
  		name === "width" ? 1 : 0,

  		val = 0;

  	for ( ; i < 4; i += 2 ) {

  		// Both box models exclude margin, so add it if we want it
  		if ( extra === "margin" ) {
  			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
  		}

  		if ( isBorderBox ) {

  			// border-box includes padding, so remove it if we want content
  			if ( extra === "content" ) {
  				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
  			}

  			// At this point, extra isn't border nor margin, so remove border
  			if ( extra !== "margin" ) {
  				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
  			}
  		} else {

  			// At this point, extra isn't content, so add padding
  			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

  			// At this point, extra isn't content nor padding, so add border
  			if ( extra !== "padding" ) {
  				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
  			}
  		}
  	}

  	return val;
  }

  function getWidthOrHeight( elem, name, extra ) {

  	// Start with offset property, which is equivalent to the border-box value
  	var valueIsBorderBox = true,
  		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
  		styles = getStyles( elem ),
  		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

  	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
  	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
  	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
  	if ( val <= 0 || val == null ) {

  		// Fall back to computed then uncomputed css if necessary
  		val = curCSS( elem, name, styles );
  		if ( val < 0 || val == null ) {
  			val = elem.style[ name ];
  		}

  		// Computed unit is not pixels. Stop here and return.
  		if ( rnumnonpx.test( val ) ) {
  			return val;
  		}

  		// Check for style in case a browser which returns unreliable values
  		// for getComputedStyle silently falls back to the reliable elem.style
  		valueIsBorderBox = isBorderBox &&
  			( support.boxSizingReliable() || val === elem.style[ name ] );

  		// Normalize "", auto, and prepare for extra
  		val = parseFloat( val ) || 0;
  	}

  	// Use the active box-sizing model to add/subtract irrelevant styles
  	return ( val +
  		augmentWidthOrHeight(
  			elem,
  			name,
  			extra || ( isBorderBox ? "border" : "content" ),
  			valueIsBorderBox,
  			styles
  		)
  	) + "px";
  }

  function showHide( elements, show ) {
  	var display, elem, hidden,
  		values = [],
  		index = 0,
  		length = elements.length;

  	for ( ; index < length; index++ ) {
  		elem = elements[ index ];
  		if ( !elem.style ) {
  			continue;
  		}

  		values[ index ] = dataPriv.get( elem, "olddisplay" );
  		display = elem.style.display;
  		if ( show ) {

  			// Reset the inline display of this element to learn if it is
  			// being hidden by cascaded rules or not
  			if ( !values[ index ] && display === "none" ) {
  				elem.style.display = "";
  			}

  			// Set elements which have been overridden with display: none
  			// in a stylesheet to whatever the default browser style is
  			// for such an element
  			if ( elem.style.display === "" && isHidden( elem ) ) {
  				values[ index ] = dataPriv.access(
  					elem,
  					"olddisplay",
  					defaultDisplay( elem.nodeName )
  				);
  			}
  		} else {
  			hidden = isHidden( elem );

  			if ( display !== "none" || !hidden ) {
  				dataPriv.set(
  					elem,
  					"olddisplay",
  					hidden ? display : jQuery.css( elem, "display" )
  				);
  			}
  		}
  	}

  	// Set the display of most of the elements in a second loop
  	// to avoid the constant reflow
  	for ( index = 0; index < length; index++ ) {
  		elem = elements[ index ];
  		if ( !elem.style ) {
  			continue;
  		}
  		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
  			elem.style.display = show ? values[ index ] || "" : "none";
  		}
  	}

  	return elements;
  }

  jQuery.extend( {

  	// Add in style property hooks for overriding the default
  	// behavior of getting and setting a style property
  	cssHooks: {
  		opacity: {
  			get: function( elem, computed ) {
  				if ( computed ) {

  					// We should always get a number back from opacity
  					var ret = curCSS( elem, "opacity" );
  					return ret === "" ? "1" : ret;
  				}
  			}
  		}
  	},

  	// Don't automatically add "px" to these possibly-unitless properties
  	cssNumber: {
  		"animationIterationCount": true,
  		"columnCount": true,
  		"fillOpacity": true,
  		"flexGrow": true,
  		"flexShrink": true,
  		"fontWeight": true,
  		"lineHeight": true,
  		"opacity": true,
  		"order": true,
  		"orphans": true,
  		"widows": true,
  		"zIndex": true,
  		"zoom": true
  	},

  	// Add in properties whose names you wish to fix before
  	// setting or getting the value
  	cssProps: {
  		"float": "cssFloat"
  	},

  	// Get and set the style property on a DOM Node
  	style: function( elem, name, value, extra ) {

  		// Don't set styles on text and comment nodes
  		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
  			return;
  		}

  		// Make sure that we're working with the right name
  		var ret, type, hooks,
  			origName = jQuery.camelCase( name ),
  			style = elem.style;

  		name = jQuery.cssProps[ origName ] ||
  			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

  		// Gets hook for the prefixed version, then unprefixed version
  		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

  		// Check if we're setting a value
  		if ( value !== undefined ) {
  			type = typeof value;

  			// Convert "+=" or "-=" to relative numbers (#7345)
  			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
  				value = adjustCSS( elem, name, ret );

  				// Fixes bug #9237
  				type = "number";
  			}

  			// Make sure that null and NaN values aren't set (#7116)
  			if ( value == null || value !== value ) {
  				return;
  			}

  			// If a number was passed in, add the unit (except for certain CSS properties)
  			if ( type === "number" ) {
  				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
  			}

  			// Support: IE9-11+
  			// background-* props affect original clone's values
  			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
  				style[ name ] = "inherit";
  			}

  			// If a hook was provided, use that value, otherwise just set the specified value
  			if ( !hooks || !( "set" in hooks ) ||
  				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

  				style[ name ] = value;
  			}

  		} else {

  			// If a hook was provided get the non-computed value from there
  			if ( hooks && "get" in hooks &&
  				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

  				return ret;
  			}

  			// Otherwise just get the value from the style object
  			return style[ name ];
  		}
  	},

  	css: function( elem, name, extra, styles ) {
  		var val, num, hooks,
  			origName = jQuery.camelCase( name );

  		// Make sure that we're working with the right name
  		name = jQuery.cssProps[ origName ] ||
  			( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

  		// Try prefixed name followed by the unprefixed name
  		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

  		// If a hook was provided get the computed value from there
  		if ( hooks && "get" in hooks ) {
  			val = hooks.get( elem, true, extra );
  		}

  		// Otherwise, if a way to get the computed value exists, use that
  		if ( val === undefined ) {
  			val = curCSS( elem, name, styles );
  		}

  		// Convert "normal" to computed value
  		if ( val === "normal" && name in cssNormalTransform ) {
  			val = cssNormalTransform[ name ];
  		}

  		// Make numeric if forced or a qualifier was provided and val looks numeric
  		if ( extra === "" || extra ) {
  			num = parseFloat( val );
  			return extra === true || isFinite( num ) ? num || 0 : val;
  		}
  		return val;
  	}
  } );

  jQuery.each( [ "height", "width" ], function( i, name ) {
  	jQuery.cssHooks[ name ] = {
  		get: function( elem, computed, extra ) {
  			if ( computed ) {

  				// Certain elements can have dimension info if we invisibly show them
  				// but it must have a current display style that would benefit
  				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
  					elem.offsetWidth === 0 ?
  						swap( elem, cssShow, function() {
  							return getWidthOrHeight( elem, name, extra );
  						} ) :
  						getWidthOrHeight( elem, name, extra );
  			}
  		},

  		set: function( elem, value, extra ) {
  			var matches,
  				styles = extra && getStyles( elem ),
  				subtract = extra && augmentWidthOrHeight(
  					elem,
  					name,
  					extra,
  					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
  					styles
  				);

  			// Convert to pixels if value adjustment is needed
  			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
  				( matches[ 3 ] || "px" ) !== "px" ) {

  				elem.style[ name ] = value;
  				value = jQuery.css( elem, name );
  			}

  			return setPositiveNumber( elem, value, subtract );
  		}
  	};
  } );

  jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
  	function( elem, computed ) {
  		if ( computed ) {
  			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
  				elem.getBoundingClientRect().left -
  					swap( elem, { marginLeft: 0 }, function() {
  						return elem.getBoundingClientRect().left;
  					} )
  				) + "px";
  		}
  	}
  );

  // Support: Android 2.3
  jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
  	function( elem, computed ) {
  		if ( computed ) {
  			return swap( elem, { "display": "inline-block" },
  				curCSS, [ elem, "marginRight" ] );
  		}
  	}
  );

  // These hooks are used by animate to expand properties
  jQuery.each( {
  	margin: "",
  	padding: "",
  	border: "Width"
  }, function( prefix, suffix ) {
  	jQuery.cssHooks[ prefix + suffix ] = {
  		expand: function( value ) {
  			var i = 0,
  				expanded = {},

  				// Assumes a single number if not a string
  				parts = typeof value === "string" ? value.split( " " ) : [ value ];

  			for ( ; i < 4; i++ ) {
  				expanded[ prefix + cssExpand[ i ] + suffix ] =
  					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
  			}

  			return expanded;
  		}
  	};

  	if ( !rmargin.test( prefix ) ) {
  		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
  	}
  } );

  jQuery.fn.extend( {
  	css: function( name, value ) {
  		return access( this, function( elem, name, value ) {
  			var styles, len,
  				map = {},
  				i = 0;

  			if ( jQuery.isArray( name ) ) {
  				styles = getStyles( elem );
  				len = name.length;

  				for ( ; i < len; i++ ) {
  					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
  				}

  				return map;
  			}

  			return value !== undefined ?
  				jQuery.style( elem, name, value ) :
  				jQuery.css( elem, name );
  		}, name, value, arguments.length > 1 );
  	},
  	show: function() {
  		return showHide( this, true );
  	},
  	hide: function() {
  		return showHide( this );
  	},
  	toggle: function( state ) {
  		if ( typeof state === "boolean" ) {
  			return state ? this.show() : this.hide();
  		}

  		return this.each( function() {
  			if ( isHidden( this ) ) {
  				jQuery( this ).show();
  			} else {
  				jQuery( this ).hide();
  			}
  		} );
  	}
  } );


  function Tween( elem, options, prop, end, easing ) {
  	return new Tween.prototype.init( elem, options, prop, end, easing );
  }
  jQuery.Tween = Tween;

  Tween.prototype = {
  	constructor: Tween,
  	init: function( elem, options, prop, end, easing, unit ) {
  		this.elem = elem;
  		this.prop = prop;
  		this.easing = easing || jQuery.easing._default;
  		this.options = options;
  		this.start = this.now = this.cur();
  		this.end = end;
  		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
  	},
  	cur: function() {
  		var hooks = Tween.propHooks[ this.prop ];

  		return hooks && hooks.get ?
  			hooks.get( this ) :
  			Tween.propHooks._default.get( this );
  	},
  	run: function( percent ) {
  		var eased,
  			hooks = Tween.propHooks[ this.prop ];

  		if ( this.options.duration ) {
  			this.pos = eased = jQuery.easing[ this.easing ](
  				percent, this.options.duration * percent, 0, 1, this.options.duration
  			);
  		} else {
  			this.pos = eased = percent;
  		}
  		this.now = ( this.end - this.start ) * eased + this.start;

  		if ( this.options.step ) {
  			this.options.step.call( this.elem, this.now, this );
  		}

  		if ( hooks && hooks.set ) {
  			hooks.set( this );
  		} else {
  			Tween.propHooks._default.set( this );
  		}
  		return this;
  	}
  };

  Tween.prototype.init.prototype = Tween.prototype;

  Tween.propHooks = {
  	_default: {
  		get: function( tween ) {
  			var result;

  			// Use a property on the element directly when it is not a DOM element,
  			// or when there is no matching style property that exists.
  			if ( tween.elem.nodeType !== 1 ||
  				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
  				return tween.elem[ tween.prop ];
  			}

  			// Passing an empty string as a 3rd parameter to .css will automatically
  			// attempt a parseFloat and fallback to a string if the parse fails.
  			// Simple values such as "10px" are parsed to Float;
  			// complex values such as "rotate(1rad)" are returned as-is.
  			result = jQuery.css( tween.elem, tween.prop, "" );

  			// Empty strings, null, undefined and "auto" are converted to 0.
  			return !result || result === "auto" ? 0 : result;
  		},
  		set: function( tween ) {

  			// Use step hook for back compat.
  			// Use cssHook if its there.
  			// Use .style if available and use plain properties where available.
  			if ( jQuery.fx.step[ tween.prop ] ) {
  				jQuery.fx.step[ tween.prop ]( tween );
  			} else if ( tween.elem.nodeType === 1 &&
  				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
  					jQuery.cssHooks[ tween.prop ] ) ) {
  				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
  			} else {
  				tween.elem[ tween.prop ] = tween.now;
  			}
  		}
  	}
  };

  // Support: IE9
  // Panic based approach to setting things on disconnected nodes
  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
  	set: function( tween ) {
  		if ( tween.elem.nodeType && tween.elem.parentNode ) {
  			tween.elem[ tween.prop ] = tween.now;
  		}
  	}
  };

  jQuery.easing = {
  	linear: function( p ) {
  		return p;
  	},
  	swing: function( p ) {
  		return 0.5 - Math.cos( p * Math.PI ) / 2;
  	},
  	_default: "swing"
  };

  jQuery.fx = Tween.prototype.init;

  // Back Compat <1.8 extension point
  jQuery.fx.step = {};




  var
  	fxNow, timerId,
  	rfxtypes = /^(?:toggle|show|hide)$/,
  	rrun = /queueHooks$/;

  // Animations created synchronously will run synchronously
  function createFxNow() {
  	window.setTimeout( function() {
  		fxNow = undefined;
  	} );
  	return ( fxNow = jQuery.now() );
  }

  // Generate parameters to create a standard animation
  function genFx( type, includeWidth ) {
  	var which,
  		i = 0,
  		attrs = { height: type };

  	// If we include width, step value is 1 to do all cssExpand values,
  	// otherwise step value is 2 to skip over Left and Right
  	includeWidth = includeWidth ? 1 : 0;
  	for ( ; i < 4 ; i += 2 - includeWidth ) {
  		which = cssExpand[ i ];
  		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
  	}

  	if ( includeWidth ) {
  		attrs.opacity = attrs.width = type;
  	}

  	return attrs;
  }

  function createTween( value, prop, animation ) {
  	var tween,
  		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
  		index = 0,
  		length = collection.length;
  	for ( ; index < length; index++ ) {
  		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

  			// We're done with this property
  			return tween;
  		}
  	}
  }

  function defaultPrefilter( elem, props, opts ) {
  	/* jshint validthis: true */
  	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
  		anim = this,
  		orig = {},
  		style = elem.style,
  		hidden = elem.nodeType && isHidden( elem ),
  		dataShow = dataPriv.get( elem, "fxshow" );

  	// Handle queue: false promises
  	if ( !opts.queue ) {
  		hooks = jQuery._queueHooks( elem, "fx" );
  		if ( hooks.unqueued == null ) {
  			hooks.unqueued = 0;
  			oldfire = hooks.empty.fire;
  			hooks.empty.fire = function() {
  				if ( !hooks.unqueued ) {
  					oldfire();
  				}
  			};
  		}
  		hooks.unqueued++;

  		anim.always( function() {

  			// Ensure the complete handler is called before this completes
  			anim.always( function() {
  				hooks.unqueued--;
  				if ( !jQuery.queue( elem, "fx" ).length ) {
  					hooks.empty.fire();
  				}
  			} );
  		} );
  	}

  	// Height/width overflow pass
  	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {

  		// Make sure that nothing sneaks out
  		// Record all 3 overflow attributes because IE9-10 do not
  		// change the overflow attribute when overflowX and
  		// overflowY are set to the same value
  		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

  		// Set display property to inline-block for height/width
  		// animations on inline elements that are having width/height animated
  		display = jQuery.css( elem, "display" );

  		// Test default display if display is currently "none"
  		checkDisplay = display === "none" ?
  			dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

  		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
  			style.display = "inline-block";
  		}
  	}

  	if ( opts.overflow ) {
  		style.overflow = "hidden";
  		anim.always( function() {
  			style.overflow = opts.overflow[ 0 ];
  			style.overflowX = opts.overflow[ 1 ];
  			style.overflowY = opts.overflow[ 2 ];
  		} );
  	}

  	// show/hide pass
  	for ( prop in props ) {
  		value = props[ prop ];
  		if ( rfxtypes.exec( value ) ) {
  			delete props[ prop ];
  			toggle = toggle || value === "toggle";
  			if ( value === ( hidden ? "hide" : "show" ) ) {

  				// If there is dataShow left over from a stopped hide or show
  				// and we are going to proceed with show, we should pretend to be hidden
  				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
  					hidden = true;
  				} else {
  					continue;
  				}
  			}
  			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

  		// Any non-fx value stops us from restoring the original display value
  		} else {
  			display = undefined;
  		}
  	}

  	if ( !jQuery.isEmptyObject( orig ) ) {
  		if ( dataShow ) {
  			if ( "hidden" in dataShow ) {
  				hidden = dataShow.hidden;
  			}
  		} else {
  			dataShow = dataPriv.access( elem, "fxshow", {} );
  		}

  		// Store state if its toggle - enables .stop().toggle() to "reverse"
  		if ( toggle ) {
  			dataShow.hidden = !hidden;
  		}
  		if ( hidden ) {
  			jQuery( elem ).show();
  		} else {
  			anim.done( function() {
  				jQuery( elem ).hide();
  			} );
  		}
  		anim.done( function() {
  			var prop;

  			dataPriv.remove( elem, "fxshow" );
  			for ( prop in orig ) {
  				jQuery.style( elem, prop, orig[ prop ] );
  			}
  		} );
  		for ( prop in orig ) {
  			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

  			if ( !( prop in dataShow ) ) {
  				dataShow[ prop ] = tween.start;
  				if ( hidden ) {
  					tween.end = tween.start;
  					tween.start = prop === "width" || prop === "height" ? 1 : 0;
  				}
  			}
  		}

  	// If this is a noop like .hide().hide(), restore an overwritten display value
  	} else if ( ( display === "none" ? defaultDisplay( elem.nodeName ) : display ) === "inline" ) {
  		style.display = display;
  	}
  }

  function propFilter( props, specialEasing ) {
  	var index, name, easing, value, hooks;

  	// camelCase, specialEasing and expand cssHook pass
  	for ( index in props ) {
  		name = jQuery.camelCase( index );
  		easing = specialEasing[ name ];
  		value = props[ index ];
  		if ( jQuery.isArray( value ) ) {
  			easing = value[ 1 ];
  			value = props[ index ] = value[ 0 ];
  		}

  		if ( index !== name ) {
  			props[ name ] = value;
  			delete props[ index ];
  		}

  		hooks = jQuery.cssHooks[ name ];
  		if ( hooks && "expand" in hooks ) {
  			value = hooks.expand( value );
  			delete props[ name ];

  			// Not quite $.extend, this won't overwrite existing keys.
  			// Reusing 'index' because we have the correct "name"
  			for ( index in value ) {
  				if ( !( index in props ) ) {
  					props[ index ] = value[ index ];
  					specialEasing[ index ] = easing;
  				}
  			}
  		} else {
  			specialEasing[ name ] = easing;
  		}
  	}
  }

  function Animation( elem, properties, options ) {
  	var result,
  		stopped,
  		index = 0,
  		length = Animation.prefilters.length,
  		deferred = jQuery.Deferred().always( function() {

  			// Don't match elem in the :animated selector
  			delete tick.elem;
  		} ),
  		tick = function() {
  			if ( stopped ) {
  				return false;
  			}
  			var currentTime = fxNow || createFxNow(),
  				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

  				// Support: Android 2.3
  				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
  				temp = remaining / animation.duration || 0,
  				percent = 1 - temp,
  				index = 0,
  				length = animation.tweens.length;

  			for ( ; index < length ; index++ ) {
  				animation.tweens[ index ].run( percent );
  			}

  			deferred.notifyWith( elem, [ animation, percent, remaining ] );

  			if ( percent < 1 && length ) {
  				return remaining;
  			} else {
  				deferred.resolveWith( elem, [ animation ] );
  				return false;
  			}
  		},
  		animation = deferred.promise( {
  			elem: elem,
  			props: jQuery.extend( {}, properties ),
  			opts: jQuery.extend( true, {
  				specialEasing: {},
  				easing: jQuery.easing._default
  			}, options ),
  			originalProperties: properties,
  			originalOptions: options,
  			startTime: fxNow || createFxNow(),
  			duration: options.duration,
  			tweens: [],
  			createTween: function( prop, end ) {
  				var tween = jQuery.Tween( elem, animation.opts, prop, end,
  						animation.opts.specialEasing[ prop ] || animation.opts.easing );
  				animation.tweens.push( tween );
  				return tween;
  			},
  			stop: function( gotoEnd ) {
  				var index = 0,

  					// If we are going to the end, we want to run all the tweens
  					// otherwise we skip this part
  					length = gotoEnd ? animation.tweens.length : 0;
  				if ( stopped ) {
  					return this;
  				}
  				stopped = true;
  				for ( ; index < length ; index++ ) {
  					animation.tweens[ index ].run( 1 );
  				}

  				// Resolve when we played the last frame; otherwise, reject
  				if ( gotoEnd ) {
  					deferred.notifyWith( elem, [ animation, 1, 0 ] );
  					deferred.resolveWith( elem, [ animation, gotoEnd ] );
  				} else {
  					deferred.rejectWith( elem, [ animation, gotoEnd ] );
  				}
  				return this;
  			}
  		} ),
  		props = animation.props;

  	propFilter( props, animation.opts.specialEasing );

  	for ( ; index < length ; index++ ) {
  		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
  		if ( result ) {
  			if ( jQuery.isFunction( result.stop ) ) {
  				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
  					jQuery.proxy( result.stop, result );
  			}
  			return result;
  		}
  	}

  	jQuery.map( props, createTween, animation );

  	if ( jQuery.isFunction( animation.opts.start ) ) {
  		animation.opts.start.call( elem, animation );
  	}

  	jQuery.fx.timer(
  		jQuery.extend( tick, {
  			elem: elem,
  			anim: animation,
  			queue: animation.opts.queue
  		} )
  	);

  	// attach callbacks from options
  	return animation.progress( animation.opts.progress )
  		.done( animation.opts.done, animation.opts.complete )
  		.fail( animation.opts.fail )
  		.always( animation.opts.always );
  }

  jQuery.Animation = jQuery.extend( Animation, {
  	tweeners: {
  		"*": [ function( prop, value ) {
  			var tween = this.createTween( prop, value );
  			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
  			return tween;
  		} ]
  	},

  	tweener: function( props, callback ) {
  		if ( jQuery.isFunction( props ) ) {
  			callback = props;
  			props = [ "*" ];
  		} else {
  			props = props.match( rnotwhite );
  		}

  		var prop,
  			index = 0,
  			length = props.length;

  		for ( ; index < length ; index++ ) {
  			prop = props[ index ];
  			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
  			Animation.tweeners[ prop ].unshift( callback );
  		}
  	},

  	prefilters: [ defaultPrefilter ],

  	prefilter: function( callback, prepend ) {
  		if ( prepend ) {
  			Animation.prefilters.unshift( callback );
  		} else {
  			Animation.prefilters.push( callback );
  		}
  	}
  } );

  jQuery.speed = function( speed, easing, fn ) {
  	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
  		complete: fn || !fn && easing ||
  			jQuery.isFunction( speed ) && speed,
  		duration: speed,
  		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
  	};

  	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
  		opt.duration : opt.duration in jQuery.fx.speeds ?
  			jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

  	// Normalize opt.queue - true/undefined/null -> "fx"
  	if ( opt.queue == null || opt.queue === true ) {
  		opt.queue = "fx";
  	}

  	// Queueing
  	opt.old = opt.complete;

  	opt.complete = function() {
  		if ( jQuery.isFunction( opt.old ) ) {
  			opt.old.call( this );
  		}

  		if ( opt.queue ) {
  			jQuery.dequeue( this, opt.queue );
  		}
  	};

  	return opt;
  };

  jQuery.fn.extend( {
  	fadeTo: function( speed, to, easing, callback ) {

  		// Show any hidden elements after setting opacity to 0
  		return this.filter( isHidden ).css( "opacity", 0 ).show()

  			// Animate to the value specified
  			.end().animate( { opacity: to }, speed, easing, callback );
  	},
  	animate: function( prop, speed, easing, callback ) {
  		var empty = jQuery.isEmptyObject( prop ),
  			optall = jQuery.speed( speed, easing, callback ),
  			doAnimation = function() {

  				// Operate on a copy of prop so per-property easing won't be lost
  				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

  				// Empty animations, or finishing resolves immediately
  				if ( empty || dataPriv.get( this, "finish" ) ) {
  					anim.stop( true );
  				}
  			};
  			doAnimation.finish = doAnimation;

  		return empty || optall.queue === false ?
  			this.each( doAnimation ) :
  			this.queue( optall.queue, doAnimation );
  	},
  	stop: function( type, clearQueue, gotoEnd ) {
  		var stopQueue = function( hooks ) {
  			var stop = hooks.stop;
  			delete hooks.stop;
  			stop( gotoEnd );
  		};

  		if ( typeof type !== "string" ) {
  			gotoEnd = clearQueue;
  			clearQueue = type;
  			type = undefined;
  		}
  		if ( clearQueue && type !== false ) {
  			this.queue( type || "fx", [] );
  		}

  		return this.each( function() {
  			var dequeue = true,
  				index = type != null && type + "queueHooks",
  				timers = jQuery.timers,
  				data = dataPriv.get( this );

  			if ( index ) {
  				if ( data[ index ] && data[ index ].stop ) {
  					stopQueue( data[ index ] );
  				}
  			} else {
  				for ( index in data ) {
  					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
  						stopQueue( data[ index ] );
  					}
  				}
  			}

  			for ( index = timers.length; index--; ) {
  				if ( timers[ index ].elem === this &&
  					( type == null || timers[ index ].queue === type ) ) {

  					timers[ index ].anim.stop( gotoEnd );
  					dequeue = false;
  					timers.splice( index, 1 );
  				}
  			}

  			// Start the next in the queue if the last step wasn't forced.
  			// Timers currently will call their complete callbacks, which
  			// will dequeue but only if they were gotoEnd.
  			if ( dequeue || !gotoEnd ) {
  				jQuery.dequeue( this, type );
  			}
  		} );
  	},
  	finish: function( type ) {
  		if ( type !== false ) {
  			type = type || "fx";
  		}
  		return this.each( function() {
  			var index,
  				data = dataPriv.get( this ),
  				queue = data[ type + "queue" ],
  				hooks = data[ type + "queueHooks" ],
  				timers = jQuery.timers,
  				length = queue ? queue.length : 0;

  			// Enable finishing flag on private data
  			data.finish = true;

  			// Empty the queue first
  			jQuery.queue( this, type, [] );

  			if ( hooks && hooks.stop ) {
  				hooks.stop.call( this, true );
  			}

  			// Look for any active animations, and finish them
  			for ( index = timers.length; index--; ) {
  				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
  					timers[ index ].anim.stop( true );
  					timers.splice( index, 1 );
  				}
  			}

  			// Look for any animations in the old queue and finish them
  			for ( index = 0; index < length; index++ ) {
  				if ( queue[ index ] && queue[ index ].finish ) {
  					queue[ index ].finish.call( this );
  				}
  			}

  			// Turn off finishing flag
  			delete data.finish;
  		} );
  	}
  } );

  jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
  	var cssFn = jQuery.fn[ name ];
  	jQuery.fn[ name ] = function( speed, easing, callback ) {
  		return speed == null || typeof speed === "boolean" ?
  			cssFn.apply( this, arguments ) :
  			this.animate( genFx( name, true ), speed, easing, callback );
  	};
  } );

  // Generate shortcuts for custom animations
  jQuery.each( {
  	slideDown: genFx( "show" ),
  	slideUp: genFx( "hide" ),
  	slideToggle: genFx( "toggle" ),
  	fadeIn: { opacity: "show" },
  	fadeOut: { opacity: "hide" },
  	fadeToggle: { opacity: "toggle" }
  }, function( name, props ) {
  	jQuery.fn[ name ] = function( speed, easing, callback ) {
  		return this.animate( props, speed, easing, callback );
  	};
  } );

  jQuery.timers = [];
  jQuery.fx.tick = function() {
  	var timer,
  		i = 0,
  		timers = jQuery.timers;

  	fxNow = jQuery.now();

  	for ( ; i < timers.length; i++ ) {
  		timer = timers[ i ];

  		// Checks the timer has not already been removed
  		if ( !timer() && timers[ i ] === timer ) {
  			timers.splice( i--, 1 );
  		}
  	}

  	if ( !timers.length ) {
  		jQuery.fx.stop();
  	}
  	fxNow = undefined;
  };

  jQuery.fx.timer = function( timer ) {
  	jQuery.timers.push( timer );
  	if ( timer() ) {
  		jQuery.fx.start();
  	} else {
  		jQuery.timers.pop();
  	}
  };

  jQuery.fx.interval = 13;
  jQuery.fx.start = function() {
  	if ( !timerId ) {
  		timerId = window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
  	}
  };

  jQuery.fx.stop = function() {
  	window.clearInterval( timerId );

  	timerId = null;
  };

  jQuery.fx.speeds = {
  	slow: 600,
  	fast: 200,

  	// Default speed
  	_default: 400
  };


  // Based off of the plugin by Clint Helfers, with permission.
  // http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
  jQuery.fn.delay = function( time, type ) {
  	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
  	type = type || "fx";

  	return this.queue( type, function( next, hooks ) {
  		var timeout = window.setTimeout( next, time );
  		hooks.stop = function() {
  			window.clearTimeout( timeout );
  		};
  	} );
  };


  ( function() {
  	var input = document.createElement( "input" ),
  		select = document.createElement( "select" ),
  		opt = select.appendChild( document.createElement( "option" ) );

  	input.type = "checkbox";

  	// Support: iOS<=5.1, Android<=4.2+
  	// Default value for a checkbox should be "on"
  	support.checkOn = input.value !== "";

  	// Support: IE<=11+
  	// Must access selectedIndex to make default options select
  	support.optSelected = opt.selected;

  	// Support: Android<=2.3
  	// Options inside disabled selects are incorrectly marked as disabled
  	select.disabled = true;
  	support.optDisabled = !opt.disabled;

  	// Support: IE<=11+
  	// An input loses its value after becoming a radio
  	input = document.createElement( "input" );
  	input.value = "t";
  	input.type = "radio";
  	support.radioValue = input.value === "t";
  } )();


  var boolHook,
  	attrHandle = jQuery.expr.attrHandle;

  jQuery.fn.extend( {
  	attr: function( name, value ) {
  		return access( this, jQuery.attr, name, value, arguments.length > 1 );
  	},

  	removeAttr: function( name ) {
  		return this.each( function() {
  			jQuery.removeAttr( this, name );
  		} );
  	}
  } );

  jQuery.extend( {
  	attr: function( elem, name, value ) {
  		var ret, hooks,
  			nType = elem.nodeType;

  		// Don't get/set attributes on text, comment and attribute nodes
  		if ( nType === 3 || nType === 8 || nType === 2 ) {
  			return;
  		}

  		// Fallback to prop when attributes are not supported
  		if ( typeof elem.getAttribute === "undefined" ) {
  			return jQuery.prop( elem, name, value );
  		}

  		// All attributes are lowercase
  		// Grab necessary hook if one is defined
  		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
  			name = name.toLowerCase();
  			hooks = jQuery.attrHooks[ name ] ||
  				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
  		}

  		if ( value !== undefined ) {
  			if ( value === null ) {
  				jQuery.removeAttr( elem, name );
  				return;
  			}

  			if ( hooks && "set" in hooks &&
  				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
  				return ret;
  			}

  			elem.setAttribute( name, value + "" );
  			return value;
  		}

  		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
  			return ret;
  		}

  		ret = jQuery.find.attr( elem, name );

  		// Non-existent attributes return null, we normalize to undefined
  		return ret == null ? undefined : ret;
  	},

  	attrHooks: {
  		type: {
  			set: function( elem, value ) {
  				if ( !support.radioValue && value === "radio" &&
  					jQuery.nodeName( elem, "input" ) ) {
  					var val = elem.value;
  					elem.setAttribute( "type", value );
  					if ( val ) {
  						elem.value = val;
  					}
  					return value;
  				}
  			}
  		}
  	},

  	removeAttr: function( elem, value ) {
  		var name, propName,
  			i = 0,
  			attrNames = value && value.match( rnotwhite );

  		if ( attrNames && elem.nodeType === 1 ) {
  			while ( ( name = attrNames[ i++ ] ) ) {
  				propName = jQuery.propFix[ name ] || name;

  				// Boolean attributes get special treatment (#10870)
  				if ( jQuery.expr.match.bool.test( name ) ) {

  					// Set corresponding property to false
  					elem[ propName ] = false;
  				}

  				elem.removeAttribute( name );
  			}
  		}
  	}
  } );

  // Hooks for boolean attributes
  boolHook = {
  	set: function( elem, value, name ) {
  		if ( value === false ) {

  			// Remove boolean attributes when set to false
  			jQuery.removeAttr( elem, name );
  		} else {
  			elem.setAttribute( name, name );
  		}
  		return name;
  	}
  };
  jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
  	var getter = attrHandle[ name ] || jQuery.find.attr;

  	attrHandle[ name ] = function( elem, name, isXML ) {
  		var ret, handle;
  		if ( !isXML ) {

  			// Avoid an infinite loop by temporarily removing this function from the getter
  			handle = attrHandle[ name ];
  			attrHandle[ name ] = ret;
  			ret = getter( elem, name, isXML ) != null ?
  				name.toLowerCase() :
  				null;
  			attrHandle[ name ] = handle;
  		}
  		return ret;
  	};
  } );




  var rfocusable = /^(?:input|select|textarea|button)$/i,
  	rclickable = /^(?:a|area)$/i;

  jQuery.fn.extend( {
  	prop: function( name, value ) {
  		return access( this, jQuery.prop, name, value, arguments.length > 1 );
  	},

  	removeProp: function( name ) {
  		return this.each( function() {
  			delete this[ jQuery.propFix[ name ] || name ];
  		} );
  	}
  } );

  jQuery.extend( {
  	prop: function( elem, name, value ) {
  		var ret, hooks,
  			nType = elem.nodeType;

  		// Don't get/set properties on text, comment and attribute nodes
  		if ( nType === 3 || nType === 8 || nType === 2 ) {
  			return;
  		}

  		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

  			// Fix name and attach hooks
  			name = jQuery.propFix[ name ] || name;
  			hooks = jQuery.propHooks[ name ];
  		}

  		if ( value !== undefined ) {
  			if ( hooks && "set" in hooks &&
  				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
  				return ret;
  			}

  			return ( elem[ name ] = value );
  		}

  		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
  			return ret;
  		}

  		return elem[ name ];
  	},

  	propHooks: {
  		tabIndex: {
  			get: function( elem ) {

  				// elem.tabIndex doesn't always return the
  				// correct value when it hasn't been explicitly set
  				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
  				// Use proper attribute retrieval(#12072)
  				var tabindex = jQuery.find.attr( elem, "tabindex" );

  				return tabindex ?
  					parseInt( tabindex, 10 ) :
  					rfocusable.test( elem.nodeName ) ||
  						rclickable.test( elem.nodeName ) && elem.href ?
  							0 :
  							-1;
  			}
  		}
  	},

  	propFix: {
  		"for": "htmlFor",
  		"class": "className"
  	}
  } );

  // Support: IE <=11 only
  // Accessing the selectedIndex property
  // forces the browser to respect setting selected
  // on the option
  // The getter ensures a default option is selected
  // when in an optgroup
  if ( !support.optSelected ) {
  	jQuery.propHooks.selected = {
  		get: function( elem ) {
  			var parent = elem.parentNode;
  			if ( parent && parent.parentNode ) {
  				parent.parentNode.selectedIndex;
  			}
  			return null;
  		},
  		set: function( elem ) {
  			var parent = elem.parentNode;
  			if ( parent ) {
  				parent.selectedIndex;

  				if ( parent.parentNode ) {
  					parent.parentNode.selectedIndex;
  				}
  			}
  		}
  	};
  }

  jQuery.each( [
  	"tabIndex",
  	"readOnly",
  	"maxLength",
  	"cellSpacing",
  	"cellPadding",
  	"rowSpan",
  	"colSpan",
  	"useMap",
  	"frameBorder",
  	"contentEditable"
  ], function() {
  	jQuery.propFix[ this.toLowerCase() ] = this;
  } );




  var rclass = /[\t\r\n\f]/g;

  function getClass( elem ) {
  	return elem.getAttribute && elem.getAttribute( "class" ) || "";
  }

  jQuery.fn.extend( {
  	addClass: function( value ) {
  		var classes, elem, cur, curValue, clazz, j, finalValue,
  			i = 0;

  		if ( jQuery.isFunction( value ) ) {
  			return this.each( function( j ) {
  				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
  			} );
  		}

  		if ( typeof value === "string" && value ) {
  			classes = value.match( rnotwhite ) || [];

  			while ( ( elem = this[ i++ ] ) ) {
  				curValue = getClass( elem );
  				cur = elem.nodeType === 1 &&
  					( " " + curValue + " " ).replace( rclass, " " );

  				if ( cur ) {
  					j = 0;
  					while ( ( clazz = classes[ j++ ] ) ) {
  						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
  							cur += clazz + " ";
  						}
  					}

  					// Only assign if different to avoid unneeded rendering.
  					finalValue = jQuery.trim( cur );
  					if ( curValue !== finalValue ) {
  						elem.setAttribute( "class", finalValue );
  					}
  				}
  			}
  		}

  		return this;
  	},

  	removeClass: function( value ) {
  		var classes, elem, cur, curValue, clazz, j, finalValue,
  			i = 0;

  		if ( jQuery.isFunction( value ) ) {
  			return this.each( function( j ) {
  				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
  			} );
  		}

  		if ( !arguments.length ) {
  			return this.attr( "class", "" );
  		}

  		if ( typeof value === "string" && value ) {
  			classes = value.match( rnotwhite ) || [];

  			while ( ( elem = this[ i++ ] ) ) {
  				curValue = getClass( elem );

  				// This expression is here for better compressibility (see addClass)
  				cur = elem.nodeType === 1 &&
  					( " " + curValue + " " ).replace( rclass, " " );

  				if ( cur ) {
  					j = 0;
  					while ( ( clazz = classes[ j++ ] ) ) {

  						// Remove *all* instances
  						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
  							cur = cur.replace( " " + clazz + " ", " " );
  						}
  					}

  					// Only assign if different to avoid unneeded rendering.
  					finalValue = jQuery.trim( cur );
  					if ( curValue !== finalValue ) {
  						elem.setAttribute( "class", finalValue );
  					}
  				}
  			}
  		}

  		return this;
  	},

  	toggleClass: function( value, stateVal ) {
  		var type = typeof value;

  		if ( typeof stateVal === "boolean" && type === "string" ) {
  			return stateVal ? this.addClass( value ) : this.removeClass( value );
  		}

  		if ( jQuery.isFunction( value ) ) {
  			return this.each( function( i ) {
  				jQuery( this ).toggleClass(
  					value.call( this, i, getClass( this ), stateVal ),
  					stateVal
  				);
  			} );
  		}

  		return this.each( function() {
  			var className, i, self, classNames;

  			if ( type === "string" ) {

  				// Toggle individual class names
  				i = 0;
  				self = jQuery( this );
  				classNames = value.match( rnotwhite ) || [];

  				while ( ( className = classNames[ i++ ] ) ) {

  					// Check each className given, space separated list
  					if ( self.hasClass( className ) ) {
  						self.removeClass( className );
  					} else {
  						self.addClass( className );
  					}
  				}

  			// Toggle whole class name
  			} else if ( value === undefined || type === "boolean" ) {
  				className = getClass( this );
  				if ( className ) {

  					// Store className if set
  					dataPriv.set( this, "__className__", className );
  				}

  				// If the element has a class name or if we're passed `false`,
  				// then remove the whole classname (if there was one, the above saved it).
  				// Otherwise bring back whatever was previously saved (if anything),
  				// falling back to the empty string if nothing was stored.
  				if ( this.setAttribute ) {
  					this.setAttribute( "class",
  						className || value === false ?
  						"" :
  						dataPriv.get( this, "__className__" ) || ""
  					);
  				}
  			}
  		} );
  	},

  	hasClass: function( selector ) {
  		var className, elem,
  			i = 0;

  		className = " " + selector + " ";
  		while ( ( elem = this[ i++ ] ) ) {
  			if ( elem.nodeType === 1 &&
  				( " " + getClass( elem ) + " " ).replace( rclass, " " )
  					.indexOf( className ) > -1
  			) {
  				return true;
  			}
  		}

  		return false;
  	}
  } );




  var rreturn = /\r/g,
  	rspaces = /[\x20\t\r\n\f]+/g;

  jQuery.fn.extend( {
  	val: function( value ) {
  		var hooks, ret, isFunction,
  			elem = this[ 0 ];

  		if ( !arguments.length ) {
  			if ( elem ) {
  				hooks = jQuery.valHooks[ elem.type ] ||
  					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

  				if ( hooks &&
  					"get" in hooks &&
  					( ret = hooks.get( elem, "value" ) ) !== undefined
  				) {
  					return ret;
  				}

  				ret = elem.value;

  				return typeof ret === "string" ?

  					// Handle most common string cases
  					ret.replace( rreturn, "" ) :

  					// Handle cases where value is null/undef or number
  					ret == null ? "" : ret;
  			}

  			return;
  		}

  		isFunction = jQuery.isFunction( value );

  		return this.each( function( i ) {
  			var val;

  			if ( this.nodeType !== 1 ) {
  				return;
  			}

  			if ( isFunction ) {
  				val = value.call( this, i, jQuery( this ).val() );
  			} else {
  				val = value;
  			}

  			// Treat null/undefined as ""; convert numbers to string
  			if ( val == null ) {
  				val = "";

  			} else if ( typeof val === "number" ) {
  				val += "";

  			} else if ( jQuery.isArray( val ) ) {
  				val = jQuery.map( val, function( value ) {
  					return value == null ? "" : value + "";
  				} );
  			}

  			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

  			// If set returns undefined, fall back to normal setting
  			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
  				this.value = val;
  			}
  		} );
  	}
  } );

  jQuery.extend( {
  	valHooks: {
  		option: {
  			get: function( elem ) {

  				var val = jQuery.find.attr( elem, "value" );
  				return val != null ?
  					val :

  					// Support: IE10-11+
  					// option.text throws exceptions (#14686, #14858)
  					// Strip and collapse whitespace
  					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
  					jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
  			}
  		},
  		select: {
  			get: function( elem ) {
  				var value, option,
  					options = elem.options,
  					index = elem.selectedIndex,
  					one = elem.type === "select-one" || index < 0,
  					values = one ? null : [],
  					max = one ? index + 1 : options.length,
  					i = index < 0 ?
  						max :
  						one ? index : 0;

  				// Loop through all the selected options
  				for ( ; i < max; i++ ) {
  					option = options[ i ];

  					// IE8-9 doesn't update selected after form reset (#2551)
  					if ( ( option.selected || i === index ) &&

  							// Don't return options that are disabled or in a disabled optgroup
  							( support.optDisabled ?
  								!option.disabled : option.getAttribute( "disabled" ) === null ) &&
  							( !option.parentNode.disabled ||
  								!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

  						// Get the specific value for the option
  						value = jQuery( option ).val();

  						// We don't need an array for one selects
  						if ( one ) {
  							return value;
  						}

  						// Multi-Selects return an array
  						values.push( value );
  					}
  				}

  				return values;
  			},

  			set: function( elem, value ) {
  				var optionSet, option,
  					options = elem.options,
  					values = jQuery.makeArray( value ),
  					i = options.length;

  				while ( i-- ) {
  					option = options[ i ];
  					if ( option.selected =
  						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
  					) {
  						optionSet = true;
  					}
  				}

  				// Force browsers to behave consistently when non-matching value is set
  				if ( !optionSet ) {
  					elem.selectedIndex = -1;
  				}
  				return values;
  			}
  		}
  	}
  } );

  // Radios and checkboxes getter/setter
  jQuery.each( [ "radio", "checkbox" ], function() {
  	jQuery.valHooks[ this ] = {
  		set: function( elem, value ) {
  			if ( jQuery.isArray( value ) ) {
  				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
  			}
  		}
  	};
  	if ( !support.checkOn ) {
  		jQuery.valHooks[ this ].get = function( elem ) {
  			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
  		};
  	}
  } );




  // Return jQuery for attributes-only inclusion


  var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

  jQuery.extend( jQuery.event, {

  	trigger: function( event, data, elem, onlyHandlers ) {

  		var i, cur, tmp, bubbleType, ontype, handle, special,
  			eventPath = [ elem || document ],
  			type = hasOwn.call( event, "type" ) ? event.type : event,
  			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

  		cur = tmp = elem = elem || document;

  		// Don't do events on text and comment nodes
  		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
  			return;
  		}

  		// focus/blur morphs to focusin/out; ensure we're not firing them right now
  		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
  			return;
  		}

  		if ( type.indexOf( "." ) > -1 ) {

  			// Namespaced trigger; create a regexp to match event type in handle()
  			namespaces = type.split( "." );
  			type = namespaces.shift();
  			namespaces.sort();
  		}
  		ontype = type.indexOf( ":" ) < 0 && "on" + type;

  		// Caller can pass in a jQuery.Event object, Object, or just an event type string
  		event = event[ jQuery.expando ] ?
  			event :
  			new jQuery.Event( type, typeof event === "object" && event );

  		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
  		event.isTrigger = onlyHandlers ? 2 : 3;
  		event.namespace = namespaces.join( "." );
  		event.rnamespace = event.namespace ?
  			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
  			null;

  		// Clean up the event in case it is being reused
  		event.result = undefined;
  		if ( !event.target ) {
  			event.target = elem;
  		}

  		// Clone any incoming data and prepend the event, creating the handler arg list
  		data = data == null ?
  			[ event ] :
  			jQuery.makeArray( data, [ event ] );

  		// Allow special events to draw outside the lines
  		special = jQuery.event.special[ type ] || {};
  		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
  			return;
  		}

  		// Determine event propagation path in advance, per W3C events spec (#9951)
  		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
  		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

  			bubbleType = special.delegateType || type;
  			if ( !rfocusMorph.test( bubbleType + type ) ) {
  				cur = cur.parentNode;
  			}
  			for ( ; cur; cur = cur.parentNode ) {
  				eventPath.push( cur );
  				tmp = cur;
  			}

  			// Only add window if we got to document (e.g., not plain obj or detached DOM)
  			if ( tmp === ( elem.ownerDocument || document ) ) {
  				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
  			}
  		}

  		// Fire handlers on the event path
  		i = 0;
  		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

  			event.type = i > 1 ?
  				bubbleType :
  				special.bindType || type;

  			// jQuery handler
  			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
  				dataPriv.get( cur, "handle" );
  			if ( handle ) {
  				handle.apply( cur, data );
  			}

  			// Native handler
  			handle = ontype && cur[ ontype ];
  			if ( handle && handle.apply && acceptData( cur ) ) {
  				event.result = handle.apply( cur, data );
  				if ( event.result === false ) {
  					event.preventDefault();
  				}
  			}
  		}
  		event.type = type;

  		// If nobody prevented the default action, do it now
  		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

  			if ( ( !special._default ||
  				special._default.apply( eventPath.pop(), data ) === false ) &&
  				acceptData( elem ) ) {

  				// Call a native DOM method on the target with the same name name as the event.
  				// Don't do default actions on window, that's where global variables be (#6170)
  				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

  					// Don't re-trigger an onFOO event when we call its FOO() method
  					tmp = elem[ ontype ];

  					if ( tmp ) {
  						elem[ ontype ] = null;
  					}

  					// Prevent re-triggering of the same event, since we already bubbled it above
  					jQuery.event.triggered = type;
  					elem[ type ]();
  					jQuery.event.triggered = undefined;

  					if ( tmp ) {
  						elem[ ontype ] = tmp;
  					}
  				}
  			}
  		}

  		return event.result;
  	},

  	// Piggyback on a donor event to simulate a different one
  	// Used only for `focus(in | out)` events
  	simulate: function( type, elem, event ) {
  		var e = jQuery.extend(
  			new jQuery.Event(),
  			event,
  			{
  				type: type,
  				isSimulated: true
  			}
  		);

  		jQuery.event.trigger( e, null, elem );
  	}

  } );

  jQuery.fn.extend( {

  	trigger: function( type, data ) {
  		return this.each( function() {
  			jQuery.event.trigger( type, data, this );
  		} );
  	},
  	triggerHandler: function( type, data ) {
  		var elem = this[ 0 ];
  		if ( elem ) {
  			return jQuery.event.trigger( type, data, elem, true );
  		}
  	}
  } );


  jQuery.each( ( "blur focus focusin focusout load resize scroll unload click dblclick " +
  	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
  	"change select submit keydown keypress keyup error contextmenu" ).split( " " ),
  	function( i, name ) {

  	// Handle event binding
  	jQuery.fn[ name ] = function( data, fn ) {
  		return arguments.length > 0 ?
  			this.on( name, null, data, fn ) :
  			this.trigger( name );
  	};
  } );

  jQuery.fn.extend( {
  	hover: function( fnOver, fnOut ) {
  		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
  	}
  } );




  support.focusin = "onfocusin" in window;


  // Support: Firefox
  // Firefox doesn't have focus(in | out) events
  // Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
  //
  // Support: Chrome, Safari
  // focus(in | out) events fire after focus & blur events,
  // which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
  // Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
  if ( !support.focusin ) {
  	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

  		// Attach a single capturing handler on the document while someone wants focusin/focusout
  		var handler = function( event ) {
  			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
  		};

  		jQuery.event.special[ fix ] = {
  			setup: function() {
  				var doc = this.ownerDocument || this,
  					attaches = dataPriv.access( doc, fix );

  				if ( !attaches ) {
  					doc.addEventListener( orig, handler, true );
  				}
  				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
  			},
  			teardown: function() {
  				var doc = this.ownerDocument || this,
  					attaches = dataPriv.access( doc, fix ) - 1;

  				if ( !attaches ) {
  					doc.removeEventListener( orig, handler, true );
  					dataPriv.remove( doc, fix );

  				} else {
  					dataPriv.access( doc, fix, attaches );
  				}
  			}
  		};
  	} );
  }
  var location = window.location;

  var nonce = jQuery.now();

  var rquery = ( /\?/ );



  // Support: Android 2.3
  // Workaround failure to string-cast null input
  jQuery.parseJSON = function( data ) {
  	return JSON.parse( data + "" );
  };


  // Cross-browser xml parsing
  jQuery.parseXML = function( data ) {
  	var xml;
  	if ( !data || typeof data !== "string" ) {
  		return null;
  	}

  	// Support: IE9
  	try {
  		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
  	} catch ( e ) {
  		xml = undefined;
  	}

  	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
  		jQuery.error( "Invalid XML: " + data );
  	}
  	return xml;
  };


  var
  	rhash = /#.*$/,
  	rts = /([?&])_=[^&]*/,
  	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

  	// #7653, #8125, #8152: local protocol detection
  	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
  	rnoContent = /^(?:GET|HEAD)$/,
  	rprotocol = /^\/\//,

  	/* Prefilters
  	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
  	 * 2) These are called:
  	 *    - BEFORE asking for a transport
  	 *    - AFTER param serialization (s.data is a string if s.processData is true)
  	 * 3) key is the dataType
  	 * 4) the catchall symbol "*" can be used
  	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
  	 */
  	prefilters = {},

  	/* Transports bindings
  	 * 1) key is the dataType
  	 * 2) the catchall symbol "*" can be used
  	 * 3) selection will start with transport dataType and THEN go to "*" if needed
  	 */
  	transports = {},

  	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
  	allTypes = "*/".concat( "*" ),

  	// Anchor tag for parsing the document origin
  	originAnchor = document.createElement( "a" );
  	originAnchor.href = location.href;

  // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
  function addToPrefiltersOrTransports( structure ) {

  	// dataTypeExpression is optional and defaults to "*"
  	return function( dataTypeExpression, func ) {

  		if ( typeof dataTypeExpression !== "string" ) {
  			func = dataTypeExpression;
  			dataTypeExpression = "*";
  		}

  		var dataType,
  			i = 0,
  			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

  		if ( jQuery.isFunction( func ) ) {

  			// For each dataType in the dataTypeExpression
  			while ( ( dataType = dataTypes[ i++ ] ) ) {

  				// Prepend if requested
  				if ( dataType[ 0 ] === "+" ) {
  					dataType = dataType.slice( 1 ) || "*";
  					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

  				// Otherwise append
  				} else {
  					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
  				}
  			}
  		}
  	};
  }

  // Base inspection function for prefilters and transports
  function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

  	var inspected = {},
  		seekingTransport = ( structure === transports );

  	function inspect( dataType ) {
  		var selected;
  		inspected[ dataType ] = true;
  		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
  			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
  			if ( typeof dataTypeOrTransport === "string" &&
  				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

  				options.dataTypes.unshift( dataTypeOrTransport );
  				inspect( dataTypeOrTransport );
  				return false;
  			} else if ( seekingTransport ) {
  				return !( selected = dataTypeOrTransport );
  			}
  		} );
  		return selected;
  	}

  	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
  }

  // A special extend for ajax options
  // that takes "flat" options (not to be deep extended)
  // Fixes #9887
  function ajaxExtend( target, src ) {
  	var key, deep,
  		flatOptions = jQuery.ajaxSettings.flatOptions || {};

  	for ( key in src ) {
  		if ( src[ key ] !== undefined ) {
  			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
  		}
  	}
  	if ( deep ) {
  		jQuery.extend( true, target, deep );
  	}

  	return target;
  }

  /* Handles responses to an ajax request:
   * - finds the right dataType (mediates between content-type and expected dataType)
   * - returns the corresponding response
   */
  function ajaxHandleResponses( s, jqXHR, responses ) {

  	var ct, type, finalDataType, firstDataType,
  		contents = s.contents,
  		dataTypes = s.dataTypes;

  	// Remove auto dataType and get content-type in the process
  	while ( dataTypes[ 0 ] === "*" ) {
  		dataTypes.shift();
  		if ( ct === undefined ) {
  			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
  		}
  	}

  	// Check if we're dealing with a known content-type
  	if ( ct ) {
  		for ( type in contents ) {
  			if ( contents[ type ] && contents[ type ].test( ct ) ) {
  				dataTypes.unshift( type );
  				break;
  			}
  		}
  	}

  	// Check to see if we have a response for the expected dataType
  	if ( dataTypes[ 0 ] in responses ) {
  		finalDataType = dataTypes[ 0 ];
  	} else {

  		// Try convertible dataTypes
  		for ( type in responses ) {
  			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
  				finalDataType = type;
  				break;
  			}
  			if ( !firstDataType ) {
  				firstDataType = type;
  			}
  		}

  		// Or just use first one
  		finalDataType = finalDataType || firstDataType;
  	}

  	// If we found a dataType
  	// We add the dataType to the list if needed
  	// and return the corresponding response
  	if ( finalDataType ) {
  		if ( finalDataType !== dataTypes[ 0 ] ) {
  			dataTypes.unshift( finalDataType );
  		}
  		return responses[ finalDataType ];
  	}
  }

  /* Chain conversions given the request and the original response
   * Also sets the responseXXX fields on the jqXHR instance
   */
  function ajaxConvert( s, response, jqXHR, isSuccess ) {
  	var conv2, current, conv, tmp, prev,
  		converters = {},

  		// Work with a copy of dataTypes in case we need to modify it for conversion
  		dataTypes = s.dataTypes.slice();

  	// Create converters map with lowercased keys
  	if ( dataTypes[ 1 ] ) {
  		for ( conv in s.converters ) {
  			converters[ conv.toLowerCase() ] = s.converters[ conv ];
  		}
  	}

  	current = dataTypes.shift();

  	// Convert to each sequential dataType
  	while ( current ) {

  		if ( s.responseFields[ current ] ) {
  			jqXHR[ s.responseFields[ current ] ] = response;
  		}

  		// Apply the dataFilter if provided
  		if ( !prev && isSuccess && s.dataFilter ) {
  			response = s.dataFilter( response, s.dataType );
  		}

  		prev = current;
  		current = dataTypes.shift();

  		if ( current ) {

  		// There's only work to do if current dataType is non-auto
  			if ( current === "*" ) {

  				current = prev;

  			// Convert response if prev dataType is non-auto and differs from current
  			} else if ( prev !== "*" && prev !== current ) {

  				// Seek a direct converter
  				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

  				// If none found, seek a pair
  				if ( !conv ) {
  					for ( conv2 in converters ) {

  						// If conv2 outputs current
  						tmp = conv2.split( " " );
  						if ( tmp[ 1 ] === current ) {

  							// If prev can be converted to accepted input
  							conv = converters[ prev + " " + tmp[ 0 ] ] ||
  								converters[ "* " + tmp[ 0 ] ];
  							if ( conv ) {

  								// Condense equivalence converters
  								if ( conv === true ) {
  									conv = converters[ conv2 ];

  								// Otherwise, insert the intermediate dataType
  								} else if ( converters[ conv2 ] !== true ) {
  									current = tmp[ 0 ];
  									dataTypes.unshift( tmp[ 1 ] );
  								}
  								break;
  							}
  						}
  					}
  				}

  				// Apply converter (if not an equivalence)
  				if ( conv !== true ) {

  					// Unless errors are allowed to bubble, catch and return them
  					if ( conv && s.throws ) {
  						response = conv( response );
  					} else {
  						try {
  							response = conv( response );
  						} catch ( e ) {
  							return {
  								state: "parsererror",
  								error: conv ? e : "No conversion from " + prev + " to " + current
  							};
  						}
  					}
  				}
  			}
  		}
  	}

  	return { state: "success", data: response };
  }

  jQuery.extend( {

  	// Counter for holding the number of active queries
  	active: 0,

  	// Last-Modified header cache for next request
  	lastModified: {},
  	etag: {},

  	ajaxSettings: {
  		url: location.href,
  		type: "GET",
  		isLocal: rlocalProtocol.test( location.protocol ),
  		global: true,
  		processData: true,
  		async: true,
  		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
  		/*
  		timeout: 0,
  		data: null,
  		dataType: null,
  		username: null,
  		password: null,
  		cache: null,
  		throws: false,
  		traditional: false,
  		headers: {},
  		*/

  		accepts: {
  			"*": allTypes,
  			text: "text/plain",
  			html: "text/html",
  			xml: "application/xml, text/xml",
  			json: "application/json, text/javascript"
  		},

  		contents: {
  			xml: /\bxml\b/,
  			html: /\bhtml/,
  			json: /\bjson\b/
  		},

  		responseFields: {
  			xml: "responseXML",
  			text: "responseText",
  			json: "responseJSON"
  		},

  		// Data converters
  		// Keys separate source (or catchall "*") and destination types with a single space
  		converters: {

  			// Convert anything to text
  			"* text": String,

  			// Text to html (true = no transformation)
  			"text html": true,

  			// Evaluate text as a json expression
  			"text json": jQuery.parseJSON,

  			// Parse text as xml
  			"text xml": jQuery.parseXML
  		},

  		// For options that shouldn't be deep extended:
  		// you can add your own custom options here if
  		// and when you create one that shouldn't be
  		// deep extended (see ajaxExtend)
  		flatOptions: {
  			url: true,
  			context: true
  		}
  	},

  	// Creates a full fledged settings object into target
  	// with both ajaxSettings and settings fields.
  	// If target is omitted, writes into ajaxSettings.
  	ajaxSetup: function( target, settings ) {
  		return settings ?

  			// Building a settings object
  			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

  			// Extending ajaxSettings
  			ajaxExtend( jQuery.ajaxSettings, target );
  	},

  	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
  	ajaxTransport: addToPrefiltersOrTransports( transports ),

  	// Main method
  	ajax: function( url, options ) {

  		// If url is an object, simulate pre-1.5 signature
  		if ( typeof url === "object" ) {
  			options = url;
  			url = undefined;
  		}

  		// Force options to be an object
  		options = options || {};

  		var transport,

  			// URL without anti-cache param
  			cacheURL,

  			// Response headers
  			responseHeadersString,
  			responseHeaders,

  			// timeout handle
  			timeoutTimer,

  			// Url cleanup var
  			urlAnchor,

  			// To know if global events are to be dispatched
  			fireGlobals,

  			// Loop variable
  			i,

  			// Create the final options object
  			s = jQuery.ajaxSetup( {}, options ),

  			// Callbacks context
  			callbackContext = s.context || s,

  			// Context for global events is callbackContext if it is a DOM node or jQuery collection
  			globalEventContext = s.context &&
  				( callbackContext.nodeType || callbackContext.jquery ) ?
  					jQuery( callbackContext ) :
  					jQuery.event,

  			// Deferreds
  			deferred = jQuery.Deferred(),
  			completeDeferred = jQuery.Callbacks( "once memory" ),

  			// Status-dependent callbacks
  			statusCode = s.statusCode || {},

  			// Headers (they are sent all at once)
  			requestHeaders = {},
  			requestHeadersNames = {},

  			// The jqXHR state
  			state = 0,

  			// Default abort message
  			strAbort = "canceled",

  			// Fake xhr
  			jqXHR = {
  				readyState: 0,

  				// Builds headers hashtable if needed
  				getResponseHeader: function( key ) {
  					var match;
  					if ( state === 2 ) {
  						if ( !responseHeaders ) {
  							responseHeaders = {};
  							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
  								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
  							}
  						}
  						match = responseHeaders[ key.toLowerCase() ];
  					}
  					return match == null ? null : match;
  				},

  				// Raw string
  				getAllResponseHeaders: function() {
  					return state === 2 ? responseHeadersString : null;
  				},

  				// Caches the header
  				setRequestHeader: function( name, value ) {
  					var lname = name.toLowerCase();
  					if ( !state ) {
  						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
  						requestHeaders[ name ] = value;
  					}
  					return this;
  				},

  				// Overrides response content-type header
  				overrideMimeType: function( type ) {
  					if ( !state ) {
  						s.mimeType = type;
  					}
  					return this;
  				},

  				// Status-dependent callbacks
  				statusCode: function( map ) {
  					var code;
  					if ( map ) {
  						if ( state < 2 ) {
  							for ( code in map ) {

  								// Lazy-add the new callback in a way that preserves old ones
  								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
  							}
  						} else {

  							// Execute the appropriate callbacks
  							jqXHR.always( map[ jqXHR.status ] );
  						}
  					}
  					return this;
  				},

  				// Cancel the request
  				abort: function( statusText ) {
  					var finalText = statusText || strAbort;
  					if ( transport ) {
  						transport.abort( finalText );
  					}
  					done( 0, finalText );
  					return this;
  				}
  			};

  		// Attach deferreds
  		deferred.promise( jqXHR ).complete = completeDeferred.add;
  		jqXHR.success = jqXHR.done;
  		jqXHR.error = jqXHR.fail;

  		// Remove hash character (#7531: and string promotion)
  		// Add protocol if not provided (prefilters might expect it)
  		// Handle falsy url in the settings object (#10093: consistency with old signature)
  		// We also use the url parameter if available
  		s.url = ( ( url || s.url || location.href ) + "" ).replace( rhash, "" )
  			.replace( rprotocol, location.protocol + "//" );

  		// Alias method option to type as per ticket #12004
  		s.type = options.method || options.type || s.method || s.type;

  		// Extract dataTypes list
  		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

  		// A cross-domain request is in order when the origin doesn't match the current origin.
  		if ( s.crossDomain == null ) {
  			urlAnchor = document.createElement( "a" );

  			// Support: IE8-11+
  			// IE throws exception if url is malformed, e.g. http://example.com:80x/
  			try {
  				urlAnchor.href = s.url;

  				// Support: IE8-11+
  				// Anchor's host property isn't correctly set when s.url is relative
  				urlAnchor.href = urlAnchor.href;
  				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
  					urlAnchor.protocol + "//" + urlAnchor.host;
  			} catch ( e ) {

  				// If there is an error parsing the URL, assume it is crossDomain,
  				// it can be rejected by the transport if it is invalid
  				s.crossDomain = true;
  			}
  		}

  		// Convert data if not already a string
  		if ( s.data && s.processData && typeof s.data !== "string" ) {
  			s.data = jQuery.param( s.data, s.traditional );
  		}

  		// Apply prefilters
  		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

  		// If request was aborted inside a prefilter, stop there
  		if ( state === 2 ) {
  			return jqXHR;
  		}

  		// We can fire global events as of now if asked to
  		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
  		fireGlobals = jQuery.event && s.global;

  		// Watch for a new set of requests
  		if ( fireGlobals && jQuery.active++ === 0 ) {
  			jQuery.event.trigger( "ajaxStart" );
  		}

  		// Uppercase the type
  		s.type = s.type.toUpperCase();

  		// Determine if request has content
  		s.hasContent = !rnoContent.test( s.type );

  		// Save the URL in case we're toying with the If-Modified-Since
  		// and/or If-None-Match header later on
  		cacheURL = s.url;

  		// More options handling for requests with no content
  		if ( !s.hasContent ) {

  			// If data is available, append data to url
  			if ( s.data ) {
  				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

  				// #9682: remove data so that it's not used in an eventual retry
  				delete s.data;
  			}

  			// Add anti-cache in url if needed
  			if ( s.cache === false ) {
  				s.url = rts.test( cacheURL ) ?

  					// If there is already a '_' parameter, set its value
  					cacheURL.replace( rts, "$1_=" + nonce++ ) :

  					// Otherwise add one to the end
  					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
  			}
  		}

  		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
  		if ( s.ifModified ) {
  			if ( jQuery.lastModified[ cacheURL ] ) {
  				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
  			}
  			if ( jQuery.etag[ cacheURL ] ) {
  				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
  			}
  		}

  		// Set the correct header, if data is being sent
  		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
  			jqXHR.setRequestHeader( "Content-Type", s.contentType );
  		}

  		// Set the Accepts header for the server, depending on the dataType
  		jqXHR.setRequestHeader(
  			"Accept",
  			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
  				s.accepts[ s.dataTypes[ 0 ] ] +
  					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
  				s.accepts[ "*" ]
  		);

  		// Check for headers option
  		for ( i in s.headers ) {
  			jqXHR.setRequestHeader( i, s.headers[ i ] );
  		}

  		// Allow custom headers/mimetypes and early abort
  		if ( s.beforeSend &&
  			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

  			// Abort if not done already and return
  			return jqXHR.abort();
  		}

  		// Aborting is no longer a cancellation
  		strAbort = "abort";

  		// Install callbacks on deferreds
  		for ( i in { success: 1, error: 1, complete: 1 } ) {
  			jqXHR[ i ]( s[ i ] );
  		}

  		// Get transport
  		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

  		// If no transport, we auto-abort
  		if ( !transport ) {
  			done( -1, "No Transport" );
  		} else {
  			jqXHR.readyState = 1;

  			// Send global event
  			if ( fireGlobals ) {
  				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
  			}

  			// If request was aborted inside ajaxSend, stop there
  			if ( state === 2 ) {
  				return jqXHR;
  			}

  			// Timeout
  			if ( s.async && s.timeout > 0 ) {
  				timeoutTimer = window.setTimeout( function() {
  					jqXHR.abort( "timeout" );
  				}, s.timeout );
  			}

  			try {
  				state = 1;
  				transport.send( requestHeaders, done );
  			} catch ( e ) {

  				// Propagate exception as error if not done
  				if ( state < 2 ) {
  					done( -1, e );

  				// Simply rethrow otherwise
  				} else {
  					throw e;
  				}
  			}
  		}

  		// Callback for when everything is done
  		function done( status, nativeStatusText, responses, headers ) {
  			var isSuccess, success, error, response, modified,
  				statusText = nativeStatusText;

  			// Called once
  			if ( state === 2 ) {
  				return;
  			}

  			// State is "done" now
  			state = 2;

  			// Clear timeout if it exists
  			if ( timeoutTimer ) {
  				window.clearTimeout( timeoutTimer );
  			}

  			// Dereference transport for early garbage collection
  			// (no matter how long the jqXHR object will be used)
  			transport = undefined;

  			// Cache response headers
  			responseHeadersString = headers || "";

  			// Set readyState
  			jqXHR.readyState = status > 0 ? 4 : 0;

  			// Determine if successful
  			isSuccess = status >= 200 && status < 300 || status === 304;

  			// Get response data
  			if ( responses ) {
  				response = ajaxHandleResponses( s, jqXHR, responses );
  			}

  			// Convert no matter what (that way responseXXX fields are always set)
  			response = ajaxConvert( s, response, jqXHR, isSuccess );

  			// If successful, handle type chaining
  			if ( isSuccess ) {

  				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
  				if ( s.ifModified ) {
  					modified = jqXHR.getResponseHeader( "Last-Modified" );
  					if ( modified ) {
  						jQuery.lastModified[ cacheURL ] = modified;
  					}
  					modified = jqXHR.getResponseHeader( "etag" );
  					if ( modified ) {
  						jQuery.etag[ cacheURL ] = modified;
  					}
  				}

  				// if no content
  				if ( status === 204 || s.type === "HEAD" ) {
  					statusText = "nocontent";

  				// if not modified
  				} else if ( status === 304 ) {
  					statusText = "notmodified";

  				// If we have data, let's convert it
  				} else {
  					statusText = response.state;
  					success = response.data;
  					error = response.error;
  					isSuccess = !error;
  				}
  			} else {

  				// Extract error from statusText and normalize for non-aborts
  				error = statusText;
  				if ( status || !statusText ) {
  					statusText = "error";
  					if ( status < 0 ) {
  						status = 0;
  					}
  				}
  			}

  			// Set data for the fake xhr object
  			jqXHR.status = status;
  			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

  			// Success/Error
  			if ( isSuccess ) {
  				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
  			} else {
  				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
  			}

  			// Status-dependent callbacks
  			jqXHR.statusCode( statusCode );
  			statusCode = undefined;

  			if ( fireGlobals ) {
  				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
  					[ jqXHR, s, isSuccess ? success : error ] );
  			}

  			// Complete
  			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

  			if ( fireGlobals ) {
  				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

  				// Handle the global AJAX counter
  				if ( !( --jQuery.active ) ) {
  					jQuery.event.trigger( "ajaxStop" );
  				}
  			}
  		}

  		return jqXHR;
  	},

  	getJSON: function( url, data, callback ) {
  		return jQuery.get( url, data, callback, "json" );
  	},

  	getScript: function( url, callback ) {
  		return jQuery.get( url, undefined, callback, "script" );
  	}
  } );

  jQuery.each( [ "get", "post" ], function( i, method ) {
  	jQuery[ method ] = function( url, data, callback, type ) {

  		// Shift arguments if data argument was omitted
  		if ( jQuery.isFunction( data ) ) {
  			type = type || callback;
  			callback = data;
  			data = undefined;
  		}

  		// The url can be an options object (which then must have .url)
  		return jQuery.ajax( jQuery.extend( {
  			url: url,
  			type: method,
  			dataType: type,
  			data: data,
  			success: callback
  		}, jQuery.isPlainObject( url ) && url ) );
  	};
  } );


  jQuery._evalUrl = function( url ) {
  	return jQuery.ajax( {
  		url: url,

  		// Make this explicit, since user can override this through ajaxSetup (#11264)
  		type: "GET",
  		dataType: "script",
  		async: false,
  		global: false,
  		"throws": true
  	} );
  };


  jQuery.fn.extend( {
  	wrapAll: function( html ) {
  		var wrap;

  		if ( jQuery.isFunction( html ) ) {
  			return this.each( function( i ) {
  				jQuery( this ).wrapAll( html.call( this, i ) );
  			} );
  		}

  		if ( this[ 0 ] ) {

  			// The elements to wrap the target around
  			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

  			if ( this[ 0 ].parentNode ) {
  				wrap.insertBefore( this[ 0 ] );
  			}

  			wrap.map( function() {
  				var elem = this;

  				while ( elem.firstElementChild ) {
  					elem = elem.firstElementChild;
  				}

  				return elem;
  			} ).append( this );
  		}

  		return this;
  	},

  	wrapInner: function( html ) {
  		if ( jQuery.isFunction( html ) ) {
  			return this.each( function( i ) {
  				jQuery( this ).wrapInner( html.call( this, i ) );
  			} );
  		}

  		return this.each( function() {
  			var self = jQuery( this ),
  				contents = self.contents();

  			if ( contents.length ) {
  				contents.wrapAll( html );

  			} else {
  				self.append( html );
  			}
  		} );
  	},

  	wrap: function( html ) {
  		var isFunction = jQuery.isFunction( html );

  		return this.each( function( i ) {
  			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
  		} );
  	},

  	unwrap: function() {
  		return this.parent().each( function() {
  			if ( !jQuery.nodeName( this, "body" ) ) {
  				jQuery( this ).replaceWith( this.childNodes );
  			}
  		} ).end();
  	}
  } );


  jQuery.expr.filters.hidden = function( elem ) {
  	return !jQuery.expr.filters.visible( elem );
  };
  jQuery.expr.filters.visible = function( elem ) {

  	// Support: Opera <= 12.12
  	// Opera reports offsetWidths and offsetHeights less than zero on some elements
  	// Use OR instead of AND as the element is not visible if either is true
  	// See tickets #10406 and #13132
  	return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
  };




  var r20 = /%20/g,
  	rbracket = /\[\]$/,
  	rCRLF = /\r?\n/g,
  	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
  	rsubmittable = /^(?:input|select|textarea|keygen)/i;

  function buildParams( prefix, obj, traditional, add ) {
  	var name;

  	if ( jQuery.isArray( obj ) ) {

  		// Serialize array item.
  		jQuery.each( obj, function( i, v ) {
  			if ( traditional || rbracket.test( prefix ) ) {

  				// Treat each array item as a scalar.
  				add( prefix, v );

  			} else {

  				// Item is non-scalar (array or object), encode its numeric index.
  				buildParams(
  					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
  					v,
  					traditional,
  					add
  				);
  			}
  		} );

  	} else if ( !traditional && jQuery.type( obj ) === "object" ) {

  		// Serialize object item.
  		for ( name in obj ) {
  			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
  		}

  	} else {

  		// Serialize scalar item.
  		add( prefix, obj );
  	}
  }

  // Serialize an array of form elements or a set of
  // key/values into a query string
  jQuery.param = function( a, traditional ) {
  	var prefix,
  		s = [],
  		add = function( key, value ) {

  			// If value is a function, invoke it and return its value
  			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
  			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
  		};

  	// Set traditional to true for jQuery <= 1.3.2 behavior.
  	if ( traditional === undefined ) {
  		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
  	}

  	// If an array was passed in, assume that it is an array of form elements.
  	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

  		// Serialize the form elements
  		jQuery.each( a, function() {
  			add( this.name, this.value );
  		} );

  	} else {

  		// If traditional, encode the "old" way (the way 1.3.2 or older
  		// did it), otherwise encode params recursively.
  		for ( prefix in a ) {
  			buildParams( prefix, a[ prefix ], traditional, add );
  		}
  	}

  	// Return the resulting serialization
  	return s.join( "&" ).replace( r20, "+" );
  };

  jQuery.fn.extend( {
  	serialize: function() {
  		return jQuery.param( this.serializeArray() );
  	},
  	serializeArray: function() {
  		return this.map( function() {

  			// Can add propHook for "elements" to filter or add form elements
  			var elements = jQuery.prop( this, "elements" );
  			return elements ? jQuery.makeArray( elements ) : this;
  		} )
  		.filter( function() {
  			var type = this.type;

  			// Use .is( ":disabled" ) so that fieldset[disabled] works
  			return this.name && !jQuery( this ).is( ":disabled" ) &&
  				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
  				( this.checked || !rcheckableType.test( type ) );
  		} )
  		.map( function( i, elem ) {
  			var val = jQuery( this ).val();

  			return val == null ?
  				null :
  				jQuery.isArray( val ) ?
  					jQuery.map( val, function( val ) {
  						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
  					} ) :
  					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
  		} ).get();
  	}
  } );


  jQuery.ajaxSettings.xhr = function() {
  	try {
  		return new window.XMLHttpRequest();
  	} catch ( e ) {}
  };

  var xhrSuccessStatus = {

  		// File protocol always yields status code 0, assume 200
  		0: 200,

  		// Support: IE9
  		// #1450: sometimes IE returns 1223 when it should be 204
  		1223: 204
  	},
  	xhrSupported = jQuery.ajaxSettings.xhr();

  support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
  support.ajax = xhrSupported = !!xhrSupported;

  jQuery.ajaxTransport( function( options ) {
  	var callback, errorCallback;

  	// Cross domain only allowed if supported through XMLHttpRequest
  	if ( support.cors || xhrSupported && !options.crossDomain ) {
  		return {
  			send: function( headers, complete ) {
  				var i,
  					xhr = options.xhr();

  				xhr.open(
  					options.type,
  					options.url,
  					options.async,
  					options.username,
  					options.password
  				);

  				// Apply custom fields if provided
  				if ( options.xhrFields ) {
  					for ( i in options.xhrFields ) {
  						xhr[ i ] = options.xhrFields[ i ];
  					}
  				}

  				// Override mime type if needed
  				if ( options.mimeType && xhr.overrideMimeType ) {
  					xhr.overrideMimeType( options.mimeType );
  				}

  				// X-Requested-With header
  				// For cross-domain requests, seeing as conditions for a preflight are
  				// akin to a jigsaw puzzle, we simply never set it to be sure.
  				// (it can always be set on a per-request basis or even using ajaxSetup)
  				// For same-domain requests, won't change header if already provided.
  				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
  					headers[ "X-Requested-With" ] = "XMLHttpRequest";
  				}

  				// Set headers
  				for ( i in headers ) {
  					xhr.setRequestHeader( i, headers[ i ] );
  				}

  				// Callback
  				callback = function( type ) {
  					return function() {
  						if ( callback ) {
  							callback = errorCallback = xhr.onload =
  								xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

  							if ( type === "abort" ) {
  								xhr.abort();
  							} else if ( type === "error" ) {

  								// Support: IE9
  								// On a manual native abort, IE9 throws
  								// errors on any property access that is not readyState
  								if ( typeof xhr.status !== "number" ) {
  									complete( 0, "error" );
  								} else {
  									complete(

  										// File: protocol always yields status 0; see #8605, #14207
  										xhr.status,
  										xhr.statusText
  									);
  								}
  							} else {
  								complete(
  									xhrSuccessStatus[ xhr.status ] || xhr.status,
  									xhr.statusText,

  									// Support: IE9 only
  									// IE9 has no XHR2 but throws on binary (trac-11426)
  									// For XHR2 non-text, let the caller handle it (gh-2498)
  									( xhr.responseType || "text" ) !== "text"  ||
  									typeof xhr.responseText !== "string" ?
  										{ binary: xhr.response } :
  										{ text: xhr.responseText },
  									xhr.getAllResponseHeaders()
  								);
  							}
  						}
  					};
  				};

  				// Listen to events
  				xhr.onload = callback();
  				errorCallback = xhr.onerror = callback( "error" );

  				// Support: IE9
  				// Use onreadystatechange to replace onabort
  				// to handle uncaught aborts
  				if ( xhr.onabort !== undefined ) {
  					xhr.onabort = errorCallback;
  				} else {
  					xhr.onreadystatechange = function() {

  						// Check readyState before timeout as it changes
  						if ( xhr.readyState === 4 ) {

  							// Allow onerror to be called first,
  							// but that will not handle a native abort
  							// Also, save errorCallback to a variable
  							// as xhr.onerror cannot be accessed
  							window.setTimeout( function() {
  								if ( callback ) {
  									errorCallback();
  								}
  							} );
  						}
  					};
  				}

  				// Create the abort callback
  				callback = callback( "abort" );

  				try {

  					// Do send the request (this may raise an exception)
  					xhr.send( options.hasContent && options.data || null );
  				} catch ( e ) {

  					// #14683: Only rethrow if this hasn't been notified as an error yet
  					if ( callback ) {
  						throw e;
  					}
  				}
  			},

  			abort: function() {
  				if ( callback ) {
  					callback();
  				}
  			}
  		};
  	}
  } );




  // Install script dataType
  jQuery.ajaxSetup( {
  	accepts: {
  		script: "text/javascript, application/javascript, " +
  			"application/ecmascript, application/x-ecmascript"
  	},
  	contents: {
  		script: /\b(?:java|ecma)script\b/
  	},
  	converters: {
  		"text script": function( text ) {
  			jQuery.globalEval( text );
  			return text;
  		}
  	}
  } );

  // Handle cache's special case and crossDomain
  jQuery.ajaxPrefilter( "script", function( s ) {
  	if ( s.cache === undefined ) {
  		s.cache = false;
  	}
  	if ( s.crossDomain ) {
  		s.type = "GET";
  	}
  } );

  // Bind script tag hack transport
  jQuery.ajaxTransport( "script", function( s ) {

  	// This transport only deals with cross domain requests
  	if ( s.crossDomain ) {
  		var script, callback;
  		return {
  			send: function( _, complete ) {
  				script = jQuery( "<script>" ).prop( {
  					charset: s.scriptCharset,
  					src: s.url
  				} ).on(
  					"load error",
  					callback = function( evt ) {
  						script.remove();
  						callback = null;
  						if ( evt ) {
  							complete( evt.type === "error" ? 404 : 200, evt.type );
  						}
  					}
  				);

  				// Use native DOM manipulation to avoid our domManip AJAX trickery
  				document.head.appendChild( script[ 0 ] );
  			},
  			abort: function() {
  				if ( callback ) {
  					callback();
  				}
  			}
  		};
  	}
  } );




  var oldCallbacks = [],
  	rjsonp = /(=)\?(?=&|$)|\?\?/;

  // Default jsonp settings
  jQuery.ajaxSetup( {
  	jsonp: "callback",
  	jsonpCallback: function() {
  		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
  		this[ callback ] = true;
  		return callback;
  	}
  } );

  // Detect, normalize options and install callbacks for jsonp requests
  jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

  	var callbackName, overwritten, responseContainer,
  		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
  			"url" :
  			typeof s.data === "string" &&
  				( s.contentType || "" )
  					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
  				rjsonp.test( s.data ) && "data"
  		);

  	// Handle iff the expected data type is "jsonp" or we have a parameter to set
  	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

  		// Get callback name, remembering preexisting value associated with it
  		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
  			s.jsonpCallback() :
  			s.jsonpCallback;

  		// Insert callback into url or form data
  		if ( jsonProp ) {
  			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
  		} else if ( s.jsonp !== false ) {
  			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
  		}

  		// Use data converter to retrieve json after script execution
  		s.converters[ "script json" ] = function() {
  			if ( !responseContainer ) {
  				jQuery.error( callbackName + " was not called" );
  			}
  			return responseContainer[ 0 ];
  		};

  		// Force json dataType
  		s.dataTypes[ 0 ] = "json";

  		// Install callback
  		overwritten = window[ callbackName ];
  		window[ callbackName ] = function() {
  			responseContainer = arguments;
  		};

  		// Clean-up function (fires after converters)
  		jqXHR.always( function() {

  			// If previous value didn't exist - remove it
  			if ( overwritten === undefined ) {
  				jQuery( window ).removeProp( callbackName );

  			// Otherwise restore preexisting value
  			} else {
  				window[ callbackName ] = overwritten;
  			}

  			// Save back as free
  			if ( s[ callbackName ] ) {

  				// Make sure that re-using the options doesn't screw things around
  				s.jsonpCallback = originalSettings.jsonpCallback;

  				// Save the callback name for future use
  				oldCallbacks.push( callbackName );
  			}

  			// Call if it was a function and we have a response
  			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
  				overwritten( responseContainer[ 0 ] );
  			}

  			responseContainer = overwritten = undefined;
  		} );

  		// Delegate to script
  		return "script";
  	}
  } );




  // Argument "data" should be string of html
  // context (optional): If specified, the fragment will be created in this context,
  // defaults to document
  // keepScripts (optional): If true, will include scripts passed in the html string
  jQuery.parseHTML = function( data, context, keepScripts ) {
  	if ( !data || typeof data !== "string" ) {
  		return null;
  	}
  	if ( typeof context === "boolean" ) {
  		keepScripts = context;
  		context = false;
  	}
  	context = context || document;

  	var parsed = rsingleTag.exec( data ),
  		scripts = !keepScripts && [];

  	// Single tag
  	if ( parsed ) {
  		return [ context.createElement( parsed[ 1 ] ) ];
  	}

  	parsed = buildFragment( [ data ], context, scripts );

  	if ( scripts && scripts.length ) {
  		jQuery( scripts ).remove();
  	}

  	return jQuery.merge( [], parsed.childNodes );
  };


  // Keep a copy of the old load method
  var _load = jQuery.fn.load;

  /**
   * Load a url into a page
   */
  jQuery.fn.load = function( url, params, callback ) {
  	if ( typeof url !== "string" && _load ) {
  		return _load.apply( this, arguments );
  	}

  	var selector, type, response,
  		self = this,
  		off = url.indexOf( " " );

  	if ( off > -1 ) {
  		selector = jQuery.trim( url.slice( off ) );
  		url = url.slice( 0, off );
  	}

  	// If it's a function
  	if ( jQuery.isFunction( params ) ) {

  		// We assume that it's the callback
  		callback = params;
  		params = undefined;

  	// Otherwise, build a param string
  	} else if ( params && typeof params === "object" ) {
  		type = "POST";
  	}

  	// If we have elements to modify, make the request
  	if ( self.length > 0 ) {
  		jQuery.ajax( {
  			url: url,

  			// If "type" variable is undefined, then "GET" method will be used.
  			// Make value of this field explicit since
  			// user can override it through ajaxSetup method
  			type: type || "GET",
  			dataType: "html",
  			data: params
  		} ).done( function( responseText ) {

  			// Save response for use in complete callback
  			response = arguments;

  			self.html( selector ?

  				// If a selector was specified, locate the right elements in a dummy div
  				// Exclude scripts to avoid IE 'Permission Denied' errors
  				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

  				// Otherwise use the full result
  				responseText );

  		// If the request succeeds, this function gets "data", "status", "jqXHR"
  		// but they are ignored because response was set above.
  		// If it fails, this function gets "jqXHR", "status", "error"
  		} ).always( callback && function( jqXHR, status ) {
  			self.each( function() {
  				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
  			} );
  		} );
  	}

  	return this;
  };




  // Attach a bunch of functions for handling common AJAX events
  jQuery.each( [
  	"ajaxStart",
  	"ajaxStop",
  	"ajaxComplete",
  	"ajaxError",
  	"ajaxSuccess",
  	"ajaxSend"
  ], function( i, type ) {
  	jQuery.fn[ type ] = function( fn ) {
  		return this.on( type, fn );
  	};
  } );




  jQuery.expr.filters.animated = function( elem ) {
  	return jQuery.grep( jQuery.timers, function( fn ) {
  		return elem === fn.elem;
  	} ).length;
  };




  /**
   * Gets a window from an element
   */
  function getWindow( elem ) {
  	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
  }

  jQuery.offset = {
  	setOffset: function( elem, options, i ) {
  		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
  			position = jQuery.css( elem, "position" ),
  			curElem = jQuery( elem ),
  			props = {};

  		// Set position first, in-case top/left are set even on static elem
  		if ( position === "static" ) {
  			elem.style.position = "relative";
  		}

  		curOffset = curElem.offset();
  		curCSSTop = jQuery.css( elem, "top" );
  		curCSSLeft = jQuery.css( elem, "left" );
  		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
  			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

  		// Need to be able to calculate position if either
  		// top or left is auto and position is either absolute or fixed
  		if ( calculatePosition ) {
  			curPosition = curElem.position();
  			curTop = curPosition.top;
  			curLeft = curPosition.left;

  		} else {
  			curTop = parseFloat( curCSSTop ) || 0;
  			curLeft = parseFloat( curCSSLeft ) || 0;
  		}

  		if ( jQuery.isFunction( options ) ) {

  			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
  			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
  		}

  		if ( options.top != null ) {
  			props.top = ( options.top - curOffset.top ) + curTop;
  		}
  		if ( options.left != null ) {
  			props.left = ( options.left - curOffset.left ) + curLeft;
  		}

  		if ( "using" in options ) {
  			options.using.call( elem, props );

  		} else {
  			curElem.css( props );
  		}
  	}
  };

  jQuery.fn.extend( {
  	offset: function( options ) {
  		if ( arguments.length ) {
  			return options === undefined ?
  				this :
  				this.each( function( i ) {
  					jQuery.offset.setOffset( this, options, i );
  				} );
  		}

  		var docElem, win,
  			elem = this[ 0 ],
  			box = { top: 0, left: 0 },
  			doc = elem && elem.ownerDocument;

  		if ( !doc ) {
  			return;
  		}

  		docElem = doc.documentElement;

  		// Make sure it's not a disconnected DOM node
  		if ( !jQuery.contains( docElem, elem ) ) {
  			return box;
  		}

  		box = elem.getBoundingClientRect();
  		win = getWindow( doc );
  		return {
  			top: box.top + win.pageYOffset - docElem.clientTop,
  			left: box.left + win.pageXOffset - docElem.clientLeft
  		};
  	},

  	position: function() {
  		if ( !this[ 0 ] ) {
  			return;
  		}

  		var offsetParent, offset,
  			elem = this[ 0 ],
  			parentOffset = { top: 0, left: 0 };

  		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
  		// because it is its only offset parent
  		if ( jQuery.css( elem, "position" ) === "fixed" ) {

  			// Assume getBoundingClientRect is there when computed position is fixed
  			offset = elem.getBoundingClientRect();

  		} else {

  			// Get *real* offsetParent
  			offsetParent = this.offsetParent();

  			// Get correct offsets
  			offset = this.offset();
  			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
  				parentOffset = offsetParent.offset();
  			}

  			// Add offsetParent borders
  			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
  			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
  		}

  		// Subtract parent offsets and element margins
  		return {
  			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
  			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
  		};
  	},

  	// This method will return documentElement in the following cases:
  	// 1) For the element inside the iframe without offsetParent, this method will return
  	//    documentElement of the parent window
  	// 2) For the hidden or detached element
  	// 3) For body or html element, i.e. in case of the html node - it will return itself
  	//
  	// but those exceptions were never presented as a real life use-cases
  	// and might be considered as more preferable results.
  	//
  	// This logic, however, is not guaranteed and can change at any point in the future
  	offsetParent: function() {
  		return this.map( function() {
  			var offsetParent = this.offsetParent;

  			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
  				offsetParent = offsetParent.offsetParent;
  			}

  			return offsetParent || documentElement;
  		} );
  	}
  } );

  // Create scrollLeft and scrollTop methods
  jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
  	var top = "pageYOffset" === prop;

  	jQuery.fn[ method ] = function( val ) {
  		return access( this, function( elem, method, val ) {
  			var win = getWindow( elem );

  			if ( val === undefined ) {
  				return win ? win[ prop ] : elem[ method ];
  			}

  			if ( win ) {
  				win.scrollTo(
  					!top ? val : win.pageXOffset,
  					top ? val : win.pageYOffset
  				);

  			} else {
  				elem[ method ] = val;
  			}
  		}, method, val, arguments.length );
  	};
  } );

  // Support: Safari<7-8+, Chrome<37-44+
  // Add the top/left cssHooks using jQuery.fn.position
  // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
  // Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
  // getComputedStyle returns percent when specified for top/left/bottom/right;
  // rather than make the css module depend on the offset module, just check for it here
  jQuery.each( [ "top", "left" ], function( i, prop ) {
  	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
  		function( elem, computed ) {
  			if ( computed ) {
  				computed = curCSS( elem, prop );

  				// If curCSS returns percentage, fallback to offset
  				return rnumnonpx.test( computed ) ?
  					jQuery( elem ).position()[ prop ] + "px" :
  					computed;
  			}
  		}
  	);
  } );


  // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
  jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
  	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
  		function( defaultExtra, funcName ) {

  		// Margin is only for outerHeight, outerWidth
  		jQuery.fn[ funcName ] = function( margin, value ) {
  			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
  				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

  			return access( this, function( elem, type, value ) {
  				var doc;

  				if ( jQuery.isWindow( elem ) ) {

  					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
  					// isn't a whole lot we can do. See pull request at this URL for discussion:
  					// https://github.com/jquery/jquery/pull/764
  					return elem.document.documentElement[ "client" + name ];
  				}

  				// Get document width or height
  				if ( elem.nodeType === 9 ) {
  					doc = elem.documentElement;

  					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
  					// whichever is greatest
  					return Math.max(
  						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
  						elem.body[ "offset" + name ], doc[ "offset" + name ],
  						doc[ "client" + name ]
  					);
  				}

  				return value === undefined ?

  					// Get width or height on the element, requesting but not forcing parseFloat
  					jQuery.css( elem, type, extra ) :

  					// Set width or height on the element
  					jQuery.style( elem, type, value, extra );
  			}, type, chainable ? margin : undefined, chainable, null );
  		};
  	} );
  } );


  jQuery.fn.extend( {

  	bind: function( types, data, fn ) {
  		return this.on( types, null, data, fn );
  	},
  	unbind: function( types, fn ) {
  		return this.off( types, null, fn );
  	},

  	delegate: function( selector, types, data, fn ) {
  		return this.on( types, selector, data, fn );
  	},
  	undelegate: function( selector, types, fn ) {

  		// ( namespace ) or ( selector, types [, fn] )
  		return arguments.length === 1 ?
  			this.off( selector, "**" ) :
  			this.off( types, selector || "**", fn );
  	},
  	size: function() {
  		return this.length;
  	}
  } );

  jQuery.fn.andSelf = jQuery.fn.addBack;




  // Register as a named AMD module, since jQuery can be concatenated with other
  // files that may use define, but not via a proper concatenation script that
  // understands anonymous AMD modules. A named AMD is safest and most robust
  // way to register. Lowercase jquery is used because AMD module names are
  // derived from file names, and jQuery is normally delivered in a lowercase
  // file name. Do this after creating the global so that if an AMD module wants
  // to call noConflict to hide this version of jQuery, it will work.

  // Note that for maximum portability, libraries that are not jQuery should
  // declare themselves as anonymous modules, and avoid setting a global if an
  // AMD loader is present. jQuery is a special case. For more information, see
  // https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

  if ( true ) {
  	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
  		return jQuery;
  	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }



  var

  	// Map over jQuery in case of overwrite
  	_jQuery = window.jQuery,

  	// Map over the $ in case of overwrite
  	_$ = window.$;

  jQuery.noConflict = function( deep ) {
  	if ( window.$ === jQuery ) {
  		window.$ = _$;
  	}

  	if ( deep && window.jQuery === jQuery ) {
  		window.jQuery = _jQuery;
  	}

  	return jQuery;
  };

  // Expose jQuery and $ identifiers, even in AMD
  // (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
  // and CommonJS for browser emulators (#13566)
  if ( !noGlobal ) {
  	window.jQuery = window.$ = jQuery;
  }

  return jQuery;
  }));


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

  var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
  //     http://underscorejs.org
  //     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
  //     Underscore may be freely distributed under the MIT license.

  (function() {

    // Baseline setup
    // --------------

    // Establish the root object, `window` in the browser, or `exports` on the server.
    var root = this;

    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;

    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

    // Create quick reference variables for speed access to core prototypes.
    var
      push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
      nativeIsArray      = Array.isArray,
      nativeKeys         = Object.keys,
      nativeBind         = FuncProto.bind,
      nativeCreate       = Object.create;

    // Naked function reference for surrogate-prototype-swapping.
    var Ctor = function(){};

    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
      if (obj instanceof _) return obj;
      if (!(this instanceof _)) return new _(obj);
      this._wrapped = obj;
    };

    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object.
    if (true) {
      if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = _;
      }
      exports._ = _;
    } else {
      root._ = _;
    }

    // Current version.
    _.VERSION = '1.8.3';

    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    var optimizeCb = function(func, context, argCount) {
      if (context === void 0) return func;
      switch (argCount == null ? 3 : argCount) {
        case 1: return function(value) {
          return func.call(context, value);
        };
        case 2: return function(value, other) {
          return func.call(context, value, other);
        };
        case 3: return function(value, index, collection) {
          return func.call(context, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
      }
      return function() {
        return func.apply(context, arguments);
      };
    };

    // A mostly-internal function to generate callbacks that can be applied
    // to each element in a collection, returning the desired result — either
    // identity, an arbitrary callback, a property matcher, or a property accessor.
    var cb = function(value, context, argCount) {
      if (value == null) return _.identity;
      if (_.isFunction(value)) return optimizeCb(value, context, argCount);
      if (_.isObject(value)) return _.matcher(value);
      return _.property(value);
    };
    _.iteratee = function(value, context) {
      return cb(value, context, Infinity);
    };

    // An internal function for creating assigner functions.
    var createAssigner = function(keysFunc, undefinedOnly) {
      return function(obj) {
        var length = arguments.length;
        if (length < 2 || obj == null) return obj;
        for (var index = 1; index < length; index++) {
          var source = arguments[index],
              keys = keysFunc(source),
              l = keys.length;
          for (var i = 0; i < l; i++) {
            var key = keys[i];
            if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
          }
        }
        return obj;
      };
    };

    // An internal function for creating a new object that inherits from another.
    var baseCreate = function(prototype) {
      if (!_.isObject(prototype)) return {};
      if (nativeCreate) return nativeCreate(prototype);
      Ctor.prototype = prototype;
      var result = new Ctor;
      Ctor.prototype = null;
      return result;
    };

    var property = function(key) {
      return function(obj) {
        return obj == null ? void 0 : obj[key];
      };
    };

    // Helper for collection methods to determine whether a collection
    // should be iterated as an array or as an object
    // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
    // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function(collection) {
      var length = getLength(collection);
      return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    // Collection Functions
    // --------------------

    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.
    _.each = _.forEach = function(obj, iteratee, context) {
      iteratee = optimizeCb(iteratee, context);
      var i, length;
      if (isArrayLike(obj)) {
        for (i = 0, length = obj.length; i < length; i++) {
          iteratee(obj[i], i, obj);
        }
      } else {
        var keys = _.keys(obj);
        for (i = 0, length = keys.length; i < length; i++) {
          iteratee(obj[keys[i]], keys[i], obj);
        }
      }
      return obj;
    };

    // Return the results of applying the iteratee to each element.
    _.map = _.collect = function(obj, iteratee, context) {
      iteratee = cb(iteratee, context);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          results = Array(length);
      for (var index = 0; index < length; index++) {
        var currentKey = keys ? keys[index] : index;
        results[index] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
    };

    // Create a reducing function iterating left or right.
    function createReduce(dir) {
      // Optimized iterator function as using arguments.length
      // in the main function will deoptimize the, see #1991.
      function iterator(obj, iteratee, memo, keys, index, length) {
        for (; index >= 0 && index < length; index += dir) {
          var currentKey = keys ? keys[index] : index;
          memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo;
      }

      return function(obj, iteratee, memo, context) {
        iteratee = optimizeCb(iteratee, context, 4);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            index = dir > 0 ? 0 : length - 1;
        // Determine the initial value if none is provided.
        if (arguments.length < 3) {
          memo = obj[keys ? keys[index] : index];
          index += dir;
        }
        return iterator(obj, iteratee, memo, keys, index, length);
      };
    }

    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`.
    _.reduce = _.foldl = _.inject = createReduce(1);

    // The right-associative version of reduce, also known as `foldr`.
    _.reduceRight = _.foldr = createReduce(-1);

    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function(obj, predicate, context) {
      var key;
      if (isArrayLike(obj)) {
        key = _.findIndex(obj, predicate, context);
      } else {
        key = _.findKey(obj, predicate, context);
      }
      if (key !== void 0 && key !== -1) return obj[key];
    };

    // Return all the elements that pass a truth test.
    // Aliased as `select`.
    _.filter = _.select = function(obj, predicate, context) {
      var results = [];
      predicate = cb(predicate, context);
      _.each(obj, function(value, index, list) {
        if (predicate(value, index, list)) results.push(value);
      });
      return results;
    };

    // Return all the elements for which a truth test fails.
    _.reject = function(obj, predicate, context) {
      return _.filter(obj, _.negate(cb(predicate)), context);
    };

    // Determine whether all of the elements match a truth test.
    // Aliased as `all`.
    _.every = _.all = function(obj, predicate, context) {
      predicate = cb(predicate, context);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length;
      for (var index = 0; index < length; index++) {
        var currentKey = keys ? keys[index] : index;
        if (!predicate(obj[currentKey], currentKey, obj)) return false;
      }
      return true;
    };

    // Determine if at least one element in the object matches a truth test.
    // Aliased as `any`.
    _.some = _.any = function(obj, predicate, context) {
      predicate = cb(predicate, context);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length;
      for (var index = 0; index < length; index++) {
        var currentKey = keys ? keys[index] : index;
        if (predicate(obj[currentKey], currentKey, obj)) return true;
      }
      return false;
    };

    // Determine if the array or object contains a given item (using `===`).
    // Aliased as `includes` and `include`.
    _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      if (typeof fromIndex != 'number' || guard) fromIndex = 0;
      return _.indexOf(obj, item, fromIndex) >= 0;
    };

    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function(obj, method) {
      var args = slice.call(arguments, 2);
      var isFunc = _.isFunction(method);
      return _.map(obj, function(value) {
        var func = isFunc ? method : value[method];
        return func == null ? func : func.apply(value, args);
      });
    };

    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function(obj, key) {
      return _.map(obj, _.property(key));
    };

    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function(obj, attrs) {
      return _.filter(obj, _.matcher(attrs));
    };

    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function(obj, attrs) {
      return _.find(obj, _.matcher(attrs));
    };

    // Return the maximum element (or element-based computation).
    _.max = function(obj, iteratee, context) {
      var result = -Infinity, lastComputed = -Infinity,
          value, computed;
      if (iteratee == null && obj != null) {
        obj = isArrayLike(obj) ? obj : _.values(obj);
        for (var i = 0, length = obj.length; i < length; i++) {
          value = obj[i];
          if (value > result) {
            result = value;
          }
        }
      } else {
        iteratee = cb(iteratee, context);
        _.each(obj, function(value, index, list) {
          computed = iteratee(value, index, list);
          if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
            result = value;
            lastComputed = computed;
          }
        });
      }
      return result;
    };

    // Return the minimum element (or element-based computation).
    _.min = function(obj, iteratee, context) {
      var result = Infinity, lastComputed = Infinity,
          value, computed;
      if (iteratee == null && obj != null) {
        obj = isArrayLike(obj) ? obj : _.values(obj);
        for (var i = 0, length = obj.length; i < length; i++) {
          value = obj[i];
          if (value < result) {
            result = value;
          }
        }
      } else {
        iteratee = cb(iteratee, context);
        _.each(obj, function(value, index, list) {
          computed = iteratee(value, index, list);
          if (computed < lastComputed || computed === Infinity && result === Infinity) {
            result = value;
            lastComputed = computed;
          }
        });
      }
      return result;
    };

    // Shuffle a collection, using the modern version of the
    // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
    _.shuffle = function(obj) {
      var set = isArrayLike(obj) ? obj : _.values(obj);
      var length = set.length;
      var shuffled = Array(length);
      for (var index = 0, rand; index < length; index++) {
        rand = _.random(0, index);
        if (rand !== index) shuffled[index] = shuffled[rand];
        shuffled[rand] = set[index];
      }
      return shuffled;
    };

    // Sample **n** random values from a collection.
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `map`.
    _.sample = function(obj, n, guard) {
      if (n == null || guard) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        return obj[_.random(obj.length - 1)];
      }
      return _.shuffle(obj).slice(0, Math.max(0, n));
    };

    // Sort the object's values by a criterion produced by an iteratee.
    _.sortBy = function(obj, iteratee, context) {
      iteratee = cb(iteratee, context);
      return _.pluck(_.map(obj, function(value, index, list) {
        return {
          value: value,
          index: index,
          criteria: iteratee(value, index, list)
        };
      }).sort(function(left, right) {
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
          if (a > b || a === void 0) return 1;
          if (a < b || b === void 0) return -1;
        }
        return left.index - right.index;
      }), 'value');
    };

    // An internal function used for aggregate "group by" operations.
    var group = function(behavior) {
      return function(obj, iteratee, context) {
        var result = {};
        iteratee = cb(iteratee, context);
        _.each(obj, function(value, index) {
          var key = iteratee(value, index, obj);
          behavior(result, value, key);
        });
        return result;
      };
    };

    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = group(function(result, value, key) {
      if (_.has(result, key)) result[key].push(value); else result[key] = [value];
    });

    // Indexes the object's values by a criterion, similar to `groupBy`, but for
    // when you know that your index values will be unique.
    _.indexBy = group(function(result, value, key) {
      result[key] = value;
    });

    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = group(function(result, value, key) {
      if (_.has(result, key)) result[key]++; else result[key] = 1;
    });

    // Safely create a real, live array from anything iterable.
    _.toArray = function(obj) {
      if (!obj) return [];
      if (_.isArray(obj)) return slice.call(obj);
      if (isArrayLike(obj)) return _.map(obj, _.identity);
      return _.values(obj);
    };

    // Return the number of elements in an object.
    _.size = function(obj) {
      if (obj == null) return 0;
      return isArrayLike(obj) ? obj.length : _.keys(obj).length;
    };

    // Split a collection into two arrays: one whose elements all satisfy the given
    // predicate, and one whose elements all do not satisfy the predicate.
    _.partition = function(obj, predicate, context) {
      predicate = cb(predicate, context);
      var pass = [], fail = [];
      _.each(obj, function(value, key, obj) {
        (predicate(value, key, obj) ? pass : fail).push(value);
      });
      return [pass, fail];
    };

    // Array Functions
    // ---------------

    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function(array, n, guard) {
      if (array == null) return void 0;
      if (n == null || guard) return array[0];
      return _.initial(array, array.length - n);
    };

    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N.
    _.initial = function(array, n, guard) {
      return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
    };

    // Get the last element of an array. Passing **n** will return the last N
    // values in the array.
    _.last = function(array, n, guard) {
      if (array == null) return void 0;
      if (n == null || guard) return array[array.length - 1];
      return _.rest(array, Math.max(0, array.length - n));
    };

    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array.
    _.rest = _.tail = _.drop = function(array, n, guard) {
      return slice.call(array, n == null || guard ? 1 : n);
    };

    // Trim out all falsy values from an array.
    _.compact = function(array) {
      return _.filter(array, _.identity);
    };

    // Internal implementation of a recursive `flatten` function.
    var flatten = function(input, shallow, strict, startIndex) {
      var output = [], idx = 0;
      for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
        var value = input[i];
        if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
          //flatten current level of array or arguments object
          if (!shallow) value = flatten(value, shallow, strict);
          var j = 0, len = value.length;
          output.length += len;
          while (j < len) {
            output[idx++] = value[j++];
          }
        } else if (!strict) {
          output[idx++] = value;
        }
      }
      return output;
    };

    // Flatten out an array, either recursively (by default), or just one level.
    _.flatten = function(array, shallow) {
      return flatten(array, shallow, false);
    };

    // Return a version of the array that does not contain the specified value(s).
    _.without = function(array) {
      return _.difference(array, slice.call(arguments, 1));
    };

    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function(array, isSorted, iteratee, context) {
      if (!_.isBoolean(isSorted)) {
        context = iteratee;
        iteratee = isSorted;
        isSorted = false;
      }
      if (iteratee != null) iteratee = cb(iteratee, context);
      var result = [];
      var seen = [];
      for (var i = 0, length = getLength(array); i < length; i++) {
        var value = array[i],
            computed = iteratee ? iteratee(value, i, array) : value;
        if (isSorted) {
          if (!i || seen !== computed) result.push(value);
          seen = computed;
        } else if (iteratee) {
          if (!_.contains(seen, computed)) {
            seen.push(computed);
            result.push(value);
          }
        } else if (!_.contains(result, value)) {
          result.push(value);
        }
      }
      return result;
    };

    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function() {
      return _.uniq(flatten(arguments, true, true));
    };

    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function(array) {
      var result = [];
      var argsLength = arguments.length;
      for (var i = 0, length = getLength(array); i < length; i++) {
        var item = array[i];
        if (_.contains(result, item)) continue;
        for (var j = 1; j < argsLength; j++) {
          if (!_.contains(arguments[j], item)) break;
        }
        if (j === argsLength) result.push(item);
      }
      return result;
    };

    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function(array) {
      var rest = flatten(arguments, true, true, 1);
      return _.filter(array, function(value){
        return !_.contains(rest, value);
      });
    };

    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function() {
      return _.unzip(arguments);
    };

    // Complement of _.zip. Unzip accepts an array of arrays and groups
    // each array's elements on shared indices
    _.unzip = function(array) {
      var length = array && _.max(array, getLength).length || 0;
      var result = Array(length);

      for (var index = 0; index < length; index++) {
        result[index] = _.pluck(array, index);
      }
      return result;
    };

    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function(list, values) {
      var result = {};
      for (var i = 0, length = getLength(list); i < length; i++) {
        if (values) {
          result[list[i]] = values[i];
        } else {
          result[list[i][0]] = list[i][1];
        }
      }
      return result;
    };

    // Generator function to create the findIndex and findLastIndex functions
    function createPredicateIndexFinder(dir) {
      return function(array, predicate, context) {
        predicate = cb(predicate, context);
        var length = getLength(array);
        var index = dir > 0 ? 0 : length - 1;
        for (; index >= 0 && index < length; index += dir) {
          if (predicate(array[index], index, array)) return index;
        }
        return -1;
      };
    }

    // Returns the first index on an array-like that passes a predicate test
    _.findIndex = createPredicateIndexFinder(1);
    _.findLastIndex = createPredicateIndexFinder(-1);

    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function(array, obj, iteratee, context) {
      iteratee = cb(iteratee, context, 1);
      var value = iteratee(obj);
      var low = 0, high = getLength(array);
      while (low < high) {
        var mid = Math.floor((low + high) / 2);
        if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
      }
      return low;
    };

    // Generator function to create the indexOf and lastIndexOf functions
    function createIndexFinder(dir, predicateFind, sortedIndex) {
      return function(array, item, idx) {
        var i = 0, length = getLength(array);
        if (typeof idx == 'number') {
          if (dir > 0) {
              i = idx >= 0 ? idx : Math.max(idx + length, i);
          } else {
              length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
          }
        } else if (sortedIndex && idx && length) {
          idx = sortedIndex(array, item);
          return array[idx] === item ? idx : -1;
        }
        if (item !== item) {
          idx = predicateFind(slice.call(array, i, length), _.isNaN);
          return idx >= 0 ? idx + i : -1;
        }
        for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
          if (array[idx] === item) return idx;
        }
        return -1;
      };
    }

    // Return the position of the first occurrence of an item in an array,
    // or -1 if the item is not included in the array.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
    _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function(start, stop, step) {
      if (stop == null) {
        stop = start || 0;
        start = 0;
      }
      step = step || 1;

      var length = Math.max(Math.ceil((stop - start) / step), 0);
      var range = Array(length);

      for (var idx = 0; idx < length; idx++, start += step) {
        range[idx] = start;
      }

      return range;
    };

    // Function (ahem) Functions
    // ------------------

    // Determines whether to execute a function as a constructor
    // or a normal function with the provided arguments
    var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
      if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
      var self = baseCreate(sourceFunc.prototype);
      var result = sourceFunc.apply(self, args);
      if (_.isObject(result)) return result;
      return self;
    };

    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function(func, context) {
      if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
      if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
      var args = slice.call(arguments, 2);
      var bound = function() {
        return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
      };
      return bound;
    };

    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context. _ acts
    // as a placeholder, allowing any combination of arguments to be pre-filled.
    _.partial = function(func) {
      var boundArgs = slice.call(arguments, 1);
      var bound = function() {
        var position = 0, length = boundArgs.length;
        var args = Array(length);
        for (var i = 0; i < length; i++) {
          args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
        }
        while (position < arguments.length) args.push(arguments[position++]);
        return executeBound(func, bound, this, this, args);
      };
      return bound;
    };

    // Bind a number of an object's methods to that object. Remaining arguments
    // are the method names to be bound. Useful for ensuring that all callbacks
    // defined on an object belong to it.
    _.bindAll = function(obj) {
      var i, length = arguments.length, key;
      if (length <= 1) throw new Error('bindAll must be passed function names');
      for (i = 1; i < length; i++) {
        key = arguments[i];
        obj[key] = _.bind(obj[key], obj);
      }
      return obj;
    };

    // Memoize an expensive function by storing its results.
    _.memoize = function(func, hasher) {
      var memoize = function(key) {
        var cache = memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
        return cache[address];
      };
      memoize.cache = {};
      return memoize;
    };

    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function(func, wait) {
      var args = slice.call(arguments, 2);
      return setTimeout(function(){
        return func.apply(null, args);
      }, wait);
    };

    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = _.partial(_.delay, _, 1);

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    _.throttle = function(func, wait, options) {
      var context, args, result;
      var timeout = null;
      var previous = 0;
      if (!options) options = {};
      var later = function() {
        previous = options.leading === false ? 0 : _.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      };
      return function() {
        var now = _.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          previous = now;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    };

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function(func, wait, immediate) {
      var timeout, args, context, timestamp, result;

      var later = function() {
        var last = _.now() - timestamp;

        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          }
        }
      };

      return function() {
        context = this;
        args = arguments;
        timestamp = _.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }

        return result;
      };
    };

    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function(func, wrapper) {
      return _.partial(wrapper, func);
    };

    // Returns a negated version of the passed-in predicate.
    _.negate = function(predicate) {
      return function() {
        return !predicate.apply(this, arguments);
      };
    };

    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function() {
      var args = arguments;
      var start = args.length - 1;
      return function() {
        var i = start;
        var result = args[start].apply(this, arguments);
        while (i--) result = args[i].call(this, result);
        return result;
      };
    };

    // Returns a function that will only be executed on and after the Nth call.
    _.after = function(times, func) {
      return function() {
        if (--times < 1) {
          return func.apply(this, arguments);
        }
      };
    };

    // Returns a function that will only be executed up to (but not including) the Nth call.
    _.before = function(times, func) {
      var memo;
      return function() {
        if (--times > 0) {
          memo = func.apply(this, arguments);
        }
        if (times <= 1) func = null;
        return memo;
      };
    };

    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = _.partial(_.before, 2);

    // Object Functions
    // ----------------

    // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                        'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

    function collectNonEnumProps(obj, keys) {
      var nonEnumIdx = nonEnumerableProps.length;
      var constructor = obj.constructor;
      var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

      // Constructor is a special case.
      var prop = 'constructor';
      if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

      while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
          keys.push(prop);
        }
      }
    }

    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = function(obj) {
      if (!_.isObject(obj)) return [];
      if (nativeKeys) return nativeKeys(obj);
      var keys = [];
      for (var key in obj) if (_.has(obj, key)) keys.push(key);
      // Ahem, IE < 9.
      if (hasEnumBug) collectNonEnumProps(obj, keys);
      return keys;
    };

    // Retrieve all the property names of an object.
    _.allKeys = function(obj) {
      if (!_.isObject(obj)) return [];
      var keys = [];
      for (var key in obj) keys.push(key);
      // Ahem, IE < 9.
      if (hasEnumBug) collectNonEnumProps(obj, keys);
      return keys;
    };

    // Retrieve the values of an object's properties.
    _.values = function(obj) {
      var keys = _.keys(obj);
      var length = keys.length;
      var values = Array(length);
      for (var i = 0; i < length; i++) {
        values[i] = obj[keys[i]];
      }
      return values;
    };

    // Returns the results of applying the iteratee to each element of the object
    // In contrast to _.map it returns an object
    _.mapObject = function(obj, iteratee, context) {
      iteratee = cb(iteratee, context);
      var keys =  _.keys(obj),
            length = keys.length,
            results = {},
            currentKey;
        for (var index = 0; index < length; index++) {
          currentKey = keys[index];
          results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function(obj) {
      var keys = _.keys(obj);
      var length = keys.length;
      var pairs = Array(length);
      for (var i = 0; i < length; i++) {
        pairs[i] = [keys[i], obj[keys[i]]];
      }
      return pairs;
    };

    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function(obj) {
      var result = {};
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        result[obj[keys[i]]] = keys[i];
      }
      return result;
    };

    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function(obj) {
      var names = [];
      for (var key in obj) {
        if (_.isFunction(obj[key])) names.push(key);
      }
      return names.sort();
    };

    // Extend a given object with all the properties in passed-in object(s).
    _.extend = createAssigner(_.allKeys);

    // Assigns a given object with all the own properties in the passed-in object(s)
    // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
    _.extendOwn = _.assign = createAssigner(_.keys);

    // Returns the first key on an object that passes a predicate test
    _.findKey = function(obj, predicate, context) {
      predicate = cb(predicate, context);
      var keys = _.keys(obj), key;
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (predicate(obj[key], key, obj)) return key;
      }
    };

    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function(object, oiteratee, context) {
      var result = {}, obj = object, iteratee, keys;
      if (obj == null) return result;
      if (_.isFunction(oiteratee)) {
        keys = _.allKeys(obj);
        iteratee = optimizeCb(oiteratee, context);
      } else {
        keys = flatten(arguments, false, false, 1);
        iteratee = function(value, key, obj) { return key in obj; };
        obj = Object(obj);
      }
      for (var i = 0, length = keys.length; i < length; i++) {
        var key = keys[i];
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
      return result;
    };

     // Return a copy of the object without the blacklisted properties.
    _.omit = function(obj, iteratee, context) {
      if (_.isFunction(iteratee)) {
        iteratee = _.negate(iteratee);
      } else {
        var keys = _.map(flatten(arguments, false, false, 1), String);
        iteratee = function(value, key) {
          return !_.contains(keys, key);
        };
      }
      return _.pick(obj, iteratee, context);
    };

    // Fill in a given object with default properties.
    _.defaults = createAssigner(_.allKeys, true);

    // Creates an object that inherits from the given prototype object.
    // If additional properties are provided then they will be added to the
    // created object.
    _.create = function(prototype, props) {
      var result = baseCreate(prototype);
      if (props) _.extendOwn(result, props);
      return result;
    };

    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function(obj) {
      if (!_.isObject(obj)) return obj;
      return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };

    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function(obj, interceptor) {
      interceptor(obj);
      return obj;
    };

    // Returns whether an object has a given set of `key:value` pairs.
    _.isMatch = function(object, attrs) {
      var keys = _.keys(attrs), length = keys.length;
      if (object == null) return !length;
      var obj = Object(object);
      for (var i = 0; i < length; i++) {
        var key = keys[i];
        if (attrs[key] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };


    // Internal recursive comparison function for `isEqual`.
    var eq = function(a, b, aStack, bStack) {
      // Identical objects are equal. `0 === -0`, but they aren't identical.
      // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
      if (a === b) return a !== 0 || 1 / a === 1 / b;
      // A strict comparison is necessary because `null == undefined`.
      if (a == null || b == null) return a === b;
      // Unwrap any wrapped objects.
      if (a instanceof _) a = a._wrapped;
      if (b instanceof _) b = b._wrapped;
      // Compare `[[Class]]` names.
      var className = toString.call(a);
      if (className !== toString.call(b)) return false;
      switch (className) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
        case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case '[object String]':
          // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
          // equivalent to `new String("5")`.
          return '' + a === '' + b;
        case '[object Number]':
          // `NaN`s are equivalent, but non-reflexive.
          // Object(NaN) is equivalent to NaN
          if (+a !== +a) return +b !== +b;
          // An `egal` comparison is performed for other numeric values.
          return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
          // Coerce dates and booleans to numeric primitive values. Dates are compared by their
          // millisecond representations. Note that invalid dates with millisecond representations
          // of `NaN` are not equivalent.
          return +a === +b;
      }

      var areArrays = className === '[object Array]';
      if (!areArrays) {
        if (typeof a != 'object' || typeof b != 'object') return false;

        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                                 _.isFunction(bCtor) && bCtor instanceof bCtor)
                            && ('constructor' in a && 'constructor' in b)) {
          return false;
        }
      }
      // Assume equality for cyclic structures. The algorithm for detecting cyclic
      // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

      // Initializing stack of traversed objects.
      // It's done here since we only need them for objects and arrays comparison.
      aStack = aStack || [];
      bStack = bStack || [];
      var length = aStack.length;
      while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a) return bStack[length] === b;
      }

      // Add the first object to the stack of traversed objects.
      aStack.push(a);
      bStack.push(b);

      // Recursively compare objects and arrays.
      if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length) return false;
        // Deep compare the contents, ignoring non-numeric properties.
        while (length--) {
          if (!eq(a[length], b[length], aStack, bStack)) return false;
        }
      } else {
        // Deep compare objects.
        var keys = _.keys(a), key;
        length = keys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (_.keys(b).length !== length) return false;
        while (length--) {
          // Deep compare each member
          key = keys[length];
          if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
        }
      }
      // Remove the first object from the stack of traversed objects.
      aStack.pop();
      bStack.pop();
      return true;
    };

    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function(a, b) {
      return eq(a, b);
    };

    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function(obj) {
      if (obj == null) return true;
      if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
      return _.keys(obj).length === 0;
    };

    // Is a given value a DOM element?
    _.isElement = function(obj) {
      return !!(obj && obj.nodeType === 1);
    };

    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function(obj) {
      return toString.call(obj) === '[object Array]';
    };

    // Is a given variable an object?
    _.isObject = function(obj) {
      var type = typeof obj;
      return type === 'function' || type === 'object' && !!obj;
    };

    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
      _['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']';
      };
    });

    // Define a fallback version of the method in browsers (ahem, IE < 9), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
      _.isArguments = function(obj) {
        return _.has(obj, 'callee');
      };
    }

    // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
    // IE 11 (#1621), and in Safari 8 (#1929).
    if (typeof /./ != 'function' && typeof Int8Array != 'object') {
      _.isFunction = function(obj) {
        return typeof obj == 'function' || false;
      };
    }

    // Is a given object a finite number?
    _.isFinite = function(obj) {
      return isFinite(obj) && !isNaN(parseFloat(obj));
    };

    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function(obj) {
      return _.isNumber(obj) && obj !== +obj;
    };

    // Is a given value a boolean?
    _.isBoolean = function(obj) {
      return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
    };

    // Is a given value equal to null?
    _.isNull = function(obj) {
      return obj === null;
    };

    // Is a given variable undefined?
    _.isUndefined = function(obj) {
      return obj === void 0;
    };

    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, key) {
      return obj != null && hasOwnProperty.call(obj, key);
    };

    // Utility Functions
    // -----------------

    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function() {
      root._ = previousUnderscore;
      return this;
    };

    // Keep the identity function around for default iteratees.
    _.identity = function(value) {
      return value;
    };

    // Predicate-generating functions. Often useful outside of Underscore.
    _.constant = function(value) {
      return function() {
        return value;
      };
    };

    _.noop = function(){};

    _.property = property;

    // Generates a function for a given object that returns a given property.
    _.propertyOf = function(obj) {
      return obj == null ? function(){} : function(key) {
        return obj[key];
      };
    };

    // Returns a predicate for checking whether an object has a given set of
    // `key:value` pairs.
    _.matcher = _.matches = function(attrs) {
      attrs = _.extendOwn({}, attrs);
      return function(obj) {
        return _.isMatch(obj, attrs);
      };
    };

    // Run a function **n** times.
    _.times = function(n, iteratee, context) {
      var accum = Array(Math.max(0, n));
      iteratee = optimizeCb(iteratee, context, 1);
      for (var i = 0; i < n; i++) accum[i] = iteratee(i);
      return accum;
    };

    // Return a random integer between min and max (inclusive).
    _.random = function(min, max) {
      if (max == null) {
        max = min;
        min = 0;
      }
      return min + Math.floor(Math.random() * (max - min + 1));
    };

    // A (possibly faster) way to get the current timestamp as an integer.
    _.now = Date.now || function() {
      return new Date().getTime();
    };

     // List of HTML entities for escaping.
    var escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };
    var unescapeMap = _.invert(escapeMap);

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    var createEscaper = function(map) {
      var escaper = function(match) {
        return map[match];
      };
      // Regexes for identifying a key that needs to be escaped
      var source = '(?:' + _.keys(map).join('|') + ')';
      var testRegexp = RegExp(source);
      var replaceRegexp = RegExp(source, 'g');
      return function(string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
      };
    };
    _.escape = createEscaper(escapeMap);
    _.unescape = createEscaper(unescapeMap);

    // If the value of the named `property` is a function then invoke it with the
    // `object` as context; otherwise, return it.
    _.result = function(object, property, fallback) {
      var value = object == null ? void 0 : object[property];
      if (value === void 0) {
        value = fallback;
      }
      return _.isFunction(value) ? value.call(object) : value;
    };

    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function(prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    };

    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
      evaluate    : /<%([\s\S]+?)%>/g,
      interpolate : /<%=([\s\S]+?)%>/g,
      escape      : /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;

    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
      "'":      "'",
      '\\':     '\\',
      '\r':     'r',
      '\n':     'n',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

    var escapeChar = function(match) {
      return '\\' + escapes[match];
    };

    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.
    _.template = function(text, settings, oldSettings) {
      if (!settings && oldSettings) settings = oldSettings;
      settings = _.defaults({}, settings, _.templateSettings);

      // Combine delimiters into one regular expression via alternation.
      var matcher = RegExp([
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source
      ].join('|') + '|$', 'g');

      // Compile the template source, escaping string literals appropriately.
      var index = 0;
      var source = "__p+='";
      text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escaper, escapeChar);
        index = offset + match.length;

        if (escape) {
          source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        } else if (interpolate) {
          source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) {
          source += "';\n" + evaluate + "\n__p+='";
        }

        // Adobe VMs need the match returned to produce the correct offest.
        return match;
      });
      source += "';\n";

      // If a variable is not specified, place data values in local scope.
      if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

      source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + 'return __p;\n';

      try {
        var render = new Function(settings.variable || 'obj', '_', source);
      } catch (e) {
        e.source = source;
        throw e;
      }

      var template = function(data) {
        return render.call(this, data, _);
      };

      // Provide the compiled source as a convenience for precompilation.
      var argument = settings.variable || 'obj';
      template.source = 'function(' + argument + '){\n' + source + '}';

      return template;
    };

    // Add a "chain" function. Start chaining a wrapped Underscore object.
    _.chain = function(obj) {
      var instance = _(obj);
      instance._chain = true;
      return instance;
    };

    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.

    // Helper function to continue chaining intermediate results.
    var result = function(instance, obj) {
      return instance._chain ? _(obj).chain() : obj;
    };

    // Add your own custom functions to the Underscore object.
    _.mixin = function(obj) {
      _.each(_.functions(obj), function(name) {
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
          var args = [this._wrapped];
          push.apply(args, arguments);
          return result(this, func.apply(_, args));
        };
      });
    };

    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);

    // Add all mutator Array functions to the wrapper.
    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        var obj = this._wrapped;
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
        return result(this, obj);
      };
    });

    // Add all accessor Array functions to the wrapper.
    _.each(['concat', 'join', 'slice'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        return result(this, method.apply(this._wrapped, arguments));
      };
    });

    // Extracts the result from a wrapped and chained object.
    _.prototype.value = function() {
      return this._wrapped;
    };

    // Provide unwrapping proxy for some methods used in engine operations
    // such as arithmetic and JSON stringification.
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function() {
      return '' + this._wrapped;
    };

    // AMD registration happens at the end for compatibility with AMD loaders
    // that may not enforce next-turn semantics on modules. Even though general
    // practice for AMD registration is to be anonymous, underscore registers
    // as a named module because, like jQuery, it is a base library that is
    // popular enough to be bundled in a third party lib, but not be part of
    // an AMD load request. Those cases could generate an error when an
    // anonymous define() is called outside of a loader request.
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
        return _;
      }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
  }.call(this));


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global, jQuery) {/*** IMPORTS FROM imports-loader ***/
  var window = global;

  "use strict";

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

  /*
   * jQuery mmenu v5.6.0
   * @requires jQuery 1.7.0 or later
   *
   * mmenu.frebsite.nl
   *	
   * Copyright (c) Fred Heusschen
   * www.frebsite.nl
   *
   * License: CC-BY-NC-4.0
   * http://creativecommons.org/licenses/by-nc/4.0/
   */
  !function (e) {
    function t() {
      e[n].glbl || (r = { $wndw: e(window), $docu: e(document), $html: e("html"), $body: e("body") }, i = {}, a = {}, o = {}, e.each([i, a, o], function (e, t) {
        t.add = function (e) {
          e = e.split(" ");for (var n = 0, s = e.length; s > n; n++) {
            t[e[n]] = t.mm(e[n]);
          }
        };
      }), i.mm = function (e) {
        return "mm-" + e;
      }, i.add("wrapper menu panels panel nopanel current highest opened subopened navbar hasnavbar title btn prev next listview nolistview inset vertical selected divider spacer hidden fullsubopen"), i.umm = function (e) {
        return "mm-" == e.slice(0, 3) && (e = e.slice(3)), e;
      }, a.mm = function (e) {
        return "mm-" + e;
      }, a.add("parent sub"), o.mm = function (e) {
        return e + ".mm";
      }, o.add("transitionend webkitTransitionEnd click scroll keydown mousedown mouseup touchstart touchmove touchend orientationchange"), e[n]._c = i, e[n]._d = a, e[n]._e = o, e[n].glbl = r);
    }var n = "mmenu",
        s = "5.6.0";if (!(e[n] && e[n].version > s)) {
      e[n] = function (e, t, n) {
        this.$menu = e, this._api = ["bind", "init", "update", "setSelected", "getInstance", "openPanel", "closePanel", "closeAllPanels"], this.opts = t, this.conf = n, this.vars = {}, this.cbck = {}, "function" == typeof this.___deprecated && this.___deprecated(), this._initMenu(), this._initAnchors();var s = this.$pnls.children();return this._initAddons(), this.init(s), "function" == typeof this.___debug && this.___debug(), this;
      }, e[n].version = s, e[n].addons = {}, e[n].uniqueId = 0, e[n].defaults = { extensions: [], navbar: { add: !0, title: "Menu", titleLink: "panel" }, onClick: { setSelected: !0 }, slidingSubmenus: !0 }, e[n].configuration = { classNames: { divider: "Divider", inset: "Inset", panel: "Panel", selected: "Selected", spacer: "Spacer", vertical: "Vertical" }, clone: !1, openingInterval: 25, panelNodetype: "ul, ol, div", transitionDuration: 400 }, e[n].prototype = { init: function init(e) {
          e = e.not("." + i.nopanel), e = this._initPanels(e), this.trigger("init", e), this.trigger("update");
        }, update: function update() {
          this.trigger("update");
        }, setSelected: function setSelected(e) {
          this.$menu.find("." + i.listview).children().removeClass(i.selected), e.addClass(i.selected), this.trigger("setSelected", e);
        }, openPanel: function openPanel(t) {
          var s = t.parent(),
              a = this;if (s.hasClass(i.vertical)) {
            var o = s.parents("." + i.subopened);if (o.length) return void this.openPanel(o.first());s.addClass(i.opened), this.trigger("openPanel", t), this.trigger("openingPanel", t), this.trigger("openedPanel", t);
          } else {
            if (t.hasClass(i.current)) return;var r = this.$pnls.children("." + i.panel),
                l = r.filter("." + i.current);r.removeClass(i.highest).removeClass(i.current).not(t).not(l).not("." + i.vertical).addClass(i.hidden), e[n].support.csstransitions || l.addClass(i.hidden), t.hasClass(i.opened) ? t.nextAll("." + i.opened).addClass(i.highest).removeClass(i.opened).removeClass(i.subopened) : (t.addClass(i.highest), l.addClass(i.subopened)), t.removeClass(i.hidden).addClass(i.current), a.trigger("openPanel", t), setTimeout(function () {
              t.removeClass(i.subopened).addClass(i.opened), a.trigger("openingPanel", t), a.__transitionend(t, function () {
                a.trigger("openedPanel", t);
              }, a.conf.transitionDuration);
            }, this.conf.openingInterval);
          }
        }, closePanel: function closePanel(e) {
          var t = e.parent();t.hasClass(i.vertical) && (t.removeClass(i.opened), this.trigger("closePanel", e), this.trigger("closingPanel", e), this.trigger("closedPanel", e));
        }, closeAllPanels: function closeAllPanels() {
          this.$menu.find("." + i.listview).children().removeClass(i.selected).filter("." + i.vertical).removeClass(i.opened);var e = this.$pnls.children("." + i.panel),
              t = e.first();this.$pnls.children("." + i.panel).not(t).removeClass(i.subopened).removeClass(i.opened).removeClass(i.current).removeClass(i.highest).addClass(i.hidden), this.openPanel(t);
        }, togglePanel: function togglePanel(e) {
          var t = e.parent();t.hasClass(i.vertical) && this[t.hasClass(i.opened) ? "closePanel" : "openPanel"](e);
        }, getInstance: function getInstance() {
          return this;
        }, bind: function bind(e, t) {
          this.cbck[e] = this.cbck[e] || [], this.cbck[e].push(t);
        }, trigger: function trigger() {
          var e = this,
              t = Array.prototype.slice.call(arguments),
              n = t.shift();if (this.cbck[n]) for (var s = 0, i = this.cbck[n].length; i > s; s++) {
            this.cbck[n][s].apply(e, t);
          }
        }, _initMenu: function _initMenu() {
          this.$menu.attr("id", this.$menu.attr("id") || this.__getUniqueId()), this.conf.clone && (this.$menu = this.$menu.clone(!0), this.$menu.add(this.$menu.find("[id]")).filter("[id]").each(function () {
            e(this).attr("id", i.mm(e(this).attr("id")));
          })), this.$menu.contents().each(function () {
            3 == e(this)[0].nodeType && e(this).remove();
          }), this.$pnls = e('<div class="' + i.panels + '" />').append(this.$menu.children(this.conf.panelNodetype)).prependTo(this.$menu), this.$menu.parent().addClass(i.wrapper);var t = [i.menu];this.opts.slidingSubmenus || t.push(i.vertical), this.opts.extensions = this.opts.extensions.length ? "mm-" + this.opts.extensions.join(" mm-") : "", this.opts.extensions && t.push(this.opts.extensions), this.$menu.addClass(t.join(" "));
        }, _initPanels: function _initPanels(t) {
          var n = this,
              s = this.__findAddBack(t, "ul, ol");this.__refactorClass(s, this.conf.classNames.inset, "inset").addClass(i.nolistview + " " + i.nopanel), s.not("." + i.nolistview).addClass(i.listview);var o = this.__findAddBack(t, "." + i.listview).children();this.__refactorClass(o, this.conf.classNames.selected, "selected"), this.__refactorClass(o, this.conf.classNames.divider, "divider"), this.__refactorClass(o, this.conf.classNames.spacer, "spacer"), this.__refactorClass(this.__findAddBack(t, "." + this.conf.classNames.panel), this.conf.classNames.panel, "panel");var r = e(),
              l = t.add(t.find("." + i.panel)).add(this.__findAddBack(t, "." + i.listview).children().children(this.conf.panelNodetype)).not("." + i.nopanel);this.__refactorClass(l, this.conf.classNames.vertical, "vertical"), this.opts.slidingSubmenus || l.addClass(i.vertical), l.each(function () {
            var t = e(this),
                s = t;t.is("ul, ol") ? (t.wrap('<div class="' + i.panel + '" />'), s = t.parent()) : s.addClass(i.panel);var a = t.attr("id");t.removeAttr("id"), s.attr("id", a || n.__getUniqueId()), t.hasClass(i.vertical) && (t.removeClass(n.conf.classNames.vertical), s.add(s.parent()).addClass(i.vertical)), r = r.add(s);
          });var d = e("." + i.panel, this.$menu);r.each(function (t) {
            var s,
                o,
                r = e(this),
                l = r.parent(),
                d = l.children("a, span").first();if (l.is("." + i.panels) || (l.data(a.sub, r), r.data(a.parent, l)), l.children("." + i.next).length || l.parent().is("." + i.listview) && (s = r.attr("id"), o = e('<a class="' + i.next + '" href="#' + s + '" data-target="#' + s + '" />').insertBefore(d), d.is("span") && o.addClass(i.fullsubopen)), !r.children("." + i.navbar).length && !l.hasClass(i.vertical)) {
              l.parent().is("." + i.listview) ? l = l.closest("." + i.panel) : (d = l.closest("." + i.panel).find('a[href="#' + r.attr("id") + '"]').first(), l = d.closest("." + i.panel));var c = e('<div class="' + i.navbar + '" />');if (l.length) {
                switch (s = l.attr("id"), n.opts.navbar.titleLink) {case "anchor":
                    _url = d.attr("href");break;case "panel":case "parent":
                    _url = "#" + s;break;default:
                    _url = !1;}c.append('<a class="' + i.btn + " " + i.prev + '" href="#' + s + '" data-target="#' + s + '" />').append(e('<a class="' + i.title + '"' + (_url ? ' href="' + _url + '"' : "") + " />").text(d.text())).prependTo(r), n.opts.navbar.add && r.addClass(i.hasnavbar);
              } else n.opts.navbar.title && (c.append('<a class="' + i.title + '">' + n.opts.navbar.title + "</a>").prependTo(r), n.opts.navbar.add && r.addClass(i.hasnavbar));
            }
          });var c = this.__findAddBack(t, "." + i.listview).children("." + i.selected).removeClass(i.selected).last().addClass(i.selected);c.add(c.parentsUntil("." + i.menu, "li")).filter("." + i.vertical).addClass(i.opened).end().each(function () {
            e(this).parentsUntil("." + i.menu, "." + i.panel).not("." + i.vertical).first().addClass(i.opened).parentsUntil("." + i.menu, "." + i.panel).not("." + i.vertical).first().addClass(i.opened).addClass(i.subopened);
          }), c.children("." + i.panel).not("." + i.vertical).addClass(i.opened).parentsUntil("." + i.menu, "." + i.panel).not("." + i.vertical).first().addClass(i.opened).addClass(i.subopened);var h = d.filter("." + i.opened);return h.length || (h = r.first()), h.addClass(i.opened).last().addClass(i.current), r.not("." + i.vertical).not(h.last()).addClass(i.hidden).end().filter(function () {
            return !e(this).parent().hasClass(i.panels);
          }).appendTo(this.$pnls), r;
        }, _initAnchors: function _initAnchors() {
          var t = this;r.$body.on(o.click + "-oncanvas", "a[href]", function (s) {
            var a = e(this),
                o = !1,
                r = t.$menu.find(a).length;for (var l in e[n].addons) {
              if (e[n].addons[l].clickAnchor.call(t, a, r)) {
                o = !0;break;
              }
            }var d = a.attr("href");if (!o && r && d.length > 1 && "#" == d.slice(0, 1)) try {
              var c = e(d, t.$menu);c.is("." + i.panel) && (o = !0, t[a.parent().hasClass(i.vertical) ? "togglePanel" : "openPanel"](c));
            } catch (h) {}if (o && s.preventDefault(), !o && r && a.is("." + i.listview + " > li > a") && !a.is('[rel="external"]') && !a.is('[target="_blank"]')) {
              t.__valueOrFn(t.opts.onClick.setSelected, a) && t.setSelected(e(s.target).parent());var u = t.__valueOrFn(t.opts.onClick.preventDefault, a, "#" == d.slice(0, 1));u && s.preventDefault(), t.__valueOrFn(t.opts.onClick.close, a, u) && t.close();
            }
          });
        }, _initAddons: function _initAddons() {
          var t;for (t in e[n].addons) {
            e[n].addons[t].add.call(this), e[n].addons[t].add = function () {};
          }for (t in e[n].addons) {
            e[n].addons[t].setup.call(this);
          }
        }, _getOriginalMenuId: function _getOriginalMenuId() {
          var e = this.$menu.attr("id");return e && e.length && this.conf.clone && (e = i.umm(e)), e;
        }, __api: function __api() {
          var t = this,
              n = {};return e.each(this._api, function (e) {
            var s = this;n[s] = function () {
              var e = t[s].apply(t, arguments);return "undefined" == typeof e ? n : e;
            };
          }), n;
        }, __valueOrFn: function __valueOrFn(e, t, n) {
          return "function" == typeof e ? e.call(t[0]) : "undefined" == typeof e && "undefined" != typeof n ? n : e;
        }, __refactorClass: function __refactorClass(e, t, n) {
          return e.filter("." + t).removeClass(t).addClass(i[n]);
        }, __findAddBack: function __findAddBack(e, t) {
          return e.find(t).add(e.filter(t));
        }, __filterListItems: function __filterListItems(e) {
          return e.not("." + i.divider).not("." + i.hidden);
        }, __transitionend: function __transitionend(e, t, n) {
          var s = !1,
              i = function i() {
            s || t.call(e[0]), s = !0;
          };e.one(o.transitionend, i), e.one(o.webkitTransitionEnd, i), setTimeout(i, 1.1 * n);
        }, __getUniqueId: function __getUniqueId() {
          return i.mm(e[n].uniqueId++);
        } }, e.fn[n] = function (s, i) {
        return t(), s = e.extend(!0, {}, e[n].defaults, s), i = e.extend(!0, {}, e[n].configuration, i), this.each(function () {
          var t = e(this);if (!t.data(n)) {
            var a = new e[n](t, s, i);a.$menu.data(n, a.__api());
          }
        });
      }, e[n].support = { touch: "ontouchstart" in window || navigator.msMaxTouchPoints || !1, csstransitions: function () {
          if ("undefined" != typeof Modernizr && "undefined" != typeof Modernizr.csstransitions) return Modernizr.csstransitions;var e = document.body || document.documentElement,
              t = e.style,
              n = "transition";if ("string" == typeof t[n]) return !0;var s = ["Moz", "webkit", "Webkit", "Khtml", "O", "ms"];n = n.charAt(0).toUpperCase() + n.substr(1);for (var i = 0; i < s.length; i++) {
            if ("string" == typeof t[s[i] + n]) return !0;
          }return !1;
        }() };var i, a, o, r;
    }
  }(jQuery), /*	
             * jQuery mmenu offCanvas addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "offCanvas";e[t].addons[n] = { setup: function setup() {
        if (this.opts[n]) {
          var i = this.opts[n],
              a = this.conf[n];o = e[t].glbl, this._api = e.merge(this._api, ["open", "close", "setPage"]), ("top" == i.position || "bottom" == i.position) && (i.zposition = "front"), "string" != typeof a.pageSelector && (a.pageSelector = "> " + a.pageNodetype), o.$allMenus = (o.$allMenus || e()).add(this.$menu), this.vars.opened = !1;var r = [s.offcanvas];"left" != i.position && r.push(s.mm(i.position)), "back" != i.zposition && r.push(s.mm(i.zposition)), this.$menu.addClass(r.join(" ")).parent().removeClass(s.wrapper), this.setPage(o.$page), this._initBlocker(), this["_initWindow_" + n](), this.$menu[a.menuInjectMethod + "To"](a.menuWrapperSelector);var l = window.location.hash;if (l) {
            var d = this._getOriginalMenuId();d && d == l.slice(1) && this.open();
          }
        }
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("offcanvas slideout blocking modal background opening blocker page"), i.add("style"), a.add("resize");
      }, clickAnchor: function clickAnchor(e, t) {
        if (!this.opts[n]) return !1;var s = this._getOriginalMenuId();if (s && e.is('[href="#' + s + '"]')) return this.open(), !0;if (o.$page) return s = o.$page.first().attr("id"), s && e.is('[href="#' + s + '"]') ? (this.close(), !0) : !1;
      } }, e[t].defaults[n] = { position: "left", zposition: "back", blockUI: !0, moveBackground: !0 }, e[t].configuration[n] = { pageNodetype: "div", pageSelector: null, noPageSelector: [], wrapPageIfNeeded: !0, menuWrapperSelector: "body", menuInjectMethod: "prepend" }, e[t].prototype.open = function () {
      if (!this.vars.opened) {
        var e = this;this._openSetup(), setTimeout(function () {
          e._openFinish();
        }, this.conf.openingInterval), this.trigger("open");
      }
    }, e[t].prototype._openSetup = function () {
      var t = this,
          r = this.opts[n];this.closeAllOthers(), o.$page.each(function () {
        e(this).data(i.style, e(this).attr("style") || "");
      }), o.$wndw.trigger(a.resize + "-" + n, [!0]);var l = [s.opened];r.blockUI && l.push(s.blocking), "modal" == r.blockUI && l.push(s.modal), r.moveBackground && l.push(s.background), "left" != r.position && l.push(s.mm(this.opts[n].position)), "back" != r.zposition && l.push(s.mm(this.opts[n].zposition)), this.opts.extensions && l.push(this.opts.extensions), o.$html.addClass(l.join(" ")), setTimeout(function () {
        t.vars.opened = !0;
      }, this.conf.openingInterval), this.$menu.addClass(s.current + " " + s.opened);
    }, e[t].prototype._openFinish = function () {
      var e = this;this.__transitionend(o.$page.first(), function () {
        e.trigger("opened");
      }, this.conf.transitionDuration), o.$html.addClass(s.opening), this.trigger("opening");
    }, e[t].prototype.close = function () {
      if (this.vars.opened) {
        var t = this;this.__transitionend(o.$page.first(), function () {
          t.$menu.removeClass(s.current).removeClass(s.opened), o.$html.removeClass(s.opened).removeClass(s.blocking).removeClass(s.modal).removeClass(s.background).removeClass(s.mm(t.opts[n].position)).removeClass(s.mm(t.opts[n].zposition)), t.opts.extensions && o.$html.removeClass(t.opts.extensions), o.$page.each(function () {
            e(this).attr("style", e(this).data(i.style));
          }), t.vars.opened = !1, t.trigger("closed");
        }, this.conf.transitionDuration), o.$html.removeClass(s.opening), this.trigger("close"), this.trigger("closing");
      }
    }, e[t].prototype.closeAllOthers = function () {
      o.$allMenus.not(this.$menu).each(function () {
        var n = e(this).data(t);n && n.close && n.close();
      });
    }, e[t].prototype.setPage = function (t) {
      var i = this,
          a = this.conf[n];t && t.length || (t = o.$body.find(a.pageSelector), a.noPageSelector.length && (t = t.not(a.noPageSelector.join(", "))), t.length > 1 && a.wrapPageIfNeeded && (t = t.wrapAll("<" + this.conf[n].pageNodetype + " />").parent())), t.each(function () {
        e(this).attr("id", e(this).attr("id") || i.__getUniqueId());
      }), t.addClass(s.page + " " + s.slideout), o.$page = t, this.trigger("setPage", t);
    }, e[t].prototype["_initWindow_" + n] = function () {
      o.$wndw.off(a.keydown + "-" + n).on(a.keydown + "-" + n, function (e) {
        return o.$html.hasClass(s.opened) && 9 == e.keyCode ? (e.preventDefault(), !1) : void 0;
      });var e = 0;o.$wndw.off(a.resize + "-" + n).on(a.resize + "-" + n, function (t, n) {
        if (1 == o.$page.length && (n || o.$html.hasClass(s.opened))) {
          var i = o.$wndw.height();(n || i != e) && (e = i, o.$page.css("minHeight", i));
        }
      });
    }, e[t].prototype._initBlocker = function () {
      var t = this;this.opts[n].blockUI && (o.$blck || (o.$blck = e('<div id="' + s.blocker + '" class="' + s.slideout + '" />')), o.$blck.appendTo(o.$body).off(a.touchstart + "-" + n + " " + a.touchmove + "-" + n).on(a.touchstart + "-" + n + " " + a.touchmove + "-" + n, function (e) {
        e.preventDefault(), e.stopPropagation(), o.$blck.trigger(a.mousedown + "-" + n);
      }).off(a.mousedown + "-" + n).on(a.mousedown + "-" + n, function (e) {
        e.preventDefault(), o.$html.hasClass(s.modal) || (t.closeAllOthers(), t.close());
      }));
    };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu scrollBugFix addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "scrollBugFix";e[t].addons[n] = { setup: function setup() {
        var i = this,
            r = this.opts[n];this.conf[n];if (o = e[t].glbl, e[t].support.touch && this.opts.offCanvas && this.opts.offCanvas.blockUI && ("boolean" == typeof r && (r = { fix: r }), "object" != (typeof r === "undefined" ? "undefined" : _typeof(r)) && (r = {}), r = this.opts[n] = e.extend(!0, {}, e[t].defaults[n], r), r.fix)) {
          var l = this.$menu.attr("id"),
              d = !1;this.bind("opening", function () {
            this.$pnls.children("." + s.current).scrollTop(0);
          }), o.$docu.on(a.touchmove, function (e) {
            i.vars.opened && e.preventDefault();
          }), o.$body.on(a.touchstart, "#" + l + "> ." + s.panels + "> ." + s.current, function (e) {
            i.vars.opened && (d || (d = !0, 0 === e.currentTarget.scrollTop ? e.currentTarget.scrollTop = 1 : e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight && (e.currentTarget.scrollTop -= 1), d = !1));
          }).on(a.touchmove, "#" + l + "> ." + s.panels + "> ." + s.current, function (t) {
            i.vars.opened && e(this)[0].scrollHeight > e(this).innerHeight() && t.stopPropagation();
          }), o.$wndw.on(a.orientationchange, function () {
            i.$pnls.children("." + s.current).scrollTop(0).css({ "-webkit-overflow-scrolling": "auto" }).css({ "-webkit-overflow-scrolling": "touch" });
          });
        }
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e;
      }, clickAnchor: function clickAnchor(e, t) {} }, e[t].defaults[n] = { fix: !0 };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu autoHeight addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "autoHeight";e[t].addons[n] = { setup: function setup() {
        if (this.opts.offCanvas) {
          var i = this.opts[n];this.conf[n];if (o = e[t].glbl, "boolean" == typeof i && i && (i = { height: "auto" }), "string" == typeof i && (i = { height: i }), "object" != (typeof i === "undefined" ? "undefined" : _typeof(i)) && (i = {}), i = this.opts[n] = e.extend(!0, {}, e[t].defaults[n], i), "auto" == i.height || "highest" == i.height) {
            this.$menu.addClass(s.autoheight);var a = function a(t) {
              if (this.vars.opened) {
                var n = parseInt(this.$pnls.css("top"), 10) || 0,
                    a = parseInt(this.$pnls.css("bottom"), 10) || 0,
                    o = 0;this.$menu.addClass(s.measureheight), "auto" == i.height ? (t = t || this.$pnls.children("." + s.current), t.is("." + s.vertical) && (t = t.parents("." + s.panel).not("." + s.vertical).first()), o = t.outerHeight()) : "highest" == i.height && this.$pnls.children().each(function () {
                  var t = e(this);t.is("." + s.vertical) && (t = t.parents("." + s.panel).not("." + s.vertical).first()), o = Math.max(o, t.outerHeight());
                }), this.$menu.height(o + n + a).removeClass(s.measureheight);
              }
            };this.bind("opening", a), "highest" == i.height && this.bind("init", a), "auto" == i.height && (this.bind("update", a), this.bind("openPanel", a), this.bind("closePanel", a));
          }
        }
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("autoheight measureheight"), a.add("resize");
      }, clickAnchor: function clickAnchor(e, t) {} }, e[t].defaults[n] = { height: "default" };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu backButton addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "backButton";e[t].addons[n] = { setup: function setup() {
        if (this.opts.offCanvas) {
          var i = this,
              a = this.opts[n];this.conf[n];if (o = e[t].glbl, "boolean" == typeof a && (a = { close: a }), "object" != (typeof a === "undefined" ? "undefined" : _typeof(a)) && (a = {}), a = e.extend(!0, {}, e[t].defaults[n], a), a.close) {
            var r = "#" + i.$menu.attr("id");this.bind("opened", function (e) {
              location.hash != r && history.pushState(null, document.title, r);
            }), e(window).on("popstate", function (e) {
              o.$html.hasClass(s.opened) ? (e.stopPropagation(), i.close()) : location.hash == r && (e.stopPropagation(), i.open());
            });
          }
        }
      }, add: function add() {
        return window.history && window.history.pushState ? (s = e[t]._c, i = e[t]._d, void (a = e[t]._e)) : void (e[t].addons[n].setup = function () {});
      }, clickAnchor: function clickAnchor(e, t) {} }, e[t].defaults[n] = { close: !1 };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu columns addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "columns";e[t].addons[n] = { setup: function setup() {
        var i = this.opts[n];this.conf[n];if (o = e[t].glbl, "boolean" == typeof i && (i = { add: i }), "number" == typeof i && (i = { add: !0, visible: i }), "object" != (typeof i === "undefined" ? "undefined" : _typeof(i)) && (i = {}), "number" == typeof i.visible && (i.visible = { min: i.visible, max: i.visible }), i = this.opts[n] = e.extend(!0, {}, e[t].defaults[n], i), i.add) {
          i.visible.min = Math.max(1, Math.min(6, i.visible.min)), i.visible.max = Math.max(i.visible.min, Math.min(6, i.visible.max)), this.$menu.addClass(s.columns);for (var a = this.opts.offCanvas ? this.$menu.add(o.$html) : this.$menu, r = [], l = 0; l <= i.visible.max; l++) {
            r.push(s.columns + "-" + l);
          }r = r.join(" ");var d = function d(e) {
            u.call(this, this.$pnls.children("." + s.current)), i.hideNavbars && e.removeClass(s.hasnavbar);
          },
              c = function c() {
            var e = this.$pnls.children("." + s.panel).filter("." + s.opened).length;e = Math.min(i.visible.max, Math.max(i.visible.min, e)), a.removeClass(r).addClass(s.columns + "-" + e);
          },
              h = function h() {
            this.opts.offCanvas && o.$html.removeClass(r);
          },
              u = function u(t) {
            this.$pnls.children("." + s.panel).removeClass(r).filter("." + s.subopened).removeClass(s.hidden).add(t).slice(-i.visible.max).each(function (t) {
              e(this).addClass(s.columns + "-" + t);
            });
          };this.bind("open", c), this.bind("close", h), this.bind("init", d), this.bind("openPanel", u), this.bind("openingPanel", c), this.bind("openedPanel", c), this.opts.offCanvas || c.call(this);
        }
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("columns");
      }, clickAnchor: function clickAnchor(t, i) {
        if (!this.opts[n].add) return !1;if (i) {
          var a = t.attr("href");if (a.length > 1 && "#" == a.slice(0, 1)) try {
            var o = e(a, this.$menu);if (o.is("." + s.panel)) for (var r = parseInt(t.closest("." + s.panel).attr("class").split(s.columns + "-")[1].split(" ")[0], 10) + 1; r !== !1;) {
              var l = this.$pnls.children("." + s.columns + "-" + r);if (!l.length) {
                r = !1;break;
              }r++, l.removeClass(s.subopened).removeClass(s.opened).removeClass(s.current).removeClass(s.highest).addClass(s.hidden);
            }
          } catch (d) {}
        }
      } }, e[t].defaults[n] = { add: !1, visible: { min: 1, max: 3 }, hideNavbars: !1 };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu counters addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "counters";e[t].addons[n] = { setup: function setup() {
        var a = this,
            r = this.opts[n];this.conf[n];o = e[t].glbl, "boolean" == typeof r && (r = { add: r, update: r }), "object" != (typeof r === "undefined" ? "undefined" : _typeof(r)) && (r = {}), r = this.opts[n] = e.extend(!0, {}, e[t].defaults[n], r), this.bind("init", function (t) {
          this.__refactorClass(e("em", t), this.conf.classNames[n].counter, "counter");
        }), r.add && this.bind("init", function (t) {
          t.each(function () {
            var t = e(this).data(i.parent);t && (t.children("em." + s.counter).length || t.prepend(e('<em class="' + s.counter + '" />')));
          });
        }), r.update && this.bind("update", function () {
          this.$pnls.find("." + s.panel).each(function () {
            var t = e(this),
                n = t.data(i.parent);if (n) {
              var o = n.children("em." + s.counter);o.length && (t = t.children("." + s.listview), t.length && o.html(a.__filterListItems(t.children()).length));
            }
          });
        });
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("counter search noresultsmsg");
      }, clickAnchor: function clickAnchor(e, t) {} }, e[t].defaults[n] = { add: !1, update: !1 }, e[t].configuration.classNames[n] = { counter: "Counter" };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu dividers addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "dividers";e[t].addons[n] = { setup: function setup() {
        var i = this,
            r = this.opts[n];this.conf[n];if (o = e[t].glbl, "boolean" == typeof r && (r = { add: r, fixed: r }), "object" != (typeof r === "undefined" ? "undefined" : _typeof(r)) && (r = {}), r = this.opts[n] = e.extend(!0, {}, e[t].defaults[n], r), this.bind("init", function (t) {
          this.__refactorClass(e("li", this.$menu), this.conf.classNames[n].collapsed, "collapsed");
        }), r.add && this.bind("init", function (t) {
          var n;switch (r.addTo) {case "panels":
              n = t;break;default:
              n = e(r.addTo, this.$pnls).filter("." + s.panel);}e("." + s.divider, n).remove(), n.find("." + s.listview).not("." + s.vertical).each(function () {
            var t = "";i.__filterListItems(e(this).children()).each(function () {
              var n = e.trim(e(this).children("a, span").text()).slice(0, 1).toLowerCase();n != t && n.length && (t = n, e('<li class="' + s.divider + '">' + n + "</li>").insertBefore(this));
            });
          });
        }), r.collapse && this.bind("init", function (t) {
          e("." + s.divider, t).each(function () {
            var t = e(this),
                n = t.nextUntil("." + s.divider, "." + s.collapsed);n.length && (t.children("." + s.subopen).length || (t.wrapInner("<span />"), t.prepend('<a href="#" class="' + s.subopen + " " + s.fullsubopen + '" />')));
          });
        }), r.fixed) {
          var l = function l(t) {
            t = t || this.$pnls.children("." + s.current);var n = t.find("." + s.divider).not("." + s.hidden);if (n.length) {
              this.$menu.addClass(s.hasdividers);var i = t.scrollTop() || 0,
                  a = "";t.is(":visible") && t.find("." + s.divider).not("." + s.hidden).each(function () {
                e(this).position().top + i < i + 1 && (a = e(this).text());
              }), this.$fixeddivider.text(a);
            } else this.$menu.removeClass(s.hasdividers);
          };this.$fixeddivider = e('<ul class="' + s.listview + " " + s.fixeddivider + '"><li class="' + s.divider + '"></li></ul>').prependTo(this.$pnls).children(), this.bind("openPanel", l), this.bind("update", l), this.bind("init", function (t) {
            t.off(a.scroll + "-dividers " + a.touchmove + "-dividers").on(a.scroll + "-dividers " + a.touchmove + "-dividers", function (t) {
              l.call(i, e(this));
            });
          });
        }
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("collapsed uncollapsed fixeddivider hasdividers"), a.add("scroll");
      }, clickAnchor: function clickAnchor(e, t) {
        if (this.opts[n].collapse && t) {
          var i = e.parent();if (i.is("." + s.divider)) {
            var a = i.nextUntil("." + s.divider, "." + s.collapsed);return i.toggleClass(s.opened), a[i.hasClass(s.opened) ? "addClass" : "removeClass"](s.uncollapsed), !0;
          }
        }return !1;
      } }, e[t].defaults[n] = { add: !1, addTo: "panels", fixed: !1, collapse: !1 }, e[t].configuration.classNames[n] = { collapsed: "Collapsed" };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu dragOpen addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    function t(e, t, n) {
      return t > e && (e = t), e > n && (e = n), e;
    }var n = "mmenu",
        s = "dragOpen";e[n].addons[s] = { setup: function setup() {
        if (this.opts.offCanvas) {
          var a = this,
              o = this.opts[s],
              l = this.conf[s];if (r = e[n].glbl, "boolean" == typeof o && (o = { open: o }), "object" != (typeof o === "undefined" ? "undefined" : _typeof(o)) && (o = {}), o = this.opts[s] = e.extend(!0, {}, e[n].defaults[s], o), o.open) {
            var d,
                c,
                h,
                u,
                p,
                f = {},
                v = 0,
                m = !1,
                g = !1,
                b = 0,
                _ = 0;switch (this.opts.offCanvas.position) {case "left":case "right":
                f.events = "panleft panright", f.typeLower = "x", f.typeUpper = "X", g = "width";break;case "top":case "bottom":
                f.events = "panup pandown", f.typeLower = "y", f.typeUpper = "Y", g = "height";}switch (this.opts.offCanvas.position) {case "right":case "bottom":
                f.negative = !0, u = function u(e) {
                  e >= r.$wndw[g]() - o.maxStartPos && (v = 1);
                };break;default:
                f.negative = !1, u = function u(e) {
                  e <= o.maxStartPos && (v = 1);
                };}switch (this.opts.offCanvas.position) {case "left":
                f.open_dir = "right", f.close_dir = "left";break;case "right":
                f.open_dir = "left", f.close_dir = "right";break;case "top":
                f.open_dir = "down", f.close_dir = "up";break;case "bottom":
                f.open_dir = "up", f.close_dir = "down";}switch (this.opts.offCanvas.zposition) {case "front":
                p = function p() {
                  return this.$menu;
                };break;default:
                p = function p() {
                  return e("." + i.slideout);
                };}var C = this.__valueOrFn(o.pageNode, this.$menu, r.$page);"string" == typeof C && (C = e(C));var $ = new Hammer(C[0], o.vendors.hammer);$.on("panstart", function (e) {
              u(e.center[f.typeLower]), r.$slideOutNodes = p(), m = f.open_dir;
            }).on(f.events + " panend", function (e) {
              v > 0 && e.preventDefault();
            }).on(f.events, function (e) {
              if (d = e["delta" + f.typeUpper], f.negative && (d = -d), d != b && (m = d >= b ? f.open_dir : f.close_dir), b = d, b > o.threshold && 1 == v) {
                if (r.$html.hasClass(i.opened)) return;v = 2, a._openSetup(), a.trigger("opening"), r.$html.addClass(i.dragging), _ = t(r.$wndw[g]() * l[g].perc, l[g].min, l[g].max);
              }2 == v && (c = t(b, 10, _) - ("front" == a.opts.offCanvas.zposition ? _ : 0), f.negative && (c = -c), h = "translate" + f.typeUpper + "(" + c + "px )", r.$slideOutNodes.css({ "-webkit-transform": "-webkit-" + h, transform: h }));
            }).on("panend", function (e) {
              2 == v && (r.$html.removeClass(i.dragging), r.$slideOutNodes.css("transform", ""), a[m == f.open_dir ? "_openFinish" : "close"]()), v = 0;
            });
          }
        }
      }, add: function add() {
        return "function" != typeof Hammer || Hammer.VERSION < 2 ? void (e[n].addons[s].setup = function () {}) : (i = e[n]._c, a = e[n]._d, o = e[n]._e, void i.add("dragging"));
      }, clickAnchor: function clickAnchor(e, t) {} }, e[n].defaults[s] = { open: !1, maxStartPos: 100, threshold: 50, vendors: { hammer: {} } }, e[n].configuration[s] = { width: { perc: .8, min: 140, max: 440 }, height: { perc: .8, min: 140, max: 880 } };var i, a, o, r;
  }(jQuery), /*	
             * jQuery mmenu dropdown addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "dropdown";e[t].addons[n] = { setup: function setup() {
        if (this.opts.offCanvas) {
          var r = this,
              l = this.opts[n],
              d = this.conf[n];if (o = e[t].glbl, "boolean" == typeof l && l && (l = { drop: l }), "object" != (typeof l === "undefined" ? "undefined" : _typeof(l)) && (l = {}), "string" == typeof l.position && (l.position = { of: l.position }), l = this.opts[n] = e.extend(!0, {}, e[t].defaults[n], l), l.drop) {
            if ("string" != typeof l.position.of) {
              var c = this.$menu.attr("id");c && c.length && (this.conf.clone && (c = s.umm(c)), l.position.of = '[href="#' + c + '"]');
            }if ("string" == typeof l.position.of) {
              var h = e(l.position.of);if (h.length) {
                this.$menu.addClass(s.dropdown), l.tip && this.$menu.addClass(s.tip), l.event = l.event.split(" "), 1 == l.event.length && (l.event[1] = l.event[0]), "hover" == l.event[0] && h.on(a.mouseenter + "-dropdown", function () {
                  r.open();
                }), "hover" == l.event[1] && this.$menu.on(a.mouseleave + "-dropdown", function () {
                  r.close();
                }), this.bind("opening", function () {
                  this.$menu.data(i.style, this.$menu.attr("style") || ""), o.$html.addClass(s.dropdown);
                }), this.bind("closed", function () {
                  this.$menu.attr("style", this.$menu.data(i.style)), o.$html.removeClass(s.dropdown);
                });var u = function u(i, a) {
                  var r = a[0],
                      c = a[1],
                      u = "x" == i ? "scrollLeft" : "scrollTop",
                      p = "x" == i ? "outerWidth" : "outerHeight",
                      f = "x" == i ? "left" : "top",
                      v = "x" == i ? "right" : "bottom",
                      m = "x" == i ? "width" : "height",
                      g = "x" == i ? "maxWidth" : "maxHeight",
                      b = null,
                      _ = o.$wndw[u](),
                      C = h.offset()[f] -= _,
                      $ = C + h[p](),
                      y = o.$wndw[m](),
                      x = d.offset.button[i] + d.offset.viewport[i];if (l.position[i]) switch (l.position[i]) {case "left":case "bottom":
                      b = "after";break;case "right":case "top":
                      b = "before";}null === b && (b = y / 2 > C + ($ - C) / 2 ? "after" : "before");var w, k;return "after" == b ? (w = "x" == i ? C : $, k = y - (w + x), r[f] = w + d.offset.button[i], r[v] = "auto", c.push(s["x" == i ? "tipleft" : "tiptop"])) : (w = "x" == i ? $ : C, k = w - x, r[v] = "calc( 100% - " + (w - d.offset.button[i]) + "px )", r[f] = "auto", c.push(s["x" == i ? "tipright" : "tipbottom"])), r[g] = Math.min(e[t].configuration[n][m].max, k), [r, c];
                },
                    p = function p(e) {
                  if (this.vars.opened) {
                    this.$menu.attr("style", this.$menu.data(i.style));var t = [{}, []];t = u.call(this, "y", t), t = u.call(this, "x", t), this.$menu.css(t[0]), l.tip && this.$menu.removeClass(s.tipleft + " " + s.tipright + " " + s.tiptop + " " + s.tipbottom).addClass(t[1].join(" "));
                  }
                };this.bind("opening", p), o.$wndw.on(a.resize + "-dropdown", function (e) {
                  p.call(r);
                }), this.opts.offCanvas.blockUI || o.$wndw.on(a.scroll + "-dropdown", function (e) {
                  p.call(r);
                });
              }
            }
          }
        }
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("dropdown tip tipleft tipright tiptop tipbottom"), a.add("mouseenter mouseleave resize scroll");
      }, clickAnchor: function clickAnchor(e, t) {} }, e[t].defaults[n] = { drop: !1, event: "click", position: {}, tip: !0 }, e[t].configuration[n] = { offset: { button: { x: -10, y: 10 }, viewport: { x: 20, y: 20 } }, height: { max: 880 }, width: { max: 440 } };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu fixedElements addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "fixedElements";e[t].addons[n] = { setup: function setup() {
        if (this.opts.offCanvas) {
          var s = this.opts[n];this.conf[n];o = e[t].glbl, s = this.opts[n] = e.extend(!0, {}, e[t].defaults[n], s);var i = function i(e) {
            var t = this.conf.classNames[n].fixed;this.__refactorClass(e.find("." + t), t, "slideout").appendTo(o.$body);
          };i.call(this, o.$page), this.bind("setPage", i);
        }
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("fixed");
      }, clickAnchor: function clickAnchor(e, t) {} }, e[t].configuration.classNames[n] = { fixed: "Fixed" };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu iconPanels addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "iconPanels";e[t].addons[n] = { setup: function setup() {
        var i = this,
            a = this.opts[n];this.conf[n];if (o = e[t].glbl, "boolean" == typeof a && (a = { add: a }), "number" == typeof a && (a = { add: !0, visible: a }), "object" != (typeof a === "undefined" ? "undefined" : _typeof(a)) && (a = {}), a = this.opts[n] = e.extend(!0, {}, e[t].defaults[n], a), a.visible++, a.add) {
          this.$menu.addClass(s.iconpanel);for (var r = [], l = 0; l <= a.visible; l++) {
            r.push(s.iconpanel + "-" + l);
          }r = r.join(" ");var d = function d(t) {
            t.hasClass(s.vertical) || i.$pnls.children("." + s.panel).removeClass(r).filter("." + s.subopened).removeClass(s.hidden).add(t).not("." + s.vertical).slice(-a.visible).each(function (t) {
              e(this).addClass(s.iconpanel + "-" + t);
            });
          };this.bind("openPanel", d), this.bind("init", function (t) {
            d.call(i, i.$pnls.children("." + s.current)), a.hideNavbars && t.removeClass(s.hasnavbar), t.not("." + s.vertical).each(function () {
              e(this).children("." + s.subblocker).length || e(this).prepend('<a href="#' + e(this).closest("." + s.panel).attr("id") + '" class="' + s.subblocker + '" />');
            });
          });
        }
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("iconpanel subblocker");
      }, clickAnchor: function clickAnchor(e, t) {} }, e[t].defaults[n] = { add: !1, visible: 3, hideNavbars: !1 };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu navbar addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "navbars";e[t].addons[n] = { setup: function setup() {
        var i = this,
            a = this.opts[n],
            r = this.conf[n];if (o = e[t].glbl, "undefined" != typeof a) {
          a instanceof Array || (a = [a]);var l = {};e.each(a, function (o) {
            var d = a[o];"boolean" == typeof d && d && (d = {}), "object" != (typeof d === "undefined" ? "undefined" : _typeof(d)) && (d = {}), "undefined" == typeof d.content && (d.content = ["prev", "title"]), d.content instanceof Array || (d.content = [d.content]), d = e.extend(!0, {}, i.opts.navbar, d);var c = d.position,
                h = d.height;"number" != typeof h && (h = 1), h = Math.min(4, Math.max(1, h)), "bottom" != c && (c = "top"), l[c] || (l[c] = 0), l[c]++;var u = e("<div />").addClass(s.navbar + " " + s.navbar + "-" + c + " " + s.navbar + "-" + c + "-" + l[c] + " " + s.navbar + "-size-" + h);l[c] += h - 1;for (var p = 0, f = 0, v = d.content.length; v > f; f++) {
              var m = e[t].addons[n][d.content[f]] || !1;m ? p += m.call(i, u, d, r) : (m = d.content[f], m instanceof e || (m = e(d.content[f])), u.append(m));
            }p += Math.ceil(u.children().not("." + s.btn).not("." + s.title + "-prev").length / h), p > 1 && u.addClass(s.navbar + "-content-" + p), u.children("." + s.btn).length && u.addClass(s.hasbtns), u.prependTo(i.$menu);
          });for (var d in l) {
            i.$menu.addClass(s.hasnavbar + "-" + d + "-" + l[d]);
          }
        }
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("close hasbtns");
      }, clickAnchor: function clickAnchor(e, t) {} }, e[t].configuration[n] = { breadcrumbSeparator: "/" }, e[t].configuration.classNames[n] = {};var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu navbar addon breadcrumbs content
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "navbars",
        s = "breadcrumbs";e[t].addons[n][s] = function (n, s, i) {
      var a = e[t]._c,
          o = e[t]._d;a.add("breadcrumbs separator");var r = e('<span class="' + a.breadcrumbs + '" />').appendTo(n);this.bind("init", function (t) {
        t.removeClass(a.hasnavbar).each(function () {
          for (var t = [], n = e(this), s = e('<span class="' + a.breadcrumbs + '"></span>'), r = e(this).children().first(), l = !0; r && r.length;) {
            r.is("." + a.panel) || (r = r.closest("." + a.panel));var d = r.children("." + a.navbar).children("." + a.title).text();t.unshift(l ? "<span>" + d + "</span>" : '<a href="#' + r.attr("id") + '">' + d + "</a>"), l = !1, r = r.data(o.parent);
          }s.append(t.join('<span class="' + a.separator + '">' + i.breadcrumbSeparator + "</span>")).appendTo(n.children("." + a.navbar));
        });
      });var l = function l() {
        r.html(this.$pnls.children("." + a.current).children("." + a.navbar).children("." + a.breadcrumbs).html());
      };return this.bind("openPanel", l), this.bind("init", l), 0;
    };
  }(jQuery), /*	
             * jQuery mmenu navbar addon close content
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "navbars",
        s = "close";e[t].addons[n][s] = function (n, s) {
      var i = e[t]._c,
          a = e[t].glbl,
          o = e('<a class="' + i.close + " " + i.btn + '" href="#" />').appendTo(n),
          r = function r(e) {
        o.attr("href", "#" + e.attr("id"));
      };return r.call(this, a.$page), this.bind("setPage", r), -1;
    };
  }(jQuery), /*	
             * jQuery mmenu navbar addon next content
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "navbars",
        s = "next";e[t].addons[n][s] = function (s, i) {
      var a,
          o,
          r = e[t]._c,
          l = e('<a class="' + r.next + " " + r.btn + '" href="#" />').appendTo(s),
          d = function d(e) {
        e = e || this.$pnls.children("." + r.current);var t = e.find("." + this.conf.classNames[n].panelNext);a = t.attr("href"), o = t.html(), l[a ? "attr" : "removeAttr"]("href", a), l[a || o ? "removeClass" : "addClass"](r.hidden), l.html(o);
      };return this.bind("openPanel", d), this.bind("init", function () {
        d.call(this);
      }), -1;
    }, e[t].configuration.classNames[n].panelNext = "Next";
  }(jQuery), /*	
             * jQuery mmenu navbar addon prev content
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "navbars",
        s = "prev";e[t].addons[n][s] = function (s, i) {
      var a = e[t]._c,
          o = e('<a class="' + a.prev + " " + a.btn + '" href="#" />').appendTo(s);this.bind("init", function (e) {
        e.removeClass(a.hasnavbar).children("." + a.navbar).addClass(a.hidden);
      });var r,
          l,
          d = function d(e) {
        if (e = e || this.$pnls.children("." + a.current), !e.hasClass(a.vertical)) {
          var t = e.find("." + this.conf.classNames[n].panelPrev);t.length || (t = e.children("." + a.navbar).children("." + a.prev)), r = t.attr("href"), l = t.html(), o[r ? "attr" : "removeAttr"]("href", r), o[r || l ? "removeClass" : "addClass"](a.hidden), o.html(l);
        }
      };return this.bind("openPanel", d), this.bind("init", function () {
        d.call(this);
      }), -1;
    }, e[t].configuration.classNames[n].panelPrev = "Prev";
  }(jQuery), /*	
             * jQuery mmenu navbar addon searchfield content
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "navbars",
        s = "searchfield";e[t].addons[n][s] = function (n, s) {
      var i = e[t]._c,
          a = e('<div class="' + i.search + '" />').appendTo(n);return "object" != _typeof(this.opts.searchfield) && (this.opts.searchfield = {}), this.opts.searchfield.add = !0, this.opts.searchfield.addTo = a, 0;
    };
  }(jQuery), /*	
             * jQuery mmenu navbar addon title content
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "navbars",
        s = "title";e[t].addons[n][s] = function (s, i) {
      var a,
          o,
          r = e[t]._c,
          l = e('<a class="' + r.title + '" />').appendTo(s),
          d = function d(e) {
        if (e = e || this.$pnls.children("." + r.current), !e.hasClass(r.vertical)) {
          var t = e.find("." + this.conf.classNames[n].panelTitle);t.length || (t = e.children("." + r.navbar).children("." + r.title)), a = t.attr("href"), o = t.html() || i.title, l[a ? "attr" : "removeAttr"]("href", a), l[a || o ? "removeClass" : "addClass"](r.hidden), l.html(o);
        }
      };return this.bind("openPanel", d), this.bind("init", function (e) {
        d.call(this);
      }), 0;
    }, e[t].configuration.classNames[n].panelTitle = "Title";
  }(jQuery), /*	
             * jQuery mmenu screenReader addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    function t(e, t, n) {
      e.prop("aria-" + t, n)[n ? "attr" : "removeAttr"]("aria-" + t, "true");
    }function n(e) {
      return '<span class="' + a.sronly + '">' + e + "</span>";
    }var s = "mmenu",
        i = "screenReader";e[s].addons[i] = { setup: function setup() {
        var o = this.opts[i],
            r = this.conf[i];if (l = e[s].glbl, "boolean" == typeof o && (o = { aria: o, text: o }), "object" != (typeof o === "undefined" ? "undefined" : _typeof(o)) && (o = {}), o = this.opts[i] = e.extend(!0, {}, e[s].defaults[i], o), o.aria) {
          if (this.opts.offCanvas) {
            var d = function d() {
              t(this.$menu, "hidden", !1);
            },
                c = function c() {
              t(this.$menu, "hidden", !0);
            };this.bind("open", d), this.bind("close", c), c.call(this);
          }var h = function h() {
            t(this.$menu.find("." + a.hidden), "hidden", !0), t(this.$menu.find('[aria-hidden="true"]').not("." + a.hidden), "hidden", !1);
          },
              u = function u(e) {
            t(this.$pnls.children("." + a.panel).not(e).not("." + a.hidden), "hidden", !0), t(e, "hidden", !1);
          };this.bind("update", h), this.bind("openPanel", h), this.bind("openPanel", u);var p = function p(e) {
            t(e.find("." + a.prev + ", ." + a.next), "haspopup", !0);
          };this.bind("init", p), p.call(this, this.$menu.children("." + a.navbar));
        }if (o.text) {
          var f = function f(t) {
            t.children("." + a.navbar).children("." + a.prev).html(n(r.text.closeSubmenu)).end().children("." + a.next).html(n(r.text.openSubmenu)).end().children("." + a.close).html(n(r.text.closeMenu)), t.is("." + a.panel) && t.find("." + a.listview).find("." + a.next).each(function () {
              e(this).html(n(r.text[e(this).parent().is("." + a.vertical) ? "toggleSubmenu" : "openSubmenu"]));
            });
          };this.bind("init", f), f.call(this, this.$menu);
        }
      }, add: function add() {
        a = e[s]._c, o = e[s]._d, r = e[s]._e, a.add("sronly");
      }, clickAnchor: function clickAnchor(e, t) {} }, e[s].defaults[i] = { aria: !1, text: !1 }, e[s].configuration[i] = { text: { closeMenu: "Close menu", closeSubmenu: "Close submenu", openSubmenu: "Open submenu", toggleSubmenu: "Toggle submenu" } };var a, o, r, l;
  }(jQuery), /*	
             * jQuery mmenu searchfield addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    function t(e) {
      switch (e) {case 9:case 16:case 17:case 18:case 37:case 38:case 39:case 40:
          return !0;}return !1;
    }var n = "mmenu",
        s = "searchfield";e[n].addons[s] = { setup: function setup() {
        var l = this,
            d = this.opts[s],
            c = this.conf[s];r = e[n].glbl, "boolean" == typeof d && (d = { add: d }), "object" != (typeof d === "undefined" ? "undefined" : _typeof(d)) && (d = {}), "boolean" == typeof d.resultsPanel && (d.resultsPanel = { add: d.resultsPanel }), d = this.opts[s] = e.extend(!0, {}, e[n].defaults[s], d), c = this.conf[s] = e.extend(!0, {}, e[n].configuration[s], c), this.bind("close", function () {
          this.$menu.find("." + i.search).find("input").blur();
        }), this.bind("init", function (n) {
          if (d.add) {
            var r;switch (d.addTo) {case "panels":
                r = n;break;default:
                r = e(d.addTo, this.$menu);}if (r.each(function () {
              var t = e(this);if (!t.is("." + i.panel) || !t.is("." + i.vertical)) {
                if (!t.children("." + i.search).length) {
                  var n = l.__valueOrFn(c.clear, t),
                      s = l.__valueOrFn(c.form, t),
                      a = l.__valueOrFn(c.input, t),
                      r = l.__valueOrFn(c.submit, t),
                      h = e("<" + (s ? "form" : "div") + ' class="' + i.search + '" />'),
                      u = e('<input placeholder="' + d.placeholder + '" type="text" autocomplete="off" />');h.append(u);var p;if (a) for (p in a) {
                    u.attr(p, a[p]);
                  }if (n && e('<a class="' + i.btn + " " + i.clear + '" href="#" />').appendTo(h).on(o.click + "-searchfield", function (e) {
                    e.preventDefault(), u.val("").trigger(o.keyup + "-searchfield");
                  }), s) {
                    for (p in s) {
                      h.attr(p, s[p]);
                    }r && !n && e('<a class="' + i.btn + " " + i.next + '" href="#" />').appendTo(h).on(o.click + "-searchfield", function (e) {
                      e.preventDefault(), h.submit();
                    });
                  }t.hasClass(i.search) ? t.replaceWith(h) : t.prepend(h).addClass(i.hassearch);
                }if (d.noResults) {
                  var f = t.closest("." + i.panel).length;if (f || (t = l.$pnls.children("." + i.panel).first()), !t.children("." + i.noresultsmsg).length) {
                    var v = t.children("." + i.listview).first();e('<div class="' + i.noresultsmsg + " " + i.hidden + '" />').append(d.noResults)[v.length ? "insertAfter" : "prependTo"](v.length ? v : t);
                  }
                }
              }
            }), d.search) {
              if (d.resultsPanel.add) {
                d.showSubPanels = !1;var h = this.$pnls.children("." + i.resultspanel);h.length || (h = e('<div class="' + i.panel + " " + i.resultspanel + " " + i.hidden + '" />').appendTo(this.$pnls).append('<div class="' + i.navbar + " " + i.hidden + '"><a class="' + i.title + '">' + d.resultsPanel.title + "</a></div>").append('<ul class="' + i.listview + '" />').append(this.$pnls.find("." + i.noresultsmsg).first().clone()), this.init(h));
              }e("." + i.search, this.$menu).each(function () {
                var n,
                    r,
                    c = e(this),
                    u = c.closest("." + i.panel).length;u ? (n = c.closest("." + i.panel), r = n) : (n = e("." + i.panel, l.$menu), r = l.$menu), d.resultsPanel.add && (n = n.not(h));var p = c.children("input"),
                    f = l.__findAddBack(n, "." + i.listview).children("li"),
                    v = f.filter("." + i.divider),
                    m = l.__filterListItems(f),
                    g = "a",
                    b = g + ", span",
                    _ = "",
                    C = function C() {
                  var t = p.val().toLowerCase();if (t != _) {
                    if (_ = t, d.resultsPanel.add && h.children("." + i.listview).empty(), n.scrollTop(0), m.add(v).addClass(i.hidden).find("." + i.fullsubopensearch).removeClass(i.fullsubopen + " " + i.fullsubopensearch), m.each(function () {
                      var t = e(this),
                          n = g;(d.showTextItems || d.showSubPanels && t.find("." + i.next)) && (n = b);var s = t.data(a.searchtext) || t.children(n).text();s.toLowerCase().indexOf(_) > -1 && t.add(t.prevAll("." + i.divider).first()).removeClass(i.hidden);
                    }), d.showSubPanels && n.each(function (t) {
                      var n = e(this);l.__filterListItems(n.find("." + i.listview).children()).each(function () {
                        var t = e(this),
                            n = t.data(a.sub);t.removeClass(i.nosubresults), n && n.find("." + i.listview).children().removeClass(i.hidden);
                      });
                    }), d.resultsPanel.add) {
                      if ("" === _) this.closeAllPanels(), this.openPanel(this.$pnls.children("." + i.subopened).last());else {
                        var s = e();n.each(function () {
                          var t = l.__filterListItems(e(this).find("." + i.listview).children()).not("." + i.hidden).clone(!0);t.length && (d.resultsPanel.dividers && (s = s.add('<li class="' + i.divider + '">' + e(this).children("." + i.navbar).text() + "</li>")), s = s.add(t));
                        }), s.find("." + i.next).remove(), h.children("." + i.listview).append(s), this.openPanel(h);
                      }
                    } else e(n.get().reverse()).each(function (t) {
                      var n = e(this),
                          s = n.data(a.parent);s && (l.__filterListItems(n.find("." + i.listview).children()).length ? (s.hasClass(i.hidden) && s.children("." + i.next).not("." + i.fullsubopen).addClass(i.fullsubopen).addClass(i.fullsubopensearch), s.removeClass(i.hidden).removeClass(i.nosubresults).prevAll("." + i.divider).first().removeClass(i.hidden)) : u || (n.hasClass(i.opened) && setTimeout(function () {
                        l.openPanel(s.closest("." + i.panel));
                      }, (t + 1) * (1.5 * l.conf.openingInterval)), s.addClass(i.nosubresults)));
                    });r.find("." + i.noresultsmsg)[m.not("." + i.hidden).length ? "addClass" : "removeClass"](i.hidden), this.update();
                  }
                };p.off(o.keyup + "-" + s + " " + o.change + "-" + s).on(o.keyup + "-" + s, function (e) {
                  t(e.keyCode) || C.call(l);
                }).on(o.change + "-" + s, function (e) {
                  C.call(l);
                });var $ = c.children("." + i.btn);$.length && p.on(o.keyup + "-" + s, function (e) {
                  $[p.val().length ? "removeClass" : "addClass"](i.hidden);
                }), p.trigger(o.keyup + "-" + s);
              });
            }
          }
        });
      }, add: function add() {
        i = e[n]._c, a = e[n]._d, o = e[n]._e, i.add("clear search hassearch resultspanel noresultsmsg noresults nosubresults fullsubopensearch"), a.add("searchtext"), o.add("change keyup");
      }, clickAnchor: function clickAnchor(e, t) {} }, e[n].defaults[s] = { add: !1, addTo: "panels", placeholder: "Search", noResults: "No results found.", resultsPanel: { add: !1, dividers: !0, title: "Search results" }, search: !0, showTextItems: !1, showSubPanels: !0 }, e[n].configuration[s] = { clear: !1, form: !1, input: !1, submit: !1 };var i, a, o, r;
  }(jQuery), /*	
             * jQuery mmenu sectionIndexer addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "sectionIndexer";e[t].addons[n] = { setup: function setup() {
        var i = this,
            r = this.opts[n];this.conf[n];o = e[t].glbl, "boolean" == typeof r && (r = { add: r }), "object" != (typeof r === "undefined" ? "undefined" : _typeof(r)) && (r = {}), r = this.opts[n] = e.extend(!0, {}, e[t].defaults[n], r), this.bind("init", function (t) {
          if (r.add) {
            var n;switch (r.addTo) {case "panels":
                n = t;break;default:
                n = e(r.addTo, this.$menu).filter("." + s.panel);}n.find("." + s.divider).closest("." + s.panel).addClass(s.hasindexer);
          }if (!this.$indexer && this.$pnls.children("." + s.hasindexer).length) {
            this.$indexer = e('<div class="' + s.indexer + '" />').prependTo(this.$pnls).append('<a href="#a">a</a><a href="#b">b</a><a href="#c">c</a><a href="#d">d</a><a href="#e">e</a><a href="#f">f</a><a href="#g">g</a><a href="#h">h</a><a href="#i">i</a><a href="#j">j</a><a href="#k">k</a><a href="#l">l</a><a href="#m">m</a><a href="#n">n</a><a href="#o">o</a><a href="#p">p</a><a href="#q">q</a><a href="#r">r</a><a href="#s">s</a><a href="#t">t</a><a href="#u">u</a><a href="#v">v</a><a href="#w">w</a><a href="#x">x</a><a href="#y">y</a><a href="#z">z</a>'), this.$indexer.children().on(a.mouseover + "-sectionindexer " + s.touchstart + "-sectionindexer", function (t) {
              var n = e(this).attr("href").slice(1),
                  a = i.$pnls.children("." + s.current),
                  o = a.find("." + s.listview),
                  r = !1,
                  l = a.scrollTop();a.scrollTop(0), o.children("." + s.divider).not("." + s.hidden).each(function () {
                r === !1 && n == e(this).text().slice(0, 1).toLowerCase() && (r = e(this).position().top);
              }), a.scrollTop(r !== !1 ? r : l);
            });var o = function o(e) {
              i.$menu[(e.hasClass(s.hasindexer) ? "add" : "remove") + "Class"](s.hasindexer);
            };this.bind("openPanel", o), o.call(this, this.$pnls.children("." + s.current));
          }
        });
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("indexer hasindexer"), a.add("mouseover touchstart");
      }, clickAnchor: function clickAnchor(e, t) {
        return e.parent().is("." + s.indexer) ? !0 : void 0;
      } }, e[t].defaults[n] = { add: !1, addTo: "panels" };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu setSelected addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "setSelected";e[t].addons[n] = { setup: function setup() {
        var a = this.opts[n];this.conf[n];if (o = e[t].glbl, "boolean" == typeof a && (a = { hover: a, parent: a }), "object" != (typeof a === "undefined" ? "undefined" : _typeof(a)) && (a = {}), a = this.opts[n] = e.extend(!0, {}, e[t].defaults[n], a), a.current || this.bind("init", function (e) {
          e.find("." + s.listview).children("." + s.selected).removeClass(s.selected);
        }), a.hover && this.$menu.addClass(s.hoverselected), a.parent) {
          this.$menu.addClass(s.parentselected);var r = function r(e) {
            this.$pnls.find("." + s.listview).find("." + s.next).removeClass(s.selected);for (var t = e.data(i.parent); t && t.length;) {
              t = t.children("." + s.next).addClass(s.selected).closest("." + s.panel).data(i.parent);
            }
          };this.bind("openedPanel", r), this.bind("init", function (e) {
            r.call(this, this.$pnls.children("." + s.current));
          });
        }
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("hoverselected parentselected");
      }, clickAnchor: function clickAnchor(e, t) {} }, e[t].defaults[n] = { current: !0, hover: !1, parent: !1 };var s, i, a, o;
  }(jQuery), /*	
             * jQuery mmenu toggles addon
             * mmenu.frebsite.nl
             *
             * Copyright (c) Fred Heusschen
             */
  function (e) {
    var t = "mmenu",
        n = "toggles";e[t].addons[n] = { setup: function setup() {
        var i = this;this.opts[n], this.conf[n];o = e[t].glbl, this.bind("init", function (t) {
          this.__refactorClass(e("input", t), this.conf.classNames[n].toggle, "toggle"), this.__refactorClass(e("input", t), this.conf.classNames[n].check, "check"), e("input." + s.toggle + ", input." + s.check, t).each(function () {
            var t = e(this),
                n = t.closest("li"),
                a = t.hasClass(s.toggle) ? "toggle" : "check",
                o = t.attr("id") || i.__getUniqueId();n.children('label[for="' + o + '"]').length || (t.attr("id", o), n.prepend(t), e('<label for="' + o + '" class="' + s[a] + '"></label>').insertBefore(n.children("a, span").last()));
          });
        });
      }, add: function add() {
        s = e[t]._c, i = e[t]._d, a = e[t]._e, s.add("toggle check");
      }, clickAnchor: function clickAnchor(e, t) {} }, e[t].configuration.classNames[n] = { toggle: "Toggle", check: "Check" };var s, i, a, o;
  }(jQuery);
  ;

  var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;
  ;

  var _temp2 = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;

  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(55)))

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global, jQuery) {/*** IMPORTS FROM imports-loader ***/
  var window = global;

  "use strict";

  /* globals jQuery */

  (function ($) {
    // Selector to select only not already processed elements
    $.expr[":"].notmdproc = function (obj) {
      if ($(obj).data("mdproc")) {
        return false;
      } else {
        return true;
      }
    };

    function _isChar(evt) {
      if (typeof evt.which == "undefined") {
        return true;
      } else if (typeof evt.which == "number" && evt.which > 0) {
        return !evt.ctrlKey && !evt.metaKey && !evt.altKey && evt.which != 8 // backspace
        && evt.which != 9 // tab
        && evt.which != 13 // enter
        && evt.which != 16 // shift
        && evt.which != 17 // ctrl
        && evt.which != 20 // caps lock
        && evt.which != 27 // escape
        ;
      }
      return false;
    }

    function _addFormGroupFocus(element) {
      var $element = $(element);
      if (!$element.prop('disabled')) {
        // this is showing as undefined on chrome but works fine on firefox??
        $element.closest(".form-group").addClass("is-focused");
      }
    }

    function _toggleTypeFocus($input) {
      $input.closest('label').hover(function () {
        var $i = $(this).find('input');
        if (!$i.prop('disabled')) {
          // hack because the _addFormGroupFocus() wasn't identifying the property on chrome
          _addFormGroupFocus($i); // need to find the input so we can check disablement
        }
      }, function () {
        _removeFormGroupFocus($(this).find('input'));
      });
    }

    function _toggleRadioFocus($input) {

      $input.closest('.radio').hover(function () {
        var $i = $(this).find('input');
        if (!$i.prop('disabled')) {
          // hack because the _addFormGroupFocus() wasn't identifying the property on chrome
          _addFormGroupFocus($i); // need to find the input so we can check disablement
        }
      }, function () {
        _removeFormGroupFocus($(this).find('input'));
      });
    }

    function _removeFormGroupFocus(element) {
      $(element).closest(".form-group").removeClass("is-focused"); // remove class from form-group
    }

    $.material = {
      "options": {
        // These options set what will be started by $.material.init()
        //"validate": true,
        //"input": true,
        "ripples": true,
        "checkbox": true,
        "togglebutton": true,
        "radio": true,
        "arrive": true,
        "autofill": false,

        "withRipples": [".btn-wave:not(.btn-wave-link)",
        //".card-image",
        //".navbar a:not(.withoutripple)",
        //".dropdown-menu a",
        //".nav-tabs a:not(.withoutripple)",
        ".withripple", ".pagination li:not(.active):not(.disabled) a:not(.withoutripple)"].join(","),
        //"inputElements": "input.form-control, textarea.form-control, select.form-control",
        "checkboxElements": ".checkbox > label > input[type=checkbox]",
        "togglebuttonElements": ".togglebutton > label > input[type=checkbox]",
        "radioElements": ".radio > label"
      },
      "checkbox": function checkbox(selector) {
        // Add fake-checkbox to material checkboxes
        var $input = $(selector ? selector : this.options.checkboxElements).filter(":notmdproc").data("mdproc", true).after("<span class='checkbox-material'><span class='check'></span></span>");

        _toggleTypeFocus($input);
      },
      "togglebutton": function togglebutton(selector) {
        // Add fake-checkbox to material checkboxes
        var $input = $(selector ? selector : this.options.togglebuttonElements).filter(":notmdproc").data("mdproc", true).after("<span class='toggle'></span>");

        _toggleTypeFocus($input);
      },
      "radio": function radio(selector) {
        // Add fake-radio to material radios
        var $input = $(selector ? selector : this.options.radioElements).filter(":notmdproc").data("mdproc", true).after("<span class='circle'></span><span class='check'></span>");

        _toggleRadioFocus($input);
      },
      //"input": function (selector) {
      //  $((selector) ? selector : this.options.inputElements)
      //    .filter(":notmdproc")
      //    .data("mdproc", true)
      //    .each(function () {
      //      var $input = $(this);
      //
      //      // Requires form-group standard markup (will add it if necessary)
      //      var $formGroup = $input.closest(".form-group"); // note that form-group may be grandparent in the case of an input-group
      //      if ($formGroup.length === 0) {
      //        $input.wrap("<div class='form-group'></div>");
      //        $formGroup = $input.closest(".form-group"); // find node after attached (otherwise additional attachments don't work)
      //      }
      //
      //      // Legacy - Add hint label if using the old shorthand data-hint attribute on the input
      //      if ($input.attr("data-hint")) {
      //        $input.after("<p class='help-block'>" + $input.attr("data-hint") + "</p>");
      //        $input.removeAttr("data-hint");
      //      }
      //
      //      // Legacy - Change input-sm/lg to form-group-sm/lg instead (preferred standard and simpler css/less variants)
      //      var legacySizes = {
      //        "input-lg": "form-group-lg",
      //        "input-sm": "form-group-sm"
      //      };
      //      $.each(legacySizes, function (legacySize, standardSize) {
      //        if ($input.hasClass(legacySize)) {
      //          $input.removeClass(legacySize);
      //          $formGroup.addClass(standardSize);
      //        }
      //      });
      //
      //      // Legacy - Add label-floating if using old shorthand <input class="floating-label" placeholder="foo">
      //      if ($input.hasClass("floating-label")) {
      //        var placeholder = $input.attr("placeholder");
      //        $input.attr("placeholder", null).removeClass("floating-label");
      //        var id = $input.attr("id");
      //        var forAttribute = "";
      //        if (id) {
      //          forAttribute = "for='" + id + "'";
      //        }
      //        $formGroup.addClass("label-floating");
      //        $input.after("<label " + forAttribute + "class='control-label'>" + placeholder + "</label>");
      //      }
      //
      //      // Set as empty if is empty (damn I must improve this...)
      //      if ($input.val() === null || $input.val() == "undefined" || $input.val() === "") {
      //        $formGroup.addClass("is-empty");
      //      }
      //
      //      // Add at the end of the form-group
      //      $formGroup.append("<span class='material-input'></span>");
      //
      //      // Support for file input
      //      if ($formGroup.find("input[type=file]").length > 0) {
      //        $formGroup.addClass("is-fileinput");
      //      }
      //    });
      //},
      "attachInputEventHandlers": function attachInputEventHandlers() {
        var validate = this.options.validate;

        $(document).on("change", ".checkbox input[type=checkbox]", function () {
          $(this).blur();
        }).on("keydown paste", ".form-control", function (e) {
          if (_isChar(e)) {
            $(this).closest(".form-group").removeClass("is-empty");
          }
        }).on("keyup change", ".form-control", function () {
          var $input = $(this);
          var $formGroup = $input.closest(".form-group");
          var isValid = typeof $input[0].checkValidity === "undefined" || $input[0].checkValidity();

          if ($input.val() === "") {
            $formGroup.addClass("is-empty");
          } else {
            $formGroup.removeClass("is-empty");
          }

          // Validation events do not bubble, so they must be attached directly to the input: http://jsfiddle.net/PEpRM/1/
          //  Further, even the bind method is being caught, but since we are already calling #checkValidity here, just alter
          //  the form-group on change.
          //
          // NOTE: I'm not sure we should be intervening regarding validation, this seems better as a README and snippet of code.
          //        BUT, I've left it here for backwards compatibility.
          if (validate) {
            if (isValid) {
              $formGroup.removeClass("has-error");
            } else {
              $formGroup.addClass("has-error");
            }
          }
        }).on("focus", ".form-control, .form-group.is-fileinput", function () {
          _addFormGroupFocus(this);
        }).on("blur", ".form-control, .form-group.is-fileinput", function () {
          _removeFormGroupFocus(this);
        })
        // make sure empty is added back when there is a programmatic value change.
        //  NOTE: programmatic changing of value using $.val() must trigger the change event i.e. $.val('x').trigger('change')
        .on("change", ".form-group input", function () {
          var $input = $(this);
          if ($input.attr("type") == "file") {
            return;
          }

          var $formGroup = $input.closest(".form-group");
          var value = $input.val();
          if (value) {
            $formGroup.removeClass("is-empty");
          } else {
            $formGroup.addClass("is-empty");
          }
        })
        // set the fileinput readonly field with the name of the file
        .on("change", ".form-group.is-fileinput input[type='file']", function () {
          var $input = $(this);
          var $formGroup = $input.closest(".form-group");
          var value = "";
          $.each(this.files, function (i, file) {
            value += file.name + ", ";
          });
          value = value.substring(0, value.length - 2);
          if (value) {
            $formGroup.removeClass("is-empty");
          } else {
            $formGroup.addClass("is-empty");
          }
          $formGroup.find("input.form-control[readonly]").val(value);
        });
      },
      "ripples": function ripples(selector) {
        $(selector ? selector : this.options.withRipples).ripples();
      },
      //"autofill": function () {
      //  // This part of code will detect autofill when the page is loading (username and password inputs for example)
      //  var loading = setInterval(function () {
      //    $("input[type!=checkbox]").each(function () {
      //      var $this = $(this);
      //      if ($this.val() && $this.val() !== $this.attr("value")) {
      //        $this.trigger("change");
      //      }
      //    });
      //  }, 100);
      //
      //  // After 10 seconds we are quite sure all the needed inputs are autofilled then we can stop checking them
      //  setTimeout(function () {
      //    clearInterval(loading);
      //  }, 10000);
      //},
      //"attachAutofillEventHandlers": function () {
      //  // Listen on inputs of the focused form (because user can select from the autofill dropdown only when the input has focus)
      //  var focused;
      //  $(document)
      //    .on("focus", "input", function () {
      //      var $inputs = $(this).parents("form").find("input").not("[type=file]");
      //      focused = setInterval(function () {
      //        $inputs.each(function () {
      //          var $this = $(this);
      //          if ($this.val() !== $this.attr("value")) {
      //            $this.trigger("change");
      //          }
      //        });
      //      }, 100);
      //    })
      //    .on("blur", ".form-group input", function () {
      //      clearInterval(focused);
      //    });
      //},
      "init": function init(options) {
        this.options = $.extend({}, this.options, options);
        var $document = $(document);

        if ($.fn.ripples && this.options.ripples) {
          this.ripples();
        }
        if (this.options.input) {
          this.input();
          this.attachInputEventHandlers();
        }
        if (this.options.checkbox) {
          this.checkbox();
        }
        if (this.options.togglebutton) {
          this.togglebutton();
        }
        if (this.options.radio) {
          this.radio();
        }
        //if (this.options.autofill) {
        //  this.autofill();
        //  this.attachAutofillEventHandlers();
        //}

        if (document.arrive && this.options.arrive) {
          if ($.fn.ripples && this.options.ripples) {
            $document.arrive(this.options.withRipples, function () {
              $.material.ripples($(this));
            });
          }
          //if (this.options.input) {
          //  $document.arrive(this.options.inputElements, function () {
          //    $.material.input($(this));
          //  });
          //}
          if (this.options.checkbox) {
            $document.arrive(this.options.checkboxElements, function () {
              $.material.checkbox($(this));
            });
          }
          if (this.options.radio) {
            $document.arrive(this.options.radioElements, function () {
              $.material.radio($(this));
            });
          }
          if (this.options.togglebutton) {
            $document.arrive(this.options.togglebuttonElements, function () {
              $.material.togglebutton($(this));
            });
          }
        }
      }
    };
  })(jQuery);
  ;

  var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;
  ;

  var _temp2 = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;

  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(55)))

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global, jQuery) {/*** IMPORTS FROM imports-loader ***/
  var window = global;

  "use strict";

  !function (a, b, c, d) {
    "use strict";
    function e(b, c) {
      g = this, this.element = a(b), this.options = a.extend({}, h, c), this._defaults = h, this._name = f, this.init();
    }var f = "ripples",
        g = null,
        h = {};e.prototype.init = function () {
      var c = this.element;c.on("mousedown touchstart", function (d) {
        if (!g.isTouch() || "mousedown" !== d.type) {
          c.find(".ripple-container").length || c.append('<div class="ripple-container"></div>');var e = c.children(".ripple-container"),
              f = g.getRelY(e, d),
              h = g.getRelX(e, d);if (f || h) {
            var i = g.getRipplesColor(c),
                j = a("<div></div>");j.addClass("ripple").css({ left: h, top: f, "background-color": i }), e.append(j), function () {
              return b.getComputedStyle(j[0]).opacity;
            }(), g.rippleOn(c, j), setTimeout(function () {
              g.rippleEnd(j);
            }, 500), c.on("mouseup mouseleave touchend", function () {
              j.data("mousedown", "off"), "off" === j.data("animating") && g.rippleOut(j);
            });
          }
        }
      });
    }, e.prototype.getNewSize = function (a, b) {
      return Math.max(a.outerWidth(), a.outerHeight()) / b.outerWidth() * 2.5;
    }, e.prototype.getRelX = function (a, b) {
      var c = a.offset();return g.isTouch() ? (b = b.originalEvent, 1 === b.touches.length ? b.touches[0].pageX - c.left : !1) : b.pageX - c.left;
    }, e.prototype.getRelY = function (a, b) {
      var c = a.offset();return g.isTouch() ? (b = b.originalEvent, 1 === b.touches.length ? b.touches[0].pageY - c.top : !1) : b.pageY - c.top;
    }, e.prototype.getRipplesColor = function (a) {
      var c = a.data("ripple-color") ? a.data("ripple-color") : b.getComputedStyle(a[0]).color;return c;
    }, e.prototype.hasTransitionSupport = function () {
      var a = c.body || c.documentElement,
          b = a.style,
          e = b.transition !== d || b.WebkitTransition !== d || b.MozTransition !== d || b.MsTransition !== d || b.OTransition !== d;return e;
    }, e.prototype.isTouch = function () {
      return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    }, e.prototype.rippleEnd = function (a) {
      a.data("animating", "off"), "off" === a.data("mousedown") && g.rippleOut(a);
    }, e.prototype.rippleOut = function (a) {
      a.off(), g.hasTransitionSupport() ? a.addClass("ripple-out") : a.animate({ opacity: 0 }, 100, function () {
        a.trigger("transitionend");
      }), a.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
        a.remove();
      });
    }, e.prototype.rippleOn = function (a, b) {
      var c = g.getNewSize(a, b);g.hasTransitionSupport() ? b.css({ "-ms-transform": "scale(" + c + ")", "-moz-transform": "scale(" + c + ")", "-webkit-transform": "scale(" + c + ")", transform: "scale(" + c + ")" }).addClass("ripple-on").data("animating", "on").data("mousedown", "on") : b.animate({ width: 2 * Math.max(a.outerWidth(), a.outerHeight()), height: 2 * Math.max(a.outerWidth(), a.outerHeight()), "margin-left": -1 * Math.max(a.outerWidth(), a.outerHeight()), "margin-top": -1 * Math.max(a.outerWidth(), a.outerHeight()), opacity: .2 }, 500, function () {
        b.trigger("transitionend");
      });
    }, a.fn.ripples = function (b) {
      return this.each(function () {
        a.data(this, "plugin_" + f) || a.data(this, "plugin_" + f, new e(this, b));
      });
    };
  }(jQuery, window, document);
  //# sourceMappingURL=ripples.min.js.map

  ;

  var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;
  ;

  var _temp2 = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;

  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(55)))

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

  var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global, jQuery) {/*** IMPORTS FROM imports-loader ***/
  var window = global;

  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

  (function ($) {
    'use strict';

    var default_options = {
      i18n: {
        ru: { // Russian
          months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          dayOfWeek: ["Вск", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
        },
        en: { // English
          months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          dayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        },
        de: { // German
          months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
          dayOfWeek: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
        },
        nl: { // Dutch
          months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
          dayOfWeek: ["zo", "ma", "di", "wo", "do", "vr", "za"]
        },
        tr: { // Turkish
          months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
          dayOfWeek: ["Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts"]
        },
        fr: { //French
          months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
          dayOfWeek: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
        },
        es: { // Spanish
          months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
          dayOfWeek: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
        },
        th: { // Thai
          months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
          dayOfWeek: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']
        },
        pl: { // Polish
          months: ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"],
          dayOfWeek: ["nd", "pn", "wt", "śr", "cz", "pt", "sb"]
        },
        pt: { // Portuguese
          months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
          dayOfWeek: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
        },
        ch: { // Simplified Chinese
          months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          dayOfWeek: ["日", "一", "二", "三", "四", "五", "六"]
        },
        se: { // Swedish
          months: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
          dayOfWeek: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"]
        },
        kr: { // Korean
          months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
          dayOfWeek: ["일", "월", "화", "수", "목", "금", "토"]
        },
        it: { // Italian
          months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
          dayOfWeek: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]
        }
      },
      value: '',
      lang: 'en',
      format: 'Y-m-d H:i:s',
      formatTime: 'H:i:s',
      formatDate: 'Y-m-d',
      step: 60,
      closeOnDateSelect: 0,
      closeOnWithoutClick: true,
      timepicker: true,
      datepicker: true,
      minDate: false,
      maxDate: false,
      minTime: false,
      maxTime: false,
      allowTimes: [],
      opened: false,
      inline: false,
      onSelectDate: function onSelectDate() {},
      onSelectTime: function onSelectTime() {},
      onChangeMonth: function onChangeMonth() {},
      onChangeDateTime: function onChangeDateTime() {},
      onShow: function onShow() {},
      onClose: function onClose() {},
      onGenerate: function onGenerate() {},
      withoutCopyright: true,
      inverseButton: false,
      hours12: false,
      next: 'xdsoft_next',
      prev: 'xdsoft_prev',
      dayOfWeekStart: 0,
      timeHeightInTimePicker: 25,
      timepickerScrollbar: true,
      todayButton: true, // 2.1.0
      defaultSelect: true, // 2.1.0
      scrollMonth: true,
      scrollTime: true,
      scrollInput: true,
      mask: false,
      validateOnBlur: true,
      allowBlank: false,
      yearStart: 1950,
      yearEnd: 2050,
      style: '',
      id: '',
      roundTime: 'round', // ceil, floor
      className: '',
      weekends: [],
      yearOffset: 0
    };
    // fix for ie8
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function (obj, start) {
        for (var i = start || 0, j = this.length; i < j; i++) {
          if (this[i] === obj) {
            return i;
          }
        }
        return -1;
      };
    };
    $.fn.xdsoftScroller = function (_percent) {
      return this.each(function () {
        var timeboxparent = $(this);
        if (!$(this).hasClass('xdsoft_scroller_box')) {
          var pointerEventToXY = function pointerEventToXY(e) {
            var out = { x: 0, y: 0 };
            if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
              var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
              out.x = touch.pageX;
              out.y = touch.pageY;
            } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
              out.x = e.pageX;
              out.y = e.pageY;
            }
            return out;
          },
              move = 0,
              timebox = timeboxparent.children().eq(0),
              parentHeight = timeboxparent[0].clientHeight,
              height = timebox[0].offsetHeight,
              scrollbar = $('<div class="xdsoft_scrollbar"></div>'),
              scroller = $('<div class="xdsoft_scroller"></div>'),
              maximumOffset = 100,
              start = false;

          scrollbar.append(scroller);

          timeboxparent.addClass('xdsoft_scroller_box').append(scrollbar);
          scroller.on('mousedown.xdsoft_scroller', function (event) {
            if (!parentHeight) timeboxparent.trigger('resize_scroll.xdsoft_scroller', [_percent]);
            var pageY = event.pageY,
                top = parseInt(scroller.css('margin-top')),
                h1 = scrollbar[0].offsetHeight;
            $(document.body).addClass('xdsoft_noselect');
            $([document.body, window]).on('mouseup.xdsoft_scroller', function arguments_callee() {
              $([document.body, window]).off('mouseup.xdsoft_scroller', arguments_callee).off('mousemove.xdsoft_scroller', move).removeClass('xdsoft_noselect');
            });
            $(document.body).on('mousemove.xdsoft_scroller', move = function move(event) {
              var offset = event.pageY - pageY + top;
              if (offset < 0) offset = 0;
              if (offset + scroller[0].offsetHeight > h1) offset = h1 - scroller[0].offsetHeight;
              timeboxparent.trigger('scroll_element.xdsoft_scroller', [maximumOffset ? offset / maximumOffset : 0]);
            });
          });

          timeboxparent.on('scroll_element.xdsoft_scroller', function (event, percent) {
            if (!parentHeight) timeboxparent.trigger('resize_scroll.xdsoft_scroller', [percent, true]);
            percent = percent > 1 ? 1 : percent < 0 || isNaN(percent) ? 0 : percent;
            scroller.css('margin-top', maximumOffset * percent);
            timebox.css('marginTop', -parseInt((height - parentHeight) * percent));
          }).on('resize_scroll.xdsoft_scroller', function (event, _percent, noTriggerScroll) {
            parentHeight = timeboxparent[0].clientHeight;
            height = timebox[0].offsetHeight;
            var percent = parentHeight / height,
                sh = percent * scrollbar[0].offsetHeight;
            if (percent > 1) scroller.hide();else {
              scroller.show();
              scroller.css('height', parseInt(sh > 10 ? sh : 10));
              maximumOffset = scrollbar[0].offsetHeight - scroller[0].offsetHeight;
              if (noTriggerScroll !== true) timeboxparent.trigger('scroll_element.xdsoft_scroller', [_percent ? _percent : Math.abs(parseInt(timebox.css('marginTop'))) / (height - parentHeight)]);
            }
          });
          timeboxparent.mousewheel && timeboxparent.mousewheel(function (event, delta, deltaX, deltaY) {
            var top = Math.abs(parseInt(timebox.css('marginTop')));
            timeboxparent.trigger('scroll_element.xdsoft_scroller', [(top - delta * 20) / (height - parentHeight)]);
            event.stopPropagation();
            return false;
          });
          timeboxparent.on('touchstart', function (event) {
            start = pointerEventToXY(event);
          });
          timeboxparent.on('touchmove', function (event) {
            if (start) {
              var coord = pointerEventToXY(event),
                  top = Math.abs(parseInt(timebox.css('marginTop')));
              timeboxparent.trigger('scroll_element.xdsoft_scroller', [(top - (coord.y - start.y)) / (height - parentHeight)]);
              event.stopPropagation();
              event.preventDefault();
            };
          });
          timeboxparent.on('touchend touchcancel', function (event) {
            start = false;
          });
        }
        timeboxparent.trigger('resize_scroll.xdsoft_scroller', [_percent]);
      });
    };
    $.fn.datetimepicker = function (opt) {
      var KEY0 = 48,
          KEY9 = 57,
          _KEY0 = 96,
          _KEY9 = 105,
          CTRLKEY = 17,
          DEL = 46,
          ENTER = 13,
          ESC = 27,
          BACKSPACE = 8,
          ARROWLEFT = 37,
          ARROWUP = 38,
          ARROWRIGHT = 39,
          ARROWDOWN = 40,
          TAB = 9,
          F5 = 116,
          AKEY = 65,
          CKEY = 67,
          VKEY = 86,
          ZKEY = 90,
          YKEY = 89,
          ctrlDown = false,
          options = $.isPlainObject(opt) || !opt ? $.extend(true, {}, default_options, opt) : $.extend({}, default_options),
          createDateTimePicker = function createDateTimePicker(input) {
        var datetimepicker = $('<div ' + (options.id ? 'id="' + options.id + '"' : '') + ' ' + (options.style ? 'style="' + options.style + '"' : '') + ' class="xdsoft_datetimepicker xdsoft_noselect ' + options.className + '"></div>'),
            xdsoft_copyright = $('<div class="xdsoft_copyright"><a target="_blank" href="http://xdsoft.net/jqplugins/datetimepicker/">xdsoft.net</a></div>'),
            datepicker = $('<div class="xdsoft_datepicker active"></div>'),
            mounth_picker = $('<div class="xdsoft_mounthpicker clearfix"><a class="ui-datepicker-prev ui-corner-all xdsoft_prev" data-handler="prev" data-event="click" title="Prev"><span class="ui-icon ui-icon-circle-triangle-w">Prev</span></a><div class="xdsoft_label xdsoft_month"><span></span></div><div class="xdsoft_label xdsoft_year"><span></span></div><a class="ui-datepicker-next ui-corner-all xdsoft_next" data-handler="next" data-event="click" title="Next"><span class="ui-icon ui-icon-circle-triangle-e">Next</span></a></div>'),
            calendar = $('<div class="xdsoft_calendar"></div>'),
            timepicker = $('<div class="xdsoft_timepicker active"><button type="button" class="xdsoft_prev"><i class="fa fa-caret-up"></i></button><div class="xdsoft_time_box"></div><button type="button" class="xdsoft_next"><i class="fa fa-caret-down"></i></button></div>'),
            timeboxparent = timepicker.find('.xdsoft_time_box').eq(0),
            timebox = $('<div class="xdsoft_time_variant"></div>'),
            scrollbar = $('<div class="xdsoft_scrollbar"></div>'),
            scroller = $('<div class="xdsoft_scroller"></div>'),
            monthselect = $('<div class="xdsoft_select xdsoft_monthselect"><div></div></div>'),
            yearselect = $('<div class="xdsoft_select xdsoft_yearselect"><div></div></div>');

        //constructor lego
        mounth_picker.find('.xdsoft_month span').after(monthselect);
        mounth_picker.find('.xdsoft_year span').after(yearselect);

        mounth_picker.find('.xdsoft_month,.xdsoft_year').on('mousedown.xdsoft', function (event) {
          mounth_picker.find('.xdsoft_select').hide();
          var select = $(this).find('.xdsoft_select').eq(0),
              val = 0,
              top = 0;

          if (_xdsoft_datetime.currentTime) val = _xdsoft_datetime.currentTime[$(this).hasClass('xdsoft_month') ? 'getMonth' : 'getFullYear']();

          select.show();
          for (var items = select.find('div.xdsoft_option'), i = 0; i < items.length; i++) {
            if (items.eq(i).data('value') == val) {
              break;
            } else top += items[0].offsetHeight;
          }

          select.xdsoftScroller(top / (select.children()[0].offsetHeight - select[0].clientHeight));
          event.stopPropagation();
          return false;
        });

        mounth_picker.find('.xdsoft_select').xdsoftScroller().on('mousedown.xdsoft', function (event) {
          event.stopPropagation();
          event.preventDefault();
        }).on('mousedown.xdsoft', '.xdsoft_option', function (event) {
          if (_xdsoft_datetime && _xdsoft_datetime.currentTime) _xdsoft_datetime.currentTime[$(this).parent().parent().hasClass('xdsoft_monthselect') ? 'setMonth' : 'setFullYear']($(this).data('value'));
          $(this).parent().parent().hide();
          datetimepicker.trigger('xchange.xdsoft');
          options.onChangeMonth && options.onChangeMonth.call && options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
        });

        // set options
        datetimepicker.setOptions = function (_options) {
          options = $.extend(true, {}, options, _options);
          if ((options.open || options.opened) && !options.inline) {
            input.trigger('open.xdsoft');
          }

          if (options.inline) {
            datetimepicker.addClass('xdsoft_inline');
            input.after(datetimepicker).hide();
            datetimepicker.trigger('afterOpen.xdsoft');
          }

          if (options.inverseButton) {
            options.next = 'xdsoft_prev';
            options.prev = 'xdsoft_next';
          }

          if (options.datepicker) datepicker.addClass('active');else datepicker.removeClass('active');

          if (options.timepicker) timepicker.addClass('active');else timepicker.removeClass('active');

          if (options.value) {
            input && input.val && input.val(options.value);
            _xdsoft_datetime.setCurrentTime(options.value);
          }

          if (isNaN(options.dayOfWeekStart) || parseInt(options.dayOfWeekStart) < 0 || parseInt(options.dayOfWeekStart) > 6) options.dayOfWeekStart = 0;else options.dayOfWeekStart = parseInt(options.dayOfWeekStart);

          if (!options.timepickerScrollbar) scrollbar.hide();

          var tmpDate = [],
              timeOffset;
          if (options.minDate && (tmpDate = /^-(.*)$/.exec(options.minDate)) && (tmpDate = Date.parseDate(tmpDate[1], options.formatDate))) {
            timeOffset = tmpDate.getTime() + -1 * tmpDate.getTimezoneOffset() * 60000;
            options.minDate = new Date(_xdsoft_datetime.now().getTime() - timeOffset).dateFormat(options.formatDate);
          }
          if (options.maxDate && (tmpDate = /^\+(.*)$/.exec(options.maxDate)) && (tmpDate = Date.parseDate(tmpDate[1], options.formatDate))) {
            timeOffset = tmpDate.getTime() + -1 * tmpDate.getTimezoneOffset() * 60000;
            options.maxDate = new Date(_xdsoft_datetime.now().getTime() + timeOffset).dateFormat(options.formatDate);
          }

          mounth_picker.find('.xdsoft_today_button').css('visibility', !options.todayButton ? 'hidden' : 'visible');

          if (options.mask) {
            var e,
                getCaretPos = function getCaretPos(input) {
              try {
                if (document.selection && document.selection.createRange) {
                  var range = document.selection.createRange();
                  return range.getBookmark().charCodeAt(2) - 2;
                } else if (input.setSelectionRange) return input.selectionStart;
              } catch (e) {
                return 0;
              }
            },
                setCaretPos = function setCaretPos(node, pos) {
              var node = typeof node == "string" || node instanceof String ? document.getElementById(node) : node;
              if (!node) {
                return false;
              } else if (node.createTextRange) {
                var textRange = node.createTextRange();
                textRange.collapse(true);
                textRange.moveEnd(pos);
                textRange.moveStart(pos);
                textRange.select();
                return true;
              } else if (node.setSelectionRange) {
                node.setSelectionRange(pos, pos);
                return true;
              }
              return false;
            },
                isValidValue = function isValidValue(mask, value) {
              var reg = mask.replace(/([\[\]\/\{\}\(\)\-\.\+]{1})/g, '\\$1').replace(/_/g, '{digit+}').replace(/([0-9]{1})/g, '{digit$1}').replace(/\{digit([0-9]{1})\}/g, '[0-$1_]{1}').replace(/\{digit[\+]\}/g, '[0-9_]{1}');
              return RegExp(reg).test(value);
            };
            input.off('keydown.xdsoft');
            switch (true) {
              case options.mask === true:
                //options.mask = (new Date()).dateFormat( options.format );
                //options.mask = options.mask.replace(/[0-9]/g,'_');
                options.mask = options.format.replace(/Y/g, '9999').replace(/F/g, '9999').replace(/m/g, '19').replace(/d/g, '39').replace(/H/g, '29').replace(/i/g, '59').replace(/s/g, '59');
              case $.type(options.mask) == 'string':
                if (!isValidValue(options.mask, input.val())) input.val(options.mask.replace(/[0-9]/g, '_'));

                input.on('keydown.xdsoft', function (event) {
                  var val = this.value,
                      key = event.which;
                  switch (true) {
                    case key >= KEY0 && key <= KEY9 || key >= _KEY0 && key <= _KEY9 || key == BACKSPACE || key == DEL:
                      var pos = getCaretPos(this),
                          digit = key != BACKSPACE && key != DEL ? String.fromCharCode(_KEY0 <= key && key <= _KEY9 ? key - KEY0 : key) : '_';
                      if ((key == BACKSPACE || key == DEL) && pos) {
                        pos--;
                        digit = '_';
                      }
                      while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
                        pos += key == BACKSPACE || key == DEL ? -1 : 1;
                      }val = val.substr(0, pos) + digit + val.substr(pos + 1);
                      if ($.trim(val) == '') val = options.mask.replace(/[0-9]/g, '_');else if (pos == options.mask.length) break;

                      pos += key == BACKSPACE || key == DEL ? 0 : 1;
                      while (/[^0-9_]/.test(options.mask.substr(pos, 1)) && pos < options.mask.length && pos > 0) {
                        pos += key == BACKSPACE || key == DEL ? -1 : 1;
                      }if (isValidValue(options.mask, val)) {
                        this.value = val;
                        setCaretPos(this, pos);
                      } else if ($.trim(val) == '') this.value = options.mask.replace(/[0-9]/g, '_');else {
                        input.trigger('error_input.xdsoft');
                      }
                      break;
                    case !!~[AKEY, CKEY, VKEY, ZKEY, YKEY].indexOf(key) && ctrlDown:
                    case !!~[ESC, ARROWUP, ARROWDOWN, ARROWLEFT, ARROWRIGHT, F5, CTRLKEY, TAB, ENTER].indexOf(key):
                      return true;
                  }
                  event.preventDefault();
                  return false;
                });
                break;
            }
          }
          if (options.validateOnBlur) {
            input.off('blur.xdsoft').on('blur.xdsoft', function () {
              if (options.allowBlank && !$.trim($(this).val()).length) {
                $(this).val(null);
                datetimepicker.data('xdsoft_datetime').empty();
              } else if (!Date.parseDate($(this).val(), options.format)) {
                $(this).val(_xdsoft_datetime.now().dateFormat(options.format));
                datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
              } else {
                datetimepicker.data('xdsoft_datetime').setCurrentTime($(this).val());
              }
              datetimepicker.trigger('changedatetime.xdsoft');
            });
          }
          options.dayOfWeekStartPrev = options.dayOfWeekStart == 0 ? 6 : options.dayOfWeekStart - 1;
          datetimepicker.trigger('xchange.xdsoft');
        };

        datetimepicker.data('options', options).on('mousedown.xdsoft', function (event) {
          event.stopPropagation();
          event.preventDefault();
          yearselect.hide();
          monthselect.hide();
          return false;
        });

        var scroll_element = timepicker.find('.xdsoft_time_box');
        scroll_element.append(timebox);
        scroll_element.xdsoftScroller();
        datetimepicker.on('afterOpen.xdsoft', function () {
          scroll_element.xdsoftScroller();
        });

        datetimepicker.append(datepicker).append(timepicker);

        if (options.withoutCopyright !== true) datetimepicker.append(xdsoft_copyright);

        datepicker.append(mounth_picker).append(calendar);

        $('body').append(datetimepicker);

        var _xdsoft_datetime = new function () {
          var _this = this;
          _this.now = function () {
            var d = new Date();
            if (options.yearOffset) d.setFullYear(d.getFullYear() + options.yearOffset);
            return d;
          };

          _this.currentTime = this.now();
          _this.isValidDate = function (d) {
            if (Object.prototype.toString.call(d) !== "[object Date]") return false;
            return !isNaN(d.getTime());
          };

          _this.setCurrentTime = function (dTime) {
            _this.currentTime = typeof dTime == 'string' ? _this.strtodatetime(dTime) : _this.isValidDate(dTime) ? dTime : _this.now();
            datetimepicker.trigger('xchange.xdsoft');
          };

          _this.empty = function () {
            _this.currentTime = null;
          };

          _this.getCurrentTime = function (dTime) {
            return _this.currentTime;
          };

          _this.nextMonth = function () {
            var month = _this.currentTime.getMonth() + 1;
            if (month == 12) {
              _this.currentTime.setFullYear(_this.currentTime.getFullYear() + 1);
              month = 0;
            }
            _this.currentTime.setDate(Math.min(Date.daysInMonth[month], _this.currentTime.getDate()));
            _this.currentTime.setMonth(month);
            options.onChangeMonth && options.onChangeMonth.call && options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
            datetimepicker.trigger('xchange.xdsoft');
            return month;
          };

          _this.prevMonth = function () {
            var month = _this.currentTime.getMonth() - 1;
            if (month == -1) {
              _this.currentTime.setFullYear(_this.currentTime.getFullYear() - 1);
              month = 11;
            }
            _this.currentTime.setDate(Math.min(Date.daysInMonth[month], _this.currentTime.getDate()));
            _this.currentTime.setMonth(month);
            options.onChangeMonth && options.onChangeMonth.call && options.onChangeMonth.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
            datetimepicker.trigger('xchange.xdsoft');
            return month;
          };

          _this.strtodatetime = function (sDateTime) {
            var currentTime = sDateTime ? Date.parseDate(sDateTime, options.format) : _this.now();
            if (!_this.isValidDate(currentTime)) currentTime = _this.now();
            return currentTime;
          };

          _this.strtodate = function (sDate) {
            var currentTime = sDate ? Date.parseDate(sDate, options.formatDate) : _this.now();
            if (!_this.isValidDate(currentTime)) currentTime = _this.now();
            return currentTime;
          };

          _this.strtotime = function (sTime) {
            var currentTime = sTime ? Date.parseDate(sTime, options.formatTime) : _this.now();
            if (!_this.isValidDate(currentTime)) currentTime = _this.now();
            return currentTime;
          };

          _this.str = function () {
            return _this.currentTime.dateFormat(options.format);
          };
        }();
        mounth_picker.find('.xdsoft_today_button').on('mousedown.xdsoft', function () {
          datetimepicker.data('changed', true);
          _xdsoft_datetime.setCurrentTime(0);
          datetimepicker.trigger('afterOpen.xdsoft');
        }).on('dblclick.xdsoft', function () {
          input.val(_xdsoft_datetime.str());
          datetimepicker.trigger('close.xdsoft');
        });
        mounth_picker.find('.xdsoft_prev,.xdsoft_next').on('mousedown.xdsoft', function () {
          var $this = $(this),
              timer = 0,
              stop = false;

          (function arguments_callee1(v) {
            var month = _xdsoft_datetime.currentTime.getMonth();
            if ($this.hasClass(options.next)) {
              _xdsoft_datetime.nextMonth();
            } else if ($this.hasClass(options.prev)) {
              _xdsoft_datetime.prevMonth();
            }
            !stop && (timer = setTimeout(arguments_callee1, v ? v : 100));
          })(500);

          $([document.body, window]).on('mouseup.xdsoft', function arguments_callee2() {
            clearTimeout(timer);
            stop = true;
            $([document.body, window]).off('mouseup.xdsoft', arguments_callee2);
          });
        });

        timepicker.find('.xdsoft_prev,.xdsoft_next').on('mousedown.xdsoft', function () {
          var $this = $(this),
              timer = 0,
              stop = false,
              period = 110;
          (function arguments_callee4(v) {
            var pheight = timeboxparent[0].clientHeight,
                height = timebox[0].offsetHeight,
                top = Math.abs(parseInt(timebox.css('marginTop')));
            if ($this.hasClass(options.next) && height - pheight - options.timeHeightInTimePicker >= top) {
              timebox.css('marginTop', '-' + (top + options.timeHeightInTimePicker) + 'px');
            } else if ($this.hasClass(options.prev) && top - options.timeHeightInTimePicker >= 0) {
              timebox.css('marginTop', '-' + (top - options.timeHeightInTimePicker) + 'px');
            }
            timeboxparent.trigger('scroll_element.xdsoft_scroller', [Math.abs(parseInt(timebox.css('marginTop')) / (height - pheight))]);
            period = period > 10 ? 10 : period - 10;
            !stop && (timer = setTimeout(arguments_callee4, v ? v : period));
          })(500);
          $([document.body, window]).on('mouseup.xdsoft', function arguments_callee5() {
            clearTimeout(timer);
            stop = true;
            $([document.body, window]).off('mouseup.xdsoft', arguments_callee5);
          });
        });

        // base handler - generating a calendar and timepicker
        datetimepicker.on('xchange.xdsoft', function (event) {
          var table = '',
              start = new Date(_xdsoft_datetime.currentTime.getFullYear(), _xdsoft_datetime.currentTime.getMonth(), 1, 12, 0, 0),
              i = 0,
              today = _xdsoft_datetime.now();
          while (start.getDay() != options.dayOfWeekStart) {
            start.setDate(start.getDate() - 1);
          } //generate calendar
          table += '<table><thead><tr>';

          // days
          for (var j = 0; j < 7; j++) {
            table += '<th>' + options.i18n[options.lang].dayOfWeek[j + options.dayOfWeekStart > 6 ? 0 : j + options.dayOfWeekStart] + '</th>';
          }

          table += '</tr></thead>';
          table += '<tbody><tr>';
          var maxDate = false,
              minDate = false;
          if (options.maxDate !== false) {
            maxDate = _xdsoft_datetime.strtodate(options.maxDate);
            maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59, 999);
          }
          if (options.minDate !== false) {
            minDate = _xdsoft_datetime.strtodate(options.minDate);
            minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
          }
          var d,
              y,
              m,
              classes = [];
          while (i < _xdsoft_datetime.currentTime.getDaysInMonth() || start.getDay() != options.dayOfWeekStart || _xdsoft_datetime.currentTime.getMonth() == start.getMonth()) {
            classes = [];
            i++;

            d = start.getDate();y = start.getFullYear();m = start.getMonth();

            classes.push('xdsoft_date');

            if (maxDate !== false && start > maxDate || minDate !== false && start < minDate) {
              classes.push('xdsoft_disabled');
            }

            if (_xdsoft_datetime.currentTime.getMonth() != m) classes.push('xdsoft_other_month');

            if ((options.defaultSelect || datetimepicker.data('changed')) && _xdsoft_datetime.currentTime.dateFormat('d.m.Y') == start.dateFormat('d.m.Y')) {
              classes.push('xdsoft_current');
            }

            if (today.dateFormat('d.m.Y') == start.dateFormat('d.m.Y')) {
              classes.push('xdsoft_today');
            }

            if (start.getDay() == 0 || start.getDay() == 6 || ~options.weekends.indexOf(start.dateFormat('d.m.Y'))) {
              classes.push('xdsoft_weekend');
            }

            table += '<td data-date="' + d + '" data-month="' + m + '" data-year="' + y + '"' + ' class="xdsoft_date xdsoft_day_of_week' + start.getDay() + ' ' + classes.join(' ') + '">' + '<div>' + d + '</div>' + '</td>';

            if (start.getDay() == options.dayOfWeekStartPrev) {
              table += '</tr>';
            }

            start.setDate(d + 1);
          }
          table += '</tbody></table>';

          calendar.html(table);

          mounth_picker.find('.xdsoft_label span').eq(0).text(options.i18n[options.lang].months[_xdsoft_datetime.currentTime.getMonth()]);
          mounth_picker.find('.xdsoft_label span').eq(1).text(_xdsoft_datetime.currentTime.getFullYear());

          // generate timebox
          var time = '',
              h = '',
              m = '',
              s = '',
              line_time = function line_time(h, m, s) {
            var now = _xdsoft_datetime.now();
            now.setHours(h);
            h = parseInt(now.getHours());
            now.setMinutes(m);
            m = parseInt(now.getMinutes());
            now.setSeconds(s);
            s = parseInt(now.getSeconds());

            classes = [];
            if (options.maxTime !== false && _xdsoft_datetime.strtotime(options.maxTime).getTime() < now.getTime() || options.minTime !== false && _xdsoft_datetime.strtotime(options.minTime).getTime() > now.getTime()) classes.push('xdsoft_disabled');
            if ((options.defaultSelect || datetimepicker.data('changed')) && parseInt(_xdsoft_datetime.currentTime.getHours()) == parseInt(h) && (options.step > 59 || Math[options.roundTime](_xdsoft_datetime.currentTime.getMinutes() / options.step) * options.step == parseInt(m)) && (options.step > 59 || Math[options.roundTime](_xdsoft_datetime.currentTime.getSeconds() / options.step) * options.step == parseInt(s))) classes.push('xdsoft_current');
            if (parseInt(today.getHours()) == parseInt(h) && parseInt(today.getMinutes()) == parseInt(m)) classes.push('xdsoft_today');
            time += '<div class="xdsoft_time ' + classes.join(' ') + '" data-hour="' + h + '" data-minute="' + m + '" data-second="' + s + '">' + now.dateFormat(options.formatTime) + '</div>';
          };

          if (!options.allowTimes || !$.isArray(options.allowTimes) || !options.allowTimes.length) {
            for (var i = 0, j = 0, k = 0; i < (options.hours12 ? 12 : 24); i++) {
              for (j = 0; j < 60; j += options.step) {
                for (k = 0; k < 60; k += options.step) {
                  h = (i < 10 ? '0' : '') + i;
                  m = (j < 10 ? '0' : '') + j;
                  s = (k < 10 ? '0' : '') + k;
                  line_time(h, m, s);
                }
              }
            }
          } else {
            for (var i = 0; i < options.allowTimes.length; i++) {
              h = _xdsoft_datetime.strtotime(options.allowTimes[i]).getHours();
              m = _xdsoft_datetime.strtotime(options.allowTimes[i]).getMinutes();
              s = _xdsoft_datetime.strtotime(options.allowTimes[i]).getSeconds();
              line_time(h, m, s);
            }
          }

          timebox.html(time);

          var opt = '',
              i = 0;

          for (i = parseInt(options.yearStart, 10) + options.yearOffset; i <= parseInt(options.yearEnd, 10) + options.yearOffset; i++) {
            opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getFullYear() == i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + i + '</div>';
          }
          yearselect.children().eq(0).html(opt);

          for (i = 0, opt = ''; i <= 11; i++) {
            opt += '<div class="xdsoft_option ' + (_xdsoft_datetime.currentTime.getMonth() == i ? 'xdsoft_current' : '') + '" data-value="' + i + '">' + options.i18n[options.lang].months[i] + '</div>';
          }
          monthselect.children().eq(0).html(opt);
          $(this).trigger('generate.xdsoft');
          event.stopPropagation();
        }).on('afterOpen.xdsoft', function () {
          if (options.timepicker && timebox.find('.xdsoft_current').length) {
            var pheight = timeboxparent[0].clientHeight,
                height = timebox[0].offsetHeight,
                top = timebox.find('.xdsoft_current').index() * options.timeHeightInTimePicker + 1;
            if (height - pheight < top) top = height - pheight;
            timebox.css('marginTop', '-' + parseInt(top) + 'px');
            timeboxparent.trigger('scroll_element.xdsoft_scroller', [parseInt(top) / (height - pheight)]);
          }
        });
        var timerclick = 0;
        calendar.on('click.xdsoft', 'td', function () {
          timerclick++;
          var $this = $(this),
              currentTime = _xdsoft_datetime.currentTime;
          if ($this.hasClass('xdsoft_disabled')) return false;

          currentTime.setFullYear($this.data('year'));
          currentTime.setMonth($this.data('month'));
          currentTime.setDate($this.data('date'));
          datetimepicker.trigger('select.xdsoft', [currentTime]);

          input.val(_xdsoft_datetime.str());
          if ((timerclick > 1 || options.closeOnDateSelect === true || options.closeOnDateSelect === 0 && !options.timepicker) && !options.inline) {
            datetimepicker.trigger('close.xdsoft');
          }

          if (options.onSelectDate && options.onSelectDate.call) {
            options.onSelectDate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
          }

          datetimepicker.data('changed', true);
          datetimepicker.trigger('xchange.xdsoft');
          datetimepicker.trigger('changedatetime.xdsoft');
          setTimeout(function () {
            timerclick = 0;
          }, 200);
        });

        timebox.on('click.xdsoft', 'div', function () {
          var $this = $(this),
              currentTime = _xdsoft_datetime.currentTime;
          if ($this.hasClass('xdsoft_disabled')) return false;
          currentTime.setHours($this.data('hour'));
          currentTime.setMinutes($this.data('minute'));
          currentTime.setSeconds($this.data('second'));
          datetimepicker.trigger('select.xdsoft', [currentTime]);

          datetimepicker.data('input').val(_xdsoft_datetime.str());

          !options.inline && datetimepicker.trigger('close.xdsoft');

          if (options.onSelectTime && options.onSelectTime.call) {
            options.onSelectTime.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
          }
          datetimepicker.data('changed', true);
          datetimepicker.trigger('xchange.xdsoft');
          datetimepicker.trigger('changedatetime.xdsoft');
        });

        datetimepicker.mousewheel && datepicker.mousewheel(function (event, delta, deltaX, deltaY) {
          if (!options.scrollMonth) return true;
          if (delta < 0) _xdsoft_datetime.nextMonth();else _xdsoft_datetime.prevMonth();
          return false;
        });

        datetimepicker.mousewheel && timeboxparent.unmousewheel().mousewheel(function (event, delta, deltaX, deltaY) {
          if (!options.scrollTime) return true;
          var pheight = timeboxparent[0].clientHeight,
              height = timebox[0].offsetHeight,
              top = Math.abs(parseInt(timebox.css('marginTop'))),
              fl = true;
          if (delta < 0 && height - pheight - options.timeHeightInTimePicker >= top) {
            timebox.css('marginTop', '-' + (top + options.timeHeightInTimePicker) + 'px');
            fl = false;
          } else if (delta > 0 && top - options.timeHeightInTimePicker >= 0) {
            timebox.css('marginTop', '-' + (top - options.timeHeightInTimePicker) + 'px');
            fl = false;
          }
          timeboxparent.trigger('scroll_element.xdsoft_scroller', [Math.abs(parseInt(timebox.css('marginTop')) / (height - pheight))]);
          event.stopPropagation();
          return fl;
        });

        datetimepicker.on('changedatetime.xdsoft', function () {
          if (options.onChangeDateTime && options.onChangeDateTime.call) options.onChangeDateTime.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
        }).on('generate.xdsoft', function () {
          if (options.onGenerate && options.onGenerate.call) options.onGenerate.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
        });

        var current_time_index = 0;
        input.mousewheel && input.mousewheel(function (event, delta, deltaX, deltaY) {
          if (!options.scrollInput) return true;
          if (!options.datepicker && options.timepicker) {
            current_time_index = timebox.find('.xdsoft_current').length ? timebox.find('.xdsoft_current').eq(0).index() : 0;
            if (current_time_index + delta >= 0 && current_time_index + delta < timebox.children().length) current_time_index += delta;
            timebox.children().eq(current_time_index).length && timebox.children().eq(current_time_index).trigger('mousedown');
            return false;
          } else if (options.datepicker && !options.timepicker) {
            datepicker.trigger(event, [delta, deltaX, deltaY]);
            input.val && input.val(_xdsoft_datetime.str());
            datetimepicker.trigger('changedatetime.xdsoft');
            return false;
          }
        });
        var setPos = function setPos() {
          var offset = datetimepicker.data('input').offset(),
              top = offset.top + datetimepicker.data('input')[0].offsetHeight - 1,
              left = offset.left;
          if (top + datetimepicker[0].offsetHeight > $(window).height() + $(window).scrollTop()) top = offset.top - datetimepicker[0].offsetHeight + 1;
          if (left + datetimepicker[0].offsetWidth > $(window).width()) left = offset.left - datetimepicker[0].offsetWidth + datetimepicker.data('input')[0].offsetWidth;
          datetimepicker.css({
            //left:left,
            top: top
          });
        };
        datetimepicker.on('open.xdsoft', function () {
          var onShow = true;
          if (options.onShow && options.onShow.call) {
            onShow = options.onShow.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
          }
          if (onShow !== false) {
            datetimepicker.show();
            datetimepicker.trigger('afterOpen.xdsoft');
            setPos();
            $(window).off('resize.xdsoft', setPos).on('resize.xdsoft', setPos);

            if (options.closeOnWithoutClick) {
              $([document.body, window]).on('mousedown.xdsoft', function arguments_callee6() {
                datetimepicker.trigger('close.xdsoft');
                $([document.body, window]).off('mousedown.xdsoft', arguments_callee6);
              });
            }
          }
        }).on('close.xdsoft', function (event) {
          var onClose = true;
          if (options.onClose && options.onClose.call) {
            onClose = options.onClose.call(datetimepicker, _xdsoft_datetime.currentTime, datetimepicker.data('input'));
          }
          if (onClose !== false && !options.opened && !options.inline) {
            datetimepicker.hide();
          }
          event.stopPropagation();
        }).data('input', input);

        var timer = 0,
            timer1 = 0;

        datetimepicker.data('xdsoft_datetime', _xdsoft_datetime);
        datetimepicker.setOptions(options);

        var ct = options.value ? options.value : input && input.val && input.val() ? input.val() : '';
        if (ct && _xdsoft_datetime.isValidDate(ct = Date.parseDate(ct, options.format))) {
          datetimepicker.data('changed', true);
        } else ct = '';

        _xdsoft_datetime.setCurrentTime(ct ? ct : 0);

        datetimepicker.trigger('afterOpen.xdsoft');

        input.data('xdsoft_datetimepicker', datetimepicker).on('open.xdsoft focusin.xdsoft mousedown.xdsoft', function (event) {
          if (input.is(':disabled') || input.is(':hidden') || !input.is(':visible')) return;
          clearTimeout(timer);
          timer = setTimeout(function () {
            if (input.is(':disabled') || input.is(':hidden') || !input.is(':visible')) return;
            _xdsoft_datetime.setCurrentTime(input && input.val && input.val() ? input.val() : 0);
            datetimepicker.trigger('open.xdsoft');
          }, 100);
        }).on('keydown.xdsoft', function (event) {
          var val = this.value,
              key = event.which;
          switch (true) {
            case !!~[ENTER].indexOf(key):
              var elementSelector = $("input:visible,textarea:visible");
              datetimepicker.trigger('close.xdsoft');
              elementSelector.eq(elementSelector.index(this) + 1).focus();
              return false;
            case !!~[TAB].indexOf(key):
              datetimepicker.trigger('close.xdsoft');
              return true;
          }
        });
      },
          destroyDateTimePicker = function destroyDateTimePicker(input) {
        var datetimepicker = input.data('xdsoft_datetimepicker');
        if (datetimepicker) {
          datetimepicker.data('xdsoft_datetime', null);
          datetimepicker.remove();
          input.data('xdsoft_datetimepicker', null).off('open.xdsoft focusin.xdsoft focusout.xdsoft mousedown.xdsoft blur.xdsoft keydown.xdsoft');
          $(window).off('resize.xdsoft');
          $([window, document.body]).off('mousedown.xdsoft');
          input.unmousewheel && input.unmousewheel();
        }
      };
      $(document).off('keydown.xdsoftctrl keyup.xdsoftctrl').on('keydown.xdsoftctrl', function (e) {
        if (e.keyCode == CTRLKEY) ctrlDown = true;
      }).on('keyup.xdsoftctrl', function (e) {
        if (e.keyCode == CTRLKEY) ctrlDown = false;
      });
      return this.each(function () {
        var datetimepicker;
        if (datetimepicker = $(this).data('xdsoft_datetimepicker')) {
          if ($.type(opt) === 'string') {
            switch (opt) {
              case 'show':
                $(this).select().focus();
                datetimepicker.trigger('open.xdsoft');
                break;
              case 'hide':
                datetimepicker.trigger('close.xdsoft');
                break;
              case 'destroy':
                destroyDateTimePicker($(this));
                break;
              case 'reset':
                this.value = this.defaultValue;
                if (!this.value || !datetimepicker.data('xdsoft_datetime').isValidDate(Date.parseDate(this.value, options.format))) datetimepicker.data('changed', false);
                datetimepicker.data('xdsoft_datetime').setCurrentTime(this.value);
                break;
            }
          } else {
            datetimepicker.setOptions(opt);
          }
          return 0;
        } else $.type(opt) !== 'string' && createDateTimePicker($(this));
      });
    };
  })(jQuery);

  //http://www.xaprb.com/blog/2005/12/12/javascript-closures-for-runtime-efficiency/
  /*
   * Copyright (C) 2004 Baron Schwartz <baron at sequent dot org>
   *
   * This program is free software; you can redistribute it and/or modify it
   * under the terms of the GNU Lesser General Public License as published by the
   * Free Software Foundation, version 2.1.
   *
   * This program is distributed in the hope that it will be useful, but WITHOUT
   * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
   * FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
   * details.
   */
  Date.parseFunctions = { count: 0 };Date.parseRegexes = [];Date.formatFunctions = { count: 0 };Date.prototype.dateFormat = function (format) {
    if (Date.formatFunctions[format] == null) {
      Date.createNewFormat(format);
    }var func = Date.formatFunctions[format];return this[func]();
  };Date.createNewFormat = function (format) {
    var funcName = "format" + Date.formatFunctions.count++;Date.formatFunctions[format] = funcName;var code = "Date.prototype." + funcName + " = function() {return ";var special = false;var ch = '';for (var i = 0; i < format.length; ++i) {
      ch = format.charAt(i);if (!special && ch == "\\") {
        special = true;
      } else if (special) {
        special = false;code += "'" + String.escape(ch) + "' + ";
      } else {
        code += Date.getFormatCode(ch);
      }
    }eval(code.substring(0, code.length - 3) + ";}");
  };Date.getFormatCode = function (character) {
    switch (character) {case "d":
        return "String.leftPad(this.getDate(), 2, '0') + ";case "D":
        return "Date.dayNames[this.getDay()].substring(0, 3) + ";case "j":
        return "this.getDate() + ";case "l":
        return "Date.dayNames[this.getDay()] + ";case "S":
        return "this.getSuffix() + ";case "w":
        return "this.getDay() + ";case "z":
        return "this.getDayOfYear() + ";case "W":
        return "this.getWeekOfYear() + ";case "F":
        return "Date.monthNames[this.getMonth()] + ";case "m":
        return "String.leftPad(this.getMonth() + 1, 2, '0') + ";case "M":
        return "Date.monthNames[this.getMonth()].substring(0, 3) + ";case "n":
        return "(this.getMonth() + 1) + ";case "t":
        return "this.getDaysInMonth() + ";case "L":
        return "(this.isLeapYear() ? 1 : 0) + ";case "Y":
        return "this.getFullYear() + ";case "y":
        return "('' + this.getFullYear()).substring(2, 4) + ";case "a":
        return "(this.getHours() < 12 ? 'am' : 'pm') + ";case "A":
        return "(this.getHours() < 12 ? 'AM' : 'PM') + ";case "g":
        return "((this.getHours() %12) ? this.getHours() % 12 : 12) + ";case "G":
        return "this.getHours() + ";case "h":
        return "String.leftPad((this.getHours() %12) ? this.getHours() % 12 : 12, 2, '0') + ";case "H":
        return "String.leftPad(this.getHours(), 2, '0') + ";case "i":
        return "String.leftPad(this.getMinutes(), 2, '0') + ";case "s":
        return "String.leftPad(this.getSeconds(), 2, '0') + ";case "O":
        return "this.getGMTOffset() + ";case "T":
        return "this.getTimezone() + ";case "Z":
        return "(this.getTimezoneOffset() * -60) + ";default:
        return "'" + String.escape(character) + "' + ";}
  };Date.parseDate = function (input, format) {
    if (Date.parseFunctions[format] == null) {
      Date.createParser(format);
    }var func = Date.parseFunctions[format];return Date[func](input);
  };Date.createParser = function (format) {
    var funcName = "parse" + Date.parseFunctions.count++;var regexNum = Date.parseRegexes.length;var currentGroup = 1;Date.parseFunctions[format] = funcName;var code = "Date." + funcName + " = function(input) {\n" + "var y = -1, m = -1, d = -1, h = -1, i = -1, s = -1;\n" + "var d = new Date();\n" + "y = d.getFullYear();\n" + "m = d.getMonth();\n" + "d = d.getDate();\n" + "var results = input.match(Date.parseRegexes[" + regexNum + "]);\n" + "if (results && results.length > 0) {";var regex = "";var special = false;var ch = '';for (var i = 0; i < format.length; ++i) {
      ch = format.charAt(i);if (!special && ch == "\\") {
        special = true;
      } else if (special) {
        special = false;regex += String.escape(ch);
      } else {
        obj = Date.formatCodeToRegex(ch, currentGroup);currentGroup += obj.g;regex += obj.s;if (obj.g && obj.c) {
          code += obj.c;
        }
      }
    }code += "if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0 && s >= 0)\n" + "{return new Date(y, m, d, h, i, s);}\n" + "else if (y > 0 && m >= 0 && d > 0 && h >= 0 && i >= 0)\n" + "{return new Date(y, m, d, h, i);}\n" + "else if (y > 0 && m >= 0 && d > 0 && h >= 0)\n" + "{return new Date(y, m, d, h);}\n" + "else if (y > 0 && m >= 0 && d > 0)\n" + "{return new Date(y, m, d);}\n" + "else if (y > 0 && m >= 0)\n" + "{return new Date(y, m);}\n" + "else if (y > 0)\n" + "{return new Date(y);}\n" + "}return null;}";Date.parseRegexes[regexNum] = new RegExp("^" + regex + "$");eval(code);
  };Date.formatCodeToRegex = function (character, currentGroup) {
    switch (character) {case "D":
        return { g: 0, c: null, s: "(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)" };case "j":case "d":
        return { g: 1, c: "d = parseInt(results[" + currentGroup + "], 10);\n", s: "(\\d{1,2})" };case "l":
        return { g: 0, c: null, s: "(?:" + Date.dayNames.join("|") + ")" };case "S":
        return { g: 0, c: null, s: "(?:st|nd|rd|th)" };case "w":
        return { g: 0, c: null, s: "\\d" };case "z":
        return { g: 0, c: null, s: "(?:\\d{1,3})" };case "W":
        return { g: 0, c: null, s: "(?:\\d{2})" };case "F":
        return { g: 1, c: "m = parseInt(Date.monthNumbers[results[" + currentGroup + "].substring(0, 3)], 10);\n", s: "(" + Date.monthNames.join("|") + ")" };case "M":
        return { g: 1, c: "m = parseInt(Date.monthNumbers[results[" + currentGroup + "]], 10);\n", s: "(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)" };case "n":case "m":
        return { g: 1, c: "m = parseInt(results[" + currentGroup + "], 10) - 1;\n", s: "(\\d{1,2})" };case "t":
        return { g: 0, c: null, s: "\\d{1,2}" };case "L":
        return { g: 0, c: null, s: "(?:1|0)" };case "Y":
        return { g: 1, c: "y = parseInt(results[" + currentGroup + "], 10);\n", s: "(\\d{4})" };case "y":
        return { g: 1, c: "var ty = parseInt(results[" + currentGroup + "], 10);\n" + "y = ty > Date.y2kYear ? 1900 + ty : 2000 + ty;\n", s: "(\\d{1,2})" };case "a":
        return { g: 1, c: "if (results[" + currentGroup + "] == 'am') {\n" + "if (h == 12) { h = 0; }\n" + "} else { if (h < 12) { h += 12; }}", s: "(am|pm)" };case "A":
        return { g: 1, c: "if (results[" + currentGroup + "] == 'AM') {\n" + "if (h == 12) { h = 0; }\n" + "} else { if (h < 12) { h += 12; }}", s: "(AM|PM)" };case "g":case "G":case "h":case "H":
        return { g: 1, c: "h = parseInt(results[" + currentGroup + "], 10);\n", s: "(\\d{1,2})" };case "i":
        return { g: 1, c: "i = parseInt(results[" + currentGroup + "], 10);\n", s: "(\\d{2})" };case "s":
        return { g: 1, c: "s = parseInt(results[" + currentGroup + "], 10);\n", s: "(\\d{2})" };case "O":
        return { g: 0, c: null, s: "[+-]\\d{4}" };case "T":
        return { g: 0, c: null, s: "[A-Z]{3}" };case "Z":
        return { g: 0, c: null, s: "[+-]\\d{1,5}" };default:
        return { g: 0, c: null, s: String.escape(character) };}
  };Date.prototype.getTimezone = function () {
    return this.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3");
  };Date.prototype.getGMTOffset = function () {
    return (this.getTimezoneOffset() > 0 ? "-" : "+") + String.leftPad(Math.floor(Math.abs(this.getTimezoneOffset()) / 60), 2, "0") + String.leftPad(Math.abs(this.getTimezoneOffset()) % 60, 2, "0");
  };Date.prototype.getDayOfYear = function () {
    var num = 0;Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;for (var i = 0; i < this.getMonth(); ++i) {
      num += Date.daysInMonth[i];
    }return num + this.getDate() - 1;
  };Date.prototype.getWeekOfYear = function () {
    var now = this.getDayOfYear() + (4 - this.getDay());var jan1 = new Date(this.getFullYear(), 0, 1);var then = 7 - jan1.getDay() + 4;document.write(then);return String.leftPad((now - then) / 7 + 1, 2, "0");
  };Date.prototype.isLeapYear = function () {
    var year = this.getFullYear();return (year & 3) == 0 && (year % 100 || year % 400 == 0 && year);
  };Date.prototype.getFirstDayOfMonth = function () {
    var day = (this.getDay() - (this.getDate() - 1)) % 7;return day < 0 ? day + 7 : day;
  };Date.prototype.getLastDayOfMonth = function () {
    var day = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7;return day < 0 ? day + 7 : day;
  };Date.prototype.getDaysInMonth = function () {
    Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28;return Date.daysInMonth[this.getMonth()];
  };Date.prototype.getSuffix = function () {
    switch (this.getDate()) {case 1:case 21:case 31:
        return "st";case 2:case 22:
        return "nd";case 3:case 23:
        return "rd";default:
        return "th";}
  };String.escape = function (string) {
    return string.replace(/('|\\)/g, "\\$1");
  };String.leftPad = function (val, size, ch) {
    var result = new String(val);if (ch == null) {
      ch = " ";
    }while (result.length < size) {
      result = ch + result;
    }return result;
  };Date.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];Date.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];Date.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];Date.y2kYear = 50;Date.monthNumbers = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };Date.patterns = { ISO8601LongPattern: "Y-m-d H:i:s", ISO8601ShortPattern: "Y-m-d", ShortDatePattern: "n/j/Y", LongDatePattern: "l, F d, Y", FullDateTimePattern: "l, F d, Y g:i:s A", MonthDayPattern: "F d", ShortTimePattern: "g:i A", LongTimePattern: "g:i:s A", SortableDateTimePattern: "Y-m-d\\TH:i:s", UniversalSortableDateTimePattern: "Y-m-d H:i:sO", YearMonthPattern: "F, Y" };

  //https://github.com/brandonaaron/jquery-mousewheel/blob/master/jquery.mousewheel.js
  /*
   * Copyright (c) 2013 Brandon Aaron (http://brandonaaron.net)
   *
   * Licensed under the MIT License (LICENSE.txt).
   *
   * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
   * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
   * Thanks to: Seamus Leahy for adding deltaX and deltaY
   *
   * Version: 3.1.3
   *
   * Requires: 1.2.2+
   */
  (function (factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(55)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
      module.exports = factory;
    } else {
      factory(jQuery);
    }
  })(function ($) {
    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];var lowestDelta, lowestDeltaXY;if ($.event.fixHooks) {
      for (var i = toFix.length; i;) {
        $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
      }
    }$.event.special.mousewheel = { setup: function setup() {
        if (this.addEventListener) {
          for (var i = toBind.length; i;) {
            this.addEventListener(toBind[--i], handler, false);
          }
        } else {
          this.onmousewheel = handler;
        }
      }, teardown: function teardown() {
        if (this.removeEventListener) {
          for (var i = toBind.length; i;) {
            this.removeEventListener(toBind[--i], handler, false);
          }
        } else {
          this.onmousewheel = null;
        }
      } };$.fn.extend({ mousewheel: function mousewheel(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
      }, unmousewheel: function unmousewheel(fn) {
        return this.unbind("mousewheel", fn);
      } });function handler(event) {
      var orgEvent = event || window.event,
          args = [].slice.call(arguments, 1),
          delta = 0,
          deltaX = 0,
          deltaY = 0,
          absDelta = 0,
          absDeltaXY = 0,
          fn;event = $.event.fix(orgEvent);event.type = "mousewheel";if (orgEvent.wheelDelta) {
        delta = orgEvent.wheelDelta;
      }if (orgEvent.detail) {
        delta = orgEvent.detail * -1;
      }if (orgEvent.deltaY) {
        deltaY = orgEvent.deltaY * -1;delta = deltaY;
      }if (orgEvent.deltaX) {
        deltaX = orgEvent.deltaX;delta = deltaX * -1;
      }if (orgEvent.wheelDeltaY !== undefined) {
        deltaY = orgEvent.wheelDeltaY;
      }if (orgEvent.wheelDeltaX !== undefined) {
        deltaX = orgEvent.wheelDeltaX * -1;
      }absDelta = Math.abs(delta);if (!lowestDelta || absDelta < lowestDelta) {
        lowestDelta = absDelta;
      }absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
        lowestDeltaXY = absDeltaXY;
      }fn = delta > 0 ? 'floor' : 'ceil';delta = Math[fn](delta / lowestDelta);deltaX = Math[fn](deltaX / lowestDeltaXY);deltaY = Math[fn](deltaY / lowestDeltaXY);args.unshift(event, delta, deltaX, deltaY);return ($.event.dispatch || $.event.handle).apply(this, args);
    }
  });
  ;

  var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;
  ;

  var _temp2 = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;

  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(55)))

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

  /* WEBPACK VAR INJECTION */(function(global, jQuery) {/*** IMPORTS FROM imports-loader ***/
  var window = global;

  "use strict";

  (function (r) {
    r.fn.qrcode = function (h) {
      var s;function u(a) {
        this.mode = s;this.data = a;
      }function o(a, c) {
        this.typeNumber = a;this.errorCorrectLevel = c;this.modules = null;this.moduleCount = 0;this.dataCache = null;this.dataList = [];
      }function q(a, c) {
        if (void 0 == a.length) throw Error(a.length + "/" + c);for (var d = 0; d < a.length && 0 == a[d];) {
          d++;
        }this.num = Array(a.length - d + c);for (var b = 0; b < a.length - d; b++) {
          this.num[b] = a[b + d];
        }
      }function p(a, c) {
        this.totalCount = a;this.dataCount = c;
      }function t() {
        this.buffer = [];this.length = 0;
      }u.prototype = { getLength: function getLength() {
          return this.data.length;
        },
        write: function write(a) {
          for (var c = 0; c < this.data.length; c++) {
            a.put(this.data.charCodeAt(c), 8);
          }
        } };o.prototype = { addData: function addData(a) {
          this.dataList.push(new u(a));this.dataCache = null;
        }, isDark: function isDark(a, c) {
          if (0 > a || this.moduleCount <= a || 0 > c || this.moduleCount <= c) throw Error(a + "," + c);return this.modules[a][c];
        }, getModuleCount: function getModuleCount() {
          return this.moduleCount;
        }, make: function make() {
          if (1 > this.typeNumber) {
            for (var a = 1, a = 1; 40 > a; a++) {
              for (var c = p.getRSBlocks(a, this.errorCorrectLevel), d = new t(), b = 0, e = 0; e < c.length; e++) {
                b += c[e].dataCount;
              }for (e = 0; e < this.dataList.length; e++) {
                c = this.dataList[e], d.put(c.mode, 4), d.put(c.getLength(), j.getLengthInBits(c.mode, a)), c.write(d);
              }if (d.getLengthInBits() <= 8 * b) break;
            }this.typeNumber = a;
          }this.makeImpl(!1, this.getBestMaskPattern());
        }, makeImpl: function makeImpl(a, c) {
          this.moduleCount = 4 * this.typeNumber + 17;this.modules = Array(this.moduleCount);for (var d = 0; d < this.moduleCount; d++) {
            this.modules[d] = Array(this.moduleCount);for (var b = 0; b < this.moduleCount; b++) {
              this.modules[d][b] = null;
            }
          }this.setupPositionProbePattern(0, 0);this.setupPositionProbePattern(this.moduleCount - 7, 0);this.setupPositionProbePattern(0, this.moduleCount - 7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(a, c);7 <= this.typeNumber && this.setupTypeNumber(a);null == this.dataCache && (this.dataCache = o.createData(this.typeNumber, this.errorCorrectLevel, this.dataList));this.mapData(this.dataCache, c);
        }, setupPositionProbePattern: function setupPositionProbePattern(a, c) {
          for (var d = -1; 7 >= d; d++) {
            if (!(-1 >= a + d || this.moduleCount <= a + d)) for (var b = -1; 7 >= b; b++) {
              -1 >= c + b || this.moduleCount <= c + b || (this.modules[a + d][c + b] = 0 <= d && 6 >= d && (0 == b || 6 == b) || 0 <= b && 6 >= b && (0 == d || 6 == d) || 2 <= d && 4 >= d && 2 <= b && 4 >= b ? !0 : !1);
            }
          }
        }, getBestMaskPattern: function getBestMaskPattern() {
          for (var a = 0, c = 0, d = 0; 8 > d; d++) {
            this.makeImpl(!0, d);var b = j.getLostPoint(this);if (0 == d || a > b) a = b, c = d;
          }return c;
        }, createMovieClip: function createMovieClip(a, c, d) {
          a = a.createEmptyMovieClip(c, d);this.make();for (c = 0; c < this.modules.length; c++) {
            for (var d = 1 * c, b = 0; b < this.modules[c].length; b++) {
              var e = 1 * b;this.modules[c][b] && (a.beginFill(0, 100), a.moveTo(e, d), a.lineTo(e + 1, d), a.lineTo(e + 1, d + 1), a.lineTo(e, d + 1), a.endFill());
            }
          }return a;
        },
        setupTimingPattern: function setupTimingPattern() {
          for (var a = 8; a < this.moduleCount - 8; a++) {
            null == this.modules[a][6] && (this.modules[a][6] = 0 == a % 2);
          }for (a = 8; a < this.moduleCount - 8; a++) {
            null == this.modules[6][a] && (this.modules[6][a] = 0 == a % 2);
          }
        }, setupPositionAdjustPattern: function setupPositionAdjustPattern() {
          for (var a = j.getPatternPosition(this.typeNumber), c = 0; c < a.length; c++) {
            for (var d = 0; d < a.length; d++) {
              var b = a[c],
                  e = a[d];if (null == this.modules[b][e]) for (var f = -2; 2 >= f; f++) {
                for (var i = -2; 2 >= i; i++) {
                  this.modules[b + f][e + i] = -2 == f || 2 == f || -2 == i || 2 == i || 0 == f && 0 == i ? !0 : !1;
                }
              }
            }
          }
        }, setupTypeNumber: function setupTypeNumber(a) {
          for (var c = j.getBCHTypeNumber(this.typeNumber), d = 0; 18 > d; d++) {
            var b = !a && 1 == (c >> d & 1);this.modules[Math.floor(d / 3)][d % 3 + this.moduleCount - 8 - 3] = b;
          }for (d = 0; 18 > d; d++) {
            b = !a && 1 == (c >> d & 1), this.modules[d % 3 + this.moduleCount - 8 - 3][Math.floor(d / 3)] = b;
          }
        }, setupTypeInfo: function setupTypeInfo(a, c) {
          for (var d = j.getBCHTypeInfo(this.errorCorrectLevel << 3 | c), b = 0; 15 > b; b++) {
            var e = !a && 1 == (d >> b & 1);6 > b ? this.modules[b][8] = e : 8 > b ? this.modules[b + 1][8] = e : this.modules[this.moduleCount - 15 + b][8] = e;
          }for (b = 0; 15 > b; b++) {
            e = !a && 1 == (d >> b & 1), 8 > b ? this.modules[8][this.moduleCount - b - 1] = e : 9 > b ? this.modules[8][15 - b - 1 + 1] = e : this.modules[8][15 - b - 1] = e;
          }this.modules[this.moduleCount - 8][8] = !a;
        }, mapData: function mapData(a, c) {
          for (var d = -1, b = this.moduleCount - 1, e = 7, f = 0, i = this.moduleCount - 1; 0 < i; i -= 2) {
            for (6 == i && i--;;) {
              for (var g = 0; 2 > g; g++) {
                if (null == this.modules[b][i - g]) {
                  var n = !1;f < a.length && (n = 1 == (a[f] >>> e & 1));j.getMask(c, b, i - g) && (n = !n);this.modules[b][i - g] = n;e--;-1 == e && (f++, e = 7);
                }
              }b += d;if (0 > b || this.moduleCount <= b) {
                b -= d;d = -d;break;
              }
            }
          }
        } };o.PAD0 = 236;o.PAD1 = 17;o.createData = function (a, c, d) {
        for (var c = p.getRSBlocks(a, c), b = new t(), e = 0; e < d.length; e++) {
          var f = d[e];b.put(f.mode, 4);b.put(f.getLength(), j.getLengthInBits(f.mode, a));f.write(b);
        }for (e = a = 0; e < c.length; e++) {
          a += c[e].dataCount;
        }if (b.getLengthInBits() > 8 * a) throw Error("code length overflow. (" + b.getLengthInBits() + ">" + 8 * a + ")");for (b.getLengthInBits() + 4 <= 8 * a && b.put(0, 4); 0 != b.getLengthInBits() % 8;) {
          b.putBit(!1);
        }for (; !(b.getLengthInBits() >= 8 * a);) {
          b.put(o.PAD0, 8);if (b.getLengthInBits() >= 8 * a) break;b.put(o.PAD1, 8);
        }return o.createBytes(b, c);
      };o.createBytes = function (a, c) {
        for (var d = 0, b = 0, e = 0, f = Array(c.length), i = Array(c.length), g = 0; g < c.length; g++) {
          var n = c[g].dataCount,
              h = c[g].totalCount - n,
              b = Math.max(b, n),
              e = Math.max(e, h);f[g] = Array(n);for (var k = 0; k < f[g].length; k++) {
            f[g][k] = 255 & a.buffer[k + d];
          }d += n;k = j.getErrorCorrectPolynomial(h);n = new q(f[g], k.getLength() - 1).mod(k);i[g] = Array(k.getLength() - 1);for (k = 0; k < i[g].length; k++) {
            h = k + n.getLength() - i[g].length, i[g][k] = 0 <= h ? n.get(h) : 0;
          }
        }for (k = g = 0; k < c.length; k++) {
          g += c[k].totalCount;
        }d = Array(g);for (k = n = 0; k < b; k++) {
          for (g = 0; g < c.length; g++) {
            k < f[g].length && (d[n++] = f[g][k]);
          }
        }for (k = 0; k < e; k++) {
          for (g = 0; g < c.length; g++) {
            k < i[g].length && (d[n++] = i[g][k]);
          }
        }return d;
      };s = 4;for (var j = { PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]], G15: 1335, G18: 7973, G15_MASK: 21522, getBCHTypeInfo: function getBCHTypeInfo(a) {
          for (var c = a << 10; 0 <= j.getBCHDigit(c) - j.getBCHDigit(j.G15);) {
            c ^= j.G15 << j.getBCHDigit(c) - j.getBCHDigit(j.G15);
          }return (a << 10 | c) ^ j.G15_MASK;
        }, getBCHTypeNumber: function getBCHTypeNumber(a) {
          for (var c = a << 12; 0 <= j.getBCHDigit(c) - j.getBCHDigit(j.G18);) {
            c ^= j.G18 << j.getBCHDigit(c) - j.getBCHDigit(j.G18);
          }return a << 12 | c;
        }, getBCHDigit: function getBCHDigit(a) {
          for (var c = 0; 0 != a;) {
            c++, a >>>= 1;
          }return c;
        }, getPatternPosition: function getPatternPosition(a) {
          return j.PATTERN_POSITION_TABLE[a - 1];
        }, getMask: function getMask(a, c, d) {
          switch (a) {case 0:
              return 0 == (c + d) % 2;case 1:
              return 0 == c % 2;case 2:
              return 0 == d % 3;case 3:
              return 0 == (c + d) % 3;case 4:
              return 0 == (Math.floor(c / 2) + Math.floor(d / 3)) % 2;case 5:
              return 0 == c * d % 2 + c * d % 3;case 6:
              return 0 == (c * d % 2 + c * d % 3) % 2;case 7:
              return 0 == (c * d % 3 + (c + d) % 2) % 2;default:
              throw Error("bad maskPattern:" + a);}
        }, getErrorCorrectPolynomial: function getErrorCorrectPolynomial(a) {
          for (var c = new q([1], 0), d = 0; d < a; d++) {
            c = c.multiply(new q([1, l.gexp(d)], 0));
          }return c;
        }, getLengthInBits: function getLengthInBits(a, c) {
          if (1 <= c && 10 > c) switch (a) {case 1:
              return 10;case 2:
              return 9;case s:
              return 8;case 8:
              return 8;default:
              throw Error("mode:" + a);} else if (27 > c) switch (a) {case 1:
              return 12;case 2:
              return 11;case s:
              return 16;case 8:
              return 10;default:
              throw Error("mode:" + a);} else if (41 > c) switch (a) {case 1:
              return 14;case 2:
              return 13;case s:
              return 16;case 8:
              return 12;default:
              throw Error("mode:" + a);} else throw Error("type:" + c);
        }, getLostPoint: function getLostPoint(a) {
          for (var c = a.getModuleCount(), d = 0, b = 0; b < c; b++) {
            for (var e = 0; e < c; e++) {
              for (var f = 0, i = a.isDark(b, e), g = -1; 1 >= g; g++) {
                if (!(0 > b + g || c <= b + g)) for (var h = -1; 1 >= h; h++) {
                  0 > e + h || c <= e + h || 0 == g && 0 == h || i == a.isDark(b + g, e + h) && f++;
                }
              }5 < f && (d += 3 + f - 5);
            }
          }for (b = 0; b < c - 1; b++) {
            for (e = 0; e < c - 1; e++) {
              if (f = 0, a.isDark(b, e) && f++, a.isDark(b + 1, e) && f++, a.isDark(b, e + 1) && f++, a.isDark(b + 1, e + 1) && f++, 0 == f || 4 == f) d += 3;
            }
          }for (b = 0; b < c; b++) {
            for (e = 0; e < c - 6; e++) {
              a.isDark(b, e) && !a.isDark(b, e + 1) && a.isDark(b, e + 2) && a.isDark(b, e + 3) && a.isDark(b, e + 4) && !a.isDark(b, e + 5) && a.isDark(b, e + 6) && (d += 40);
            }
          }for (e = 0; e < c; e++) {
            for (b = 0; b < c - 6; b++) {
              a.isDark(b, e) && !a.isDark(b + 1, e) && a.isDark(b + 2, e) && a.isDark(b + 3, e) && a.isDark(b + 4, e) && !a.isDark(b + 5, e) && a.isDark(b + 6, e) && (d += 40);
            }
          }for (e = f = 0; e < c; e++) {
            for (b = 0; b < c; b++) {
              a.isDark(b, e) && f++;
            }
          }a = Math.abs(100 * f / c / c - 50) / 5;return d + 10 * a;
        } }, l = { glog: function glog(a) {
          if (1 > a) throw Error("glog(" + a + ")");return l.LOG_TABLE[a];
        }, gexp: function gexp(a) {
          for (; 0 > a;) {
            a += 255;
          }for (; 256 <= a;) {
            a -= 255;
          }return l.EXP_TABLE[a];
        }, EXP_TABLE: Array(256),
        LOG_TABLE: Array(256) }, m = 0; 8 > m; m++) {
        l.EXP_TABLE[m] = 1 << m;
      }for (m = 8; 256 > m; m++) {
        l.EXP_TABLE[m] = l.EXP_TABLE[m - 4] ^ l.EXP_TABLE[m - 5] ^ l.EXP_TABLE[m - 6] ^ l.EXP_TABLE[m - 8];
      }for (m = 0; 255 > m; m++) {
        l.LOG_TABLE[l.EXP_TABLE[m]] = m;
      }q.prototype = { get: function get(a) {
          return this.num[a];
        }, getLength: function getLength() {
          return this.num.length;
        }, multiply: function multiply(a) {
          for (var c = Array(this.getLength() + a.getLength() - 1), d = 0; d < this.getLength(); d++) {
            for (var b = 0; b < a.getLength(); b++) {
              c[d + b] ^= l.gexp(l.glog(this.get(d)) + l.glog(a.get(b)));
            }
          }return new q(c, 0);
        }, mod: function mod(a) {
          if (0 > this.getLength() - a.getLength()) return this;for (var c = l.glog(this.get(0)) - l.glog(a.get(0)), d = Array(this.getLength()), b = 0; b < this.getLength(); b++) {
            d[b] = this.get(b);
          }for (b = 0; b < a.getLength(); b++) {
            d[b] ^= l.gexp(l.glog(a.get(b)) + c);
          }return new q(d, 0).mod(a);
        } };p.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];p.getRSBlocks = function (a, c) {
        var d = p.getRsBlockTable(a, c);if (void 0 == d) throw Error("bad rs block @ typeNumber:" + a + "/errorCorrectLevel:" + c);for (var b = d.length / 3, e = [], f = 0; f < b; f++) {
          for (var h = d[3 * f + 0], g = d[3 * f + 1], j = d[3 * f + 2], l = 0; l < h; l++) {
            e.push(new p(g, j));
          }
        }return e;
      };p.getRsBlockTable = function (a, c) {
        switch (c) {case 1:
            return p.RS_BLOCK_TABLE[4 * (a - 1) + 0];case 0:
            return p.RS_BLOCK_TABLE[4 * (a - 1) + 1];case 3:
            return p.RS_BLOCK_TABLE[4 * (a - 1) + 2];case 2:
            return p.RS_BLOCK_TABLE[4 * (a - 1) + 3];}
      };t.prototype = { get: function get(a) {
          return 1 == (this.buffer[Math.floor(a / 8)] >>> 7 - a % 8 & 1);
        }, put: function put(a, c) {
          for (var d = 0; d < c; d++) {
            this.putBit(1 == (a >>> c - d - 1 & 1));
          }
        }, getLengthInBits: function getLengthInBits() {
          return this.length;
        }, putBit: function putBit(a) {
          var c = Math.floor(this.length / 8);this.buffer.length <= c && this.buffer.push(0);a && (this.buffer[c] |= 128 >>> this.length % 8);this.length++;
        } };"string" === typeof h && (h = { text: h });h = r.extend({}, { render: "canvas", width: 256, height: 256, typeNumber: -1,
        correctLevel: 2, background: "#ffffff", foreground: "#000000" }, h);return this.each(function () {
        var a;if ("canvas" == h.render) {
          a = new o(h.typeNumber, h.correctLevel);a.addData(h.text);a.make();var c = document.createElement("canvas");c.width = h.width;c.height = h.height;for (var d = c.getContext("2d"), b = h.width / a.getModuleCount(), e = h.height / a.getModuleCount(), f = 0; f < a.getModuleCount(); f++) {
            for (var i = 0; i < a.getModuleCount(); i++) {
              d.fillStyle = a.isDark(f, i) ? h.foreground : h.background;var g = Math.ceil((i + 1) * b) - Math.floor(i * b),
                  j = Math.ceil((f + 1) * b) - Math.floor(f * b);d.fillRect(Math.round(i * b), Math.round(f * e), g, j);
            }
          }
        } else {
          a = new o(h.typeNumber, h.correctLevel);a.addData(h.text);a.make();c = r("<table></table>").css("width", h.width + "px").css("height", h.height + "px").css("border", "0px").css("border-collapse", "collapse").css("background-color", h.background);d = h.width / a.getModuleCount();b = h.height / a.getModuleCount();for (e = 0; e < a.getModuleCount(); e++) {
            f = r("<tr></tr>").css("height", b + "px").appendTo(c);for (i = 0; i < a.getModuleCount(); i++) {
              r("<td></td>").css("width", d + "px").css("background-color", a.isDark(e, i) ? h.foreground : h.background).appendTo(f);
            }
          }
        }a = c;jQuery(a).appendTo(this);
      });
    };
  })(jQuery);
  ;

  var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;
  ;

  var _temp2 = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;

  /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(55)))

/***/ },
/* 62 */
/***/ function(module, exports) {

  "use strict";

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

  /**
   * tiny-slider
   * @version 0.3.0
   * @author William Lin
   * @license The MIT License (MIT)
   * @github https://github.com/ganlanyuan/tiny-slider/
   **/
  !function (t) {
    window.tinySlider = t();
  }(function () {
    "use strict";
    function t() {
      for (var t, e, i, n = arguments[0] || {}, a = 1, s = arguments.length; s > a; a++) {
        if (null !== (t = arguments[a])) for (e in t) {
          i = t[e], n !== i && void 0 !== i && (n[e] = i);
        }
      }return n;
    }function e(t, e, i) {
      t = t || window;var n = e + Math.round(99999999 * Math.random());t.attachEvent ? (t["e" + n] = i, t[n] = function () {
        t["e" + n](window.event);
      }, t.attachEvent("on" + e, t[n])) : t.addEventListener(e, i, !1);
    }function i(t) {
      return t * (180 / Math.PI);
    }function n(t, e) {
      return Math.abs(90 - Math.abs(t)) >= 90 - e ? "horizontal" : Math.abs(90 - Math.abs(t)) <= e ? "vertical" : !1;
    }function a(t) {
      return t && "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) ? Object.keys(t) : !1;
    }function s(t, e) {
      if (t && "object" == (typeof t === "undefined" ? "undefined" : _typeof(t))) {
        for (var i = [], n = 0; n < e.length; n++) {
          var a = e[n];i.push(t[a]);
        }return i;
      }return !1;
    }function o() {
      return document.documentElement.clientWidth;
    }function r(t, e, i) {
      var n = o();if (void 0 === t.length || void 0 === e || t.length !== e.length) return i;if (n < t[0]) return i;if (n >= t[t.length - 1]) return e[e.length - 1];for (var a = 0; a < t.length - 1; a++) {
        if (n >= t[a] && n <= t[a + 1]) return e[a];
      }
    }function l(t) {
      for (var e = document.documentElement, i = 0; i < t.length; i++) {
        if (t[i] in e.style) return t[i];
      }
    }function c(t) {
      var e;if (t.container) {
        e = void 0 === t.container.length ? [t.container] : t.container;for (var i = 0; i < e.length; i++) {
          var n = t;n.container = e[i];var a = new d(n);
        }
      }
    }function d(i) {
      if (i = t({ container: document.querySelector(".slider"), items: 1, fixedWidth: !1, maxContainerWidth: !1, slideByPage: !1, nav: !0, navText: ["prev", "next"], navContainer: !1, dots: !0, dotsContainer: !1, arrowKeys: !1, speed: 250, autoplay: !1, autoplayTimeout: 5e3, autoplayDirection: "forward", loop: !0, responsive: !1, lazyload: !1, offset: 0, touch: !0 }, i || {}), this.container = i.container, this.children = this.container.children, this.cl = this.cul = this.children.length, this.fw = i.fixedWidth, this.nav = i.nav, this.navText = i.navText, this.navContainer = i.navContainer, this.dots = i.dots, this.dotsContainer = i.dotsContainer, this.arrowKeys = i.arrowKeys, this.speed = v ? i.speed : 0, this.autoplay = i.autoplay, this.autoplayTimeout = i.autoplayTimeout, this.autoplayDirection = "forward" === i.autoplayDirection ? 1 : -1, this.loop = i.loop, this.slideByPage = i.slideByPage, this.responsive = this.fw ? !1 : i.responsive, this.lazyload = i.lazyload, this.touch = i.touch, this.bp = a(this.responsive), this.vals = s(this.responsive, this.bp), this.itemsMax = void 0 !== this.vals.length ? Math.max.apply(Math, this.vals) : i.items, this.items = this.fw ? Math.floor(this.container.parentNode.offsetWidth / this.fw) : r(this.bp, this.vals, i.items), this.fw && i.maxContainerWidth ? this.itemsMax = Math.ceil(i.maxContainerWidth / this.fw) : this.fw && (this.loop = !1), this.itemsMax = Math.min(this.cl, this.itemsMax), this.items = Math.min(this.cl, this.items), this.dotsCount = this.dotsContainer ? this.cl : Math.ceil(this.cl / this.items), this.animating = !1, this.index = 0, this.lazyload && (this.offset = i.offset, this.viewport = {}, this.sliderRect = {}, this.viewport.top = 0 - this.offset, this.viewport.left = 0 - this.offset, this.inview = !1), this.touch) {
        this.startX = 0, this.startY = 0, this.translateX = 0, this.distX = 0, this.distY = 0, this.rt = 0, this.panDir = !1, this.run = !1, this.animating = !1, this.slideEventAdded = !1;var n = this;!this.slideEventAdded && this.container.addEventListener && (this.container.addEventListener("touchstart", n.onPanStart(n), !1), this.container.addEventListener("touchmove", n.onPanMove(n), !1), this.container.addEventListener("touchend", n.onPanEnd(n), !1), this.container.addEventListener("touchcancel", n.onPanEnd(n), !1), this.slideEventAdded = !0);
      }this.init();var o = this,
          l;if (e(window, "resize", function () {
        clearTimeout(l), l = setTimeout(function () {
          o.items = o.fw ? Math.floor(o.container.parentNode.offsetWidth / o.fw) : r(o.bp, o.vals, i.items), o.items = Math.min(o.cl, o.items), o.dotsCount = o.dotsContainer ? o.cl : Math.ceil(o.cl / o.items), o.speed = o.slideByPage ? i.speed * o.items : i.speed, o.setDotCurrent(o), o.makeLayout(o), o.setSnapInterval(o), o.translate(o), o.dots && !o.dotsContainer && (o.displayDots(o), o.dotActive(o)), o.lazyload && (o.saveViewport(o), o.sliderInView(o), o.lazyLoad(o));
        }, 100);
      }), e(window, "scroll", function () {
        o.lazyload && (o.saveViewport(o), o.sliderInView(o), o.lazyLoad(o));
      }), this.nav && (e(this.next, "click", function () {
        o.onNavClick(o, 1);
      }), e(this.prev, "click", function () {
        o.onNavClick(o, -1);
      })), this.arrowKeys && e(document, "keydown", function (t) {
        t = t || window.event, 37 === t.keyCode ? o.onNavClick(o, -1) : 39 === t.keyCode && o.onNavClick(o, 1);
      }), this.dots) for (var c = 0; c < this.allDots.length; c++) {
        e(this.allDots[c], "click", this.fireDotClick(this));
      }this.autoplay && setInterval(function () {
        o.onNavClick(o, o.autoplayDirection);
      }, o.autoplayTimeout);
    }Array.isArray || (Array.isArray = function (t) {
      return "[object Array]" === Object.prototype.toString.call(t);
    });var _h = function h(t, e) {
      return (_h = document.documentElement.classList ? function (t, e) {
        return t.classList.contains(e);
      } : function (t, e) {
        if (!t || !t.className) return !1;var i = new RegExp("(^|\\s)" + e + "(\\s|$)");return t.className.match(i);
      })(t, e);
    },
        _u = function u(t, e) {
      (_u = document.documentElement.classList ? function (t, e) {
        t.classList.add(e);
      } : function (t, e) {
        return t ? void (_h(t, e) || (t.className += (t.className ? " " : "") + e)) : !1;
      })(t, e);
    },
        _f = function f(t, e) {
      (_f = document.documentElement.classList ? function (t, e) {
        t.classList.remove(e);
      } : function (t, e) {
        if (!t || !t.className) return !1;var i = new RegExp("(^|\\s)" + e + "(\\s|$)", "g");t.className = t.className.replace(i, "$2");
      })(t, e);
    },
        _m = function m(t, e) {
      return (_m = document.documentElement.classList ? function (t, e) {
        return t.classList.toggle(e);
      } : function (t, e) {
        return _h(t, e) ? (_f(t, e), !1) : (_u(t, e), !0);
      })(t, e);
    };Object.keys || (Object.keys = function (t) {
      if (t !== Object(t)) throw new TypeError("Object.keys called on a non-object");var e = [],
          i;for (i in t) {
        Object.prototype.hasOwnProperty.call(t, i) && e.push(i);
      }return e;
    });var v = l(["transitionDuration", "WebkitTransitionDuration", "MozTransitionDuration", "OTransitionDuration"]),
        p = l(["transform", "WebkitTransform", "MozTransform", "OTransform"]);return d.prototype = { getAbsIndex: function getAbsIndex(t) {
        return t.index < 0 ? t.index + t.cl : t.index >= t.cl ? t.index - t.cl : t.index;
      }, setTD: function setTD(t, e) {
        v && (t.container.style[v] = t.speed * e / 1e3 + "s", t.animating = !0);
      }, setDotCurrent: function setDotCurrent(t) {
        if (t.dotCurrent = t.dotsContainer ? t.getAbsIndex(t) : Math.floor(t.getAbsIndex(t) / t.items), !t.loop && !t.dotsContainer) {
          var e = /^-?[0-9]+$/,
              i = e.test(t.cl / t.items);i || t.index !== t.cl - t.items || (t.dotCurrent += 1);
        }
      }, init: function init() {
        var t = this.container,
            i = t.parentNode,
            n = t.nextSibling;_u(t, "tiny-content");var a = document.createElement("div"),
            s = a.cloneNode(!0);if (s.className = "tiny-slider", s.appendChild(t), n ? i.insertBefore(s, n) : i.appendChild(s), navigator.msMaxTouchPoints && (_u(s, "ms-touch"), e(s, "scroll", function () {
          v && (el.container.style[v] = "0s"), el.container.style.transform = "translate3d(-" + -el.container.scrollLeft() + "px,0,0)";
        })), this.dots) if (this.dotsContainer) this.allDots = this.dotsContainer.children, _u(this.allDots[0], "tiny-active");else {
          var o = a.cloneNode(!0),
              r = a.cloneNode(!0);o.className = "tiny-dots", r.className = "tiny-dot";var l = this;!function () {
            for (var t = l.cl - 1; t >= 0; t--) {
              var e = t > 0 ? r.cloneNode(!0) : r;o.appendChild(e);
            }
          }(), s.appendChild(o), this.allDots = o.querySelectorAll(".tiny-dot");
        }if (this.nav) {
          var c;if (this.navContainer) c = this.navContainer.children, this.prev = c[0], this.next = c[1];else {
            c = a.cloneNode(!0);var d = a.cloneNode(!0),
                h = a.cloneNode(!0);c.className = "tiny-nav", d.className = "tiny-prev", h.className = "tiny-next", 2 === this.navText.length && (d.innerHTML = this.navText[0], h.innerHTML = this.navText[1]), c.appendChild(d), c.appendChild(h), s.appendChild(c), this.prev = d, this.next = h;
          }
        }if (this.loop) {
          var f = [],
              m = [],
              p = this.container.children[0],
              l = this;!function () {
            for (var t = 0; t < l.itemsMax; t++) {
              var e = l.children[t].cloneNode(!0),
                  i = l.children[l.children.length - 1 - t].cloneNode(!0);f.push(e), m.push(i);
            }
          }(), function () {
            for (var e = 0; e < f.length; e++) {
              t.appendChild(f[e]);
            }
          }(), function () {
            for (var e = m.length - 1; e >= 0; e--) {
              t.insertBefore(m[e], p);
            }
          }(), this.cul = t.children.length, this.children = t.children;
        }this.setDotCurrent(this), this.makeLayout(this), this.setSnapInterval(this), this.translate(this), this.itemActive(this), this.dots && !this.dotsContainer && (this.displayDots(this), this.dotActive(this)), this.lazyload && (this.saveViewport(this), this.sliderInView(this), this.lazyLoad(this));
      }, makeLayout: function makeLayout(t) {
        t.itemWidth = t.fw ? t.fw : t.container.parentNode.offsetWidth / t.items, t.container.style.width = t.itemWidth * t.cul + "px";for (var e = 0; e < t.cul; e++) {
          t.children[e].style.width = t.itemWidth + "px";
        }if (t.loop) {
          var i = -(t.itemsMax * t.itemWidth);t.container.style.marginLeft = i + "px";
        }
      }, setSnapInterval: function setSnapInterval(t) {
        navigator.msMaxTouchPoints && (t.container.parentNode.style.msScrollSnapPointsX = "snapInterval(0%, " + t.itemWidth + ")");
      }, itemActive: function itemActive(t) {
        for (var e = t.loop ? t.index + t.itemsMax : t.index, i = 0; i < t.cul; i++) {
          i === e ? (_u(t.children[i], "tiny-current"), _u(t.children[i], "tiny-visible")) : i > e && i < e + t.items ? (_f(t.children[i], "tiny-current"), _u(t.children[i], "tiny-visible")) : (_f(t.children[i], "tiny-current"), _f(t.children[i], "tiny-visible"));
        }
      }, displayDots: function displayDots(t) {
        for (var e = 0; e < t.allDots.length; e++) {
          e < t.dotsCount ? _f(t.allDots[e], "tiny-hide") : _u(t.allDots[e], "tiny-hide");
        }
      }, dotActive: function dotActive(t) {
        if (t.dots) for (var e = 0; e < t.dotsCount; e++) {
          e === t.dotCurrent ? _u(t.allDots[e], "tiny-active") : _f(t.allDots[e], "tiny-active");
        }
      }, translate: function translate(t) {
        var e = t.container.parentNode.offsetWidth,
            i;i = -t.itemWidth * t.index, t.fw && !t.loop && (i = Math.max(i, -(t.cul * t.itemWidth - e))), p ? t.container.style[p] = "translate3d(" + i + "px, 0, 0)" : t.container.style.left = i + "px";
      }, fallback: function fallback(t) {
        if (t.loop) {
          var e = t.slideByPage ? t.index < -(t.itemsMax - t.items) : t.index <= -t.itemsMax,
              i = t.slideByPage ? t.index > t.cl + t.itemsMax - 2 * t.items - 1 : t.index >= t.cl + t.itemsMax - t.items;t.fw && t.itemsMax && !t.slideByPage && (i = t.index >= t.cl + t.itemsMax - t.items - 1), e && (t.index += t.cl), i && (t.index -= t.cl), v && (t.container.style[v] = "0s"), t.translate(t);
        }
      }, update: function update(t) {
        t.fallback(t), t.itemActive(t), t.dotActive(t), t.lazyLoad(t), t.animating = !1;
      }, onNavClick: function onNavClick(t, e) {
        if (!t.animating) {
          var i, n;e = t.slideByPage ? e * t.items : e, n = Math.abs(e), i = t.index + e, t.index = t.loop ? i : Math.max(0, Math.min(i, t.cl - t.items)), t.setTD(t, n), t.translate(t), t.setDotCurrent(t), setTimeout(function () {
            t.update(t);
          }, t.speed * n);
        }
      }, fireDotClick: function fireDotClick(t) {
        return function () {
          for (var e, i = 0; i < t.allDots.length; i++) {
            t.allDots[i] === this && (e = i);
          }t.onDotClick(t, e);
        };
      }, onDotClick: function onDotClick(t, e) {
        if (!t.animating) {
          var i, n;i = t.dotsContainer ? e : e * t.items, i = t.loop ? i : Math.min(i, t.cl - t.items), n = Math.abs(i - t.index), t.index = i, t.setTD(t, n), t.translate(t), t.dotCurrent = e, setTimeout(function () {
            t.update(t);
          }, t.speed * n);
        }
      }, saveViewport: function saveViewport(t) {
        t.viewport.bottom = document.documentElement.clientHeight + t.offset, t.viewport.right = document.documentElement.clientWidth + t.offset;
      }, sliderInView: function sliderInView(t) {
        var e = t.container.parentNode.getBoundingClientRect();t.sliderRect.left = e.left, t.sliderRect.right = e.right, t.sliderRect.top = e.top, t.sliderRect.bottom = e.bottom, t.inview = e.right > t.viewport.left && e.bottom > t.viewport.top && e.left < t.viewport.right && e.top < t.viewport.bottom;
      }, elementInView: function elementInView(t, e) {
        var i = t.getBoundingClientRect();return i.right > e.left && i.bottom > e.top && i.left < e.right && i.top < e.bottom;
      }, lazyLoad: function lazyLoad(t) {
        if (t.inview) {
          var e = t.container.querySelectorAll(".tiny-lazy");if (e) for (var i = 0; i < e.length; i++) {
            t.elementInView(e[i], t.sliderRect) && -1 === e[i].className.indexOf("loaded") && (e[i].src = e[i].getAttribute("data-src"), e[i].className += " loaded");
          }
        }
      }, onPanStart: function onPanStart(t) {
        return function (e) {
          var i = e.changedTouches[0];t.startX = parseInt(i.clientX), t.startY = parseInt(i.clientY);
        };
      }, onPanMove: function onPanMove(t) {
        return function (e) {
          var a = e.changedTouches[0];if (t.distX = parseInt(a.clientX) - t.startX, t.distY = parseInt(a.clientY) - t.startY, t.rt = i(Math.atan2(t.distY, t.distX)), t.panDir = n(t.rt, 15), "horizontal" === t.panDir && t.animating === !1 && (t.run = !0), t.run) {
            v && (t.container.style[v] = "0s");var s = t.loop ? -(t.cl + t.itemsMax - t.items) * t.itemWidth : -(t.cl - t.items) * t.itemWidth,
                o = t.loop ? t.itemsMax * t.itemWidth : 0;!t.loop && t.fw && (s = -(t.cl * t.itemWidth - t.container.parentNode.offsetWidth)), t.translateX = -t.index * t.itemWidth + t.distX, t.translateX = Math.max(s, Math.min(t.translateX, o)), p ? t.container.style[p] = "translate3d(" + t.translateX + "px, 0, 0)" : t.container.style.left = t.translateX + "px", e.preventDefault();
          }
        };
      }, onPanEnd: function onPanEnd(t) {
        return function (e) {
          var i = e.changedTouches[0];if (t.distX = parseInt(i.clientX) - t.startX, t.run && 0 !== t.distX) {
            e.preventDefault(), t.run = !1, t.translateX = -t.index * t.itemWidth + t.distX;var n,
                a = t.loop ? -t.itemsMax : 0,
                s = t.loop ? t.cl + t.itemsMax - t.items : t.cl - t.items;n = -(t.translateX / t.itemWidth), n = t.distX < 0 ? Math.ceil(n) : Math.floor(n), n = Math.max(a, Math.min(n, s)), t.index = n, t.setTD(t, 1), t.translate(t), t.setDotCurrent(t), setTimeout(function () {
              t.update(t);
            }, t.speed);
          }
        };
      } }, c;
  });
  ;

  var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;
  ;

  var _temp2 = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
      return;
    }
  }();

  ;

/***/ }
/******/ ]);
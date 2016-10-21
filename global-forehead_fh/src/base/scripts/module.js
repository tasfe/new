/**
 * `Module`用于创建一个逻辑封装完整的模块。模块可以将一个大的应用`Application`分成多个文件,
 * 也可以用来构建应用独立的组件。
 */
Base.Module = function(moduleName, app, options) {

  this.moduleName = moduleName;
  this.options = _.extend({}, this.options, options);
  // 允许用户为每一个模块指定`initialize`方法
  this.initialize = options.initialize || this.initialize;

  this.subsribes = [];

  // 用于存放子模块
  this.submodules = {};

  this._setupInitializersAndFinalizers();

  // 在模块内部创建一个`app`映射
  this.app = app;

  if (_.isFunction(this.initialize)) {
    this.initialize(moduleName, app, this.options);
  }
};

Base.Module.extend = Base.extend;

_.extend(Base.Module.prototype, Backbone.Events, {

  // 默认情况下，模块从它们的父模块(s)开始
  startWithParent: true,

  /**
   * 钩子函数，用户可以自定义初始化业务逻辑
   * 参数:
   *   moduleName
   *   app
   *   options
   */
  initialize: function() {},

  /**
   * 添加一个`initializer`, 当`start`方法被调用的时候执行
   */
  addInitializer: function(initializer) {
    this._initializerCallbacks.add(initializer);
  },

  /**
   * 添加一个`finalizer`, 当`stop`方法被调用的时候执行
   */
  addFinalizer: function(finalizer) {
    this._finalizerCallbacks.add(finalizer);
  },

  /**
   * 启动模块，运行所有的`initializers`
   */
  start: function(options) {
    if (this._isInitialized) {
      return;
    }

    // 启动`sub-modules`
    _.each(this.submodules, function(mod) {
      // 检查是否启动`sub-modules`
      if (mod.startWithParent) {
        mod.start(options);
      }
    });

    this.triggerMethod('before:start', options);

    this._initializerCallbacks.run(options, this);
    this._isInitialized = true;

    this.triggerMethod('start', options);
  },

  /**
   * 停止所有模块，运行`finalizers`，同时停止该模块所有的子模块
   */
  stop: function() {
    if (!this._isInitialized) {
      return;
    }
    this._isInitialized = false;

    this.triggerMethod('before:stop');

    // 停止`sub-modules`
    _.invoke(this.submodules, 'stop');

    // 执行 finalizers
    this._finalizerCallbacks.run(undefined, this);

    // 重置模块所有的 initializers and finalizers
    this._initializerCallbacks.reset();
    this._finalizerCallbacks.reset();

    this.triggerMethod('stop');
  },

  /**
   * 添加模块的定义信息，以及自定义参数
   */
  addDefinition: function(moduleDefinition, customArgs) {
    this._runModuleDefinition(moduleDefinition, customArgs);
  },

  _runModuleDefinition: function(definition, customArgs) {
    // If there is no definition short circut the method.
    if (!definition) {
      return;
    }

    // build the correct list of arguments for the module definition
    var args = _.flatten([
      this,
      this.app,
      Backbone,
      Base,
      Backbone.$,
      _,
      customArgs
    ]);

    definition.apply(this, args);
  },

  _setupInitializersAndFinalizers: function() {
    this._initializerCallbacks = new Base.Callbacks();
    this._finalizerCallbacks = new Base.Callbacks();
  },

  triggerMethod: Base.triggerMethod,

  subscribe: function(subscriber, channel, callback, options) {
    if (Base.MediatorFacade.subscribe(subscriber, channel, callback, options)) {
      this.subsribes.push({
        subscriber: subscriber,
        channel: channel,
        callback: callback
      });
    }
  },

  publish: Base.MediatorFacade.publish,

  unSubscribe: Base.MediatorFacade.unSubscribe

});

_.extend(Base.Module, {

  /**
   * 创建一个模块
   */
  create: function(app, moduleNames, moduleDefinition) {
    var module = app;

    // 获取传入的`moduleDefinition`之后的参数
    var customArgs = _.rest(arguments, 3);

    // 将moduleNames分开，并获取子模块的数目，比如 `aa.bb.cc`，将被当做三个模块定义
    moduleNames = moduleNames.split('.');
    var length = moduleNames.length;

    // 为在模块链中得最后一个模块，存储模块定义信息
    var moduleDefinitions = [];
    moduleDefinitions[length - 1] = moduleDefinition;

    _.each(moduleNames, function(moduleName, i) {
      var parentModule = module;
      module = this._getModule(parentModule, moduleName, app, moduleDefinition);
      this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
    }, this);

    return module;
  },

  _getModule: function(parentModule, moduleName, app, def, args) {
    var options = _.extend({}, def);
    var ModuleClass = this.getClass(def);

    // 获取指定`name`的模块
    var module = parentModule[moduleName];

    if (!module) {
      // 如果不存在，创建一个新的模块
      module = new ModuleClass(moduleName, app, options);
      parentModule[moduleName] = module;
      // 将子模块存储在父模块上
      parentModule.submodules[moduleName] = module;
    }

    return module;
  },

  /**
   * 获取 `Module Classes`
   */
  getClass: function(moduleDefinition) {
    var ModuleClass = Base.Module;

    if (!moduleDefinition) {
      return ModuleClass;
    }

    if (moduleDefinition.prototype instanceof ModuleClass) {
      return moduleDefinition;
    }

    return moduleDefinition.moduleClass || ModuleClass;
  },

  _addModuleDefinition: function(parentModule, module, def, args) {
    var fn = this._getDefine(def);
    var startWithParent = this._getStartWithParent(def, module);

    if (fn) {
      module.addDefinition(fn, args);
    }

    this._addStartWithParent(parentModule, module, startWithParent);
  },

  _getStartWithParent: function(def, module) {
    var swp;

    if (_.isFunction(def) && (def.prototype instanceof Base.Module)) {
      swp = module.constructor.prototype.startWithParent;
      return _.isUndefined(swp) ? true : swp;
    }

    if (_.isObject(def)) {
      swp = def.startWithParent;
      return _.isUndefined(swp) ? true : swp;
    }

    return true;
  },

  _getDefine: function(def) {
    if (_.isFunction(def) && !(def.prototype instanceof Base.Module)) {
      return def;
    }

    if (_.isObject(def)) {
      return def.define;
    }

    return null;
  },

  _addStartWithParent: function(parentModule, module, startWithParent) {
    module.startWithParent = module.startWithParent && startWithParent;

    if (!module.startWithParent || !!module.startWithParentIsConfigured) {
      return;
    }

    module.startWithParentIsConfigured = true;

    parentModule.addInitializer(function(options) {
      if (module.startWithParent) {
        module.start(options);
      }
    });
  }
});
/**
 * 减少`Backbone.Router`处理路由事件代码，可以将事件定义在指定的`Controller`对象里面。
 *
 * 通过`appRoutes`来配置`AppRouter`
 *
 */
Base.AppRouter = Backbone.Router.extend({

  constructor: function(options) {
    this.options = options || {};

    Backbone.Router.apply(this, arguments);

    var appRoutes = this.getOption('appRoutes');
    var controller = this._getController();
    this.processAppRoutes(controller, appRoutes);
    this.on('route', this._processOnRoute, this);
  },

  /**
   * 和Backbone Router里面定义的`route`方法相似，但是该方法是在`controller`里面被调用的。
   */
  appRoute: function(route, methodName) {
    var controller = this._getController();
    this._addAppRoute(controller, route, methodName);
  },

  // 执行`route event`，如果onRoute方法存在的话，执行`onRoute`方法
  _processOnRoute: function(routeName, routeArgs) {
    if (_.isFunction(this.onRoute)) {
      var routePath = _.invert(this.getOption('appRoutes'))[routeName];
      this.onRoute(routeName, routePath, routeArgs);
    }
  },

  /**
   * 可以在`runtime`时，指定一个`controller`和多个`routes`，
   * 同时也不会改变`AppRouter`当前的`controller`。
   */
  processAppRoutes: function(controller, appRoutes) {
    if (!appRoutes) {
      return;
    }

    var routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes

    _.each(routeNames, function(route) {
      this._addAppRoute(controller, route, appRoutes[route]);
    }, this);
  },

  _getController: function() {
    return this.getOption('controller');
  },

  _addAppRoute: function(controller, route, methodName) {
    var method = controller[methodName];

    if (!method) {
      throw new Base.Error('方法 "' + methodName + '" 在指定`controller`中不存在');
    }

    this.route(route, methodName, _.bind(method, controller));
  },

  getOption: Base.proxyGetOption,

  triggerMethod: Base.triggerMethod,

  bindEntityEvents: Base.proxyBindEntityEvents,

  unbindEntityEvents: Base.proxyUnbindEntityEvents

});
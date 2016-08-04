/**
 * 使用jQuery的`Deferred`对象，管理一些列的回调函数，
 * 在未来的某个时间点执行这些回调函数。
 *
 */
Base.Callbacks = function() {
  this._deferred = Base.Deferred();
  this._callbacks = [];
};

_.extend(Base.Callbacks.prototype, {

  /**
   * 添加回调函数
   */
  add: function(callback, contextOverride) {
    var promise = _.result(this._deferred, 'promise');

    this._callbacks.push({
      cb: callback,
      ctx: contextOverride
    });

    promise.then(function(args) {
      if (contextOverride) {
        args.context = contextOverride;
      }
      callback.call(args.context, args.options);
    });
  },

  /**
   * 在指定的上下文环境`context`下，执行所有注册的回调函数。
   */
  run: function(options, context) {
    this._deferred.resolve({
      options: options,
      context: context
    });
  },

  /**
   * 重置所有回调函数
   */
  reset: function() {
    var callbacks = this._callbacks;
    this._deferred = Base.Deferred();
    this._callbacks = [];

    _.each(callbacks, function(cb) {
      this.add(cb.cb, cb.ctx);
    }, this);
  }

});
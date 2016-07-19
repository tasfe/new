var errorProps = ['description', 'fileName', 'lineNumber', 'name', 'message', 'number'];

Base.Error = Base.extend.call(Error, {

  constructor: function(message, options) {
    if (_.isObject(message)) {
      options = message;
      message = options.message;
    } else if (!options) {
      options = {};
    }

    var error = Error.call(this, message);
    _.extend(this, _.pick(error, errorProps), _.pick(options, errorProps));

    this.captureStackTrace();

    if (options.url) {
      this.url = options.url;
    }
  },

  captureStackTrace: function() {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Base.Error);
    }
  },

  toString: function() {
    return this.name + ': ' + this.message + (this.url ? ' 参考: ' + this.url : '');
  }
});

Base.Error.extend = Base.extend;
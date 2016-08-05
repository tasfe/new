define(function(require, exports, module) {

  var Model = Backbone.Model.extend({

    initialize: function(attributes, options) {
      if (options) {
        this.options = options;
        this.setOptions();
      }
      this.deferred = new Base.Deferred();
      this._ajaxOptions = {
        dataType: 'json',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Content-encoding', 'gzip, deflate');
          // xhr.setRequestHeader('Content-type', 'application/json');
          xhr.setRequestHeader('Accept', 'application/json');
        }
      };
    },

    request: null,

    fetch: function(options) {
      options = options || {};
      if (!options.success) {
        options.success = this.fetchSuccess;
      }
      if (!options.error) {
        options.error = this.fetchError;
      }
      //_.extend(options, this._ajaxOptions);
      if (!options.data) {
        options.data = {};
      }

      return Backbone.Model.prototype.fetch.call(this, options);
    },

    fetchSuccess: function(model, response) {
      if (model.deferred) {
        if (!model.request) {
          model.request = model.deferred.promise();
        }
        model.deferred.resolve();
      }
    },

    fetchError: function(model, response) {
      if (model.deferred) {
        model.deferred.reject();
      }
    },

    save: function(attrs, options) {
      options = options || {};
      _.extend(options, this._ajaxOptions);
      return this.request = Backbone.Model.prototype.save.call(this, attrs, options);
    },

    setOptions: function() {
      if (this.options && this.options.urlRoot) {
        this.urlRoot = this.options.urlRoot;
      }
    },

    setXhr: function(urlOptions) {
      if (urlOptions.url) {
        this.url = urlOptions.url;
        delete urlOptions.url;
      }
      _(this).extend(urlOptions);
    }

  });

  module.exports = Model;

});
define(function(require, exports, module) {

  var Collection = Backbone.Collection.extend({

    // Param {Object} `models` - added during call to new BaseCollection([/*models*/])
    // Param {Object} `options` - add a comparator
    initialize: function(models, options) {
      _.bindAll(this, 'fetchSuccess', 'fetchError');
      this.cid = this.cid || _.uniqueId('c');
      this.deferred = new Base.Deferred();
      // When overriding use: `Backbone.Collection.prototype.initialize.call(this, arguments);`
      this._ajaxOptions = {
        dataType: 'json',
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Content-encoding', 'gzip, deflate');
          // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          xhr.setRequestHeader('Accept', 'application/json');
        }
      };
    },

    // assign fetch return value to this.request property, 
    // fetch returns (jQuery) ajax promise object
    request: null,

    _idAttr: 'id',

    // Wrap Backbone.Collection.prototype.fetch with support for deferreds
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

      this.request = Backbone.Collection.prototype.fetch.call(this, options);
      if (!this.request) {
        this.request = this.deferred.promise();
      }

      return this.request;
    },

    // Default success and error handlers used with this.fetch() ...

    // resolve the deferred here in success
    fetchSuccess: function(collection, response) {
      //this.deferred.resolve(response);
    },

    // log response on error
    fetchError: function(collection, response) {},

    setXhr: function(urlOptions) {
      if (urlOptions.url) {
        this.url = urlOptions.url;
        delete urlOptions.url;
      }
      _(this).extend(urlOptions);
    }

  });

  module.exports = Collection;

});
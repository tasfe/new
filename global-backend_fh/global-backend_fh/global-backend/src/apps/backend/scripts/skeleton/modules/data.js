define(function(require, exports, module) {

  var DataModule = Base.Module.extend({

    startWithParent: false,

    _dataPool: [],

    set: function(name, collection) {
      this._dataPool.push({
        name: name,
        collection: collection
      });

      return collection;
    },

    get: function(name) {
      var data = _(this._dataPool).findWhere({
        name: name
      });

      return data && data.collection;
    }

  });

  module.exports = DataModule;

});
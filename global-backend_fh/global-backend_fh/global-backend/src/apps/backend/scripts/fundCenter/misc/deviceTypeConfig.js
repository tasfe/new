define(function(require, exports, module) {

  var status = [
    {
      id: 0,
      name: 'PCÍøÒ³'
    },
    {
      id: 1,
      name: 'Android'
    },
    {
      id: 2,
      name: 'IOS'
    },
    {
      id: 3,
      name: 'H5'
    }
  ];

  return {
    get: function(index) {
      return _(status).getConfig(index);
    },

    toZh: function(id) {
      return _(status).getConfigById(id);
    }
  };
});

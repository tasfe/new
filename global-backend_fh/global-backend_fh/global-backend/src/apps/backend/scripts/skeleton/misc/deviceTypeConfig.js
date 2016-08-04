define(function(require, exports, module) {

  var status = [
    {
      id: 0,
      zhName: 'PC网页'
    },
    {
      id: 1,
      zhName: 'Android'
    },
    {
      id: 2,
      zhName: 'IOS'
    },
    {
      id: 3,
      zhName: 'H5'
    }
  ];

  return {
    getAll: function() {
      return status;
    },

    get: function(index) {
      return _(status).getConfig(index);
    },

    toZh: function(id) {
      return _(status).getConfigById(id);
    }
  };
});

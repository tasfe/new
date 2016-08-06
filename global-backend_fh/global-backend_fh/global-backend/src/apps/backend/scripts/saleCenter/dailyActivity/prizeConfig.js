define(function(require, module, exports) {

  var config = [
    {
      id: 3,
      zhName: '3'
    },
    {
      id: 6,
      zhName: '6'
    },
    {
      id: 10,
      zhName: '10'
    },
    {
      id: 15,
      zhName: '15'
    },
    {
      id: 30,
      zhName: '30'
    }
  ];

  return {
    getAll: function() {
      return config;
    },
    getById: function(id) {
      return _(config).findWhere({
        id: id
      });
    },
    toZh: function(id) {
      return _(config).getConfigById(id);
    }
  };
});

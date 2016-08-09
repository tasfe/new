define(function(require, module, exports) {

  var config = [
    {
      id: 1,
      zhName: '1888元现金大奖'
    },
    {
      id: 2,
      zhName: '588元现金大奖'
    },
    {
      id: 3,
      zhName: '2888元现金大奖'
    },
    {
      id: 4,
      zhName: '单个红包'
    },
    {
      id: 5,
      zhName: '双红包'
    },
    {
      id: 6,
      zhName: '三红包'
    },
    {
      id: 7,
      zhName: '再接再厉'
    },
    {
      id: 8,
      zhName: '努力加油'
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

define(function(require, module, exports) {

  var config = [
    {
      id: 1,
      name: '福'
    },
    {
      id: 2,
      name: '禄'
    },
    {
      id: 3,
      name: '吉'
    },
    {
      id: 4,
      name: '喜'
    },
    {
      id: 5,
      name: '财'
    }
  ];

  var bonusTypeConfig = [
    {
      id: 1,
      name: '平台'
    },
    {
      id: 2,
      name: '用户'
    },
    {
      id: 3,
      name: '五福'
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

    getAllBonus: function() {
      return bonusTypeConfig;
    },
    getBonusById: function(id) {
      return _(bonusTypeConfig).findWhere({
        id: id
      });
    }
  };
});

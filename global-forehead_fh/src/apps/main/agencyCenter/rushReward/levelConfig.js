var config = [
  {
    id: 1,
    zhName: 'E'
  },
  {
    id: 2,
    zhName: 'D'
  },
  {
    id: 3,
    zhName: 'C'
  },
  {
    id: 4,
    zhName: 'B'
  },
  {
    id: 5,
    zhName: 'A'
  },
  {
    id: 6,
    zhName: 'A + 1'
  },
  {
    id: 7,
    zhName: 'A + 2'
  },
  {
    id: 8,
    zhName: 'A + 3'
  }
];

module.exports = {
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

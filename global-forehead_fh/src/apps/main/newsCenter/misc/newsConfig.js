"use strict";

var newsConfig = [
  {
    id: 1,
    name: 'fund'
  },
  {
    id: 2,
    name: 'user'
  },
  {
    id: 3,
    name: 'discount'
  }
];

module.exports = {
  get: function(id) {
    return _(newsConfig).findWhere({
      id: id
    });
  }
};

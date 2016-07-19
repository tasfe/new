"use strict";

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

var greetingConfig = [
  {
    id: 1,
    title: '恭祝您福星高照，福禄双全，后福无量！'
  },
  {
    id: 2,
    title: '恭祝您福禄双全，加官进禄，禄禄大发。'
  },
  {
    id: 3,
    title: '恭祝您喜气洋洋，喜从天降，喜上眉梢。'
  },
  {
    id: 4,
    title: '恭祝您吉星高照，吉祥如意，万事大吉。'
  },
  {
    id: 5,
    title: '恭祝您财源广进，财运亨通，恭喜发财。'
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

  getAllGreetings: function() {
    return greetingConfig;
  },
  getGreetingById: function(id) {
    return _(greetingConfig).findWhere({
      id: id
    });
  }
};

define(function (require, exports, module) {

  var Model = require('skeleton/model');

  var sideMenuModel = Model.extend({

    defaults: {
      name: '',
      link: "#",
      icon: '',
      bg: 'bg-palette1',
      id: '',
      items: []
    }

  });

  module.exports = sideMenuModel;

});
"use strict";

var Model = require('skeleton/model');

var PersonalStatesModel = Model.extend({

  url: '/acct/userinfo/stat.json',

  defaults: {
    hasMoneyPwd: false,
    hasBankCard: false,
    hasSecurity: false,
    hasEmail: false,
    email: '',
    complete: false
  },

  parse: function(res) {
    var data;
    if (res && res.result === 0) {
      data = res.root;
    }

    return data;
  }
});

module.exports = PersonalStatesModel;

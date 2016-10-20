var PlanModel = require('../models/planModel');

var Collection = require('skeleton/collection');

var PlanCollection = Collection.extend({
  model: PlanModel,

  modelId: function(ticketInfo) {
    return ticketInfo.ticketId;
  }
});

module.exports = PlanCollection;

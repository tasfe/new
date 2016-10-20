var Model = require('skeleton/model');

var PlanModel = Model.extend({
  url: '/ticket/betManager/schemelist.json',

  idAttribute: 'ticketId',

  parse: function(res) {
    var data;
    if (res && res.result === 0) {
      data = res.root;
    }

    return data;
  },

  getList: function() {
    if (this.fetched) {
      this.trigger('getList:complete', this);
    } else {
      this.fetch({
        data: {
          ticketId: this.id
        }
      });
      this.once('sync', function() {
        this.trigger('getList:complete', this);
        this.fetched = true;
      });
    }
  },

  updateSchemeXhr: function(reqData) {
    var self = this;

    return Global.sync.ajax({
      url: '/ticket/betManager/updscheme.json',
      data: reqData
    }).done(function(res) {
      if(res && res.result === 0) {
        var schemeDetail = self.getCurrentPlan(Number(reqData.schemeId));
        schemeDetail.schemeName = reqData.schemeName;
        self.trigger('getList:change', self);
      }
    });
  },

  deleteSchemePlayXhr: function(reqData) {
    var self = this;

    return Global.sync.ajax({
      url: '/ticket/betManager/delscheme.json',
      data: reqData
    }).done(function(res) {
      if(res && res.result === 0) {
        var schemeDetail = self.getCurrentPlan(Number(reqData.schemeId));

        schemeDetail.playList = _(schemeDetail.playList).filter(function(playInfo) {
          return playInfo.schemePlayId !== reqData.schemePlayId;
        });
        if (_(schemeDetail.playList).isEmpty()) {
          self.deleteCurrentPlanLocal(schemeDetail);
          self.trigger('currentList:empty', self);
        } else {
          self.trigger('getList:change', self);
        }
      }
    });
  },

  deleteCurrentPlanLocal: function(schemeDetail) {
    var planList = this.get('dateList');
    this.set('dateList', _(planList).without(schemeDetail));
  },

  getCurrentPlan: function(schemeId) {
    var planList = this.get('dateList');
    return _(planList).findWhere({
      schemeId: schemeId
    });
  }
});

module.exports = PlanModel;

define(function(require, exports, module) {

  var factory = require('bettingCenter/misc/betRulesFactory');
  var ticketConfig = require('skeleton/misc/ticketConfig');

  var SscFactory = require('bettingCenter/misc/betRulesFactory-ssc');
  var Super3kSscFactory = require('bettingCenter/misc/super3k/betRulesFactory-ssc');
  var ChooseFactory = require('bettingCenter/misc/betRulesFactory-choose5');
  var ThreeDFactory = require('bettingCenter/misc/betRulesFactory-3d');
  var P5P3Factory = require('bettingCenter/misc/betRulesFactory-p5p3');

  var sscList = ticketConfig.getSccList();

  _(sscList).each(function(ssc) {
    SscFactory.install(ssc.id);
    if(ssc.isSuper){
      Super3kSscFactory.install(ssc.id);
    }
  });

  var choose5List = ticketConfig.getChoose5List();
  _(choose5List).each(function(choose5) {
    ChooseFactory.install(choose5.id);
  });

  var threeDList = ticketConfig.get3DList();
  _(threeDList).each(function(threeD) {
    ThreeDFactory.install(threeD.id);
  });

  var p5P3List = ticketConfig.getP5P3List();
  _(p5P3List).each(function(p5P3) {
    P5P3Factory.install(p5P3.id);
  });


  var _betRules = _(factory.betRules);

  return {
    get: function(ids) {
      var play = _betRules.findWhere({
        playId: ids.playId
      });
      return play && play.rule || {};
    }
  };
});

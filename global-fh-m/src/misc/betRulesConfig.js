define(function(require, exports, module) {

  var factory = require('./betRulesFactory');
  var ticketConfig = require('./ticketConfig');

  var SscFactory = require('./betRulesFactory-ssc');
  var ChooseFactory = require('./betRulesFactory-choose5');
  var ThreeDFactory = require('./betRulesFactory-3d');
  var P5P3Factory = require('./betRulesFactory-p5p3');

  var BjPKFactory = require('./betRulesFactory-bjpk');

  var sscList = ticketConfig.getSccList();

  _(sscList).each(function(ssc) {
    SscFactory.install(ssc.id);
  });

  _(sscList).each(function(ssc) {
    SscFactory.install(ssc.id);
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

  var bjPKList = ticketConfig.getHappyList();
  _(bjPKList).each(function(bjpk) {
    BjPKFactory.install(bjpk.id);
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

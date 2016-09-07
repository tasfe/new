define(function (require, exports, module) {

  var UserResetView = Base.ItemView.extend({

    template: require('text!userCenter/templates/user-userDrop.html'),

    events: {},

    onRender: function () {
      var self = this;

      var userName = self.options.name;
      this.$('.js-ul-username').html(self.options.name);
      this.$('.js-ul-userRabate').html(self.options.rebate/10);
      this.$('.js-ul-validRabate').text("(0-"+(Number(self.options.rebate/10)-0.1).toFixed(1)+"%)");
      this.$('.js-ul-userGroup').html(self.options.group);
      //this.$('.js-ul-username').html(userName);
    }
  })

  module.exports = UserResetView;
});
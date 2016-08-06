define(function (require, exports, module) {

    var UserSecurityView = Base.ItemView.extend({

        template: require('text!userCenter/templates/user-userSecurity.html'),


        events: {

        }

});

    module.exports = UserSecurityView;
});
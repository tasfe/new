"use strict";

var SettingEmail = Base.ItemView.extend({

    template: require('accountCenter/templates/settingEmail.html'),

    className: 'as-loginPwd-view',
    
    events: {
        'click .js-modefy-email': 'modefyEmailHandler'

    },

    initialize: function() {
        
    },

    onRender: function() {
        
    },

    modefyEmailHandler:function () {
            alert(323)
    }


});

module.exports = SettingEmail;
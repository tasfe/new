define(function (require, exports, module) {

    var AgUserRebateView = Base.ItemView.extend({

        template: require('text!agGame/userManagement/ag-userRebate.html'),

        events: {},


        onRender: function () {
            var self = this;
            this.$('.js-ag-username').html(self.options.name);
            this.$('.js-ag-open[value='+self.options.open+']').prop('checked',true);
        }
    });

    module.exports = AgUserRebateView;
});
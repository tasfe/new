define(function (require, exports, module) {

    var newBlackIpView = Base.ItemView.extend({

        template: require('text!globalCenter/templates/newBlackIp.html'),

        events: {
            'blur .js-bl-title': 'checkIpExistHandler'
        },
        initialize: function () {
        },
        checkUserExistXhr:function(data){
            return Global.sync.ajax({
                url: '/intra/ipblacklist/checkipexits.json',
                data: data
            });
        },
        onRender: function () {},
        checkIpExistHandler: function(e){
            var self = this;
            var data = {
                Ip:$(e.currentTarget).val()
            };
            this.checkUserExistXhr(data).fail(function(){
            }).done(function(res){
                if(res.result===0){
                    self.$('.js-bl-tip').addClass('hidden');
                }else{
                    self.$('.js-bl-tip').removeClass('hidden');
                }
            });
        }

    });

    module.exports = newBlackIpView;
});
//56250
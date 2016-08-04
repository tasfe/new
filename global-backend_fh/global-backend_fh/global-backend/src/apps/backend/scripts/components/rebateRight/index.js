/**
 * Created by Administrator on 2016/1/20.
 */
define(function (require, exports, module) {

    var selectAllUserView = Base.ItemView.extend({

        template: require('text!./rebate-Right-Config.html'),

        events: {
            'click .js-pf-allUser': 'selectAllUserHandler',
            'click .js-pf-userLevel': 'checkAllUserSelectHandler'
        },

        initialize: function () {

        },
        onRender: function () {
            this.initSelectOption(this.options.userLevel);
        },
        initSelectOption: function(userLevel){
            var self = this;
            _(userLevel?userLevel:[]).each(function(item){
                self.$(".js-pf-userLevel[value='"+item+"']").prop('checked',true);
            });
            if(this.options.disabled===1){
                var flag = true;
                this.$('.js-pf-allUser').prop("checked",true);
                this.$('.js-pf-allUser').attr("disabled",true);
                this.$('.js-pf-userLevel').each(function () {
                    $(this).attr("disabled",true);
                    if( !$(this).prop("checked") && flag){
                        self.$('.js-pf-allUser').prop("checked",false);
                        flag = false;
                    }
                });
            }
        },

        selectAllUserHandler: function(){
            var $target = this.$('.js-pf-allUser');
            var checked = $target.prop('checked');
            if(checked){
                this.$('.js-pf-userLevel').each(function () {
                    $(this).prop(checked,true);
                });
            }else{
                this.$('.js-pf-userLevel').each(function () {
                    $(this).prop(checked,false);
                });
            }
        },
        checkAllUserSelectHandler: function(){
            var flag = true;
            var $target = this.$('.js-pf-userLevel');
            this.$('.js-pf-userLevel').each(function () {
                var checked = $(this).prop('checked');
                if(!checked){
                    flag = false;
                }
            });
            this.$('.js-pf-allUser').prop('checked',flag);
        }

    });

    module.exports = selectAllUserView;
});
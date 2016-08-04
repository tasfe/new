define(function (require, exports, module) {

    var AddAmountView = Base.ItemView.extend({

        template: require('text!saleCenter/templates/games-addAmount.html'),

        events: {
        },
        initialize: function () {
        },
        onRender: function () {
            var self = this;
            //文本导入
            this.$('.js-gm-fileUpload-btn').fileLoad({
                title: '批量导入用户名',
                done: function (res) {
                //显示图片
                    self.$('.js-gm-usernameList').val(res.root);
                },
                fail: function(){
                    Global.ui.notification.show('操作失败。');
                }
            });
        }

    });

    module.exports = AddAmountView;
});
//56250
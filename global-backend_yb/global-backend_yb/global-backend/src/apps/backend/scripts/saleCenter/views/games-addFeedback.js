define(function (require, exports, module) {

    var AddFeedBackView = Base.ItemView.extend({

        template: require('text!saleCenter/templates/games-addFeedBack.html'),

        events: {

        },
        initialize: function () {
        },
        onRender: function () {
            var self = this;
            //文本导入
            this.$('.js-fm-fileUpload-btn').fileLoad({
                title: '批量导入用户名',
                done: function (res) {
                //显示图片
                    self.$('.js-fm-usernameList').val(res.root);
                },
                fail: function(){
                    Global.ui.notification.show('操作失败。');
                }
            });
        }

    });

    module.exports = AddFeedBackView;
});
//56250
define(function (require, exports, module) {

    var AddUsersView = Base.ItemView.extend({

        template: require('text!saleCenter/templates/games-addUsers.html'),

        events: {
        },
        initialize: function () {
        },
        onRender: function () {
            var self = this;
            //文本导入
            this.$('.js-qm-fileUpload-btn').fileLoad({
                title: '批量导入用户名',
                done: function (res) {
                //显示图片
                    self.$('.js-qm-usernameList').val(res.root);
                },
                fail: function(){
                    Global.ui.notification.show('操作失败。');
                }
            });
        }

    });

    module.exports = AddUsersView;
});
//56250
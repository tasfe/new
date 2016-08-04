define(function (require, exports, module) {

    var UserDisableView = Base.ItemView.extend({

        template: require('text!userCenter/templates/user-userDisable.html'),

        events: {},

        getDisableRecordXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/usermanager/getenbaledrecord.json',
                data: data
            });
        },

        onRender: function () {
            var self = this;

            var userName = self.options.name;
            this.$('.js_ul_username').html(userName);

            var a = self.getDisableRecordXhr({userId: self.options.userId}).done(function (res) {
                if (res && res.result === 0) {
                    if (_(res.root).size() > 0) {

                        self.$('.js_ul_disable').html('<button type="button" class="btn btn-danger" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">' +
                            '点击查看记录</button>');
                        self.$('.js-ul-viewDisable').html('<div class="js-ul-showRecord collapse" id="collapseExample"><div class="well height-md overflow-auto">' +
                            '</div></div>');
                        var record= _(res.root).map(function (record) {
                            return '<table class="table">' +
                                '<thead><tr><th class="col-sm-9">'+_(record.createTime).toTime()+'</th><th>'+record.createrName+'</th><th>'+record.userManageType+'</th></tr></thead>' +
                                '<tbody><tr><td>'+record.range+'</td></tr>' +
                                '<tr><td>'+record.typeName+'</td></tr>'+
                                '<tr><td>'+record.reson+'</td></tr>' +
                                '</tbody></table>';
                        });
                        self.$('.js-ul-showRecord .well').html( record.join(''));
                    }

                } else {
                    Global.ui.notification.show('数据异常。');
                }
            })

        }
    });

    module.exports = UserDisableView;
});
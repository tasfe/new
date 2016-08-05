define(function (require, exports, module) {

    var UserRecoverView = Base.ItemView.extend({

        template: require('text!userCenter/templates/user-userRecover.html'),

        events: {},

        getDisableRecordXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/usermanager/getrecoverdeltail.json',
                data: data
            });
        },

        onRender: function () {
            var self = this;

            var userName = self.options.name;
            this.$('.js-ul-username').html(userName);



            var a = self.getDisableRecordXhr({userId: self.options.userId}).done(function (res) {
                if (res && res.result === 0) {
                    if (_(res.root).size() > 0) {
                        self.$('.js_ul_recover').html('<button type="button" class="btn btn-danger" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">' +
                            '发现回收记录</button>');
                        self.$('.js-ul-viewRecover').html('<div class="js-ul-showRecord collapse" id="collapseExample"><div class="well height-md overflow-auto">' +
                            '</div></div>');
                        var record= _(res.root).map(function (record) {
                            return '<table class="table">' +
                                '<thead><tr><th class="col-sm-9">'+_(record.createTime).toTime()+'</th><th>'+record.createrName+'</th></tr></thead>' +
                                '<tr><td>'+record.reson+'</td></tr>' +
                                '</tbody></table>';
                        });
                        self.$('.js-ul-showRecord .well').html( record.join(''));
                    }

                } else {
                    Global.ui.notification.show('数据异常。');
                }
            }).fail(function(){
            });

        }
    });

    module.exports = UserRecoverView;
});
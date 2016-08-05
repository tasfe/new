define(function (require, exports, module) {

    var UserResetView = Base.ItemView.extend({

        template: require('text!userCenter/templates/user-userReset.html'),

        events: {},

        getDisableRecordXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/usermanager/getresetdetail.json',
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
                        if(res.root.resetList||_(res.root.resetList)>0) {
                            self.$('.js-ul-reset').html('<button type="button" class="btn btn-danger" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">' +
                                '发现申诉记录</button>');
                            self.$('.js-ul-viewReset').html('<div class="js-ul-showRecord collapse" id="collapseExample"><div class="well height-md overflow-auto">' +
                                '</div></div>');
                            var record = _(res.root.resetList).map(function (record) {
                                return '<table class="table">' +
                                    '<thead><tr><th class="col-sm-9">' + _(record.createTime).toTime() + '</th><th>' + record.createrName + '</th></tr></thead>' +
                                    '<tr><td>' + record.reson + '</td></tr>' +
                                    '</tbody></table>';
                            });

                        self.$('.js-ul-showRecord .well').html( record.join(''));
                        }
                        self.$('.js-ul-action1').html('<label class="col-sm-3 control-label">申述动作</label><div class="col-sm-6"><label class="checkbox-inline">'+
                            '<input class="js-ul-typelist" type="checkbox" value="1" name="typeList[]"> 重置登录密码'+
                            '</label></div>');
                        self.$('.js-ul-action2').html('<label class="col-sm-3 control-label"></label><div class="col-sm-6"><label class="checkbox-inline">'+
                            '<input class="js-ul-typelist" type="checkbox" value="2" name="typeList[]"> 重置资金密码'+
                            '</label></div>');
                        if(res.root.isSet==1){
                        self.$('.js-ul-action3').html('<label class="col-sm-3 control-label"></label><div class="col-sm-6"><label class="checkbox-inline">'+
                            '<input class="js-ul-typelist" type="checkbox" value="3" name="typeList[]"> 重置密码问题'+
                            '</label></div>');
                        }
                        if(res.root.isSet==2){
                            self.$('.js-ul-action3').html('<label class="col-sm-3 control-label"></label><div class="col-sm-6"><label class="checkbox-inline">'+
                                '<input type="checkbox" value="3" name="typeList[]" disabled> 重置密码问题（未设置）'+
                                    '<span></span>'+
                                '</label></div>');
                         }
                    }

                } else {
                    Global.ui.notification.show('数据异常。');
                }
            }).fail(function(){
            });

        }
    });

    module.exports = UserResetView;
});
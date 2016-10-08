define(function (require, exports, module) {

    var NewActivityView = Base.ItemView.extend({

        template: require('text!saleCenter/templates/newActivity.html'),
        rebate_template: require('text!com/rebateRight/rebate-Right-Config.html'),

        events: {
            'click .js-cc-btn-submit': 'newActivityHandler',
            'click .js-pf-allUser': 'selectAllUserHandler',
            'click .js-pf-userLevel': 'checkAllUserSelectHandler'
        },
        initialize: function () {
        },

        onRender: function () {
            var self = this;
            this.$('.js-cc-newActivity-form').prepend(_(this.rebate_template).template()());
            self.$('.js-cc-arManageUpload-btn').imgBar();

            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-cc-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                endDate: moment().add(1, 'year'),
                startValidate: 'required data-parsley-trigger="blur"',
                endValidate: 'required data-parsley-trigger="blur"'
            }).render();
            this.$('#textarea1').richEditor();
        },
        //上传附件
        generateImageArea: function (url, name) {
            this.$('.js-cc-attach').append($('<div class="gallery-item no-rotate width-sm m-right-sm">' +
                '<div class="gallery-wrapper width-sm"><a class="gallery-remove"><i class="fa fa-times"></i></a><img src="' +
                url + '" class="js-cc-arManage-attach square-sm">' + (name ? '<div class="gallery-title">' + name + '</div>' : '') + '</div></div>'));
        },
        newActivityHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            if(_(this.$('.js-wt-img-attach')).size()===0){
                self.insertNotice('请先上传图片。');
                return false;
            }else if(_(this.$('.js-wt-img-attach')).size()>1){
                self.insertNotice('仅允许上传一张图片。');
                return false;
            }
            $target.button('loading');
            var $currContainer =this.$('.js-cc-newActivity-form');
            var clpValidate = $currContainer.parsley().validate();
            if (clpValidate) {
                var userLevel = [];
                _(this.$('.js-pf-userLevel')).map(function(item){
                    if($(item).prop('checked')){
                        userLevel.push( $(item).val());
                    }
                });
                Global.sync.ajax({
                    url: '/intra/activitymanage/saveactivity.json',
                    data: {
                        bannerUrl: '',
                        bannerPicUrl: this.$('.js-wt-img-attach').attr('src'),
                        activityTitle: this.$('.js-cc-title').val(),
                        startTime: this.$('.js-start-time').val(),
                        endTime: this.$('.js-end-time').val(),
                        type:this.$('.js-cc-type').val(),
                        userLevel: userLevel.join(','),
                        content:this.$('.js-cc-content').val(),
                        des:this.$('.js-cc-des').val()
                    }
                })
                    .always(function () {
                        $target.button('reset');
                    })
                    .fail(function () {
                        // 处理失败
                    })
                    .done(function (res) {
                        if (res && res.result === 0) {
                            Global.ui.notification.show('操作成功。');
                            Global.appRouter.navigate(_('#sc/cc').addHrefArgs({_t:_.now()}), {trigger: true, replace: false});
                        } else {
                            Global.ui.notification.show('操作失败。');
                        }
                    });
            }else{
                $target.button('reset');
            }
        },
        insertNotice: function ( html) {
            this.$('.js-sc-nac-notice').html(this._getErrorMsg(html));
        },
        //组装错误提示框
        _getErrorMsg: function (text) {
            return '<div class="alert alert-danger alert-dismissible" role="alert">' +
              '<button type="button" class="close" data-dismiss="alert">' +
              '<span aria-hidden="true">×</span>' +
              '</button>' +
              '<i class="fa fa-times-circle m-right-xs"></i>' +
              '<strong>提示！</strong> ' + text +
              '</div>';
        },
        selectAllUserHandler: function(){
            var $target = this.$('.js-pf-allUser');
            var checked = $target.prop('checked');
            if(checked){
                this.$('.js-pf-userLevel').each(function () {
                    $(this).prop('checked',true);
                });
            }else{
                this.$('.js-pf-userLevel').each(function () {
                    $(this).prop('checked',false);
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
    module.exports = NewActivityView;
});
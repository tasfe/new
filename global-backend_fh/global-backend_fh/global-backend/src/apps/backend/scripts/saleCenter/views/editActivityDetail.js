define(function (require, exports, module) {

    var RebateRightView = require('com/rebateRight/index');

    var EditActivityView = Base.ItemView.extend({

        template: require('text!saleCenter/templates/editActivityDetail.html'),

        events: {
            'click .js-il-edit-confirm':'updateActivityHandle'
        },

        getActivityDetailXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/activitymanage/getactivitydetail.json',
                data:data
            });
        },

        onRender: function() {
            var self = this;
            self.getActivityDetailXhr({actId:self.options.actId}).always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    var option = {userLevel:res.root.userLevel,disabled:1};
                    var rebateRightView = new RebateRightView(option);
                    self.$('.js-cm-edit-form').prepend(rebateRightView.render().$el);
                    if(res.root.type==1){
                    self.$('.js-cm-type').html('<span>日常活动</span>');
                    }
                    if(res.root.type==2){
                        self.$('.js-cm-type').html('<span>大型活动</span>');
                    }
                    self.$('.js-cm-title').val(res.root.activityTitle);
                    self.$('.js-cm-actUrl').val(res.root.bannerUrl);
                    self.$('.js-start-time').val(_(res.root.activityBegin).toTime());
                    self.$('.js-end-time').val(_(res.root.activityStop).toTime());
                    self.actId=res.root.activityCenterId;
                    self.type=res.root.type;
                    self.$('.js-cm-arManageUpload-btn').imgBar({imgList:(res.root.bannerPicUrl).split(',')});
                    self.$('.js-cm-des').val(res.root.des);
                    self.$('.js-cm-des').val(res.root.content);
                }else {
                    Global.ui.notification.show('数据异常。');
                }

                self.$('#textarea1').richEditor();
            });
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-cm-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                endDate:moment().add(1, 'year'),
                startValidate: 'required data-parsley-trigger="blur"',
                endValidate: 'required data-parsley-trigger="blur"'
                //startDate:moment()
            }).render();
            self.parsley= this.$('.js-cm-edit-form').parsley();
        },
        //上传附件
        generateImageArea: function(url,name){
            this.$('.js-cm-attach').append($('<div class="gallery-item no-rotate width-sm m-right-sm">' +
                '<div class="gallery-wrapper width-sm"><a class="gallery-remove"><i class="fa fa-times"></i></a><img src="' +
                url+'" class="js-cm-arManage-attach square-sm">'+(name?'<div class="gallery-title">'+ name + '</div>':'')+'</div></div>'));
        },
        updateActivityHandle: function (e) {
            var userLevel = [];
            _(this.$('.js-pf-userLevel')).map(function(item){
                if($(item).prop('checked')){
                    userLevel.push( $(item).val());
                }
            });
            return Global.sync.ajax({
                    url: '/intra/activitymanage/modifyactivity.json',
                    data: {
                        bannerUrl:this.$('.js-cm-actUrl').val(),
                        bannerPicUrl:this.$('.js-wt-img-attach').attr('src'),
                        activityTitle:this.$('.js-cm-title').val(),
                        startTime:this.$('.js-start-time').val(),
                        endTime:this.$('.js-end-time').val(),
                        type:this.type,
                        actId:this.actId,
                        userLevel: userLevel.join(','),
                        content:this.$('.js-cm-content').val(),
                        des:this.$('.js-cm-des').val()
                    }
                });
        },

        insertNotice: function ( html) {
            this.$('.js-sc-eac-notice').html(this._getErrorMsg(html));
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
        }
    });

    module.exports = EditActivityView;
});
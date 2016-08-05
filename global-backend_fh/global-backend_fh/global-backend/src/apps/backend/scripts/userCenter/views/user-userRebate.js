define(function (require, exports, module) {

    var EditUserRebateView = Base.ItemView.extend({

        template: require('text!userCenter/templates/user-userRebate.html'),

        events: {
            //'click .js-ul-editRebate-confirm':'updateUserRebateHandle'
        },

        getQuotaDetailXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/usermanager/getuserquota.json',
                data:data
            });
        },

        onRender: function() {
            var self = this;
            self.getQuotaDetailXhr({userId:self.options.userId}).always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    if(res.root&&_(res.root).size()>0){
                    var quotaData =_(res.root).map(function (quota) {
                        return '<div class="form-group form-inline">' +
                            '<label class="control-label">'+
                            '<span class="js-uc-quotaId" data-id="' + quota.quotaId + '" data-level="'+quota.quotalLevel+'">' +
                            '当前&nbsp;&nbsp;' + _(quota.quotalLevel).formatDiv(10) + '%'  +'&nbsp;&nbsp;('+_(quota.bonus).formatDiv(10000, {fixed: 0})+')'+'&nbsp;&nbsp;配额&nbsp;&nbsp;<span style="color: red">'+quota.quotaTotal+'</span>&nbsp;&nbsp;个，已开&nbsp;&nbsp;<span style="color: red">'
                            +quota.quotaUse+'</span>&nbsp;&nbsp;个，剩余&nbsp;&nbsp;<span style="color: red">'+quota.quotaLave+'</span>&nbsp;&nbsp;个，调整剩余配额数：'+
                            '</label>'+
                            '<input type="text" class="js-uc-quotaLave form-control width-sm" id="inputSuccess4" aria-describedby="inputSuccess4Status" value="'+quota.quotaLave+'" data-parsley-range="[0, 999]" data-parsley-type="integer" style="width: 60px !important;" required>'+
                            '<label class="control-label">&nbsp;&nbsp;个</label>'+
                            '</span>' +
                            '</div>';
                    });
                    self.$('.js-ul-rebate').html(quotaData.join(''));
                    }else{
                        //Global.ui.notification.show('用户未设置配额');
                        Global.ui.notification.show('数据异常。');
                    }
                }else {
                    Global.ui.notification.show('数据异常。');
                }


            });
        },
        updateUserRebateHandle: function (e) {
            var $target = $(e.currentTarget);
            $target.button('loading');
            var clpValidate = this.parsley.validate();
            if (clpValidate) {
                return Global.sync.ajax({
                    url: '/intra/usermanager/saveuserquota.json',
                    data: {
                        quota: _(this.$('.js-uc-quotaId')).map(function(quota,index,quotaList){
                                return {
                                    quotaId:$(quota).val(),
                                    quotaChange: $($('.js-uc-quotaLave')[index]).val()
                                }
                            }),

                        userId:this.options.userId
                    },
                    tradition: true


                })
                    .always(function () {
                        $target.button('commit');
                    })
                    .fail(function () {
                        // 处理失败
                    })
                    .done(function (res) {
                        if (res && res.result === 0) {
                            Global.ui.notification.show('操作成功。');
                        } else {
                            Global.ui.notification.show('操作失败。');
                        }
                    });
            }
        }
    });

    module.exports = EditUserRebateView;
});
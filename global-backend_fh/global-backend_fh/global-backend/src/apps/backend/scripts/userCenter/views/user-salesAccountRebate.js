define(function (require, exports, module) {

    var EditSalesRebateView = Base.ItemView.extend({

        template: require('text!userCenter/templates/user-userRebate.html'),

        events: {
            //'click .js-ul-editRebate-confirm':'updateUserRebateHandle'
        },

        getQuotaDetailXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/usermanager/getmerchantquota.json',
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
                    var quotaData =_(res.root.quotaList).map(function (quota) {
                        if(quota.quotaLevel==1960){
                        return '<div class="form-group form-inline">' +
                            '<label class="control-label">'+
                            '<span class="js-sm-quotaId" data-id="' + quota.quotaId + '" data-level="'+quota.quotaLevel+'">' +
                            '直属号&nbsp;&nbsp;('+quota.quotaLevel+')'+'&nbsp;&nbsp;配额&nbsp;&nbsp;<span style="color: red">'+quota.quotaTotal+'</span>&nbsp;&nbsp;个，已开&nbsp;&nbsp;<span style="color: red">'
                            +quota.quotaUse+'</span>&nbsp;&nbsp;个，剩余&nbsp;&nbsp;<span style="color: red">'+quota.quotaLave+'</span>&nbsp;&nbsp;个，调整剩余配额数：'+
                            '</label>'+
                            '<input type="text" class="js-sm-quotaLave form-control width-sm" id="inputSuccess4" aria-describedby="inputSuccess4Status" value="'+quota.quotaLave+'" data-parsley-range="[0, 999]" data-parsley-type="integer" style="width: 60px !important;" required>'+
                            '<label class="control-label">&nbsp;&nbsp;个</label>'+
                            '</span>' +
                            '</div>';
                        }
                    });
                    var info='<div>'+quotaData.join('')+'' +
                        '<div class="form-group form-inline"><label class="control-label"><span>返点比例：&nbsp;&nbsp;</label>'+
                        '<input type="text" class="js-sm-rebate form-control width-sm" id="inputSuccess4" aria-describedby="inputSuccess4Status" value="'+_(res.root.rebate).formatDiv(100, {fixed: 2})+'" data-parsley-twoDecimal data-parsley-range="[0, 100]" style="width: 60px !important;" required>'+
                        '<label class="control-label">&nbsp;&nbsp;%</label></span>' +
                        '<label class="control-label" style="margin-left:218px"><span>分红比例：&nbsp;&nbsp;</label>'+
                        '<input type="text" class="js-sm-divid form-control width-sm" id="inputSuccess4" aria-describedby="inputSuccess4Status" value="'+_(res.root.divid).formatDiv(100, {fixed: 2})+'" data-parsley-range="[0, 100]" data-parsley-twoDecimal style="width: 60px !important;;" required>'+
                        '<label class="control-label">&nbsp;&nbsp;%</label></span>' +
                        '</label></div></div>';
                    self.$('.js-ul-rebate').html(info);
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

    module.exports = EditSalesRebateView;
});
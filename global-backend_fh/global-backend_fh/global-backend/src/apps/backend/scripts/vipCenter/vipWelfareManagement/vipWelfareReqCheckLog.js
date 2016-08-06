define(function (require, exports, module) {

    var CheckReqAgainView = Base.ItemView.extend({

        template: require('text!vipCenter/vipWelfareManagement/vipWelfareReqCheckLog.html'),

        events: {},

        vipWelFareRepayCheckXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/creditmng/detail.json',
                data: data
            });
        },

        onRender: function () {
            var self = this;
            self.vipWelFareRepayCheckXhr({tradeNo: self.options.tradeNo}).done(function (res) {
                if (res && res.result === 0) {
                    self.$('.js-ap-username').html(res.root.username);
                    self.$('.js-ap-level').html('V'+res.root.userLevel);
                    self.$('.js-ap-amount').html(_(res.root.reqAmount).formatDiv(10000, {fixed: 0}));
                    self.$('.js-ap-req-time').html(_(res.root.reqDate).toTime());
                    self.$('.js-ap-check-time').html(_(res.root.firstCheck.checkDate).toTime());
                    self.$('.js-ap-check-name').html(res.root.firstCheck.checker);
                    var sContent='';
                    var checkAmountView='';
                    var checkDesView='';
                    if(res.root.firstCheck.status==1){
                        sContent='批准';
                        checkAmountView='<div class="form-group form-inline" style="margin-left: -4px;"><label class="col-sm-3 control-label">批准金额：</label>' +
                            '<div class="col-sm-4">' +
                            '<label class="js-ap-check-amount control-label">'+_(res.root.firstCheck.amount).formatDiv(10000, {fixed: 0})+'</label> </div></div>';
                        checkDesView='';
                    }else{
                        sContent='拒绝';
                        checkAmountView='';
                        checkDesView='<label class="col-sm-3 control-label">初审结果说明：</label>' +
                            ' <div class="col-sm-4">' +
                            ' <label class="js-ap-check-amount control-label">'+res.root.explanation+'</label></div>';
                    }
                    self.$('.js-ap-check-result').html(sContent);
                    self.$('.js-check-amount-view').html(checkAmountView);
                    self.$('.js-ap-check-remark').html(res.root.firstCheck.remark);
                    self.$('.js-check-result-view').html(checkDesView);
                    if(res.root.firstCheck.status==1){
                        var checkAgainTime=_(res.root.secondCheck.checkDate).toTime();
                        var checkAgainName=res.root.secondCheck.checker;
                        var checkAgainRemark=res.root.secondCheck.remark;
                        var checkAgainContent='';
                        var checkAgainAmountView='';
                        var checkAgainDesView='';
                        if(res.root.secondCheck.status==1){
                            checkAgainContent='批准';
                            checkAgainAmountView='<div class="form-group form-inline"><label class="col-sm-3 control-label">批准金额：</label>' +
                                '<div class="col-sm-9"> <div class="">' +
                                '<label class="js-ap-check-amount control-label">'+_(res.root.firstCheck.amount).formatDiv(10000, {fixed: 0})+'</label></div> </div></div>';
                            checkAgainDesView='';
                        }else{
                            checkAgainContent='拒绝';
                            checkAgainAmountView='';
                            checkAgainDesView='<div class="form-group form-inline"><label class="col-sm-3 control-label">复审结果说明：</label>' +
                                ' <div class="col-sm-9">' +
                                ' <label class="js-ap-check-amount control-label">'+res.root.explanation+'</label></div></div>';
                        }

                        self.$('.js-check-again-result-view').html('<div class="form-group form-inline"><label class="col-sm-3 control-label">复审时间：</label> ' +
                            '<div class="col-sm-9"><label class="js-ap-check-time control-label">'+checkAgainTime+'</label> </div> </div> ' +
                            '<div class="form-group form-inline"><label class="col-sm-3 control-label">审核人：</label> <div class="col-sm-9"><label class="js-ap-check-name control-label">'+checkAgainName+'</label> </div> </div> ' +
                            '<div class="form-group form-inline"><label class="col-sm-3 control-label">复审结果：</label> <div class="col-sm-9"><label class="js-ap-check-result control-label">'+checkAgainContent+'</label> </div> </div> ' +
                            '<div class="js-check-amount-view">'+checkAgainAmountView+'</div><div class="form-group form-inline"> <label class="col-sm-3 control-label">备注：</label> <div class="col-sm-9"> ' +
                            '<label class="js-ap-check-remark control-label">'+checkAgainRemark+'</label> </div> </div> ' +
                            '<div class="js-check-result-view">'+checkAgainDesView+'</div>');
                    }

                } else {
                    Global.ui.notification.show('数据异常。');
                }
            })

        }
    });

    module.exports = CheckReqAgainView;
});
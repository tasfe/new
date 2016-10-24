/**
 * Created by David Zhang on 2015/9/13.
 */
define(function (require, exports, module) {

    var RightOpenTimeView = require('betCenter/views/species-LotteryMonitor-rightOpenTime');
    var CancelCurPlanBetView = require('betCenter/views/species-LotteryMonitor-cancelCurPlanBet');
    var CancelChaseBetView = require('betCenter/views/species-LotteryMonitor-cancelChasebet');
    var RightOpenNumView = require('betCenter/views/species-LotteryMonitor-rightOpenNum');
    var KoreaSourceView = require('betCenter/views/ticket-koreaSource-detail');
    var LotteryMonitorDetailView = Base.ItemView.extend({

        //初次渲染页面时会调用的模板
        template: require('text!betCenter/templates/species-LotteryMonitor-lotteryDetail.html'),

        //所有的事件绑定全部写在这！
        events: {
            'click .js-bc-rightOpenTime': 'rightOpenTimeHandler',
            'click .js-bc-cancelCurPlanBet': 'cancelCurPlanBetHandler',
            'click .js-bc-cancelChaseBet': 'cancelChaseBetHandler',
            'click .js-bc-rightOpenNum': 'rightOpenNumHandler',
            'click .js-BC-koreaSource':'showKoreaSourcelHandler'
        },

        //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
        initialize: function (data) {
        },

        getXxxXhr: function (datas) {
            return Global.sync.ajax({
                url: '/intra/openmng/opendetail.json',
                data: datas
            });
        },

        //在页面被渲染出来的时候自动调用
        onRender: function () {
            //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
            var self = this;
            this.$btnSumbit = self.$('.js-bc-btn-submit');
            this.$formContainer = this.$('.js-bc-form');
            var params = {ticketResultId: this.options.ticketResultId};
            self.$('.js-bc-ticketResultId').val(this.options.ticketResultId);

            this.getXxxXhr(params).always(function () {
                })
                .fail(function () {
                    // 处理失败
                })
                .done(function (res) {
                    if (res && res.result === 0) {
                        self.$('.js-bc-ticketId').text(res.root.ticketId);
                        self.$('.js-bc-ticketName').text(res.root.ticketName);
                        self.$('.js-bc-planId').text(res.root.ticketPlanId);
                        self.$('.js-bc-saleTime').text(_(res.root.ticketSaleStartTime).toTime('') + "-" + _(res.root.ticketSaleEndTime).toTime(''));
                        self.$('.js-bc-openTime').text(_(res.root.ticketOpenTime).toTime(''));
                        self.$('.js-bc-allOpenTime').text(_(res.root.ticketOpenTime).toTime());
                        self.$('.js-bc-openNum').text(res.root.ticketOpenNum);
                        var openStatus;
                        if (res.root.ticketOpenStatus == 1) {
                            openStatus = '官方提前开奖';
                        } else if (res.root.ticketOpenStatus == 2) {
                            openStatus = '官方未开奖';
                        } else if (res.root.ticketOpenStatus == 3) {
                            openStatus = '官方延迟开奖';
                        } else if (res.root.ticketOpenStatus == 4) {
                            openStatus = '无异常';
                        }
                        self.$('.js-bc-openStatus').text(openStatus);
                        self.$('.js-bc-exceptionDetail').text(res.root.ticketOpenDesc);

                        self.$('.js-bc-optionLog tr').remove();
                        _.map(_.range(res.root.checkList.length), function (index) {
                            self.$('.js-bc-optionLog').append("<tr>" +
                                "  <td>" + _(res.root.checkList[index].checkTime).toTime() + "</td>" +
                                "  <td>" + res.root.checkList[index].checkType + " 备注：" + res.root.checkList[index].remark + "</td>" +
                                "  <td>操作人：" + res.root.checkList[index].operator + "</td>" +
                                "</tr>");
                        });
                        if (res.root.canFixOpenNum) {
                            self.$('.js-bc-rightOpenNum-choose').html('<button class="btn btn-sm btn-default m-left-sm js-bc-rightOpenNum " >输入官方正确开奖号</button>');
                        } else {
                            self.$('.js-bc-rightOpenNum-choose').html('<button class="btn btn-sm btn-default m-left-sm js-bc-rightOpenNum disabled" >输入官方正确开奖号</button>');
                        }
                        if(res.root.ticketOrgOpenNum != null){
                            self.$('.js-bc-openNum').after('<label class="control-label js-bc-orgOpenNum"> <a class="js-BC-koreaSource btn-link btn-link-cool" data-opennum="'+res.root.ticketOrgOpenNum+'">查看号源</a></label>');
                        }
                    } else {
                        Global.ui.notification.show('数据异常。');
                    }
                });
        },

        // 输入正确开奖时间
        rightOpenTimeHandler: function (e) {
            var self = this;
            var $dialog = Global.ui.dialog.show(
                {
                    title: '输入正确开奖时间',
                    body: '<div class="panel padding-md js-bc-rightOpenTime-container"></div>',
                }
            );

            var $rightOpenTimeContainer = $dialog.find('.js-bc-rightOpenTime-container');

            var rightOpenTimeView = new RightOpenTimeView({openTime: self.$('.js-bc-allOpenTime').text()});
            $rightOpenTimeContainer.html(rightOpenTimeView.render().el);

            $dialog.on('hidden.bs.modal', function () {
                $(this).remove();
            });

            $dialog.off('click.saveInfo')
                .on('click.saveInfo', '.js-bc-btn-submit', function () {
                    var $form = $dialog.find('.js-bc-form');
                    var clpValidate = $form.parsley().validate();
                    if (!clpValidate) {
                        return false;
                    }
                    var rightOpenTime = $dialog.find('.js-bc-rightOpenTimeInput').val();
                    var remark = $dialog.find('.js-bc-remark').val();
                    var data = {
                        ticketResultId: self.$('.js-bc-ticketResultId').val(),
                        openTime: rightOpenTime,
                        remark: remark
                    };

                    rightOpenTimeView.fixOpenTime(data)
                        .fail(function () {
                        })
                        .done(function (res) {
                            if (res.result === 0) {
                                $dialog.modal('hide');
                                self.onRender();//刷新页面
                            } else {
                                rightOpenTimeView.insertNotice('保存失败,' + res.msg);
                            }
                        });

                });
        },

        // 撤销本期订单
        cancelCurPlanBetHandler: function (e) {
            var self = this;
            var $dialog = Global.ui.dialog.show(
                {
                    title: '撤销本期订单',
                    body: '<div class="panel padding-md js-bc-cancelCurPlanBet-container"></div>',
                }
            );

            var $cancelCurPlanBetContainer = $dialog.find('.js-bc-cancelCurPlanBet-container');

            var cancelCurPlanBetView = new CancelCurPlanBetView({planId: self.$('.js-bc-planId').text()});
            $cancelCurPlanBetContainer.html(cancelCurPlanBetView.render().el);

            $dialog.on('hidden.bs.modal', function () {
                $(this).remove();
            });

            $dialog.off('click.saveInfo')
                .on('click.saveInfo', '.js-bc-btn-submit', function () {
                    var $form = $dialog.find('.js-bc-form');
                    var clpValidate = $form.parsley().validate();
                    if (!clpValidate) {
                        return false;
                    }
                    var remark = $dialog.find('.js-bc-remark').val();
                    var data = {
                        ticketResultId: self.$('.js-bc-ticketResultId').val(),
                        remark: remark
                    };

                    cancelCurPlanBetView.cancelCurPlanBet(data)
                        .fail(function () {
                        })
                        .done(function (res) {
                            if (res.result === 0) {
                                $dialog.modal('hide');
                                self.onRender();//刷新页面
                            } else {
                                cancelCurPlanBetView.insertNotice('保存失败,' + res.msg);
                            }
                        });

                });
        },

        // 撤销后续追号
        cancelChaseBetHandler: function (e) {
            var self = this;
            var $dialog = Global.ui.dialog.show(
                {
                    title: '撤销后续追号',
                    body: '<div class="panel padding-md js-bc-cancelChaseBet-container"></div>',
                }
            );

            var $cancelChaseBetContainer = $dialog.find('.js-bc-cancelChaseBet-container');

            var cancelChaseBetView = new CancelChaseBetView({planId: self.$('.js-bc-planId').text()});
            $cancelChaseBetContainer.html(cancelChaseBetView.render().el);

            $dialog.on('hidden.bs.modal', function () {
                $(this).remove();
            });

            $dialog.off('click.saveInfo')
                .on('click.saveInfo', '.js-bc-btn-submit', function () {
                    var $form = $dialog.find('.js-bc-form');
                    var clpValidate = $form.parsley().validate();
                    if (!clpValidate) {
                        return false;
                    }

                    var endPlanId = $dialog.find('.js-bc-endPlanId').val();
                    var remark = $dialog.find('.js-bc-remark').val();
                    var data = {
                        ticketResultId: self.$('.js-bc-ticketResultId').val(),
                        ticketPlanId: endPlanId,
                        remark: remark
                    };

                    cancelChaseBetView.cancelChaseBet(data)
                        .fail(function () {
                        })
                        .done(function (res) {
                            if (res.result === 0) {
                                $dialog.modal('hide');
                                self.onRender();//刷新页面

                            } else {
                                cancelChaseBetView.insertNotice('保存失败,' + res.msg);
                            }
                        });
                });
        },

        // 输入正确开奖号码
        rightOpenNumHandler: function (e) {
            var self = this;
            var $dialog = Global.ui.dialog.show(
                {
                    title: '输入正确开奖号码',
                    body: '<div class="panel padding-md js-bc-rightOpenNum-container"></div>',
                }
            );

            var $rightOpenNumContainer = $dialog.find('.js-bc-rightOpenNum-container');

            var rightOpenNumView = new RightOpenNumView({
                ticketName: self.$('.js-bc-ticketName').text(),
                planId: self.$('.js-bc-planId').text(),
                openNum: self.$('.js-bc-openNum').text()
            });
            $rightOpenNumContainer.html(rightOpenNumView.render().el);

            $dialog.on('hidden.bs.modal', function () {
                $(this).remove();
            });

            $dialog.off('click.saveInfo')
                .on('click.saveInfo', '.js-bc-btn-submit', function () {

                    var ticketId = self.$('.js-bc-ticketId').text();
                    var ticketType = ['4', '5', '11', '14', '15', '18'];
                    if ($.inArray(ticketId, ticketType) != -1) {
                        //$dialog.find('.js-bc-openNum-container').html('<input type="text" class="form-control js-bc-openNum width-md" data-parsley-numAndCommaAndNoRep required>');
                        $dialog.find('.js-bc-openNum').removeAttr('data-parsley-numAndComma').attr('data-parsley-numAndCommaAndNoRep',true);
                    }else{
                        //$dialog.find('.js-bc-openNum-container').html('<input type="text" class="form-control js-bc-openNum width-md" data-parsley-numAndComma required>');
                        $dialog.find('.js-bc-openNum').removeAttr('data-parsley-numAndCommaAndNoRep').attr('data-parsley-numAndComma',true);
                    }

                    var $form = $dialog.find('.js-bc-form');
                    var clpValidate = $form.parsley().validate();
                    if (!clpValidate) {
                        return false;
                    }
                    var openNum = $dialog.find('.js-bc-openNum').val();
                    var remark = $dialog.find('.js-bc-remark').val();
                    var data = {
                        ticketResultId: self.$('.js-bc-ticketResultId').val(),
                        openNum: openNum,
                        remark: remark
                    };

                    rightOpenNumView.fixOpenNum(data)
                        .fail(function () {
                        })
                        .done(function (res) {
                            if (res.result === 0) {
                                $dialog.modal('hide');
                                self.onRender();//刷新页面
                            } else {
                                rightOpenNumView.insertNotice('保存失败,' + res.msg);
                            }
                        });

                });
        },
        showKoreaSourcelHandler: function (e) {
            var $target = $(e.currentTarget);
            var koreaSourceView;
            var openNum = $target.data('opennum');
            var $dialog = Global.ui.dialog.show({
                title: '查看号源',
                size: 'modal-md',
                body: '<div class="js-bc-sourceDetail-container"></div>',
                bodyClass: 'no-padding',
                footer: ''
            });

            var $sourceContainer = $dialog.find('.js-bc-sourceDetail-container');

            $dialog.on('hidden.modal', function() {
                $(this).remove();
                koreaSourceView.destroy();
            });

            koreaSourceView  = new KoreaSourceView({
                el: $sourceContainer,
                openNum:openNum
            }).render();

        }

    });

    module.exports = LotteryMonitorDetailView;
});
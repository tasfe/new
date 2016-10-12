define(function (require, exports, module) {
    var BankManagementAddOrEditView = require('./edit');
    var RechargeSetView = require('./rechargeSet');
    require('prefab/views/searchGrid');

    var ListView = Base.Prefab.SearchGrid.extend({

        template: require('text!./list.html'),

        events: {
            'click .js-fc-tp-add': 'addBankHandler',
            'click .js-fc-tp-edit': 'editBankHandler',
            'click .js-fc-tp-delete': 'deleteBankHandler',
            'click .js-fc-tp-useable': 'changeBankStateHandler',
            'click .js-fc-tp-save': 'saveThirdPartyPaySort',
            'click .js-fc-tp-set-pc': 'amountPCSetHandler',
            'click .js-fc-tp-set-mobile': 'amountMobileSetHandler'
        },
        initialize: function () {

            _(this.options).extend({
                title: '用户充值渠道列表',
                columns: [
                    {
                        name: '平台名称',
                        width: '6%'
                    },
                    {
                        name: 'ID',
                        width: '6%'
                    },
                    {
                        name: '商户号',
                        width: '10%'
                    },
                    {
                        name: '终端渠道',
                        width: '6%'
                    },
                    {
                        name: '状态',
                        width: '6%'
                    },
                    {
                        name: '备注',
                        width: '10%'
                    },
                    {
                        name: '操作',
                        width: '10%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/paymanage/paylist.json'
                },
                reqData: {
                    paymentType: this.options.paymentType
                },
                pagination: false
            });
        },
        //保存详情
        saveBankInfoXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/paymanage/save.json',
                data: _(data).extend({
                    paymentType: this.options.paymentType
                })
            });
        },
        //保存详情
        saveAmountSetXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/rechargemanage/saveconf.json',
                data: _(data).extend({
                    paymentType: this.options.paymentType
                })
            });
        },
        //禁用/启用银行卡
        changeBankStatusXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/paymanage/dostatus.json',
                data: data
            });
        },
        //删除银行卡
        deleteBankStatusXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/paymanage/delpay.json',
                data: data
            });
        },
        onRender: function () {
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);

        },
        renderGrid: function (gridData) {
            var rowsData = _(gridData.payList).map(function (payInfo, index) {
                return {
                    columnEls: this.formatRowData(payInfo, index),
                    dataAttr: payInfo
                };
            }, this);

            this.grid.refreshRowData(rowsData, gridData.rowCount, {

                initPagination: true
            })
                .hideLoading();
        },

        formatRowData: function (rowInfo) {
            var row = [];
            row.push(rowInfo.platformName);
            row.push(rowInfo.paymentId);
            row.push(rowInfo.merchantCode);
            var type='';
            if(rowInfo.type==0){
                type='<span><label style="margin-top:9px;">PC端</label></span>'
            }else if(rowInfo.type==1){
                type='<span><label style="margin-top:9px;">移动端</label></span>'
            }else{
                type='<span><label style="margin-top:9px;">未知设备</label></span>'
            }
            row.push(type);
            var status = '';
            var operate = '';
            switch (rowInfo.status) {
                case 1 :
                    status = '<span class="text-danger"><label style="margin-top:9px;">使用中</label></span>';
                    operate += '<button class="btn btn-link js-fc-tp-useable no-m-right" data-status="1" data-id="' + rowInfo.paymentId + '">禁用</button>';
                    break;
                case 2 :
                    status = '<label style="margin-top:9px;">已停用</label>';
                    operate += '<button class="btn btn-link js-fc-tp-useable no-m-right" data-status="2" data-id="' + rowInfo.paymentId + '">启用</button>';
                    break;
            }

            if (!Global.authority.fc || !Global.authority.fc.tp || !Global.authority.fc.tp.disable) {
                operate = '';
            }

            if (Global.authority.fc && Global.authority.fc.tp && Global.authority.fc.tp.edit) {
                operate += '<button  class="btn btn-link js-fc-tp-edit no-m-left no-p-left" data-platformname="' + rowInfo.platformName
                    + '" data-merchantcode="' + rowInfo.merchantCode + '" data-publickey="'+rowInfo.publicKey + '" data-privatekey="'+rowInfo.privateKey+'" data-remark="' + rowInfo.remark + '" ' +
                    'data-payurl="' + rowInfo.payUrl + '" data-notifyurl="' + rowInfo.notifyUrl + '" data-paymentid="' + rowInfo.paymentId + '" data-platformid="' + rowInfo.platformId + '"data-type="edit">编辑</button>';
            }

            operate += '<button  class="btn btn-link js-fc-tp-delete no-m-left no-p-left" data-id="' + rowInfo.paymentId + '" data-type="delete">删除</button>';
            row.push(status);
            row.push(rowInfo.remark);
            row.push(operate);
            return row;
        },
        addBankHandler: function (e) {
            var data = {
                type: 'add'
            };
            this.popLargeRechargeUserEditModel(data);

        },
        popLargeRechargeUserEditModel: function (data) {
            var self = this;
            var type = data.type;
            var title;
            if (type === 'edit') {
                title = '编辑第三方';
            } else {
                title = '新建第三方';
            }
            var $dialog = Global.ui.dialog.show(
                {
                    title: title,
                    body: '<div class="js-fc-tpm-AOE-container"></div>',
                    footer: '<button class="js-fc-tpm-AOE-confirm btn btn-primary" type="button">确定</button><button class="btn" data-dismiss="modal">取消</button>'
                }
            );
            var $aOEContainer = $dialog.find('.js-fc-tpm-AOE-container');
            var bankManagementAddOrEditView = new BankManagementAddOrEditView(data);
            $aOEContainer.html(bankManagementAddOrEditView.render().el);
            $dialog.on('hidden.bs.modal', function () {
                $(this).remove();
            });
            $dialog.off('click.saveInfo')
                .on('click.saveInfo', '.js-fc-tpm-AOE-confirm', function (ev) {
                    self.saveBankInfo($dialog);
                });
        },
        saveBankInfo: function ($dialog) {
            var $currContainer = $dialog.find('.js-fc-tpm-aoe-form');
            var clpValidate = $currContainer.parsley().validate();
            if (!clpValidate) {
                return false;
            }
            var $notice = $dialog.find('.js-fc-tpm-AOE-notice');
            var self = this;
            var data = {
                paymentId: $dialog.find('.js-fc-tpm-AOE-paymentId').val(),
                platformId: $dialog.find('.js-fc-third-pm').val(),
                platformName: $dialog.find('.js-fc-tpm-AOE-platformName').val(),
                merchantCode: $dialog.find('.js-fc-tpm-AOE-merchantCode').val(),
                publicKey: $dialog.find('.js-fc-tpm-AOE-publicKey').val(),
                privateKey: $dialog.find('.js-fc-tpm-AOE-privateKey').val(),
                payUrl: $dialog.find('.js-fc-tpm-AOE-payUrl').val(),
                notifyUrl: $dialog.find('.js-fc-tpm-AOE-notifyUrl').val(),
                remark:$dialog.find('.js-fc-tpm-AOE-remark').val(),
                type:0
            };
            this.saveBankInfoXhr(data).fail(function () {
            }).done(function (res) {
                if (res.result === 0) {
                    Global.ui.notification.show('操作成功。');
                    self.onRender();
                    $dialog.modal('hide');
                } else {
                    Global.ui.notification.show('操作失败。');
                }
            });
        },
        //编辑
        editBankHandler: function (e) {
            var $tr = $(e.currentTarget);
            var data = {
                type: 'edit',
                paymentId: $tr.data('paymentid'),
                platformId: $tr.data('platformid'),
                platformName: $tr.data('platformname'),
                merchantCode: $tr.data('merchantcode'),
                privateKey: $tr.data('privatekey'),
                publicKey: $tr.data('publickey'),
                payUrl: $tr.data('payurl'),
                notifyUrl: $tr.data('notifyurl'),
                remark:$tr.data('remark')
            };
            this.popLargeRechargeUserEditModel(data);
        },
        //修改状态
        changeBankStateHandler: function (e) {
            var self = this;
            $(document).confirm({
                content: '确认变更该支付方式状态？',
                agreeCallback: function () {
                    self.changeBankState(e);
                }
            });
        },
        changeBankState: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            var paymentId = $target.data('id');
            var status = $target.data('status');
            if (status === 1) {
                status = 2;
            } else {
                status = 1;
            }
            var data = {
                paymentId: paymentId,
                status: status
            };
            this.changeBankStatusXhr(data).fail(function () {
            }).done(function (res) {
                if (res.result === 0) {
                    Global.ui.notification.show('操作成功。');
                    self.onRender();
                } else {
                    Global.ui.notification.show('操作失败。');
                }
            });
        },
        //删除银行卡
        deleteBankHandler: function (e) {
            var self = this;
            var $target = $(e.currentTarget);
            $(document).confirm({
                content: '确认删除该支付方式？',
                agreeCallback: function () {
                    self.deleteBankStatusXhr({
                        paymentId: $target.data('id')
                    })
                        .done(function (res) {
                            if (res.result === 0) {
                                Global.ui.notification.show('删除成功。');
                                self.onRender();
                            } else {
                                Global.ui.notification.show('删除失败。');
                            }
                        });
                }
            });
        },
        //PC快捷设置
        amountPCSetHandler: function (data) {
            var self = this;
            var type = 0;
            var $dialog = Global.ui.dialog.show(
                {
                    title: 'PC端充值设置',
                    body: '<div class="js-fc-tp-amount-set-container"></div>',
                    footer: '<button class="js-fc-tp-amount-set-confirm btn btn-primary" type="button">确定</button><button class="btn" data-dismiss="modal">取消</button>'
                }
            );
            var $setContainer = $dialog.find('.js-fc-tp-amount-set-container');
            var rechargeSetView = new RechargeSetView({paymentType: this.options.paymentType,type:type});
            $setContainer.html(rechargeSetView.render().el);
            $dialog.on('hidden.bs.modal', function () {
                $(this).remove();
            });
            $dialog.off('click.saveSet')
                .on('click.saveSet', '.js-fc-tp-amount-set-confirm', function (ev) {
                    self.saveAmountSet($dialog,type);
                });
        },
        //移动端快捷设置
        amountMobileSetHandler: function (data) {
            var self = this;
            var type = 1;
            var $dialog = Global.ui.dialog.show(
                {
                    title: '移动端充值设置',
                    body: '<div class="js-fc-tp-amount-set-container"></div>',
                    footer: '<button class="js-fc-tp-amount-set-confirm btn btn-primary" type="button">确定</button><button class="btn" data-dismiss="modal">取消</button>'
                }
            );
            var $setContainer = $dialog.find('.js-fc-tp-amount-set-container');
            var rechargeSetView = new RechargeSetView({paymentType: this.options.paymentType,type:type});
            $setContainer.html(rechargeSetView.render().el);
            $dialog.on('hidden.bs.modal', function () {
                $(this).remove();
            });
            $dialog.off('click.saveSet')
                .on('click.saveSet', '.js-fc-tp-amount-set-confirm', function (ev) {
                    self.saveAmountSet($dialog,type);
                });
        },
        saveAmountSet: function ($dialog,type) {
            var $currContainer = $dialog.find('.js-fc-tp-amount-form');
            var clpValidate = $currContainer.parsley().validate();
            if (!clpValidate) {
                return false;
            }
            var self = this;
            var data = {
                feeOpen: $dialog.find('.js-tp-status-option').val(),
                minFeeLimit: $dialog.find('.js-fc-each-recharge-fei').val(),
                maxFeeLimit: $dialog.find('.js-fc-each-recharge-max').val(),
                minMoneyLimit: $dialog.find('.js-fc-min-money').val(),
                maxMoneyLimit: $dialog.find('.js-fc-max-money').val(),
                amount: _($currContainer.serializeArray()).serializeObject(),
                type:type
            };
            this.saveAmountSetXhr(data).fail(function () {
            }).done(function (res) {
                if (res.result === 0) {
                    Global.ui.notification.show('操作成功。');
                    self.onRender();
                    $dialog.modal('hide');
                } else {
                    Global.ui.notification.show('操作失败。');
                }
            });
        }
    });

    module.exports = ListView;
});
//56250
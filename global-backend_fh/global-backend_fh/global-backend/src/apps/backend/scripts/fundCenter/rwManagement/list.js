define(function (require, exports, module) {

    var BankManagementAddOrEditView = require('./edit');

    var ListView = Base.ItemView.extend({

        template: require('text!./list.html'),

        events: {
            'click .js-fc-tp-add': 'addBankHandler',
            'click .js-fc-tp-edit': 'editBankHandler',
            'click .js-fc-tp-delete': 'deleteBankHandler',
            'click .js-fc-tp-useable': 'changeBankStateHandler',
            'click .js-fc-tp-save': 'saveThirdPartyPaySort'
        },

        //银行列表
        findBankListXhr: function () {
            return Global.sync.ajax({
                url: '/intra/paymanage/paylist.json',
                data: {
                    paymentType: this.options.paymentType,
                    type: 0
                }
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

        //禁用/启用银行卡
        changeBankStatusXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/paymanage/dostatus.json',
                data: data
            });
        },
        addBankHandler: function (e) {
            var data = {
                type: 'add'
            };
            this.popLargeRechargeUserEditModel(data);

        },

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
        changeBankStateHandler: function (e) {
            var self = this;
            $(document).confirm({
                content: '确认变更该支付方式状态？',
                agreeCallback: function () {
                    self.changeBankState(e);
                }
            });
        },

        //删除银行卡
        deleteBankStatusXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/paymanage/delpay.json',
                data: data
            });
        },

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

        onRender: function () {
            var self = this;
            this.$bankTable = this.$('.js-fc-tpm-table');
            this.$bankTable.html('');

            this.findBankListXhr().fail(function () {
            }).done(function (res) {
                if (res.result === 0) {
                    _(res.root.platformList).each(function (platform) {
                        self.generateBankTr(platform, res.root.payList);
                    });

                    /*_(_(res.root.payList).sortBy(function(pay){
                     return pay.paymentId;
                     })).each(function (bank, index) {
                     self.generateBankTr(bank);
                     });*/
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });

        },
        generateBankTr: function (platform, payList) {
            var html = [];

            html.push('<tr data-platformid="' + platform.platformId + '"');
            html.push('><td>' + platform.platformName + '</td>');
            var idHtml = [];
            var noHtml = [];
            var noteHtml = [];
            var statuHtml = [];
            var operaterHtml = [];
            var tPayList = [];

            _(payList).each(function (pay) {
                if (pay.platformId == platform.platformId) {
                    tPayList.push(pay);
                }
            });

            _(tPayList).each(function (pay) {
                idHtml.push('<label style="margin-top:9px;">'+pay.paymentId+'</label>');
                noHtml.push('<label style="margin-top:9px;">'+pay.merchantCode+'</label>');
                if(pay.remark==null){
                    noteHtml.push('<label style="margin-top:9px;">&nbsp;&nbsp;</label>');
                }else{
                    noteHtml.push('<label style="margin-top:9px;">'+pay.remark+'</label>');
                }
                var status = '';
                var operate = '';
                switch (pay.status) {
                    case 1 :
                        status = '<span class="text-danger"><label style="margin-top:9px;">使用中</label></span>';
                        operate += '<button class="btn btn-link js-fc-tpm-useable no-m-right" data-status="1" data-id="' + pay.paymentId + '">禁用</button>';
                        break;
                    case 2 :
                        status = '<label style="margin-top:9px;">已停用</label>';
                        operate += '<button class="btn btn-link js-fc-tpm-useable no-m-right" data-status="2" data-id="' + pay.paymentId + '">启用</button>';
                        break;
                }

                if (!Global.authority.fc || !Global.authority.fc.tp || !Global.authority.fc.tp.disable) {
                    operate = '';
                }

                if (Global.authority.fc && Global.authority.fc.tp && Global.authority.fc.tp.edit) {
                    operate += '<button  class="btn btn-link js-fc-tpm-edit no-m-left no-p-left" data-platformname="' + pay.platformName
                        + '" data-merchantcode="' + pay.merchantCode + '" data-publickey="'+pay.publicKey + '" data-privatekey="'+pay.privateKey+'" data-remark="' + pay.remark + '" ' +
                        'data-payurl="' + pay.payUrl + '" data-notifyurl="' + pay.notifyUrl + '" data-paymentid="' + pay.paymentId + '" data-platformid="' + pay.platformId + '"data-type="edit">编辑</button>';
                }

                operate += '<button  class="btn btn-link js-fc-tpm-delete no-m-left no-p-left" data-id="' + pay.paymentId + '" data-type="delete">删除</button>';
                statuHtml.push(status);
                operaterHtml.push(operate);
            });


            html = html + '<td>' + idHtml.join('<br/>') + '</td>' + '<td>' + noHtml.join('<br/>') + '</td>' + '<td>' + noteHtml.join('<br/>') + '</td>' + '<td>' + statuHtml.join('<br/>') + '</td>' + '<td>' + operaterHtml.join('<br/>') + '</td>' + '</tr>';

            this.$bankTable.append(html);
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

        formatGridData: function (str) {
            if (_(str).isNaN()) {//包含undefined
                str = '';
            }
            if (_(str).isNumber()) {
                str = str + '';
            }
            if (_(str).isNull()) {
                str = '';
            }
            if (_(str).isObject()) {
                str = str + '';
            }
            if (str.length > 20) {
                str = str.substring(0, 20) + '...';
            }
            return str;
        },


        insertNotice: function ($target, html) {
            $target.html(this._getErrorMsg(html));
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

    module.exports = ListView;
});
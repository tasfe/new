define(function (require, exports, module) {

    var AgGameController = require('agGame/controller');

    exports.install = function () {

        window.Global.appRouter.processAppRoutes(new AgGameController(), {
            'ag/ul': 'agUserDetailView',
            //'ag/ul/detail/:userId': 'agUserDetailsView'
            'ag/bt': 'agBetRecordView',
            'ag/st': 'agSysSetView',
            'ag/aa': 'agProfitAndLossReport',
            'ag/fcs': 'agRechargeSetView',
            'ag/fcl': 'agRechargeReportView',
            'ag/fcr':'agRebateSetView',
            'sc/sbc':'agSubDividConf',
            'sc/sbl':'agSubDividManagement'
        });

    };

});
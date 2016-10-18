define(function (require, exports, module) {
    require('prefab/views/tabView');

    var NewLevelsView = require('agGame/amountManagement/ag-rechargeLevelSet');
    var NewNumView = require('agGame/amountManagement/ag-rechargeNumSet');
    var NewBetView = require('agGame/amountManagement/ag-rechargeBetSet');
    var AgRechargeSetView = Base.Prefab.TabView.extend({
        initialize: function() {
            _(this.options).extend({
                tabs: [
                    {
                        label: '资金转移上下限设置',
                        name: 'Levels',
                        id: 'jsSPLevels',
                        view: NewLevelsView
                    },
                    {
                        label: '转账次数设置',
                        name: 'Num',
                        id: 'jsSpNum',
                        view: NewNumView
                    },
                    {
                        label: '提现流水设置',
                        name: 'bet',
                        id: 'jsSpBet',
                        view: NewBetView
                    }
                ]
            });
        },

        renderLimit: function($limit) {
            var self = this;

        }

    });

    module.exports = AgRechargeSetView;
});
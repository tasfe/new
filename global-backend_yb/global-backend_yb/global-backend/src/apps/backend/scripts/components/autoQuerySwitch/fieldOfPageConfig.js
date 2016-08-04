define(function(require, exports, module) {
    var config = [
        {
            name: '投注记录',
            key: 'bettingRecord',
            field: ['tradeNo','username'],
            fieldName: ['订单编号','用户名']
        },
        {
            name: '追号记录',
            key: 'chaseRecord',
            field: ['tradeNo','username'],
            fieldName: ['追号编号','用户名']
        },
        {
            name: '充值记录',
            key: 'rechargeRecord',
            field: ['tradeNo','username'],
            fieldName: ['交易流水号','用户名']
        },
        {
            name: '账户明细',
            key: 'accountDetail',
            field: ['tradeNo','username'],
            fieldName: ['交易流水号','用户名']
        },
        {
            name: '用户银行卡管理',
            key: 'userCardMan',
            field: ['username','cardNo'],
            fieldName: ['用户名','银行卡号']
        },
        {
            name: '用户列表',
            key: 'userList',
            field: ['username','ip'],
            fieldName: ['用户名','登录IP']
        }
    ];
    return {
        get: function(){
            return config
        }
    }
});
define(function(require, exports, module) {

    var status_config = [
        {
            status: ['待审核','待处理','未处理','待审核','待发放'],
            code: 0,
            color: 'gold'
        },
        {
            status: ['已通过','已处理','已处理','通过审核','已发放'],
            code: 1,
            color: 'green'
        },
        {
            status: ['未通过','不处理','未通过审核','不发放','不通过'],
            code: 2,
            color: 'grey'
        },
        {
            status: ['未申请'],
            code: 3,
            color: 'red'
        },
        {
            status: ['统计中'],
            code: 4,
            color: 'brown'
        }
    ];

    return {
        get: function(status) {
            return _(status_config).find(function(item){
                return _(item.status).find(function(str){
                    return status===str;
                });
            });
        },
        getCodeByStatus:function(status) {
            var config =  _(status_config).find(function(item){
                return _(item.status).find(function(str){
                    return status.indexOf(str)>=0;
                });
            });
            if(config){
                return config.code;
            }else{
                return null;
            }
        }
    };
});

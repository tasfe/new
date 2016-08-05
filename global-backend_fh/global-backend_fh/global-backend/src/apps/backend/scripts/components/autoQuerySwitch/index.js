define(function (require, exports, module) {
    var QueryConfigOfPage = require('./fieldOfPageConfig');

    var CheckRight = Base.PrefabView.extend({

        initialize: function () {
        },
        render: function () {
            return this;
        },
        /**
         * 检查是否可以进行查询，否则返回提示信息。
         * @param key
         * @param $form
         * @returns {*}
         */
        checkCanQuery: function (title, $form) {
            var msg = '';
            if (this.checkIfOpen()) {
                //如果未开启，则需要判断是否输入了查询条件
                //获取指定页面的配置信息
                var queryConfigOfPage = QueryConfigOfPage.get();
                var config = _(queryConfigOfPage ? queryConfigOfPage : []).find(function (item) {
                    return item.name === title;
                });
                if (_(config).isObject()) {
                    var fields = _(config.field ? config.field : []).filter(function (item) {
                        if ($form.find('input[name=' + item + ']').val() !== '') {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    if (_(fields).size() === 0) {
                        msg = '请至少输入（' + config.fieldName.join('、') + '）中的一个查询条件!';
                    }
                }
            }
            return msg;

        },
        /**
         * 检查是否开启了限制，true:开启了限制，false:未开启限制
         * @returns {boolean}
         */
        checkIfOpen: function () {
            var acctInfo = Global.memoryCache.get('acctInfo');
            return !!acctInfo.restricted;//0不受限制，1受限制
        }
    });

    module.exports = CheckRight;
});

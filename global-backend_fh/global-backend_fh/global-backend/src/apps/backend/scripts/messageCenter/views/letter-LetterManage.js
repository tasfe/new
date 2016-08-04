define(function (require, exports, module) {
    var ShowLetterDetailView = require('messageCenter/views/letter-ShowLetter');
    require('prefab/views/searchGrid');
    var LetterManageView = Base.Prefab.SearchGrid.extend({

        template: require('text!messageCenter/templates/letter-LetterManage.html'),

        events: {
            'click .js-il-show': 'showLetterDetailHandler'
        },

        initialize: function () {
            _(this.options).extend({
                title: '站内信管理',
                columns: [
                    {
                        name: '内容',
                        width: '55%'
                    },
                    {
                        name: '发件人',
                        width: '15%'
                    },
                    {
                        name: '收件人',
                        width: '15%'
                    },
                    {
                        name: '时间',
                        width: '15%'
                    }
                ],
                gridOps: {
                    emptyTip: '无记录'
                },
                ajaxOps: {
                    url: '/intra/systemnotice/getstationletterlist.json'
                }
            });
        },
        onRender: function () {
            Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);
        },

        renderGrid: function (gridData) {
            var rowsData = _(gridData.letterList).map(function (letter, index) {
                return {
                    columnEls: this.formatRowData(letter, index),
                    dataAttr: letter
                };
            }, this);

            this.grid.refreshRowData(rowsData, gridData.rowCount, {
                pageIndex: this.filterHelper.get('pageIndex'),
                initPagination: true
            })
                .hideLoading();
        },

        formatRowData: function (rowInfo) {
            var row = [];
            row.push(rowInfo.title);
            //if (rowInfo.replyNum||rowInfo.replyNum===0) {
            //    if(Global.authority.mc && Global.authority.mc.il && Global.authority.mc.il.detail){
            //        row.push('<button data-letterid="' + rowInfo.letterId + '" data-titleid="' + rowInfo.titleId + '" class="js-il-show btn btn-link no-padding no-border">' + rowInfo.title + (rowInfo.replyNum===0?'': '&nbsp;&nbsp;(' + rowInfo.replyNum + ')')+ '</button>');
            //    }else{
            //        row.push(rowInfo.title + '&nbsp;&nbsp;(' + rowInfo.replyNum + ')');
            //    }
            //} else {
            //    row.push(rowInfo.title);
            //}
            row.push(rowInfo.sender);
            row.push(rowInfo.recevier);
            row.push(_(rowInfo.time).toTime());
            return row;
        }
        ,
        //显示站内信详情
        showLetterDetailHandler: function (e) {
            var $target = $(e.currentTarget);
            var letterId = $target.data('letterid');
            var titleId = $target.data('titleid');
            var $dialog = Global.ui.dialog.show(
                {
                    size: 'modal-lg',
                    title: '站内信详情',
                    body: '<div class="js-il-show-letter"></div>'
                }
            );
            var $selectContainer = $dialog.find('.js-il-show-letter');

            var showLetterView = new ShowLetterDetailView({letterId: letterId, titleId: titleId});
            $selectContainer.html(showLetterView.render().el);

            $dialog.on('hidden.bs.modal', function (e) {
                $(this).remove();
                showLetterView.destroy();
            });
        }
    });

    module.exports = LetterManageView;
});
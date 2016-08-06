define(function (require, exports, module) {

    var ShowLetterDetailView = Base.ItemView.extend({

        template: require('text!messageCenter/templates/letter-ShowLetter.html'),

        events: {},

        getLetterDetailXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/systemnotice/getletdetaillist.json',
                data: data
            });
        },

        onRender: function () {
            var self = this;
            this.$chat = this.$('.js-nc-chat-container');
            self.getLetterDetailXhr({letterId: self.options.letterId,titleId:self.options.titleId}).always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    self.$('.js-il-title').html(res.root.title);
                    self.$('.js-il-sender').html(res.root.sender);
                    self.$('.js-il-recevier').html(res.root.recevier);
                    self.$('.js-il-time').html(_(res.root.time).toTime());
                    self.renderLetterChat(res.root.detailList,res.root.sender);
                } else {
                    Global.ui.notification.show('数据异常。');
                }
            });
        },
        renderLetterChat: function(chatData,sender) {

            chatData = _(chatData).reduceRight(function(chatData, chat) {
                chatData.push({
                    sender: chat.sendName,
                    content: chat.content,
                    sendTime: chat.sendTime,
                    isSender: chat.sendName === sender
                });

                return chatData;
            }, []);

            if (!this.chat) {
                this.chat = new Base.Prefab.Chat();

                this.$chat.html(this.chat.render(chatData).el);
            } else {
                this.$chat.html(this.chat.render(chatData).el);
            }
        }
    });

    module.exports = ShowLetterDetailView;
});
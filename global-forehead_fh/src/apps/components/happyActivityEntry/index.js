"use strict";


require('./index.scss');
var ActivityEntry = Base.PrefabView.extend({

    template: require('./index.html'),

    events:{
      'click .js-activity-entry-a':'closeHandler',
      'click .js-activity-entry-look':'lookHandler'
    },

    gitEntryStatusXhr:function (type) {
        return Global.sync.ajax({
            url: '/info/happystageactivity/happystagetip.json',
            data: {
                type: type
            }
        });
    },

    initialize: function() {
    },

    onRender: function(options) {
        var self = this;
        this.$main = this.$('.js-activity-entry-main');
        this.$num = this.$('.js-activity-entry-num');
        this.$href = this.$('.js-activity-entry-look');
        this.$href.attr('href','http://' + window.location.host + '/activity.html?id=40');
        this.$href.attr('target','_blank');
        this.gitEntryStatusXhr(options.options.type)
            .done(function(res){
                if(res.result === 0){
                    self.$num.html(_(res.root.bonusTotal).convert2yuan());
                    if(res.root.valid === 0){
                        self.$main.removeClass('hidden');
                    }else{
                        self.destroy();
                    }
                }else{
                    self.destroy();
                }
            });
        return this;
    },
    closeHandler:function () {
        this.$main.addClass('hidden');
        this.destroy();
    },
    lookHandler:function () {
        this.$main.addClass('hidden');

        //window.location.href = 'http://' + window.location.host + '/activity.html?id=40';
        this.destroy();
    }

});

module.exports = ActivityEntry;

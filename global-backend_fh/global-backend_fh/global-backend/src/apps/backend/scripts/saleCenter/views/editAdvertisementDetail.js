define(function (require, exports, module) {
    var RebateRightView = require('com/rebateRight/index');

    var EditAdvertiseView = Base.ItemView.extend({

        template: require('text!saleCenter/templates/editAdvertisementDetail.html'),

        events: {
            'change .js-ca-place': 'selectChangeHandle',
            'click .js-il-edit-confirm':'updateAdvertisementHandle'
        },

        getPlaceXhr: function (data) {
            return Global.sync.ajax({
                url: '/intra/advertisemanage/getadvertisedetail.json',
                data:data
            });
        },
        getPlaceInfoXhr: function () {
            return Global.sync.ajax({
                url: '/intra/advertisemanage/getadvertisesort.json'
            });
        },

        onRender: function() {
            var self = this;

            self.getPlaceXhr({advId:self.options.aId}).always(function () {
            }).fail(function () {
                // 处理失败
            }).done(function (res) {
                if (res && res.result === 0) {
                    var option = {userLevel:res.root.userLevel,disabled:1};
                    var rebateRightView = new RebateRightView(option);
                    self.$('.js-am-editAdvertise-form').prepend(rebateRightView.render().$el);

                    self.formatPlaceInfo(res);
                    self.placeId=res.root.placeId;
                    self.placeName=res.root.placeName;
                    self.oldSort=res.root.sort;
                    self.actId=res.root.advId;
                    self.$('.js-am-arManageUpload-btn').imgBar({imgList:(res.root.picUrl).split(',')});
                }else {
                    Global.ui.notification.show('数据异常。');
                }

            });
            //初始化时间选择
            new Global.Prefab.Timeset({
                el: this.$('.js-am-timeset'),
                startTime: 'startTime',
                endTime: 'endTime',
                endDate:moment().add(1, 'year'),
                startValidate: 'required data-parsley-trigger="blur"',
                endValidate: 'required data-parsley-trigger="blur"'
                //startDate:moment()
            }).render();
            this.parsley= this.$('.js-am-editAdvertise-form').parsley();
        },
        //上传附件
        generateImageArea: function(url,name){
            this.$('.js-am-attach').html($('<div class="gallery-item no-rotate width-sm m-right-sm">' +
                '<div class="gallery-wrapper width-sm"><a class="gallery-remove"><i class="fa fa-times"></i></a><img src="' +
                url+'" class="js-am-arManage-attach square-sm">'+(name?'<div class="gallery-title">'+ name + '</div>':'')+'</div></div>'));
        },
        formatPlaceInfo:function(data){
            var self=this;
            var a=self.getPlaceInfoXhr().done(function(res) {
                if (res && res.result === 0) {
                    //var placeData = _(res.root).map(function (place) {
                    //    return '<option value="' + place.placeId + '">' + place.placeName + '</option>';
                    //});
                    //self.$('.js-am-place').html(placeData.join(''));
                    //self.$('.js-am-place').find('option[value="'+placeId+'"]').attr('checked',true);
                    self.$('.js-am-place').html('<span data-id="' + data.root.placeId + '">' + data.root.placeName + '</span>');
                    self.$('.js-am-name').val(data.root.advName);
                    self.$('.js-am-url').val(data.root.advUrl);
                    self.$('.js-start-time').val(_(data.root.startTime).toTime());
                    self.$('.js-end-time').val(_(data.root.endTime).toTime());
                    var num = _.findWhere(res.root, {placeId: data.root.placeId}).sortNum;
                    var a = _(num-1).chain().range(0, -1).map(function (num) {
                        return '<option value="' + num + '">' + num + '</option>';
                    }).value();
                    self.$('.js-am-sort').html(a.join(''));
                    self.$('.js-am-sort').val(data.root.sort);

                } else {
                    Global.ui.notification.show('数据异常。');
                }
            })
        },
        updateAdvertisementHandle: function (e) {
            var userLevel = [];
            _(this.$('.js-pf-userLevel')).map(function(item){
                if($(item).prop('checked')){
                    userLevel.push( $(item).val());
                }
            });
            return Global.sync.ajax({
                url: '/intra/advertisemanage/modifyadvertise.json',
                data: {
                    placeId: this.placeId,
                    placeName:this.$('.js-am-place').children().html(),
                    name:this.$('.js-am-name').val(),
                    picUrl:this.$('.js-wt-img-attach').attr('src'),
                    advUrl:this.$('.js-am-url').val(),
                    startTime:this.$('.js-start-time').val(),
                    endTime:this.$('.js-end-time').val(),
                    sort:this.$('.js-am-sort').find('option:checked').val(),
                    actId:this.actId,
                    oldSort:this.oldSort,
                    userLevel: userLevel.join(',')
                }
            })
        },
        insertNotice: function ( html) {
            this.$('.js-sc-am-ea-notice').html(this._getErrorMsg(html));
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

    module.exports = EditAdvertiseView;
});
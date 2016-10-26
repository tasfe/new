define(function (require, exports, module) {
  var NewAdvertisementView = Base.ItemView.extend({

    template: require('text!saleCenter/templates/newAdvertisement.html'),
    rebate_template: require('text!com/rebateRight/rebate-Right-Config.html'),

    events: {
      'change .js-ca-place': 'selectChangeHandle',
      'click .js-ac-btn-submit': 'newAdvertiseHandler',
      'click .js-pf-allUser': 'selectAllUserHandler',
      'click .js-pf-userLevel': 'checkAllUserSelectHandler'
    },
    initialize: function () {
    },

    onRender: function () {
      var self = this;
      this.$('.js-ac-newAdvertise-form').prepend(_(this.rebate_template).template()());

      Global.sync.ajax({
        url: '/intra/advertisemanage/getadvertisesort.json',
        data: {}
      })
        .always(function () {
        })
        .fail(function () {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            var placeData = _(res.root).map(function (place) {
              return '<option value="' + place.placeId + '">' + place.placeName + '</option>';
            });
            self.$('.js-ca-place').html('<option value="0">全部</option>' + placeData.join(''));
            self.barList = res.root;
            self.$('.js-ca-arManageUpload-btn').imgBar();
            self.$('.js-ca-sort').html('<option value="0">全部</option>');
          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
      //初始化时间选择
      new Global.Prefab.Timeset({
        el: this.$('.js-ca-timeset'),
        startTime: 'startTime',
        endTime: 'endTime',
        endDate: moment().add(1, 'year'),
        startValidate: 'required data-parsley-trigger="blur"',
        endValidate: 'required data-parsley-trigger="blur"'
      }).render();
    },
    selectChangeHandle: function (e) {
      var $target = $(e.currentTarget);
      var value = Number($target.val());
      var html = '';

      if (value === 0) {
        html = '<option value="">请选择广告位</option>';
      } else {
        var num = _.findWhere(this.barList, {placeId: value}).sortNum;
        html = _(num).chain().range(0, -1).map(function (num) {
          return '<option value="' + num + '">' + num + '</option>';
        }).value().join('');
      }
      this.$('.js-ca-sort').html(html);
    },
    newAdvertiseHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      if(_(this.$('.js-wt-img-attach')).size()===0){
        self.insertNotice('请先上传图片。');
        return false;
      }else if(_(this.$('.js-wt-img-attach')).size()>1){
        self.insertNotice('仅允许上传一张图片。');
        return false;
      }
      var $currContainer = $('.js-ac-newAdvertise-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        $target.button('loading');
        var userLevel = [];
        _(this.$('.js-pf-userLevel')).map(function(item){
          if($(item).prop('checked')){
            userLevel.push( $(item).val());
          }
        });
        Global.sync.ajax({
          url: '/intra/advertisemanage/saveadvertise.json',
          data: {
            placeId: this.$('.js-ca-place').find('option:checked').val(),
            placeName: this.$('.js-ca-place').find('option:checked').html(),
            name: this.$('.js-ca-name').val(),
            picUrl: this.$('.js-wt-img-attach').attr('src'),
            advUrl: this.$('.js-ca-url').val(),
            startTime: this.$('.js-start-time').val(),
            endTime: this.$('.js-end-time').val(),
            sort: this.$('.js-ca-sort').find('option:checked').val(),
            userLevel: userLevel.join(',')
          }
        })
          .always(function () {
            $target.button('reset');
          })
          .fail(function () {
            // 处理失败
          })
          .done(function (res) {
            if (res && res.result === 0) {
              Global.ui.notification.show('操作成功。');
              Global.appRouter.navigate(_('#sc/ca').addHrefArgs({_t: _.now()}), {trigger: true, replace: false});
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      }
    },
    insertNotice: function ( html) {
      this.$('.js-sc-na-notice').html(this._getErrorMsg(html));
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
    },
    selectAllUserHandler: function(){
      var $target = this.$('.js-pf-allUser');
      var checked = $target.prop('checked');
      if(checked){
        this.$('.js-pf-userLevel').each(function () {
          $(this).prop('checked',true);
        });
      }else{
        this.$('.js-pf-userLevel').each(function () {
          $(this).prop('checked',false);
        });
      }
    },
    checkAllUserSelectHandler: function(){
      var flag = true;
      var $target = this.$('.js-pf-userLevel');
      this.$('.js-pf-userLevel').each(function () {
        var checked = $(this).prop('checked');
        if(!checked){
          flag = false;
        }
      });
      this.$('.js-pf-allUser').prop('checked',flag);
    }

  });
  module.exports = NewAdvertisementView;
});
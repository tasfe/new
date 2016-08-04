define(function (require, exports, module) {

  var NewDistributorView = Base.ItemView.extend({

    template: require('text!userCenter/templates/user-NewDistributor.html'),

    events: {
      'click .js-gm-btn-submit': 'newDistributorHandler',
      'blur .js-go-username': 'checkUserExistHandler'
    },
    initialize: function () {
    },
    getSystemQuotaXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/usermanager/getquotalevel.json'
      });
    },
    checkUserExistXhr: function (data) {
      return Global.sync.ajax({
        url: '/intra/usermanager/userexist.json',
        data: data
      });
    },
    //查询返点
    _getQuotaData: function (params) {
      return Global.sync.ajax({
        url: '/intra/usermanager/quotacfgdetail.json',
        data: params
      });
    },
    onRender: function () {
      var self = this;
      self.getSystemQuotaXhr().always(function () {
      }).fail(function () {
        // 处理失败
      }).done(function (res) {
        if (res && res.result === 0) {
          if (res.root && _(res.root).size() > 0) {
            var quotaData = _(res.root).map(function (quota) {
              return '<div class="form-group form-inline">' +
                '<div class="form-group" style="margin-top: 10px;margin-left: 1px;">' +
                '<span class="js-gm-quotaId" data-id="' + quota.quotaId + '" data-min="' + quota.quotaMin + '" data-max="' + quota.quotaMax + '">' +
                '<label for="inputEmail3" class="col-sm-4 control-label">' + _(quota.quotaLevel).formatDiv(10) + '%' + '&nbsp;&nbsp;(' + _(quota.bonusLevel).convert2yuan() + ')' + '</label>' +
                '</span>' +
                '<div class="col-sm-4">' +
                '<input type="text" class="js-go-quotaNum form-control" value="0" data-parsley-range="[0, 999]" data-parsley-type="integer" required>' +
                '</div>' +
                '<label for="inputEmail3" class="col-sm-4 control-label">个</label>' +
                '</div>' +
                '</div>'
            });
            self.$('.js-go-quota').html(quotaData.join(''));
          } else {
            //Global.ui.notification.show('用户未设置配额');
            Global.ui.notification.show('数据异常。');
          }
        } else {
          Global.ui.notification.show('数据异常。');
        }

        self._getQuotaData().fail(function () {
        }).done(function (res) {
          if (res.result == 0) {
            self.renderBaseInfo(res.root);
          } else {
            Global.ui.notification.show('操作失败。');
          }
        });

      });
    },


    renderBaseInfo: function (root) {
      if (root && root.level1 && _(root.level1).size() == 4) {
        var quotaNumArr = _(root.level0).sort(function (item) {
          return -item.rebate;
        });
        _(this.$('.js-go-quotaNum')).each(function(item,index){
          $(item).val(quotaNumArr[index].quotaNum);
        });
      }
    },
    newDistributorHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      var $currContainer = this.$('.js-go-distributor-form');
      var clpValidate = $currContainer.parsley().validate();
      if (clpValidate) {
        $target.button('loading');
        Global.sync.ajax({
          url: '/intra/usermanager/savedistributor.json',
          data: {
            username: this.$('.js-go-username').val(),
            // userUName: this.$('.js-go-useruname').val(),
            loginPwd: this.$('.js-go-password').val(),
            quotaList: _(this.$('.js-gm-quotaId')).map(function (quota, index, quotaList) {
              return {
                quotaId: $(quota).data('id'),
                quotaMin: $(quota).data('min'),
                quotaMax: $(quota).data('max'),
                quotaNum: $(self.$('.js-go-quotaNum')[index]).val()
              }
            })
          }
          ,
          tradition: true
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
              Global.appRouter.navigate(_('#uc/go').addHrefArgs({_t: _.now()}), {
                trigger: true,
                replace: false
              });
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      }
    },
    checkUserExistHandler: function (e) {
      var self = this;
      var data = {
        username: $(e.currentTarget).val()
      };
      if ($(e.currentTarget).val() == '') {
        self.$('.js-go-tip').removeClass('hidden').html("用户名不能为空");
        return;
      }
      this.checkUserExistXhr(data).fail(function () {
      }).done(function (res) {
        if (res.result === 0) {
          self.$('.js-go-tip').addClass('hidden');
        } else {
          if(res.msg!=='fail'){
            self.$('.js-go-tip').removeClass('hidden').html(res.msg);
          }
        }
      });
    }
  });

  module.exports = NewDistributorView;
});
//56250
define(function (require, exports, module) {

  var TrackRecordsView = Base.ItemView.extend({

      template: require('userCenter/templates/cardBinding.html'),

    province_temp: require('userCenter/templates/provinceAndCity.html'),

      events: {
        'click .js-uc-cbProvince': 'propProvinceSelectHandler',
        'change .js-uc-cbCity': 'selectCityAndBankHandler',
        'change .js-uc-cbBankId': 'selectCityAndBankHandler',
        'click .js-uc-cm-province': 'selectProvinceHandler'
      },

      initialize: function () {
      },

      saveCardBindingInfoXhr: function (data) {
        return Global.sync.ajax({
          url: '/fund/bankcard/savecard.json',
          data: data
        });
      },

      getBankListXhr: function () {
        return Global.sync.ajax({
          url: '/fund/bankcard/banklist.json'
        });
      },
      getProvinceListXhr: function () {
        return Global.sync.ajax({
          url: '/info/city/provincelist.json'
        });
      },
      getCityListXhr: function (data) {
        return Global.sync.ajax({
          url: '/info/city/citylist.json',
          data: data
        });
      },
      getBranchListXhr: function (data) {
        return Global.sync.ajax({
          url: '/fund/bankcard/branchlist.json',
          data: data
        });
      },
      onRender: function () {
        var self = this;
        this.$bankBranch = this.$('.js-uc-cbBankBranch');
        this.$bankId = this.$('.js-uc-cbBankId');
        this.$province = this.$('.js-uc-cbProvince');
        this.$city = this.$('.js-uc-cbCity');
        this.$userAccountName = this.$('.js-uc-cbAccountName');
        this.$bindForm = this.$('.js-uc-cbCardBindingForm');
        this.$cardNo = this.$('.js-uc-cbCardNo');
        this.$province.popover({
          trigger: 'manual',
          html: true,
          container: this.$el,
          content: this.province_temp,
          placement: 'right'
        });
        this.$province.on('hidden.bs.popover', function (e) {
          // 执行一些动作...
          e.stopPropagation();
          return false
        });
        this.getBankListXhr().done(function (res) {
          if (res.result === 0) {
            var bankOptions = [];
            _(res.root).each(function (bank, index, bankList) {
              bankOptions.push('<option value="' + bank.bankId + '">' + bank.bankName + '</option>');
            });
            self.$bankId.append(bankOptions.join(''));
          } else {
            Global.ui.notification.show("获取银行列表失败，" + res.msg);
          }

        });
        //this.getProvinceListXhr()
        //  .done(function (res) {
        //    if (res.result === 0) {
        //      var provinceOptions = [];
        //      _(res.root).each(function (province, index, provinceList) {
        //        provinceOptions.push('<option value="' + province.provinceId + '">' + province.province + '</option>');
        //      });
        //      self.$province.append(provinceOptions.join(''));
        //    } else {
        //      Global.ui.notification.show("获取省份列表失败，" + res.msg);
        //    }
        //  });
      },

    propProvinceSelectHandler: function(e){
      this.$province.popover('show');
    } ,

      selectCityAndBankHandler: function(){
        var self = this;
        var cityId = this.$city.val();
        var bankId = this.$bankId.val();
        if(cityId=='' || bankId==''){
          return;
        }
        var data = {
          cityId: cityId,
          bankId: bankId
        };
        this.getBranchListXhr(data)
          .done(function (res) {
            if (res.result === 0) {
              var branchOptions = [];
              branchOptions.push('<option value="">支行</option>');
              _(res.root).each(function (branch, index, branchList) {
                branchOptions.push('<option value="' + branch.branchId + '">' + branch.branchName + '</option>');
              });
              self.$bankBranch.html('').html(branchOptions.join(''));
            } else {
              Global.ui.notification.show("获取城市列表失败，" + res.msg);
            }
          });
      },

      checkCardBindingInfoHandler: function (e,$dialog) {
        var $form = this.$bindForm;
        var clpValidate = $form.parsley().validate();
        if (!clpValidate) {
          return false;
        }
        var self = this;
        var bankName = this.$bankId.find('option:checked').html();
        var province = this.$province.find('option:checked').html();
        var city = this.$city.find('option:checked').html();
        var bankBranchName = this.$bankBranch.find('option:checked').html();
        var name = this.$userAccountName.val();
        var cardNo = this.$cardNo.val();


        var html = '<dl class="dl-horizontal"><dt >银行名称：</dt><dd>' + bankName + '</dd>';
        html = html + '<dl><dt >开户城市：</dt><dd>' + province + ' ' + city + '</dd>';
        html = html + '<dl><dt >支行名称：</dt><dd>' + bankBranchName + '</dd>';
        html = html + '<dl><dt >开户人姓名：</dt><dd>' + name + '</dd>';
        html = html + '<dl><dt >银行卡号：</dt><dd>' + cardNo + '</dd>';
        $(document).confirm({
          content: html,
          btnLeftText: '立即绑定',
          btnRightText: '返回',
          agreeCallback: function (ex) {
            self.submitBankCard(ex,$dialog);
          }
        });

      },

      submitBankCard: function (e,$dialog) {
        var self = this;
        var $target = $(e.currentTarget);
        var $cardBindingForm = this.$bindForm;
        var clpValidate = $cardBindingForm.parsley().validate();
        if (clpValidate) {
          $target.button('loading');

          var bankId = this.$bankId.val();
          var province = this.$province.val();
          var city = this.$city.val();
          var bankBranchId = this.$bankBranch.val();
          var name = this.$userAccountName.val();
          var cardNo = this.$cardNo.val();
          var pwdToken = this.options.token;

          var data = {
            bankId: bankId,
            province: province,
            city: city,
            branchId: bankBranchId,
            name: name,
            cardNo: cardNo,
            pwdToken: pwdToken
          };
          this.saveCardBindingInfoXhr(data).always(function () {
            $target.button('reset');
          })
            .done(function (res) {
            if (res.result === 0) {
              Global.ui.notification.show("绑定成功。", {
                type: 'success'
              });
              Global.memoryCache.set('hasBeenVerified','true');
              //Global.router.back();
              //Global.appRouter.navigate(_('#uc/cm').addHrefArgs('_t', _.now()), {trigger: true, replace: false});
              $dialog.modal('hide');
              self.options.parentView.render();
            } else {
              self.showErrMsg(res.msg==='fail'?'绑定失败！':res.msg);
             // Global.ui.notification.show("绑定失败，"+res.msg);
            }
          });
        }
      },
      showErrMsg: function(msg){
        this.$('.js-uc-cm-bingCardNotice').html(msg);
      },
        selectProvinceHandler: function(e){
          var $target = $(e.currentTarget);
          var provinceId = $target.data('id');
          var name = $target.text();
          this.$province.html('<option value="'+provinceId+'">'+name+'</option>');
          this.$province.popover('hide');
          var self = this;
          var data = {
            province: name
          };
          this.getCityListXhr(data)
              .done(function (res) {
                if (res.result === 0) {
                  var cityOptions = [];
                  cityOptions.push('<option value="">城市</option>');
                  _(res.root).each(function (city, index, cityList) {
                    cityOptions.push('<option value="' + city.cityId + '">' + city.city + '</option>');
                  });
                  self.$city.html('').html(cityOptions.join(''));
                } else {
                  Global.ui.notification.show("获取城市列表失败，" + res.msg);
                }
              });
        }


    })
    ;

  module.exports = TrackRecordsView;
})
;
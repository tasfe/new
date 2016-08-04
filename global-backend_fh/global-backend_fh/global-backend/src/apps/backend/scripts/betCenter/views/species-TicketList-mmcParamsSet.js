/**
 * Created by Administrator on 2016/7/7.
 */
define(function (require, exports, module) {

  var TicketMMCParamsSetView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/species-TicketList-mmcParamsSet.html'),

    //所有的事件绑定全部写在这！
    events: {
      'click .js-bc-btn-submit': 'formSubmitHandler',
      'click .js-bc-btn-cancel': 'formCancelHandler',
      'click .js-bc-injectBonus-submit': 'injectBonusHandler',
      'click .js-bc-specifyUser-submit':'specifyUserHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    getXxxXhr: function (datas) {
      return Global.sync.ajax({
        url: '/intra/ticketmng/mmccfgdetail.json',
        data: datas
      });
    },

    //在页面被渲染出来的时候自动调用
    onRender: function () {
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      var self = this;
      this.$btnSumbit = self.$('.js-bc-btn-submit');
      this.$formContainer = this.$('.js-bc-form');
      self.$('.js-bc-bagOpen').bind('click', self.switchHandler);
      self.$('.js-bc-freeGameOpen').bind('click', self.switchHandler);
      self.$('.js-bc-jakepotOpen').bind('click', self.switchHandler);
      var params = {ticketId: this.options.ticketId};
      self.$('.js-bc-ticketId').text(this.options.ticketId);
      self.$('.js-bc-ticketName').text(_.getUrlParam('ticketName'));
      this.getXxxXhr(params).always(function () {
        })
        .fail(function () {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            self.$('.js-bc-singleBonusLimit').val(_(res.root.singleBonusLimit).convert2yuan());

            if (res.root.bag.status == 1) {
              self.$('.js-bc-bagOpen').click();
            }
            self.$('.js-bc-minBegin').val(_(res.root.bag.minBegin).convert2yuan());
            self.$('.js-bc-maxBegin').val(_(res.root.bag.maxBegin).convert2yuan());
            self.$('.js-bc-bagEnd').val(res.root.bag.end);
            self.$('.js-bc-minAdd').val(_(res.root.bag.minAdd).convert2yuan());
            self.$('.js-bc-maxAdd').val(_(res.root.bag.maxAdd).convert2yuan());
            self.$('.js-bc-validTime').val(res.root.bag.validTime);
            self.$('.js-bc-minBet').val(_(res.root.bag.minBet).convert2yuan());
            self.$('.js-bc-minRate').val(_(res.root.bag.minRate).convert2yuan());
            self.$('.js-bc-maxRate').val(_(res.root.bag.maxRate).convert2yuan());
            self.$('.js-bc-noticeAmount').val(_(res.root.bag.noticeAmount).convert2yuan());
            self.$('.js-bc-iconRate').val(_(res.root.bag.iconRate).convert2yuan());

            if (res.root.free.status == 1) {
              self.$('.js-bc-freeGameOpen').click();
            }
            self.$('.js-bc-betNumlLimit').val(res.root.free.betNumLimit);

            if (res.root.jakePot.status == 1) {
              self.$('.js-bc-jakepotOpen').click();
            }
            self.$('.js-bc-triggerRate').val(_(res.root.jakePot.triggerRate).convert2yuan());
            self.$('.js-bc-jakepot-minBet').val(_(res.root.jakePot.minBet).convert2yuan());
            self.$('.js-bc-injectRate').val(_(res.root.jakePot.injectRate).convert2yuan());
            if (res.root.jakePot.subJakepot.length > 0) {
              _.map(_.range(res.root.jakePot.subJakepot.length), function (num) {
                var html = [];
                if (res.root.jakePot.subJakepot[num].type == 1) {
                  html.push('<td style="width: 100px;"><span><input type="text" hidden name="jakePot.subJakepot[0].type" value="' + res.root.jakePot.subJakepot[num].type + '">一等奖</span></td>');
                  html.push('<td style="width: 100px;"><span>皇冠奖</span></td>');
                  html.push('<td style="width: 100px;"><span>三个皇冠</span></td>');
                  html.push('<td><div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[0].amountRate" value="' + _(res.root.jakePot.subJakepot[num].amountRate).convert2yuan() + '"  required></div>%</td>');
                  html.push('<td><div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[0].prizeRate" value="' + _(res.root.jakePot.subJakepot[num].prizeRate).convert2yuan() + '"  required></div>%</td>');
                  html.push('<td>皇冠奖池<div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[0].bonusRate" value="' + _(res.root.jakePot.subJakepot[num].bonusRate).convert2yuan() + '"  required></div>%奖金</td>');
                  self.$('.js-bc-td0').html(html.join(''))
                } else if (res.root.jakePot.subJakepot[num].type == 2) {
                  html.push('<td style="width: 100px;"><span><input type="text" hidden name="jakePot.subJakepot[1].type" value="' + res.root.jakePot.subJakepot[num].type + '">二等奖</span></td>');
                  html.push('<td style="width: 100px;"><span>钻石奖</span></td>');
                  html.push('<td style="width: 100px;"><span>三个钻石</span></td>');
                  html.push('<td><div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[1].amountRate" value="' + _(res.root.jakePot.subJakepot[num].amountRate).convert2yuan() + '"  required></div>%</td>');
                  html.push('<td><div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[1].prizeRate" value="' + _(res.root.jakePot.subJakepot[num].prizeRate).convert2yuan() + '"  required></div>%</td>');
                  html.push('<td>钻石奖池<div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[1].bonusRate" value="' + _(res.root.jakePot.subJakepot[num].bonusRate).convert2yuan() + '"  required></div>%奖金</td>');
                  self.$('.js-bc-td1').html(html.join(''))
                } else if (res.root.jakePot.subJakepot[num].type == 3) {
                  html.push('<td style="width: 100px;"><span><input type="text" hidden name="jakePot.subJakepot[2].type" value="' + res.root.jakePot.subJakepot[num].type + '">三等奖</span></td>');
                  html.push('<td style="width: 100px;"><span>黄金奖</span></td>');
                  html.push('<td style="width: 100px;"><span>三个黄金</span></td>');
                  html.push('<td><div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[2].amountRate" value="' + _(res.root.jakePot.subJakepot[num].amountRate).convert2yuan() + '"  required></div>%</td>');
                  html.push('<td><div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[2].prizeRate" value="' + _(res.root.jakePot.subJakepot[num].prizeRate).convert2yuan() + '"  required></div>%</td>');
                  html.push('<td>黄金奖池<div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[2].bonusRate" value="' + _(res.root.jakePot.subJakepot[num].bonusRate).convert2yuan() + '"  required></div>%奖金</td>');
                  self.$('.js-bc-td2').html(html.join(''))
                } else if (res.root.jakePot.subJakepot[num].type == 4) {
                  html.push('<td style="width: 100px;"><span><input type="text" hidden name="jakePot.subJakepot[3].type" value="' + res.root.jakePot.subJakepot[num].type + '">四等奖</span></td>');
                  html.push('<td style="width: 100px;"><span>金蛋奖</span></td>');
                  html.push('<td style="width: 100px;"><span>三个金蛋</span></td>');
                  html.push('<td><div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[3].amountRate" value="' + _(res.root.jakePot.subJakepot[num].amountRate).convert2yuan() + '"  required></div>%</td>');
                  html.push('<td><div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[3].prizeRate" value="' + _(res.root.jakePot.subJakepot[num].prizeRate).convert2yuan() + '"  required></div>%</td>');
                  html.push('<td>金蛋奖池<div class="input-group col-lg-6"><input type="text" class="form-control" name="jakePot.subJakepot[3].bonusRate" value="' + _(res.root.jakePot.subJakepot[num].bonusRate).convert2yuan() + '"  required></div>%奖金</td>');
                  self.$('.js-bc-td3').html(html.join(''))
                }
              });
            }

            self.$('.js-bc-injectBonusList').html('<a href="'+_.getUrl('/injectBonusList')+'">历史奖池记录</a> ');
            self.$('.js-bc-specifyUserList').html('<a href="'+_.getUrl('/specifyUser')+'">历史指定记录</a>');

          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
    },

    //  点击开关触发的handler
    switchHandler: function (e) {
      var $target = $(e.currentTarget);
      var cancelOpenVal = $target.val(); // 0：关闭 1：开启
      if (cancelOpenVal == 0) {
        $target.val(1);

      } else if (cancelOpenVal == 1) {
        $target.val(0);
      }

      if ($target.val() == 1) {
        if ($target.hasClass('js-bc-cancelOpen')) {
          self.$('.js-bc-cancelMinMoney').removeAttr('readonly');
          self.$('.js-bc-cancelTimeLimit').removeAttr('readonly');
        } else if ($target.hasClass('js-bc-vedioOpen')) {
          self.$('.js-bc-addVedioLine-btn').removeClass('hidden');
          self.$('.js-bc-vedioLines').removeAttr('readonly');
        }
      } else if ($target.val() == 0) {
        if ($target.hasClass('js-bc-cancelOpen')) {
          self.$('.js-bc-cancelMinMoney').attr('readonly', true);
          self.$('.js-bc-cancelTimeLimit').attr('readonly', true);
        } else if ($target.hasClass('js-bc-vedioOpen')) {
          self.$('.js-bc-addVedioLine-btn').addClass('hidden');
          self.$('.js-bc-vedioLines').attr('readonly', true);
        }
      }
    },

    //表单被提交时触发的handler
    formSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var clpValidate = this.$formContainer.parsley().validate();
      if (clpValidate) {
        var reqParams = {};
        reqParams['ticketId'] = self.$('.js-bc-ticketId').text();
        reqParams['singleBonusLimit'] = self.$('.js-bc-singleBonusLimit').val();
        reqParams['bag.status'] = self.$('.js-bc-bagOpen').val();
        reqParams['bag.minBegin'] = self.$('.js-bc-minBegin').val();
        reqParams['bag.maxBegin'] = self.$('.js-bc-maxBegin').val();
        reqParams['bag.end'] = self.$('.js-bc-bagEnd').val();
        reqParams['bag.minAdd'] = self.$('.js-bc-minAdd').val();
        reqParams['bag.maxAdd'] = self.$('.js-bc-maxAdd').val();
        reqParams['bag.validTime'] = self.$('.js-bc-validTime').val();
        reqParams['bag.minBet'] = self.$('.js-bc-minBet').val();
        reqParams['bag.minRate'] = self.$('.js-bc-minRate').val();
        reqParams['bag.maxRate'] = self.$('.js-bc-maxRate').val();
        reqParams['bag.noticeAmount'] = self.$('.js-bc-noticeAmount').val();
        reqParams['bag.iconRate'] = self.$('.js-bc-iconRate').val();

        reqParams['free.status'] = self.$('.js-bc-freeGameOpen').val();
        reqParams['free.betNumLimit'] = self.$('.js-bc-betNumlLimit').val();

        reqParams['jakePot.triggerRate'] = self.$('.js-bc-triggerRate').val();
        reqParams['jakePot.minBet'] = self.$('.js-bc-jakepot-minBet').val();
        reqParams['jakePot.status'] = self.$('.js-bc-jakepotOpen').val();
        reqParams['jakePot.injectRate'] = self.$('.js-bc-injectRate').val();
        reqParams['jakePot.subJakepot[0].type'] = self.$("input[name='jakePot.subJakepot[0].type']").val();
        reqParams['jakePot.subJakepot[0].prizeRate'] = self.$("input[name='jakePot.subJakepot[0].prizeRate']").val();
        reqParams['jakePot.subJakepot[0].bonusRate'] = self.$("input[name='jakePot.subJakepot[0].bonusRate']").val();
        reqParams['jakePot.subJakepot[0].amountRate'] = self.$("input[name='jakePot.subJakepot[0].amountRate']").val();
        reqParams['jakePot.subJakepot[1].type'] = self.$("input[name='jakePot.subJakepot[1].type']").val();
        reqParams['jakePot.subJakepot[1].prizeRate'] = self.$("input[name='jakePot.subJakepot[1].prizeRate']").val();
        reqParams['jakePot.subJakepot[1].bonusRate'] = self.$("input[name='jakePot.subJakepot[1].bonusRate']").val();
        reqParams['jakePot.subJakepot[1].amountRate'] = self.$("input[name='jakePot.subJakepot[1].amountRate']").val();
        reqParams['jakePot.subJakepot[2].type'] = self.$("input[name='jakePot.subJakepot[2].type']").val();
        reqParams['jakePot.subJakepot[2].prizeRate'] = self.$("input[name='jakePot.subJakepot[2].prizeRate']").val();
        reqParams['jakePot.subJakepot[2].bonusRate'] = self.$("input[name='jakePot.subJakepot[2].bonusRate']").val();
        reqParams['jakePot.subJakepot[2].amountRate'] = self.$("input[name='jakePot.subJakepot[2].amountRate']").val();
        reqParams['jakePot.subJakepot[3].type'] = self.$("input[name='jakePot.subJakepot[3].type']").val();
        reqParams['jakePot.subJakepot[3].prizeRate'] = self.$("input[name='jakePot.subJakepot[3].prizeRate']").val();
        reqParams['jakePot.subJakepot[3].bonusRate'] = self.$("input[name='jakePot.subJakepot[3].bonusRate']").val();
        reqParams['jakePot.subJakepot[3].amountRate'] = self.$("input[name='jakePot.subJakepot[3].amountRate']").val();

        Global.sync.ajax({
            url: '/intra/ticketmng/savemmccfg.json',
            data: reqParams
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
              Global.appRouter.navigate(_('#bc/tl/mmcParams/' + self.$('.js-bc-ticketId').text()).addHrefArgs({
                _t: _.now(),
                ticketName: self.$('.js-bc-ticketName').text()
              }), {trigger: true, replace: false});
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      } else {
        $target.button('reset');
      }
    },

    //注入金额弹出处理窗口
    injectBonusHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      var injectBonus = self.$('.js-bc-injectBonus').val();

      if(injectBonus !=  ''){
        $target.button('loading');
        var self = this;
        var $dialog = Global.ui.dialog.show(
          {
            title: '提示',
            body: '  <div class="form-group form-inline"><div class="text-center" ><p>确认将'+injectBonus+'元注入奖池？<input class="hidden" value="'+injectBonus+'"></p></div></div>',
            footer: '<div class="form-group form-inline"><button class="js-bc-injectBonus-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="button">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button></div>'
          }
        );
        $target.button('reset');

        $dialog.on('hidden.bs.modal', function () {
          $(this).remove();
        });

        $dialog.off('click.saveInfo')
          .on('click.saveInfo', '.js-bc-injectBonus-confirm', function (ev) {
            var $target = $(ev.currentTarget);
            $target.button('loading');
            Global.sync.ajax({
                url: '/intra/ticketmng/bonusinject.json',
                data: {amount: injectBonus}
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
                  $dialog.modal('hide');
                } else {
                  Global.ui.notification.show('操作失败。');
                }
              });
          });
      }else{
        Global.ui.notification.show('请输入注入金额！');
      }
    },

    //注入金额弹出处理窗口
    specifyUserHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      var userName = self.$('.js-bc-specifyUser').val();
      var bonusType = self.$('.js-bc-bonusType').val();
      if(bonusType == 1){
        bonusName = '皇冠奖池奖励';
      }else if(bonusType == 2){
        bonusName = '钻石奖池奖励';
      }else if(bonusType == 3){
        bonusName = '黄金奖池奖励';
      }else if(bonusType == 4){
        bonusName = '玛瑙奖池奖励';
      }

      if(userName !=  ''){
        $target.button('loading');
        var self = this;
        var $dialog = Global.ui.dialog.show(
          {
            title: '提示',
            body: '  <div class="form-group form-inline"><div class="text-center" ><p>确认指定'+userName+'获得'+bonusName+'？<input class="hidden" value="'+userName+'"></p></div></div>',
            footer: '<div class="form-group form-inline"><button class="js-bc-specifyUser-confirm btn btn-primary" style="width: 100px;margin-right: 20px;" type="button">确定</button><button style="width: 100px;" class="btn" data-dismiss="modal">取消</button></div>'
          }
        );
        $target.button('reset');

        $dialog.on('hidden.bs.modal', function () {
          $(this).remove();
        });

        $dialog.off('click.saveInfo')
          .on('click.saveInfo', '.js-bc-specifyUser-confirm', function (ev) {
            var $target = $(ev.currentTarget);
            $target.button('loading');
            Global.sync.ajax({
                url: '/intra/ticketmng/specifyuser.json',
                data: {
                  userName: userName,
                  type:bonusType
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
                  $dialog.modal('hide');
                } else {
                  Global.ui.notification.show('操作失败。');
                }
              });
          });
      }else{
        Global.ui.notification.show('请输入获奖用户！');
      }
    },

    formCancelHandler: function (e) {
      var self = this;
      Global.appRouter.navigate(_('#bc/tl/mmcParams/' + self.$('.js-bc-ticketId').text()).addHrefArgs({
        _t: _.now(),
        ticketName: self.$('.js-bc-ticketName').text()
      }), {trigger: true, replace: false});
    }
  });

  module.exports = TicketMMCParamsSetView;
});
/**
 * Created by David Zhang on 2015/9/8.
 */
define(function (require, exports, module) {

  var commonRuleSetView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/species-TicketList-commonRuleSet.html'),
    time_template: require('text!betCenter/templates/species-TicketList-commonRuleSet_timeTpl.html'),
    //所有的事件绑定全部写在这！
    events: {
      'change .js-BC-saleTimesType':'changeTimesType',
      'click .js-bc-addSaleTimes-btn':'addSaleTimes',
      'click .js-bc-btn-submit': 'formSubmitHandler',
      'click .js-bc-btn-cancel': 'formCancelHandler',
      'click .js-bc-saleTime-del': 'delSaleTimes'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    getXxxXhr: function (datas) {
      return Global.sync.ajax({
        url: '/intra/planmng/plandetail.json',
        data: datas
      });
    },

    //在页面被渲染出来的时候自动调用
    onRender: function () {
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      var self = this;
      this.$btnSumbit = self.$('.js-bc-btn-submit');
      this.$formContainer = this.$('.js-bc-form');
      this.$saleTimeRange = self.$('.js-bc-saleTime-range-container');
      var params = {ticketId:this._parentView.options.ticketId};
      this.getXxxXhr(params).always(function () {
      })
        .fail(function () {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            self.$('.js-bc-ticketId').text(res.root.ticketId);
            self.$('.js-bc-ticketName').text(res.root.ticketName);
            _.map(res.root.saleCycleType, function(saleCycle){
              self.$('.js-bc-saleCycleType-checkBox'+saleCycle).attr("checked", true);
            });

            _(_.range(res.root.saleTimes.length)).each(function(value,key){
              self.$saleTimeRange.append(_.template(self.time_template)());
              var $currRange = self.$saleTimeRange.find('.js-bc-saleTimes').last();
              var $hour = $currRange.find('.js-BC-saleTimes-hour');
              var $minute = $currRange.find('.js-BC-saleTimes-minute');
              var $second = $currRange.find('.js-BC-saleTimes-second');

              var saleTime = res.root.saleTimes[value];
              var saleStartTime =  _(saleTime.saleStartTime).toTime();
              $hour.eq(0).find('option').eq(_(Number(moment(saleStartTime).format('H'))).formatMul(1)).attr("selected",'true');
              $minute.eq(0).find('option').eq(_(Number(moment(saleStartTime).format('m'))).formatMul(1)).attr("selected",'true');
              $second.eq(0).find('option').eq(_(Number(moment(saleStartTime).format('s'))).formatMul(1)).attr("selected",'true');
              //销售截至时间
              var saleEndTime =  _(saleTime.saleEndTime).toTime();
              $hour.eq(1).find('option').eq(_(Number(moment(saleEndTime).format('H'))).formatMul(1)).attr("selected",'true');
              $minute.eq(1).find('option').eq(_(Number(moment(saleEndTime).format('m'))).formatMul(1)).attr("selected",'true');
              $second.eq(1).find('option').eq(_(Number(moment(saleEndTime).format('s'))).formatMul(1)).attr("selected",'true');
              // 销售周期
              $currRange.find('.js-bc-saleCycletime').val(saleTime.saleCycletime);
              // 销售开始时间
              var openStartTime =  _(saleTime.openStartTime).toTime();
              $hour.eq(2).find('option').eq(_(Number(moment(openStartTime).format('H'))).formatMul(1)).attr("selected",'true');
              $minute.eq(2).find('option').eq(_(Number(moment(openStartTime).format('m'))).formatMul(1)).attr("selected",'true');
              $second.eq(2).find('option').eq(_(Number(moment(openStartTime).format('s'))).formatMul(1)).attr("selected",'true');
              // 销售截至时间
              var openEndTime =  _(saleTime.openEndTime).toTime();
              $hour.eq(3).find('option').eq(_(Number(moment(openEndTime).format('H'))).formatMul(1)).attr("selected",'true');
              $minute.eq(3).find('option').eq(_(Number(moment(openEndTime).format('m'))).formatMul(1)).attr("selected",'true');
              $second.eq(3).find('option').eq(_(Number(moment(openEndTime).format('s'))).formatMul(1)).attr("selected",'true');

            });

          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
    },

    // 销售时间类型切换
    changeTimesType:function(e){
      var $target = $(e.currentTarget);
      var val = $target.val();
      if(val == 1){
        var $currRange = $target.closest('.js-bc-saleTimes');
        var $hour = $currRange.find('.js-BC-saleTimes-hour');
        var $minute = $currRange.find('.js-BC-saleTimes-minute');
        var $second = $currRange.find('.js-BC-saleTimes-second');

        $hour.eq(0).find('option').eq(0).attr('selected',true);
        $hour.eq(1).find('option').eq(23).attr('selected',true);
        $minute.eq(0).find('option').eq(0).attr('selected',true);
        $minute.eq(1).find('option').eq(59).attr('selected',true);
        $second.eq(0).find('option').eq(0).attr('selected',true);
        $second.eq(1).find('option').eq(59).attr('selected',true);
      }
    },

    //　添加销售时间
    addSaleTimes:function(e){
      this.$saleTimeRange.append(_.template(this.time_template)());
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
        // 销售周期
        var chk_value =[];
        self.$('input[name="saleCycleTypeCheckbox"]:checked').each(function(){
          chk_value.push($(this).val());
        });
        _.map(_.range(chk_value.length), function(num){
          reqParams['saleCycleType['+num+']'] =  chk_value[num];
        });

        // 时间段
        var $saleTimes = self.$('.js-bc-saleTimes');
        var length = $saleTimes.length;

        _.map(_.range(length), function(num){
          var $currRange = $saleTimes.eq(num);
          var $hour = $currRange.find('.js-BC-saleTimes-hour');
          var $minute = $currRange.find('.js-BC-saleTimes-minute');
          var $second = $currRange.find('.js-BC-saleTimes-second');

          reqParams['saleTimes['+num+'].saleCycletime'] =  $currRange.find('.js-bc-saleCycletime').val();
          reqParams['saleTimes['+num+'].saleStartTime'] =  $hour.eq(0).val()+ ":"+ $minute.eq(0).val()+":"+ $second.eq(0).val();
          reqParams['saleTimes['+num+'].saleEndTime']  =   $hour.eq(1).val()+ ":"+ $minute.eq(1).val()+":"+ $second.eq(1).val();
          reqParams['saleTimes['+num+'].openStartTime'] =  $hour.eq(2).val()+ ":"+ $minute.eq(2).val()+":"+ $second.eq(2).val();
          reqParams['saleTimes['+num+'].openEndTime'] =  $hour.eq(3).val()+ ":"+ $minute.eq(3).val()+":"+ $second.eq(3).val();
        });

        Global.sync.ajax({
          url: '/intra/planmng/saveplan.json',
          data:reqParams
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
              Global.appRouter.navigate(_('#bc/tl/planRules/'+self.$('.js-bc-ticketId').text()).addHrefArgs({
                _t:_.now(),
                ticketName:self.$('.js-bc-ticketName').text()
              }), {trigger: true, replace: false});
            } else {
              Global.ui.notification.show('操作失败。');
            }
          });
      }else{
        $target.button('reset');
      }
    },

    formCancelHandler:function(e){
      var self = this;
      Global.appRouter.navigate(_('#bc/tl/planRules/'+self.$('.js-bc-ticketId').text()).addHrefArgs({
        _t:_.now(),
        ticketName:self.$('.js-bc-ticketName').text()
      }), {trigger: true, replace: false});
    },

    delSaleTimes: function(e){
      $(e.currentTarget).closest('.js-bc-saleTimes').remove();
    }
  });

  module.exports = commonRuleSetView;
});
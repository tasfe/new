/**
 * Created by David Zhang on 2015/9/8.
 */
define(function (require, exports, module) {

  var TicketParamsSetView = Base.ItemView.extend({

    //初次渲染页面时会调用的模板
    template: require('text!betCenter/templates/species-TicketList-paramsSet.html'),

    //所有的事件绑定全部写在这！
    events: {
      'click .js-bc-addVedioLine-btn':'addVedioLineHandler',
      'click .js-bc-btn-submit': 'formSubmitHandler',
      'click .js-bc-btn-cancel': 'formCancelHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    getXxxXhr: function (datas) {
      return Global.sync.ajax({
        url: '/intra/ticketmng/cfgdetail.json',
        data: datas
      });
    },

    //在页面被渲染出来的时候自动调用
    onRender: function () {
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      var self = this;
      this.$btnSumbit = self.$('.js-bc-btn-submit');
      this.$formContainer = this.$('.js-bc-form');
      self.$('.js-bc-cancelOpen').bind('click', self.switchHandler);
      self.$('.js-bc-vedioOpen').bind('click', self.switchHandler);
      var params = {ticketId:this.options.ticketId};
      self.$('.js-bc-ticketId').text(this.options.ticketId);
      self.$('.js-bc-ticketName').text(_.getUrlParam('ticketName'));
      this.getXxxXhr(params).always(function () {
      })
        .fail(function () {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            if(res.root.cancelOpen == true){
              self.$('.js-bc-cancelOpen').click();
            }
            self.$('.js-bc-cancelMinMoney').val(_(res.root.cancelMinMoney).convert2yuan());
            self.$('.js-bc-cancelTimeLimit').val(res.root.cancelTimeLimit);
            self.$('.js-bc-singleBonusLimit').val(_(res.root.singleBonusLimit).convert2yuan());
            //self.$('.js-bc-singleMultipleLimit').val(res.root.singleMultipleLimit);
            if(res.root.vedioLines.length > 0){
              var appendHtml='';
              _.map(_.range(res.root.vedioLines.length), function(num){
                appendHtml = appendHtml+
                                 '<label class="col-sm-2 control-label m-bottom-sm ">线路链接'+(num+1)+'：</label>' +
                                 '<div class="col-sm-10 m-bottom-sm">' +
                                 '  <div class="js-bc-vedioLines-container"> ' +
                                 '    <input type="text" class="form-control width-md js-bc-vedioLines " readonly value="'+res.root.vedioLines[num]+'" data-parsley-type="url" data-parsley-maxlength="1000" data-parsley-someSpecialChar  required> ' +
                                 '  </div> ' +
                                 '</div>';
              });
              self.$('.js-bc-addVedioLineTips').before(appendHtml);
            }
            if(res.root.vedioOpen == true){
              self.$('.js-bc-vedioOpen').click();
            }
            self.$('.js-bc-delayOpenLimit').val(res.root.delayOpenLimit);
            self.$('.js-bc-brokenOpenLimit').val(res.root.brokenOpenLimit);
            self.$('.js-bc-earlierOpenLimit').val(res.root.earlierOpenLimit);
          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
    },

    //  点击开关触发的handler
    switchHandler:function(e) {
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
        }else if($target.hasClass('js-bc-vedioOpen')){
          self.$('.js-bc-addVedioLine-btn').removeClass('hidden');
          self.$('.js-bc-vedioLines').removeAttr('readonly');
        }
      }else if($target.val() == 0){
        if ($target.hasClass('js-bc-cancelOpen')) {
          self.$('.js-bc-cancelMinMoney').attr('readonly',true);
          self.$('.js-bc-cancelTimeLimit').attr('readonly',true);
        }else if($target.hasClass('js-bc-vedioOpen')){
          self.$('.js-bc-addVedioLine-btn').addClass('hidden');
          self.$('.js-bc-vedioLines').attr('readonly',true);
        }
      }
    },

    //  添加视频线路触发的handler
    addVedioLineHandler:function(e){
      var self = this;
      var length = self.$('.js-bc-vedioLines').length;
      var appendHtml= '<label class="col-sm-2 control-label m-bottom-sm ">线路链接'+(length+1)+'：</label>' +
                      '<div class="col-sm-10 m-bottom-sm">' +
                      '  <div class="js-bc-vedioLines-container"> ' +
                      '    <input type="text" class="form-control width-md js-bc-vedioLines" data-parsley-type="url" data-parsley-maxlength="1000" data-parsley-someSpecialChar  required> ' +
                      '  </div> ' +
                      '</div>';
      self.$('.js-bc-addVedioLineTips').before(appendHtml);
    },

    //表单被提交时触发的handler
    formSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var clpValidate = this.$formContainer.parsley().validate();
      if (clpValidate) {
        var length = self.$('.js-bc-vedioLines').length;
        var reqParams = {};
        _.map(_.range(length), function(num){
          vedioLinesInput = self.$('.js-bc-vedioLines').eq(num);
          reqParams['vedioLines['+num+']'] = vedioLinesInput.val();
        });
        reqParams['ticketId'] = self.$('.js-bc-ticketId').text();
        reqParams['cancelOpen'] = self.$('.js-bc-cancelOpen').val();
        reqParams['cancelMinMoney'] = self.$('.js-bc-cancelMinMoney').val();
        reqParams['cancelTimeLimit'] = self.$('.js-bc-cancelTimeLimit').val();
        reqParams['singleBonusLimit'] = self.$('.js-bc-singleBonusLimit').val();
        reqParams['singleMultipleLimit'] = self.$('.js-bc-singleMultipleLimit').val();
        reqParams['vedioOpen'] = self.$('.js-bc-vedioOpen').val();
        reqParams['brokenOpenLimit'] = self.$('.js-bc-brokenOpenLimit').val();
        reqParams['delayOpenLimit'] = self.$('.js-bc-delayOpenLimit').val();
        reqParams['earlierOpenLimit'] = self.$('.js-bc-earlierOpenLimit').val();
        Global.sync.ajax({
          url: '/intra/ticketmng/savecfg.json',
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
              Global.appRouter.navigate(_('#bc/tl/params/'+self.$('.js-bc-ticketId').text()).addHrefArgs({
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
      Global.appRouter.navigate(_('#bc/tl/params/'+self.$('.js-bc-ticketId').text()).addHrefArgs({
        _t:_.now(),
        ticketName:self.$('.js-bc-ticketName').text()
      }), {trigger: true, replace: false});
    }
  });

  module.exports = TicketParamsSetView;
});
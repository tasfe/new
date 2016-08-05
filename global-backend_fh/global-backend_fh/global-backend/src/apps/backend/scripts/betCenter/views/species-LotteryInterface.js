define(function (require, exports, module) {

  var LotteryInterfaceView = Base.ItemView.extend({

    template: require('text!betCenter/templates/species-LotteryInterface.html'),

    events: {
      'click .js-bc-ticketId': 'changeTicketId',
      'click .js-bc-status-btn':'changeAdaStatus',
      'click .js-bc-delete-btn':'deleteAda',
      'click .js-bc-preview-btn':'previewAda',
      'click .js-bc-addInterface-btn':'addAda',
      'click .js-bc-btn-submit':'formSubmitHandler',
      'click .js-bc-btn-cancel':'formCancelHandler'
    },

    //在view 被 new 出来的时候自动调用，主要用来初始化options等配置文件
    initialize: function (data) {
    },

    // 获取所有彩种
    getTicketList: function (datas) {

      return Global.sync.ajax({
        url: '/intra/ticketmng/ticketlist.json',
        data: datas
      });
    },

    // 获取指定彩种接口列表
    getAdaList: function (datas) {
      return Global.sync.ajax({
        url: '/intra/adamng/adalist.json',
        data: datas
      });
    },

    // 禁用接口
    disableAda: function (datas) {
      return Global.sync.ajax({
        url: '/intra/adamng/disableada.json',
        data: datas
      });
    },

    // 启用接口
    enableAda: function (datas) {
      return Global.sync.ajax({
        url: '/intra/adamng/enableada.json',
        data: datas
      });
    },

    // 删除接口
    deleteAdaXhr: function (datas) {
      return Global.sync.ajax({
        url: '/intra/adamng/deleteada.json',
        data: datas
      });
    },

    //在页面被渲染出来的时候自动调用
    onRender: function () {
      //能够做缓存的dom对象，尽量在一开始的时候先取到，避免重复取浪费性能
      var self = this;
      this.$btnSumbit = self.$('.js-bc-btn-submit');
      this.$formContainer = self.$('.js-bc-lotteryInterface-form');
      this.getTicketList().always(function () {
      })
        .fail(function () {
          // 处理失败
        })
        .done(function (res) {
          if (res && res.result === 0) {
            _.map(_.range(res.root.series.length), function(index) {
              _.map(res.root.series[index].types, function(type){
                if(type.ticketName!='分分彩'){
                self.$('#jsBCTicketId').before(
                  "<button class='btn btn-sm btn-default js-bc-ticketId m-left-sm m-bottom-sm' id='jsBCTicketId" + type.ticketId + "'>" + type.ticketName + "</button>"

                );
                }
              });
            });

            self.$('.js-bc-ticketId').eq(0).click();
          } else {
            Global.ui.notification.show('数据异常。');
          }
        });
    },

    // 切換搜索彩種
    changeTicketId:function(e){
      var self = this;
      var $target = $(e.currentTarget);
      self.$('.js-bc-ticketId').removeClass('btn-warning');
      $target.addClass('btn-warning');
      var $targetId = $target.attr('id');
      self.$('#jsBCTicketId').val($targetId.substr(12,$targetId.length));
      var params = {ticketId:$targetId.substr(12,$targetId.length)};
      this.getAdaList(params).done(function (res) {
        if (res.result === 0) {
          self.$('.js-bc-adapter').removeClass('hidden');
          self.$('.js-bc-InterfaceDetail-container').remove();
          var appendHtml='';
          var runStatus='';
          var status='';
          _.map(_.range(res.root.length),function(index){
            runStatus =  res.root[index].runStatus == 0?'运行正常':'运行异常';
            status = res.root[index].status == 0?'启用':'禁用';
            appendHtml = appendHtml+"<div class='col-sm-12 m-bottom-sm js-bc-InterfaceDetail-container'>" +
                                    "  <div>" +
                                    "    <label class='control-label'>接口"+(index+1)+"：</label>" +
                                    "   <input type='text' class='form-control width-md js-bc-adapterId hidden'value='"+res.root[index].adapterId+"'>" +
                                    "   <span class='inline-block'><input type='text' class='form-control width-md js-bc-adapterUrl' id='jsBCAdapterUrl"+res.root[index].adapterId+"' value='"+res.root[index].adapterUrl+"'  data-parsley-type='url' data-parsley-someSpecialChar data-parsley-maxlength='1000' required ></span>" +
                                    "   <span class='inline-block'><input type='text' class='form-control js-bc-adapterName' value='"+res.root[index].adapterName+"'  data-parsley-zhMaxLength='100'  data-parsley-someSpecialChar  required></span>" +
                                    "   <input type='text' class='form-control width-sm border-dashed js-bc-runStatus' value='"+runStatus+"' disabled>" +
                                    "   <button class='btn btn-default js-bc-preview-btn' id='jsBCPreviewbtn"+res.root[index].adapterId+"'>预览</button>" +
                                    "   <button class='btn btn-default js-bc-status-btn' id='jsBCStatusbtn"+res.root[index].adapterId+"'>"+status+"</button>" +
                                    "   <button class='btn btn-default js-bc-delete-btn' id='jsBCDeletebtn"+res.root[index].adapterId+"'>删除</button>" +
                                    "  </div>" +
                                    "</div>"
          })
          self.$('.js-bc-addInterface-container').after(appendHtml);
        }else{
          Global.ui.notification.show('数据异常。');
        }
      }).fail(function(){
      });
    },

    // 启用、禁用接口
    changeAdaStatus:function(e){
      var self = this;
      var $target = $(e.currentTarget);
      $targetId = $target.attr('id');
      var params = {adapterId:$targetId.substr(13,$targetId.length)};
      if($target.text() == '禁用'){
        this.disableAda(params).done(function (res) {
          if (res.result === 0) {
            $target.text('启用');
            Global.ui.notification.show('操作成功。');
          }else{
            Global.ui.notification.show('操作失败。');
          }
        }).fail(function(){
        });
      }else if($target.text() == '启用'){
        this.enableAda(params).done(function (res) {
          if (res.result === 0) {
            $target.text('禁用');
            Global.ui.notification.show('操作成功。');
          }else{
            Global.ui.notification.show('操作失败。');
          }
        }).fail(function(){
        });
      }
    },

    // 删除接口
    deleteAda:function(e){
      var self = this;
      var $target = $(e.currentTarget);
      $targetId = $target.attr('id');
      var param = {adapterId:$targetId.substr(13,$targetId.length)};
      this.deleteAdaXhr(param).done(function (res) {
        if (res.result === 0) {
          $target.parent().parent().remove();
          Global.ui.notification.show('操作成功。');
        }else{
          Global.ui.notification.show('操作失败。');
        }
      }).fail(function(){
      });
    },

    // 预览接口
    previewAda:function(e){
      var self = this;
      var $target = $(e.currentTarget);
      $targetId = $target.attr('id');
      window.open(self.$('#jsBCAdapterUrl'+$targetId.substr(14,$targetId.length)).val());
    },

    // 增加接口
    addAda:function(e){
      var length = self.$('.js-bc-InterfaceDetail-container').length;
      var appendHtml = '';
      appendHtml = appendHtml+"<div class='col-sm-12 m-bottom-sm js-bc-InterfaceDetail-container'>" +
        "  <div>" +
        "    <label class='control-label'>接口"+(length+1)+"：</label>" +
        "   <span class='inline-block'><input type='text' class='form-control width-md js-bc-adapterUrl' placeholder='接口地址' data-parsley-type='url' data-parsley-someSpecialChar data-parsley-maxlength='1000' required></span>" +
        "   <span class='inline-block'><input type='text' class='form-control js-bc-adapterName' placeholder='接口名称' data-parsley-zhMaxLength='100'  data-parsley-someSpecialChar  required></span>" +
        "  </div>" +
        "</div>";
      self.$('.js-bc-addInterface-container').after(appendHtml);
    },

    //表单被提交时触发的handler
    formSubmitHandler: function (e) {
      var self = this;
      var $target = $(e.currentTarget);
      $target.button('loading');
      var clpValidate = this.$formContainer.parsley().validate();
      if (clpValidate) {
        var reqParams = {};
        var length = self.$('.js-bc-InterfaceDetail-container').length;
        _.map(_.range(length), function(num){
          InterfaceDetailContainer = self.$('.js-bc-InterfaceDetail-container').eq(num);
          reqParams['adapters['+num+'].adapterId'] =  InterfaceDetailContainer.find('.js-bc-adapterId').val();
          reqParams['adapters['+num+'].adapterUrl'] = InterfaceDetailContainer.find('.js-bc-adapterUrl').val();
          reqParams['adapters['+num+'].adapterName'] = InterfaceDetailContainer.find('.js-bc-adapterName').val();
        });
        reqParams['ticketId'] = self.$('#jsBCTicketId').val();
        Global.sync.ajax({
          url: '/intra/adamng/saveada.json',
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
              Global.appRouter.navigate(_('#bc/li').addHrefArgs({
                _t:_.now()
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
      Global.appRouter.navigate(_('#bc/li').addHrefArgs({
        _t:_.now()
      }), {trigger: true, replace: false});
    }

  });

  module.exports = LotteryInterfaceView;
});

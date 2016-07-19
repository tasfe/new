"use strict";

var swfUrl = require('vendor/assets/ZeroClipboard.swf');
var ZeroClipboard = require('vendor/scripts/ZeroClipboard');

ZeroClipboard.config({swfPath: swfUrl});

var OpenAccountManageView = Base.ItemView.extend({

  template: require('agencyCenter/templates/openAccountManage-manual.html'),
  startOnLoading: true,
  events: {
    'click .js-ac-submitOpenAccountInfo':'submitOpenAccountInfoHandler',
    'blur .js-ac-userName': 'checkUserExistHandler',
    'click .js-ac-ticket-link': 'ticketPriceViewHandler',
    'blur .js-ac-manual-rebate': 'inputRebateHandler'
  },
  getSubAcctXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacct.json',
      abort:false
    });
  },
  checkUserExistXhr: function(data){
    return Global.sync.ajax({
      url: '/acct/userinfo/userexist.json',
      data: data
    });
  },
  initialize: function() {
   // this.subSubAcctXhr = this.getSubAcctXhr();
  },

  onRender: function() {
    var self = this;

    this.$limit = this.$('.js-ac-quota-container');

    this.getSubAcctXhr().always(function(){
      self.loadingFinish();
    })
      .done(function(res) {
        var data = res.root.seriesList;

        if (res && res.result === 0) {
          self._getTable( _(data.ticketSeriesList).map(function(ticketSeries) {
            return {
              sericeName: ticketSeries.sericeName,
              maxBonus: _(ticketSeries.maxBonus).convert2yuan(),
              subAcctRebate: data.subRebateRange.subAcctRebate,
              maxRebate: data.subRebateRange.rebateMax,
              minRebate: data.subRebateRange.rebateMin
            };
          }));
          self._parentView.renderLimit(self.$limit,res.root.quotaList);
        }
      });


  },

  _getTable: function(tableInfo) {
    var self = this;
    this.$('.js-ac-rebate-set-container').staticGrid({
      tableClass: 'table table-bordered table-no-lr table-center',
      colModel: [
        {label: '彩种系列', name: 'sericeName', width: '30%',formatter: function(val,index,info){
          var ticket = '';
          if(val==='时时彩'){
            ticket = 'constant';
          }else if(val==='十一选五'){
            val = '11选5';
            ticket = 'elev';
          }else if(val==='低频彩'){
            ticket = 'low';
          }else if(val==='秒秒彩'){
            ticket = 'mmc';
          }else if(val==='老虎机秒秒彩'){
            ticket = 'smmc';
          }
          return '<a class="js-ac-ticket-link btn-link text-pleasant" data-ticket="'+ticket+'">'+val+'</a>';
        }},
        {label: '最高奖金', name: 'maxBonus', width: '30%',formatter: function(val,index,info){
          var superPlay = '';
          var normalPlay = '';
          if(info.sericeName==='时时彩' ){
            superPlay = '<br /><div style="height:1px; width:100%; background:#c2c2c2;margin-top:5px; padding:0 3px; margin-left:-3px;"></div><span style="padding-top:5px; display:block;">超级3000：3000</span>';
            normalPlay ='普通玩法：';
          }
          return '<span class="js-ac-openAccount-maxBonus" data-maxBonus="'+val+'" data-name="'+info.sericeName+'">'+ normalPlay +
            self.calculateMaxBonus(info.sericeName,_(info.subAcctRebate).formatDiv(10),val)+'</span>' + superPlay;
        }},
        {label: '下级返点', name: 'subAcctRebate',width:'40%', merge: true, formatter: function(val, index, info) {
          return '<input type="text" class="js-ac-manual-rebate " required value="' + _(val).formatDiv(10,{fixed:1}) + '" data-parsley-oneDecimal data-parsley-range="['+_(info.minRebate).formatDiv(10,{fixed:1})+','+_(info.maxRebate).formatDiv(10,{fixed:1})+']" > %<div class="text-center">(' +
            info.minRebate +  '～' + _(info.maxRebate>128?128:info.maxRebate).formatDiv(10,{fixed:1}) + ')</div>';
        }}
      ],
      row: tableInfo
    });
  },

  //TODO 手工开户提交
  submitOpenAccountInfoHandler: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $cardBindingForm = $('.js-ac-openAccountManual-form');
    var clpValidate = $cardBindingForm.parsley().validate();
    if (clpValidate) {
      $target.button('loading');
      var data = {
        userName: this.$('.js-ac-userName').val(),
        loginPwd: this.$('.js-ac-password').val(),
        rebate: _(this.$('.js-ac-manual-rebate').val()).formatMul(10)
      };
      Global.sync.ajax({
        url: '/acct/subaccount/savesubacct.json',
        data: data
      }).always(function () {
        $target.button('reset');
      })
        .done(function (res) {
          if (res && res.result === 0) {
            self.showCopyDailog(data);
          } else {
            Global.ui.notification.show('保存失败，'+res.msg);
          }
        });

    }
  },
  checkUserExistHandler: function(e){
    var self = this;
    var data = {
      username:$(e.currentTarget).val()
    };
    if($(e.currentTarget).val()==''){
      self.$('.js-ac-tip').removeClass('hidden').html("请输入用户名");
      return;
    }
    this.checkUserExistXhr(data).fail(function(){
    }).done(function(res){
      if(res.result===0){
        self.$('.js-ac-tip').addClass('hidden');
      }else{
        self.$('.js-ac-tip').removeClass('hidden').html(res.msg);
      }
    });

  },
  ticketPriceViewHandler: function(e){
     var $target = $(e.currentTarget);
    var ticket = $target.data('ticket');
    var rebate = Number(this.$('.js-ac-manual-rebate').val());
    if(_(rebate).isNumber()&& _(rebate).isFinite()){
      Global.appRouter.navigate('#ac/oam/pd/'+ticket+'?rebate='+rebate,{trigger: true, replace: false});
    }else{
      Global.ui.notification.show('请输入有效的返点值。');
    }
  },
  inputRebateHandler: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    var range = eval($target.data('parsley-range'));
    var rebate = Number($target.val());
    if(rebate!==''&& _(rebate).isFinite() && range.length==2){
      if(rebate<range[0]){
        $target.val(range[0]);
      }else if(rebate>range[1]){
        $target.val(range[1]);
      }
    }else{
      $target.val(range[0]);
    }
    rebate = Number($target.val());
    var $maxBonus = $target.parent().parent().parent().find('.js-ac-openAccount-maxBonus');
    _($maxBonus).each(function(item,index){
      var $item = $(item);
      var maxBonus = $item.data('maxbonus');
      var ticketName = $item.data('name');
      $item.html(self.calculateMaxBonus(ticketName,rebate,maxBonus));
    });
  },
  calculateMaxBonus: function(ticketName,rebate,maxBonus){
    var baseNum = 20;
    if(ticketName === '十一选五'){
      baseNum = 19.8;
    }
    return _(_(Number(maxBonus)).add(_(baseNum).formatMul(rebate,{fixed:4})).toFixed(4)).add(0);
  },
  showCopyDailog: function(data){
    var $dialog = Global.ui.dialog.show({
      title: '开户成功',
      size: 'modal-md',
      body: '<form><div class="p-left-lg m-bottom-lg m-top-lg">' +
      '<div class="control-group m-left-sm p-left-lg m-top-md  m-bottom-md"><label class="text-left">账号:&nbsp;&nbsp;&nbsp;&nbsp;  '+data.userName+'</label></div>'+
      '<div class="control-group m-left-sm p-left-lg m-top-md  m-bottom-md"><label class="text-left">密码:&nbsp;&nbsp;&nbsp;&nbsp;  '+data.loginPwd+'</label></div>'+
      '<div class="control-group m-left-sm p-left-lg m-top-md  m-bottom-md"><label class="text-left">返点:&nbsp;&nbsp;&nbsp;&nbsp;  '+_(data.rebate).formatDiv(10,{fixed:1})+'</label></div></div>' +
      '<div class="m-top-lg m-bottom-lg"><button type="button" class="js-ac-ocm-copy ac-ocm-copy btn btn-sun" data-dismiss="modal"><span class="sfa ac-ocm-copy-coin m-right-sm"></span>复制并关闭</button></div></form>',
      bodyClass: 'p-top-xs p-left-lg p-right-lg text-center'
    });

    var $chaseContainer = $dialog.find('.js-bc-chase-container');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
      //chaseView.destroy();
    });
    //
    $dialog.find('.js-ac-ocm-copy').textCopy({
      text: '账号：'+data.userName+
      '\n密码：'+data.loginPwd+
      '\n返点：'+_(data.rebate).formatDiv(10,{fixed:1})+
      '\n网址：'+_('/login.html').toLink(),
      notShowToolTip: true
    });

  }

});

module.exports = OpenAccountManageView;

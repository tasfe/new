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
    'blur .js-ac-manual-rebate': 'inputRebateHandler',
    'click .js-ac-manual-rebate': 'inputRebateClick'
  },

  inputRebateClick: function () {
    $('.julien-left .manualRebate ul').removeClass('hidden');
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
        $('.manualRebate ul').html('');

        var arry = [];
        arry['13'] = 1960;
        arry['12.9'] = 1958;
        arry['12.8'] = 1956;
        arry['12.7'] = 1954;
        arry['12.6'] = 1952;
        arry['12.5'] = 1950;

        _.each(res.root.quotaList, function(object){
          $('.manualRebate ul').append('<li>' + object.quotaLevel / 10 + ' <span>(' + arry[ object.quotaLevel / 10 ] + ')</span></li>');
        });

        if(res.root.quotaList != null){
           $('.manualRebate input').attr('data-parsley-range','[0.0,' + res.root.quotaList[0].quotaLevel/10 + ']');
        }
      }

      var verifyInputRebate = _(function() {
      var str= $('.js-ac-manual-rebate').val();
        self.bindTable();
      }).debounce(400);

      var verifyInputUserName = _(function() {
        var str= $('.js-ac-userName').val();
        if (str.length == 0) {
          $('.js-julien-left dl').eq(1).addClass('wrong');
          $('.js-julien-left dl').eq(1).removeClass('correct');
          $('.js-julien-left dl .messageBox span').eq(0).html('不能为空');
        }
        else{
          var myReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
          if (myReg.test(str)) {
            if(str.replace(/[\u4e00-\u9fa5]/g, '**').length >= 4 && str.replace(/[\u4e00-\u9fa5]/g, '**').length <= 16){
              $('.js-julien-left dl').eq(1).addClass('correct');
              $('.js-julien-left dl').eq(1).removeClass('wrong');
              $('.js-julien-left dl .messageBox span').eq(0).html('');
            }
            else{
              $('.js-julien-left dl').eq(1).addClass('wrong');
              $('.js-julien-left dl').eq(1).removeClass('correct');
              $('.js-julien-left dl .messageBox span').eq(0).html('字符4到6');
            }
            $('.js-julien-left dl h3').eq(0).addClass('hidden');
          } 
          else{
            $('.js-julien-left dl').eq(1).addClass('wrong');
            $('.js-julien-left dl').eq(1).removeClass('correct');
            $('.js-julien-left dl .messageBox span').eq(0).html('格式不符');
            $('.js-julien-left dl h3').eq(0).removeClass('hidden');
          }
        }
      }).debounce(400);

      var verifyInputPassword = _(function() {
        var str= $('.js-ac-password').val();
        var str2= $('.js-ac-repeatPassword').val();

        if (str.length == 0) {
          $('.js-julien-left dl').eq(2).addClass('wrong');
          $('.js-julien-left dl').eq(2).removeClass('correct');
          $('.js-julien-left dl .messageBox span').eq(1).html('不能为空');
        }
        else if (str.length < 6) {
          $('.js-julien-left dl').eq(2).addClass('wrong');
          $('.js-julien-left dl').eq(2).removeClass('correct');
          $('.js-julien-left dl .messageBox span').eq(1).html('字符小于6');

          if (str2 != '') {
            if (str != str2) {
              $('.js-julien-left dl').eq(3).addClass('wrong');
              $('.js-julien-left dl').eq(3).removeClass('correct');
              $('.js-julien-left dl .messageBox span').eq(2).html('不相同');
            }
            else{
              $('.js-julien-left dl').eq(3).addClass('correct');
              $('.js-julien-left dl').eq(3).removeClass('wrong');
              $('.js-julien-left dl .messageBox span').eq(2).html('');
            }
          }
        }
        else{
          $('.js-julien-left dl').eq(2).addClass('correct');
          $('.js-julien-left dl').eq(2).removeClass('wrong');
          $('.js-julien-left dl .messageBox span').eq(1).html('');

          if (str2 != '') {
            if (str != str2) {
              $('.js-julien-left dl').eq(3).addClass('wrong');
              $('.js-julien-left dl').eq(3).removeClass('correct');
              $('.js-julien-left dl .messageBox span').eq(2).html('不相同');
            }
            else{
              $('.js-julien-left dl').eq(3).addClass('correct');
              $('.js-julien-left dl').eq(3).removeClass('wrong');
              $('.js-julien-left dl .messageBox span').eq(2).html('');
            }
          }
        }
      }).debounce(400);

      var verifyInputRePassword = _(function() {
        var str= $('.js-ac-password').val();
        var str2= $('.js-ac-repeatPassword').val();


        if (str2 == '') {
          $('.js-julien-left dl').eq(3).removeClass('correct').removeClass('wrong');
          $('.js-julien-left dl .messageBox span').eq(2).html('');
        }
        else{
          if (str != str2) {
            $('.js-julien-left dl').eq(3).addClass('wrong');
            $('.js-julien-left dl').eq(3).removeClass('correct');
            $('.js-julien-left dl .messageBox span').eq(2).html('不相同');
          }
          else{
            $('.js-julien-left dl').eq(3).addClass('correct');
            $('.js-julien-left dl').eq(3).removeClass('wrong');
            $('.js-julien-left dl .messageBox span').eq(2).html('');
          }
        }
        
      }).debounce(400);

      $('.js-ac-manual-rebate').on('keypress', verifyInputRebate);
      $('.js-ac-userName').on('keypress', verifyInputUserName);
      $('.js-ac-password').on('keypress', verifyInputPassword);
      $('.js-ac-repeatPassword').on('keypress', verifyInputRePassword);

      $('.js-julien-left dl ul li').on('click',function () {
        $('.js-ac-manual-rebate').val($(this).text());

        self.bindTable();
      });
    });
  },

  _getTable: function(tableInfo) {
    var self = this;
    this.$('.js-ac-rebate-set-container').staticGrid({
      tableClass: 'table table-bordered table-no-lr table-center',
      colModel: [
        {label: '游戏', name: 'sericeName', width: '30%',formatter: function(val,index,info){
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
          return '<a class="js-ac-ticket-link btn-link" data-ticket="'+ticket+'">'+val+'</a>';
        }},
        {label: '玩法', name: 'maxBonus', width: '30%',formatter: function(val,index,info){
          var superPlay = '';
          var normalPlay = '';

          return '所有玩法';
        }},
        {label: '奖金', name: 'maxBonus', width: '30%',formatter: function(val,index,info){
          var superPlay = '';
          var normalPlay = '';

          return '<span class="js-ac-openAccount-maxBonus" data-maxBonus="'+val+'" data-name="'+info.sericeName+'">' +
            self.calculateMaxBonus(info.sericeName,_(info.subAcctRebate).formatDiv(10),val)+'</span>' + superPlay;
        }}
      ],
      row: tableInfo
    });
  },

  //TODO 手工开户提交
  submitOpenAccountInfoHandler: function (e) {
    var self = this;
    var $target = $(e.currentTarget);

    var iIs = 0;
    var strRebate= $('.js-ac-manual-rebate').val();

    if (strRebate == '') {
      strRebate = 0;
    }

    var strUserName= $('.js-ac-userName').val();
    if (strUserName.length == 0) {
      $('.js-julien-left dl').eq(1).addClass('wrong');
      $('.js-julien-left dl').eq(1).removeClass('correct');
      $('.js-julien-left dl .messageBox span').eq(0).html('不能为空');
      iIs = 1;
    }
    else{
      var myReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
      if (myReg.test(strUserName)) {
        if(strUserName.replace(/[\u4e00-\u9fa5]/g, '**').length >= 4 && strUserName.replace(/[\u4e00-\u9fa5]/g, '**').length <= 16){
          $('.js-julien-left dl').eq(1).addClass('correct');
          $('.js-julien-left dl').eq(1).removeClass('wrong');
          $('.js-julien-left dl .messageBox span').eq(0).html('');
        }
        else{
          iIs = 1;
        }
      } 
      else{
        iIs = 1;
      }
    }

    var strPassword= $('.js-ac-password').val();
    var strRePassword= $('.js-ac-repeatPassword').val();

    if (strPassword.length == 0) {
      $('.js-julien-left dl').eq(2).addClass('wrong');
      $('.js-julien-left dl').eq(2).removeClass('correct');
      $('.js-julien-left dl .messageBox span').eq(1).html('不能为空');
      iIs = 1;
    }
    else if (strPassword.length < 6) {
      iIs = 1;
    }
    else{
      if (strPassword != strRePassword) {
        $('.js-julien-left dl').eq(3).addClass('wrong');
        $('.js-julien-left dl').eq(3).removeClass('correct');
        $('.js-julien-left dl .messageBox span').eq(2).html('不相同');
        iIs = 1;
      }
    }

    if (iIs == 0) {
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
      })
      .fail(function () {
        Global.ui.notification.show('网络报错！');
      })
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
  inputRebateHandler: function(){
    setTimeout(function(){
      $('.js-julien-left dl ul').addClass('hidden');
    }, 200);
  },
  bindTable: function() {

    var self = this;
    var $target = $('.js-ac-manual-rebate');
    var range = eval($target.data('parsley-range'));
    var rebate = Number($target.val());

    if (rebate == '') {
      rebate = 0;
    }
    else{
      $('.js-julien-left dl ul').addClass('hidden');
    }
    
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
    var $maxBonus = $('.js-ac-openAccount-maxBonus');
    
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
      size: 'model-sucessAndCopy-julien',
      body: '<h3>恭喜您，手动开户成功！</h3>' +
      '<span>账号：'+data.userName+'</span>'+
      '<span>密码：'+data.loginPwd+'</span>'+
      '<span>返点：'+_(data.rebate).formatDiv(10,{fixed:1})+'</span>' +
      '<button type="button" class="js-ac-ocm-copy" data-dismiss="modal">复制并关闭</button>',
      bodyClass: ''
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

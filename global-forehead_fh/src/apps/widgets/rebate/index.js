"use strict";

$.widget('gl.rebate', {

  options: {
    id: '',
    namespace: 'tip',
    title: '提升返点',
    userId: 0
  },

  _create: function() {
    var self = this;
    var body = [];

    this.uuid = this.options.id || this.options.namespace + _.now();

    body.push('<div class="julien-rebate-dialog">');
    body.push('<div class="tips js-tips hidden" data-id="' + this.uuid + '"></div>');
    body.push('<div class="js-ac-rebate-set-container"></div>');
    body.push('<div class="js-ac-rebate-btn rebateBtn"></div>');
    body.push('</div>');

    

    this.$dialog = Global.ui.dialog.show({
      id: this.uuid,
      title: this.options.title,
      size: 'modal-lg-julien',
      body: body.join('')
    });
    this.$validateError = this.$dialog.find('.js-uc-cmValPayPwdNotice');
    this.$dialog.on('hidden.bs.modal', function (e) {
      $(this).remove();
      self.destroy();
    });

    this.bindTable();
  },

  bindTable: function () {
    var self = this;

    this.getSubAcctXhr().done(function(res) {
      var data = res.root.seriesList;
      if (res && res.result === 0) {
        var strTips = '';
        if (res.root.quotaList != null) {
          strTips = '温馨提示：您目前拥有';
          _.each(res.root.quotaList, function (quota) {
            strTips += quota.quotaLevel + '配额 ' + quota.quotaLimit + '个，'
          });

          $('.js-tips').html(strTips);
          $('.js-tips').removeClass('hidden');
        }

        self.getTable( _(data.ticketSeriesList).map(function(ticketSeries) {
          return {
            sericeName: ticketSeries.sericeName,
            maxBonus: _(ticketSeries.maxBonus).convert2yuan(),
            subAcctRebate: data.subRebateRange.subAcctRebate,
            maxRebate: data.subRebateRange.rebateMax,
            minRebate: data.subRebateRange.rebateMin
          };
        }));

        var strRebateInput = '可配置范围(' + data.subRebateRange.rebateMin /10 + '～' + data.subRebateRange.rebateMax / 10 + ') ';
        strRebateInput += '<input value="' + data.subRebateRange.subAcctRebate / 10 + '" class="js-ac-manual-rebate" data-parsley-range="[' + data.subRebateRange.rebateMin /10 + ',' + data.subRebateRange.rebateMax / 10 + ']" data-userid="' + self.options.userId + '" type="text">% ';
        strRebateInput += '<button type="button" class="js-ac-submitRebateInfo" data-loading-text="保存中">保存修改</button>';
        $('.js-ac-rebate-btn').html(strRebateInput);

        var verifyInputRebate = _(function() {
          var str= $('.js-ac-manual-rebate').val();
          self.bindRebateInput();
        }).debounce(600);

        $('.js-ac-manual-rebate').on('keypress', verifyInputRebate);

        $('.js-ac-submitRebateInfo').on('click',function (e) {
          var $target = $(e.currentTarget);
          $target.button('loading');

          Global.sync.ajax({
            url: '/acct/subaccount/modifySubAcctRebate.json',
            data: {
              subAcctId: $('.js-ac-manual-rebate').data('userid'),
              subAcctRebate:_($('.js-ac-manual-rebate').val()).formatMul(10)
            }
          }).always(function(){
            $target.button('reset');
          }).fail(function(){
            Global.ui.notification.show('网络报错');
          })
          .done(function(res) {
            if (res && res.result === 0) {
              Global.ui.notification.show('保存成功', {
                type: 'success'
              });

              $('#' + $('.js-tips').data('id')).modal('hide');
            } else {
              Global.ui.notification.show(res.msg);
            }
          });
        });
      }
    });
  },

  bindRebateInput: function() {
    var self = this;
    var $target = $('.js-ac-manual-rebate');
    var range = eval($target.data('parsley-range'));
    var rebate = Number($target.val());

    if (rebate == '') {
      rebate = 0;
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

  getTable: function(tableInfo) {
    var self = this;
    $('.js-ac-rebate-set-container').staticGrid({
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
          return val;
        }},
        {label: '玩法', name: 'maxBonus', width: '30%',formatter: function(val,index,info){
          var superPlay = '';
          var normalPlay = '';
          if(info.sericeName==='时时彩' ){
            superPlay = '<br /><div style="height:1px; width:100%; background:#c2c2c2;margin-top:5px; padding:0 3px; margin-left:-3px;"></div><span style="padding-top:5px; display:block;">超级3000</span>';
            normalPlay ='普通玩法';
            return '<span data-maxBonus="'+val+'" data-name="'+info.sericeName+'">'+ normalPlay +
            self.calculateMaxBonus(info.sericeName,_(info.subAcctRebate).formatDiv(10),val)+'</span>' + superPlay;
          }
          else{
            return '所有玩法';
          }
        }},
        {label: '奖金', name: 'maxBonus', width: '30%',formatter: function(val,index,info){
          var superPlay = '';
          var normalPlay = '';
          if(info.sericeName==='时时彩' ){
            superPlay = '<br /><div style="height:1px; width:100%; background:#c2c2c2;margin-top:5px; padding:0 3px; margin-left:-3px;"></div><span style="padding-top:5px; display:block;">3000</span>';
            normalPlay ='';
          }
          return '<span class="js-ac-openAccount-maxBonus" data-maxBonus="'+val+'" data-name="'+info.sericeName+'">' +
            self.calculateMaxBonus(info.sericeName,_(info.subAcctRebate).formatDiv(10),val)+'</span>' + superPlay;
        }}
      ],
      row: tableInfo
    });
  },

  calculateMaxBonus: function(ticketName,rebate,maxBonus){
    var baseNum = 20;
    if(ticketName === '十一选五'){
      baseNum = 19.8;
    }
    return _(_(Number(maxBonus)).add(_(baseNum).formatMul(rebate,{fixed:4})).toFixed(4)).add(0);
  },

  changeHrefHandler: function(e) {
    if (this.$dialog) {
      this.$dialog.modal('hide');
    }
  },

  check: function(_callback) {
    this._create();
    this._callback = _callback;
  },

  renderError: function(text) {
    this.$validateError.closest('.control-group').removeClass('hidden');
    this.$validateError.html(text);
  },

  getSubAcctXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacctrebate.json',
      data:{
        subAcctId:this.options.userId
      }
    });
  }
});

module.exports = $.gl.rebate;

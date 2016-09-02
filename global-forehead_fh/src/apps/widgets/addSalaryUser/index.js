"use strict";

$.widget('gl.addSalaryUser', {

  options: {
    id: '',
    namespace: 'tip',
    title: '签约日工资用户',
    userId: 0
  },

  _create: function() {
    var self = this;
    var body = [];
    body.push('<form class="js-ac-signed-common-form ac-signed-form form-horizontal" action="javascript:void(0);" novalidate="">');
    body.push('<div class="julien-salaryUser-dialog">');
    body.push('<div class="title js-salaryUser-title" data-id="' + this.options.userId + '"><span class="js-add-row julien-close-btn no-margin">增加日薪标准段</span><span>待签约下级</span><input type="text" class="js-userName"></div>');
    body.push('<div class="js-ac-salaryUser-container julien-salaryUser-list"></div>');
    body.push('<div class="row-btn "><button type="button" class="js-ac-submitQuota julien-button julien-button-margin" data-loading-text="保存中">保存修改</button></div>');
    body.push('<div class="row-btn"><span class="row-span"></span></span></div>');
    body.push('</div>');
    body.push('</form>');

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

    var strList = '<ul class="listTitle"><li class="widthP25">日薪日量要求</li><li>是否需要亏损</li><li>日薪标准</li></ul>';

    var strRow = '<ul><li class="widthP25">≥ <input type="text" class="js-ac-sm-sign-saleAmount ac-sm-sign-saleAmount" data-parsley-range="[0, 100000000]" data-parsley-threedecimal="" value="0" required=""> 元/日</li>';
    strRow += '<li class="widthB30"><select class="js-ac-sm-sign-select ac-sm-sign-select  m-right-sm" name="needLoss" value="0"><option value="1">是</option><option value="0" selected="">否</option></select>';
    strRow += '<div class="js-ac-sm-sign-tag1 margin-right-sm inline-block hidden">≥<input type="text" class="js-ac-sm-sign-lossLimit ac-sm-sign-lossLimit m-left-sm m-right-sm" data-parsley-range="[0, 100000000]" name="lossLimit" data-parsley-integer="" value="0" required="" data-parsley-type="integer">元</div></li>'
    strRow += '<li><input type="text" class="js-ac-sm-sign-salary ac-sm-sign-salary  m-right-sm" name="salaryAmount" value="0" required="" data-parsley-range="[0, 100000000]" data-parsley-type="integer">元<i class="js-delete-row">X</i></li></ul>';
    $('.js-ac-salaryUser-container').html(strList);

    $('.js-add-row').on('click',function () {
      $('.js-ac-salaryUser-container').append(strRow);
      $('.js-delete-row').on('click',function () {
        $(this).parent().parent().remove();
      })
      $('.js-ac-sm-sign-select').change(function () {
        $(this).next().removeClass('hidden');
      });
    })
  },

  bindTable: function () {
    var self = this;
    this.getQuotaCfg().done(function(res) {
      if (res && res.result === 0) {
        var strTitle = '';
        if (res.root.userQuota == null) {

        }
        else{
          strTitle = '<span>我的当前账号层级：<b>' + res.root.userQuota[0].rebate /10 + '</b></span>';

          if(res.root.subUserQuota.length != 0){
            strTitle += '<span>' + self.options.title + '当前账号层级：<b>' + res.root.subUserQuota[0].rebate /10 + '</b></span>';
          }
        }

        $('.js-quota-title').html(strTitle);

        var strTableTitle = '<table class="table table-bordered table-no-lr table-center no-margin julien-table-title"><colgroup><col width="22%"><col width="26%"><col width="26%"><col width="26%"></colgroup>';
        strTableTitle += '<thead><tr><th>账号层级</th><th>我的剩余配额</th><th>转移数量</th><th>' + self.options.title + '的剩余配额</th></tr></thead></table>';
      //console.log(res.root.userQuota);
      var strTableTtbody='<table class="table table-bordered table-no-lr table-center no-margin julien-table-tbody"><colgroup><col width="22%"><col width="26%"><col width="26%"><col width="26%"></colgroup>';
        var arr= new Array();

        $.each(res.root.subUserQuota,function(i,list){
          arr[list.rebate] = list.quota;
        });

        arr = arr.splice(1);

        $.each(res.root.userQuota,function(i,list){
          var strInput = '';
          var q = '/';
          if(arr[list.rebate] != undefined){
            strInput = '<input  type="text" data-size="'+ list.quota  + '" data-id="'+ list.rebate  + '" class="js-quota-rebate-01 js-quota-rebate-Inp" >';
            q = arr[list.rebate];
          }
          strTableTtbody+= '<tr><td>'+list.rebate /10+'</td><td class="js-athena-val">'+ list.quota+'<span ></span></td><td class="athena-num">' + strInput + '</td><td>' + q + '<span></span></td></tr>';
        });
        
        $('.js-ac-quota-container').html(strTableTitle+strTableTtbody);

        $('.js-quota-rebate-01').on('input',function(){
          console.log($(this).data('size'));
          //判断是不是数字
          if($(this).val()>=$(this).data('size')){
              $(this).val($(this).data('size'));
          }
          var vals=$(this).val();
          if(!isNaN(vals)==false){
              $(this).val('0');
          }

          $(this).parent().prev().children().html("-"+$(this).val());
          $(this).parent().next().children().html("+"+$(this).val());
        });

      }

      $('.js-ac-submitQuota').on('click',function(){
          if($('.js-quota-rebate-01').val()==''){
              $('.js-quota-rebate-01').addClass('athena-quota');
          }
          else{
            self.setQuota().done(function(res) {
              if (res && res.result === 0) {
                self.$dialog.modal('hide');
                Global.ui.notification.show('成功');
              } else {
                Global.ui.notification.show(res.msg);
              }
            });
          }
      })
    });

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

  getQuotaCfg: function() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getquotacfg.json',
      data:{
        userId:this.options.userId
      }
    });
  },

  setQuota: function() {

    var quotaList = [];
    for (var i = 0; i < $('.js-quota-rebate-01').length; i++){
      quotaList[i] = {
        quota: $('.js-quota-rebate-01').eq(i).val(),
        rebate: $('.js-quota-rebate-01').eq(i).data('id')
      };
    }

    //quotaList.push($('js-quota-rebate-01').val());
    //console.log(quotaList);
    return Global.sync.ajax({
      url: '/acct/subaccount/quotatransfer.json',
      tradition: true,
      data:{
        userId:this.options.userId,
        quota: quotaList
      }
    });
  }
});


module.exports = $.gl.addSalaryUser;
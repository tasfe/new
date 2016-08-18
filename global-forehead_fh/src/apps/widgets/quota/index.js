"use strict";

$.widget('gl.quota', {

  options: {
    id: '',
    namespace: 'tip',
    title: '转配额',
    userId: 0
  },

  _create: function() {
    var self = this;
    var body = [];
    body.push('<div class="julien-quota-dialog">');
    body.push('<div class="title js-quota-title" data-id="' + this.options.userId + '"></div>');
    body.push('<div class="js-ac-quota-container"></div>');
    body.push('<div class="row-btn "><button type="button" class="js-ac-submitQuota julien-button julien-button-margin" data-loading-text="保存中">保存修改</button></div>');
    body.push('<div class="row-btn"><span class="row-span"></span></span></div>');
    body.push('</div>');

    this.$dialog = Global.ui.dialog.show({
      id: this.uuid,
      title: '转给' + this.options.title + '配额',
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

        var strTableTitle = '<table class="table table-bordered table-no-lr table-center no-margin julien-table-title julien-table-tbody"><colgroup><col width="22%"><col width="26%"><col width="26%"><col width="26%"></colgroup>';
        strTableTitle += '<thead><tr><th>账号层级</th><th>我的剩余配额</th><th>转移数量</th><th>' + self.options.title + '的剩余配额</th></tr></thead></table>';
      //console.log(res.root.userQuota);
      var strTableTtbody='<table class="table table-bordered table-no-lr table-center no-margin julien-table-title julien-table-tbody"><colgroup><col width="22%"><col width="26%"><col width="26%"><col width="26%"></colgroup>';
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
       // console.log(arr);


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


module.exports = $.gl.quota;
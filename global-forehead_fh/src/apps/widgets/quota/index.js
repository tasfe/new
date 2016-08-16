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
    body.push('<div class="row-btn"><button type="button" class="js-ac-submitQuota" data-loading-text="保存中">保存修改</button></div>');
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
          strTitle = '<span>我的当前账号层级：<b>直属' + res.root.userQuota[0].rebate /10 + '</b></span>';

          if(res.root.subUserQuota.length != 0){
            strTitle += '<span>' + self.options.title + '当前账号层级：<b>直属' + res.root.subUserQuota[0].rebate /10 + '</b></span>';
          }
        }

        $('.js-quota-title').html(strTitle);

        var strTableTitle = '<table class="table table-bordered table-no-lr table-center no-margin julien-table-title"><colgroup><col width="22%"><col width="26%"><col width="26%"><col width="26%"></colgroup>';
        strTableTitle += '<thead><tr><th>账号层级</th><th>我的剩余配额</th><th>转移数量</th><th>' + self.options.title + '的剩余配额</th></tr></thead></table>';

        $('.js-ac-quota-container').html(strTableTitle);
      }
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
  }
});

module.exports = $.gl.quota;
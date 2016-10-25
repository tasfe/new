define(function (require, exports, module) {
  var ShowAgreementDetailView = require('fundCenter/views/bonus-ShowAgreementDetail');
  require('prefab/views/searchGrid');

  var operateCheckView = Base.Prefab.SearchGrid.extend({

    template: require('text!fundCenter/templates/bonus-SignUserRecord.html'),

    events: {
      'click .js-fc-su-rescind-detail': 'checkRescindDetailHandler',
      'click .js-pm-show': 'showAgreementDetailHandler'
    },

    initialize: function () {
      _(this.options).extend({
        tableClass: '',
        checkable: false,
        columns: [
          {
            name: '签约时间',
            width: '15%'
          },
          {
            name: '协议生效日期',
            width: '15%'
          },
          {
            name: '上级用户名',
            width: '15%'
          },
          {
            name: '下级用户名',
            width: '15%'
          },
          {
            name: '协议内容',
            width: '15%'
          },
          {
            name: '状态',
            width: '15%'
          }
        ],
        gridOps: {
          emptyTip: '无记录'
        },
        ajaxOps: {
          url: '/intra/dividmng/signlist.json'
        }
      });
    },

    getCheckUserListXhr: function(){
      return Global.sync.ajax({
        url: '/intra/dividmng/canceloperator.json '
      });
    },

    getRescindDetailXhr: function(data){
      return Global.sync.ajax({
        url: '/intra/dividmng/cancellog.json',
        data: data
      });
    },
    onRender: function(){
      var self = this;
      //this.getCheckUserListXhr() .fail(function(){
      //}).done(function(res){
      //  if(res.result===0){
      //    var optionData = _(res.root.userList||[]).map(function(user){
      //      return {
      //        value: user.userId,
      //        text: user.username
      //      }
      //    });
      //    self.renderSelect(optionData,self.$('.js-fc-su-operatorId'))
      //  }else{
      //    Global.ui.notification.show('操作失败。');
      //  }
      //});
      Base.Prefab.SearchGrid.prototype.onRender.apply(this, arguments);

    },
    renderSelect:function(data,$select){
      var options = [];
      _(data).each(function(item){
        var option = '<option value="'+item.value+'">'+item.text+'</option>';
        options.push(option);
      });
      $select.append(options.join(''));
    },
    renderGrid: function (gridData) {
      var rowsData = _(gridData.agreeList).map(function (dividend, index) {
        return {
          columnEls: this.formatRowData(dividend, index),
          dataAttr: dividend
        };
      }, this);

      this.grid.refreshRowData(rowsData, gridData.rowCount, {
        pageIndex: this.filterHelper.get('pageIndex'),
        initPagination: true
      });
      /*this.bindPopoverHandler(gridData.agreeList);*/

      //加上统计行
      this.grid.hideLoading();
    },
    formatRowData: function(dividend){
      var row = [];
      row.push(_(dividend.agreeDate).formatTime());
      row.push(dividend.effectDate);
      row.push(dividend.username);
      row.push( dividend.subUsername);
      row.push("<button data-agreement='"+ JSON.stringify(dividend.itemList)+ "' class='js-pm-show btn btn-link'>点击查看</button>");
      //status:0申请中，1已签约，2已拒绝，3申请解约中，4已经解约
      var status = '';
      switch(dividend.status){
        case 0: status='申请中';break;
        case 1: status='已签约';break;
        case 2: status='已拒绝';break;
        case 3: status='申请解约中';break;
        case 4: status='<a class="js-fc-su-rescind-detail btn btn-link no-padding">已解约</a>';break;
      }
      row.push(status );
      return row;
    },
    showAgreementDetailHandler: function(e){
      var self = this;
      var $target = $(e.currentTarget);
      var agreement = $target.data('agreement');
      var $dialog = Global.ui.dialog.show(
          {   size: 'modal-lg',
            title: '查看协议',
            body: '<div class="js-il-show-agreement"></div>'
          }
      );
      var $selectContainer = $dialog.find('.js-il-show-agreement');

      var showAgreementDetailView = new ShowAgreementDetailView({agreement: agreement});
      $selectContainer.html(showAgreementDetailView.render().el);

      $dialog.on('hidden.bs.modal', function (e) {
        $(this).remove();
        showAgreementDetailView.destroy();
      });
    },
    checkRescindDetailHandler: function(e){
      var self = this;
      var $target = $(e.currentTarget);
      //var agreeId = $target.closest('tr').data('agreeid');
      //this.getRescindDetailXhr({
      //  agreeId: agreeId
      //}).done(function(res){
      //  if(res.result===0){
      //    self.propupRescindDetail(res.root);
      //  }else{
      //    Global.ui.notification.show('操作失败。');
      //  }
      //});

      var cancelDate = $target.closest('tr').data('invaliddate');
      var operator = $target.closest('tr').data('operator');
      var remarks = $target.closest('tr').data('remark');

      self.propupRescindDetail({
        cancelDate:cancelDate,
        operator:operator,
        remarks:remarks
      });
    },
    propupRescindDetail: function(detail){
      //cancelDate:121313131, // 解约时间
      //  remark:"",		// 解约原因
      //  operator:""		// 操作人
      var $dialog = Global.ui.dialog.show(
        {
          title:  '查看',
          body: '<div class="js-fc-gm-Check-container margin-sm">' +
          '<div class="m-bottom-sm  margin-sm inline-block">签约失效日期：'+detail.cancelDate+
          '</div><div class="border-all margin-sm padding-sm">'+detail.remarks+'</div>'+
          '</div>',
          footer: ''
        }
      );
      $dialog.on('hidden.bs.modal', function () {
        $(this).remove();
      });
    }


  });

  module.exports = operateCheckView;
});
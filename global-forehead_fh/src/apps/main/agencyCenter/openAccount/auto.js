var OpenAccountManageView = Base.ItemView.extend({

  template: require('./auto.html'),
  startOnLoading: true,
  linkBarTpl: _(require('./auto-linkBar.html')).template(),

  events: {
    'click .js-ac-add-link': 'addLinkHandler',
    'click .js-ac-auto-btn-edit': 'editAutoHandler',
    //'blur .js-ac-auto-link-save': 'saveAutoHandler',
    //'blur .js-ac-auto-rebate': 'inputRebateHandler',
    'click .js-ac-ticket-link': 'ticketPriceViewHandler',
    'click .js-ac-oam-au-save': 'saveAutoHandler',
    'click .js-ac-btn-delLink': 'deleteLinkHandler'
  },

  createSubAcctXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subaccount/createsubacctlink.json'
    });
  },

  getSubAcctLinkXhr: function() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacctlink.json'
    });
  },
  deleteLinkXhr: function(data) {
    return Global.sync.ajax({
      url: '/acct/subaccount/delsubacctlink.json',
      data: data
    });
  },

  onRender: function() {
    var self = this;

    this.$limit = this.$('.js-ac-quota-container');
    this.$autoContainer = this.$('.js-ac-auto-container');
    this.$grid = this.$('.js-ac-auto-container');

    this.getSubAcctLinkXhr().always(function(){
      self.loadingFinish();
    })
    .done(function(res) {
      var data = res.root;
      
      if (res && res.result === 0) {
        var rows =_(data.linkList).map(function (linkInfo) {
          var rank = '/';
          if(linkInfo.subAcctRebate != 0){ rank = linkInfo.subAcctRebate / 10; }
          return{
            userLinkId: linkInfo.userLinkUrl,
            regUserNum: linkInfo.regUserNum,
            userLinkDes: linkInfo.userLinkDes || '',
            createTime: _(linkInfo.createTime).formatTime('YYYY-MM-DD HH:mm:ss'),
            rank: rank,
            accessNum: linkInfo.accessNum / 10,
            row:  _(linkInfo.ticketSeriesList).map(function (ticketSeries) {
              return {
                sericeName: ticketSeries.sericeName,
                maxBonus:_(ticketSeries.maxBonus).formatDiv(10000),
                subAcctRebate: linkInfo.subAcctRebate || 0,
                minRebate: linkInfo.minRebate,
                maxRebate: linkInfo.maxRebateBeUse,
                userLinkDes: linkInfo.userLinkDes || ''
              }
            }),
            linkId: linkInfo.userLinkId
          }
        });
        self.renderLinkTable(rows);
        self.catchLinkData=rows;
        //self._parentView.renderLimit(self.$limit, res.root.quotaList);


        $('.js-ac-btn-link-copy').on('click',function () {
          Global.ui.notification.show('复制成功',{type: 'success'});

          var url = $(this).data('url');
          $(this).textCopy({
            text: url,
            notShowToolTip: true
          });
        })
      }
    });
  },

  renderLinkTable: function(rows) {
    this.grid = this.$grid.staticGrid({
      tableClass: 'table table-bordered table-no-lr table-hover table-center',
      colModel: [
        {label: '链接地址', name: 'userLinkId', formatter: function(userLinkId, index) {
          var link = _('/register.html?linkId=' + userLinkId).toLink();
          return  '<div class="linkAddress">'+link+'</div>';
        },width: 200},
        {label: '链接生成时间', name: 'createTime',width: 120},
        {label: '返点等级', name: 'rank',width: 90},
        {label: '点击人数', name: 'accessNum',width: 90},
        {label: '已注册人数', name: 'regUserNum',width: 100},
        {label: '备注用途', name: 'userLinkDes',width: 100},
        {label: '操作', name: 'userLinkId',formatter:function(userLinkId, index) {
          var link = _('/register.html?linkId=' + userLinkId).toLink();
          return  '<a href="'+link+'" target="_blank" >预览</a><a href="javascript:void(0);" class="js-ac-btn-link-copy" data-url="'+link+'">复制</a><a href="javascript:void(0);" class="js-ac-auto-btn-edit">编辑</a><a href="javascript:void(0);" class="js-ac-btn-delLink" >删除</a>';
        },width: 200}
      ],
      height: 354,
      row: rows,
      startOnLoading: false
    }).staticGrid('instance');

    _(this.$('.js-ac-btn-link-copy')).each(function(btn,index){
      var $btn = $(btn);
      var text = $btn.closest('tr').find('a').html();
      $btn.textCopy({
        text: text,
        notShowToolTip: true
      });
    });
  },
  deleteLinkHandler: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    var $tr = $target.closest('tr');
    var linkId = $tr.data('linkId');
    $(document).confirm({
      content: '<div class="text-center">请问您是否需要删除该开户链接？</div>',
      size: 'model-delete-julien',
      agreeCallback: function () {
        self.deleteLink(linkId);
      }
    });
  },
  deleteLink: function(linkId){
    var self = this;
    this.deleteLinkXhr({linkId: linkId}).done(function(res){
      if (res.result === 0)  {
        self.render();
      }else{
        Global.ui.notification.show('链接删除失败！');
      }
    });
  },
  //新增链接
  addLinkHandler: function(e) {
    var self = this;
    var $target = $(e.currentTarget);

    $target.button('loading');

    $.when(this._parentView.subSubAcctXhr)//, this.createSubAcctXhr()
      .always(function() {
        $target.button('reset');
      })
      .done(function(infoResList) {
        var infoRes = infoResList;
        var data = infoRes.root && infoRes.root.seriesList || {
          subRebateRange: {},
          ticketSeriesList: []
        };


        if (infoRes.result === 0)  {
          self.showRebateEditDialog({
            userLinkId: '',
            regUserNum: 0,
            quotaList: infoResList.root.quotaList,
            row: _(data.ticketSeriesList).map(function(ticketSeries) {
              return {
                sericeName: ticketSeries.sericeName,
                maxBonus: _(ticketSeries.maxBonus).convert2yuan(),
                subAcctRebate: 0,
                maxRebate: data.subRebateRange.rebateMax,
                minRebate: 0,
                userLinkDes: ''
              };
            })
          },'创建链接');
        }
      });
  },

  editAutoHandler: function(e) {
    var $target = $(e.currentTarget);
    var $tr = $target.closest('tr');
    var linkId = $tr.data('userLinkId');
    var row = _(this.catchLinkData).find(function(item){
      return item.userLinkId == linkId;
    });
    this.showRebateEditDialog(row,'修改链接');
    //var $editContainer = $target.closest('.js-ac-link-bar').find('.js-ac-link-edit-container');
    //$editContainer.toggleClass('hidden');
  },

  /**
   * 编辑按钮
   * @param row
     */
  showRebateEditDialog: function(row,btnName) {

    var strTips = '';
    if (row.quotaList != null) {
      strTips = '<p>温馨提示：</p><div class="tips">您目前拥有';
      _.each(row.quotaList, function (quota) {
        strTips += quota.quotaLevel + '配额 ' + quota.quotaLimit + '个，'
      });
      strTips += '此后奖金组配额无限制，有配额限制请使用手动开户。</div>';
    }

    var self = this;
    var rebateData =  row.row;
    var $dialog = Global.ui.dialog.show({
      title: '链接开户设置',
      size: 'modal-lg',
      body: strTips +
      '<form class="js-ac-oam-au-form" >' +
      '<div class="js-ac-link-edit-div play-table"></div>' +
      '<div class="btn-center"><button type="button" class="js-ac-oam-au-save">' + btnName + '</button></div></form>',
      bodyClass: ''
    });

    $dialog.find('.js-ac-link-edit-div').staticGrid({
      tableClass: 'table table-bordered table-center',
      colModel: [
        {label: '彩种系列', name: 'sericeName', width: '23%',formatter: function(val,index,info){
          var ticket = '';
          if(val==='时时彩'){
            ticket = 'constant';
          }else if(val==='十一选五'){
            ticket = 'elev';
          }else if(val==='低频彩'){
            ticket = 'low';
          }
          return val;
          //return '<a class="js-ac-ticket-link btn-link text-pleasant" data-ticket="'+ticket+'">'+val+'</a>';
        }},
        {label: '最高奖金', name: 'maxBonus', width: '23%',formatter: function(val,index,info){
          var superPlay = '';
          var normalPlay = '';


          return '<span class="js-ac-openAccount-maxBonus" data-maxBonus="'+val+'" data-name="'+info.sericeName+'">'+ normalPlay +
            self.calculateMaxBonus(info.sericeName,_(info.subAcctRebate).formatDiv(10),val)+'</span>' + superPlay;
        }},
        {label: '下级返点设置', name: 'subAcctRebate', width: '23%', merge: true, formatter: function(val, index, info) {
          return '<input type="text" class="js-ac-auto-rebate input-sm " required value="' + _(val).formatDiv(10) + '" data-parsley-oneDecimal data-parsley-range="['+_(info.minRebate).formatDiv(10,{fixed:1})+','+_(info.maxRebate>124?124:info.maxRebate).formatDiv(10,{fixed:1})+']"> %<div class="text-center">(<span class="js-ac-openAccount-auto-minRebate">' +
              _(info.minRebate).formatDiv(10,{fixed:1}) + '</span>～' + _(info.maxRebate>124?124:info.maxRebate).formatDiv(10,{fixed:1}) + ')</div>';
        }},
        {label: '备注', name: 'subAcctRebate', width: '31%', merge: true, formatter: function(val, index, info) {
          return '<textarea rows="7" cols="20" class="js-ac-auto-remark remark" data-parsley-zhmaxlength="10" data-parsley-noSpecialChar placeholder="请输入备注" >'+row.row[0].userLinkDes+'</textarea>';
        }}
      ],
      row: rebateData
    });

    var $chaseContainer = $dialog.find('.js-bc-chase-container');

    $dialog.on('hidden.modal', function() {
      $(this).remove();
    });

    $dialog.off('click.saveInfo')
        .on('click.saveInfo', '.js-ac-oam-au-save', function (e) {
          self.saveAutoHandler(e,row,$dialog);
        });


    $dialog.off('click.editRebate')
        .on('blur.editRebate', '.js-ac-auto-rebate', function (e) {
          self.inputRebateHandler(e,$dialog);
        });

  },

  /**
   * 保存操作
   * @param e
   * @param row
   * @param $dialog
   * @returns {boolean}
     */
  saveAutoHandler: function(e,row,$dialog) {

    var self = this;
    var $target = $(e.currentTarget);
    var $remark = $dialog.find('.js-ac-auto-remark');
    var $rebate = $dialog.find('.js-ac-auto-rebate');
    var $form = $dialog.find('.js-ac-oam-au-form');
    $remark.parsley().validate();
    if(!$remark.parsley().isValid()){
      return false;
    }
    var clpValidate = $form.parsley().validate();
    if(!clpValidate){
      return false;
    }
    $target.button('loading');
    Global.sync.ajax({
      url: '/acct/subaccount/savesubacctlink.json',
      data: {
        'link[0].linkId': row.userLinkId,
        'link[0].linkUrl': row.userLinkId,
        'link[0].linkDes': $remark.val(),
        'link[0].subAcctRebate': _($rebate.val()).formatMul(10)
      }
    }).always(function(){
      $target.button('reset');
    })
      .done(function(res) {
        if (res && res.result === 0) {
          if (row.userLinkId == '') {
            Global.ui.notification.show('创建成功',{type: 'success'});
          }
          else{
            Global.ui.notification.show('修改成功',{type: 'success'});
          }
         
          $dialog.modal('hide');
          self.render();
        } else {
          Global.ui.notification.show(res.root===null?'操作失败！':res.root);
        }
      });
  },

  ticketPriceViewHandler: function(e){
    var $target = $(e.currentTarget);
    var ticket = $target.data('ticket');
    var $editContainer = $target.closest('.js-ac-link-bar');
    var rebate = Number($editContainer.find('.js-ac-auto-rebate').val());
    if(_(rebate).isNumber()&& _(rebate).isFinite()){
      Global.appRouter.navigate('#ac/oam/pd/'+ticket+'?rebate='+rebate,{trigger: true, replace: false});
    }else{
      Global.ui.notification.show('请输入有效的返点值。');
    }
  },
  bindTable: function() {

    var self = this;
    var $target = $('.js-ac-manual-rebate');
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
    var $maxBonus = $('.js-ac-openAccount-maxBonus');
    _($maxBonus).each(function(item,index){
      var $item = $(item);
      var maxBonus = $item.data('maxbonus');
      var ticketName = $item.data('name');
      $item.html(self.calculateMaxBonus(ticketName,rebate,maxBonus));
    });
  },
  inputRebateHandler: function(e){
    var self = this;
    var $target = $(e.currentTarget);
    var range = $target.data('parsleyRange');
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
    //this.saveAutoHandler(e);
  },
  calculateMaxBonus: function(ticketName,rebate,maxBonus){
    var baseNum = 20;
    if(ticketName === '十一选五'){
      baseNum = 19.8;
    }
    return _(_(Number(maxBonus)).add(_(baseNum).formatMul(rebate,{fixed:4})).toFixed(4)).add(0);
  }
});

module.exports = OpenAccountManageView;

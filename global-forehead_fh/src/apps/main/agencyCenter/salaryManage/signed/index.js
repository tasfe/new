"use strict";

var SignedView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'submit .js-ac-verify-form': 'confirmHandler',
    'click .js-ac-sm-sign-aa': 'addAgreementHandler',

    'click .js-ac-sm-sign-delete': 'delAgreementHandler',
    'change .js-ac-sm-sign-select': 'selectTypeHandler',
    'blur .js-ac-sm-sign-username': 'usernameBlurHandler',
    'click .js-ac-sm-sign-type': 'signTypeSelectHandler'
  },

  signXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/sign.json',
      data: data
    });
  },

  verifyXhr: function(data) {
    return Global.sync.ajax({
      url: '/info/dailysalary/valid.json',
      data: data
    });
  },

  serializeData: function() {
    var username = this.options.username;
    var dividConf = this.options.dividConf;

    //dividConf.formatRebateLimit = _(dividConf.rebateLimit).formatDiv(10);
    //dividConf.formatDividMax = _(dividConf.dividMax).formatDiv(100);
    //dividConf.formatDividMin = _(dividConf.dividMin).formatDiv(100);
    //
    //if (userData) {
    //  userData.formatDivid = _(userData.divid).formatDiv(100);
    //  if (dividConf.formatDividMin < userData.formatDivid) {
    //    dividConf.formatDividMin = userData.formatDivid;
    //  }
    //}
    return this.options;
  },

  onRender: function() {
    var self = this;
    this.$table = this.$('.js-ac-sm-sign-common-table');
    this.$CommonForm = this.$('.js-ac-signed-common-form');
    this.$SpecialForm = this.$('.js-ac-signed-special-form');

    this.$salaryType = this.$('.js-ac-sm-sign-type');
    this.$minSales = this.$('.js-ac-sm-sign-minSales');
    this.$minSalary = this.$('.js-ac-sm-sign-minSalary');
    this.$salesSpan = this.$('.js-ac-sm-sign-salesSpan');
    this.$salarySpan = this.$('.js-ac-sm-sign-salarySpan');
    this.$maxSalary = this.$('.js-ac-sm-sign-maxSalary');
    this.$needLoss = this.$('.js-ac-sm-sign-needLoss');


    this.$username = this.$('.js-ac-sm-sign-username');
    if(this.options.username){
      this.$username.val(this.options.username);
      this.$username.addClass('hidden');
      this.$username.removeAttr('required');
      this.$username.removeAttr('parsleyUsername');
      this.$username.removeAttr('parsleyRemote');
      this.$('.js-ac-sm-sign-username-div').addClass('hidden');
      this.$('.js-ac-sm-sign-userid').val(this.options.userId);
    }

    this.$username.typeahead({
      source: function(query,process){
        self.verifyXhr({username:query}).done(function(res){
          if(res.result===0){
            self.ValidUser = res.root;
            var users = [];
            _(res.root).each(function(item,index){
              users.push(item.userName);
            })
            return process(users);
          }
        });
      },
      items: 10,
      minlength:1,
      matcher: function (item) {
        if (item && item.toLowerCase().indexOf(this.query.trim().toLowerCase()) != -1) {
          return true;
        }
      },
      updater: function (item) {
        var salaryType = self.$salaryType.find(':checked').val();
        if(salaryType==='0'){
          setTimeout(500,self.$CommonForm.parsley());
        }else{
          setTimeout(500,self.$SpecialForm.parsley());
        }
        if(self.ValidUser){
          var user = _(self.ValidUser).find(function(userItem){
            return userItem.userName==item;
          });
          self.$('.js-ac-sm-sign-userid').val(user.userId);
        }
        return item;
      }
    });




    this.$CommonForm.parsley();
    this.$SpecialForm.parsley();

    window.ParsleyExtend.addAsyncValidator('accheckusername', function(xhr) {
      var valid = xhr.responseJSON.result === 0;
      var user ;
      if(self.ValidUser){
        user = _(self.ValidUser).find(function(userItem){
          return userItem.userName== self.$username.val();
        });
        if(user){
          self.$('.js-ac-sm-sign-userid').val(user.userId);
        }else{
          this.$element.parsley().domOptions.remoteMessage='未找到该下级用户';
        }
      }else{
        this.$element.parsley().domOptions.remoteMessage='未找到该下级用户';
      }
      //this.$element.parsley().domOptions.remoteMessage = xhr.responseJSON.msg || '';

      return user;
    }, '/info/dailysalary/valid.json');

    this.$table.staticGrid({
      tableClass: 'table table-bordered table-no-lr table-center',
      colModel: [
        {label: '日薪日量要求', name: 'saleAmount', key: true, width: '30%', formatter: function(val) {
          return '≥&nbsp;' +
            '<input type="text" class="js-ac-sm-sign-saleAmount ac-sm-sign-saleAmount  m-right-sm" ' +
            'data-parsley-range="[0, 100000000]" data-parsley-threeDecimal value="'+val+'" required>' +
            '元/日'
        }},
        {label: '是否需要亏损', name: 'needLoss', width: '40%', formatter: function(val,index,rowInfo) {
          return '<div class="ac-sm-sign-select-div"><select class="js-ac-sm-sign-select ac-sm-sign-select  m-right-sm" name="needLoss" value="'+((val===true||val==1)?'1':'0')+'">' +
            '<option value="1" '+((val===true||val==1)?'selected':'')+'>是</option>' +
            '<option value="0" '+((val===true||val==1)?'':'selected')+'>否</option></select>' +
            '<div class="js-ac-sm-sign-tag1 margin-right-sm inline-block '+((val===true||val==1)?'':'hidden')+'">≥' +
            '<input type="text" class="form-control js-ac-sm-sign-lossLimit ac-sm-sign-lossLimit m-left-sm m-right-sm " data-parsley-range="[0, 100000000]" ' +
            ' name="lossLimit" data-parsley-integer value="'+rowInfo.lossLimit+'" required>元</div><span class="js-ac-sm-sign-tag2 hidden">/</span></div>';
        }},
        {label: '日薪标准', name: 'salaryAmount', width: '30%', formatter: function(val,index,rowInfo) {
          return '<input type="text" class="form-control js-ac-sm-sign-salary ac-sm-sign-salary  m-right-sm" name="salaryAmount" ' +
            'value="'+val+'" required data-parsley-range="[0, 100000000]"  data-parsley-type="integer" />元' +
            '<div class="js-ac-sm-sign-delete ac-sm-sign-delete inline-block m-left-sm"><button>X</button></div>';
        }},
      ],
      height: 248,
      row:this.options.agreementList||[],
      startOnLoading: false
    });
    this.StaticGrid = this.$table.staticGrid('instance');


    this.$('.js-ac-sm-sign-type[value='+(this.options.salaryType=='1'?'1':'0')+']').prop('checked',true);
    this.signTypeSelectHandler();
    var minSales = this.$minSales.val(this.options.minSales || '0');
    var minSalary = this.$minSalary.val(this.options.minSalary || '0');
    var salesSpan = this.$salesSpan.val(this.options.salesSpan || '0');
    var salarySpan = this.$salarySpan.val(this.options.salarySpan || '0');
    var maxSalary = this.$maxSalary.val(this.options.maxSalary || '0');
    var needLoss = this.$needLoss.val(this.options.needLoss=='1'? '1' : '0');

  },

  usernameBlurHandler: function(e){
    var self = this;
    var item = $(e.currentTarget).val();
    if(self.ValidUser){
      var user = _(self.ValidUser).find(function(userItem){
        return userItem.userName==item;
      });
      if(user){
        self.$('.js-ac-sm-sign-userid').val(user.userId);
      }
    }
  },

  addAgreementHandler: function(e,obj) {
    this.StaticGrid.addRows([{
      saleAmount: 0,
      needLoss: false,
      lossLimit: 0,
      salaryAmount: 0
    }])
  },
  delAgreementHandler: function(e) {
     $(e.currentTarget).closest('tr').remove();;
  },

  selectTypeHandler: function(e) {
    var $target = $(e.currentTarget);
    var $tr = $target.closest('tr');
    var type = $target.val();
    var $tag1 = $tr.find('.js-ac-sm-sign-tag1');
    var $tag2 =  $tr.find('.js-ac-sm-sign-tag2');
    var $LossLimit =  $tr.find('.js-ac-sm-sign-lossLimit');

    if (type==='true'||type=='1') {
      $LossLimit.removeClass('hidden');
      $LossLimit.prop('required',true);
      $tag1.removeClass('hidden');
      $tag2.addClass('hidden');
      $LossLimit.attr({
        'data-parsley-range': '[0, 100000000]',
        'data-parsley-type': 'integer'
      });

    } else {
      $LossLimit.addClass('hidden');
      $LossLimit.prop('required',false);
      $LossLimit.val(0);
      $tag1.addClass('hidden');
      $tag2.removeClass('hidden');
    }
    //$value.parsley().validate();
  },

  //获取页面输入的配置信息
  getConfigDataFormTable: function(){

    var self = this;

    var minSales = this.$minSales.val();
    var minSalary = this.$minSalary.val();
    var salesSpan = this.$salesSpan.val();
    var salarySpan = this.$salarySpan.val();
    var maxSalary = this.$maxSalary.val();
    var needLoss = this.$needLoss.val();



    var salaryType = this.$('.js-ac-sm-sign-type:checked').val();
    if(salaryType==='0'){
      var result = this.$CommonForm.parsley().validate();
      if(!result){
        return false;
      }
    }else{
      var result = this.$SpecialForm.parsley().validate();
      if(!result){
        return false;
      }
    }

    if( this.$('.js-ac-sm-sign-common').hasClass('hidden')){
      if(maxSalary < minSalary ) {
        Global.ui.notification.show('日薪最高值不能小于日薪基础发放值！');
        return false;
      }

      if ((parseFloat(minSalary)+parseFloat(salarySpan))>maxSalary){
        Global.ui.notification.show('日薪最高值不能小于日薪发放基础值与日薪发放跨度值之和！');
        return false;
      }

    }

    var username = this.$('.js-ac-sm-sign-username').val();
    var userId = self.$('.js-ac-sm-sign-userid').val();;
    var $saleAmount = this.$('.js-ac-sm-sign-saleAmount');
    var $needLoss = this.$('.js-ac-sm-sign-select');
    var $lossLimit = this.$('.js-ac-sm-sign-lossLimit');
    var $salary = this.$('.js-ac-sm-sign-salary');
    var salaryList = [];
    _($saleAmount).each(function(item,index){
      salaryList.push({
        saleAmount: $(item).val(),
        needLoss: $needLoss.eq(index).val(),
        lossLimit: $lossLimit.eq(index).val(),
        salaryAmount: $salary.eq(index).val()
      });
    });



    if( _(salaryList).size()===0 && salaryType==='0' ){
      return false;
    }else{
      return {
        username: username,
        userId: userId,
        item: salaryList,
        salaryType: salaryType,
        minSales: minSales,
        minSalary: minSalary,
        salesSpan: salesSpan,
        salarySpan: salarySpan,
        maxSalary: maxSalary,
        needLoss: needLoss
      }
    }


  },
  signTypeSelectHandler: function(e){
    this.$CommonContainer = this.$('.js-ac-sm-sign-common');
    this.$SpecialContainer = this.$('.js-ac-sm-sign-special');
    var type = this.$('.js-ac-sm-sign-type:checked').val();
    if(type==='0'){
      this.$CommonContainer.removeClass('hidden');
      this.$SpecialContainer.addClass('hidden');
    }else{
      this.$SpecialContainer.removeClass('hidden');
      this.$CommonContainer.addClass('hidden');
    }
  }

});

module.exports = SignedView;

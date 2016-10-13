"use strict";

var SignedView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'submit .js-ac-verify-form': 'confirmHandler',
    'click .js-ac-sm-sign-aa': 'addAgreementHandler',

    'click .js-ac-sm-sign-delete': 'delAgreementHandler',
    'change .js-ac-sm-sign-select': 'selectTypeHandler',
    'blur .js-ac-sm-sign-username': 'usernameBlurHandler'
  },

  signXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/sign.json',
      data: data
    });
  },

  verifyXhr: function(data) {
    return Global.sync.ajax({
      url: '/fund/divid/valid.json',
      data: data
    });
  },

  onRender: function() {
    var self = this;
    this.$table = this.$('.js-ac-sm-sign-table');
    this.$form = this.$('.js-ac-signed-form');
    var dividMax = _(this.options.dividConf.dividMax).formatDiv(100);
    var dividMin = _(this.options.dividConf.dividMin).formatDiv(100);
    var rebateLimit = _(this.options.dividConf.rebateLimit).formatDiv(10);

    this.$username = this.$('.js-ac-sm-sign-username');
    if(this.options.username){
      this.$username.val(this.options.username);
      this.$username.addClass('hidden');
      this.$username.removeAttr('required');
      this.$username.removeAttr('parsleyUsername');
      this.$username.removeAttr('parsleyRemote');
      this.$('.js-ac-sm-sign-username-div').addClass('hidden');
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
      items: 5,
      minlength:1,
      matcher: function (item) {
        if (item && item.toLowerCase().indexOf(this.query.trim().toLowerCase()) != -1) {
          return true;
        }
      },
      updater: function (item) {
        setTimeout(500,self.$form.parsley());
        if(self.ValidUser){
          var user = _(self.ValidUser).find(function(userItem){
            return userItem.userName == item ;
          });
          self.$('.js-ac-sm-sign-userid').val(user.userId);
        }
        return item;
      }
    });


    this.$form.parsley();

    window.ParsleyExtend.addAsyncValidator('accheckusername', function(xhr) {
      var valid = xhr.responseJSON.result === 0;
      var user;
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
    }, '/fund/divid/valid.json');

    this.$table.staticGrid({
      tableClass: 'table table-bordered table-no-lr table-center',
      colModel: [
        {label: '分红要求1：日量标准', name: 'betTotal', key: true, width: '50%', formatter: function(val) {
          return '≥&nbsp;' +
            '<input type="text" class="js-ac-sm-sign-saleAmount ac-sm-sign-saleAmount  m-right-sm" ' +
            'data-parsley-range="[0, 100000000]" data-parsley-threeDecimal value="'+val+'" required>' +
            '元/日'
        }},

        {label: '分红比例', name: 'divid', width: '50%', formatter: function(val,index,rowInfo) {
          return '<input type="text" class="form-control js-ac-sm-sign-salary ac-sm-sign-salary  m-right-sm" name="salaryAmount" ' +
            'value="'+val+'" required data-parsley-range="['+dividMin+', '+dividMax+']"  data-parsley-oneDecimal />%' +
            '<div class="js-ac-sm-sign-delete ac-sm-sign-delete inline-block m-left-sm"><button>X</button></div>';
        }},
      ],
      height: 248,
      row:this.options.agreementList||[],
      startOnLoading: false
    });
    this.StaticGrid = this.$table.staticGrid('instance');

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
      betTotal: 0,
      divid: 0
    }])
  },
  delAgreementHandler: function(e) {
     $(e.currentTarget).closest('tr').remove();;
  },


  //获取页面输入的配置信息
  getConfigDataFormTable: function(){
    var result = this.$form.parsley().validate();
    if(!result){
      return false;
    }
    var username = this.$('.js-ac-sm-sign-username').val();
    var $saleAmount = this.$('.js-ac-sm-sign-saleAmount');
    var $salary = this.$('.js-ac-sm-sign-salary');
    var dividendList = [];
    _($saleAmount).each(function(item,index){
      dividendList.push({
        betTotal: $(item).val(),
        divid: $salary.eq(index).val()
      });
    });
    if(_(dividendList).size()===0){
      return false;
    }else{
      return {
        username: username,
        itemList: dividendList
      }
    }

  }

});

module.exports = SignedView;

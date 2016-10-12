"use strict";

var SecurityQuestionView = Base.ItemView.extend({

  template: '',

  //构造添加密保问题页面
  addSQTpl: _.template(require('./securityQuestion-add.html')),
  //构造修改密保问题页面
  updateSQTpl: _.template(require('./securityQuestion-update.html')),

  className: 'as-securityQuestion-view',

  startOnLoading: true,

  events: {
    //1 添加密保问题
    'click .js-as-inputSecurityQuestion-submit': 'inputSecurityQuestionHandler',//输入密保问题(与修改页面共用)
    'click .js-as-confirmSecurityQuestion-submit': 'confirmSecurityQuestionHandler',//确认密保问题（与修改页面共用）
    'click .js-as-SecurityQuestion-return': 'securityQuestionGoStepHandler',//返回按钮（修改页面共用）
    'change .js-as-questionSelect': 'questionSelectChangeHandler',//控制三个下拉框的值不能重复选择
    'change .js-as-question': 'userQuestionSelectChangeHandler',//控制三个下拉框的值不能重复选择

    //2 修改密保问题
    'click .js-as-answerQuestion-submit': 'verifySecurityQuestionHandler'//验证密保问题

  },

  initialize: function() {
  },

  onRender: function() {
    var self = this;
    //获取展示不同找回密码方式页面的区域
    var set;
    //1 根据用户的密保问题设置状态，选择显示不同的页面
    Global.sync.ajax({
      url: '/acct/usersecurity/getsecurity.json'
    })
      .always(function() {
        self.loadingFinish();
      })
      .done(function(res) {
        if (res && res.result === 0) {
          //0表示密保问题不存在
          set = 0;
        } else if (res && res.result === 1) {
          //1表示密保问题存在
          set = 1;
        }

        if (set === 0) {
          //1未设置密保问题
          //1.1展示添加密保问题页面
          self.$el.html(self.addSQTpl());
          self.$addSecurityQuestionContainer = self.$('.js-as-addSecurityQuestion');
          //1.2初始化该页面的整体框架
          self._initSteps(self.$addSecurityQuestionContainer, function (event, currentIndex, newIndex) {
            return newIndex !== 3;
          });
          //1.3 初始化设置密保问题页面
          self._initAddSQPage1('add');
        } else if (set === 1) {
          //2设置了密保问题
          self.$el.html(self.updateSQTpl());
          self.$updateSecurityQuestionContainer = self.$('.js-as-updateSecurityQuestion');
          //2.2初始化该页面的整体框架
          self._initSteps(self.$updateSecurityQuestionContainer, function (event, currentIndex, newIndex) {
            return newIndex !== 4;
          });
          //2.3 初始化修改密保问题页面
          self._initUpdateSQPage1();
        } else {
          //3密保问题设置情况获取失败
          self.$el.html("<span>密保问题管理页面初始化失败</span>");
        }
      });

  },

  //PubFun 初始化指定分步操作模型
  _initSteps: function ($Container, changingFunc) {
    $Container.steps({
      stepLength: 600,
      headerTag: 'h3',
      bodyTag: 'form',
      forceMoveForward: false,//允许返回
      enablePagination: false,
      transitionEffect: "slideLeft",
      onStepChanging: changingFunc
    });
  },

  //下拉框选择的事件,用于控制不会重复选择
  questionSelectChangeHandler: function (e) {
    var $target = $(e.currentTarget);
    var $option = $target.find('option:selected');

    var selectedValue = $option.siblings('.selected').removeClass('selected').val();
    var selectingValue = $target.val();
    var $select = this.$('.js-as-questionSelect');

    $select.not($target).find('option[value=' + selectedValue + ']').removeClass('hidden');
    $select.not($target).find('option[value=' + selectingValue + ']').addClass('hidden');

    $option.addClass('selected');
  },
  //下拉框选择的事件,用于控制不会重复选择
  userQuestionSelectChangeHandler: function (e) {
    var $target = $(e.currentTarget);
    var $option = $target.find('option:selected');

    var selectedValue = $option.siblings('.selected').removeClass('selected').val();
    var selectingValue = $target.val();
    var $select = this.$('.js-as-question');

    $select.not($target).find('option[value=' + selectedValue + ']').removeClass('hidden');
    $select.not($target).find('option[value=' + selectingValue + ']').addClass('hidden');

    $option.addClass('selected');
  },

  // 1.3初始化 设置密保问题页面 1.3.1初始化 添加密保问题
  _initAddSQPage1: function (type) {
    var self = this;

    Global.sync.ajax({
      url: '/acct/usersecurity/getqesforpaypwd.json',
      data: {}
    })
      .always(function () {
        //恢复确认按钮的状态
        //$target.button('reset');
      })
      .done(function (res) {
        if (res && res.result === 0) {
          //成功后,将问题列表加载在下拉框中
          //res.options = [1,2,3,4,5];
          self.$('.js-as-questionSelect').append(_(res.root).map(function (option) {
            return '<option value="' + option.qesId + '">' + option.question + '</option>';
          }).join(''));

          //进入下一个页面
          if (type === 'update') {
            self.$('.js-as-stepContainer').steps('next');
          }

        }
      });
  },

  //TODO录入的密保问题完成 1.3.2初始化 确认密保问题页面
  inputSecurityQuestionHandler: function (e) {
    var $target = $(e.currentTarget);
    var $currContainer = this.$('.js-as-inputSQForm');
    var clpValidate = $currContainer.parsley().validate();

    if (clpValidate) {
      //设置按钮为处理中状态
      //$target.button('loading');
      //复制上一个页面中的元素节点的text到本页面中
      var $selectedOptions = this.$('.js-as-questionSelect option:selected');
      var $answers = this.$('.js-as-answer');
      var $showQuestions = this.$('.js-as-showQuestion');
      var $showAnswers = this.$('.js-as-showAnswer');
      _.each($selectedOptions, function (item, index) {
        $showQuestions.eq(index).html($(item).html());
        $showAnswers.eq(index).html($answers.eq(index).val());
      });
      var $currentContainer = $target.closest('.js-as-stepContainer');//找到最近的该class节点
      $currentContainer.steps('next');
    }
  },

  //TODO 确认提交密保问题 1.3.3初始化 成功页面
  confirmSecurityQuestionHandler: function (e) {
    var $target = $(e.currentTarget);
      //设置按钮为处理中状态
    $target.button('loading');
    Global.sync.ajax({
      url: '/acct/usersecurity/resetusersecurity.json',
      data: {
        'secrityList[0].securityId': $(this.$('.js-as-questionSelect').find("option:selected")[0]).val(),
        'secrityList[0].securityQes': $(this.$('.js-as-questionSelect').find("option:selected")[0]).text(),
        'secrityList[0].securityAsw': $(this.$('.js-as-answer')[0]).val(),
        'secrityList[1].securityId': $(this.$('.js-as-questionSelect').find("option:selected")[1]).val(),
        'secrityList[1].securityQes': $(this.$('.js-as-questionSelect').find("option:selected")[1]).text(),
        'secrityList[1].securityAsw': $(this.$('.js-as-answer')[1]).val(),
        'secrityList[2].securityId': $(this.$('.js-as-questionSelect').find("option:selected")[2]).val(),
        'secrityList[2].securityQes': $(this.$('.js-as-questionSelect').find("option:selected")[2]).text(),
        'secrityList[2].securityAsw': $(this.$('.js-as-answer')[2]).val(),
        'securityToken': this.security_queToken
      }
    })
    .always(function () {
      //恢复确认按钮的状态
      $target.button('reset');
    })
    .done(function (res) {
      //成功后
      if (res && res.result === 0) {
        Global.ui.notification.show('密保问题保存成功', {
          type: 'success',
          event: function() {
            Global.router.goTo('#as/sq');
          },
          btnContent: '确定'
        });
        //var $currentContainer = $target.closest('.js-as-stepContainer');//找到最近的该class节点
        //$currentContainer.steps('next');
      } else {
        Global.ui.notification.show('设置密保问题请求失败' + res.msg);
      }
    });
   //  }
  },

  //TODO 2.3初始化修改密保问题页面 2.3.1初始化 验证密保问题
  _initUpdateSQPage1: function () {
    var self = this;
    var $currContainer = this.$('.js-as-verifySQForm');
    //设置按钮为处理中状态
    //$target.button('loading');
    Global.sync.ajax({
      url: '/acct/usersecurity/getuserecurityqes.json',

      data: {}
    })
      .always(function () {
        //恢复确认按钮的状态
        //$target.button('reset');
      })
      .done(function (res) {
        //成功后
        if (res && res.result === 0) {
          //todo 添加已选择的密保问题到页面中
          self.$('.js-as-question').append(_(res.root).map(function (option) {
            return '<option value="' + option.userSecurityId + '">' + option.userSecurityQuestion + '</option>';
          }).join(''));
        }

      });

  },

  //TODO 验证密保问题 2.3.2初始化 输入新密保问题
  verifySecurityQuestionHandler: function (e) {
    var self = this;
    var $target = $(e.currentTarget);
    var $currContainer = this.$('.js-as-verifySQForm');
    var clpValidate = $currContainer.parsley().validate();
    if (clpValidate) {
      //设置按钮为处理中状态
      $target.button('loading');
      Global.sync.ajax({
        url: '/acct/usersecurity/verqesforpaypwd.json',
        data: {
          //TODO 参数
          'secrityList[0].securityId': this.$('#jsASQuestion1').find("option:selected").val(),
          'secrityList[0].securityQes': this.$('#jsASQuestion1').find("option:selected").text(),
          'secrityList[0].securityAsw': this.$('#jsASAsw1').val(),
          'secrityList[1].securityId': this.$('#jsASQuestion2').find("option:selected").val(),
          'secrityList[1].securityQes': this.$('#jsASQuestion2').find("option:selected").text(),
          'secrityList[1].securityAsw': this.$('#jsASAsw2').val(),
          'secrityList[2].securityId': this.$('#jsASQuestion3').find("option:selected").val(),
          'secrityList[2].securityQes': this.$('#jsASQuestion3').find("option:selected").text(),
          'secrityList[2].securityAsw': this.$('#jsASAsw3').val()
        }
      })
        .always(function () {
          //恢复确认按钮的状态
          $target.button('reset');
        })
        .done(function (res) {
          //成功后
          if (res && res.result === 0) {
            self._initAddSQPage1('update');
            self.security_queToken = res.root;
          }else{
            if(res.msg==='fail')
              Global.ui.notification.show('提交密保答案错误');
            else
              Global.ui.notification.show(res.msg);
          }
        });
    }
  },

  //pubFun 返回按钮事件
  securityQuestionGoStepHandler: function (e) {
    var $target = $(e.currentTarget);
    var type = $target.data('type');//需要返回的步骤记录在此
    var $currentContainer = $target.closest('.js-as-stepContainer');//找到最近的该class节点

    $currentContainer.steps('goTo', type);
  }
});

module.exports = SecurityQuestionView;

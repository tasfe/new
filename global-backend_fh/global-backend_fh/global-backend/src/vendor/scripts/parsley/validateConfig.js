window.ParsleyValidator.addValidator('zhMaxLength', function (value, maxLength) {
  return value.replace(/[\u4e00-\u9fa5]/g, '**').length <= (maxLength * 2);
}, 32)
  .addMessage('zh_cn', 'zhMaxLength', '不能超过%s个汉字');

window.ParsleyValidator.addValidator('noSpecialChar', function (value) {
  var myReg = /[~`\-\_^@\/\'\\\"#$%&\*\?\(\),\+;\[\]\{\}\|\.:：<>!！￥？（），。、—]/;
  return !myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'noSpecialChar', '您输入的值不可包含特殊字符');

window.ParsleyValidator.addValidator('notEqualTo', function (value, selector) {
  return value !== $(selector).val();
}, 32).addMessage('zh_cn', 'notEqualTo', '两个值不能一致');

window.ParsleyValidator.addValidator('QQ', function (value) {
  var myReg = /[1-9][0-9]{4,15}/;
  return myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'QQ', 'QQ格式不正确');

window.ParsleyValidator.addValidator('naturalNum', function (value) {
  var myReg = /^(0|[1-9][0-9]*)$/;
  return myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'naturalNum', '值必须为自然数');

window.ParsleyValidator.addValidator('positiveInt', function (value) {
  var myReg = /^[1-9][0-9]*$/;//正整数
  return myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'positiveInt', '值必须为正整数');

window.ParsleyValidator.addValidator('fourDecimal', function (value) {
      var myReg = /^(0|[1-9][0-9]*)(.\d{1,4})?$/;//小数点后四位
      return myReg.test(value);
    }, 32)
    .addMessage('zh_cn', 'fourDecimal', '值最多能精确到小数点后四位');

window.ParsleyValidator.addValidator('threeDecimal', function (value) {
      var myReg = /^(0|[1-9][0-9]*)(.\d{1,3})?$/;//小数点后三位
      return myReg.test(value);
    }, 32)
    .addMessage('zh_cn', 'threeDecimal', '值最多能精确到小数点后三位');

window.ParsleyValidator.addValidator('twoDecimal', function (value) {
  var myReg = /^(0|[1-9][0-9]*)(.\d{1,2})?$/;//小数点后两  位
  return myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'twoDecimal', '值最多能精确到小数点后两位');

window.ParsleyValidator.addValidator('oneDecimal', function (value) {
  var myReg = /^(0|[1-9][0-9]*)(.\d{1})?$/;//小数点后两  位
  return myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'oneDecimal', '值最多能精确到小数点后一位');

window.ParsleyValidator.addValidator('num', function (value) {
  var myReg = /^\d+$/;
  return myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'num', '只能输入数字');

window.ParsleyValidator.addValidator('numAndMidLine', function (value) {
  var myReg = /^[\d\-]+$/;
  return myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'numAndMidLine', '只能输入数字和-');


window.ParsleyValidator.addValidator('emailAndBankNum', function (value) {
  var myReg = /^(\d{13,19}|\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)$/;
  //var myReg = "^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$";
  return myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'emailAndBankNum', '只能输入email或13至19位数字');

window.ParsleyValidator.addValidator('zhAndLetterMaxLen', function (value,maxLength) {
  var myReg = /^[A-Za-z\u4E00-\u9FA5]+$/;
  if (myReg.test(value)) {
    return value.replace(/[\u4e00-\u9fa5]/g, '**').length <= (maxLength * 2);
  } else {
    return false;
  }
}, 32)
  .addMessage('zh_cn', 'zhAndLetterMaxLen', '只能输入中文和字母，不能超过%s个中文');

window.ParsleyValidator.addValidator('zhAndLetNumMaxLen', function (value,maxLength) {
  var myReg = /^[A-Za-z0-9\u4E00-\u9FA5]+$/;
  if (myReg.test(value)) {
    return value.replace(/[\u4e00-\u9fa5]/g, '**').length <= (maxLength * 2);
  } else {
    return false;
  }
}, 32)
  .addMessage('zh_cn', 'zhAndLetNumMaxLen', '只能输入中文和字母和数字，不能超过%s个字');

window.ParsleyValidator.addValidator('textArea', function (value,maxLength) {
  var myReg = /^[A-Za-z0-9\u4E00-\u9FA5（）《》—：、；，。？！“”￥]+$/;
  if (myReg.test(value)) {
    return value.replace(/[\u4e00-\u9fa5（）《》—：、；，。？！“”￥]/g, '**').length <= (maxLength * 2);
  } else {
    return false;
  }
}, 32)
  .addMessage('zh_cn', 'textArea', '只能输入中文和字母和数字以及部分符号，不能超过%s个字节');

window.ParsleyValidator.addValidator('ip', function (value) {
  var re =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return re.test(value);
}, 32)
  .addMessage('zh_cn', 'ip', 'ip地址格式错误（正确格式：255.255.255.255）');

window.ParsleyValidator.addValidator('someSpecialChar', function (value) {
  var myReg = /[\$<>\\]/;
  return !myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'someSpecialChar', '您输入的值不可包含这些特殊字符：$<>\\');

window.ParsleyValidator.addValidator('username', function (value) {
  var myReg = /^[A-Za-z][A-Za-z0-9]{3,15}$/;
  return myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'username', '仅支持4-16位字母和数字，不能以数字开头');


window.ParsleyValidator.addValidator('numAndComma', function (value) {
  var myReg = /^([\d]{1,2},){2,9}[\d]{1,2}$/;
  return myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'numAndComma', '只能输入逗号间隔的数字');

window.ParsleyValidator.addValidator('numAndCommaAndNoRep', function (value) {
      var myReg1 = /^([\d]{1,2},){2,9}[\d]{1,2}$/;
      var myReg2 = /^(.*01.*01.*)|(.*02.*02.*)|(.*03.*03.*)|(.*04.*04.*)|(.*05.*05.*)|(.*06.*06.*)|(.*07.*07.*)|(.*08.*08.*)|(.*09.*09.*)|(.*10.*10.*)|(.*11.*11.*)$/;
      return myReg1.test(value) && !myReg2.test(value);
    }, 32)
    .addMessage('zh_cn', 'numAndCommaAndNoRep', '只能输入逗号间隔的数字');

window.ParsleyValidator.addValidator('usernameList', function (value) {
  var myReg = /^([A-Za-z][A-Za-z0-9]{3,15})(,[A-Za-z][A-Za-z0-9]{3,15}){0,199}$/;
  return myReg.test(value);
}, 32)
  .addMessage('zh_cn', 'usernameList', '仅支持用逗号连接的用户名，用户名支持4-16位字母和数字，不能以数字开头');
import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Button from 'components/Button'

@connect(
  state => ({user: state.auth.user}),
  {actions}
)
class Update extends Page {
  constructor (props) {
    super(props);
    
  }

  componentDidMount () {
    this.getUserSQs();
  }

  render () {
    return (
       <div>
        <div className="resetpwd-title-bar padding-h-sm">
          <div className="resetpwd-title reset-tt1 ">1.验证安全问题 </div>
          <div className="resetpwd-title reset-tt2 hidden">2.输入新安全问题 </div>
          <div className="resetpwd-title reset-tt3 hidden">3.确认安全问题</div>
          <div className="resetpwd-title reset-tt4 hidden">4.设置成功</div>
        </div>
        {
          <form className="">
            <div className="question-panel panel1 nobg">
              <div className="panelcon">
                <div className="step2 usepsdproqes ">
                  <div className="preoqescon">
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">问题一：</div>
                        <select className="ui-input border-radius getqes_sel" onChange={::this.onQuestionChange} id="_firstQesOld" onBlur={::this.validateInput} ></select>
                      </div>
                    </div>
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">答案：</div>
                        <input ref="userName" className="ui-input border-radius" type="text" name="username"  id="_firstAnswerOld" onBlur={::this.validateInput} />
                      </div>
                    </div>
                  </div>
                  <div className="preoqescon">
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">问题二：</div>
                        <select className="ui-input border-radius getqes_sel" onChange={::this.onQuestionChange} id="_secondQesOld" onBlur={::this.validateInput} ></select>
                      </div>
                    </div>
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">答案：</div>
                        <input ref="userName" className="ui-input border-radius" type="text" name="username"  id="_secondAnswerOld" onBlur={::this.validateInput} />
                      </div>
                    </div>
                  </div>
                  <div className="preoqescon">
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">问题三：</div>
                        <select className="ui-input border-radius getqes_sel" onChange={::this.onQuestionChange} id="_thirdQesOld" onBlur={::this.validateInput} ></select>
                      </div>
                    </div>
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">答案：</div>
                        <input ref="userName" className="ui-input border-radius" type="text" name="username"  id="_thirdAnswerOld" onBlur={::this.validateInput} />
                      </div>
                    </div>
                  </div>
                  <div className="error-message-container"></div>
                </div>
                
              </div>
              <div className="btn-row">
                <Button
                  config={{
                  text: '下一步',
                  className: 'btn-red waves-light btn-middle'
                }} onClick={::this.verifySecurityQuestion} />
                <Button config={{
                  text: '重置',
                  className: 'btn-flat waves-light btn-middle'
                }} type="reset" />
              </div>
              
            </div>
            <div className="question-panel panel2 nobg hidden">
              <div className="panelcon">
                <div className="step2 usepsdproqes ">
                  <div className="preoqescon">
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">问题一：</div>
                        <select className="ui-input border-radius getqes_sel" onChange={::this.onQuestionChange} id="_firstQesStep1" onBlur={::this.validateInput}  ></select>
                      </div>
                    </div>
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">答案：</div>
                        <input ref="userName" className="ui-input border-radius" type="text" name="username"  id="_firstAnswerStep1" onBlur={::this.validateInput}  />
                      </div>
                      
                    </div>
                  </div>
                  <div className="preoqescon">
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">问题二：</div>
                        <select className="ui-input border-radius getqes_sel" onChange={::this.onQuestionChange} id="_secondQesStep1" onBlur={::this.validateInput}  ></select>
                      </div>
                    </div>
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">答案：</div>
                        <input ref="userName" className="ui-input border-radius" type="text" name="username"  id="_secondAnswerStep1" onBlur={::this.validateInput}  />
                      </div>
                    </div>
                  </div>
                  <div className="preoqescon">
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">问题三：</div>
                        <select className="ui-input border-radius getqes_sel" onChange={::this.onQuestionChange} id="_thirdQesStep1" onBlur={::this.validateInput}  ></select>
                      </div>
                    </div>
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">答案：</div>
                        <input ref="userName" className="ui-input border-radius" type="text" name="username"  id="_thirdAnswerStep1" onBlur={::this.validateInput}  />
                      </div>
                    </div>
                  </div>
                  <div className="error-message-container"></div>
                </div>
                
              </div>
              <div className="btn-row">
                <Button
                  config={{
                  text: '下一步',
                  className: 'btn-red waves-light btn-middle'
                }} onClick={::this.verifyQustionsStep1} />
                <Button config={{
                  text: '重置',
                  className: 'btn-flat waves-light btn-middle'
                }} type="reset" />
              </div>
            </div>
            <div className="question-panel panel3 nobg hidden">
              <div className="panelcon">
                <div className="step2 usepsdproqes ">
                  <div className="preoqescon">
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">问题一：</div>
                        <input className="ui-input border-radius" id="_firstQes" readOnly />
                      </div>
                    </div>
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">答案：</div>
                        <input ref="userName" className="ui-input border-radius" type="text" name="username"  id="_firstAnswer" readOnly /> 
                      </div>
                      
                    </div>
                  </div>
                  <div className="preoqescon">
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">问题二：</div>
                        <input className="ui-input border-radius" id="_secondQes" readOnly />
                      </div>
                    </div>
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">答案：</div>
                        <input ref="userName" className="ui-input border-radius" type="text" name="username"  id="_secondAnswer" readOnly />
                      </div>
                    </div>
                  </div>
                  <div className="preoqescon">
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">问题三：</div>
                        <input className="ui-input border-radius" id="_thirdQes" readOnly />
                      </div>
                    </div>
                    <div className="row-outer">
                      <div className="row">
                        <div className="step2-q-num">答案：</div>
                        <input ref="userName" className="ui-input border-radius" type="text" name="username"  id="_thirdAnswer" readOnly />
                      </div>
                    </div>
                  </div>
                  <div className="error-message-container"></div>
                </div>
                
              </div>
              <div className="btn-row">
                <Button
                  config={{
                  text: '下一步',
                  className: 'btn-red waves-light btn-middle'
                }} onClick={::this.verifyQustions} />
                <Button config={{
                  text: '返回',
                  className: 'btn-flat waves-light btn-middle'
                }} onClick={::this.goStep2} />
              </div>
            </div>
            <div className="question-panel panel4 nobg hidden">
              <p className="setSuc">恭喜你！设置成功！</p>
              <div className="btn-row">
                <Button
                  config={{
                  text: '返回首页',
                  className: 'btn-red waves-light btn-large'
                }} onClick={::this.goHome} />
                
              </div>
            </div>
          </form>
        }
      </div>
    )
  }

  goHome () {
    window.location.href = "/"
  }

  getUserSQs () {
    ajax({
      url: '/acct/usersecurity/getuserecurityqes.json',
      data:{}
    }, resp => {
      //成功后,将问题列表加载在下拉框中
        $('.panel1 .getqes_sel').html('<option value="">请选择安全问题</option>');
        $('.panel1 .getqes_sel').append(_(resp.root).map(function (option) {
          return '<option value="' + option.userSecurityId + '">' + option.userSecurityQuestion + '</option>';
        }).join(''));
        $('#_firstAnswerOld').val('');
        $('#_secondAnswerOld').val('');
        $('#_thirdAnswerOld').val('');
    }, err => {
      window.Alert({
        content: err.msg || '请求失败！'
      });
    })
  }

  getSQs () {
    ajax({
      url: '/acct/usersecurity/getqesforpaypwd.json',
      data:{}
    }, resp => {
      //成功后,将问题列表加载在下拉框中
        $('.panel2 .getqes_sel').html('<option value="">请选择安全问题</option>');
        $('.panel2 .getqes_sel').append(_(resp.root).map(function (option) {
          return '<option value="' + option.qesId + '">' + option.question + '</option>';
        }).join(''));
        $('#_firstAnswerStep1').val('');
        $('#_secondAnswerStep1').val('');
        $('#_thirdAnswerStep1').val('');
    }, err => {
      window.Alert({
        content: err.msg || '请求失败！'
      });
    })
  }

  onQuestionChange (e) {
    var $target = $(e.currentTarget);
    var $option = $target.find('option:selected');

    var opt = $option.siblings('.selected').removeClass('selected');
    var selectedValue = opt.val();
    var selectedTxt = opt.html();
    var selectingValue = $target.val();

    /*$('.panel1 .getqes_sel').not($target).find('option[value=' + selectedValue + ']').removeClass('hidden');
    $('.panel1 .getqes_sel').not($target).find('option[value=' + selectingValue + ']').addClass('hidden');*/

    if(selectedValue){
      $('.panel1 .getqes_sel').not($target).append('<option value="'+ selectedValue +'">'+ selectedTxt +'</option>');
    }
    $('.panel1 .getqes_sel').not($target).find('option[value=' + selectingValue + ']').remove();

    $option.addClass('selected');
  }

  //提交安全答案
  verifyQustions (e) {
    var valid = this.validateInput(e,'validInput');
    var self = this
    console.log(self.security_queToken)
    if(valid){
      ajax({
        url: '/acct/usersecurity/resetusersecurity.json',
        data: {
          'secrityList[0].securityId': $('#_firstQes').attr('qustId'),
          'secrityList[0].securityQes':$('#_firstQes').val(),
          'secrityList[0].securityAsw': $('#_firstAnswer').val(),
          'secrityList[1].securityId': $('#_secondQes').attr('qustId'),
          'secrityList[1].securityQes': $('#_secondQes').val(),
          'secrityList[1].securityAsw': $('#_secondAnswer').val(),
          'secrityList[2].securityId': $('#_thirdQes').attr('qustId'),
          'secrityList[2].securityQes': $('#_thirdQes').val(),
          'secrityList[2].securityAsw': $('#_thirdAnswer').val(),
          'securityToken': self.security_queToken
        }
      }, resp => {
        this.goStep4();
      }, err => {
       var errMsg ='';
          if(err.root!=null&&_(err.root).isNumber()) {
            if(err.root>0){
              errMsg = '验证失败,剩余' + err.root + '次机会。';
            }else{
              errMsg = '验证失败,请一个小时后再验证！';
            }
          }else{
            if(err.msg==='fail'){
              errMsg = '提交安全答案错误';
             }else{
               errMsg = err.msg;
             }
          }
          window.Alert({
            content: errMsg
          });
      })
    }
  }

  //输入框验证
  validateInput (e,validInput) {
    var tar = $(e.currentTarget);
    var flag = true;
    tar.parents('.question-panel').find(".ui-input").each(function(){
      flag = !!($(this).val().trim()) && flag
    })
    if(flag){
      tar.parents('.question-panel').find('.error-message-container').html('');
    }else if(validInput){
      tar.parents('.question-panel').find('.error-message-container').html('请完善安全问题及答案');
    }
    return flag;
  }

  //验证第一步
  verifySecurityQuestion (e) {
    var valid = this.validateInput(e,'validInput');
    var self = this;
    if(valid){
      ajax({
        url: '/acct/usersecurity/verqesforpaypwd.json',
        data: {
          'secrityList[0].securityId': $('#_firstQesOld').find("option:selected").val(),
          'secrityList[0].securityQes':$('#_firstQesOld').find("option:selected").text(),
          'secrityList[0].securityAsw': $('#_firstAnswerOld').val(),
          'secrityList[1].securityId': $('#_secondQesOld').find("option:selected").val(),
          'secrityList[1].securityQes': $('#_secondQesOld').find("option:selected").text(),
          'secrityList[1].securityAsw': $('#_secondAnswerOld').val(),
          'secrityList[2].securityId': $('#_thirdQesOld').find("option:selected").val(),
          'secrityList[2].securityQes': $('#_thirdQesOld').find("option:selected").text(),
          'secrityList[2].securityAsw': $('#_thirdAnswerOld').val()      }
      }, resp => {
        self.security_queToken = resp.root;
        this.goStep2();
        this.getSQs();
      }, err => {
        var errMsg ='';
        if(err.root!=null&&_(err.root).isNumber()) {
          if(err.root>0){
            errMsg = '验证失败,剩余' + err.root + '次机会。';
          }else{
            errMsg = '验证失败,请一个小时后再验证！';
          }
        }else{
          if(err.msg==='fail'){
            errMsg = '提交安全答案错误';
           }else{
             errMsg = err.msg;
           }
        }
        window.Alert({
          content: errMsg
        });
      })
    }
    
  }

  //输入新安全问题
  goStep2 () {
    $('.resetpwd-title').addClass('hidden');
    $('.reset-tt2').removeClass('hidden');
    $('.panel1').addClass('hidden');
    $('.panel3').addClass('hidden');
    $('.panel2').removeClass('hidden');
  }

  goStep1(){
    $('.resetpwd-title').addClass('hidden');
    $('.reset-tt1').removeClass('hidden');
    $('.panel2').addClass('hidden');
    $('.panel1').removeClass('hidden');
  }

  goStep3(){
    $('.resetpwd-title').addClass('hidden');
    $('.reset-tt3').removeClass('hidden');
    $('.panel2').addClass('hidden');
    $('.panel3').removeClass('hidden');
  }

  goStep4(){
    $('.resetpwd-title').addClass('hidden');
    $('.reset-tt4').removeClass('hidden');
    $('.panel3').addClass('hidden');
    $('.panel4').removeClass('hidden');
  }

  //提交安全答案 step1
  verifyQustionsStep1(e) {
    var valid = this.validateInput(e,'validInput');
    if(valid){
      $('#_firstQes').val($('#_firstQesStep1').find("option:selected").text());
      $('#_firstQes').attr('qustId',$('#_firstQesStep1').find("option:selected").val());
      $('#_firstAnswer').val($('#_firstAnswerStep1').val())
      $('#_secondQes').val($('#_secondQesStep1').find("option:selected").text());
      $('#_secondQes').attr('qustId',$('#_secondQesStep1').find("option:selected").val());
      $('#_secondAnswer').val($('#_secondAnswerStep1').val())
      $('#_thirdQes').val($('#_thirdQesStep1').find("option:selected").text());
      $('#_thirdQes').attr('qustId',$('#_thirdQesStep1').find("option:selected").val());
      $('#_thirdAnswer').val($('#_thirdAnswerStep1').val())
      this.goStep3();
    }
  }

}

module.exports = Update
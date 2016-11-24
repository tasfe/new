import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './LoginPwd.css'
import { logout, load } from 'redux/modules/auth'
import { setTitle,setLeftButton } from 'redux/modules/toolbar'

@connect( state => ({}),
  {
    logout,
    ...actions,
    setTitle,
    setLeftButton
  }
)

@withStyles(styles)
class LoginPwd extends Page {
  constructor () {
    super()

    this.formConfig = {
      class: 'pm-form',
      fields: [{
        text: '当前密码',
        name: 'oldPwd',
        type: 'password',
        placeHolder: '',
        readonly: false,
        validation: {
          rules: ['required','noSpaceChar','notIsNumAndLessThen9', 'minLength::6', 'maxLength::20'],
          errorMsg: '请输入正确的当前密码'
        }
      }, {
        text: '新密码',
        name: 'NewPwd',
        type: 'password',
        tip: '6-20位字符；区分大小写；不允许空白符|9位以下纯数字|与原密码相同',
        validation: {
          //rules: ['required','noSpecialChar', 'minLength::6', 'maxLength::20','notEqualTo::{oldPwd}', 'pattern::^[^\\s]?[\\S][^\\s]?$'],
          rules: ['required','noSpaceChar','notIsNumAndLessThen9', 'minLength::6', 'maxLength::20','notEqualTo::{oldPwd}'],
          errorMsg: '请输入正确的新密码'
        }
      }, {
        text: '确认新密码',
        name: 'NewPwd2',
        type: 'password',
        tip: '再次输入密码',
        validation: {
          rules: ['required', 'equalTo::{NewPwd}'],
          errorMsg: '再次输入的密码不正确'
        }
      }],
      transport: {
        save: '/acct/userinfo/updateloginpwd.json'
      },
      controls: [{
        type: 'submit',
        text: '保存',
        className: 'savePsdBtn'
      }],
      events: {
        onSave: () => {
          //TODO 如何刷新页面
          var self = this;
          window.Alert({
            title: '系统提示',
            content: '密码修改成功,请重新登录',
            callback: () => {
              // console.log('limian1')
              // this.props.logout()
            }
          });
          // console.log('limian2')
          window.setTimeout(function(){
            console.log('limian3')
            self.props.logout();
          },2000)

        },
        onError: (errorData) => {
          window.Alert({
            title: '系统提示',
            content: errorData.msg||'操作失败！'
          });
        }
      }
    }
  }

  componentDidMount () {
    this.props.setTitle('修改登录密码')
    this.props.setRightButton(<div onClick={::this.savePsd}>完成</div>)
    this.props.setLeftButton(true);
  }
  
  savePsd () {
    $('.pm-form').find('button.savePsdBtn').click();
  }
  
  render () {
    return (
      <div className="pm-LoginPwd">
        <div className="form-container">
          <Form config={this.formConfig} />
        </div>
      </div>
    )
  }
}

module.exports = LoginPwd

import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import * as FundPwdAction from  'redux/modules/User/fundPwd'
import withStyles from 'with-style'
import styles from './FundPwd.css'

@connect(
  state => ({

  }),
  {
    ...actions,
    ...FundPwdAction
  }
)

@withStyles(styles)

class FundPwd extends Page {
  constructor () {
    super()

    this.state = {
      type: 'password',
      hidden: true,
      //rules: ['required','noSpecialChar', 'minLength::6', 'maxLength::20'],
      rules: ['required','noSpaceChar','notIsNumAndLessThen9', 'minLength::6', 'maxLength::20'],
      saveUrl:'/acct/userinfo/updatepaypwd.json',
    }


  }

  componentDidMount () {
    console.log('FundPwd.componentDidMount');
    var self = this;
    this.loading();
    this.props.setTitle('修改资金密码')
    this.props.setRightButton(<div onClick={::this.savePsd}>完成</div>)

    ajax({url: '/fund/moneypd/checkpaypwd.json'}, function(res) {
      let $a = $('.tabs-header').find('li').eq(1).find('a');
      //let firstField = self.formConfig.fields[0];
      if (res && res.result === 0) {
        //DONE 修改tab的名字 为 ‘修改资金密码’，并显示旧资金密码输入框
        self.setState({
          type: 'password',
          hidden: false,
          //rules: ['required','noSpecialChar', 'minLength::6', 'maxLength::20'],
          rules: ['required','noSpaceChar','notIsNumAndLessThen9', 'minLength::6', 'maxLength::20'],
          saveUrl:'/acct/userinfo/updatepaypwd.json'
        });
        $a.html('修改资金密码');
      }
      self.loaded();
    }, function(res) {
      let $a = $('.tabs-header').find('li').eq(1).find('a');
      if (res && res.result === 1) {
        //DONE 修改tab的名字 为 ‘设置资金密码’，并隐藏旧资金密码输入框
        self.setState({
          type: 'hidden',
          hidden: true,
          rules: [],
          saveUrl: '/fund/moneypd/savepaypwd.json'
        });
        $a.html('设置资金密码');
      }else{
        window.Alert({
          title: '',
          content: res.msg || '服务器异常'
        });
        self.loaded();
      }
    })
  }


  savePsd () {
    $('.pm-form').find('button.savePsdBtn').click();
  }

  render () {
    let formConfig = {
      class: 'pm-form',
      fields: [
        {
          text: '当前资金密码',
          name: 'oldPayPwd',
          type: this.state.type,
          placeHolder: '',
          readonly: false,
          hidden: this.state.hidden,
          validation: {
            rules: this.state.rules,
            errorMsg: '请输入正确的当前密码'
          }
        },
        {
          text: '新密码',
          name: 'payPwd',
          type: 'password',
          tip: '6-20位字符；区分大小写；不允许空白符|9位以下纯数字|与原密码相同|与登陆密码相同',
          validation: {
            //rules: ['required','noSpecialChar', 'minLength::6', 'maxLength::20','notEqualTo::{oldPayPwd}', 'pattern::^[^\\s]?[\\S][^\\s]?$'],
            rules: ['required','noSpaceChar','notIsNumAndLessThen9', 'minLength::6', 'maxLength::20','notEqualTo::{oldPwd}'],
            errorMsg: '请输入正确的新密码'
          }
        },
        {
          text: '确认新密码',
          name: 'newPayPwd2',
          type: 'password',
          tip: '再次输入密码',
          validation: {
            rules: ['required', 'equalTo::{payPwd}'],
            errorMsg: '再次输入的密码不正确'
          }
        }

      ],
      transport: {
        save: this.state.saveUrl

      },
      controls: [
        {
          type: 'submit',
          text: '保存',
          className: 'savePsdBtn'
        }
      ],
      events: {
        onSubmit: data => {
          this.loading();
        }, // you can prevent the default behavior by return false
        onSave: () => {
          this.loaded()
          //TODO 如何刷新页面
          window.Alert({
            title: '系统提示',
            content: '资金密码修改成功'
          })
        }
        ,
        onError: (errorData) => {
          //todo 输出错误提示
          window.Alert({
            title: '系统提示',
            content: errorData.msg||'请求失败'
          });
        }
      }
    }
    let config = _.extend({}, formConfig);
    return (
      <div className="pm-FundPwd">
        <div className="help-block">
          <div className="help-img">
            <img src="images/eclaim.png" />
          </div>
          <div className="help-text">温馨提示：如需找回资金密码,请前往PC端操作。</div>
        </div>
        <div className="form-container">
          <Form config = {config} />
        </div>
      </div>
    )
  }

}

module.exports = FundPwd

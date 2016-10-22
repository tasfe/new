import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
//import withStyles from 'with-style'
//import styles from './PasswordManage.css'
import Card from './modules/Card/Card'
import SecurityQuestion from './modules/SecurityQuestion/SecurityQuestion'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)

//@withStyles(styles)

class PasswordManage extends Page {
  constructor () {
    super()

    this.formConfig = {
      class: 'pm-form',
      fields: [

        {
          text: '新密码',
          name: 'newPassword1',
          type: 'password',
          tip: '6-20位字符；区分大小写；不允许空白符|9位以下纯数字|与原密码相同'，
          validation: {
            rules: ['required','noSpaceChar','notIsNumAndLessThen9', 'minLength::6', 'maxLength::20'],
            errorMsg: '请输入正确的新密码'
          }
        },
        {
          text: '确认新密码',
          name: 'newPassword2',
          type: 'password',
          tip: '再次输入密码',
          validation: {
            rules: ['required', 'equalTo::{newPassword1}'],
            errorMsg: '再次输入的密码不正确'
          }
        }

      ],
      transport: {
        read: '',
        update: ''
      },
      controls: [
        {
          type: 'submit',
          text: '修改',
          className: 'btn btn-red border-radius width-43 margin-h-sm'
        },
        {
          type: 'button',
          text: '返回',
          className: 'button btn-red border-radius width-43 margin-h-sm'
        }
      ],
      events: {
        submit: data => {},
        change: (value, data) => {}
      }
    }
  }

  componentDidMount () {
    this.props.setTitle('密码管理')
  }

  render () {
    return (
      <div className="pm-passwordManage">
        <div className="js-uc-find-way-select form-container">
          <div className="pm-findWayContainer">
            <div>
              <div className="pm-fi-step">第一步：选择密码找回方式</div>
              <div className="pm-fi-ws-des" >通过"密保问题"找回资金密码</div>
              <button type="button" className="pm-btn pm-fi-ws-btn button border-radius waves-light " data-type="sq" onClick={::this.onFindWayButtonClick}>立即找回</button>
            </div>
            <div>
              <div className="pm-fi-ws-des">通过"银行卡信息"找回资金密码</div>
              <button type="button" className="pm-btn pm-fi-ws-btn button border-radius waves-light" data-type="bc" onClick={::this.onFindWayButtonClick}>立即找回</button>
            </div>
          </div>
        </div>

        <div className="js-uc-find-way-val-container hidden">
          <div className="pm-fi-step">第二步：验证信息</div>
          <Card/>
          <SecurityQuestion/>
        </div>

        <div className="js-uc-find-reset-container hidden">
          <div className="pm-fi-step">第三步：重置资金密码</div>
          <div className="form-container">
            <Form config = {this.formConfig} />
          </div>
        </div>
      </div>
    )
  }

  onFindWayButtonClick (e) {
    var $target = $(e.currentTarget);
    var type = $target.data('type');
    var $select = $('.js-uc-find-way-select');
    var $validate = $('.js-uc-find-way-val-container');
    var $sqContainer = $('.js-pm-fi-sq-container');
    var $bcContainer = $('.js-pm-fi-bc-container');

    if(type==='sq'){
      $bcContainer.addClass('hidden');
      $sqContainer.removeClass('hidden');
    }else if (type==='bc'){
      $sqContainer.addClass('hidden');
      $bcContainer.removeClass('hidden');
    }
    $select.addClass('hidden');
    $validate.removeClass('hidden');
  }
}

module.exports = PasswordManage
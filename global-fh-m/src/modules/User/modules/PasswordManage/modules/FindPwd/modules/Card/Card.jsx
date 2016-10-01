import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
//import withStyles from 'with-style'
//import styles from './PasswordManage.css'

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
          text: '开户人姓名',
          name: 'countName',
          type: 'text',
          placeHolder: '',
          readonly: false,
          validation: {
            rules: ['required'],
            errorMsg: '请输入正确开户人姓名'
          }
        },
        {
          text: '银行卡号',
          name: 'cardNo',
          type: 'text',
          tip: '',
          validation: {
            rules: ['required'],
            errorMsg: '请输入正确的卡号'
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
          text: '验证',
          className: 'btn waves-light border-radius btn-red width-42 margin-h-sm'
        },
        {
          type: 'button',
          text: '返回',
          className: 'js-pm-fi-bc-return btn waves-light border-radius btn-red width-42 margin-h-sm',
          onClick: this.returnToFindWaySelect
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
      <div className="js-pm-fi-bc-container pm-passwordManage">
        <div className="form-container">
          <Form config = {this.formConfig} />
        </div>
      </div>
    )
  }

  returnToFindWaySelect () {
    var $select = $('.js-uc-find-way-select');
    var $validate = $('.js-uc-find-way-val-container');
    $validate.addClass('hidden');
    $select.removeClass('hidden');
  }
}

module.exports = PasswordManage
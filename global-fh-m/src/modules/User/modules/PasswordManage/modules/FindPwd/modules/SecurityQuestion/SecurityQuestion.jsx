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
          text: '问题一',
          name: 'question1',
          type: 'text',
          tip: '',
          validation: {
            rules: ['required'],
            errorMsg: '请选择问题'
          }
        },
        {
          text: '答案',
          name: 'answer1',
          type: 'text',
          placeHolder: '',
          readonly: false,
          validation: {
            rules: ['required'],
            errorMsg: '请输入答案'
          }
        },
        {
          text: '问题二',
          name: 'question2',
          type: 'text',
          tip: '',
          validation: {
            rules: ['required'],
            errorMsg: '请选择问题'
          }
        },
        {
          text: '答案',
          name: 'answer2',
          type: 'text',
          tip: ''
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
          className: 'btn waves-light border-radius btn-red width-42 margin-h-sm'
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
      <div className="js-pm-fi-sq-container pm-passwordManage">
        <div className="form-container">
         <Form config = {this.formConfig} />
        </div>
      </div>
    )
  }
}

module.exports = PasswordManage
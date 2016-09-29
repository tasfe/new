import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
class Profile extends Page {
  constructor () {
    super()

    this.formConfig = {
      class: 'custom-form-class',
      fields: [
        {
          text: '问题一：',
          name: 'question1',
          type: 'text',
          placeHolder: '',
          readonly: false,
          tip: '',
          validation: {
            rules: ['required'],
            errorMsg: '请选择密保问题'
          }
        },
        {
          text: '答案',
          name: 'answer1',
          type: 'text',
          placeHolder: '',
          validation: {
            rules: ['required'],
            errorMsg: '请填写答案'
          }
        },
        {
          text: '问题二：',
          name: 'question2',
          type: 'text',
          placeHolder: '',
          readonly: false,
          tip: '',
          validation: {
            rules: ['required'],
            errorMsg: '请选择密保问题'
          }
        },
        {
          text: '答案',
          name: 'answer2',
          type: 'text',
          placeHolder: '',
          validation: {
            rules: ['required'],
            errorMsg: '请填写答案'
          }
        },
        {
          text: '问题三：',
          name: 'question3',
          type: 'text',
          placeHolder: '',
          readonly: false,
          tip: '',
          validation: {
            rules: ['required'],
            errorMsg: '请选择密保问题'
          }
        },
        {
          text: '答案',
          name: 'answer3',
          type: 'text',
          placeHolder: '',
          validation: {
            rules: ['required'],
            errorMsg: '请填写答案'
          }
        },
      ],
      transport: {
        read: '', // string or a function with a argument that hold the form data
        save: ''
      },
      controls: [
        {
          type: 'submit',
          text: '下一步',
          className: 'btn-red waves-light width-43 margin-h-sm'
        },
        {
          type: 'button',
          text: '返回',
          className: 'btn waves-light border-radius btn-red width-43 margin-h-sm'
        }
      ],
      events: {
        onSubmit: data => {}, // you can prevent the default behavior by return false
        onChange: (name, value, data) => {}
      }
    }
  }

  componentDidMount () {
    this.props.setTitle('个人资料');
    this.loaded();
  }

  render () {
    return (
      <div className="">
        <div className="form-container">
          <Form config={this.formConfig} />
        </div>
      </div>
    )
  }
}

module.exports = Profile
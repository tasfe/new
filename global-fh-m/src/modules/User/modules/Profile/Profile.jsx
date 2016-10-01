import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import { setTitle } from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './Profile.css'

@withStyles(styles)

@connect(state => ({}), {
  setTitle
})

class Profile extends Page {
  constructor () {
    super()

    this.formConfig = {
      class: 'custom-form-class',
      fields: [
        {
          text: '昵称',
          name: 'uname',
          type: 'text',
          tip: '2-16个字符，支持中英文和数字，不能以数字开头',
          validation: {
            rules: ['required','pattern::^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*', 'minLength::2', 'maxLength::10'],
            errorMsg: '请输入符合要求的昵称'
          },
          format: (value, data) => {
            return data['uName']
          }
        }
      ],
      transport: {
        read: '/acct/userinfo/userdetail.json', // string or a function with a argument that hold the form data
        save: '/acct/userinfo/updateuname.json'
      },
      controls: [
        {
          type: 'submit',
          text: '保存',
          className: 'btn btn-red waves-light btn-large'
        }
      ],
      events: {
        onSubmit: data => {
        }, // you can prevent the default behavior by return false
        onChange: (name, value, data) => {},
        onSave: () => {
          window.Alert({
            title: '系统提示',
            content: '昵称修改成功'
          })
        },
        onError:(data) => {
          window.Alert({
            title: '系统提示',
            content: data.msg||'昵称修改失败！'
          });
        }
      }
    }
  }

  componentDidMount () {
    this.props.setTitle('修改昵称');
  }

  render () {
    return (
      <div className="">
        <div className="input-title">请输入您要设定的昵称：</div>
        <div className="form-container profile-form">
          <Form config={this.formConfig} />
        </div>
      </div>
    )
  }
}

module.exports = Profile
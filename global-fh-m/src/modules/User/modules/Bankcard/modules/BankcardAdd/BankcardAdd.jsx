import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './BankcardAdd.css'
import Form from 'components/Form'
//import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux';

import { setTitle } from 'redux/modules/toolbar'

@connect(
  state => ({title: state.toolbar.title}),
  {
    setTitle,
    pushState: routerActions.push
  }
)
@WithStyles(styles)
class BankcardAdd extends Page {
  constructor () {
    super()

    this.formConfig = {
      fields: [
        {
          text: '开户人姓名',
          name: 'name',
          type: 'text',
        },
        {
          text: '开户行',
          name: 'bankId',
          type: 'text',
          placeHolder: '',
          defaultValue: '',
          readonly: false,
          tip: '',
          errorMsg: '请选择开户行',
          pattern: '',
          required: true
        },
        {
          text: '卡号',
          name: 'cardNo',
          type: 'text',
          placeHolder: '请填写银行卡号'
        },
        {
          text: '开户省',
          name: 'province',
          type: 'text',
          placeHolder: '',
          tip: '',
          errorMsg: '',
          pattern: '',
        },
        {
          text: '开户市',
          name: 'city',
          type: 'text',
          placeHolder: '',
          tip: '',
          errorMsg: '',
          pattern: '',
        },
        {
          text: '支行名称',
          name: 'branchId',
          type: 'text',
          placeHolder: '',
          tip: '',
          errorMsg: '',
          pattern: '',
        },
        {
          text: 'token',
          name: 'pwdToken',
          type: 'text',
          defaultValue: ''
        }
      ],
      transport: {
        read: '',
        save: '/fund/bankcard/savecard.json'
      },
      controls: [
        {
          type: 'submit',
          text: '绑定',
          className: 'waves-light btn-large btn-red'
        }
      ],
      events: {
        onSubmit: data => {
          this.loading();
        },
        change: (value, data) => {},
        onSave: () => {
          this.props.pushState('user/bankcard');
        }
      }
    }
  }

  componentDidMount () {
    this.props.setTitle('绑定银行卡')
  }

  render () {
    return (
      <div className="">
        <div className="form-container">
          <Form config = {this.formConfig} />
        </div>
       
      </div>
    )
  }
}

module.exports = BankcardAdd
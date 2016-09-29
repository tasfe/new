import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './NoticeSet.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class NoticeSet extends Page {
  
   constructor () {
    super()

    this.formFields = []

    this.state = {
      formConfig: {
        class: 'notice-config-form',
        fields: this.formFields,
        controls: [
          {
            type: 'submit',
            text: '保存',
            className: 'btn btn-red waves-light btn-large'
          }
        ],
        events: {
          onSubmit (data) {
            let noticeList =[]
            let temp =[]
            let data_save ={}

            for(let i in data){  
              if(data[i]){
                noticeList.push(i.slice(2))
              }
            }

            for(let i in noticeList){ 
              temp[i] = 'noticeList['+i+']'
              data_save[temp[i]] = noticeList[i]
            }   

            ajax({
              url: '/acct/usernotice/savenoticeconf.json',
              data:data_save
            }, resp => {
              window.history.back()
            }, err => {
              window.Alert({
                content: err.msg || '设置失败！'
              });
            })

            return false
          }
        }
      }
    }
  }

  componentDidMount () {
    this.props.setTitle('定义通知类型')

    ajax({
      url: 'acct/usernotice/getnoticeconf.json'
    }, resp => {
      let allConfig = resp.root.allConf
      let myConfig = resp.root.userConf
      allConfig.map(item => {
        item.confList.map(item => {
          this.formFields.push({
            name: 'c_' + item.confId,
            text: item.confName,
            defaultValue: -1 !== myConfig.indexOf(item.confId),
            data: item.confId,
            type: 'toggle'
          })
        })
      })

      let formConfig = $.extend(true, {}, this.state.formConfig, {
        fields: this.formFields
      })

      this.setState({
        formConfig: formConfig
      })
      
    }, err => {
      window.Alert({
        content: err.msg || '数据加载失败！'
      });
    })
  }

  render () {
    return (
      <div>
        <div className="help-block">开关关闭后您将不会再收到相关的系统通知。</div>
        <div className="form-container">
          <Form config={this.state.formConfig} />
        </div>
      </div>
    )
  }
}

module.exports = NoticeSet
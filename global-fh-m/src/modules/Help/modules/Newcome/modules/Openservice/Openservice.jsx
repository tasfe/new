import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Openservice.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Openservice extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--新手类')
  }

  render () {
    return (
      <div className="padding-h-sm" style={{position: 'absolute'}}>
        <h3 className="help-tt">无法打开在线客服窗口怎么办？</h3>
        <div className="hlep-pp">
          <p>
            假如您无法打开在线客服，建议您尝试使用以下方法：
          </p>
          <p>
            1. 请尽量使用谷歌，火狐，IE等浏览器&nbsp;
          </p>
          <p>
            2. 请尝试清理浏览器缓存，重新联系在线客服
          </p>
          <p>
            3. 为了保障您的网络正常，请您在投注或者联系在线客服时，关闭后台占用网速资源较大的程序（如：pps、pptv、游戏下载等）
          </p>
        </div>
      </div>
    )
  }
}

module.exports = Openservice
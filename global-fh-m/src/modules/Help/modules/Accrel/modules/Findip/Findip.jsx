import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Findip.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class Findip extends Page {
  
  componentDidMount () {
    this.props.setTitle('帮助中心--账号相关')
  }

  render () {
    return (
      <div className="padding-h-sm" style={{position: 'absolute'}}>
        <h3 className="help-tt">如何查询当前IP地址？</h3>
        <div className="hlep-pp">
          <p>用户可以登陆<a href="http://www.ip138.com" className="iplink" target="_blank">www.ip138.com</a>进行查询IP地址，打开该连接，页面即会显示所使用电脑的IP地址。</p>
        </div>
      </div>
    )
  }
}

module.exports = Findip
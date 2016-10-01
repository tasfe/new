import React, { Component } from 'react'
import Link from 'react-router/lib/Link'
import withStyles from 'with-style'
import styles from './Menubar.css'

@withStyles(styles)
class Menubar extends Component {
  
  render () {
    return (
      <div className="menu-bar">
        <Link className="menu-item" to="/" title="精彩推荐"><span className="m_icon1"></span><p>精彩推荐</p></Link>
        <Link className="menu-item" to="/tc/ticket" title="购彩大厅"><span className="m_icon2"></span><p>购彩大厅</p></Link>
        <Link className="menu-item" to="/history/openl" title="投注记录"><span className="m_icon3"></span><p>开奖号码</p></Link>
        <Link className="menu-item" to="/history/betting" title="游戏记录"><span className="m_icon4"></span><p>游戏记录</p></Link>
        <Link className="menu-item" to="/user/set" title="设置"><span className="m_icon5"></span><p>设置</p></Link>
        {/*<Link className="menu-item m_icon5" to="/message/sysnotice" title="通知"><p className="notice-tips">9+</p></Link>*/}
      </div>
    )
  }

}

export default Menubar 
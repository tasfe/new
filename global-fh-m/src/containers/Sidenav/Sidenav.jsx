import React, { Component } from 'react'
import Link from 'react-router/lib/Link'
import withStyles from 'with-style'
import styles from './Sidenav.css'

@withStyles(styles)
class Sidenav extends Component {

  render () {
    return (
      <div className="nav-content hideNav hidden">
        <div className="nav-content-wrapper">
          <div className="nav-shield">
            <span></span>
          </div>
          <div className="nav-userInfo">
            <div className="nav-userInfo-userName"><span className="js-nav-userName">{this.props.props.username}</span>(<a className="js-nav-nickName js-nav-link" href="/#/user/profile">{this.props.props.uName}</a>)<a href="/#/message/dynamic" className="js-nav-link"><img className="nav-userInfo-insideLetter" src="images/icon/fh-inside-letter.png"/></a></div>
            <div className="nav-userInfo-img">
              <img src="images/userImg.png"/>
            </div>
            <div className="nav-userInfo-balance text-center">
              <div>账户余额</div>
              <div className="nav-userInfo-balance-text js-user-balance">￥{this.props.props.balance}</div>
            </div>
          </div>
          <div className="nav-list-container">
            <ul className="nav-list">
              <li className="nav-item btn-wave">
                <a href="/#/fund/re" className="item-anchor js-nav-link">
                  <img src="images/nav-icon1.png" />
                  <div className="item-anchor-text">快速充值</div>
                </a>
              </li>
              <li className="nav-item btn-wave">
                <a href="/#/fund/wi" className="item-anchor js-nav-link">
                  <img src="images/nav-icon2.png" />
                  <div className="item-anchor-text">便捷提现</div>
                </a>
              </li>
              <li className="nav-item btn-wave">
                <a href="javascript:void(0);" className="item-anchor js-nav-link" onClick={::this.contactService}>
                  <img src="images/nav-icon3.png" />
                  <div className="item-anchor-text">在线客服</div>
                </a>
              </li>
              <li className="nav-item btn-wave">
                <a href="/#/history/betting" className="item-anchor js-nav-link">
                  <img src="images/nav-icon4.png" />
                  <div className="item-anchor-text">投注记录</div>
                </a>
              </li>
              <li className="nav-item btn-wave">
                <a href="/#/history/account" className="item-anchor js-nav-link">
                  <img src="images/nav-icon5.png" />
                  <div className="item-anchor-text">资金明细</div>
                </a>
              </li>
              <li className="nav-item btn-wave">
                <a href="/#/history/trade" className="item-anchor js-nav-link">
                  <img src="images/nav-icon6.png" />
                  <div className="item-anchor-text">我的追号</div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )

  }

  contactService() {
    window.open('http://v88.live800.com/live800/chatClient/chatbox.jsp?companyID=731101&configID=2579&jid=4521278370','service');
  }

  hideSideNav () {
    this.refs.sideNav.className = 'side-nav'
  }

}

export default Sidenav

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Sidenav from '../Sidenav'
import Toolbar from '../Toolbar'
import Menubar from '../Menubar'
import Home from '../Home'
// import Menubar from '../Menubar'
import withStyles from 'with-style'
import styles from './App.css'
import { logout, load } from 'redux/modules/auth';
import waveEffect from 'components/Toggles/Toggles.css'

import DividendConfig from 'modules/Agency/modules/DivisionManage/dividendConfig'

import Tab from 'components/Tab'

@connect(state => ({
  user: state.auth.user
}), {
  logout,
  load
})
@withStyles(styles)
@withStyles(waveEffect)
class App extends Component {

  componentDidMount () {
    $('.btn-nav').on('click tap', function () {
      $('.nav-content').toggleClass('showNav hideNav').removeClass('hidden');
      $(this).toggleClass('animated');
    });

    $('.nav-shield').on('click tap', function () {
      $('.nav-content').toggleClass('showNav hideNav');
      $('.btn-nav').toggleClass('animated');
    });

    $('.js-nav-link').on('click tap', function () {
      $('.nav-content').toggleClass('showNav hideNav');
      $('.btn-nav').toggleClass('animated');
    });

    $.material.init();
    this.setupAutoAuth();

  }

  componentWillReceiveProps(nextProps) {
    var user = nextProps.user && nextProps.user.root ? nextProps.user.root:undefined;
    if(user){
      $('.js-nav-userName').html(user.username);
      $('.js-nav-nickName').html(user.uName ? user.uName : '未命名');
      $('.js-user-balance').html('￥' + (user.balance ? _(user.balance).convert2yuan() : '0'));
    }
  }

  render () {
    let userRoot = this.props.user && this.props.user.root?this.props.user.root:undefined
    let isGeneralAgency = false;
    if(userRoot){
      isGeneralAgency = userRoot.dividendStatus !== DividendConfig.getByName('UN_APPLIED').id;
    }
    let props = {
      isGeneralAgency : isGeneralAgency,
      username: userRoot && userRoot.username || '赌神',
      headId:userRoot && userRoot.headId ||'1',
      uName: userRoot && userRoot.uName || '未命名',
      balance: userRoot && _(userRoot.balance).convert2yuan() || '0'
    };
    return (
      <div className="root-container">
        <Toolbar />
        <div className="main">
          <div className="relative-main-container">
            {this.props.children || <Home />}
          </div>
        </div>
        <Sidenav props={props} />
        <Menubar />
      </div>
    )
  }

  logout () {
    this.props.logout()
  }

  load() {
    this.props.load();
  }

  setupAutoAuth () {
    this.interval = window.setInterval(() => {
      this.props.load();
    }, 120 * 1000)
  }

}

export default App 
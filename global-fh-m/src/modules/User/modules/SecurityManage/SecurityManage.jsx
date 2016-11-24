import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import WithStyles from 'with-style'
import styles from './SecurityManage.css'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import { cookie, localStore } from 'storeUtil'
import Button from 'components/Button'
import Update from './modules/Update/Update'
import Add from './modules/Add/Add'
import { setTitle,setLeftButton } from 'redux/modules/toolbar'

@WithStyles(styles)
@connect(
  state => ({title: state.toolbar.title, user: state.auth.user}),
  {
    actions,
    setTitle,
    setLeftButton
  }
)
class SecurityManage extends Page {

  constructor (props) {
    super(props);

    this.state = {
     
    }
  }

  componentDidMount () {
    this.props.setTitle('安全问题');
    this.props.setLeftButton(true);
    let self = this;
    $.ajax({
      url: "/acct/usersecurity/getsecurity.json",
      type: 'POST',
      dataType: 'json',
      data: {
        token: cookie.getCookie('user_token') || ''
      },
      success: function(resp) {
        if (resp && resp.result === 0) {
          //0表示密保问题不存在
          self.setState({
            securityCon : <Add />
          })
        }else if(resp && resp.result === 1){
           //1表示密保问题存在
          self.setState({
            securityCon : <Update />
          })
        }
      }
    });
    
  }

  render () {

    return (
      <div className="">
        {this.state.securityCon ? this.state.securityCon : ''}
      </div>
      
    )
  }

}
module.exports = SecurityManage

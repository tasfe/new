import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './OpenAccount.css'
import HandOpen from './modules/HandOpen/HandOpen'
import LinkOpen from './modules/LinkOpen/LinkOpen'

@connect(
  state => ({title: state.toolbar.title, user: state.auth.user}),
  actions
)
@withStyles(styles)
class OpenAccount extends Page {
  constructor (props) {
    super(props);

    if (props.user && props.user.root && props.user.root.merchant) {
      this.tabConfig = {
        fields: [{
          title: '手动开户',
          content: <HandOpen />
        }]
      };
    } else {
      this.tabConfig = {
        fields: [{
          title: '手动开户',
          content: <HandOpen />
        }, {
          title: '链接开户',
          content: <LinkOpen />
        }]
      };
    }
  }

  componentDidMount () {
    this.props.setTitle('开户管理');
  }

  render () {
    return (this.props.children ||
      <div className="oa-openAccount">
        <Tab config={this.tabConfig} />
      </div>
    )
  }
}

module.exports = OpenAccount
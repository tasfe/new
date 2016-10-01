import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'
import withStyles from 'with-style'
import styles from './LinkQrcode.css'
import { setTitle } from 'redux/modules/toolbar'
import { setLeftButton } from 'redux/modules/toolbar'

@connect(
  state => ({title: state.toolbar.title}),
  {...actions,
    setTitle,
    setLeftButton}
)
@withStyles(styles)

class LinkQrcode extends Page {
  constructor (props) {
    super(props)
    this.link = this.toLink('/register.html?linkId=' + props.params.link);
  }

  componentDidMount () {
    this.props.setTitle('链接详情');
    this.props.setLeftButton(true);
    $('#qrcode').qrcode({width: 400,height: 400,text: this.link || "size doesn't matter"});
  }

  toLink (arg) {
    var href = window.location.href;
    var index = href.indexOf('/index.html');
    if (index > -1) {
      return href.substring(0, index) + arg;
    } else {
      return href.substring(0, href.indexOf('/#')) + arg;
    }
  }

  goback () {
    window.history.back()
  }

  render () {
    return (
      <div className="qrcode-container">
        <div id="qrcode"></div>
        <div>
          <textarea className="link-textarea" value={this.link} readOnly></textarea>
        </div>
      </div>
    )
  }
}

module.exports = LinkQrcode
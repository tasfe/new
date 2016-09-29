import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import { setTitle } from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from './InsideLetter.css'
import { setMiddleButton } from 'redux/modules/toolbar'

@withStyles(styles)

@connect(state => ({}), {
  setMiddleButton
})

class InsideLetter extends Page {
  constructor () {
    super()

  }

  componentDidMount () {
    //this.props.setTitle('站内信');
    this.props.setMiddleButton(<div className="toolbar-middleBtn-group"><a className="toolbar-middleBtn" href="/#/message/dynamic">公告</a><a className="toolbar-middleBtn active" href="/#/user/il">站内信</a></div>)
  }

  setMiddleButton () {

  }

  render () {
    return (
      <div className="">
        <div className="input-title">站内信</div>
      </div>
    )
  }
}

module.exports = InsideLetter
import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect(state => ({
  title: state.toolbar.title,
  leftButton: state.toolbar.leftButton,
  rightButton: state.toolbar.rightButton,
  middleButton: state.toolbar.middleButton
}))
class Toolbar extends Component {
  goback () {
    window.history.back()
  }

  render () {
    let { leftButton, title, rightButton, middleButton } = this.props
    return (
      <div className="toolbar">
        <div className="nav" style={{display: leftButton ? 'none' : 'inline-block'}}>
          <button className="btn-nav" >
            <span className="icon-bar top"></span>
            <span className="icon-bar middle"></span>
            <span className="icon-bar bottom"></span>
          </button>
        </div>
        <div className="pull-left">{leftButton && <span className="btn-back" onClick={::this.goback}><i className="fa fa-angle-left"></i></span>}</div>
        {!middleButton && <span className="page-title">{title}</span>}
        <div className="middle-btn" style={{display: "inline-block"}}>{middleButton}</div>
        <div className="pull-right">{rightButton}</div>
      </div>
    )
  }
}

export default Toolbar
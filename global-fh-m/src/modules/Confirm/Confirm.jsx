import React, { PropTypes } from 'react'
import Page from 'base-page'
import { render } from 'react-dom'
import { setTitle } from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import MoneyPassword from './components/MoneyPassword'
import { routerActions } from 'react-router-redux';

@connect(state => ({
  title: state.toolbar.title
}), {
  setTitle,
  pushState: routerActions.push
})
class Confirm extends Page {
  constructor (props) {
    super(props)

    this.componentMap = {
      moneyPassword: <MoneyPassword />
    }

    this.condition = this.getConditions()
  }

  getConditions () {
    let conditions = []
    let search = this.props.location.search
    if (search) {
      let conditionMatcher = search.match(/[\?\&]conditions=([^\&]+)/)
      if (conditionMatcher) {
        conditions = conditionMatcher[1].split(',')
      }
    }

    return {
      next () {
        return conditions.shift()
      }
    }
  }

  renderComponent () {
    let component = this.condition.next()

    if (component) {
      render(this.componentMap[component], this.refs.verifyContainer)
    } else {
      let fromMatcher = this.props.location.search.match(/[\?\&]from=([^\&]+)/)
      if (fromMatcher) {
        this.props.pushState(decodeURIComponent(fromMatcher[1]))
      }
    }
  }

  componentDidMount () {
    this.loaded()
    this.props.setTitle('信息确认')
    this.renderComponent()
  }

  render () {
    return (
      <div>
        <div ref="verifyContainer"　className="verify-item-container"></div>
      </div>
    )
  }

}
module.exports = Confirm
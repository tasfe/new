import React, {Component, PropTypes} from 'react'
import { Input, Select, Toggle } from './Elements'
import GroupElement from './GroupElement'

class FormElement extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired
  }

  render() {
    let { config, data } = this.props

    return (
      <li style={{display: config.hidden ? 'none' : 'list-item'}}>
        { this.getElement() }
        {
          config.tip &&
          <div className="tip-info-container">
            {'string' === typeof config.tip ? config.tip : config.tip(data)}
          </div>
        }
        {
          config.validation &&
          config.validation.errorMsg &&
          <div className="error-message-container" style={{display: 'none'}}>
            {config.validation.errorMsg}
          </div>
        }
      </li>
      )
  }

  getElement () {
    let Element = Input
    let { config } = this.props

    switch (config.type) {
      case 'select':
        Element = Select
        break
      case 'checkbox':
      case 'radio':
      case 'toggle':
        Element = Toggle
        break
      case 'group':
        return <GroupElement {...this.props} />
    }

    return <Element config={config} />
  }
}

export default FormElement
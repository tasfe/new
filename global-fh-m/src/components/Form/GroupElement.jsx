import React, {Component, PropTypes} from 'react'
import FormElement from './FormElement'

class GroupElement extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired
  }

  render() {
    let { config, data} = this.props

    return (
      <ul className="iForm-list-group">
        {config.items.map(item => {
          if (item.name) {
            item.defaultValue = item.format ? item.format(data[item.name], data) : (data[item.name]!==undefined ? data[item.name] : item.defaultValue)
          }
          return <FormElement key={window.keyGenerator()} config={item} data={data} />
        })}
      </ul>
    )
  }
}

export default GroupElement

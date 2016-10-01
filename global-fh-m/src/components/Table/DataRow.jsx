import React, { Component, PropTypes } from 'react'

export default class DataRow extends Component {
  static propTypes = {
    config: PropTypes.array.isRequired,
    data: PropTypes.object
  }

  render () {
    let {id, config, data, index} = this.props

    return (
      <tr id={id} className="data-row" onClick={this.props.onClick}>
        {config.map((item) => {
          return <td key={window.keyGenerator()} dangerouslySetInnerHTML={{__html: item.format ? item.format(data[item.name], data, index) : data[item.name]}}></td>
        })}
      </tr>
    )
  }
}
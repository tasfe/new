import React, { Component, PropTypes } from 'react'

export default class CommandRow extends Component {
  static propTypes = {
    config: PropTypes.array.isRequired,
    colCount: PropTypes.number,
    data: PropTypes.object
  }

  render () {
    let {id, colCount, config, data, onClick} = this.props

    return (
      <tr id={`c_${id}`} className="command-row">
        <td colSpan={colCount} >
          <div className="commands" style={{display: 'none'}}>
            {config.map(item => {
              if (item.visible && false === item.visible(data)) {
                return
              }

              let props = {
                key: window.keyGenerator(),
                className: item.className || '',
                onClick: onClick.bind(this, item, data)
              }

              return item.link ?
                <a href={'string' === typeof item.link ? item.link : item.link(data)} {...props}>{item.text}</a> :
                <button {...props}>{item.text}</button>
            })}
          </div>
        </td>
      </tr>
    )
  }
}
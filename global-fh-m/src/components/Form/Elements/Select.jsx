import React, { Component, PropTypes } from 'react'

class Select extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired
  }

  componentDidMount () {
    if (!_.isUndefined(this.props.config.defaultValue)) {
      this.refs.fakeInput.innerHTML = this.refs.selector.selectedOptions[0]?this.refs.selector.selectedOptions[0].innerHTML:'';
    }
  }

  render () {
    let { config } = this.props;

    return (
      <label className="iForm-list-inner">
        <span className="label">{config.text}</span>
        <div ref="fakeInput" className="fakeInput">{'未选择'}</div>
        <select ref="selector" name={config.name} onChange={::this.onChange} defaultValue={config.defaultValue} >
          {config.selection && config.selection.map((item, index) => {
            var dataProps = {};
            if (!_.isUndefined(item.data) && item.data) {
              for (var x in item.data) {
                dataProps[`data-${x}`] = item.data[x]
              }
            }
            return <option key={window.keyGenerator()} value={item[config.valueField || 'value']} {...dataProps}>{item[config.textField || 'option']}</option>
          })}
        </select>
      </label>
    )
  }

  onChange (evt) {
    this.refs.fakeInput.innerHTML = evt.target.selectedOptions[0].innerHTML;
  }

}

export default Select

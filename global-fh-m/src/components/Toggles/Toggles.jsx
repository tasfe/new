import React, {Component, PropTypes} from 'react'
import WithStyles from 'with-style'
import styles from './Toggles.css'
import material from './material.js'


@WithStyles(styles)
class Toggles extends Component {
  constructor () {
    super()

  }

  static propTypes = {
    config: PropTypes.object
  }

  componentDidMount () {

    $.material.init();
  }

  render() {

    let {config, data} = this.props
    
    if (config.type == 'radio') {
      return (
        <div className="radio">
          <input type="radio" name={config.name} value={config.value} defaultChecked={config.checked} onClick={config.onClick} />
          <label>{config.text}</label>
        </div>
      );
    } else if (config.type == 'checkbox') {
      return (
        <div className="checkbox">
          <label>
            <input 
              type="checkbox" 
              name={config.name} 
              data-id={data} 
              defaultChecked={config.checked} 
              onClick={config.onClick} 
              disabled={config.disabled}
              defaultValue={config.value}/>
            <span className="checkbox-text">{config.text}</span>
          </label>
        </div>
      );
    } else {
      return (
        <div className="togglebutton">
          <label>
            <span>{config.text}</span>
            <input type="checkbox" name={config.name} data={data} defaultChecked={config.defaultValue} />
          </label>
        </div>
      );
    }
  }

}

export default Toggles
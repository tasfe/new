import React, {Component, PropTypes} from 'react'
import WithStyles from 'with-style'
import styles from './Paper.css'


@WithStyles(styles)
class Paper extends Component {
  constructor (props) {
    super(props)

    let idPrefix = props.config.id || 'paper'
    this.id = idPrefix + '_' + window.keyGenerator()
  }

  static propTypes = {
    config: PropTypes.object.isRequired,
  }

  componentDidMount () {

  }

  render() {

    let {config} = this.props;

    return <div key={this.id} className={"paper" + config.className} style={config.style}>
            {config.data.map(item => {
              return <div key={window.keyGenerator()}>{item}</div>

            })}
          </div>
  }

}

export default Paper
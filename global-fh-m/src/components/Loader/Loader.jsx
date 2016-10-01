import React, {Component, PropTypes} from 'react'
import WithStyles from 'with-style'
import styles from './Loader.css'

@WithStyles(styles)
class Loader extends Component {
  static propTypes = {
    config: PropTypes.object
  }

  constructor () {
    super()

  }

  componentDidMount () {

  }

    render() {
    return (<div className="loader">
              <span className="whirly-loader"></span>
            </div>
    )
  }

}

export default Loader
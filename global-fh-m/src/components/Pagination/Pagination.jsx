import React, { Component, PropTypes } from 'react'
import WithStyles from 'with-style'
import styles from './Pagination.css'

@WithStyles(styles)
class Pagination extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    index: PropTypes.number,
    pageSize: PropTypes.number,
    data: PropTypes.object.isRequired
  }

  constructor () {
    super()

    this.index = 0
    this.max = 0
  }

  componentWillReceiveProps (nextProps) {
    this.index = nextProps.index
    this.max = Math.ceil(nextProps.data.rowCount / nextProps.size)
  }

  render () {

    return <div className="pagination">
      <a className="page-btn" onClick={this.goPage.bind(this, -1)}><i className="fa fa-angle-left"></i></a>
      <a className="page-num">{this.max ? (this.index + 1): 0} / {this.max}</a>
      <a className="page-btn" onClick={this.goPage.bind(this, 1)}><i className="fa fa-angle-right"></i></a>
    </div>
  }

  goPage (dir) {
    let index = this.index
    index += dir
    if (index > -1 && index < this.max) {
      this.props.onChange(index)
    }
  }
}

export default Pagination
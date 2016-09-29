import React, { Component, PropTypes } from 'react'
import withStyles from 'with-style'
import styles from './NumberRange.css'

@withStyles(styles)
class NumberRange extends Component {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    defaultValue: PropTypes.number,
    onChange: PropTypes.func
  }

  static defaultProps = {
    min: -Infinity,
    max: Infinity,
    step: 1,
    defaultValue: 1,
    onChange: () => {}
  }

  constructor (props) {
    super(props)

    this.defaultValue = props.defaultValue
    this.step = props.step
    this.state = {
      min: props.min,
      max: props.max,
    }
  }

  sync (value) {
    this.props.onChange(this.change(value))
  }

  add (dir, e) {
    let input = this.refs.input
    let $target = $(e.currentTarget);
    let timer;

    let timeout = _.delay(() => {
      timer = setInterval(() => {
        this.change(Number(input.value) + (dir * this.step))
      }, 50);
    }, 300);

    $target.on('touchend', () => {
      $target.off()
      clearTimeout(timeout);
      clearInterval(timer);
      this.sync(Number(input.value) + (dir * this.step))
    })
  }

  change (value) {
    let input = this.refs.input
    let { max, min } = this.state
    value = value ? Number(value) : input.value

    if (!value || value < min) {
      value = min > -Infinity ? min : 0
    }

    if (value > max) {
      value = max < Infinity ? max : 999999
    }

    input.value = value

    return value
  }

  onChange (e) {
    this.sync(e.target.value)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.max !== nextProps.max || this.props.min !== nextProps.min) {
      this.setState({
        min: nextProps.min,
        max: nextProps.max,
      }, () => {
        this.sync()
      })
    }
  }

  render () {
    let { max, min } = this.state

    return <div className="number-range">
      <a className="minus" onTouchStart={this.add.bind(this, -1)}><i className="fa fa-minus"></i></a>
      <input
        type="text"
        name={this.props.name}
        ref="input"
        className="input"
        defaultValue={this.defaultValue}
        data-min={min}
        data-max={max}
        onChange={::this.onChange}
      />
      <a className="plus" onTouchStart={this.add.bind(this, 1)}><i className="fa fa-plus"></i></a>
    </div>
  }
}

export default NumberRange
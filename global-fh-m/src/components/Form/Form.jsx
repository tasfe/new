import React, { Component, PropTypes } from 'react'
import WithStyles from 'with-style'
import styles from './Form.css'
import Element from './FormElement'
import Validator from './Validator'
import { connect } from 'react-redux'
import { filter } from 'redux/modules/table'
import * as formActions from 'redux/modules/form'
import Button from 'components/Button'
import DataSource from 'components/DataSource'

@WithStyles(styles)
@connect(state => ({}), {filter, formActions})
class Form extends Component {

  static propTypes = {
    config: PropTypes.object.isRequired
  }

  constructor (props) {
    
    super(props)

    this._data = {}

    this.formId = window.keyGenerator()

    this.dataSource = new DataSource(props.config)

    this.state = {
      formData: []
    }
  }

  getFieldMap (config) {
    let o = {}

    config.map(item => {
      item.name && (o[item.name] = item)
      
      if ('group' === item.type) {
        item.items.map(item => {
          item.name && (o[item.name] = item)
        })
      }
      return item
    })

    return o
  }

  createValidator (config) {
    let fields = config || this.props.config.fields

    this.fieldMap = this.getFieldMap(fields)

    this.validator = new Validator({
      form: this.refs[this.formId],
      fieldConfig: fields,
      formControlContainer: 'li',
      errorMsgContainer: '.error-message-container'
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.config) {
      this.createValidator(nextProps.config.fields)
      this.dataSource = new DataSource(nextProps.config)
    }
  }

  shouldComponentUpdate (nextProps) {
    return !nextProps.filterId
  }

  componentDidMount() {
    this.createValidator()
    this.dataSource.read(data => {
      this.setState({
        formData: data
      })
    })
  }

  render() {

    let { fields, controls = [] } = this.props.config
    let formData = this.state.formData
    this.validator && this.validator.setData(formData)

    return (
      <form ref={this.formId} onChange={::this.onChange} className={this.props.config.class}>
        <ul className="iForm-list">
          {fields.map(item => {
            if (item.name) {
              item.defaultValue = item.format ? item.format(formData[item.name], formData) : (formData[item.name]!==undefined ? formData[item.name] : item.defaultValue)
              !item.ignore && (this._data[item.name] = item.defaultValue)
            }
            return <Element key={window.keyGenerator()} config={item} data={formData}/>
          })}
        </ul>
        <div className="iForm-controls padding-h-sm">
          {controls.map(item => {
            return <Button key={window.keyGenerator()} onClick={this.onControlsClick.bind(this, item.type)} config={item} />
          })}
        </div>
      </form>
    )
  }

  shouldFieldUpdate (name) {
    let config = this.fieldMap[name]
    return !config.readonly && !config.ignore
  }

  getValue () {
    let v = $(this.refs[this.formId]).serializeArray()
    let o = {}
    v.map(item => {
      o[item.name] = item.value
    })
    return o
  }

  onChange (evt) {

    let { name, value, type, checked } = evt.target

    if (-1 !== ['checkbox', 'radio', 'toggle'].indexOf(type)) {
      value = checked
    }

    if (name && this.validator.check(name) && this.shouldFieldUpdate(name)) {
      this._data[name] = value
      this.validator && this.validator.setData(name, value)

      let events = this.props.config.events || {}
      events.onChange && events.onChange(name, value, this._data, evt)
    }
  }

  onControlsClick (type, e) {
    let events = this.props.config.events || {}
    let eventName = 'on' + (type[0].toLocaleUpperCase() + type.slice(1))

    switch (type) {
      case 'submit':
        this.validator.check() && this.dataSource.save($.extend(true, {}, this.getValue(), this._data))
        break
      case 'reset':
        //console.log('ok, form reset')
        this._data = {}
        this.refs[this.formId].reset()
        break
      case 'commit':
        this.props.filter(e.target.getAttribute('id'), $.extend(true, {}, this._data, this.getValue()))
        break
      default:
        let event = events[eventName]
        event && event()
    }
  }

}

export default Form
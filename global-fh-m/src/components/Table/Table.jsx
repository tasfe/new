import React, { Component, PropTypes } from 'react'
import { routerActions } from 'react-router-redux';
import { connect } from 'react-redux'
import WithStyles from 'with-style'
import DataRow from './DataRow'
import CommandRow from './CommandRow'
import styles from './Table.css'
import Form from 'components/Form'
import { load, destroy, reset } from 'redux/modules/table'
import Pagination from 'components/Pagination'

@WithStyles(styles)
@connect(state => ({
  filterData: state.table.filterData,
  filterId: state.table.filterId,
  tableData: state.table.tableData,
  tableId: state.table.tableId,
  localMode: state.table.localMode
}), { load, destroy, reset })
class Table extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)

    this.tableId = this.props.id || window.keyGenerator()

    this.transport = props.config.transport || {}
    this.events = props.config.events || {}

    this.state = {
      data: props.data
    }

    this.filterData = {}
    this.pageSize = 10
    this.pageIndex = 0
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.filterId && this.tableId === nextProps.filterId.split('_')[0]) { // 处理 form 触发的过滤
      this.filterData = nextProps.filterData
      
      if (this.filterData && !('data' in this.filterData)) {
        this.filterData = {
          data: this.filterData
        }
      }
      
      // reset page index
      this.pageIndex = 0
      
      if (nextProps.localMode) {
        let data = $.extend(true, {}, this.state.data)
        this.setState({
          data: data
        })
      } else {
        this.read()
      }
    } else {

      let data = []
      if ('used' === nextProps.filterId) {
        data = nextProps.tableData
      } else {
        data = nextProps.data
      }

      this.setState({
        data: data
      })
    }

  }

  shouldComponentUpdate (nextProps) {
    return (!nextProps.filterId || ('used' === nextProps.filterId)) && (!nextProps.tableId || nextProps.tableId && nextProps.tableId === this.tableId)
  }

  getAjaxOption (type, data) {
    let option = null

    if (this.transport) {
      let method = this.transport[type]
      if (method) {
        option = 'string' === typeof method ? ({url: method}) : method()
        
        $.extend(true, option, this.filterData)
        
        $.extend({pageSize: this.pageSize}, option.data,{pageIndex: this.pageIndex}, data)
      }
    }

    return option
  }

  read (data) {
    let option = this.getAjaxOption('read', data)
    option && this.props.load(option, this.tableId)
  }

  destroy (id) {
    let option = this.getAjaxOption('destroy', {id: id})
    option && this.props.destroy(option)
  }

  componentDidMount () {
    this.read()

    // $(this.refs.tableContainer).scroll((evt) => {
    //   if (evt.target.offsetHeight + evt.target.scrollTop === evt.target.scrollHeight) {
    //     let lastPointY = null
    //     $(evt.target).on('touchmove', e => {
    //       let value = e.originalEvent.changedTouches[0].screenY
    //       let offset = lastPointY ? (value - lastPointY) : (lastPointY = value, 0)
    //       offset && console.log(offset)
    //       $(evt.target).css({
    //         transform: `translateY(${offset}px)`
    //       })
    //     }).on('touchend', () => {
    //       lastPointY = null
    //       $(evt.target).css({
    //         transform: `translateY(0)`
    //       })
    //     })
    //   } else {
    //     $(evt.target).off('touchmove touchend')
    //   }
    // })
  }

  componentWillUnmount () {
    this.props.reset()
  }

  getFormConfig () {
    let filters = this.props.config.filters

    return filters ? {
      fields: filters,
      controls: [{
        text: '筛选',
        type: 'commit',
        id: this.tableId,
        className: 'btn-flat pull-right btn-filter-r'
      }, {
        text: '重置',
        type: 'reset',
        className: 'btn-flat pull-right btn-filter-o'
      }]
    }: null
  }

  getTableRows () {
    let data = this.state.data

    if (!data) {
      return ''
    }

    if (!$.isArray(data) && this.transport && this.transport.parse) {
      data = this.transport.parse(data) || []
    }

    let rows = []
    let {columns, command, rowClickLink, emptyMsg} = this.props.config

    data.length ?
      data.map((item, index) => {
        let id = window.keyGenerator()
        rows.push(<DataRow id={id} key={`d_${id}`} data={item} index={index} config={columns} onClick={this.onTableRowClick.bind(this, item)} />)
        if (!rowClickLink && command) {
          rows.push(<CommandRow id={id} key={`c_${id}`} data={item} config={command} colCount={columns.length} onClick={this.onCommandClick} />)
        }
      }) :
      rows.push(<tr key={window.keyGenerator()}><td colSpan={columns.length}>{emptyMsg || '暂无数据'}</td></tr>)

    return rows
  }

  onTableRowClick (rowData, e) {
    let rowClickLink = this.props.config.rowClickLink

    if (rowClickLink) {
      routerActions.push(rowClickLink(rowData))
    } else {
      if (!this.events.onRowClick || this.events.onRowClick && false !== this.events.onRowClick(rowData)) {
        let $target = $(e.currentTarget)
        let $itsCommand = $target.next(`#c_${$target.attr('id')}`)
        $itsCommand.siblings('.command-row.show').removeClass('show').find('.commands').slideUp()
        
        if (!$itsCommand.find('.commands').is(':empty')) {
          $itsCommand.toggleClass('show').find('.commands').slideToggle()
        }
      }
    }
  }

  onCommandClick (config, rowData, e) {
    switch (config.type) {
      case 'destroy':
        window.Alert({
          title: '确认删除该条信息吗？',
          type: 'confirm',
          callback: () => {
            this.destroy(rowData.id)
          }
        })
        break
      case 'edit':
    }
    config.click && config.click(rowData, e);
  }

  toggleFilter () {
    $(this.refs.filterArea).toggleClass('show')
  }

  onPageChange (index) {
    (index + 1) && this.read({
      pageIndex: this.pageIndex = index
    })
  }

  render () {
    let formConfig = this.getFormConfig()
    let { config } = this.props

    let style = {
      maxHeight: config.height || 'auto',
      overflowY: 'scroll',
      height: '100%'
    }

    return (
      <div ref="tableContainer" className={"table-responsive " + (config.className || '')} style={style}>
        <table className="table text-align-center table-hover">
          {config.caption && <caption>{config.caption}</caption>}
          <colgroup>
            {config.columns.map(item => {
              return <col key={window.keyGenerator()} width={item.width} />
            })}
          </colgroup>
          <thead>
          <tr>
            {config.columns.map(column => {
              return <td key={window.keyGenerator()}>{column.title}</td>
            })}
          </tr>
          </thead>
          <tbody>
          {this.getTableRows() || <tr><td colSpan={config.columns.length}><i className="fa fa-circle-o-notch fa-spin"></i></td></tr>}
          </tbody>
        </table>

        { formConfig &&
        <div ref="filterArea" className="table-filter-area">
          <a className="toggle-btn" onClick={::this.toggleFilter}>
            <i className="fa fa-2x fa-filter"></i>
            <i className="fa fa-2x fa-times"></i>
          </a>
          <div className="form-container">
            <Form config={formConfig} filterId={this.props.filterId} />
          </div>
        </div>
        }
        {config.pagable && <Pagination
          onChange={::this.onPageChange}
          index={this.pageIndex}
          size={this.pageSize}
          data={this.state.data || {} }/>
        }
      </div>
    )
  }

}

export default Table
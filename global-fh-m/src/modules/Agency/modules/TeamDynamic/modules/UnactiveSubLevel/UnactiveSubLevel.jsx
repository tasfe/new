import React from 'react'
import Page from 'base-page'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)

class UnactiveSubLevel extends Page {
  constructor () {
    super();

    this.myDate = new Date();
    this.formatDate = this.myDate.getFullYear() + '-' + ((this.myDate.getMonth()+1)>9?(this.myDate.getMonth()+1):'0' + (this.myDate.getMonth()+1)) + '-' + (this.myDate.getDate()>9?this.myDate.getDate():'0' + this.myDate.getDate());

    this.table2Config = {
      columns: [{
        title: '名次',
        name: '',
        format: (value, data, index) => {
          return (index + 1)
        }
      }, {
        title: '直属下级账号',
        name: 'userName'
      }, {
        title: '不活跃团队人数',
        name: 'count'
      }],
      //rowClickLink: rowData => {
      //  return `http://www.baidu.com?q=${rowData.id}`
      //}, // if this option set, command option will be ignore
      transport: {
        parse: data => {
          return data.leaderboards || []
        },
        read: () => {return {
          url: '/info/teamreport/unactiveusers.json',
          data: {
            startTime: this.formatDate,
            endTime: this.formatDate
          }}}
      }
    };


  }

  componentDidMount () {
    this.props.setTitle('团队动态')
  }

  render () {
    return (
      <Table config={ this.table2Config } />
    )
  }
}

module.exports = UnactiveSubLevel
import React from 'react'
import Page from 'base-page'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import Table from 'components/Table'
import withStyles from 'with-style'
import styles from './OperationLog.css'

@connect(
    state => ({title: state.toolbar.title}),
    actions
)

@withStyles(styles)

class OperationLog extends Page {

    constructor () {
        super()

        this.tableConfig = {
            columns: [{
                title: '操作时间',
                name: 'loginTime',
                format: (value, data) => {
                    try{
                        var time = new Date(value);
                        return time.toLocaleString();
                    }catch(e){
                        return '';
                    }
                }
            }, {
                title: '设备',
                name: 'loginDevice'
            }, {
                title: 'IP',
                name: 'loginIp'
            }, {
                title: '地区',
                name: 'loginAddress'
            }],
            //rowClickLink: rowData => {
            //  return `http://www.baidu.com?q=${rowData.id}`
            //}, // if this option set, command option will be ignore
            //command: [],
            transport: {
                read: '/acct/login/loginhistory.json' // url or function with all callback param
            },  
            //filters: []
        }

    }

    componentDidMount () {
        this.loaded()
        this.props.setTitle('操作日志')
    }

    render () {
        return (
            <div>
                <div>
                    <div className="help-block">
                        <div className="help-img"><img src="images/eclaim.png" /></div>
                        <div className="help-text">
                            温馨提示：以下为您最近10次登录记录，若存在异常情况，请在核实后尽快<a href="/#/user/pm" className="text-red">修改密码</a>
                        </div>
                    </div>
                </div>
                <Table config={ this.tableConfig }></Table>
            </div>
        )
    }
}

module.exports = OperationLog
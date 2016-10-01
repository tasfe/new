import React from 'react'
import Page from 'base-page'
import { setTitle } from 'redux/modules/toolbar'
import Table from 'components/Table'
import Form from 'components/Form'
import { connect } from 'react-redux'
import { load, set, create, setHelper, reset } from 'redux/modules/Lottery/chase'

@connect(
  state => ({
    chaseInfo: state.chase.chaseInfo,
    chasePlanList: state.chase.chasePlanList,
    lotteryInfo: state.lottery.lottery,
    maxMultiple: state.betting.maxMultiple
  }), {
    setTitle, load, set, create, setHelper, reset
  }
)
class ControlNm extends Page {

  constructor (props) {
    super(props)

    this.state = {
      planList: [],
      chaseInfo: []
    }

    this.currentPlanId = null

    this.tableConfig = {
      emptyMsg: '点击 生成追号 按钮生成追号数据',
      height: '2rem',
      columns: [{
        title: '序号',
        format (value, data, index) {
          return index + 1
        }
      }, {
        title: '期号',
        name: 'ticketPlanId'
      }, {
        title: '倍数',
        name: 'multiple'
      }, {
        title: '当期投入',
        name: 'betMoney',
        format: value => {
          return _(value).convert2yuan() + '元'
        }
      }, {
        title: '累计投入',
        name: 'statisticsMoney',
        format: value => {
          return _(value).convert2yuan() + '元'
        }
      }]
    }

    this.formConfig = {
      class: 'transfer-form',
      fields: [
        {
          text: '起始期号',
          name: 'startPlanId',
          type: 'select',
          textField: 'ticketPlanId',
          valueField: 'ticketPlanId',
          tip: '选项一为当前期'
        },
        {
          text: '追',
          name: 'chasePlans',
          type: 'number',
          tip: '包含当前期最多可追333期',
          addon: {
            after: '期'
          },
          defaultValue: 5
        },
        {
          text: '起始倍数',
          name: 'startMultiple',
          type: 'number',
          defaultValue: 1
        },
        {
          text: '隔',
          name: 'gaps',
          type: 'number',
          addon: {
            after: '期'
          },
          defaultValue: 1
        },
        {
          text: '倍数x',
          name: 'incMultiple',
          type: 'number',
          defaultValue: 1,
          tip: `最大可投注倍数${props.maxMultiple}`,
          validation: {
            rules: [`maxValue::${props.maxMultiple}`],
            errorMsg: '请注意最大可投注倍数'
          }
        }
      ],
      controls: [
        {
          type: 'submit',
          text: '生成追号',
          className: 'btn-red waves-light newbie-btn chase-create-btn',
        }
      ],
      events: {
        onSubmit: (data) => {
          this.props.create(data)
          return false
        }
      }
    }
  }

  componentDidMount () {
    this.props.setTitle('普通追号')

    this.props.setHelper('normal')
    this.props.load(this.props.ticketId)
    this.props.set({...this.props.betParams})
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.chaseInfo && nextProps.chaseInfo) {
      this.updateChaseInfo(nextProps.chaseInfo)
    } else if (this.props.chaseInfo && nextProps.lotteryInfo && nextProps.lotteryInfo.planId) {
      if (this.currentPlanId && this.currentPlanId !== nextProps.lotteryInfo.planId) {
        let temp = $.extend(true, [], this.state.chaseInfo)
        while (temp.length && temp[0].ticketPlanId !== nextProps.lotteryInfo.planId) {
          temp.shift()
        }

        this.updateChaseInfo(temp)
      }
    }
  }

  updateChaseInfo (data) {
    if (data && data.length) {
      this.props.set({
        plans: data
      })

      this.setState({
        chaseInfo: data
      }, () => {
        $('.chase-create-btn').click()
      })

      this.currentPlanId = data[0].ticketPlanId

    }
  }

  componentWillUnmount () {
    this.props.reset()
  }

  getFormConfig () {
    let { chaseInfo } = this.state
    let formConfig = _.extend({}, this.formConfig)
    let firstField = formConfig.fields[0]

    if (chaseInfo.length) {
      firstField.selection = chaseInfo
      firstField.defaultValue = chaseInfo[0][firstField.valueField]
      formConfig.fields[1].tip = `包含当前期最多可追${chaseInfo.length}期`
      formConfig.fields[1].validation = {
        rules: [`maxValue::${chaseInfo.length}`],
        errorMsg: '请注意最大期号'
      }
    }

    return formConfig
  }

  render () {

    let formConfig = this.getFormConfig()

    let { chasePlanList = [] } = this.props

    return (
      <div>
        <div className="control-form">
          <Form ref="conditionForm" config = {formConfig} />
        </div>
        <Table data={chasePlanList} config={ this.tableConfig }></Table>
      </div>
    )
  }
}

module.exports = ControlNm
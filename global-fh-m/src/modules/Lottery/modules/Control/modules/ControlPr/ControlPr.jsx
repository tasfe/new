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
class ControlPr extends Page {

  constructor (props) {
    super(props)

    this.state = {
      profitValueIndex: 0,
      planList: [],
      chaseInfo: []
    }

    this.currentPlanId = null

    this.profitValueOptions = [
      [{
        text: '利润率',
        name: 'rate',
        defaultValue: 10
      }], [{
        text: '前',
        name: 'prePlans',
        defaultValue: 5,
        addon: {
          after: '期'
        }
      }, {
        text: '利润率',
        name: 'preRate',
        defaultValue: 10,
        addon: {
          after: '%'
        }
      }, {
        text: '之后利润率',
        name: 'afterRate',
        defaultValue: 5,
        addon: {
          after: '%'
        }
      }], [{
        text: '利润金额',
        name: 'amount',
        defaultValue: 100,
        addon: {
          after: '元'
        }
      }], [{
        text: '前',
        name: 'prePlans',
        defaultValue: 5,
        addon: {
          after: '期'
        }
      }, {
        text: '利润金额',
        name: 'preAmount',
        defaultValue: 100,
        addon: {
          after: '元'
        }
      }, {
        text: '之后每期',
        name: 'afterAmount',
        defaultValue: 50,
        addon: {
          after: '元'
        }
      }]
    ]

    let profitOptions = [{
      option: '固定利润率',
      value: 'normalRate'
    }, {
      option: '分段利润率',
      value: 'advanceRate'
    }, {
      option: '固定利润金',
      value: 'normalAmount'
    }, {
      option: '分段利润金',
      value: 'advanceAmount'
    }]

    this.formConfig = {
      class: 'transfer-form',
      fields: [{
        name: 'startPlanId',
        type: 'select',
        text: '起始期号',
        textField: 'ticketPlanId',
        valueField: 'ticketPlanId',
        tip: '选项一为当前期',
        selection: []
      }, {
        text: '追',
        name: 'chasePlans',
        defaultValue: 5,
        type: 'text',
        addon: {
          after: '期'
        }
      }, {
        text: '起始倍数',
        name: 'startMultiple',
        defaultValue: 1,
        type: 'text',
        addon: {
          after: '倍'
        },
        tip: `最大可投注倍数${props.maxMultiple}`,
        validation: {
          rules: [`maxValue::${props.maxMultiple}`],
          errorMsg: '请注意最大可投注倍数'
        }
      }, {
        text: '利润方式',
        name: 'chaseType',
        defaultValue: 'normalRate',
        type: 'select',
        selection: profitOptions,
      }, {
        type: 'group',
        items: []
      }],
      controls: [ {
        type: 'submit',
        text: '生成追号',
        className: 'btn-red waves-light chase-create-btn'
      }],
      events: {
        onChange: (name, value) => {
          if ('chaseType' === name) {
            let index = _(profitOptions).findIndex({
              value: value
            })

            this.setState({
              profitValueIndex: index
            })
          }
        },

        onSubmit: data => {
          this.props.create(data)
          return false
        }
      }
    }

    this.tableConfig = {
      emptyMsg: '点击 生成追号 按钮生成追号数据',
      height: '2rem',
      columns: [{
        title: '序号',
        format: (value, data, index) => {
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
      }, {
        title: '当期奖金',
        name: 'basicMaxBonus',
        format: value => {
          return _(value).convert2yuan() + '元'
        }
      }, {
        title: '预期盈利',
        name: 'expectBonus',
        format: value => {
          return _(value).convert2yuan() + '元'
        }
      }, {
        title: '利润率',
        name: 'bonusRate',
        format: value => {
          return (_(value || 0).formatMul(100).toFixed(1) + '%')
        }
      }]
    }
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

  componentDidMount () {
    this.loaded()
    this.props.setTitle('利润追号')
    
    this.props.setHelper('profit')
    this.props.load(this.props.ticketId)
    this.props.set({...this.props.betParams})
  }

  componentWillUnmount () {
    this.props.reset()
  }
  
  getFormConfig () {
    let { chaseInfo = [{}] } = this.state

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

    formConfig.fields.length && (_(formConfig.fields).last().items = this.profitValueOptions[[this.state.profitValueIndex]])

    return formConfig
  }

  render () {
    let config = this.getFormConfig()

    let { chasePlanList = [] } = this.props

    return (
      <div>
        <div className="control-form">
          <Form config = {config} />
        </div>
        <Table data={chasePlanList} config={ this.tableConfig }></Table>
      </div>
    )
  }
}

module.exports = ControlPr
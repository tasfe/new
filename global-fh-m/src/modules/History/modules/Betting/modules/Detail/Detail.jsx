import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './Detail.css'
import { setTitle } from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import { setLeftButton } from 'redux/modules/toolbar'
import BetItem from './modules/BetItem/BetItem';
import ticketConfig from 'misc/ticketImgConfig'
import { setRightButton } from 'redux/modules/toolbar'

@connect( state => ({
  title: state.toolbar.title,
  user: state.auth.user
}), { setTitle,
  setLeftButton,
  setRightButton})
@WithStyles(styles)
class Detail extends Page {
  constructor() {
    super()

    this.state = {
      data: []
    }
  }

  componentDidMount () {
    this.props.setTitle((_.getQuery('name') ? _.getQuery('name')+'的' : '') + '投注详情')
    this.queryBetInfo();
    this.props.setLeftButton(true);
  }

  render () {
    let data = this.state.data
    let ctpd = data.chaseTicketPlayDetail;

    if(this.state.data.canCancel && (_.getQuery('id') ? _.getQuery('id')==this.props.user.root.userId : true)){
      this.props.setRightButton(<a onClick={::this.cancelBettingHandler} className="checkchase ">撤销订单</a>);
    }else{
      this.props.setRightButton('');
    }
    let config = ticketConfig.get(data.ticketId) || {};
    console.log(config,data.ticketName);
    return (
      <div className="bet-detail">
        { data.chaseTicketPlayDetail && <div>
          <ul className="list iForm-list bet-detail-form" >
            <li className="list-item">
              <div className="bet-detail-left">
                <img className="bet-detail-icon" src={config.img}/>
              </div>
              <div className="bet-detail-right">
                <div className="bet-detail-row1">
                  <div className="bet-detail-name">{data.ticketName} </div>
                  <div className="bet-detail-plan">{'第'+data.ticketPlanId+'期'}</div>
                </div>
                <div className="bet-detail-row2">
                  <div className="bet-detail-bet-money">
                    {_(data.betAllMoney).convert2yuan()}元<br/>
                    <span className="bet-detail-lable">支付金额</span>
                  </div>
                  <div className="bet-detail-prize">
                    {_(data.money).convert2yuan()}元<br/>
                    <span className="bet-detail-lable">中奖金额</span>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item">
              <div>注单编号：</div>
              <div>{data.ticketBetNo}</div>
            </li>
            <li className="list-item">
              <div>购买时间：</div>
              <div>{new Date(data.betTime).toString('yyyy-MM-dd HH:mm:ss')}</div>
            </li>
            <li className="list-item">
              <div>状　　态：</div>
              <div dangerouslySetInnerHTML={{__html: this.checkBettingStatus({
                  betStatus: data.ticketBetStatus,
                  hasException: data.hasException,
                  openNumbers: data.openNum,
                  openStatus: data.ticketOpenStatus,
                  prizing: data.prizing,
                  prizeTotalMoney: ctpd[0].money,
                  prizeClass: 'dtail-redcl'
                })
              }}></div>
            </li>
            <li className="list-item">
              <div>开奖号码：</div>
              <div>
                <ul>
                  { data.openNum ? data.openNum.split(',').map(item => {
                    return <li key={window.keyGenerator()} className="number">{item}</li>
                  }) : "等,待,开,奖".split(',').map(item => {
                    return <li key={window.keyGenerator()} className="number">{item}</li>
                  })
                  }
                </ul>
              </div>
            </li>

          </ul>
          <div className="record-item-container">
            {
              _(ctpd).map((ticket, index) => {
                let recordConfig = {ticketRecord: ticket, betRecord: data};
                return <BetItem config={recordConfig}/>
              })
            }
          </div>
          <a className={cx({
                'checkchase': true,
                'hidden': this.state.data.ticketChaseNo ? false : true
              })}
             href={ data.ticketChaseNo ? `#/history/trade/detail/${data.ticketChaseNo}` + (_.getQuery('id') ? '?id='+_.getQuery('id') + '&name='+_.getQuery('name') : '') : "javascript:void(0);"  }>
            相关追号记录
          </a>

          <input type="hidden" id='jsTicketBetId' value={this.state.data.ticketBetId} />
        </div>}
      </div>)
  }

  checkBettingStatus(bet) {
    //0:未中奖，1：已中奖，2：用户撤单，3：系统撤单 4: 未开始,ticketResult,prizeTotalMoney
    //betStatus, hasException, openNumbers, openStatus, prized, prizeTotalMoney
    var status = '';
    if (bet.betStatus === 4) {
      status = '未开始';
    } else if (bet.betStatus === 2) {
      status = '用户撤单';
    } else if (bet.betStatus === 3) {
      status = '系统撤单';
    } else if (bet.hasException) {
      status = '等待开奖';
    } else if (bet.openNumbers === null) {
      if (bet.openStatus > 0) {
        status = '未中奖';
      } else {
        status = '等待开奖';
      }
    } else if (bet.prizeTotalMoney > 0) {
      //status = '<span class="' + bet.prizeClass + '">' + _(bet.prizeTotalMoney).convert2yuan() + '</span>';
      status = '<span class="' + bet.prizeClass + '">已中奖</span>';
    } else if (bet.prizing) {
      status = '正在开奖';
    } else if (bet.prizeTotalMoney === 0) {
      status = '未中奖';
    }
    return status;
  }

  cancelBettingHandler(e){
    var self = this;
    window.Alert({
      title: '系统提示',
      content: '<p>确定撤消订单？</p>',
      type: 'confirm',
      callback: (e) => {
        self.confirmCancelBetting(e);
      }
    });
  }

  confirmCancelBetting(e) {
    let self = this;
    let data = {betId: $('#jsTicketBetId').val()};
    ajax({url: '/ticket/bet/cancel.json',data}, function(res) {
      if (res && res.result === 0) {
        window.Alert({
          title: '系统提示',
          content: '取消投注成功!',
        });
      }
      self.queryBetInfo();
      return false;
    }, function(res) {
      if (res && res.result === 1) {
        if(res.msg.indexOf('fail')!==-1){
          window.Alert({
            title: '系统提示',
            content: '取消投注失败!',
          });
        }else{
          window.Alert({
            title: '系统提示',
            content: '取消投注失败!'+ res.msg,
          });
        }
        self.queryBetInfo();
      }else{
        window.Alert({
          title: '系统提示',
          content: '请求失败!',
        });
      }
      return false;
    });
  }

  queryBetInfo() {
    ajax({
      url: '/ticket/bet/detail.json',
      data: {
        tradeNo: this.props.params.id
      }
    }, resp => {
      this.setState({
        data: resp.root
      })
    }, err => {
      window.Alert({
        content: err.msg || '数据加载失败！'
      });
    })
  }
}

module.exports = Detail
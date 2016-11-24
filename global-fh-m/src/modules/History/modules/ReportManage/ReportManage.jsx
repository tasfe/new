import React from 'react'
import Page from 'base-page'
import Tab from 'components/Tab'
import * as actions from 'redux/modules/toolbar'
import { logout, load } from 'redux/modules/auth';
import { connect } from 'react-redux'
import withStyles from 'with-style'
import styles from 'components/Button/Button.css'
import accountStyles from './ReportManage.css'
import MoneyRecord from './modules/MoneyRecord/MoneyRecord'
import { setTitle,setLeftButton } from 'redux/modules/toolbar'
import { toggleMainStyle } from 'redux/modules/app'

@connect(
  state => ({
    title: state.toolbar.title,
    user: state.auth.user
  }),{
  actions,
  logout,
  load,
  toggleMainStyle,
  setTitle,
  setLeftButton
  }
)

@withStyles(styles)
@withStyles(accountStyles)
  
class ReportManage extends Page {
  constructor () {
    super();
    this.state = {
      dailyTeamProfit: '',
      dailyAgTeamProfit: ''
    };
    this.myDate = new Date();
    this.myDate2 = this.myDate.setDate(this.myDate.getDate() - 1);
    this.myDate3Start = new Date().getDate() > 15 ? new Date().setDate(16) : new Date().setDate(1);
    this.myDate3End = new Date().getDate() > 15 ? new Date().setDate(this.getLastDay()) : new Date().setDate(15);
    this.myDate4Start = new Date().setDate(1);
    this.myDate4End = new Date().setDate(15);

    ajax({url: '/fund/fundreport/profitdetail.json', data: {
      startTime: this.formatDate(new Date()),
      endTime: this.formatDate(new Date()),
      sortFlag: 6,
      pageSize: 100,
      pageIndex: 0
    }}, (res) => {
      if (res && res.result === 0 && res.root) {
        this.setState({
          dailyTeamProfit: _.convert2yuan(res.root.dailyTeamProfit),
          dailyAgTeamProfit: _.convert2yuan(res.root.dailyAgTeamProfit)
        });
      }}, (res) => {

    });
  }

  formatDate (date) {
    return date.getFullYear() + '-' + ((date.getMonth()+1)>9?(date.getMonth()+1):'0' + (date.getMonth()+1)) + '-' + (date.getDate()>9?date.getDate():'0' + date.getDate());
  }

  getLastDay () {
    var date = new Date();
    var currentMonth = date.getMonth()+1;
    var new_year = date.getFullYear();
    var new_month = ++currentMonth;
    if(new_month>12) {
      new_month -= 12;
      new_year++;
    }
    var new_date = new Date(new_year,new_month-1,1);
    return (new Date(new_date.getTime()-1000*60*60*24)).getDate();
  }

  componentDidMount () {
    this.props.setTitle('报表管理');
    this.props.setLeftButton(true);
    this.props.toggleMainStyle('overflow-hidden');
  }

  componentWillUnmount () {
    this.props.toggleMainStyle('normal');
  }

  render () {
    let tabConfig = {
      fields: [
        {
          title: '今天',
          content: <MoneyRecord config={{startTime: this.formatDate(new Date()), endTime: this.formatDate(new Date())}} />
        },
        {
          title: '昨天',
          content: <MoneyRecord config={{startTime: this.formatDate(new Date(this.myDate2)), endTime: this.formatDate(new Date(this.myDate2))}}/>
        },
        {
          title: '本半月',
          content: <MoneyRecord config={{startTime: this.formatDate(new Date(this.myDate3Start)), endTime: this.formatDate(new Date(this.myDate3End))}} />
        },
        {
          title: '上半月',
          content: <MoneyRecord config={{startTime: this.formatDate(new Date(this.myDate4Start)), endTime: this.formatDate(new Date(this.myDate4End))}}/>
        }
      ],
      claName: 'account-detail-tab'
    };

    return (
      <div style={{height:'100%'}}>
        <div className="account-detail">
          <a className="account-detail-item account-detail-item1 active"  href="/#/history/rm">
            <div className="account-detail-item-desc" >
              彩票
              <div className="js-md-total-balance account-detail-amount">{this.state.dailyTeamProfit > 0 ? ("+"+ this.state.dailyTeamProfit) : this.state.dailyTeamProfit}</div>
            </div>
          </a>
          <a className="account-detail-item" href="/#/history/rmag">
            <div className="account-detail-item-desc" >
              AG
              <div className="js-md-total-bonus account-detail-amount">{this.state.dailyAgTeamProfit > 0 ? ("+" + this.state.dailyAgTeamProfit) : this.state.dailyAgTeamProfit}</div>
            </div>
          </a>
        </div>
        <Tab config = {tabConfig} />
      </div>
    )
  }
}

module.exports = ReportManage;
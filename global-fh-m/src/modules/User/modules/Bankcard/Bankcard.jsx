import React from 'react'
import Link from 'react-router/lib/Link'
import Page from 'base-page'
import Form from 'components/Form'
import WithStyles from 'with-style'
import styles from './Bankcard.css'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import BankConfig from './bankConfig'
import * as BankCardAction from  'redux/modules/User/bankCard'
import * as FundAction from  'redux/modules/User/fundPwd'
import { routerActions } from 'react-router-redux';
import Tile from 'components/Tile'
import { setLeftButton } from 'redux/modules/toolbar'

@connect(
  state => ({
    cardList: state.bankCard.cardList,
    locked: state.bankCard.locked,
    loadBank: state.bankCard.loadBank,
    loadProvinceError: state.bankCard.loadProvinceError,
    loadProvince: state.bankCard.loadProvince,
  }),
  {
    ...actions,
    ...BankCardAction,
    ...FundAction,
    pushState: routerActions.push,
    setLeftButton
  }
)
@WithStyles(styles)
class Bankcard extends Page {

  constructor () {
    super()
    this.state={};
    this.tileStyle = {
      tile: {
        background: '#fbc02d',
        color: '#fff',
        width: '98%'
      }
    };

  }

  componentWillMount() {
    //this.props.checkFundPwd();
  }

  componentDidMount () {
    this.props.setTitle('银行卡管理')
    this.props.setLeftButton(true);
    //this.verify(['moneyPassword'])
    var self = this;
    ajax({url: '/fund/moneypd/checkpaypwd.json'}, function(res) {
      if (res && res.result === 0) {
        self.setState({
          checkSucc: res,

        });
      }
      self.loaded();
    }, function(res) {
      let $a = $('.tabs-header').find('li').eq(1).find('a');
      if (res && res.result === 1) {
        self.setState({
          checkError: res,noFundPwd:true
        });
        //window.Alert({
        //  title: '',
        //  content: '资金密码未设置，是否前往设置？',
        //  type: 'confirm',
        //  callback: () => {
        //    self.props.pushState('user/pm?tabindex=1');
        //  }
        //})
      }
    })
  }

  removeBc(e){
    let token = this.state.token;
    let cardId = $(e.currentTarget).data('id')
    let data = {
      cardId: cardId,
      pwdToken: token
    };
    if(token){
      //不展示验证窗
      this.setState({showVerify:false});
      this.confirmDel(data);
    }else{
      //展示验证窗
      this.setState({showVerify:true, delData: data,type: 'del'});
    }

    //
  }

  confirmDel(data) {
    var self = this;
    window.Alert({
      title: '',
      content: '是否确认删除该银行卡？',
      type: 'confirm',
      callback: () => {
        ajax({url: '/fund/bankcard/delcard.json',data}, function(res) {
          if (res && res.result === 0) {
            self.setState({showVerify:false});
            self.props.getBankCardList();
          }
          self.loaded();
          return false;
        }, function(res) {
          if (res && res.result === 1) {
            self.setState({
              checkError: res,
            });
            self.loaded();
          }
          return false;
        })
        //window.location.reload()
      }
    });
  }


  componentWillReceiveProps(nextProps) {
    let {loadBank,loadBankError, loadProvince,loadProvinceError } = nextProps;
    if(loadBank){
      let bankList = _(loadBank.root).map(function(bank){
        return {
          value:bank.bankId,
          option:bank.bankName
        }
      });
      bankList.unshift({value:'',option:'未选择'});
      this.setState({bankList: bankList,loadSucc:true});

    }else if (loadBankError){
      window.Alert({
        title: '系统提示',
        content: loadBankError.msg||'操作失败！'
      });
    }
    if(loadProvince){
      let provinceList = _(loadProvince.root).map(function(province){
        return {
          value:province.provinceId,
          option:province.province
        }
      });
      provinceList.unshift({value:'',option:'未选择'});
      this.setState({provinceList: provinceList});
    }else if (loadProvinceError){
      window.Alert({
        title: '系统提示',
        content: loadProvinceError.msg||'操作失败！'
      });
    }

  }


  generateCardListHtml(cardList,locked) {
    if(_(cardList).size()>0) {
      return cardList.map((card) => {
        let config = BankConfig.get(card.bankId);
        return <div>
          <ul className="js-uc-bankcard-list bankcard-list">
            <li className="border-radius">
              <div className="bankcard-info clearfix">
                <div className="bankcard-logo"><img src={config.logo} style={{width: '0.4rem'}} alt="银行卡logo"/></div>
                <div className="bankcard-txt">
                  <p className="bankcard-txt-lv14">{card.bankName}</p>
                  <p className="bankcard-txt-lv12">尾号&nbsp;{(card.cardNo).slice(-4)}&nbsp;&nbsp;&nbsp;{card.name}</p>
                  {//<p className="bankcard-txt-lv10">绑定时间:{new Date(card.bindTime).toString()}</p>
                  }
                </div>
              </div>
              { //屏蔽删除功能
                //!locked ?
                //<a className="remove-bc bankcard-txt-lv14" data-id={card.cardId} onClick={::this.removeBc}><i className="fa fa-trash-o"></i></a>:''
              }
            </li>
          </ul>
        </div>
      })
    }else{
      return ''
    }
  }

  addBC(e) {
    let token = this.state.token;
    let $cardList = $('.js-uc-bankcard-list');
    if(_($cardList).size()===5){
      window.Alert({
        title: '系统提示',
        content: '不能添加更多的银行卡',
      });
      return false;
    }
    if( _($cardList).size()===0){
      //不展示验证窗
      this.setState({showAdd:true});
      this.props.getBankList();
      this.props.getProvinceList();
    }else{
      //展示验证窗
      this.setState({showVerify:true,type: 'add'});
    }
  }

  lockBC(e) {
    var $target = $(e.currentTarget);
    var locked = $target.hasClass('locked');
    if(locked){
      return false;
    }
    var self = this;
    window.Alert({
      title: '',
      content: '是否确认锁定银行卡？',
      type: 'confirm',
      callback: () => {
        ajax({url: '/fund/bankcard/lockcard.json'}, function(res) {
          if (res && res.result === 0) {
            self.props.getBankCardList();
          }
          self.loaded();
        }, function(res) {
          let $a = $('.tabs-header').find('li').eq(1).find('a');
          if (res && res.result === 1) {

          }
        })
        //window.location.reload()
      }
    });
  }

  render () {
    let cardList = this.props.cardList;
    let children = this.props.children;
    let checkSucc = this.state.checkSucc;
    let verifySucc = this.state.verifySucc;
    let token = this.state.token;
    let showVerify = this.state.showVerify;
    let showAdd = this.state.showAdd;
    let locked = this.props.locked;
    let noFundPwd = this.state.noFundPwd;

    let addCss = 'iForm-list-inner arrow ';
    let lockCss = 'waves-effect btn btn btn-red waves-light btn-large button-lockbank';

    let self = this;

    this.formConfig = {
      class: 'pm-form',
      fields: [
        {
          text: '资金密码',
          name: 'payPwd',
          type: 'password',
          placeHolder: '请输入资金密码',
          readonly: false,
          validation: {
            rules: ['required'],
            errorMsg: '请输入资金密码'
          }
        },
        {
          text: '类型',
          name: 'type',
          type: 'hidden',
          hidden: true,
          defaultValue: '1',
          format:(value,data) => {
            return '1';
          }
        }
      ],
      transport: {
        save: '/fund/moneypd/verify.json'
      },
      controls: [
        {
          type: 'submit',
          text: '提交',
          className: 'waves-light border-radius btn-large btn-red'
        }
      ],
      events: {
        onSubmit: data => {
          this.loading();
        }, // you can prevent the default behavior by return false
        onChange: (name, value, data) => {},
        onSave: () => {
          this.loaded()
          this.setState({verifySucc: true});
          this.props.getBankCardList();
          return false;
        },
        onError: (errorData) => {
          console.log('login',errorData);
          window.Alert({
            title: '系统提示',
            content: errorData.msg||'请求失败！'
          });
          this.loaded()
        }
      }
    }
    this.formConfig2 = {
      class: 'pm-form',
      fields: [
        {
          text: '开户人姓名',
          name: 'name',
          type: 'text',
          placeHolder: '请输入开户人姓名',
          readonly: false,
          validation: {
            rules: ['required'],
            errorMsg: '请输入开户人姓名'
          }
        },
        {
          text: '卡号',
          name: 'cardNo',
          type: 'text',
          hidden: false,
          defaultValue: '',
          placeHolder: '请输入卡号',
          readonly: false,
          validation: {
            rules: ['required'],
            errorMsg: '请输入正确的银行卡号'
          }
        }
      ],
      transport: {
        save: '/fund/bankcard/verifycard.json'
      },
      controls: [
        {
          type: 'submit',
          text: '提交',
          className: 'waves-light width-42 btn-red margin-h-sm '
        },
        {
          type: 'back',
          text: '返回',
          className: 'waves-light width-42 margin-h-sm'
        }
      ],
      events: {
        onBack: data => {
          console.log('i am go back button');
          this.setState({showVerify: false});
        },
        onSubmit: data => {
          this.loading();
        }, // you can prevent the default behavior by return false
        onChange: (name, value, data) => {},
        onSave: (res) => {
          this.loaded()
          this.setState({token: res.root});
          let type = this.state.type;
          if(type==='del'){
            this.setState({token: res.root});
            let data = this.state.delData;
            data.pwdToken = res.root;
            this.confirmDel(data);
          }else if(type==='add'){
            this.setState({showAdd:true,showVerify:false,token: res.root});
            this.props.getBankList();
            this.props.getProvinceList();
          }
          return false;
        },
        onError: (errorData) => {
          console.log('login',errorData);
          window.Alert({
            title: '系统提示',
            content: errorData.msg||'请求失败！'
          });
          this.loaded()

        }
      }
    }
    this.formConfig3 = {
      fields: [
        {
          text: '开户行',
          name: 'bankId',
          type: 'select',
          placeHolder: '请选择开户行',
          defaultValue: '',
          readonly: false,
          selection: this.state.bankList,
          defaultValue:  _(this.state.bankList).size()>0?this.state.bankList[0].value:'',
          tip: '',
          validation: {
            rules: ['required'],
            errorMsg: '请选择开户行'
          }
        },
        {
          text: '卡号',
          name: 'cardNo',
          type: 'number',
          placeHolder: '请填写银行卡号',
          tip: '请输入长度在13位到19位之间的银行卡号',
          validation: {
            rules: ['required','pattern::^[0-9]{13,19}$'],
            errorMsg: '请填写正确的银行卡号'
          }
        },
        {
          text: '开户人姓名',
          name: 'name',
          type: 'text',
          placeHolder: '请填写开户人姓名',
          tip: '只能输入中文、字母、点和空格,不能以空格和点开头或结尾，不能出现连续的点或空格,不能超过20个字',
          validation: {
            rules: ['required','maxLength::40','pattern::^[A-Za-z\u4E00-\u9FA5](([. ])?([A-Za-z\u4E00-\u9FA5])+)+$'],
            errorMsg: '请填写正确的银行卡号'
          }
        },
        {
          text: '开户省',
          name: 'province',
          type: 'select',
          placeHolder: '',
          tip: '',
          errorMsg: '',
          pattern: '',
          selection: this.state.provinceList,
          defaultValue: _(this.state.provinceList).size()>0?this.state.provinceList[0].value:'',
          validation: {
            rules: ['required'],
            errorMsg: '请选择开户省'
          }
        },
        {
          text: '开户市',
          name: 'city',
          type: 'select',
          placeHolder: '请选择开户市',
          tip: '',
          errorMsg: '',
          pattern: '',
          selection: this.state.cityList,
          valueField: 'cityId',
          textField: 'cityName',
          validation: {
            rules: ['required'],
            errorMsg: '请选择开户市'
          }
        },
        {
          text: '开户支行',
          name: 'branchId',
          type: 'select',
          placeHolder: '请选择开户支行',
          tip: '',
          errorMsg: '',
          pattern: '',
          selection: this.state.branchList,
          valueField: 'branchId',
          textField: 'branchName',
          validation: {
            rules: ['required'],
            errorMsg: '请选择开户支行'
          }
        },
        {
          text: 'pwdToken',
          name: 'pwdToken',
          type: 'hidden',
          hidden: true,
          defaultValue: this.state.token,
          format: (value,data) => {
            return this.state.token;
          }
        }
      ],
      transport: {
        read: '',
        save: '/fund/bankcard/savecard.json'
      },
      controls: [
        {
          type: 'submit',
          text: '绑定',
          className: 'waves-light width-42 btn-red margin-h-sm'
        },
        {
          type: 'back',
          text: '返回',
          className: 'waves-light width-42 margin-h-sm'
        }
      ],
      events: {
        onSubmit: data => {
          this.loading();
        },
        onChange: (name,value, data) => {
          var self = this;
          let $bank = $('select[name="bankId"]');
          let $province = $('select[name="province"]');
          let $city = $('select[name="city"]');
          let $branch = $('select[name="branchId"]');

          if(name==='bankId'||name==='city'){
            let cityId = $city.val();
            let bankId = $bank.val();
            if(cityId==='' || cityId===null || bankId==='' || bankId===null){
              return;
            }
            let data = {
              cityId: cityId,
              bankId: bankId
            };
            ajax({url: '/fund/bankcard/branchlist.json',data}, function(res) {
              if (res.result === 0) {
                let branchOptions = [];
                branchOptions.push('<option value="">未选择</option>');
                _(res.root).each(function (branch, index, branchList) {
                  branchOptions.push('<option value="' + branch.branchId + '">' + branch.branchName + '</option>');
                });
                $branch.html('').html(branchOptions.join(''));
              }
              self.loaded();
            }, function(res) {
              window.Alert({
                title: '系统提示',
                content: res.msg|| "获取支行列表失败!"
              });
              self.loaded();
            })
          }
          if(name==='province'){
            let provinceName = $province.find('option:selected').text();
            let data = {
              province: provinceName
            };
            ajax({url: '/info/city/citylist.json',data}, function(res) {
              if (res.result === 0) {
                let cityOptions = [];
                cityOptions.push('<option value="">未选择</option>');
                _(res.root).each(function (city, index, cityList) {
                  cityOptions.push('<option value="' + city.cityId + '">' + city.city + '</option>');
                });
                $city.html('').html(cityOptions.join(''));
              }
              self.loaded();
            }, function(res) {
              window.Alert({
                title: '系统提示',
                content: res.msg|| "获取城市列表失败!"
              });
              self.loaded();
            })
          }
        },
        onSave: () => {
          //this.props.pushState('user/bankcard');
          this.setState({showAdd:false});
          this.props.getBankCardList();
          window.Alert({
            title: '',
            content: '添加成功'
          });
          return false;
        },
        onError:(data) => {
          window.Alert({
            title: '系统提示',
            content: data.msg||'请求失败！'
          });
          this.loaded()
        },
        onBack: data => {
          console.log('i am go back button');
          this.setState({showAdd: false});
        },
      }
    }

    {
      if(locked){
        addCss = 'hidden';
        lockCss = 'waves-effect btn btn btn-red waves-light btn-large button-lockbank locked';
      }
    }

    if (noFundPwd) {
      console.log('没有资金密码');
      this.tileConfig = {
        title: '您还未设置资金密码，无法进行提现操作',
        content: '前去设置资金密码 >',
        onclick: () => {
          window.setTimeout(function () {
            self.props.pushState('/user/pm?tabindex=1');
          }, 800);

        }
      };
    }

    return (
      <div>
        {
          noFundPwd &&
            <div>
              {this.tileConfig? <Tile config={this.tileConfig} tileStyle={this.tileStyle.tile} /> : ''}
            </div>
        }
        {checkSucc && !verifySucc && !showVerify && !showAdd &&
          <div className="uc-bank-pwdVerify">
            <Form config = {this.formConfig} />
          </div>
        }
        {checkSucc && verifySucc && !showVerify && !showAdd &&
          <div className="">
            {
              children ? children : (
                <div>
                  <div className="help-block">
                    <div className="help-img">
                      <img src="images/eclaim.png" />
                    </div>
                    <div className="help-text">
                      1、每个平台账号最多绑定 5 张银行卡。<br/>
                      2、为了您的资金安全，建议您点击锁定银行卡，
                      银行卡锁定以后不能再增加和删除银行卡，解锁需要联系<a href="javascript:void(0);" onClick={::this.contactService}>在线客服</a>并提交资料审核。<br/>
                      3、新绑定的银行卡需要3个小时后才能正常取款。
                    </div>
                  </div>
                  { ::this.generateCardListHtml(cardList,locked) }
                  {_(cardList).size()<5 ?
                    (<div>
                      <ul className="iForm-list addCard-list">
                        <li className={addCss}>
                          <div className='' onClick={::this.addBC}><span className="add-icon">+</span>添加银行卡</div>
                        </li>
                      </ul>
                      <div className="addCard-tip">您还可以绑定{5-_(cardList).size()}张银行卡</div>
                    </div>) : <span />
                    }
                  <div className="padding-h-sm">
                    <button className={lockCss} type="button" onClick={::this.lockBC} >锁定银行卡</button>
                  </div>
                </div>
              )
            }
          </div>
        }
        {showVerify &&
        <div className="uc-bank-cardVerify">
          <Form config = {this.formConfig2} />
        </div>
        }
        {showAdd &&
          <div className="form-container">
            <Form config = {this.formConfig3} />
          </div>
        }
      </div>
    )
  }

  contactService() {
    window.open('http://v88.live800.com/live800/chatClient/chatbox.jsp?companyID=731101&configID=2579&jid=4521278370','service');
  }


}

module.exports = Bankcard

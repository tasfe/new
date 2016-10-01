import React, { Component, PropTypes } from 'react'
import Link from 'react-router/lib/Link'
import withStyles from 'with-style'
import styles from './OpenAcct.css'
import { connect } from 'react-redux'
import { routerActions } from 'react-router-redux'

@connect(
    state => ({}),
  {pushState: routerActions.push}
)

@withStyles(styles)

class OpenAcct extends Component {

  constructor () {
    super();

  }
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  toLink (arg) {
    var href = window.location.href;
    var index = href.indexOf('/index.html');
    if (index > -1) {
      return href.substring(0, index) + arg;
    } else {
      return href.substring(0, href.indexOf('/#')) + arg;
    }
  }

  editLink (data, e) {
    console.log('111111', data)
    $('.js-linkList').addClass('hidden');
    $('.js-addForm').removeClass('hidden');
    $('input[name="linkDes"]').val(data.userLinkDes).focus();
    $('input[name="rebate"]').val(_.div(data.subAcctRebate, 10));
    $('input[name="linkId"]').val(data.userLinkId);
    $('input[name="linkUrl"]').val(data.userLinkUrl);
  }

  deleteLink (data, e) {
    var $target = $(e.currentTarget);
    let self = this;
    window.Alert({
      type: 'confirm',
      title: '',
      content: '确定删除当前链接？',
      callback: () => {
        this.loading();
        ajax({
          url: '/acct/subaccount/delsubacctlink.json',
          data: {
            linkId: data
          }
        }, res => {
          if (res && res.result === 0) {
            window.Alert({
              type: 'confirm',
              title: '',
              content: '删除成功',
              noCancel: true,
              callback: () => {
              }
            });
            self.props.filter(self.tableId);
          }
          this.loaded();
        }, err => {
          this.loaded();
          window.Alert({
            type: 'confirm',
            title: '',
            content: err.msg,
            noCancel: true,
            callback: () => {
            }
          });
        });
      }
    });
  }

  checkDetail (userLinkUrl, e) {
    this.props.pushState('/agency/oa/lqr/'+ userLinkUrl);
  }

  render () {
    let data = this.props.data
    console.log(data);

    if (data) {
      var link = this.toLink('/register.html?linkId=' + data.userLinkUrl);
    }

    return (
      <div>
        <div className="listItem-title">{data.userLinkDes}</div>
        <div className="listItem-amount">已注册人数（<span>{data.regUserNum}</span>）</div>
        <textarea className="link-textarea" value={link} readOnly onClick={this.checkDetail.bind(this, data.userLinkUrl)}></textarea>
        <div className="listItem-btn-group pull-right">
          <button className="waves-effect btn btn-orange waves-light margin-h-sm" onClick={this.editLink.bind(this, data)}>编辑</button>
          <button className="waves-effect btn btn-white waves-light" onClick={this.deleteLink.bind(this, data.userLinkId)}>删除</button>
        </div>
      </div>
    )
  }
}

export  default OpenAcct
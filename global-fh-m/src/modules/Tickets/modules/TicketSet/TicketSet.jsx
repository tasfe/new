import React from 'react'
import Page from 'base-page'
import WithStyles from 'with-style'
import styles from './TicketSet.css'
import Form from 'components/Form'
import * as actions from 'redux/modules/toolbar'
import { connect } from 'react-redux'
import ticketConfig from 'misc/ticketConfig'

@connect(
  state => ({title: state.toolbar.title}),
  actions
)
@WithStyles(styles)
class TicketSet extends Page {
  
   constructor () {
    super()

    this.formFields = []

    this.state = {
      formConfig: {
        class: 'ticket-config-form',
        fields: this.formFields,
        controls: [
          {
            type: 'submit',
            text: '保存',
            className: 'saveTicketBtn',
          }
        ],
        events: {
          onSubmit (data) {
            let ids = '';
            for(let i in data){  
              if(data[i]){
                //ids += i.slice(2) + ',';
                ids += i + ',';
              }
            }
            let data_save ={ticketIds: ids.substring(0,ids.length-1)}
            ajax({
              url: '/ticket/ticketmod/ticketcustomized.json',
              data: data_save
            }, resp => {
              window.history.back()
            }, err => {
              window.Alert({
                content: err.msg || '设置失败！'
              });
            })

            return false
          },
          onChange (name, value, data, e) {
            var len = 0;
            for(let i in data){  
              if(data[i]){
                len++;
              }
            }
            if(len < 4){
              for(let i in data){  
                if(data[i]){
                  $('.ticket-config-form').find('input[type="checkbox"][name="'+ i +'"]').prop('disabled',true);
                }
              }
            }else{
              $('.ticket-config-form').find('input[type="checkbox"]').prop('disabled',false);
            }
          }
        }
      }
    }
  }

  componentDidMount () {
    this.props.setTitle('设置彩种')
    this.props.setRightButton(<div onClick={::this.saveTicket}>完成</div>)
    var self = this;
    ajax({
      url: '/ticket/ticketmod/getticketcustomized.json'
    }, resp => {
      let myConfig = resp.root || [1,10,21,14,6,18];
      ticketConfig.getCompleteAll().map(item => {
        item.list.map (item => {
          self.formFields.push({
            name: item.id,
            text: item.zhName,
            checked: -1 !== myConfig.indexOf(item.id),
            defaultValue: -1 !== myConfig.indexOf(item.id),
            data: item.id,
            type: 'checkbox',
            disabled: (myConfig.length<4 && -1 !== myConfig.indexOf(item.id)) ? true : false
          })
        })
      })

      let formConfig = $.extend(true, {}, self.state.formConfig, {
        fields: self.formFields
      })

      self.setState({
        formConfig: formConfig
      })
      
    }, err => {
      window.Alert({
        content: err.msg || '数据加载失败！'
      });
    })
  }
  
  saveTicket () {
    $('.ticket-config-form').find('button.saveTicketBtn').click();
  }

  render () {
    return (
      <div>
        <div className="form-container">
          <Form config={this.state.formConfig} />
        </div>
      </div>
    )
  }
}

module.exports = TicketSet
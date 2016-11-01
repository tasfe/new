import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

/**
 * @param  {[object]}
 *  option = {
 *    type: '', //string alert | confirm | prompt
 *    title: '', //string
 *    content: '', //string
 *    callback: '' //function
 *    backdrop: false //boolean
 *    noControl: false //boolean
 *    autoHide: false //boolean
 *    duration: 3000 //number
 *  }
 * @return {[type]}
 */
window.Alert = (option = {}) => {
  _(option).defaults({
    title: '提示',
    content: '消息内容',
    cancelText: '取消',
    okText: '我知道了',
    confirmText: '确认',
    duration: 3000,
  })

  let id = 'alert_' + Math.random().toString(36).substr(-5)
  let isConfirm = 'confirm' === option.type

  let reactEl = (
  <div id={id}>
    <div className="alert hidden">
      {!option.noTitle && <p className="alert-title">{option.title}</p> }
      <div className="alert-content" dangerouslySetInnerHTML={{__html: option.content}}></div>
      {!option.noControl && <div className="alert-footer">
        { isConfirm && !option.noCancel && <button className="alert-button alert-close alert-cancel">{option.cancelText}</button> }
        <button className={cx({
          'alert-button': true,
          'alert-confirm': isConfirm,
          'alert-close': !isConfirm
        })}>{isConfirm ? option.confirmText : option.okText}</button>
      </div>}
    </div>
    <div className="alert-overlay hidden"></div>
  </div>)

  let template = renderToStaticMarkup(reactEl)

  $('body').append(template)
  let $alert = $(`#${id}`)

  const show = () => {
    setTimeout(function(){
      $alert.find('.hidden').removeClass('hidden')
    }, 300)

    if (option.autoHide) {
      let timeout = window.setTimeout(hide, option.duration)
    }
  }

  const hide = () => {
    $alert.off().find('.alert, .alert-overlay').addClass('hidden')
    window.setTimeout(function () {
      $alert.remove();
    }, 500);
  }

  $alert.on('click.alert', '.alert-close, .alert-confirm, .alert-overlay', e => {
    if ($(e.target).is('.alert-confirm')) {
      option.callback && option.callback()
    }
    if ($(e.target).is('.alert-overlay')) {
      option.backdrop && hide()
    } else {
      hide()
    }
    if ($(e.target).is('.alert-close') && $('.alert-content').text() == '资金密码修改成功') {
      location.reload();
    }
  })

  show()
}
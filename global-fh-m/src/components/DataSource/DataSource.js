class DataSource {
  
  constructor (config) {
    this.transport = config.transport || {}
    this.events = config.events || {}

    this.zhMsg = {
      read: '读取',
      save: '保存'
    }
    
    this.defaultData = {}
    
    this.noop = () => {}
  }
  
  setDefaultData (data) {
    this.defaultData = data
  }

  parse (data) {
    return this.transport.parse ? this.transport.parse(data) : (data.root ? data.root : data )
  }

  format (data, type) {
    return this.transport.format ? this.transport.format(data, type) : data
  }

  getAjaxOption (type, data) {
    let option = null
    if (this.transport) {
      let method = this.transport[type]
      if (method) {
        option = 'string' === typeof method ? ({url: method}) : method()
        option.data = $.extend({}, this.defaultData, option.data, data)
      }
    }

    return option
  }

  getEvents (name) {
    return this.events[name] || this.noop
  }

  request (type, data, callback) {

    let option = this.getAjaxOption(type, data)

    option && ajax(option, resp => {
      callback && callback(resp)
    }, err => {
      callback && callback(false, err)
    })
  }

  read (data, callback) {
    if ('function' === typeof data) {
      callback = data
      data = {}
    }
    this.request('read', data, (resp, err) => {
      if (resp) {
        this.getEvents('onFetch')(resp)
        callback && callback(this.parse(resp))
      } else {
        this.getEvents('onError')(err)
        callback && callback(false, err)
      }
    })
  }
  
  doSaveRequest (data, callback) {
    this.request('save', data, (result, err) => {
      if (result) {
        this.getEvents('onSave')(result)
        callback && callback()
      } else {
        this.getEvents('onError')(err)
        callback && callback(false, err)
      }
    })
  }

  save (data, callback) {
    if ('function' === typeof data) {
      callback = data
      data = {}
    }
    
    data = this.format(data)
    let onSubmit = this.getEvents('onSubmit')

    if (2 === onSubmit.length) {
      onSubmit(data, () => {
        this.doSaveRequest(data, callback)
      })
    } else {
      if (false !== onSubmit(data)) {
        this.doSaveRequest(data, callback)
      }
    }
  }
}

export default DataSource
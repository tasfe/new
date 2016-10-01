module.exports = {
  path: 'pwd',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Pwd'))
    })
  }

}

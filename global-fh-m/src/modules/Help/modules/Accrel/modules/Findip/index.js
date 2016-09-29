module.exports = {
  path: 'findip',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Findip'))
    })
  }

}

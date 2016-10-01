module.exports = {
  path: 'payway',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Payway'))
    })
  }

}

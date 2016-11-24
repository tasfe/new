module.exports = {
  path: 'mr',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./MoneyRecord'))
    })
  }

}

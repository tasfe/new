module.exports = {
  path: 'tp',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./TradePer'))
    })
  }

}

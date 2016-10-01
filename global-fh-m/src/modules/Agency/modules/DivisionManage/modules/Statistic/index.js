module.exports = {
  path: 'statistic',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Statistic'))
    })
  }

}

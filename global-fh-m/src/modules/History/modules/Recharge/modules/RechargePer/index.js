module.exports = {
  path: 'rcp',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./RechargePer'))
    })
  }

}

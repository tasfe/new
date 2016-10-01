module.exports = {
  path: 'dpc',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Dpc'))
    })
  }

}

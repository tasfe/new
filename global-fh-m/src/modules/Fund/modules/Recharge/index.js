module.exports = {
  path: 're',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Recharge'))
    })
  }

}

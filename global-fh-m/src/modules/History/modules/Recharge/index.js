module.exports = {
  path: 'recharge',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Recharge'))
    })
  }

}

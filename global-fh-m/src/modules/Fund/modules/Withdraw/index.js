module.exports = {
  path: 'wi',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Withdraw'))
    })
  }

}

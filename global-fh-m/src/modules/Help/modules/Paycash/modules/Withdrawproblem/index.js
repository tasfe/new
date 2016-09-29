module.exports = {
  path: 'wp',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Withdrawproblem'))
    })
  }

}

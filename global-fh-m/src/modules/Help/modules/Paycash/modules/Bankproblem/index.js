module.exports = {
  path: 'bankproblem',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Bankproblem'))
    })
  }

}

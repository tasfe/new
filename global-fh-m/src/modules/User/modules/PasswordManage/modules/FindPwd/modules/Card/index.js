module.exports = {
  path: 'bc',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Card'))
    })
  }

}

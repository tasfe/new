module.exports = {
  path: 'chaseinfo',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Chaseinfo'))
    })
  }

}

module.exports = {
  path: 'foe',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./FiveOEleven'))
    })
  }

}

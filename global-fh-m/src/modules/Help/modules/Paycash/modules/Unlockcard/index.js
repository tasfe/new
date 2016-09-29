module.exports = {
  path: 'unlockcard',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Unlockcard'))
    })
  }

}

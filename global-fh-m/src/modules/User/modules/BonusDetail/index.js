module.exports = {
  path: 'bd',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./BonusDetail'))
    })
  }

}

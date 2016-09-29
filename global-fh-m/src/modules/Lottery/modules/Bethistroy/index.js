module.exports = {
  path: 'bh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Bethistroy'))
    })
  }

}

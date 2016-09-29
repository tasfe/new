module.exports = {
  path: 'cg',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./CashGroup'))
    })
  }

}

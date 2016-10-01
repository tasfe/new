module.exports = {
  path: 'tg',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./TradeGroup'))
    })
  }

}

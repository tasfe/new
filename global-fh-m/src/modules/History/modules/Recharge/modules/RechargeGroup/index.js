module.exports = {
  path: 'rcg',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./RechargeGroup'))
    })
  }

}

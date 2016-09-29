module.exports = {
  path: 'cq',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./ConfirmQuestion'))
    })
  }

}

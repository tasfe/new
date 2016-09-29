module.exports = {
  path: 'vq',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./ValidateQuestion'))
    })
  }

}

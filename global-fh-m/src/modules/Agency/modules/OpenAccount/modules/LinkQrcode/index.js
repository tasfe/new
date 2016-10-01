module.exports = {
  path: 'lqr/:link',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./LinkQrcode'))
    })
  }

}

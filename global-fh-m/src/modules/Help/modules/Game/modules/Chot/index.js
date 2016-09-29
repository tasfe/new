module.exports = {
  path: 'chot',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Chot'))
    })
  }

}

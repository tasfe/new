module.exports = {
  path: 'quickzhongh',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Quickzhongh'))
    })
  }

}

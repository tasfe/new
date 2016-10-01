module.exports = {
  path: 'sqm',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./SecurityManage'))
    })
  }

}

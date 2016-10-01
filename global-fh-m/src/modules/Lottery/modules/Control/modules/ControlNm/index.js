module.exports = {
  path: 'cn',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./ControlNm'))
    })
  }

}

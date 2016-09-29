module.exports = {
  path: 'dm',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./DivisionManage'))
    })
  }

}

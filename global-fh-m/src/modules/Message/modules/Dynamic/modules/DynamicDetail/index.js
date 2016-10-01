module.exports = {
  path: 'dynamicdetail/:id',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./DynamicDetail'))
    })
  }

}

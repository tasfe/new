module.exports = {
  path: 'td',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./TeamDynamic'))
    })
  }

}

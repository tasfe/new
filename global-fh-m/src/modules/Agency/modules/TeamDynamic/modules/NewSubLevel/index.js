module.exports = {
  path: 'nsl',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./NewSubLevel'))
    })
  }

}

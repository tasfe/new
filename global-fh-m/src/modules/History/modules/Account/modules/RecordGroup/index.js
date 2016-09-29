module.exports = {
  path: 'rg',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./RecordGroup'))
    })
  }

}

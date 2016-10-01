module.exports = {
  path: 'rp',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./RecordPer'))
    })
  }

}

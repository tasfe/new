module.exports = {
  path: 'ol',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./OperationLog'))
    })
  }

}

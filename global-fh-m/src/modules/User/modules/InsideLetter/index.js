module.exports = {
  path: 'il',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./InsideLetter'))
    })
  }

}

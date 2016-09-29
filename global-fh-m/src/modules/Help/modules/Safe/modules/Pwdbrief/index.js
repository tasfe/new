module.exports = {
  path: 'pwdbrief',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./Pwdbrief'))
    })
  }

}

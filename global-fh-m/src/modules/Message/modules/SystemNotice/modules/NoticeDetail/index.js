module.exports = {
  path: 'noticedetail/:id',

  getComponent(location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./NoticeDetail'))
    })
  }

}

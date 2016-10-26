module.exports = {
  entry: {
    'vendor': {
      entry: ['./src/vendor/scripts/modernizr']
    }
    // 'vendor': {
    //   entry: ['./src/vendor/build.core.js']
    // }
  },
  output: {
    path: 'dll',
    filename: '[name].js',
    library: '[name]_library',
    context: __dirname,
    publicPath: '/'
  }
};
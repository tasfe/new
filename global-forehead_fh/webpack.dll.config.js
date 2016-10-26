module.exports = {
  entry: {
    'vendor': {
      entry: ['./src/vendor/build.core.js']
    }
  },
  output: {
    path: 'dll',
    filename: '[name].js',
    library: '[name]_[hash]',
    context: __dirname,
    publicPath: '/'
  }
};
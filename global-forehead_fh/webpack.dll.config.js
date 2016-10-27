module.exports = {
  entry: {
    'vendor': {
      entry: [
        './src/vendor/build.core.js',
        './src/vendor/scripts/ZeroClipboard',
        './src/vendor/assets/ZeroClipboard.swf'
      ]
    }
  },
  output: {
    path: 'dll',
    filename: '[name].js',
    library: '[name]_library',
    context: __dirname,
    publicPath: '/'
  }
};
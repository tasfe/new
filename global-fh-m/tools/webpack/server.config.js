import merge from 'lodash.merge'
import webpack from 'webpack'

export default config => {
  return merge({}, config, {
    entry: './src/server.js',
    output: {
      path: './build',
      filename: 'server.js',
      libraryTarget: 'commonjs2',
    },
    target: 'node',
    externals: [
      function filter(context, request, cb) {
        const isExternal =
          request.match(/^[a-z][a-z\/\.\-0-9]*$/i) &&
          !request.match(/^react-routing/) &&
          !context.match(/[\\/]react-routing/);
        cb(null, Boolean(isExternal));
      },
    ],
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
    },
    devtool: 'source-map',
    plugins: [
      ...config.plugins,
      new webpack.BannerPlugin('require("source-map-support").install();',
        { raw: true, entryOnly: false }),
    ],
    module: {
      loaders: [
        ...config.module.loaders,
        {
          test: /\.css$/,
          loader: 'css-loader!postcss-loader',
        }
      ]
    }
  })
}
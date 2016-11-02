import path from 'path'
import merge from 'lodash.merge'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin'

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
      new HtmlWebpackPlugin({
        template: './src/templates/index.html',
        excludeChunks: ['register']
      }),
      new HtmlWebpackPlugin({
        template: './src/templates/index.html',
        excludeChunks: ['app'],
        filename: 'register.html'
      }),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('../../src/dll/vendor-manifest.json'),
        extensions: ['', '.js']
      }),
      new AddAssetHtmlPlugin([
        {
          filepath: require.resolve('../../src/dll/vendor.styles.css'),
          typeOfAsset: 'css',
          hash: true,
          includeSourcemap: false
        },
        {
          filepath: require.resolve('../../src/dll/vendor.js'),
          hash: true,
          includeSourcemap: false
        }
      ])
    ],
    module: {
      loaders: [
        ...config.module.loaders,
        {
          test: /\.jsx?$/,
          loader: 'babel',
          include: [path.join(__dirname, '../../src')]
        },
        {
          test: /\.css$/,
          loader: 'css-loader!postcss-loader',
        }
      ]
    }
  })
}
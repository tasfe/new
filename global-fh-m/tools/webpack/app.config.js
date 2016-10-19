import path from 'path'
import merge from 'lodash.merge'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default (config, WATCH, DEBUG, VERBOSE) => {
  return merge({}, config, {
    entry: {
      app: [
        'font-awesome-webpack',
        ...(WATCH ? ['webpack-hot-middleware/client'] : []),
        './src/app'
      ],
      register: [
        ...(WATCH ? ['webpack-hot-middleware/client'] : []),
        './src/register'
      ],
      lib: ['react', 'redux', 'jquery', 'underscore'],
      plugin: [
        './src/lib/js/tiny-slider.min.js',
        'imports?window=>global!./src/lib/js/jquery.mmenu.all.min.js',
        'imports?window=>global!./src/lib/js/material.js',
        'imports?window=>global!./src/lib/js/ripples.min.js',
        //'imports?window=>global!./src/lib/js/jquery.mobile.datepicker.js',
        'imports?window=>global!./src/lib/js/datetimepicker.js',
        'imports?window=>global!./src/lib/js/jquery.qrcode.min.js'
      ]
    },
    output: {
      path: path.join(__dirname, '../../build/public'),
      filename: DEBUG ? 'bundle.[name].js' : '[name].[hash].js',
      chunkFilename: 'bundle.[chunkhash].js'
    },

    // Choose a developer tool to enhance debugging
    // http://webpack.github.io/docs/configuration.html#devtool
    devtool: DEBUG ? 'eval' : false,
    plugins: [
      ...config.plugins,
      ...(!DEBUG ? [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: VERBOSE,
          },
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new HtmlWebpackPlugin({
          template: './src/templates/index.html',
          excludeChunks: ['register']
        }),
        new HtmlWebpackPlugin({
          template: './src/templates/index.html',
          excludeChunks: ['app'],
          filename: 'register.html'
        })
      ] : []),
      ...(WATCH ? [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
      ] : []),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'lib',
        minChunks: Infinity
      })
    ],
    module: {
      loaders: [
        ...config.module.loaders,
        {
          test: /\.css$/,
          loader: 'style-loader/useable!css-loader!postcss-loader',
        }
      ]
    }
  })
}

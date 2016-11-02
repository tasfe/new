import browserSync from 'browser-sync';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import task from './lib/task';
import config from '../src/config'


global.WATCH = true;

const webpackConfig = require('./webpack.config').default[0]; // Client-side bundle configuration
const bundler = webpack(webpackConfig);

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
module.exports =  task('start', async () => {
  // await require('./build')();
  // await require('./serve')();

  let proxy = [
    {
      path: '*.json',
      target: config.proxy[config.proxyType],
      changeOrigin: true
    },
    {
      path: 'mock/*.json',
      target: 'http://localhost:7070/'
    },
    {
      path: '*',
      target: config.proxy[config.proxyType],
      changeOrigin: true
    }
  ];

  // if (argv.mockup) {
  //   proxy = _(mockupConfig.routers).map(function(val, path) {
  //     return {
  //       path: path,
  //       target: 'http://localhost:7070/'
  //     };
  //   }).concat(proxy);
  // }

  new WebpackDevServer(bundler, {
    publicPath: webpackConfig.output.publicPath,
    // contentBase: './public',
    // contentBase: webpackConfig.output.path,
    hot: true,
    historyApiFallback: true,
    proxy: proxy,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    headers: {'X-Custom-Header': 'no'},
    stats: {
      colors: true,
      // reasons: DEBUG,
      hash: true,
      version: true,
      timings: true,
      chunks: false,
      chunkModules: true,
      cached: true,
      cachedAssets: true,
      assets: false
      // chunkModules: false
    }
  }).listen(config.port, function(err, result) {
    if (err) {
      console.log(err);
    }

    browserSync({
      proxy: `http://localhost:${config.port}/`,
      port: config.proxy.port
    });

    console.log(`Listening at localhost:${config.port}`);
  });

  // browserSync({
  //   port: config.proxy.port,
  //   proxy: {
  //     target: `localhost:${config.port}/`,
  //
  //     middleware: [
  //       webpackDevMiddleware(bundler, {
  //         // IMPORTANT: dev middleware can't access config, so we should
  //         // provide publicPath by ourselves
  //         publicPath: webpackConfig.output.publicPath,
  //
  //         // Pretty colored output
  //         stats: webpackConfig.stats
  //
  //         // For other settings see
  //         // http://webpack.github.io/docs/webpack-dev-middleware.html
  //       }),
  //
  //       // bundler should be the same as above
  //       webpackHotMiddleware(bundler),
  //
  //       proxyMiddleware('**/*.json', {
  //         target: config.proxy[config.proxyType],
  //         changeOrigin: true,
  //         logLevel: 'debug'
  //       })
  //
  //     ],
  //   },
  //
  //   // no need to watch '*.js' here, webpack will take care of it for us,
  //   // including full page reloads if HMR won't work
  //   files: [
  //     'build/public/**/*.css',
  //     'build/public/**/*.html',
  //   ],
  // });
});

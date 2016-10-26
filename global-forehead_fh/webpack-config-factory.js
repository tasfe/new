"use strict";

var _ = require('underscore');
var path = require('path');
var webpack = require('webpack');

var autoprefixer = require('autoprefixer');
var opacity = require('postcss-opacity');
var unrgba = require('postcss-unrgba');
var gradient = require('postcss-filter-gradient');
var pxtorem = require('postcss-pxtorem');

var HappyPack = require('happypack');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = function(options) {
  var appConfig = options.appConfig;

  //==============entry================
  var entry = _(appConfig.entry).reduce(function(entries, entryInfo, entryName) {
    var entry = entryInfo.entry;
    if (entryInfo.hot && options.debug) {
      entry = [
        'webpack-dev-server/client?http://localhost:' + appConfig.port,
        'webpack/hot/only-dev-server'
      ].concat(entry);
    }

    entries[entryName] = entry;

    return entries;
  }, {});

  //==============output================
  var output = {
    path: path.join(__dirname, 'dist/' + appConfig.output.path)
  };

  if (global.DLL) {
    output.filename = appConfig.output.filename;
    output.library = appConfig.output.library;
    output.context = appConfig.output.context;
    // output.publicPath = '.' + appConfig.output.publicPath;
  } else {
    if (options.debug) {

      output.publicPath = 'http://localhost:' + appConfig.port + appConfig.output.publicPath;
      output.filename = '[name].bundle.js';
      output.chunkFilename = '[name].bundle.js';
    } else {
      //临时解决绝对路径在线上无法找到css中下级资源的问题
      output.publicPath = '.' + appConfig.output.publicPath;
      output.filename = '[name].[hash].bundle.js';
      output.chunkFilename = '[name].[chunkhash].bundle.js';
    }
  }

  //==============resolve================
  if (appConfig.resolve) {
    var resolve = {
      root: [
        path.join(__dirname, 'src'),
        path.join(__dirname, 'bower_components'),
        path.join(__dirname, 'node_modules')
        // path.join(__dirname, 'local_modules')
      ],
      // modulesDirectories: ['local_modules', 'node_modules'],
      extensions: ['', '.js', '.scss'],
      alias: appConfig.resolve.alias
    };
  }

  var happyThreadPool = HappyPack.ThreadPool({
    size: 10
  });

  //==============plugins================
  var plugins = [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /zh-cn/),
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      loaders: ['react-hot']
    }),
    new HappyPack({
      id: 'scss',
      threadPool: happyThreadPool,
      loaders: ['style!css?sourceMap!postcss!sass']
    }),
    new HappyPack({
      id: 'css',
      threadPool: happyThreadPool,
      loaders: ['style!css!postcss']
    }),
    // new HappyPack({
    //   id: 'woff',
    //   threadPool: happyThreadPool,
    //   loaders: ['url?limit=10000&minetype=application/font-woff']
    // }),
    new HappyPack({
      id: 'file',
      threadPool: happyThreadPool,
      loaders: ['file']
    }),
    new HappyPack({
      id: 'html',
      threadPool: happyThreadPool,
      loaders: ['html']
    }),
    new HappyPack({
      id: 'snap',
      threadPool: happyThreadPool,
      loaders: ['imports?this=>window,fix=>module.exports=0']
    })
  ];

  if (appConfig.providePlugin) {
    plugins.push(new webpack.ProvidePlugin(appConfig.providePlugin));
  }

  if (global.DLL) {
    plugins.push(new webpack.DllPlugin({
      /**
       * path
       * 定义 manifest 文件生成的位置
       * [name]的部分由entry的名字替换
       */
      path: path.join(__dirname, 'dist/' + appConfig.output.path, '[name]-manifest.json'),
      /**
       * name
       * dll bundle 输出到那个全局变量上
       * 和 output.library 一样即可。
       */
      name: '[name]_library'
    }));
  } else {
    plugins.push(new webpack.DllReferencePlugin({
      // context: __dirname,
      scope: 'vendor',
      manifest: require(path.join(__dirname, 'dist/dll', 'vendor-manifest.json'))
    }));
  }

  if (options.debug) {
    //plugins.push(new CommonsChunkPlugin('vendor.js', appConfig.commonChunks));
    _(appConfig.commonChunks).each(function(commonChunk, name) {
      plugins.push(new CommonsChunkPlugin({
        name: name,
        filename: name + '.js',
        //filename: name + '.js',
        chunks: _(commonChunk).isEmpty() ? Infinity: commonChunk
      }));
    });
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    _(appConfig.commonChunks).each(function(commonChunk, name) {
      plugins.push(new CommonsChunkPlugin({
        name: name,
        filename: name + '.[hash].js',
        chunks: _(commonChunk).isEmpty() ? Infinity: commonChunk
      }));
    });
    //plugins.push(new CommonsChunkPlugin('vendor.[hash].js', appConfig.commonChunks));
    plugins.push(new ExtractTextPlugin('[name].[hash].styles.css'));
    plugins.push(new AssetsPlugin());
  }

  // 生成静态入口html，插件存在bug，无法根据chunks的顺序插入，而是按照了entry的id的顺序，不可控
  // 暂时用数字标明顺序
  _(appConfig.entries).each(function(entryInfo, entryName) {
    plugins.push(new HtmlWebpackPlugin({
      title: entryInfo.title,
      filename: entryName + '.html',
      template: entryInfo.template,
      chunks: entryInfo.chunks,
      inject: 'body',
      favicon: entryInfo.favicon,
      resources : entryInfo.resources,
      chunksSortMode: function(a, b) {
        if (a.entry !== b.entry) {
          return b.entry ? 1 : -1;
        } else if (a.names[0] === 'base' || b.names[0] === 'base') {
          return b.names[0] === 'base' ? 1 : -1;
        } else if (a.names[0] === 'vendor' || b.names[0] === 'vendor') {
          return b.names[0] === 'vendor' ? 1 : -1;
        } else {
          return b.id - a.id;
        }
      }
    }));
  });

  //==============module================
  var module = {
    loaders: [
      {
        test: /\.(jpg|gif)$/,
        loader: 'url?limit=1024'
      },
      {
        test: /\.png$/,
        loaders: ['url?limit=1024!mimetype=image/png!./file.png']
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&minetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg|swf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'happypack/loader?id=file'
      },
      {
        test: /(.*)\.html$/,
        loader: 'happypack/loader?id=html',
        include: [
          path.join(__dirname, 'src/apps')
        ]
      },
      {
        test: /snap/,
        loader: 'happypack/loader?id=snap'
      }
    ]
  };

  if (options.debug) {
    module.loaders.push({
      test: /\.js$/,
      loader: 'happypack/loader?id=js',
      include: [path.join(__dirname, 'src')]
      // query: {
      //   cacheDirectory: true
      // }
    });

    module.loaders.push({
      test:   /\.scss$/,
      loader: 'happypack/loader?id=scss',
      include: [path.join(__dirname, 'src')]
    });

    module.loaders.push({
      test: /\.css$/,
      loader: 'happypack/loader?id=css'
    });

  } else {

    module.loaders.push({
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
      include: [path.join(__dirname, 'src')]
    });

    module.loaders.push({
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style','css!postcss')
    });
  }

  return {
    devtool: options.devtool ? options.devtool : false,
    entry: entry,
    output: output,
    debug: options.debug || false,
    externals: {
    //require("jquery") 是引用自外部模块的
    //对应全局变量 jQuery
    '$': 'jQuery'
    },
    resolve: resolve || {},
    noParse: appConfig.noParse || {},
    plugins: plugins,
    module: module,
    postcss: function () {
      return {
        defaults: [
          unrgba({
            method: 'clone'
          }),
          gradient,
          opacity,
          autoprefixer({browsers: ['Chrome > 30','ie >= 8','> 1%']})
        ],
        rem: [
          unrgba({
            method: 'clone'
          }),
          gradient,
          opacity,
          autoprefixer({browsers: ['Chrome > 30','ie >= 8','> 1%']}),
          pxtorem({
            root_value: 12,
            unit_precision: 5,
            prop_white_list: [],
            replace: false
          })
        ]
      };
    },
    port: appConfig.port || '3000',
    jshint: {
      "noempty": true,
      "noarg": true,
      "eqeqeq": true,
      "jquery": true,
      "browser": true,
      "bitwise": true,
      "curly": true,
      "undef": true,
      "nonew": true,
      "strict": false,
      "forin": true,
      "globals" : {
        "moment": false,
        "Backbone": false,
        "Base": false,
        "Global": false,
        "_": false,
        "require": false,
        "exports": false,
        "module": false,
        "describe": false,
        "it": false,
        "before": false,
        "beforeEach": false,
        "after": false,
        "afterEach": false
      }
    }
  };
};


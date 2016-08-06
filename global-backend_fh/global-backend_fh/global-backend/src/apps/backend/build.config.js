  var vendorBuildConfig = require('../../vendor/build.config');
var baseBuildConfig = require('../../base/build.config');
var gulpPlugins = require('gulp-load-plugins')();

var STYLES_VERSION = '0.1.8';

module.exports = {

  dest: 'src/apps/backend/dist',

  loader: '.wm-loader-wrapper{position:fixed;top:0;left:0;width:100%;height:100%;z-index:1000;background-color:#000;opacity:.8}.wm-loader{display:block;position:relative;left:50%;top:50%;width:100px;height:100px;margin:-45px 0 0 -45px;border-radius:50%;border:3px solid transparent;border-top-color:#fff;-webkit-animation:spin 2s linear infinite;-moz-animation:spin 2s linear infinite;animation:spin 2s linear infinite;z-index:1001}.wm-loader-logo{position:absolute;left:50%;top:50%;width:35px;height:35px;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);transform:translate(-50%,-50%);z-index:1001;opacity:1;visibility:visible}.wm-loader-logo img{max-width:100%;width:99.99%}.loaded .wm-loader-logo{opacity:0;visibility:hidden}.wm-loader:before{content:"";position:absolute;top:5px;left:5px;right:5px;bottom:5px;border-radius:50%;border:3px solid transparent;border-top-color:#f74b37;-webkit-animation:spin 3s linear infinite;-moz-animation:spin 3s linear infinite;animation:spin 3s linear infinite}.wm-loader:after{content:"";position:absolute;top:15px;left:15px;right:15px;bottom:15px;border-radius:50%;border:3px solid transparent;border-top-color:#57bddb;-webkit-animation:spin 1.5s linear infinite;-moz-animation:spin 1.5s linear infinite;animation:spin 1.5s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spin{0%{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg)}}.wm-loader-wrapper .wm-loader-section{position:fixed;top:0;width:51%;height:100%;z-index:1000;-webkit-transform:translateX(0);-moz-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0)}.wm-loader-wrapper .wm-loader-section.section-left{left:0}.wm-loader-wrapper .wm-loader-section.section-right{right:0}.loaded .wm-loader-wrapper .wm-loader-section.section-left{-webkit-transform:translateX(-100%);-moz-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%);-webkit-transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1);-moz-transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1);transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1)}.loaded .wm-loader-wrapper .wm-loader-section.section-right{-webkit-transform:translateX(100%);-moz-transform:translateX(100%);-ms-transform:translateX(100%);transform:translateX(100%);-webkit-transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1);-moz-transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1);transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1)}.loaded .wm-loader{opacity:0;-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;transition:all .3s ease-out}.loaded .wm-loader-wrapper{visibility:hidden;-webkit-transform:translateY(-100%);-moz-transform:translateY(-100%);-ms-transform:translateY(-100%);transform:translateY(-100%);-webkit-transition:all .3s 1s ease-out;-moz-transition:all .3s 1s ease-out;transition:all .3s 1s ease-out}.lt-ie9 .wm-loader-wrapper{display:none}',

  styles: {
    version: STYLES_VERSION,
    name: 'wt.app',
    sources: 'src/apps/backend/styles',
    dest: 'src/apps/backend/dist/styles'
  },

  scripts: {
    version: '1.2.6.2',
    name: 'wt.app'
  },

  html: {
    src: [
      'src/apps/backend/index.build',
      'src/apps/backend/packages/login.build',
      'src/apps/backend/packages/register.build',
      'src/apps/backend/packages/resetPassword.build',
      'src/apps/backend/packages/updateUserInfo.build',
      'src/apps/backend/packages/register.build'
    ],
    dest: 'www/backend',
    scriptsPerFolder: {
      '**/index.build': [{
        src: './scripts/wt.vendor-core-' + vendorBuildConfig.scripts.core.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/wt.vendor-ext-' + vendorBuildConfig.scripts.ext.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/wt.vendor-echarts-' + vendorBuildConfig.scripts.echarts.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/wt.framework-' + baseBuildConfig.scripts.framework.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }],
      '**/login.build': [{
        src: './scripts/wt.vendor-core-' + vendorBuildConfig.scripts.core.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/wt.vendor-ext-' + vendorBuildConfig.scripts.ext.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/wt.framework-' + baseBuildConfig.scripts.framework.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/login.min.js',
        mimeType: 'text/javascript',
        copy: false
      }],
      '**/register.build': [{
        src: './scripts/wt.vendor-core-' + vendorBuildConfig.scripts.core.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/wt.vendor-ext-' + vendorBuildConfig.scripts.ext.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/wt.framework-' + baseBuildConfig.scripts.framework.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/register.min.js',
        mimeType: 'text/javascript',
        copy: false
      }],
      '**/resetPassword.build': [{
        src: './scripts/wt.vendor-core-' + vendorBuildConfig.scripts.core.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/wt.vendor-ext-' + vendorBuildConfig.scripts.ext.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/wt.framework-' + baseBuildConfig.scripts.framework.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/resetPassword.min.js',
        mimeType: 'text/javascript',
        copy: false
      }],
      '**/updateUserInfo.build': [{
        src: './scripts/wt.vendor-core-' + vendorBuildConfig.scripts.core.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/wt.vendor-ext-' + vendorBuildConfig.scripts.ext.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/wt.framework-' + baseBuildConfig.scripts.framework.version + '.min.js',
        mimeType: 'text/javascript',
        copy: false
      }, {
        src: './scripts/updateUserInfo.min.js',
        mimeType: 'text/javascript',
        copy: false
      }]
    },
    stylesPerFolder: {
      '**/index.build': [{
        inline: '.wm-loader-wrapper{position:fixed;top:0;left:0;width:100%;height:100%;z-index:1000;background-color:#000;opacity:.8}.wm-loader{display:block;position:relative;left:50%;top:50%;width:100px;height:100px;margin:-45px 0 0 -45px;border-radius:50%;border:3px solid transparent;border-top-color:#fff;-webkit-animation:spin 2s linear infinite;-moz-animation:spin 2s linear infinite;animation:spin 2s linear infinite;z-index:1001}.wm-loader-logo{position:absolute;left:50%;top:50%;width:35px;height:35px;-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);transform:translate(-50%,-50%);z-index:1001;opacity:1;visibility:visible}.wm-loader-logo img{max-width:100%;width:99.99%}.loaded .wm-loader-logo{opacity:0;visibility:hidden}.wm-loader:before{content:"";position:absolute;top:5px;left:5px;right:5px;bottom:5px;border-radius:50%;border:3px solid transparent;border-top-color:#f74b37;-webkit-animation:spin 3s linear infinite;-moz-animation:spin 3s linear infinite;animation:spin 3s linear infinite}.wm-loader:after{content:"";position:absolute;top:15px;left:15px;right:15px;bottom:15px;border-radius:50%;border:3px solid transparent;border-top-color:#57bddb;-webkit-animation:spin 1.5s linear infinite;-moz-animation:spin 1.5s linear infinite;animation:spin 1.5s linear infinite}@-webkit-keyframes spin{0%{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes spin{0%{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);-moz-transform:rotate(360deg);-ms-transform:rotate(360deg);transform:rotate(360deg)}}.wm-loader-wrapper .wm-loader-section{position:fixed;top:0;width:51%;height:100%;z-index:1000;-webkit-transform:translateX(0);-moz-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0)}.wm-loader-wrapper .wm-loader-section.section-left{left:0}.wm-loader-wrapper .wm-loader-section.section-right{right:0}.loaded .wm-loader-wrapper .wm-loader-section.section-left{-webkit-transform:translateX(-100%);-moz-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%);-webkit-transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1);-moz-transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1);transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1)}.loaded .wm-loader-wrapper .wm-loader-section.section-right{-webkit-transform:translateX(100%);-moz-transform:translateX(100%);-ms-transform:translateX(100%);transform:translateX(100%);-webkit-transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1);-moz-transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1);transition:all .7s .3s cubic-bezier(0.645,0.045,0.355,1)}.loaded .wm-loader{opacity:0;-webkit-transition:all .3s ease-out;-moz-transition:all .3s ease-out;transition:all .3s ease-out}.loaded .wm-loader-wrapper{visibility:hidden;-webkit-transform:translateY(-100%);-moz-transform:translateY(-100%);-ms-transform:translateY(-100%);transform:translateY(-100%);-webkit-transition:all .3s 1s ease-out;-moz-transition:all .3s 1s ease-out;transition:all .3s 1s ease-out}.lt-ie9 .wm-loader-wrapper{display:none}',
        mimeType: 'text/css'
      }, {
        href: './styles/wt.vendor-' + vendorBuildConfig.styles.version + '.min.css',
        mimeType: 'stylesheet',
        copy: false
      }, {
        href: './styles/wt.framework-' + baseBuildConfig.styles.version + '.min.css',
        mimeType: 'stylesheet',
        copy: false
      }, {
        href: './styles/wt.app-' + STYLES_VERSION+ '.min.css',
        mimeType: 'stylesheet',
        copy: false
      }],
      '**/login.build': [{
        href: './styles/wt.vendor-' + vendorBuildConfig.styles.version + '.min.css',
        mimeType: 'stylesheet',
        copy: false
      }, {
        href: './styles/wt.framework-' + baseBuildConfig.styles.version + '.min.css',
        mimeType: 'stylesheet',
        copy: false
      }, {
        href: './styles/login.min.css',
        mimeType: 'stylesheet',
        copy: false
      }],
      '**/register.build': [{
        href: './styles/wt.vendor-' + vendorBuildConfig.styles.version + '.min.css',
        mimeType: 'stylesheet',
        copy: false
      }, {
        href: './styles/wt.framework-' + baseBuildConfig.styles.version + '.min.css',
        mimeType: 'stylesheet',
        copy: false
      }
      //  {
      //  href: './styles/register.min.css',
      //  mimeType: 'stylesheet',
      //  copy: false
      //}
      ],
      '**/resetPassword.build': [{
        href: './styles/wt.vendor-' + vendorBuildConfig.styles.version + '.min.css',
        mimeType: 'stylesheet',
        copy: false
      }, {
        href: './styles/wt.framework-' + baseBuildConfig.styles.version + '.min.css',
        mimeType: 'stylesheet',
        copy: false
      }, {
        href: './styles/login.min.css',
        mimeType: 'stylesheet',
        copy: false
      }]
      ,'**/updateUserInfo.build': [{
        href: './styles/wt.vendor-' + vendorBuildConfig.styles.version + '.min.css',
        mimeType: 'stylesheet',
        copy: false
      }, {
        href: './styles/wt.framework-' + baseBuildConfig.styles.version + '.min.css',
        mimeType: 'stylesheet',
        copy: false
      //}, {
      //  href: './styles/updateUserInfo.min.css',
      //  mimeType: 'stylesheet',
      //  copy: false
      }
      ]
    }
  },

  copy: {
    scripts: {
      src: [
        './src/vendor/build/scripts/*.min.js',
        './src/base/build/scripts/*.min.js',
        './src/apps/backend/packages/dist/scripts/*.min.js',
        './src/apps/backend/dist/scripts/*.min.js',
        './src/vendor/scripts/echarts/build/echarts-all.js',
        vendorBuildConfig.scripts.echarts.sources
      ],
      pipes: {
        '**/echarts-all.js': gulpPlugins.rename(function(file) {
          // file.basename = file.basename.substring(0, file.basename.lastIndexOf('.')) + '.min';
          var echartsConf = vendorBuildConfig.scripts.echarts;
          file.basename = echartsConf.name + '-' + echartsConf.version + '.min';
        })
      },
      dest: './www/backend/scripts'
    },
    styles: {
      src: [
        './src/vendor/build/styles/*.min.css',
        './src/base/build/styles/*.min.css',
        './src/apps/backend/packages/dist/styles/*.min.css',
        './src/apps/backend/dist/styles/*.min.css'
      ],
      pipes: {},
      dest: './www/backend/styles'
    },
    images: {
      src: [
        './src/apps/backend/images/**/*.*'
      ],
      pipes: {},
      dest: './www/backend/images'
    }
  }

};

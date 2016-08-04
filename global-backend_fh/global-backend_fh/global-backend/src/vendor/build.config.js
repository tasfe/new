module.exports = {

  "dest": "src/vendor/build",

  "scripts": {
    "core": {
      "version": "0.1.0",
      "name": "wt.vendor-core",
      "sources": [
        "src/vendor/scripts/jquery-2.1.4.min.js",
        "src/vendor/scripts/jquery-ui-1.11.3.js",
        "src/vendor/scripts/bootstrap-3.3.2.js",
        "src/vendor/scripts/underscore-1.8.2.js",
        "src/vendor/scripts/underscore.string.js",
        "src/vendor/scripts/backbone-1.1.2.js",
        "src/vendor/scripts/modernizr-2.6.2.min.js"
      ]
    },
    "ext": {
      "version": "0.1.0",
      "name": "wt.vendor-ext",
      "sources": [
        //"src/vendor/scripts/select2.min.js",
        "src/vendor/scripts/jquery.slimscroll.js",
        "src/vendor/scripts/jquery.jgrowl-1.4.2.js",
        "src/vendor/scripts/parsley/validator/comparison.js",
        "src/vendor/scripts/parsley-2.0.6.js",
        "src/vendor/scripts/parsley/zh_cn.js",
        "src/vendor/scripts/parsley/zh_cn.extra.js",
        "src/vendor/scripts/parsley/validateConfig.js",
        //"src/vendor/scripts/jquery.tagsinput.min.js",
        "src/vendor/scripts/jquery.steps.js",
        "src/vendor/scripts/howler.js",
        "src/vendor/scripts/jquery.fileupload-5.42.3.js",
        "src/vendor/scripts/jquery.autocomplete-1.2.16.js",
        //"src/vendor/scripts/jquery.qrcode.js",
        //"src/vendor/scripts/qrcode.js",
        "src/vendor/scripts/moment.js",
        "src/vendor/scripts/moment.zh-cn.js",
        "src/vendor/scripts/bootstrap-datetimepicker.js",
        //"src/vendor/scripts/dropzone.js",
        "src/vendor/scripts/ZeroClipboard.js",
        "src/vendor/scripts/jquery.ajaxfileupload.js",
        "src/vendor/scripts/wangEditor-1.3.9.js",
        //"src/vendor/scripts/plupload.full.min.js",
        "src/vendor/scripts/jquery.fancytree-all.js",

        //extends
        "src/vendor/scripts/rainyday.js",
        "src/vendor/scripts/nprogress.js",

        "src/vendor/scripts/md5.js",
        "src/vendor/scripts/sha512.js"
      ]
    },
    "echarts": {
      "version": "2.2.1",
      "name": "wt.vendor-echarts",
      "sources": "./src/vendor/scripts/echarts/build/echarts-all.js"
    },
    "dest": "src/vendor/build/scripts"
  },

  "styles": {
    "version": "0.1.2",
    "name": "wt.vendor",
    "sources": [
      "src/vendor/styles/normalize-3.0.2.css",
      "src/vendor/styles/jquery-ui-1.11.3.css",
      "src/vendor/styles/jquery-ui.structure-1.11.3.css",
      "src/vendor/styles/jquery-ui.theme-1.11.3.css",
      "src/vendor/styles/bootstrap-3.3.2.css",
      "src/vendor/styles/font-awesome-4.2.0.css",
      "src/vendor/styles/ionicons-2.0.0.css",
      "src/vendor/styles/animate.css",
      //"src/vendor/styles/select2-3.4.8.css",
      "src/vendor/styles/jquery.jgrowl-1.4.2.css",
      "src/vendor/styles/bootstrap-datetimepicker.css",
      "src/vendor/styles/jquery.tagsinput.css",
      "src/vendor/styles/jquery.fileupload-5.42.3.css",
      "src/vendor/styles/jquery.autocomplete.css",
      "src/vendor/styles/parsley-2.0.6.css",
      "src/vendor/styles/wangEditor-1.3.9.css",
      "src/vendor/styles/ui.fancytree.css",
      "src/vendor/styles/nprogress.css"
      //"src/vendor/styles/dropzone.basic.css",
      //"src/vendor/styles/dropzone.css"
    ],
    "dest": "src/vendor/build/styles"
  }

};
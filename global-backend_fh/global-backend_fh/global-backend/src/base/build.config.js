module.exports = {

  "dest": "src/base/build",

  "closureStart": "(function (window) {\n",

  "closureEnd": "\nwindow.Base=Base;\n})(window);",

  "scripts": {
    "framework": {
      "version": "0.1.0",
      "name": "wt.framework",
      "sources": [
        "src/base/scripts/base.js",
        "src/base/scripts/under-helper.js",
        "src/base/scripts/utils.js",
        "src/base/scripts/triggerMehtod.js",
        "src/base/scripts/domRefresh.js",
        "src/base/scripts/entityEvents.js",
        "src/base/scripts/logger.js",
        "src/base/scripts/storage.js",
        "src/base/scripts/error.js",
        "src/base/scripts/callbacks.js",
        "src/base/scripts/controller.js",
        "src/base/scripts/baseObject.js",
        "src/base/scripts/region.js",
        "src/base/scripts/regionManager.js",
        "src/base/scripts/mediator.js",
        "src/base/scripts/mediator-permissions.js",
        "src/base/scripts/mediator-facade.js",
        "src/base/scripts/view.js",
        "src/base/scripts/view-item.js",
        "src/base/scripts/view-layout.js",
        "src/base/scripts/view-prefab.js",
        "src/base/scripts/appRouter.js",
        "src/base/scripts/application.js",
        "src/base/scripts/module.js"
      ]
    },
    "dest": "src/base/build/scripts"
  },

  "styles": {
    "version": "0.1.15",
    "name": "wt.framework",
    "sources": "src/base/styles",
    "dest": "src/base/build/styles"
  }

};
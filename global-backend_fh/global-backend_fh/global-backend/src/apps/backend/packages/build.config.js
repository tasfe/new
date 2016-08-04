module.exports = {

  "dest": "src/apps/backend/packages/dist",

  "scripts": {
    "version": "0.1.0",
    "sources": [
      "src/apps/backend/packages/scripts/login.js",
      "src/apps/backend/packages/scripts/resetPassword.js",
      "src/apps/backend/packages/scripts/updateUserInfo.js"
    ]
  },

  "styles": {
    "version": "0.1.0",
    "sources": "src/apps/backend/packages/styles/*.scss",
    "cssFolder": "src/apps/backend/packages/dist/styles",
    "sassFolder": "src/apps/backend/packages/styles"
  }

};
/**
 * Created by ABCD on 2015/11/18.
 */

var MD5 = require('vendor/scripts/md5');
var SHA512 = require('vendor/scripts/sha512');

var Encryption = Base.PrefabView.extend({

  initialize: function () {
  },
  render: function () {
    return this;
  },

  encrypt: function (password, salt) {
    return SHA512.hex_sha512(MD5.hex_md5(password + '') + '' + salt);
  },

  encryptSha: function (data){
    return SHA512.hex_sha512(data+'');
  }
});

module.exports = Encryption;
define(function(require, exports, module) {

  var AudioModule = Base.Module.extend({

    startWithParent: false,

    _audioList: [],

    playing : false,

    add: function(audioList) {
      this._audioList = this._audioList.concat(audioList);

      if (!this.playing) {
        this.playing = true;
        this._playAll();
      }
    },

    _playAll: function() {
      var self = this;
      new Howl({
        urls: ['./assets/audio/' + this._audioList.pop()],
        onend: function() {
          if (!_.isEmpty(self._audioList)) {
            self._playAll(self._audioList);
          } else {
            self.playing = false;
          }
        }
      }).play();
    }
  });

  module.exports = AudioModule;
});

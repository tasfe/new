Base.Mediator = (function() {
  var channels = {};

  var prevPublish = {};

  var mediator = {};

  mediator.subscribe = function(channel, subscription, options) {
    if (!channels[channel]) channels[channel] = [];
    channels[channel].push(subscription);

    if (options.init && prevPublish[channel]) {
      subscription.apply(this, prevPublish[channel]);
    }
  };

  mediator.unSubscribe = function(channel, subscription) {
    channels[channel] = _(channels[channel]).without(subscription);
  };

  mediator.publish = function(channel) {
    if (!channels[channel]) channels[channel] = [];

    var args = [].slice.call(arguments, 1);

    prevPublish[channel] = args;

    for (var i = 0, l = channels[channel].length; i < l; i++) {
      channels[channel][i].apply(this, args);
    }
  };

  return mediator;
} ());

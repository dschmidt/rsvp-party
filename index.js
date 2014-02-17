var RSVP = require('rsvp');
var Promise = RSVP.Promise;

Promise.prototype.returns = function(value) {
  return this.then(function() {
    return value;
  });
};

Promise.prototype.invoke = function(method) {
  var args = Array.prototype.slice(arguments, 1);

  return this.then(function(value) {
    return value[method].apply(value, args);
  }, undefined, 'invoke: ' + method + ' with: ' + args);
};


Promise.prototype.map = function(mapFn) {
  return this.then(function(values) {
    return RSVP.map(values, mapFn);
  });
};

Promise.prototype.filter = function(mapFn) {
  return this.then(function(values) {
    return RSVP.filter(values, mapFn);
  });
};

Promise.prototype.guard = function(test) {
  var guarded = this['finally'](function(){
    if (!test()) {
      guarded._subscribers = 0;
    }
  });

  return guarded;
};

RSVP.configure('get', function(obj, property) {
  return obj[property];
});

Promise.prototype.get = function(property) {
  return this.then(function(obj) {
    return RSVP.configure('get')(obj, property);
  });
};

RSVP.configure('set', function(obj, property, value) {
  obj[property] = value;

  return value;
});

Promise.prototype.set = function(property, value) {
  return this.then(function(obj) {
    return RSVP.configure('set')(obj, property, value);
  });
};


var RSVP = require('rsvp');
var Promise = RSVP.Promise;

Promise.prototype.returns = function(value) {
  return this.then(function() {
    return value;
  });
};

Promise.prototype.tap = function(method) {
  return this.then(function(value){
    method(value);
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

if (RSVP.configure('get') === undefined) {
  RSVP.configure('get', function(obj, property) {
    return obj[property];
  });
}

Promise.prototype.get = function(property) {
  return this.then(function(obj) {
    return RSVP.configure('get')(obj, property);
  });
};

if (RSVP.configure('set') === undefined) {
  RSVP.configure('set', function(obj, property, value) {
    obj[property] = value;

    return value;
  });
}

Promise.prototype.set = function(property, value) {
  return this.then(function(obj) {
    return RSVP.configure('set')(obj, property, value);
  });
};

Promise.sequence = function(tasks) {
  var length = tasks.length;
  var current = Promise.resolve();
  var results = new Array(length);

  for (var i = 0; i < length; ++i) {
    current = results[i] = current.then(tasks[i]);
  }

  return Promise.all(results);
};

define(
  ["./rsvp-party/promise","./rsvp-party/rsvp","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Promise = __dependency1__["default"] || __dependency1__;
    var RSVP = __dependency2__["default"] || __dependency2__;

    var Party = {
      Promise: Promise,
      RSVP: RSVP
    };

    __exports__.Party = Party;
  });
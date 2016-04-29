var gdbListener = require('./gdbListener');


var gdbListenerImpl = function() {
  gdbListener.gdbListener.call(this); // inherit default Listener
  return this;
};

// inherit default Listener
gdbListenerImpl.prototype = Object.create(gdbListener.gdbListener.prototype);
gdbListenerImpl.prototype.constructor = gdbListenerImpl;


// override default Listener behavior
gdbListenerImpl.prototype.enterProg = function(ctx) {
  //console.log('entered prog rule');
};

// launch it into space!
exports.gdbListener = gdbListenerImpl;

'use strict';


var spawn = require('child_process').spawn;
var events = require('events');


function gdbExec(gdbOptions) {
  var me = this;  // alias
    
  //----------------------------------------------------------------------------
  // 
  // this is an event emitter
  // 
  //----------------------------------------------------------------------------
  events.EventEmitter.call(me);
  Object.setPrototypeOf(gdbExec.prototype, events.EventEmitter.prototype);
  
  
  //----------------------------------------------------------------------------
  // 
  // parse options
  // 
  //----------------------------------------------------------------------------
  
  // program name and gdb-gdbserver connection params
  gdbOptions = gdbOptions || {};
  var programName = gdbOptions.programName;
  var programArgs = gdbOptions.programArgs || [];
  var comm = gdbOptions.comm;
  
  
  //----------------------------------------------------------------------------
  // 
  // gdbserver and gdb variables
  // 
  //----------------------------------------------------------------------------  
  var gdb = undefined;              // child processes
  var gdbserver = undefined;
  
  
  //----------------------------------------------------------------------------
  // 
  // write
  // 
  //----------------------------------------------------------------------------
  gdbExec.prototype.appStdinWrite = function(data) {
    if (gdbserver) gdbserver.stdin.write(data);
  };
  gdbExec.prototype.write = function(data) {
    if (gdb) {
      gdb.stdin.write(data);
    }
  };
  
  
  //----------------------------------------------------------------------------
  // 
  // ready event
  // 
  //----------------------------------------------------------------------------
  var ready = false;
  var readyCallbackQueue = [];
  
  function _readyHandler() {
    ready = true;
    while (readyCallbackQueue.length>0) {
      var callback = readyCallbackQueue.shift();
      callback();
    }
  }
  
  gdbExec.prototype.ready = function(callback) {
    if (ready) callback();
    else readyCallbackQueue.push(callback);
  };
  
  
  //----------------------------------------------------------------------------
  // 
  // kill
  // 
  //----------------------------------------------------------------------------
  var killed = false;
  gdbExec.prototype.kill = function() {
    if (!killed) {
      killed = true;
      // kill server and debugger
      if (gdbserver) gdbserver.kill();
      if (gdb) gdb.kill();
      // unreference 
      gdbserver = undefined;
      gdb = undefined;
      // broadcast death!
      //console.log("GDB KILLED!");
      me.emit('gdb-killed');
    }
  };
  
  
  //----------------------------------------------------------------------------
  // 
  // start gdbserver, then gdb
  // 
  //----------------------------------------------------------------------------

  var gdbServerArgs = [comm, programName].concat(programArgs);
  gdbserver = spawn('gdbserver', gdbServerArgs);
  gdbserver.on('close', function(code) {
    //console.log('gdbserver exited with code '+code);
    me.kill();
  });
  gdbserver.stdout.on("data", function(data) {
    //console.log("app-out "+data);
    me.emit("app-out", data);
  });
  gdbserver.stderr.on("data", function(data) {
    //console.log("app-err "+data);
    me.emit("app-err", data);
  });

  gdb = spawn('gdb', [ '-i', 'mi' ]);
  gdb.on('close', function(code) {
    //console.log('gdb exited with code '+code);
    me.kill();
  });
  gdb.stdout.on("data", function(data) {
    //console.log("gdb-out "+data);
    me.emit("gdb-out", data);
  });
  gdb.stderr.on("data", function(data) {
    //console.log("gdb-err "+data);
    me.emit("gdb-err", data);
  });

  // we can call this now
  _readyHandler();
  
}


exports.gdbExec = gdbExec;
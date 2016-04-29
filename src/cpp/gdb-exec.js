'use strict';


var events = require('events');


function gdbExec(lxcOptions, gdbOptions) {
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
  
  // lxc stuff
  var boxName = lxcOptions.boxName;
  var lxcService = lxcOptions.lxcService;
  
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
  var gdb = undefined;              // io streams
  var gdbserver = undefined;
  
  var gdbserverClient = undefined;  // ssh clients
  var gdbClient = undefined;
  
  
  //----------------------------------------------------------------------------
  // 
  // write
  // 
  //----------------------------------------------------------------------------
  gdbExec.prototype.appStdinWrite = function(data) {
    if (gdbserver) gdbserver.write(data);
  };
  gdbExec.prototype.write = function(data) {
    if (gdb) gdb.write(data);
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
      if (gdbserver) gdbserver.end();
      if (gdb) gdb.end();
      if (gdbserverClient) gdbserverClient.end();
      if (gdbClient) gdbClient.end();
      // unreference 
      gdbserver = undefined;
      gdb = undefined;
      gdbserverClient = undefined;
      gdbClient = undefined;
      // broadcast death!
      console.log("GDB KILLED!");
      me.emit('gdb-killed');
    }
  };
  
  
  //----------------------------------------------------------------------------
  // 
  // start gdbserver, then gdb
  // 
  //----------------------------------------------------------------------------
  var pty = { pty: {term:'xterm'} };
  lxcService.connect(function(client) {
    gdbserverClient = client;
    var suCmd = "'cd ~; "+['gdbserver', comm, programName].concat(programArgs).join(' ')+"'";
    var cmd = ['lxc-attach', '-n', boxName, '--', 'su', '-c', suCmd, lxcService.user].join(' ');
    console.log("GDBSERVER COMMAND "+cmd);
    client.exec(cmd, pty, function(error, stream) {
      if (error) throw error;
      
      gdbserver = stream;
      stream.on('close', function(code, signal) {
        console.log('gdbserver exited with code '+code+' signal '+signal);
        me.kill();
      });
      
      // hook into events
      stream.on("data", function(data) {
        console.log("app-out "+data);
        me.emit("app-out", data);
      });
      stream.stderr.on("data", function(data) {
        console.log("app-err "+data);
        me.emit("app-err", data);
      });
      
      // and start gdb
      lxcService.connect(function(client) {
        gdbClient = client;
        var suCmd = "'cd ~; "+['gdb', '-i', 'mi'].join(' ')+"'";
        var cmd = ['lxc-attach', '-n', boxName, '--', 'su', '-c', suCmd, lxcService.user].join(' ');
        console.log("GDB COMMAND "+cmd);
        client.exec(cmd, false, function(error, stream) {
          if (error) throw error;
          
          gdb = stream;
          stream.on('close', function(code, signal) {
            console.log('gdb exited with code '+code+' signal '+signal);
            me.kill();
          });
          
          stream.on("data", function(data) {
            console.log("gdb-out "+data);
            me.emit("gdb-out", data);
          });
          stream.stderr.on("data", function(data) {
            console.log("gdb-err "+data);
            me.emit("gdb-err", data);
          });
          
          // we can call this now
          _readyHandler();
        });
      });
      
    });
  });
  
}


module.exports = gdbExec;
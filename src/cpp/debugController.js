var gpp = require('./gpp').gpp;
var gdbMI = require('./gdb').gdb;


function debugController(gdbVisitor) {
  
  var me = this;
  me.gdb = undefined;
  
  var sourceFile = undefined;
  var programName = "a.out";
  var programArgs = undefined;
  
  //----------------------------------------------------------------------------
  // 
  // commands
  // 
  //----------------------------------------------------------------------------
  me.gdbStop = function() {
    //console.log('gdb-stop ');
    me.gdb.stop(function(data) {
      //console.log("GDB stopped "+JSON.stringify(data));
    });
  };
  me.gdbPause = function() {
    //console.log('gdb-pause ');
    me.gdb.pause(function(data) {
      //console.log("GDB paused "+JSON.stringify(data));
    });
  };
  me.gdbContinue = function() {
    //console.log('gdb-continue ');
    me.gdb.continue(function(data) {
      //console.log("GDB continuing "+JSON.stringify(data));
    });
  };
  me.gdbStepOver = function() {
    //console.log('gdb-step-over ');
    me.gdb.stepOver([], function(data) {
      //console.log("GDB stepped over "+JSON.stringify(data));
    });
  };
  me.gdbStepInto = function() {
    //console.log('gdb-step-into ');
    me.gdb.stepInto([], function(data) {
      //console.log("GDB stepped into "+JSON.stringify(data));
    });
  };
  me.gdbStepOut = function() {
    //console.log('gdb-step-out ');
    me.gdb.stepOut([], function(data) {
      //console.log("GDB stepped out "+JSON.stringify(data));
    });
  };
  me.gdbListVariables = function() {
    me.gdb.listVariables(['--simple-values'], function(varsData) {
      //gdbVisitor.gdbLog(JSON.stringify(varsData));
    });
  };
  me.gdbSetVarValue = function(varName, varValue) {
    //console.log('gdb-set-var-value '+varName+' '+varValue);
    me.gdb.setVariableValue(varName, varValue, function(data) {
      //console.log("VAR SET RESULT "+JSON.stringify(data));
      // send var list down the socket anyway?
    });
  };
  me.gdbSetSelectedFrame = function() {
    //console.log('gdb-set-selected-frame ');
  };
  me.gdbEvalExpression = function() {
    //console.log('gdb-eval-expression ');
  };
  
  me.gdbInsertBreak = function(line) {
    var breakpoint = sourceFile+':'+line;
    me.gdb.insertBreakpoint([breakpoint], function(data) {
      gdbVisitor.gdbLog('breakpoint inserted at line '+line);
    });
  };
  me.gdbDeleteBreak = function(line) {
    var breakpoint = sourceFile+':'+line;
    me.gdb.deleteBreakpoints([breakpoint], function(data) {
      gdbVisitor.gdbLog('breakpoint removed from line '+line);
    });
    //console.log('gdb-delete-break ');
  };
  me.gdbEnableBreak = function() {
    //console.log('gdb-enable-break ');
  };
  me.gdbDisableBreak = function() {
    //console.log('gdb-disable-break ');
  };
  me.gdbAppIn = function(data) {
    //console.log('gdb-app-in '+data);
    me.gdb.appStdinWrite(data);
  };
  /*
  function _addSocketListeners() {
    socket.on('gdb-stop', _gdbStopHandler);
    socket.on('gdb-pause', _gdbPauseHandler);
    socket.on('gdb-continue', _gdbContinueHandler);
    socket.on('gdb-step-over', _gdbStepOverHandler);
    socket.on('gdb-step-into', _gdbStepIntoHandler);
    socket.on('gdb-step-out', _gdbStepOutHandler);
    socket.on('gdb-set-var-value', _gdbSetVarValueHandler);
    socket.on('gdb-set-selected-frame', _gdbSetSelectedFrameHandler);
    socket.on('gdb-eval-expression', _gdbEvalExpressionHandler);
    socket.on('gdb-insert-break', _gdbInsertBreakHandler);
    socket.on('gdb-delete-break', _gdbDeleteBreakHandler);
    socket.on('gdb-enable-break', _gdbEnableBreakHandler);
    socket.on('gdb-disable-break', _gdbDisableBreakHandler);
    socket.on('gdb-app-in', _gdbAppInHandler);
  }
  function _removeSocketListeners() {
    socket.removeListener('gdb-stop', _gdbStopHandler);
    socket.removeListener('gdb-pause', _gdbPauseHandler);
    socket.removeListener('gdb-continue', _gdbContinueHandler);
    socket.removeListener('gdb-step-over', _gdbStepOverHandler);
    socket.removeListener('gdb-step-into', _gdbStepIntoHandler);
    socket.removeListener('gdb-step-out', _gdbStepOutHandler);
    socket.removeListener('gdb-set-var-value', _gdbSetVarValueHandler);
    socket.removeListener('gdb-set-selected-frame', _gdbSetSelectedFrameHandler);
    socket.removeListener('gdb-eval-expression', _gdbEvalExpressionHandler);
    socket.removeListener('gdb-insert-break', _gdbInsertBreakHandler);
    socket.removeListener('gdb-delete-break', _gdbDeleteBreakHandler);
    socket.removeListener('gdb-enable-break', _gdbEnableBreakHandler);
    socket.removeListener('gdb-disable-break', _gdbDisableBreakHandler);
    socket.removeListener('gdb-app-in', _gdbAppInHandler);
  }
  */
  //----------------------------------------------------------------------------
  // 
  // gdb event handling
  // 
  //----------------------------------------------------------------------------
  function _gdbAppOutHandler(data) {
    //console.log('app-out '+data.toString());
    gdbVisitor.appOutput(data.toString());
  }
  function _gdbAppErrHandler(data) {
    //console.log('app-err '+data);
    //gdbVisitor.emit('gdb-app-err', data.toString());
  }
  function _gdbEventHandler(data) {
    //console.log('gdb-out '+data);
    gdbVisitor.gdbOutput(data.result);
  }
  function _gdbOutHandler(data) {
    //console.log('gdb-out '+data);
    //gdbVisitor.gdbOutput(data.toString());
  }
  function _gdbErrHandler(data) {
    //console.log('gdb-err '+data);
    gdbVisitor.gdbError(data.toString());
  }
  function _gdbKilledHandler() {
    //gdbVisitor.emit('gdb-killed');
  }
  function _gdbExecStateChangeHandler(data) {
    gdbVisitor.gdbLog("debugger "+data.class);
    //console.log('gdb-exec-state-change '+data.class);
    //gdbVisitor.emit('gdb-exec-state-change', data.class);
    // try to list variables
    //if (data.class=='stopped') {
      //me.gdb.listVariables(['--simple-values'], function(varsData) {
        //console.log("list variables "+JSON.stringify(varsData));
        //gdbVisitor.emit('gdb-list-variables', varsData);
      //});
      
      //me.gdb.callStack([], function(varsData) {
        //console.log("frame stack "+JSON.stringify(varsData));
        //gdbVisitor.emit('gdb-frame-stack', varsData);
      //});
      
      // handle breakpoint hit
      // *stopped,reason="breakpoint-hit",disp="keep",bkptno="1",
      // frame={ addr="0x000000000040093e",func="main",args=[],
      //         file="workspace/main.cc",fullname="/root/workspace/main.cc",line="6" },
      // thread-id="1",stopped-threads=["1"],core="3"
      
      // handle step over
      // *stopped,reason="end-stepping-range",line="8",file="hello.c"
      
      // handle step into
      // *stopped,reason="end-stepping-range", 
      // frame={ func="foo",args=[{name="a",value="10"}, {name="b",value="0"}],
      //         file="recursive2.c", fullname="/home/foo/bar/recursive2.c",line="11" }
      
      // handle step out
      // *stopped,reason="function-finished",
      // frame={ func="main",args=[],
      //         file="hello.c",fullname="/home/foo/bar/hello.c",line="7" }
      
      //console.log("DAAATAA STATE CHANGEEEE "+JSON.stringify(data));
      //var filePath = undefined;
      //var line = undefined;
      
      // we can make this more general, right? ie. if (data.result.frame) { ... } else { ... }
      //var reason = data.result.reason;
      //if (reason == "breakpoint-hit") {
        // ht a breakpoint
        //filePath = data.result.frame.file;
        //line = data.result.frame.line;
      //} else if (reason == "end-stepping-range") {
        //if (data.result.frame) {
          // step into
          //filePath = data.result.frame.file;
          //line = data.result.frame.line;
        //} else {
          // step over
          //filePath = data.result.file;
          //line = data.result.line;
        //}
      //} else if (reason == "function-finished") {
        //filePath = data.result.frame.file;
        //line = data.result.frame.line;
      //}
      
      // signal stopped at line if appropriate
      //if (filePath && line) {
        // step out of anything that is not in the main.cc file
        //if (filePath != 'workspace/main.cc') {
          //me.gdb.stepOut([]);
        //} else {
          //gdbVisitor.emit('gdb-stopped-at', filePath, line);
        //}
      //}
    //}
  }
  function _gdbDebugStateChangeHandler(data) {
    gdbVisitor.gdbLog("debugger "+data);
    // reset if gdb finished
    if (data=='idle') {
      _removeGdbListeners();
      me.gdb.reset();
    }
  }

  function _addGdbListeners() {
    me.gdb.on('app-out', _gdbAppOutHandler);
    me.gdb.on('app-err', _gdbAppErrHandler);
    me.gdb.on('gdb-event', _gdbEventHandler);
    me.gdb.on('gdb-out', _gdbOutHandler);
    me.gdb.on('gdb-err', _gdbErrHandler);
    me.gdb.on('gdb-killed', _gdbKilledHandler);
    me.gdb.on('gdb-exec-state-change', _gdbExecStateChangeHandler);
    me.gdb.on('gdb-debug-state-change', _gdbDebugStateChangeHandler);
  }
  function _removeGdbListeners() {
    me.gdb.removeListener('app-out', _gdbAppOutHandler);
    me.gdb.removeListener('app-err', _gdbAppErrHandler);
    me.gdb.removeListener('gdb-event', _gdbEventHandler);
    me.gdb.removeListener('gdb-out', _gdbOutHandler);
    me.gdb.removeListener('gdb-err', _gdbErrHandler);
    me.gdb.removeListener('gdb-killed', _gdbKilledHandler);
    me.gdb.removeListener('gdb-exec-state-change', _gdbExecStateChangeHandler);
    me.gdb.removeListener('gdb-debug-state-change', _gdbDebugStateChangeHandler);
  }

  me.gdb = new gdbMI();
  //me.breaks = [];

  me.gdbRun = function(config) {//config, breakpoints) {
    //console.log('gdb-run ');
    
    sourceFile = config.sourceFile;
    programArgs = config.programArgs;

    //--------------------------------------------------------------------------
    // compile program
    //--------------------------------------------------------------------------
    gpp(sourceFile, function(error, stdout, stderr) {

      // compilation error: stop everything
      if (stderr !== null && stderr !== "") {
        var msg = "compilation error: "+stderr;
        gdbVisitor.gdbLog(msg);
        return;
      }
      gdbVisitor.gdbLog(sourceFile+" compiled successfully");

      //------------------------------------------------------------------------
      // load debug session
      //------------------------------------------------------------------------
      me.gdb.load(programName, programArgs, function(data) {
        _addGdbListeners();
        gdbVisitor.gdbLog("debugging "+sourceFile);
      });
    });
  }
  
};


exports.debugController = debugController;


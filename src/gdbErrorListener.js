var ErrorListener = require('antlr4/error/ErrorListener').ErrorListener;


function gdbErrorListener() {
  ErrorListener.call(this);
  return this;
}

gdbErrorListener.prototype = Object.create(ErrorListener.prototype);
gdbErrorListener.prototype.constructor = gdbErrorListener;

gdbErrorListener.prototype.syntaxError = function(recognizer, offendingSymbol, line, column, msg, e) {
  throw {
    type: "syntaxError", 
    recognizer: recognizer,
    offendingSymbol: offendingSymbol, 
    line: line,
    column: column, 
    msg: msg, 
    e: e
  };
};

gdbErrorListener.prototype.reportAmbiguity = function(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs) {
  throw {
    type: "ambiguity",
    recognizer: recognizer,
    dfa: dfa, 
    startIndex: startIndex,
    stopIndex: stopIndex,
    exact: exact,
    ambigAlts: ambigAlts,
    configs: configs
  };
};

gdbErrorListener.prototype.reportAttemptingFullContext = function(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {
  throw {
    type: "attemptingFullContext",
    recognizer: recognizer,
    dfa: dfa, 
    startIndex: startIndex,
    stopIndex: stopIndex,
    conflictingAlts: conflictingAlts, 
    configs: configs
  };
};

gdbErrorListener.prototype.reportContextSensitivity = function(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
  throw {
    type: "contextSensitivity",
    recognizer: recognizer,
    dfa: dfa, 
    startIndex: startIndex,
    stopIndex: stopIndex,
    prediction: prediction,
    configs: configs
  };
};



exports.gdbErrorListener = gdbErrorListener;



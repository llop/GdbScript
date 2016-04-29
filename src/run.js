// requires
var fs = require('fs');

var antlr4 = require('antlr4/index');
var Token = require('antlr4/Token').Token;

var gdbLexer = require('./gdbLexer').gdbLexer;
var gdbParser = require('./gdbParser').gdbParser;
var gdbListener = require('./gdbListenerImpl').gdbListener;
var gdbVisitorImpl = require('./gdbVisitorImpl').gdbVisitor;
var gdbErrorListener = require('./gdbErrorListener').gdbErrorListener;

/*

// read asl input from file
var input = fs.readFileSync("../examples/input.asl", { encoding: 'utf-8' });
var chars = new antlr4.InputStream(input);

// 
var lexer = new gdbLexer(chars);
var tokens  = new antlr4.CommonTokenStream(lexer);
var parser = new gdbParser(tokens);
parser.buildParseTrees = true;
var tree = parser.prog();

// listener
//var listener = new gdbListener();
//antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);

// visitor
var gdbVisitor = new gdbVisitorImpl();
gdbVisitor.visitProg(tree);

*/



// interactive gig
// http://stackoverflow.com/questions/14864777/using-antlr-for-parsing-data-from-never-ending-stream
var gdbVisitor = new gdbVisitorImpl();
var dataBuffer = "";
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
  dataBuffer += data.toString();

  try {
    var chars = new antlr4.InputStream(dataBuffer);
    var lexer = new gdbLexer(chars);
    var tokens = new antlr4.CommonTokenStream(lexer);
    var parser = new gdbParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener(new gdbErrorListener());
    var tree = parser.prog();
    gdbVisitor.visitProg(tree);
    dataBuffer = "";
  } catch (ex) {
    if (ex.type==="syntaxError") {
      if (ex.offendingSymbol.type!==Token.EOF) {
        var line = ex.line;
        var col = ex.column+1;   // column indices are 0-based (not so in most text editors)
        var exception = "syntax error at line "+line+", column "+col+": "+ex.msg;
        throw exception;
      }
    } else if (ex.type==="executionError") {
      var line = ex.ctx.start.line;
      var col = ex.ctx.start.column+1;
      var exception = "execution error at line "+line+", column "+col+": "+ex.msg+"\n"+ex.stackTrace;
      throw exception;
    } else {
      // discard other parse errors
      if (!'type' in ex || 
        (ex.type!=="ambiguity" && ex.type!=="attemptingFullContext" && ex.type!=="contextSensitivity")) 
          throw ex;
    }
  }
});





var gdbVisitor = require('./gdbVisitor').gdbVisitor;
var gdbParser = require('./gdbParser').gdbParser;
var antlr4 = require('antlr4/index');


var gdbVisitorImpl = function() {
  gdbVisitor.call(this); // inherit default Visitor
  return this;
};


// inherit default visitor
gdbVisitorImpl.prototype = Object.create(gdbVisitor.prototype);
gdbVisitorImpl.prototype.constructor = gdbVisitorImpl;


//---------------------------------------------------------------------------------
// 
// scope in gdbScript:
// 
//   a variable that is declared inside a function 'F'...
//     ...is created and destroyed every time 'F' is executed...
//     ...so it cannot be accessed by any code 'above' the 'F'...
//     ...but it can be accessed (not overwritten!) in functions invoked by 'F'
// 
//   functions have a 'global' scope: once declared, they are accessible anywhere
// 
//---------------------------------------------------------------------------------

var stack = [{frame:'',data:{},context:null}];

function pushActivationRecord(ctx) {
  var func = 'ID' in ctx ? ctx.ID().getText() : '<anonymous function>';
  var line = ctx.start.line;

  stack.push({ frame: func+' (line '+line+')', data: {}, context: ctx });
}

function popActivationRecord() {
  stack.pop();
}

// find the variable up the activation record stack
function getObject(id, ctx) {
  for (var i=stack.length-1; i>=0; --i) 
    if (id in stack[i].data) return stack[i].data[id];
  throwException("variable does not exist", ctx);
}

// set a variable
function setObject(id, value) {
  stack[stack.length-1].data[id] = value;
}

function stackTrace() {
  var str = "<global scope>\n";
  for (var i=1; i<stack.length; ++i) {
    for (var j=0; j<i-1; ++j) str += '    ';
    str += '|__ '+stack[i].frame+'\n';
  }
  return str;
}


//---------------------------------------------------------------------------------
// 
// helper functions
// 
//---------------------------------------------------------------------------------

//---------------------------------------------------------------------------------
// object inspection (debug)
//---------------------------------------------------------------------------------
// print all enumerable properties
function ins(obj) {
  for (x in obj) console.log(x);
}
// print all enumerable properties and their value
function insf(obj) {
  for (x in obj) console.log(x+" = "+obj[x]);
}

//---------------------------------------------------------------------------------
// type checking
//---------------------------------------------------------------------------------
function isNull(obj) { return obj===null || obj===undefined; }
function isBool(obj) { return typeof obj==="boolean"; }
function isString(obj) { return typeof obj==="string"; }
function isNumber(obj) { return typeof obj==="number"; }
function isObject(obj) { return typeof obj==="object" && obj.constructor===Object; }
function isArray(obj) { return typeof obj==="object" && obj.constructor===Array; }
function isFunction(obj) { return obj instanceof antlr4.ParserRuleContext; }

function checkBool(obj, ctx) {
  if (isNull(obj) || !isBool(obj)) 
    throwException("expecting a boolean", ctx);
}
function checkString(obj, ctx) {
  if (isNull(obj) || !isString(obj)) 
    throwException("expecting a string", ctx);
}
function checkNumber(obj, ctx) {
  if (isNull(obj) || !isNumber(obj)) 
    throwException("expecting a number", ctx);
}
function checkObject(obj, ctx) {
  if (isNull(obj) || !isObject(obj)) 
    throwException("expecting an object", ctx);
}
function checkArray(obj, ctx) {
  if (isNull(obj) || !isArray(obj)) 
    throwException("expecting an array", ctx);
}
function checkFunction(obj, ctx) {
  if (isNull(obj) || !isFunction(obj)) 
    throwException("expecting a function", ctx);
}
function checkHasProperty(obj, prop, ctx) {
  if (isNull(obj) || !(prop in obj)) 
    throwException("property not present", ctx);
}
function checkCompatibleTypes(obj1, obj2, ctx) {
  if (!isNull(obj1) && !isNull(obj2) 
      && (typeof obj1!==typeof obj2 || obj1.constructor!==obj2.constructor)) 
    throwException("incompatible types in relational expression", ctx);
}
function checkArgsNumber(args, numArgs, ctx) {
  if (args.length!==numArgs)
    throwException("wrong number of arguments", ctx);   
}

function throwException(msg, ctx) {
  throw {
    type: "executionError",
    msg: msg,
    ctx: ctx,
    stackTrace: stackTrace()
  }
}


//---------------------------------------------------------------------------------
// return wrapper
//---------------------------------------------------------------------------------
var Return = function(value) {
  this.value = value;
  return this;
};


//---------------------------------------------------------------------------------
// output + prettyPrint
//---------------------------------------------------------------------------------
gdbVisitorImpl.prototype.write = function(obj) {
  process.stdout.write('>> '+obj+'\n');
};

gdbVisitorImpl.prototype.prettyPrint = function(obj) {
  if (isNull(obj) || isBool(obj) || isString(obj) || isNumber(obj)) return obj;
  else if (isObject(obj) || isArray(obj)) return JSON.stringify(obj);
  else if (isFunction(obj)) {
    var func = 'ID' in obj ? obj.ID().getText() : '<anonymous function>';
    var params = obj.params().accept(this);
    return func+'('+params.join(', ')+')';
  }
};


//---------------------------------------------------------------------------------
// 
// ANTLR3 to ANTLR4
// instead of using rewrite rules to coerce the AST into a certain structure
// you 'just' have to define the way the unmodified AST is traversed
// 
// so, override default visitor behavior
// 
//---------------------------------------------------------------------------------

// Visit a parse tree produced by gdbParser#prog.
gdbVisitorImpl.prototype.visitProg = function(ctx) {
  var chunks = ctx.progChunk();
  for (var i=0; i<chunks.length; ++i)
    chunks[i].accept(this);
};


// Visit a parse tree produced by gdbParser#ProgFunc.
gdbVisitorImpl.prototype.visitProgFunc = function(ctx) {
  var func = ctx.func();
  func.accept(this);
};


// Visit a parse tree produced by gdbParser#ProgInstr.
gdbVisitorImpl.prototype.visitProgInstr = function(ctx) {
  var blockInstructions = ctx.blockInstructions();
  blockInstructions.accept(this);
};


gdbVisitorImpl.prototype.execFunc = function(func, args, ctx) {
  pushActivationRecord(func);

  try {
    checkFunction(func, ctx);
    
    var params = func.params().accept(this);
    checkArgsNumber(params, args.length, ctx);

    // stuff arg values
    for (var i=0; i<args.length; ++i) 
      setObject(params[i], args[i]);

    // execute instructions
    var value = func.blockInstructions().accept(this);

    // return value must come from a return statement
    var ret = value instanceof Return ? value.value : null;

  } finally {
    popActivationRecord();
  }
  return ret;
};


// Visit a parse tree produced by gdbParser#func.
gdbVisitorImpl.prototype.visitFunc = function(ctx) {
  // store the function node
  setObject(ctx.ID().getText(), ctx);
  return ctx;
};


// Visit a parse tree produced by gdbParser#params.
gdbVisitorImpl.prototype.visitParams = function(ctx) {
  var paramList = ctx.paramList();
  if (paramList!==null) return paramList.accept(this);
  return [];
};


// Visit a parse tree produced by gdbParser#paramList.
gdbVisitorImpl.prototype.visitParamList = function(ctx) {
  var value = [];
  var id = ctx.ID();
  for (var i=0; i<id.length; ++i) value.push(id[i].getText());
  return value;
};

// Visit a parse tree produced by gdbParser#blockInstructions.
gdbVisitorImpl.prototype.visitBlockInstructions = function(ctx) {
  var instruction = ctx.instruction();
  for (var i=0; i<instruction.length; ++i) {
    var value = instruction[i].accept(this);

    if (value instanceof Return) return value;
  }
  return null;
};


// Visit a parse tree produced by gdbParser#ifElse.
gdbVisitorImpl.prototype.visitIfElse = function(ctx) {
  var expr = ctx.expr();
  var blockInstructions = ctx.blockInstructions();

  // check all 'if-elsif's
  for (var i=0; i<expr.length; ++i) {
    var cond = expr[i].accept(this);
    checkBool(cond, expr[i]);

    if (cond) return blockInstructions[i].accept(this);
  }

  // we got to an else: do that
  if (ctx.ELSE()!==null)
    return blockInstructions[blockInstructions.length-1].accept(this);

  return null;
};


// Visit a parse tree produced by gdbParser#AssignInstruction.
gdbVisitorImpl.prototype.visitAssignInstruction = function(ctx) {
  var id = ctx.ID().getText();
  var value = ctx.expr().accept(this);
  setObject(id, value);
  return value;
};


// Visit a parse tree produced by gdbParser#IfElseInstruction.
gdbVisitorImpl.prototype.visitIfElseInstruction = function(ctx) {
  var ifElse = ctx.ifElse();
  var value = ifElse.accept(this);
  return value;
};


// Visit a parse tree produced by gdbParser#WhileLoopInstruction.
gdbVisitorImpl.prototype.visitWhileLoopInstruction = function(ctx) {
  var expr = ctx.expr();
  var cond = expr.accept(this);
  checkBool(cond, expr);

  var value;
  while (cond) {
    value = ctx.blockInstructions().accept(this);
    
    // force return?
    if (value instanceof Return) return value;

    // eval condition for the next iteration
    cond = expr.accept(this);
    checkBool(cond, expr);
  }
  return value;
};


// Visit a parse tree produced by gdbParser#ForLoopInstruction.
gdbVisitorImpl.prototype.visitForLoopInstruction = function(ctx) {
  var expr = ctx.expr();
  var collection = expr.accept(this);
  checkArray(collection, expr);

  var value;
  var id = ctx.ID().getText();
  for (var i=0; i<collection.length; ++i) {
    setObject(id, collection[i]);
    value = ctx.blockInstructions().accept(this);
    
    // force return?
    if (value instanceof Return) return value;
  }
  return value;
};


// Visit a parse tree produced by gdbParser#FunCallInstruction.
gdbVisitorImpl.prototype.visitFunCallInstruction = function(ctx) {
  var funCall = ctx.funCall();
  return funCall.accept(this);
};


// Visit a parse tree produced by gdbParser#RetCallInstruction.
gdbVisitorImpl.prototype.visitRetCallInstruction = function(ctx) {
  if (ctx.expr()===null) return new Return(null);
  var value = ctx.expr().accept(this);
  return new Return(value);
};


// Visit a parse tree produced by gdbParser#NoInstruction.
gdbVisitorImpl.prototype.visitNoInstruction = function(ctx) {
  return null;
};


// Visit a parse tree produced by gdbParser#expr.
gdbVisitorImpl.prototype.visitExpr = function(ctx) {
  var andExpr = ctx.andExpr();

  // if it's just 1 andExpr, this could be anything (string int bool etc)
  // otherwise there's an 'or' and each andExpr should be a boolean
  var value = andExpr[0].accept(this);
  if (andExpr.length>1) {

    // make sure its a bool, and return if it was true cos this is an 'or'
    checkBool(value, andExpr[0]);
    if (value) return value;

    // evaluate the rest of the expression
    for (var i=1; i<andExpr.length; ++i) {
      var otherValue = andExpr[i].accept(this);
      checkBool(otherValue, andExpr[i]);
      value = value || otherValue;
      if (value) return value;
    }
  }
  return value;
};


// Visit a parse tree produced by gdbParser#andExpr.
gdbVisitorImpl.prototype.visitAndExpr = function(ctx) {
  var cmpExpr = ctx.cmpExpr();

  // if it's just 1 cmpExpr, this could be anything (string int bool etc)
  // otherwise there's an 'and' and each cmpExpr should be a boolean
  var value = cmpExpr[0].accept(this);
  if (cmpExpr.length>1) {
    
    // make sure its a bool, and return if it was false cos this is an 'and'
    checkBool(value, cmpExpr[0]);
    if (!value) return value;

    // evaluate the rest of the expression
    for (var i=1; i<cmpExpr.length; ++i) {
      var otherValue = cmpExpr[i].accept(this);
      checkBool(otherValue, cmpExpr[i]);
      value = value && otherValue;
      if (!value) return value;
    }
  }
  return value;
};


// Visit a parse tree produced by gdbParser#cmpExpr.
gdbVisitorImpl.prototype.visitCmpExpr = function(ctx) {
  var sumExpr = ctx.sumExpr();
  var value = sumExpr[0].accept(this);
  if (sumExpr.length>1) {

    var otherValue = sumExpr[1].accept(this);
    checkCompatibleTypes(value, otherValue, ctx);

    // perform comparison
    var type = ctx.op.type;
    if (type===gdbParser.EQUAL) value = value===otherValue;
    else if (type===gdbParser.NOT_EQUAL) value = value!==otherValue;
    else if (type===gdbParser.LT) value = value<otherValue;
    else if (type===gdbParser.LE) value = value<=otherValue;
    else if (type===gdbParser.GT) value = value>otherValue;
    else if (type===gdbParser.GE) value = value>=otherValue;
    
    // another approach: doesnt reuire the 'op' alias
    //if (ctx.EQUAL()!==null) value = value===otherValue;
    //else if (ctx.NOT_EQUAL()!==null) value = value!==otherValue;
    //else if (ctx.LT()!==null) value = value<otherValue;
    //else if (ctx.LE()!==null) value = value<=otherValue;
    //else if (ctx.GT()!==null) value = value>otherValue;
    //else if (ctx.GE()!==null) value = value>=otherValue;
  }
  return value;
};


// Visit a parse tree produced by gdbParser#sumExpr.
gdbVisitorImpl.prototype.visitSumExpr = function(ctx) {
  var prodExpr = ctx.prodExpr();
  var value = prodExpr[0].accept(this);

  if (prodExpr.length>1) {
    
    if (isNull(value) || !(isNumber(value) || isString(value) || isArray(value)))
      throwException("expecting a number or a string", prodExpr[0]);

    var operator = ctx.sumOp();
    for (var i=1; i<prodExpr.length; ++i) {

      var otherValue = prodExpr[i].accept(this);
      checkCompatibleTypes(value, otherValue);

      var op = operator[i-1].accept(this);
      var isSum = op===gdbParser.PLUS;
      
      if (isSum) {
        if (isNumber(value)) value = value+otherValue;
        else if (isString(value)) value = value.concat(otherValue);
        else if (isArray(value)) value = value.concat(otherValue);

      } else {
        
        if (!isNull(value) && isString(value))
          throwException("cannot subtract strings", prodExpr[i]);

        value = value-otherValue;
      }
    }
  }
  return value;
};


// Visit a parse tree produced by gdbParser#sumOp.
gdbVisitorImpl.prototype.visitSumOp = function(ctx) {
  if (ctx.PLUS()!==null) return gdbParser.PLUS;
  return gdbParser.MINUS;
};


// Visit a parse tree produced by gdbParser#prodExpr.
gdbVisitorImpl.prototype.visitProdExpr = function(ctx) {
  var unit = ctx.unit();
  var value = unit[0].accept(this);

  if (unit.length>1) {
    checkNumber(value, unit[0]);
    var operator = ctx.prodOp();

    for (var i=1; i<unit.length; ++i) {
      var otherValue = unit[i].accept(this);
      checkNumber(otherValue, unit[i]);

      // perform product
      var op = operator[i-1].accept(this);
      if (op===gdbParser.MUL) value = value*otherValue;
      else if (op===gdbParser.DIV) value = value/otherValue;
      else value = value%otherValue;
    }
  }
  return value;
};


// Visit a parse tree produced by gdbParser#prodOp.
gdbVisitorImpl.prototype.visitProdOp = function(ctx) {
  if (ctx.MUL()!==null) return gdbParser.MUL;
  else if (ctx.DIV()!==null) return gdbParser.DIV;
  return gdbParser.MOD;
};


// Visit a parse tree produced by gdbParser#unit.
gdbVisitorImpl.prototype.visitUnit = function(ctx) {
  var access = ctx.access();
  var value = access.accept(this);

  if (ctx.op!==null) {
    var type = ctx.op.type;
    if (type===gdbParser.NOT) {
      checkBool(value, access);
      value = !value;
    } else if (type===gdbParser.PLUS) {
      checkNumber(value, access);
    } else {
      checkNumber(value, access);
      value = -value;
    }
  }
  return value;
};



// Visit a parse tree produced by gdbParser#access.
gdbVisitorImpl.prototype.visitAccess = function(ctx) {
  // evaluate atom
  var atom = ctx.atom();
  var value = atom.accept(this);

  // evaluate sub access
  var subAccess = ctx.subAccess();
  if (subAccess.length>0) {
    for (var i=0; i<subAccess.length; ++i) {

      if (subAccess[i] instanceof gdbParser.ArrayAccessContext) {
        // array access
        checkArray(value, atom);

        // array accesses should be understood as indices
        var index = subAccess[i].accept(this);
        checkNumber(index, subAccess[i]);
        value = value[index];

      } else if (subAccess[i] instanceof gdbParser.DotAccessContext) {
        // dot access
        checkObject(value, atom);

        // the object better have the property!
        var property = subAccess[i].accept(this);
        checkHasProperty(value, property, subAccess[i]);
        value = value[property];

      } else if (subAccess[i] instanceof gdbParser.FuncAccessContext) {

        // function access
        checkFunction(value, atom);

        // get the args, invoke the function
        var args = subAccess[i].accept(this);
        value = this.execFunc(value, args, atom);
      }

    }
  }

  return value;
};


// Visit a parse tree produced by gdbParser#IdAtom.
gdbVisitorImpl.prototype.visitIdAtom = function(ctx) {
  var id = ctx.ID().getText();
  return getObject(id, ctx);
};


// Visit a parse tree produced by gdbParser#ExprAtom.
gdbVisitorImpl.prototype.visitExprAtom = function(ctx) {
  var expr = ctx.expr();
  return expr.accept(this);
};


// Visit a parse tree produced by gdbParser#IntAtom.
gdbVisitorImpl.prototype.visitIntAtom = function(ctx) {
  return Number(ctx.INT().getText());
};


// Visit a parse tree produced by gdbParser#BoolAtom.
gdbVisitorImpl.prototype.visitBoolAtom = function(ctx) {
  // true if 'TRUE' node is present
  return ctx.TRUE()!==null;
};


// Visit a parse tree produced by gdbParser#StringAtom.
gdbVisitorImpl.prototype.visitStringAtom = function(ctx) {
  var str = ctx.STRING().getText();
  str = str.substr(1, str.length-2);
  return String(str);
};


// Visit a parse tree produced by gdbParser#NilAtom.
gdbVisitorImpl.prototype.visitNullAtom = function(ctx) {
  return null;
};


// Visit a parse tree produced by gdbParser#ThisAtom.
gdbVisitorImpl.prototype.visitThisAtom = function(ctx) {
  // 'this' is a reference to the calling function
  var value = stack[stack.length-1].context;
  return value;
};


// Visit a parse tree produced by gdbParser#funcAtom.
gdbVisitorImpl.prototype.visitFuncAtom = function(ctx) {
  return ctx;
};


// Visit a parse tree produced by gdbParser#ArrayAtom.
gdbVisitorImpl.prototype.visitArrayAtom = function(ctx) {
  var exprList = ctx.exprList();
  return exprList===null ? [] : exprList.accept(this);
};


// Visit a parse tree produced by gdbParser#ObjectAtom.
gdbVisitorImpl.prototype.visitObjectAtom = function(ctx) {
  var value = {};
  var objectProp = ctx.objectProp();
  for (var i=0; i<objectProp.length; ++i) {
    var prop = objectProp[i].accept(this);
    value[prop[0]] = prop[1];
  }
  return value;
};


// Visit a parse tree produced by gdbParser#FuncAccess.
gdbVisitorImpl.prototype.visitFuncAccess = function(ctx) {
  var exprList = ctx.exprList();
  return exprList===null ? [] : exprList.accept(this);
};


// Visit a parse tree produced by gdbParser#arrayAccess.
gdbVisitorImpl.prototype.visitArrayAccess = function(ctx) {
  var expr = ctx.expr();
  return expr.accept(this);
};


// Visit a parse tree produced by gdbParser#dotAccess.
gdbVisitorImpl.prototype.visitDotAccess = function(ctx) {
  var id = ctx.ID().getText();
  return id;
};


// Visit a parse tree produced by gdbParser#expr_list.
gdbVisitorImpl.prototype.visitExprList = function(ctx) {
  var values = [];
  var expr = ctx.expr();
  for (var i=0; i<expr.length; ++i) {
    var value = expr[i].accept(this);
    values.push(value);
  }
  return values;
};


// Visit a parse tree produced by gdbParser#objectProp.
gdbVisitorImpl.prototype.visitObjectProp = function(ctx) {
  var name = ctx.ID().getText();
  var value = ctx.expr().accept(this);
  return [ name, value ];
};


// Visit a parse tree produced by gdbParser#WriteCall.
gdbVisitorImpl.prototype.visitWriteCall = function(ctx) {
  var str = "";
  var expr = ctx.expr();
  if (expr!==null) {
    var value = expr.accept(this);
    str += this.prettyPrint(value);
  }
  this.write(str);
};


// Visit a parse tree produced by gdbParser#AnonFuncCall.
gdbVisitorImpl.prototype.visitAnonFuncCall = function(ctx) {
  var exprList = ctx.exprList();
  var args = exprList===null ? [] : exprList.accept(this);
  var value = this.execFunc(ctx, args, ctx);
  return value;
};


// Visit a parse tree produced by gdbParser#UserDefinedFuncCall.
gdbVisitorImpl.prototype.visitUserDefinedFuncCall = function(ctx) {
  
  var exprList = ctx.exprList();
  var args = exprList===null ? [] : exprList.accept(this);

  var id = ctx.ID().getText();
  var func = getObject(id, ctx);
  var value = this.execFunc(func, args, ctx);
  return value;
};


// Visit a parse tree produced by gdbParser#OnDebugOutputCall.
gdbVisitorImpl.prototype.visitOnDebugOutputCall = function(ctx) {
  var expr = ctx.expr();
  var func = expr.accept(this);
  checkFunction(func);

  var params = func.params().accept(this);
  checkArgsNumber(params, 1, func);

  // tell the user it was ok
  this.write("onDebugOutput function set");
};


// Visit a parse tree produced by gdbParser#OnAppOutputCall.
gdbVisitorImpl.prototype.visitOnAppOutputCall = function(ctx) {

  this.write("onAppOutputCall function set");
};


// Visit a parse tree produced by gdbParser#OnExecStateChangeCall.
gdbVisitorImpl.prototype.visitOnExecStateChangeCall = function(ctx) {

  this.write("onExecStateChangeCall function set");
};


// Visit a parse tree produced by gdbParser#DebugCall.
gdbVisitorImpl.prototype.visitDebugCall = function(ctx) {
  this.write("starting debug session");
};


// send it into space!
exports.gdbVisitor = gdbVisitorImpl;
